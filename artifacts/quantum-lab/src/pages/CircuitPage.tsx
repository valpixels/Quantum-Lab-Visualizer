import { useState, useCallback } from "react";
import { useApp } from "@/context/AppContext";
import { CircuitGate } from "@/lib/websocket";
import { t } from "@/lib/i18n";

const GATE_TYPES = [
  { id: "H", label: "H", desc: "Hadamard", cls: "gate-H" },
  { id: "X", label: "X", desc: "Pauli-X (NOT)", cls: "gate-X" },
  { id: "Y", label: "Y", desc: "Pauli-Y", cls: "gate-Y" },
  { id: "Z", label: "Z", desc: "Pauli-Z", cls: "gate-Z" },
  { id: "S", label: "S", desc: "Phase", cls: "gate-S" },
  { id: "T", label: "T", desc: "T gate (π/8)", cls: "gate-T" },
  { id: "CNOT", label: "⊕", desc: "CNOT", cls: "gate-CNOT" },
  { id: "SWAP", label: "✕", desc: "SWAP", cls: "gate-SWAP" },
  { id: "M", label: "M", desc: "Measure", cls: "gate-M" },
] as const;

const NUM_QUBITS = 5;
const NUM_STEPS = 12;

const EXAMPLES = [
  {
    label: "Bell State",
    gates: [
      { id: "b1", type: "H", qubit: 0, step: 0 },
      { id: "b2", type: "CNOT", qubit: 1, step: 1 },
    ] as CircuitGate[],
  },
  {
    label: "GHZ",
    gates: [
      { id: "g1", type: "H", qubit: 0, step: 0 },
      { id: "g2", type: "CNOT", qubit: 1, step: 1 },
      { id: "g3", type: "CNOT", qubit: 2, step: 2 },
    ] as CircuitGate[],
  },
  {
    label: "QFT 2Q",
    gates: [
      { id: "q1", type: "H", qubit: 0, step: 0 },
      { id: "q2", type: "S", qubit: 0, step: 1 },
      { id: "q3", type: "H", qubit: 1, step: 2 },
      { id: "q4", type: "SWAP", qubit: 0, step: 3 },
    ] as CircuitGate[],
  },
  {
    label: "Superposition",
    gates: Array.from({ length: NUM_QUBITS }, (_, q) => ({
      id: `sup-${q}`,
      type: "H",
      qubit: q,
      step: 0,
    })) as CircuitGate[],
  },
  {
    label: "Grover Step",
    gates: [
      { id: "gr1", type: "H", qubit: 0, step: 0 },
      { id: "gr2", type: "H", qubit: 1, step: 0 },
      { id: "gr3", type: "Z", qubit: 0, step: 1 },
      { id: "gr4", type: "CNOT", qubit: 1, step: 2 },
      { id: "gr5", type: "H", qubit: 0, step: 3 },
      { id: "gr6", type: "H", qubit: 1, step: 3 },
      { id: "gr7", type: "M", qubit: 0, step: 4 },
      { id: "gr8", type: "M", qubit: 1, step: 4 },
    ] as CircuitGate[],
  },
];

function generateQASM(gates: CircuitGate[]): string {
  const lines = [
    `OPENQASM 2.0;`,
    `include "qelib1.inc";`,
    `qreg q[${NUM_QUBITS}];`,
    `creg c[${NUM_QUBITS}];`,
  ];
  const sorted = [...gates].sort((a, b) => a.step - b.step || a.qubit - b.qubit);
  for (const g of sorted) {
    switch (g.type) {
      case "H": lines.push(`h q[${g.qubit}];`); break;
      case "X": lines.push(`x q[${g.qubit}];`); break;
      case "Y": lines.push(`y q[${g.qubit}];`); break;
      case "Z": lines.push(`z q[${g.qubit}];`); break;
      case "S": lines.push(`s q[${g.qubit}];`); break;
      case "T": lines.push(`t q[${g.qubit}];`); break;
      case "CNOT": lines.push(`cx q[${Math.max(0, g.qubit - 1)}],q[${g.qubit}];`); break;
      case "SWAP": lines.push(`swap q[${Math.max(0, g.qubit - 1)}],q[${g.qubit}];`); break;
      case "M": lines.push(`measure q[${g.qubit}] -> c[${g.qubit}];`); break;
    }
  }
  return lines.join("\n");
}

