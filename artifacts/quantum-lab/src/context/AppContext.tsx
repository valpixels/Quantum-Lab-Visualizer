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
} from "@/lib/websocket";
import { Language } from "@/lib/i18n";
import { getProgramStartDate, setProgramStartDate, getCurrentDay, TOTAL_DAYS } from "@/lib/lessons";

export interface BroadcastMessage {
  text: string;
  from: string;
  timestamp: number;
}

interface AppState {
  role: Role | null;
  clientId: string | null;
  clientName: string | null;
  connected: boolean;
  synced: boolean;
  clients: ClientInfo[];
  teacherState: TeacherState;
  joinError: string | null;
  language: Language;
  selfTeachingMode: boolean;
  programStartDate: string | null;
  currentDay: number;
  broadcastMessages: BroadcastMessage[];
}

interface AppContextValue extends AppState {
  join: (role: Role, name: string) => void;
  unsync: () => void;
  resync: () => void;
  updateTeacherState: (update: Partial<TeacherState>) => void;
  setLanguage: (lang: Language) => void;
  enableSelfTeachingMode: () => void;
  startProgram: () => void;
  sendBroadcast: (text: string) => void;
  dismissBroadcast: (timestamp: number) => void;
}

const defaultTeacherState: TeacherState = {
  currentLessonId: null,
  blochState: { theta: 0, phi: 0 },
  circuitGates: [],
  activeView: "lessons",
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const programStartDate = getProgramStartDate();
    return {
      role: null,
      clientId: null,
      clientName: null,
      connected: false,
      synced: false,
      clients: [],
      teacherState: defaultTeacherState,
      joinError: null,
      language: (localStorage.getItem("quantum_lang") as Language) ?? "en",
      selfTeachingMode: false,
      programStartDate,
      currentDay: programStartDate ? getCurrentDay(programStartDate) : 1,
      broadcastMessages: [],
    };
  });

  const joinedRef = useRef(false);

  useEffect(() => {
    quantumWS.connect();

    const onConnected = () => setState((s) => ({ ...s, connected: true }));
    const onDisconnected = () => {
      setState((s) => ({ ...s, connected: false }));
      joinedRef.current = false;
    };
    const onJoined = (msg: WSMessage) => {
      const payload = msg.payload as {
        clientId: string;
        role: Role;
        teacherState: TeacherState;
        clients: ClientInfo[];
      };
      joinedRef.current = true;
      setState((s) => ({
        ...s,
        clientId: payload.clientId,
        role: payload.role,
        synced: payload.role === "student",
        teacherState: payload.teacherState,
        clients: payload.clients,
        joinError: null,
      }));
    };
    const onJoinRejected = (msg: WSMessage) => {
      const payload = msg.payload as { reason: string };
      setState((s) => ({ ...s, joinError: payload.reason }));
    };
    const onStateSync = (msg: WSMessage) => {
      const payload = msg.payload as { teacherState: TeacherState };
      setState((s) => ({ ...s, teacherState: payload.teacherState }));
    };
    const onClientListUpdate = (msg: WSMessage) => {
      const payload = msg.payload as { clients: ClientInfo[] };
      setState((s) => ({ ...s, clients: payload.clients }));
    };
    const onUnsyncConfirmed = () => setState((s) => ({ ...s, synced: false }));
    const onBroadcastMessage = (msg: WSMessage) => {
      const payload = msg.payload as unknown as BroadcastMessage;
      setState((s) => ({
        ...s,
        broadcastMessages: [...s.broadcastMessages, payload],
      }));
    };

    quantumWS.on("connected", onConnected);
    quantumWS.on("disconnected", onDisconnected);
    quantumWS.on("joined", onJoined);
    quantumWS.on("join_rejected", onJoinRejected);
    quantumWS.on("state_sync", onStateSync);
    quantumWS.on("client_list_update", onClientListUpdate);
    quantumWS.on("unsync_confirmed", onUnsyncConfirmed);
    quantumWS.on("broadcast_message", onBroadcastMessage);

    return () => {
      quantumWS.off("connected", onConnected);
      quantumWS.off("disconnected", onDisconnected);
      quantumWS.off("joined", onJoined);
      quantumWS.off("join_rejected", onJoinRejected);
      quantumWS.off("state_sync", onStateSync);
      quantumWS.off("client_list_update", onClientListUpdate);
      quantumWS.off("unsync_confirmed", onUnsyncConfirmed);
      quantumWS.off("broadcast_message", onBroadcastMessage);
    };
  }, []);

  const join = useCallback((role: Role, name: string) => {
    setState((s) => ({ ...s, clientName: name, joinError: null }));
    quantumWS.send({ type: "join", payload: { role, name } });
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
    setState((s) => {
      if (s.role !== "teacher") return s;
      const next = { ...s.teacherState, ...update };
      quantumWS.send({ type: "teacher_state_update", payload: update as Record<string, unknown> });
      return { ...s, teacherState: next };
    });
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    localStorage.setItem("quantum_lang", lang);
    setState((s) => ({ ...s, language: lang }));
  }, []);

  const enableSelfTeachingMode = useCallback(() => {
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

  return (
    <AppContext.Provider
      value={{
        ...state,
        join,
        unsync,
        resync,
        updateTeacherState,
        setLanguage,
        enableSelfTeachingMode,
        startProgram,
        sendBroadcast,
        dismissBroadcast,
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
