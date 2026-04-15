# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **WebSocket**: ws (on API server at /ws path)
- **3D Visualization**: Three.js

## Applications

### Quantum Lab (`artifacts/quantum-lab`)
A quantum computing teaching module for computer science classroom labs.

**Features:**
- Role-based join (Teacher / Student) — only one teacher allowed per session
- Real-time sync via WebSocket (teacher state synced to all "synced" students)
- Sync / Unsync toggle — students can explore independently then resync
- Bloch Sphere 3D visualization using Three.js (interactive for teacher/unsynced students)
- Quantum Circuit Designer — visual grid-based circuit builder with gate palette
- 5 lesson modules with structured sections (expandable)
- Lessons: Qubits Intro, Quantum Gates, Quantum Circuits, Entanglement, Quantum Algorithms

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
