# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: Drizzle ORM package exists in `lib/db` but the quantum lab does not use it
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **WebSocket**: ws (on API server at /ws path)
- **3D Visualization**: Three.js

## Applications

### Quantum Lab (`artifacts/quantum-lab`)
A quantum computing teaching module for computer science classroom labs.

**Features:**
- Classes: the teacher opens a class with a PIN and gets a 4-character code; students join with the code
- Real-time sync via WebSocket (teacher state synced to all "synced" students); students can unsync and re-sync
- Bloch Sphere 3D visualization (Three.js), with a choice between setting the state and rotating the view
- Circuit Lab: 5-qubit statevector simulator, CNOT/SWAP, measurement, OpenQASM export
- 6 lesson modules (English + Arabic) with quizzes, FAQs, circuit pictures and self-checking Practice tasks
- Teacher Class tab: online students, quiz scores, practice progress, anonymous survey results, CSV export
- Survey answers are anonymous and stored in `surveys.jsonl` (`DATA_DIR`); no database is needed for the app

See `README.md` and `TEACHER_GUIDE.md` for setup, environment variables and lesson plans.

**Adding new lessons:** Edit `artifacts/quantum-lab/src/lib/lessons.ts` and add to the `LESSONS` array.

### API Server (`artifacts/api-server`)
Express 5 backend. Handles REST endpoints and WebSocket connections.
- `/api` — REST routes
- `/ws` — WebSocket server (quantum session state sync)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/quantum-lab run dev` — run frontend locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
