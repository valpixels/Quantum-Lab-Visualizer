export type Role = "teacher" | "student";

export interface ClientInfo {
  clientId: string;
  /** Stable id for a student across reconnects (null for the teacher). */
  studentId: string | null;
  role: Role;
  synced: boolean;
  name: string;
}

export interface BlochState {
  theta: number;
  phi: number;
}

export interface CircuitGate {
  id: string;
  type: string;
  /** Qubit the gate sits on. For CNOT this is the control qubit. */
  qubit: number;
  step: number;
  /** Second qubit for CNOT (target) and SWAP. */
  target?: number;
}

export interface TeacherState {
  currentLessonId: string | null;
  blochState: BlochState;
  circuitGates: CircuitGate[];
  activeView: "lessons" | "bloch" | "circuit";
}

export interface QuizResult {
  score: number;
  total: number;
  attempts: number;
}

export interface SurveyResponse {
  overallRating: number;
  difficulty: number;
  mostInteresting: string;
  leastClear: string;
  wouldRecommend: string;
  comments: string;
  submittedAt: number;
}

export interface StudentProgress {
  studentId: string;
  name: string;
  quizzes: Record<string, QuizResult>;
  tasks: string[];
  surveyDone: boolean;
}

export interface ProgressSnapshot {
  students: StudentProgress[];
  /** Anonymous survey answers (no names attached). */
  surveys: SurveyResponse[];
}

export type ProgressReport =
  | { kind: "quiz"; lessonId: string; score: number; total: number }
  | { kind: "task"; lessonId: string; taskId: string }
  | { kind: "survey"; data: Omit<SurveyResponse, "submittedAt"> };

export interface JoinPayload {
  role: Role;
  name: string;
  /** Room code (students always, teachers when resuming). */
  room?: string;
  /** Teacher PIN, used to create a new class. */
  pin?: string;
  /** Secret returned when a class is created, used to resume as teacher. */
  teacherKey?: string;
  /** Random id kept by the browser so progress survives a reconnect. */
  clientKey?: string;
}

export type JoinErrorCode =
  | "bad_name"
  | "bad_pin"
  | "bad_key"
  | "room_not_found"
  | "room_full"
  | "server_busy"
  | "too_many_attempts"
  | "bad_request";

export interface WSMessage {
  type: string;
  payload?: Record<string, unknown>;
}

type MessageHandler = (msg: WSMessage) => void;

class QuantumWebSocket {
  private ws: WebSocket | null = null;
  private handlers = new Map<string, MessageHandler[]>();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private connected = false;
  private closedByUser = false;

  connect() {
    this.closedByUser = false;
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.host;
    const url = `${protocol}//${host}/ws`;

    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      this.connected = true;
      this.emit({ type: "connected" });
    };

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data as string) as WSMessage;
        this.emit(msg);
      } catch {
        // ignore malformed messages
      }
    };

    this.ws.onclose = () => {
      this.connected = false;
      this.emit({ type: "disconnected" });
      if (!this.closedByUser) this.scheduleReconnect();
    };

    this.ws.onerror = () => {
      this.ws?.close();
    };
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, 2000);
  }

  send(msg: WSMessage): boolean {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
      return true;
    }
    return false;
  }

  on(type: string, handler: MessageHandler) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, []);
    }
    this.handlers.get(type)!.push(handler);
  }

  off(type: string, handler: MessageHandler) {
    const list = this.handlers.get(type) ?? [];
    this.handlers.set(
      type,
      list.filter((h) => h !== handler)
    );
  }

  private emit(msg: WSMessage) {
    (this.handlers.get(msg.type) ?? []).forEach((h) => h(msg));
    (this.handlers.get("*") ?? []).forEach((h) => h(msg));
  }

  isConnected() {
    return this.connected;
  }

  disconnect() {
    this.closedByUser = true;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
  }
}

export const quantumWS = new QuantumWebSocket();
