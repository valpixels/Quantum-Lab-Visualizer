export type Role = "teacher" | "student";

export interface ClientInfo {
  clientId: string;
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
  qubit: number;
  step: number;
}

export interface TeacherState {
  currentLessonId: string | null;
  blochState: BlochState;
  circuitGates: CircuitGate[];
  activeView: "lessons" | "bloch" | "circuit";
}

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

  connect() {
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
      }
    };

    this.ws.onclose = () => {
      this.connected = false;
      this.emit({ type: "disconnected" });
      this.scheduleReconnect();
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

  send(msg: WSMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    }
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
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
  }
}

export const quantumWS = new QuantumWebSocket();
