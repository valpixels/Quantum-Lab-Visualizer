import { WebSocketServer, WebSocket } from "ws";
import type { IncomingMessage, Server } from "http";
import { randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import { logger } from "../lib/logger";
import { appendSurvey } from "../lib/store";

// ───────────────────────────── Types ─────────────────────────────

type Role = "teacher" | "student";

interface CircuitGate {
  id: string;
  type: string;
  qubit: number;
  step: number;
  target?: number;
}

interface TeacherState {
  currentLessonId: string | null;
  blochState: { theta: number; phi: number };
  circuitGates: CircuitGate[];
  activeView: "lessons" | "bloch" | "circuit";
}

interface QuizResult {
  score: number;
  total: number;
  attempts: number;
}

interface SurveyResponse {
  overallRating: number;
  difficulty: number;
  mostInteresting: string;
  leastClear: string;
  wouldRecommend: string;
  comments: string;
  submittedAt: number;
}

interface StudentRecord {
  studentId: string;
  name: string;
  quizzes: Record<string, QuizResult>;
  tasks: Set<string>;
  surveyDone: boolean;
}

interface Client {
  ws: WebSocket;
  role: Role;
  clientId: string;
  /** Browser-held secret id used to keep a student's progress across reconnects. */
  key: string;
  studentId: string | null;
  synced: boolean;
  name: string;
  room: Room;
}

interface Room {
  code: string;
  teacherKey: string;
  teacherState: TeacherState;
  clients: Map<string, Client>;
  students: Map<string, StudentRecord>;
  surveys: SurveyResponse[];
  idleTimer: ReturnType<typeof setTimeout> | null;
}

interface WSMessage {
  type: string;
  payload?: Record<string, unknown>;
}

// ───────────────────────────── Limits ─────────────────────────────

const MAX_ROOMS = 50;
const MAX_CLIENTS_PER_ROOM = 80;
// Idle rooms are removed after this long with nobody connected. Raise it for multi-day self-paced use.
const ROOM_IDLE_MS = (Number(process.env["ROOM_IDLE_MINUTES"]) > 0 ? Number(process.env["ROOM_IDLE_MINUTES"]) : 360) * 60 * 1000;
const MAX_NAME_LENGTH = 30;
const MAX_BROADCAST_LENGTH = 280;
const MAX_COMMENT_LENGTH = 500;
const MAX_GATES = 200;
const NUM_QUBITS = 5;
const NUM_STEPS = 12;
const MAX_MESSAGES_PER_SECOND = 100;
const MAX_PAYLOAD_BYTES = 64 * 1024;

const GATE_TYPES = new Set(["H", "X", "Y", "Z", "S", "T", "CNOT", "SWAP", "M"]);
const TWO_QUBIT_TYPES = new Set(["CNOT", "SWAP"]);
const ACTIVE_VIEWS = new Set(["lessons", "bloch", "circuit"]);
const ID_PATTERN = /^[a-z0-9-]{1,40}$/;
const KEY_PATTERN = /^[A-Za-z0-9_-]{8,64}$/;
// No 0/O/1/I so codes are easy to read from a projector.
const ROOM_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

// ───────────────────────────── Teacher PIN ─────────────────────────────

function resolveTeacherPin(): string {
  const configured = process.env["TEACHER_PIN"]?.trim();
  if (configured && configured.length >= 4) return configured;
  const generated = String(randomInt(0, 1_000_000)).padStart(6, "0");
  // Printed so the person running the server can read it; students never see the server console.
  // eslint-disable-next-line no-console
  console.log(
    `\n=============================================\n` +
      ` Quantum Lab teacher PIN: ${generated}\n` +
      ` (set the TEACHER_PIN environment variable to choose your own)\n` +
      `=============================================\n`,
  );
  return generated;
}

const TEACHER_PIN = resolveTeacherPin();

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

// ───────────────────────────── Failed-attempt throttle ─────────────────────────────

const FAIL_WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS_PER_ADDRESS = 10;
const MAX_FAILS_GLOBAL = 60;
const failsByAddress = new Map<string, number[]>();
let globalFails: number[] = [];

function recent(list: number[], now: number): number[] {
  return list.filter((t) => now - t < FAIL_WINDOW_MS);
}

function isThrottled(address: string): boolean {
  const now = Date.now();
  globalFails = recent(globalFails, now);
  const mine = recent(failsByAddress.get(address) ?? [], now);
  failsByAddress.set(address, mine);
  return mine.length >= MAX_FAILS_PER_ADDRESS || globalFails.length >= MAX_FAILS_GLOBAL;
}

function recordFailure(address: string) {
  const now = Date.now();
  globalFails.push(now);
  failsByAddress.set(address, [...recent(failsByAddress.get(address) ?? [], now), now]);
}

// ───────────────────────────── Rooms ─────────────────────────────

const rooms = new Map<string, Room>();

function newTeacherState(): TeacherState {
  return {
    currentLessonId: null,
    blochState: { theta: 0, phi: 0 },
    circuitGates: [],
    activeView: "lessons",
  };
}

function generateRoomCode(): string {
  for (let attempt = 0; attempt < 50; attempt++) {
    let code = "";
    for (let i = 0; i < 4; i++) code += ROOM_ALPHABET[randomInt(0, ROOM_ALPHABET.length)];
    if (!rooms.has(code)) return code;
  }
  throw new Error("Could not allocate a room code");
}

function createRoom(): Room {
  const room: Room = {
    code: generateRoomCode(),
    teacherKey: randomBytes(18).toString("base64url"),
    teacherState: newTeacherState(),
    clients: new Map(),
    students: new Map(),
    surveys: [],
    idleTimer: null,
  };
  rooms.set(room.code, room);
  scheduleIdleCleanup(room);
  return room;
}

function scheduleIdleCleanup(room: Room) {
  if (room.idleTimer) clearTimeout(room.idleTimer);
  room.idleTimer = setTimeout(() => {
    if (room.clients.size === 0) {
      rooms.delete(room.code);
      logger.info({ room: room.code }, "Room closed after being idle");
    }
  }, ROOM_IDLE_MS);
  room.idleTimer.unref?.();
}

function cancelIdleCleanup(room: Room) {
  if (room.idleTimer) clearTimeout(room.idleTimer);
  room.idleTimer = null;
}

function normalizeRoomCode(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const code = value.trim().toUpperCase();
  return /^[A-Z0-9]{4}$/.test(code) ? code : null;
}

// ───────────────────────────── Messaging helpers ─────────────────────────────

function send(ws: WebSocket, message: WSMessage) {
  if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(message));
}

