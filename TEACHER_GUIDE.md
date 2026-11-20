# Teacher guide

## Before class

- Start the server with a `TEACHER_PIN` you will remember (see README).
- Open the app on your computer, choose **Teacher**, enter the PIN and write the class code on the board.
- Test one student computer: it should join with the code and show the dashboard.

## The six lessons

| # | Lesson | Time | Students will be able to… |
| --- | --- | --- | --- |
| 1 | Qubits | 20 min | say how a qubit differs from a bit; read probabilities from the Bloch sphere; set a state |
| 2 | Superposition & Gates | 25 min | apply X, H, Z; explain interference (H·H returns to 0) |
| 3 | Entanglement | 25 min | build a Bell pair; explain why its two results always match |
| 4 | Cryptography | 25 min | explain why quantum computers threaten some encryption and what quantum-safe means |
| 5 | Biochemistry | 20 min | describe why molecules are a natural fit for quantum simulation |
| 6 | Algorithms | 25 min | describe what Grover's search does; follow a worked example |

Lessons 1–3 have hands-on **Practice** tasks that mark themselves. Tasks marked ★ are optional challenges.

## Suggested plans

- **Six sessions:** one lesson per session: 10 min notes (use **Present**), 10 min practice, 5 min quiz.
- **Two sessions:** session 1 = lessons 1–3 with practice; session 2 = lessons 4–6 as discussion plus the circuit lab.
- **One session (60 min):** lessons 1–3 notes only (30 min), build a Bell pair together (15 min), quiz and feedback (15 min).

Self-teaching mode (Dashboard) unlocks one lesson per day from the start date for classes that meet daily.

## During class

- **Sync:** while students are synced they see what you do. Ask them to unsync for free exploration and re-sync to rejoin you.
- **Broadcast:** send a short message (280 characters) to every student.
- **Class tab:** see who is online, quiz scores per lesson, and practice tasks finished.

## After class

- Ask students to press **Feedback**. It is anonymous. Download progress and survey as CSV from the **Class** tab before closing the browser; progress is held in memory and is cleared when the server restarts or the class has been empty for `ROOM_IDLE_MINUTES`.

## Troubleshooting

- *"No class with that code"*: the code is 4 characters; check it, and that the server was not restarted.
- *Student shows "Connection lost"*: the app reconnects by itself. If the server restarted, they must join again.
- *Forgot the PIN*: restart the server with a new `TEACHER_PIN` (this ends running classes).
- *Sphere is blank*: the browser needs WebGL; try another browser or update graphics drivers.
