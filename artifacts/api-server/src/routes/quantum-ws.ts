import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";
import { Server } from "http";
import { logger } from "../lib/logger";

interface Client {
  ws: WebSocket;
  role: "teacher" | "student";
  clientId: string;
  synced: boolean;
  name: string;
}

interface TeacherState {
  currentLessonId: string | null;
  blochState: { theta: number; phi: number };
  circuitGates: CircuitGate[];
  activeView: "lessons" | "bloch" | "circuit";
}

interface CircuitGate {
  id: string;
  type: string;
  qubit: number;
  step: number;
}

interface WSMessage {
  type: string;
  payload?: Record<string, unknown>;
  clientId?: string;
}

const clients = new Map<string, Client>();
let teacherState: TeacherState = {
  currentLessonId: null,
  blochState: { theta: 0, phi: 0 },
  circuitGates: [],
  activeView: "lessons",
};

function broadcastAll(message: WSMessage, excludeClientId?: string) {
  const data = JSON.stringify(message);
  clients.forEach((client, id) => {
    if (id !== excludeClientId && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(data);
    }
  });
}

function broadcastToSyncedStudents(message: WSMessage) {
  const data = JSON.stringify(message);
  clients.forEach((client) => {
    if (client.role === "student" && client.synced && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(data);
    }
  });
}

function broadcastToAllStudents(message: WSMessage) {
  const data = JSON.stringify(message);
  clients.forEach((client) => {
    if (client.role === "student" && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(data);
    }
  });
}

function getClientList() {
  return Array.from(clients.values()).map((c) => ({
    clientId: c.clientId,
    role: c.role,
    synced: c.synced,
    name: c.name,
  }));
}

function hasTeacher(): boolean {
  return Array.from(clients.values()).some((c) => c.role === "teacher");
}

export function setupWebSocketServer(server: Server) {
  const wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (ws: WebSocket, _req: IncomingMessage) => {
    const clientId = Math.random().toString(36).substring(2, 10);
    logger.info({ clientId }, "WebSocket client connected");

    ws.on("message", (data) => {
      let msg: WSMessage;
      try {
        msg = JSON.parse(data.toString()) as WSMessage;
      } catch {
        return;
      }

      const client = clients.get(clientId);

      switch (msg.type) {
        case "join": {
          const payload = msg.payload as { role: "teacher" | "student"; name: string };
          const requestedRole = payload?.role;
          const name = payload?.name ?? "Unknown";

          if (requestedRole === "teacher" && hasTeacher()) {
            ws.send(JSON.stringify({
              type: "join_rejected",
              payload: { reason: "A teacher is already active in this session." },
            }));
            return;
          }

          const newClient: Client = {
            ws,
            role: requestedRole === "teacher" ? "teacher" : "student",
            clientId,
            synced: requestedRole === "student",
            name,
          };
          clients.set(clientId, newClient);

          ws.send(JSON.stringify({
            type: "joined",
            payload: {
              clientId,
              role: newClient.role,
              teacherState,
              clients: getClientList(),
            },
          }));

          broadcastAll({ type: "client_list_update", payload: { clients: getClientList() } }, clientId);
          logger.info({ clientId, role: newClient.role, name }, "Client joined");
          break;
        }

        case "teacher_state_update": {
          if (client?.role !== "teacher") break;
          const update = msg.payload as Partial<TeacherState>;
          teacherState = { ...teacherState, ...update };
          broadcastToSyncedStudents({ type: "state_sync", payload: { teacherState } });
          break;
        }

        case "unsync": {
          if (!client) break;
          client.synced = false;
          clients.set(clientId, client);
          broadcastAll({ type: "client_list_update", payload: { clients: getClientList() } });
          ws.send(JSON.stringify({ type: "unsync_confirmed", payload: {} }));
          break;
        }

        case "resync": {
          if (!client) break;
          client.synced = true;
          clients.set(clientId, client);
          ws.send(JSON.stringify({ type: "state_sync", payload: { teacherState } }));
          broadcastAll({ type: "client_list_update", payload: { clients: getClientList() } });
          break;
        }

        case "broadcast_message": {
          if (client?.role !== "teacher") break;
          const payload = msg.payload as { text: string };
          if (!payload?.text?.trim()) break;
          broadcastToAllStudents({
            type: "broadcast_message",
            payload: {
              text: payload.text.trim(),
              from: client.name,
              timestamp: Date.now(),
            },
          });
          logger.info({ clientId, text: payload.text }, "Teacher broadcast sent");
          break;
        }

        case "ping": {
          ws.send(JSON.stringify({ type: "pong" }));
          break;
        }

        default:
          break;
      }
    });

    ws.on("close", () => {
      const c = clients.get(clientId);
      logger.info({ clientId, role: c?.role }, "WebSocket client disconnected");
      clients.delete(clientId);
      broadcastAll({ type: "client_list_update", payload: { clients: getClientList() } });
    });

    ws.on("error", (err) => {
      logger.error({ clientId, err }, "WebSocket error");
    });
  });

  logger.info("WebSocket server setup complete on /ws");
  return wss;
}