function broadcastRoom(room: Room, message: WSMessage, filter?: (c: Client) => boolean) {
  const data = JSON.stringify(message);
  room.clients.forEach((client) => {
    if (client.ws.readyState === WebSocket.OPEN && (!filter || filter(client))) client.ws.send(data);
  });
}

function clientList(room: Room) {
  return Array.from(room.clients.values()).map((c) => ({
    clientId: c.clientId,
    studentId: c.studentId,
    role: c.role,
    synced: c.synced,
    name: c.name,
  }));
}

function progressSnapshot(room: Room) {
  return {
    students: Array.from(room.students.values()).map((s) => ({
      studentId: s.studentId,
      name: s.name,
      quizzes: s.quizzes,
      tasks: Array.from(s.tasks),
      surveyDone: s.surveyDone,
    })),
    surveys: room.surveys,
  };
}

function teacherOf(room: Room): Client | undefined {
  for (const c of room.clients.values()) if (c.role === "teacher") return c;
  return undefined;
}

function sendProgressToTeacher(room: Room) {
  const teacher = teacherOf(room);
  if (teacher) send(teacher.ws, { type: "progress_update", payload: progressSnapshot(room) as unknown as Record<string, unknown> });
}

function sendClientList(room: Room, exceptClientId?: string) {
  broadcastRoom(room, { type: "client_list_update", payload: { clients: clientList(room) } }, (c) => c.clientId !== exceptClientId);
}

// ───────────────────────────── Validation ─────────────────────────────

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function cleanText(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  // eslint-disable-next-line no-control-regex
  const text = value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim();
  if ([...text].length > maxLength) return null;
  return text;
}

function sanitizeName(value: unknown): string | null {
  const text = cleanText(value, MAX_NAME_LENGTH);
  if (!text) return null;
  return text.replace(/\s+/g, " ");
}

function intInRange(value: unknown, min: number, max: number): number | null {
  return typeof value === "number" && Number.isInteger(value) && value >= min && value <= max ? value : null;
}

