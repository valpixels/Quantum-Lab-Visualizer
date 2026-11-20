import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  quantumWS,
  Role,
  ClientInfo,
  TeacherState,
  WSMessage,
  JoinErrorCode,
  JoinPayload,
  ProgressReport,
  ProgressSnapshot,
  QuizResult,
} from "@/lib/websocket";
import { Language } from "@/lib/i18n";
import { getProgramStartDate, setProgramStartDate, getCurrentDay } from "@/lib/lessons";

export interface BroadcastMessage {
  text: string;
  from: string;
  timestamp: number;
}

interface SavedSession {
  role: Role;
  name: string;
  room: string;
  teacherKey?: string;
  clientKey?: string;
}

const SESSION_KEY = "quantum_session";
const SELF_TEACHING_KEY = "quantum_self_teaching";

// Session data lives in sessionStorage on purpose: on shared lab computers it disappears when the tab closes,
// so the next student never inherits the previous student's identity.
function loadSession(): SavedSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedSession;
    if (parsed && (parsed.role === "teacher" || parsed.role === "student") && parsed.name && parsed.room) return parsed;
  } catch {
    // ignore
  }
  return null;
}

function saveSession(session: SavedSession | null) {
  try {
    if (session) sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // storage unavailable (private mode); the app still works, it just can't auto-rejoin
  }
}

function readSelfTeaching(): boolean {
  try {
    return localStorage.getItem(SELF_TEACHING_KEY) === "1";
  } catch {
    return false;
  }
}

interface AppState {
  role: Role | null;
  clientId: string | null;
  studentId: string | null;
  clientName: string | null;
  room: string | null;
  connected: boolean;
  synced: boolean;
  clients: ClientInfo[];
  teacherState: TeacherState;
  joinError: string | null;
  joinErrorCode: JoinErrorCode | null;
  /** True while we are trying to resume a saved session after a page refresh. */
  resuming: boolean;
  language: Language;
  selfTeachingMode: boolean;
  programStartDate: string | null;
  currentDay: number;
  broadcastMessages: BroadcastMessage[];
  /** Teacher only: what every student has done so far. */
  progress: ProgressSnapshot | null;
  myQuizzes: Record<string, QuizResult>;
  myTasks: string[];
  mySurveyDone: boolean;
}

interface AppContextValue extends AppState {
  join: (params: { role: Role; name: string; room?: string; pin?: string }) => void;
  leave: () => void;
  unsync: () => void;
  resync: () => void;
  updateTeacherState: (update: Partial<TeacherState>) => void;
  setLanguage: (lang: Language) => void;
  enableSelfTeachingMode: () => void;
  startProgram: () => void;
  sendBroadcast: (text: string) => void;
  dismissBroadcast: (timestamp: number) => void;
  /** Tell the server about a quiz score, finished practice task or survey. Returns false if offline. */
  reportProgress: (report: ProgressReport) => boolean;
}

const defaultTeacherState: TeacherState = {
  currentLessonId: null,
  blochState: { theta: 0, phi: 0 },
  circuitGates: [],
  activeView: "lessons",
};

const AppContext = createContext<AppContextValue | null>(null);

