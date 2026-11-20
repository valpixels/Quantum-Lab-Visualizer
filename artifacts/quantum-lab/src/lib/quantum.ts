import type { CircuitGate } from "@/lib/websocket";

export const NUM_QUBITS = 5;
export const NUM_STEPS = 12;
export const DEFAULT_SHOTS = 1024;

const TWO_QUBIT_TYPES = new Set(["CNOT", "SWAP"]);

export function isTwoQubit(type: string): boolean {
  return TWO_QUBIT_TYPES.has(type);
}

/** A two-qubit gate is complete once it has a target different from its first qubit. */
export function isComplete(g: CircuitGate): boolean {
  if (!isTwoQubit(g.type)) return true;
  return typeof g.target === "number" && g.target !== g.qubit;
}

/** All qubits a gate acts on. */
export function gateQubits(g: CircuitGate): number[] {
  if (isTwoQubit(g.type) && typeof g.target === "number") return [g.qubit, g.target];
  return [g.qubit];
}

// ───────────────────────────── State vector ─────────────────────────────
// Basis index bit k is qubit k (q0 = least significant bit).

interface State {
  re: Float64Array;
  im: Float64Array;
}

function zeroState(n: number): State {
  const re = new Float64Array(1 << n);
  re[0] = 1;
  return { re, im: new Float64Array(1 << n) };
}

type Mat = [[number, number], [number, number], [number, number], [number, number]];
const S2 = Math.SQRT1_2;
const MATS: Record<string, Mat> = {
  H: [[S2, 0], [S2, 0], [S2, 0], [-S2, 0]],
  X: [[0, 0], [1, 0], [1, 0], [0, 0]],
  Y: [[0, 0], [0, -1], [0, 1], [0, 0]],
  Z: [[1, 0], [0, 0], [0, 0], [-1, 0]],
  S: [[1, 0], [0, 0], [0, 0], [0, 1]],
  T: [[1, 0], [0, 0], [0, 0], [S2, S2]],
};

function apply1(s: State, q: number, m: Mat) {
  const bit = 1 << q;
  const [a, b, c, d] = m;
  for (let i = 0; i < s.re.length; i++) {
    if (i & bit) continue;
    const j = i | bit;
    const x0r = s.re[i], x0i = s.im[i], x1r = s.re[j], x1i = s.im[j];
    s.re[i] = a[0] * x0r - a[1] * x0i + b[0] * x1r - b[1] * x1i;
    s.im[i] = a[0] * x0i + a[1] * x0r + b[0] * x1i + b[1] * x1r;
    s.re[j] = c[0] * x0r - c[1] * x0i + d[0] * x1r - d[1] * x1i;
    s.im[j] = c[0] * x0i + c[1] * x0r + d[0] * x1i + d[1] * x1r;
  }
}

function swapAmps(s: State, i: number, j: number) {
  const r = s.re[i], im = s.im[i];
  s.re[i] = s.re[j]; s.im[i] = s.im[j];
  s.re[j] = r; s.im[j] = im;
}

function applyCNOT(s: State, control: number, target: number) {
  const cb = 1 << control, tb = 1 << target;
  for (let i = 0; i < s.re.length; i++) {
    if ((i & cb) && !(i & tb)) swapAmps(s, i, i | tb);
  }
}

function applySWAP(s: State, a: number, b: number) {
  const ab = 1 << a, bb = 1 << b;
  for (let i = 0; i < s.re.length; i++) {
    if ((i & ab) && !(i & bb)) swapAmps(s, i, (i ^ ab) | bb);
  }
}

function applyGate(s: State, g: CircuitGate) {
  if (g.type === "CNOT") {
    if (isComplete(g)) applyCNOT(s, g.qubit, g.target as number);
  } else if (g.type === "SWAP") {
    if (isComplete(g)) applySWAP(s, g.qubit, g.target as number);
  } else if (MATS[g.type]) {
    apply1(s, g.qubit, MATS[g.type]);
  }
}

function measureQubit(s: State, q: number): 0 | 1 {
  const bit = 1 << q;
  let p1 = 0;
  for (let i = 0; i < s.re.length; i++) if (i & bit) p1 += s.re[i] ** 2 + s.im[i] ** 2;
  const outcome: 0 | 1 = Math.random() < p1 ? 1 : 0;
  const norm = Math.sqrt(outcome === 1 ? p1 : 1 - p1) || 1;
  for (let i = 0; i < s.re.length; i++) {
    if (!!(i & bit) !== (outcome === 1)) {
      s.re[i] = 0; s.im[i] = 0;
    } else {
      s.re[i] /= norm; s.im[i] /= norm;
    }
  }
  return outcome;
}

/** Gates in execution order. Gates in the same step act on different qubits, so their order does not matter. */
function ordered(gates: CircuitGate[]): CircuitGate[] {
  return [...gates].sort((a, b) => a.step - b.step || a.qubit - b.qubit);
}

