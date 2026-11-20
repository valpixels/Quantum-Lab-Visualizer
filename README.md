# Quantum Lab Visualizer

A classroom module for a computer lab: six short lessons that introduce quantum technology to high-school students, with a Bloch sphere, a circuit lab, practice tasks that check themselves, and a teacher view of class progress. English and Arabic (right-to-left).

## Run it

```bash
pnpm install
# terminal 1: API + WebSocket server (port 8080)
PORT=8080 TEACHER_PIN=1234 pnpm --filter @workspace/api-server run dev
# terminal 2: the web app
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/quantum-lab run dev
```

Open `http://<teacher-computer-ip>:5173` on every lab computer. The dev server proxies `/api` and `/ws` to the API server (change the target with `API_PROXY_TARGET`), so students only need that one address. On Replit, both services run from the workspace as before.

### Server settings

| Variable | Default | Meaning |
| --- | --- | --- |
| `TEACHER_PIN` | random, printed at start-up | PIN a teacher enters to open a class |
| `DATA_DIR` | `artifacts/api-server/data` | Where anonymous survey answers are stored (`surveys.jsonl`) |
| `ROOM_IDLE_MINUTES` | `360` | An empty class is deleted after this long |

## How a class works

1. The teacher picks **Teacher**, enters a name and the PIN, and gets a 4-character **class code**.
2. Students pick **Student**, enter their name and the class code.
3. The teacher chooses lessons and uses the Bloch sphere and circuit lab; synced students follow along. Students can unsync to experiment, and re-sync later.
4. Students do lessons, **Practice** tasks and quizzes. Scores and finished tasks appear on the teacher's **Class** tab, which can be downloaded as CSV.
5. Refreshing the page or a short disconnect re-joins the same class and keeps progress.

## Privacy

Student names and progress live in the server's memory only, for as long as the class exists. The end-of-program survey is anonymous: answers are stored with the class code but no name, in `surveys.jsonl` on the server machine. Nothing is sent anywhere else.

## Code map

- `artifacts/quantum-lab/src/lib/quantum.ts`: statevector simulator (5 qubits), QASM export, practice-task checkers
- `artifacts/quantum-lab/src/lib/lessons.ts`: lesson text (English + Arabic), quizzes, circuit pictures, practice tasks
- `artifacts/quantum-lab/src/components/`: Bloch sphere (three.js), circuit grid, practice view
- `artifacts/api-server/src/routes/quantum-ws.ts`: classes, PIN check, state sync, progress, survey

## Check your changes

```bash
pnpm run typecheck
```