function initialLanguage(): Language {
  try {
    return (localStorage.getItem("quantum_lang") as Language) === "ar" ? "ar" : "en";
  } catch {
    return "en";
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const programStartDate = getProgramStartDate();
    return {
      role: null,
      clientId: null,
      studentId: null,
      clientName: null,
      room: null,
      connected: false,
      synced: false,
      clients: [],
      teacherState: defaultTeacherState,
      joinError: null,
      joinErrorCode: null,
      resuming: loadSession() !== null,
      language: initialLanguage(),
      selfTeachingMode: readSelfTeaching(),
      programStartDate,
      currentDay: programStartDate ? getCurrentDay(programStartDate) : 1,
      broadcastMessages: [],
      progress: null,
      myQuizzes: {},
      myTasks: [],
      mySurveyDone: false,
    };
  });

  const stateRef = useRef(state);
  stateRef.current = state;
  const joinedRef = useRef(false);
  const sessionRef = useRef<SavedSession | null>(loadSession());
  const pendingJoinRef = useRef<SavedSession | null>(null);

  useEffect(() => {
    quantumWS.connect();

    const sendJoin = (payload: JoinPayload) => {
      quantumWS.send({ type: "join", payload: payload as unknown as Record<string, unknown> });
    };

    const onConnected = () => {
      setState((s) => ({ ...s, connected: true }));
      // After a page refresh or a dropped connection, silently rejoin the same class.
      const saved = sessionRef.current;
      if (saved && !joinedRef.current) {
        pendingJoinRef.current = saved;
        sendJoin({
          role: saved.role,
          name: saved.name,
          room: saved.room,
          teacherKey: saved.teacherKey,
          clientKey: saved.clientKey,
        });
      }
    };
    const onDisconnected = () => {
      setState((s) => ({ ...s, connected: false }));
      joinedRef.current = false;
    };
    const onJoined = (msg: WSMessage) => {
      const payload = msg.payload as {
        clientId: string;
        studentId: string | null;
        role: Role;
        room: string;
        clientKey?: string;
        teacherKey?: string;
        teacherState: TeacherState;
        clients: ClientInfo[];
        progress?: ProgressSnapshot;
        myProgress?: { quizzes: Record<string, QuizResult>; tasks: string[]; surveyDone: boolean };
      };
      joinedRef.current = true;
      const pending = pendingJoinRef.current;
      const name = pending?.name ?? stateRef.current.clientName ?? "";
      const session: SavedSession = {
        role: payload.role,
        name,
        room: payload.room,
        teacherKey: payload.teacherKey ?? pending?.teacherKey,
        clientKey: payload.clientKey ?? pending?.clientKey,
      };
      sessionRef.current = session;
      saveSession(session);
      pendingJoinRef.current = null;
      setState((s) => ({
        ...s,
        clientId: payload.clientId,
        studentId: payload.studentId,
        clientName: name,
        room: payload.room,
        role: payload.role,
        synced: payload.role === "student",
        teacherState: payload.teacherState,
        clients: payload.clients,
        progress: payload.progress ?? null,
        myQuizzes: payload.myProgress?.quizzes ?? {},
        myTasks: payload.myProgress?.tasks ?? [],
        mySurveyDone: payload.myProgress?.surveyDone ?? false,
        joinError: null,
        joinErrorCode: null,
        resuming: false,
      }));
    };
    const onJoinRejected = (msg: WSMessage) => {
      const payload = msg.payload as { code?: JoinErrorCode; reason?: string };
      const wasResuming = pendingJoinRef.current !== null && !stateRef.current.role;
      // A saved session that no longer works (class ended, server restarted) is dropped.
      if (pendingJoinRef.current) {
        sessionRef.current = null;
        saveSession(null);
        pendingJoinRef.current = null;
      }
      setState((s) => ({
        ...s,
        joinError: payload.reason ?? "Could not join.",
        joinErrorCode: payload.code ?? "bad_request",
        resuming: false,
        // If we were already inside the app when the server forgot us, go back to the join screen.
        ...(wasResuming || s.role ? { role: null, room: null } : {}),
      }));
    };
    const onStateSync = (msg: WSMessage) => {
      const payload = msg.payload as { teacherState: TeacherState };
      setState((s) => ({ ...s, teacherState: payload.teacherState }));
    };
    const onClientListUpdate = (msg: WSMessage) => {
      const payload = msg.payload as { clients: ClientInfo[] };
      setState((s) => ({ ...s, clients: payload.clients }));
    };
    const onProgressUpdate = (msg: WSMessage) => {
      const payload = msg.payload as unknown as ProgressSnapshot;
      setState((s) => ({ ...s, progress: payload }));
    };
    const onUnsyncConfirmed = () => setState((s) => ({ ...s, synced: false }));
    const onBroadcastMessage = (msg: WSMessage) => {
      const payload = msg.payload as unknown as BroadcastMessage;
      setState((s) => ({
        ...s,
        broadcastMessages: [...s.broadcastMessages, payload].slice(-10),
      }));
    };

    quantumWS.on("connected", onConnected);
    quantumWS.on("disconnected", onDisconnected);
    quantumWS.on("joined", onJoined);
    quantumWS.on("join_rejected", onJoinRejected);
    quantumWS.on("state_sync", onStateSync);
    quantumWS.on("client_list_update", onClientListUpdate);
    quantumWS.on("progress_update", onProgressUpdate);
    quantumWS.on("unsync_confirmed", onUnsyncConfirmed);
    quantumWS.on("broadcast_message", onBroadcastMessage);

    // The socket may already be open if this provider remounted.
    if (quantumWS.isConnected()) onConnected();

    return () => {
      quantumWS.off("connected", onConnected);
      quantumWS.off("disconnected", onDisconnected);
      quantumWS.off("joined", onJoined);
      quantumWS.off("join_rejected", onJoinRejected);
      quantumWS.off("state_sync", onStateSync);
      quantumWS.off("client_list_update", onClientListUpdate);
      quantumWS.off("progress_update", onProgressUpdate);
      quantumWS.off("unsync_confirmed", onUnsyncConfirmed);
      quantumWS.off("broadcast_message", onBroadcastMessage);
    };
  }, []);

  const join = useCallback((params: { role: Role; name: string; room?: string; pin?: string }) => {
    pendingJoinRef.current = null;
    setState((s) => ({ ...s, clientName: params.name, joinError: null, joinErrorCode: null }));
    quantumWS.send({
      type: "join",
      payload: {
        role: params.role,
        name: params.name,
        room: params.room,
        pin: params.pin,
      },
    });
  }, []);

  const leave = useCallback(() => {
    quantumWS.send({ type: "leave" });
    sessionRef.current = null;
    pendingJoinRef.current = null;
    saveSession(null);
    joinedRef.current = false;
    setState((s) => ({
      ...s,
      role: null,
      room: null,
      clientId: null,
      studentId: null,
      clientName: null,
      synced: false,
      clients: [],
      teacherState: defaultTeacherState,
      progress: null,
      myQuizzes: {},
      myTasks: [],
      mySurveyDone: false,
      broadcastMessages: [],
      joinError: null,
      joinErrorCode: null,
      resuming: false,
    }));
  }, []);

  const unsync = useCallback(() => {
    quantumWS.send({ type: "unsync" });
    setState((s) => ({ ...s, synced: false }));
  }, []);

  const resync = useCallback(() => {
    quantumWS.send({ type: "resync" });
    setState((s) => ({ ...s, synced: true }));
  }, []);

  const updateTeacherState = useCallback((update: Partial<TeacherState>) => {
    const current = stateRef.current;
    if (current.role !== "teacher") return;
    quantumWS.send({ type: "teacher_state_update", payload: update as Record<string, unknown> });
    const next = { ...current.teacherState, ...update };
    stateRef.current = { ...current, teacherState: next };
    setState((s) => ({ ...s, teacherState: { ...s.teacherState, ...update } }));
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    try {
      localStorage.setItem("quantum_lang", lang);
    } catch {
      // ignore
    }
    setState((s) => ({ ...s, language: lang }));
  }, []);

  const enableSelfTeachingMode = useCallback(() => {
    try {
      localStorage.setItem(SELF_TEACHING_KEY, "1");
    } catch {
      // ignore
    }
    setState((s) => ({ ...s, selfTeachingMode: true }));
  }, []);

  const startProgram = useCallback(() => {
    const date = setProgramStartDate();
    setState((s) => ({ ...s, programStartDate: date, currentDay: 1 }));
  }, []);

  const sendBroadcast = useCallback((text: string) => {
    quantumWS.send({ type: "broadcast_message", payload: { text } });
  }, []);

  const dismissBroadcast = useCallback((timestamp: number) => {
    setState((s) => ({
      ...s,
      broadcastMessages: s.broadcastMessages.filter((m) => m.timestamp !== timestamp),
    }));
  }, []);

  const reportProgress = useCallback((report: ProgressReport): boolean => {
    if (stateRef.current.role !== "student") return false;
    const sent = quantumWS.send({ type: "report_progress", payload: report as unknown as Record<string, unknown> });
    if (!sent) return false;
    // Mirror the server's bookkeeping locally so the UI updates immediately.
    setState((s) => {
      if (report.kind === "quiz") {
        const prev = s.myQuizzes[report.lessonId];
        const better = !prev || report.score / report.total >= prev.score / prev.total;
        return {
          ...s,
          myQuizzes: {
            ...s.myQuizzes,
            [report.lessonId]: {
              score: better ? report.score : prev.score,
              total: better ? report.total : prev.total,
              attempts: (prev?.attempts ?? 0) + 1,
            },
          },
        };
      }
      if (report.kind === "task") {
        return s.myTasks.includes(report.taskId) ? s : { ...s, myTasks: [...s.myTasks, report.taskId] };
      }
      return { ...s, mySurveyDone: true };
    });
    return true;
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        join,
        leave,
        unsync,
        resync,
        updateTeacherState,
        setLanguage,
        enableSelfTeachingMode,
        startProgram,
        sendBroadcast,
        dismissBroadcast,
        reportProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