function runOnce(gates: CircuitGate[], numQubits: number, classical?: Map<number, number>): State {
  const s = zeroState(numQubits);
  for (const g of ordered(gates)) {
    if (g.type === "M") {
      const outcome = measureQubit(s, g.qubit);
      classical?.set(g.qubit, outcome);
    } else {
      applyGate(s, g);
    }
  }
  return s;
}

function bitsKey(index: number, qubits: number[]): string {
  return qubits.map((q) => ((index >> q) & 1 ? "1" : "0")).join("");
}

/** Exact outcome probabilities of the final state (measurement gates ignored) for the given qubits. */
export function idealProbabilities(
  gates: CircuitGate[],
  qubits: number[],
  numQubits = NUM_QUBITS,
): Record<string, number> {
  const s = runOnce(gates.filter((g) => g.type !== "M"), numQubits);
  const probs: Record<string, number> = {};
  for (let i = 0; i < s.re.length; i++) {
    const p = s.re[i] ** 2 + s.im[i] ** 2;
    if (p < 1e-9) continue;
    const key = bitsKey(i, qubits);
    probs[key] = (probs[key] ?? 0) + p;
  }
  return probs;
}

export interface RunResult {
  shots: number;
  /** Qubits shown in each bitstring, leftmost character first. */
  qubits: number[];
  counts: Record<string, number>;
  /** Exact probabilities. Only available when the circuit has no measurement gates. */
  probabilities: Record<string, number> | null;
  hasMeasure: boolean;
  skippedIncomplete: number;
}