function sanitizeGate(raw: unknown): CircuitGate | null {
  if (!isRecord(raw)) return null;
  const id = typeof raw.id === "string" && raw.id.length > 0 && raw.id.length <= 64 ? raw.id : null;
  const type = typeof raw.type === "string" && GATE_TYPES.has(raw.type) ? raw.type : null;
  const qubit = intInRange(raw.qubit, 0, NUM_QUBITS - 1);
  const step = intInRange(raw.step, 0, NUM_STEPS - 1);
  if (id === null || type === null || qubit === null || step === null) return null;
  const gate: CircuitGate = { id, type, qubit, step };
  if (TWO_QUBIT_TYPES.has(type) && raw.target !== undefined) {
    const target = intInRange(raw.target, 0, NUM_QUBITS - 1);
    if (target === null || target === qubit) return null;
    gate.target = target;
  }
  return gate;
}

function sanitizeTeacherUpdate(raw: unknown): Partial<TeacherState> {
  const update: Partial<TeacherState> = {};
  if (!isRecord(raw)) return update;

  if (raw.currentLessonId === null) update.currentLessonId = null;
  else if (typeof raw.currentLessonId === "string" && ID_PATTERN.test(raw.currentLessonId)) {
    update.currentLessonId = raw.currentLessonId;
  }

  if (typeof raw.activeView === "string" && ACTIVE_VIEWS.has(raw.activeView)) {
    update.activeView = raw.activeView as TeacherState["activeView"];
  }

  if (isRecord(raw.blochState)) {
    const { theta, phi } = raw.blochState;
    if (typeof theta === "number" && typeof phi === "number" && Number.isFinite(theta) && Number.isFinite(phi)) {
      const twoPi = Math.PI * 2;
      update.blochState = {
        theta: Math.min(Math.PI, Math.max(0, theta)),
        phi: ((phi % twoPi) + twoPi) % twoPi,
      };
    }
  }

  if (Array.isArray(raw.circuitGates)) {
    update.circuitGates = raw.circuitGates
      .slice(0, MAX_GATES)
      .map(sanitizeGate)
      .filter((g): g is CircuitGate => g !== null);
  }
  return update;
}

// ───────────────────────────── Progress reports ─────────────────────────────

function handleReport(client: Client, payload: unknown): boolean {
  if (client.role !== "student" || !client.studentId || !isRecord(payload)) return false;
  const record = client.room.students.get(client.key);
  if (!record) return false;

  if (payload.kind === "quiz") {
    const lessonId = typeof payload.lessonId === "string" && ID_PATTERN.test(payload.lessonId) ? payload.lessonId : null;
    const total = intInRange(payload.total, 1, 50);
    const score = total === null ? null : intInRange(payload.score, 0, total);
    if (!lessonId || total === null || score === null) return false;
    const previous = record.quizzes[lessonId];
    const better = !previous || score / total >= previous.score / previous.total;
    record.quizzes[lessonId] = {
      score: better ? score : previous.score,
      total: better ? total : previous.total,
      attempts: (previous?.attempts ?? 0) + 1,
    };
    return true;
  }

  if (payload.kind === "task") {
    const taskId = typeof payload.taskId === "string" && ID_PATTERN.test(payload.taskId) ? payload.taskId : null;
    if (!taskId) return false;
    record.tasks.add(taskId);
    return true;
  }

  if (payload.kind === "survey") {
    if (record.surveyDone || !isRecord(payload.data)) return false;
    const d = payload.data;
    const overallRating = intInRange(d.overallRating, 1, 5);
    const difficulty = intInRange(d.difficulty, 1, 5);
    const mostInteresting = typeof d.mostInteresting === "string" && (d.mostInteresting === "" || ID_PATTERN.test(d.mostInteresting)) ? d.mostInteresting : null;
    const leastClear = typeof d.leastClear === "string" && (d.leastClear === "" || ID_PATTERN.test(d.leastClear)) ? d.leastClear : null;
    const wouldRecommend = typeof d.wouldRecommend === "string" && ["", "yes", "maybe", "no"].includes(d.wouldRecommend) ? d.wouldRecommend : null;
    const comments = cleanText(d.comments ?? "", MAX_COMMENT_LENGTH);
    if (overallRating === null || difficulty === null || mostInteresting === null || leastClear === null || wouldRecommend === null || comments === null) return false;
    const response: SurveyResponse = {
      overallRating,
      difficulty,
      mostInteresting,
      leastClear,
      wouldRecommend,
      comments,
      submittedAt: Date.now(),
    };
    record.surveyDone = true;
    client.room.surveys.push(response);
    void appendSurvey({ room: client.room.code, ...response });
    return true;
  }
  return false;
}