export default function CircuitPage() {
  const { role, teacherState, updateTeacherState, synced, language } = useApp();
  const isTeacher = role === "teacher";
  const isRTL = language === "ar";

  const [localGates, setLocalGates] = useState<CircuitGate[]>([]);
  const [selectedGate, setSelectedGate] = useState<string>("H");
  const [runResult, setRunResult] = useState<string | null>(null);

  const gates: CircuitGate[] = isTeacher
    ? teacherState.circuitGates
    : synced
    ? teacherState.circuitGates
    : localGates;

  const editable = isTeacher || !synced;

  const getGateAt = useCallback(
    (q: number, s: number) => gates.find((g) => g.qubit === q && g.step === s),
    [gates]
  );

  const setGates = (next: CircuitGate[]) => {
    if (isTeacher) updateTeacherState({ circuitGates: next });
    else setLocalGates(next);
    setRunResult(null);
  };

  const handleCell = (q: number, s: number) => {
    if (!editable) return;
    const existing = getGateAt(q, s);
    if (existing) setGates(gates.filter((g) => g.id !== existing.id));
    else setGates([...gates, { id: `${Date.now()}-${Math.random()}`, type: selectedGate, qubit: q, step: s }]);
  };

  const handleRun = () => {
    const counts = { "00000": 0, "11111": 0 };
    const hGates = gates.filter((g) => g.type === "H").length;
    const mGates = gates.filter((g) => g.type === "M").length;
    const shots = 1024;
    if (hGates > 0) {
      const prob = 1 / Math.pow(2, Math.min(hGates, 5));
      for (let i = 0; i < shots; i++) {
        const outcome = Math.random() < prob ? "00000" : "11111";
        counts[outcome as keyof typeof counts]++;
      }
    } else {
      counts["00000"] = shots;
    }
    const lines = Object.entries(counts)
      .filter(([, v]) => v > 0)
      .map(([k, v]) => `  '${k}': ${v} (${((v / shots) * 100).toFixed(1)}%)`);
    setRunResult(`Shots: ${shots}\nResults:\n${lines.join("\n")}`);
  };

  const qasm = generateQASM(gates);

  return (
    <div className="flex h-full min-h-0 overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      {/* Circuit canvas — left panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Toolbar */}
        <div
          className="flex items-center gap-2 px-4 py-2 shrink-0"
          style={{ background: "white", borderBottom: "2px solid #fce4e4" }}
        >
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <div className="w-3 h-3 rounded-full bg-red-400" />
          </div>
          <h2 className="font-black text-base ml-2" style={{ color: "#1a0f6e" }}>
            {t(language, "circuitLab")}
          </h2>
          <div className="ml-auto flex items-center gap-2">
            {editable && (
              <>
                <button
                  onClick={handleRun}
                  className="px-3 py-1 rounded-lg text-xs font-black"
                  style={{ background: "#1a0f6e", color: "white" }}
                >
                  {t(language, "runCircuit")}
                </button>
                <button
                  onClick={() => setGates([])}
                  className="px-3 py-1 rounded-lg text-xs font-bold"
                  style={{ background: "#fce4e4", color: "#1a0f6e" }}
                >
                  {t(language, "clearCircuit")}
                </button>
              </>
            )}
            {!isTeacher && synced && (
              <span className="text-xs font-medium" style={{ color: "#3a7abf" }}>
                ● {t(language, "synced")}
              </span>
            )}
          </div>
        </div>

        {/* Circuit grid */}
        <div className="flex-1 overflow-auto p-5" style={{ background: "#fce4e4" }}>
          <div className="min-w-max">
            {/* Step labels */}
            <div className="flex" style={{ paddingLeft: "60px", marginBottom: "4px" }}>
              {Array.from({ length: NUM_STEPS }, (_, s) => (
                <div
                  key={s}
                  className="text-center text-xs font-mono font-bold"
                  style={{ width: "56px", color: "#9b8abf" }}
                >
                  {s}
                </div>
              ))}
            </div>

            {/* Qubit rows */}
            <div
              className="rounded-2xl overflow-hidden p-4 shadow-md"
              style={{ background: "white", border: "2px solid #fce4e4" }}
            >
              {Array.from({ length: NUM_QUBITS }, (_, q) => (
                <div key={q} className="flex items-center" style={{ height: "56px" }}>
                  {/* Qubit label */}
                  <div
                    className="flex items-center gap-1 font-mono text-xs font-black shrink-0"
                    style={{ width: "60px", color: "#1a0f6e" }}
                  >
                    <span style={{ color: "#7c6fcd" }}>q[{q}]</span>
                    <span style={{ fontSize: "10px" }}>|0⟩</span>
                  </div>

                  {/* Wire + cells */}
                  <div className="flex items-center relative flex-1">
                    <div
                      className="absolute inset-y-0 left-0 right-0 flex items-center pointer-events-none"
                    >
                      <div className="w-full" style={{ height: "2px", background: "#1a0f6e" }} />
                    </div>

                    {Array.from({ length: NUM_STEPS }, (_, s) => {
                      const gate = getGateAt(q, s);
                      const gateType = GATE_TYPES.find((g) => g.id === gate?.type);
                      return (
                        <div
                          key={s}
                          className="relative flex items-center justify-center cursor-pointer z-10"
                          style={{ width: "56px", height: "56px" }}
                          onClick={() => handleCell(q, s)}
                        >
                          {gate && gateType ? (
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-md transition-transform hover:scale-110 ${gateType.cls}`}
                            >
                              {gateType.label}
                            </div>
                          ) : (
                            editable && (
                              <div
                                className="w-10 h-10 rounded-xl opacity-0 hover:opacity-100 flex items-center justify-center text-lg font-bold transition-all"
                                style={{ border: "2px dashed #c5b8f5", color: "#c5b8f5" }}
                              >
                                +
                              </div>
                            )
                          )}
                        </div>
                      );
                    })}

                    {/* Measure meter at end */}
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ml-1"
                      style={{ border: "2px solid #e8e0f8", background: "#f5f0ff" }}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#7c6fcd" strokeWidth="1.5">
                        <circle cx="12" cy="14" r="7" />
                        <path d="M12 7v4" />
                        <path d="M7 9.5l3.5 4" />
                        <path d="M17 9.5l-3.5 4" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Run result */}
            {runResult && (
              <div
                className="mt-3 p-3 rounded-xl font-mono text-xs whitespace-pre"
                style={{ background: "#1a0f6e", color: "#a8f5c8" }}
              >
                {runResult}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right panel: Gates + Editor */}
      <div
        className="w-56 shrink-0 flex flex-col border-l overflow-hidden"
        style={{ background: "#fce4e4", borderColor: "#f0b8b8" }}
      >
        {/* Gate palette */}
        <div className="p-3 shrink-0">
          <p className="font-black text-sm mb-3" style={{ color: "#1a0f6e" }}>
            {t(language, "gates")}
          </p>
          <div className="grid grid-cols-3 gap-1.5 mb-3">
            {GATE_TYPES.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGate(g.id)}
                title={g.desc}
                className={`h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all ${g.cls} ${selectedGate === g.id ? "ring-2 ring-offset-1 ring-indigo-500 scale-110" : "opacity-90 hover:opacity-100"}`}
              >
                {g.label}
              </button>
            ))}
          </div>
          {editable && (
            <>
              <p className="text-xs font-bold mb-2" style={{ color: "#7c6fcd" }}>
                {t(language, "exampleCircuits")}
              </p>
              <div className="space-y-1">
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex.label}
                    onClick={() => setGates(ex.gates)}
                    className="w-full px-2 py-1.5 rounded-lg text-xs font-bold text-left transition-all"
                    style={{ background: "white", color: "#1a0f6e", border: "2px solid #c5b8f5" }}
                  >
                    {ex.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* QASM Editor */}
        <div className="flex-1 flex flex-col min-h-0 p-3 border-t" style={{ borderColor: "#f0b8b8" }}>
          <p className="font-black text-xs mb-2 shrink-0" style={{ color: "#1a0f6e" }}>
            {t(language, "editor")}
          </p>
          <div
            className="flex-1 rounded-xl p-3 font-mono text-xs overflow-auto"
            style={{ background: "#1a0f6e", color: "#a8d8f5", minHeight: "120px" }}
          >
            <pre className="whitespace-pre-wrap">{qasm}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