/** Simulate a circuit: sample `shots` measurements from the ideal (noise-free) quantum state. */
export function runCircuit(
  gates: CircuitGate[],
  shots = DEFAULT_SHOTS,
  numQubits = NUM_QUBITS,
): RunResult {
  const skippedIncomplete = gates.filter((g) => !isComplete(g)).length;
  const usable = gates.filter(isComplete);
  const measured = [...new Set(usable.filter((g) => g.type === "M").map((g) => g.qubit))].sort((a, b) => a - b);
  const hasMeasure = measured.length > 0;
  const counts: Record<string, number> = {};

  if (!hasMeasure) {
    const touched = [...new Set(usable.flatMap(gateQubits))].sort((a, b) => a - b);
    const qubits = touched.length ? touched : [0];
    const probabilities = idealProbabilities(usable, qubits, numQubits);
    const keys = Object.keys(probabilities);
    const cumulative: number[] = [];
    let total = 0;
    for (const k of keys) {
      total += probabilities[k];
      cumulative.push(total);
    }
    for (let n = 0; n < shots; n++) {
      const r = Math.random() * total;
      let idx = cumulative.findIndex((c) => r < c);
      if (idx < 0) idx = keys.length - 1;
      counts[keys[idx]] = (counts[keys[idx]] ?? 0) + 1;
    }
    return { shots, qubits, counts, probabilities, hasMeasure, skippedIncomplete };
  }

  for (let n = 0; n < shots; n++) {
    const classical = new Map<number, number>();
    runOnce(usable, numQubits, classical);
    const key = measured.map((q) => String(classical.get(q) ?? 0)).join("");
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return { shots, qubits: measured, counts, probabilities: null, hasMeasure, skippedIncomplete };
}

// ───────────────────────────── OpenQASM export ─────────────────────────────

export function generateQASM(gates: CircuitGate[], numQubits = NUM_QUBITS): string {
  const lines = [
    "OPENQASM 2.0;",
    'include "qelib1.inc";',
    `qreg q[${numQubits}];`,
    `creg c[${numQubits}];`,
  ];
  for (const g of ordered(gates)) {
    switch (g.type) {
      case "H": lines.push(`h q[${g.qubit}];`); break;
      case "X": lines.push(`x q[${g.qubit}];`); break;
      case "Y": lines.push(`y q[${g.qubit}];`); break;
      case "Z": lines.push(`z q[${g.qubit}];`); break;
      case "S": lines.push(`s q[${g.qubit}];`); break;
      case "T": lines.push(`t q[${g.qubit}];`); break;
      case "CNOT":
        lines.push(isComplete(g) ? `cx q[${g.qubit}],q[${g.target}];` : `// CNOT on q[${g.qubit}] needs a target qubit`);
        break;
      case "SWAP":
        lines.push(isComplete(g) ? `swap q[${g.qubit}],q[${g.target}];` : `// SWAP on q[${g.qubit}] needs a second qubit`);
        break;
      case "M": lines.push(`measure q[${g.qubit}] -> c[${g.qubit}];`); break;
    }
  }
  return lines.join("\n");
}

// ───────────────────────────── Example circuits ─────────────────────────────

let uid = 0;
const mk = (type: string, qubit: number, step: number, target?: number): CircuitGate => ({
  id: `ex-${++uid}`,
  type,
  qubit,
  step,
  ...(target === undefined ? {} : { target }),
});

export interface ExampleCircuit {
  id: string;
  label: string;
  label_ar: string;
  gates: CircuitGate[];
}

export const EXAMPLE_CIRCUITS: ExampleCircuit[] = [
  {
    id: "bell",
    label: "Bell State",
    label_ar: "حالة بيل",
    gates: [mk("H", 0, 0), mk("CNOT", 0, 1, 1)],
  },
  {
    id: "ghz",
    label: "GHZ (3 qubits)",
    label_ar: "GHZ (3 كيوبتات)",
    gates: [mk("H", 0, 0), mk("CNOT", 0, 1, 1), mk("CNOT", 1, 2, 2)],
  },
  {
    id: "superposition",
    label: "Superposition",
    label_ar: "تراكب",
    gates: [mk("H", 0, 0), mk("H", 1, 0), mk("H", 2, 0)],
  },
  {
    id: "interference",
    label: "Interference (H, H)",
    label_ar: "التداخل (H, H)",
    gates: [mk("H", 0, 0), mk("H", 0, 1)],
  },
  {
    id: "hzh",
    label: "H · Z · H = X",
    label_ar: "H · Z · H = X",
    gates: [mk("H", 0, 0), mk("Z", 0, 1), mk("H", 0, 2)],
  },
  {
    // Grover search on 2 qubits for |11>. CZ is built as H · CNOT · H on the second qubit.
    id: "grover",
    label: "Grover (finds 11)",
    label_ar: "غروفر (يجد 11)",
    gates: [
      mk("H", 0, 0), mk("H", 1, 0),
      // oracle: CZ marks |11>
      mk("H", 1, 1), mk("CNOT", 0, 2, 1), mk("H", 1, 3),
      // diffusion
      mk("H", 0, 4), mk("H", 1, 4),
      mk("X", 0, 5), mk("X", 1, 5),
      mk("H", 1, 6), mk("CNOT", 0, 7, 1), mk("H", 1, 8),
      mk("X", 0, 9), mk("X", 1, 9),
      mk("H", 0, 10), mk("H", 1, 10),
    ],
  },
];

/** Fresh copy with new ids so examples can be loaded repeatedly. */
export function cloneGates(gates: CircuitGate[]): CircuitGate[] {
  return gates.map((g) => ({ ...g, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` }));
}

// ───────────────────────────── Practice-task checking ─────────────────────────────

export interface CircuitTaskSpec {
  numQubits: number;
  /** Desired probability of each outcome over qubits 0..numQubits-1 (q0 leftmost). */
  expect: Record<string, number>;
  /** Gate types that must appear, repeated entries mean "at least that many". */
  requireGates?: string[];
  tolerance?: number;
}

export interface CircuitTaskResult {
  ok: boolean;
  probabilities: Record<string, number>;
  missingGates: string[];
  incomplete: boolean;
}

export function checkCircuitTask(gates: CircuitGate[], spec: CircuitTaskSpec): CircuitTaskResult {
  const tol = spec.tolerance ?? 0.05;
  const usable = gates.filter((g) => g.type !== "M" && isComplete(g));
  const qubits = Array.from({ length: spec.numQubits }, (_, i) => i);
  const probabilities = idealProbabilities(usable, qubits);

  let ok = true;
  const keys = new Set([...Object.keys(spec.expect), ...Object.keys(probabilities)]);
  for (const k of keys) {
    const want = spec.expect[k] ?? 0;
    const got = probabilities[k] ?? 0;
    if (Math.abs(want - got) > tol) ok = false;
  }

  const need = new Map<string, number>();
  for (const t of spec.requireGates ?? []) need.set(t, (need.get(t) ?? 0) + 1);
  const missingGates: string[] = [];
  for (const [type, count] of need) {
    const have = usable.filter((g) => g.type === type).length;
    if (have < count) missingGates.push(type);
  }
  return {
    ok: ok && missingGates.length === 0,
    probabilities,
    missingGates,
    incomplete: gates.some((g) => !isComplete(g)),
  };
}

export interface BlochTaskSpec {
  /** Target state; compared as points on the sphere, so phi does not matter at the poles. */
  target?: { theta: number; phi: number };
  /** Alternatively: only the chance of measuring 0 matters. */
  p0?: number;
  tolerance?: number;
}

export function blochVector(theta: number, phi: number): [number, number, number] {
  return [Math.sin(theta) * Math.cos(phi), Math.sin(theta) * Math.sin(phi), Math.cos(theta)];
}

export function checkBlochTask(theta: number, phi: number, spec: BlochTaskSpec): boolean {
  if (spec.p0 !== undefined) {
    const p0 = Math.cos(theta / 2) ** 2;
    return Math.abs(p0 - spec.p0) <= (spec.tolerance ?? 0.04);
  }
  if (spec.target) {
    const a = blochVector(theta, phi);
    const b = blochVector(spec.target.theta, spec.target.phi);
    const dist = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
    return dist <= (spec.tolerance ?? 0.15);
  }
  return false;
}

export function formatProbabilities(probs: Record<string, number>): string {
  return Object.entries(probs)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([k, v]) => `${k}: ${Math.round(v * 100)}%`)
    .join("   ");
}