// ───────────────────────────── Server ─────────────────────────────

export function setupWebSocketServer(server: Server) {
  const wss = new WebSocketServer({ server, path: "/ws", maxPayload: MAX_PAYLOAD_BYTES });
  const alive = new WeakMap<WebSocket, boolean>();

  // Drop connections that silently died (common on classroom Wi-Fi) so the roster stays accurate.
  const heartbeat = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (alive.get(ws) === false) {
        ws.terminate();
        return;
      }
      alive.set(ws, false);
      ws.ping();
    });
  }, 30_000);
  heartbeat.unref?.();
  wss.on("close", () => clearInterval(heartbeat));

  wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
    const clientId = randomBytes(6).toString("hex");
    const address = req.socket.remoteAddress ?? "unknown";
    let current: Client | null = null;
    let windowStart = Date.now();
    let windowCount = 0;

    alive.set(ws, true);
    ws.on("pong", () => alive.set(ws, true));
    logger.info({ clientId }, "WebSocket client connected");

    const reject = (code: string, reason: string) => {
      send(ws, { type: "join_rejected", payload: { code, reason } });
    };

    function handleJoin(raw: unknown) {
      if (current) return;
      if (!isRecord(raw)) return reject("bad_request", "Invalid join request.");

      const name = sanitizeName(raw.name);
      if (!name) return reject("bad_name", "Please enter a name (up to 30 characters).");
      const role: Role = raw.role === "teacher" ? "teacher" : "student";

      let room: Room | undefined;
      let key: string;
      let studentRecord: StudentRecord | undefined;

      if (role === "teacher") {
        key = "teacher";
        const code = normalizeRoomCode(raw.room);
        const teacherKey = typeof raw.teacherKey === "string" ? raw.teacherKey : "";

        if (code && teacherKey) {
          // Resume an existing class after a refresh or reconnect.
          if (isThrottled(address)) return reject("too_many_attempts", "Too many failed attempts. Please wait and try again.");
          room = rooms.get(code);
          if (!room) return reject("room_not_found", "That class no longer exists.");
          if (!safeEqual(room.teacherKey, teacherKey)) {
            recordFailure(address);
            return reject("bad_key", "Could not resume this class.");
          }
        } else {
          if (isThrottled(address)) return reject("too_many_attempts", "Too many failed attempts. Please wait and try again.");
          const pin = typeof raw.pin === "string" ? raw.pin.trim() : "";
          if (!pin || !safeEqual(pin, TEACHER_PIN)) {
            recordFailure(address);
            return reject("bad_pin", "Incorrect teacher PIN.");
          }
          if (rooms.size >= MAX_ROOMS) return reject("server_busy", "The server has too many active classes.");
          room = createRoom();
          logger.info({ room: room.code }, "Class created");
        }

        // A resumed teacher replaces any previous teacher connection.
        const previous = teacherOf(room);
        if (previous) {
          room.clients.delete(previous.clientId);
          previous.ws.close(4000, "Replaced by a new teacher connection");
        }
      } else {
        const code = normalizeRoomCode(raw.room);
        if (!code) return reject("room_not_found", "Enter the 4-character class code from your teacher.");
        room = rooms.get(code);
        if (!room) return reject("room_not_found", "No class with that code.");
        key = typeof raw.clientKey === "string" && KEY_PATTERN.test(raw.clientKey) ? raw.clientKey : randomBytes(12).toString("base64url");

        // Same browser reconnecting: replace the old connection.
        for (const existing of room.clients.values()) {
          if (existing.role === "student" && existing.key === key) {
            room.clients.delete(existing.clientId);
            existing.ws.close(4000, "Replaced by a new connection");
          }
        }
        if (room.clients.size >= MAX_CLIENTS_PER_ROOM) return reject("room_full", "This class is full.");

        studentRecord = room.students.get(key);
        if (!studentRecord) {
          studentRecord = {
            studentId: randomBytes(6).toString("hex"),
            name,
            quizzes: {},
            tasks: new Set(),
            surveyDone: false,
          };
          room.students.set(key, studentRecord);
        }
        studentRecord.name = name;
      }

      cancelIdleCleanup(room);
      const client: Client = {
        ws,
        role,
        clientId,
        key,
        studentId: studentRecord?.studentId ?? null,
        synced: role === "student",
        name,
        room,
      };
      room.clients.set(clientId, client);
      current = client;

      send(ws, {
        type: "joined",
        payload: {
          clientId,
          studentId: client.studentId,
          role,
          room: room.code,
          clientKey: role === "student" ? key : undefined,
          teacherKey: role === "teacher" ? room.teacherKey : undefined,
          teacherState: room.teacherState,
          clients: clientList(room),
          progress: role === "teacher" ? progressSnapshot(room) : undefined,
          myProgress: studentRecord
            ? { quizzes: studentRecord.quizzes, tasks: Array.from(studentRecord.tasks), surveyDone: studentRecord.surveyDone }
            : undefined,
        },
      } as WSMessage);

      sendClientList(room, clientId);
      sendProgressToTeacher(room);
      logger.info({ clientId, role, room: room.code }, "Client joined");
    }

    ws.on("message", (data) => {
      const now = Date.now();
      if (now - windowStart >= 1000) {
        windowStart = now;
        windowCount = 0;
      }
      if (++windowCount > MAX_MESSAGES_PER_SECOND) return;

      let msg: WSMessage;
      try {
        const parsed: unknown = JSON.parse(data.toString());
        if (!isRecord(parsed) || typeof parsed.type !== "string") return;
        msg = parsed as unknown as WSMessage;
      } catch {
        return;
      }

      if (msg.type === "ping") {
        send(ws, { type: "pong" });
        return;
      }
      if (msg.type === "join") {
        handleJoin(msg.payload);
        return;
      }

      if (msg.type === "leave") {
        const leaving = current;
        if (leaving && leaving.room.clients.get(leaving.clientId) === leaving) {
          leaving.room.clients.delete(leaving.clientId);
          sendClientList(leaving.room);
          if (leaving.room.clients.size === 0) scheduleIdleCleanup(leaving.room);
        }
        current = null;
        return;
      }

      const client = current;
      if (!client || client.room.clients.get(client.clientId) !== client) return;
      const room = client.room;

      switch (msg.type) {
        case "teacher_state_update": {
          if (client.role !== "teacher") break;
          const update = sanitizeTeacherUpdate(msg.payload);
          room.teacherState = { ...room.teacherState, ...update };
          broadcastRoom(room, { type: "state_sync", payload: { teacherState: room.teacherState } }, (c) => c.role === "student" && c.synced);
          break;
        }

        case "unsync": {
          client.synced = false;
          sendClientList(room);
          send(ws, { type: "unsync_confirmed", payload: {} });
          break;
        }

        case "resync": {
          client.synced = true;
          send(ws, { type: "state_sync", payload: { teacherState: room.teacherState } });
          sendClientList(room);
          break;
        }

        case "broadcast_message": {
          if (client.role !== "teacher") break;
          const text = cleanText(msg.payload?.text, MAX_BROADCAST_LENGTH);
          if (!text) break;
          broadcastRoom(
            room,
            { type: "broadcast_message", payload: { text, from: client.name, timestamp: Date.now() } },
            (c) => c.role === "student",
          );
          break;
        }

        case "report_progress": {
          const ok = handleReport(client, msg.payload);
          const kind = typeof msg.payload?.kind === "string" ? msg.payload.kind : "";
          send(ws, { type: ok ? "report_ack" : "report_rejected", payload: { kind } });
          if (ok) sendProgressToTeacher(room);
          break;
        }

        default:
          break;
      }
    });

    ws.on("close", () => {
      const client = current;
      logger.info({ clientId, role: client?.role }, "WebSocket client disconnected");
      if (!client) return;
      // Skip if this connection was already replaced by a newer one.
      if (client.room.clients.get(clientId) !== client) return;
      client.room.clients.delete(clientId);
      sendClientList(client.room);
      if (client.room.clients.size === 0) scheduleIdleCleanup(client.room);
    });

    ws.on("error", (err) => {
      logger.error({ clientId, err }, "WebSocket error");
    });
  });

  logger.info("WebSocket server setup complete on /ws");
  return wss;
}
