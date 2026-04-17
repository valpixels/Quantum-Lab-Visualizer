import { useState, useCallback, useRef } from "react";
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
  { label: "Bell State", label_ar: "حالة بيل", gates: [{ id: "b1", type: "H", qubit: 0, step: 0 }, { id: "b2", type: "CNOT", qubit: 1, step: 1 }] as CircuitGate[] },
  { label: "GHZ", label_ar: "GHZ", gates: [{ id: "g1", type: "H", qubit: 0, step: 0 }, { id: "g2", type: "CNOT", qubit: 1, step: 1 }, { id: "g3", type: "CNOT", qubit: 2, step: 2 }] as CircuitGate[] },
  { label: "QFT 2Q", label_ar: "QFT 2 كيوبت", gates: [{ id: "q1", type: "H", qubit: 0, step: 0 }, { id: "q2", type: "S", qubit: 0, step: 1 }, { id: "q3", type: "H", qubit: 1, step: 2 }, { id: "q4", type: "SWAP", qubit: 0, step: 3 }] as CircuitGate[] },
  { label: "Superposition", label_ar: "تراكب", gates: Array.from({ length: NUM_QUBITS }, (_, q) => ({ id: `sup-${q}`, type: "H", qubit: q, step: 0 })) as CircuitGate[] },
  { label: "Grover Step", label_ar: "خطوة غروفر", gates: [{ id: "gr1", type: "H", qubit: 0, step: 0 }, { id: "gr2", type: "H", qubit: 1, step: 0 }, { id: "gr3", type: "Z", qubit: 0, step: 1 }, { id: "gr4", type: "CNOT", qubit: 1, step: 2 }, { id: "gr5", type: "H", qubit: 0, step: 3 }, { id: "gr6", type: "H", qubit: 1, step: 3 }, { id: "gr7", type: "M", qubit: 0, step: 4 }, { id: "gr8", type: "M", qubit: 1, step: 4 }] as CircuitGate[] },
];

function generateQASM(gates: CircuitGate[]): string {
  const lines = [`OPENQASM 2.0;`, `include "qelib1.inc";`, `qreg q[${NUM_QUBITS}];`, `creg c[${NUM_QUBITS}];`];
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
  const [dragOver, setDragOver] = useState<{ q: number; s: number } | null>(null);
  const dragGateTypeRef = useRef<string>("H");

  const gates: CircuitGate[] = isTeacher ? teacherState.circuitGates : synced ? teacherState.circuitGates : localGates;
  const editable = isTeacher || !synced;

  const getGateAt = useCallback((q: number, s: number) => gates.find((g) => g.qubit === q && g.step === s), [gates]);

  const setGates = (next: CircuitGate[]) => {
    if (isTeacher) updateTeacherState({ circuitGates: next });
    else setLocalGates(next);
    setRunResult(null);
  };

  const handleCellClick = (q: number, s: number) => {
    if (!editable) return;
    const existing = getGateAt(q, s);
    if (existing) setGates(gates.filter((g) => g.id !== existing.id));
    else setGates([...gates, { id: `${Date.now()}-${Math.random()}`, type: selectedGate, qubit: q, step: s }]);
  };

  // Drag-and-drop handlers
  const handleDragStart = (gateType: string) => {
    dragGateTypeRef.current = gateType;
    setSelectedGate(gateType);
  };

  const handleCellDragOver = (e: React.DragEvent, q: number, s: number) => {
    if (!editable) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setDragOver({ q, s });
  };

  const handleCellDrop = (e: React.DragEvent, q: number, s: number) => {
    if (!editable) return;
    e.preventDefault();
    setDragOver(null);
    const gateType = dragGateTypeRef.current;
    const existing = getGateAt(q, s);
    if (existing) {
      setGates([...gates.filter((g) => g.id !== existing.id), { id: `${Date.now()}-${Math.random()}`, type: gateType, qubit: q, step: s }]);
    } else {
      setGates([...gates, { id: `${Date.now()}-${Math.random()}`, type: gateType, qubit: q, step: s }]);
    }
  };

  const handleCellDragLeave = () => setDragOver(null);

  const handleGateDragStart = (e: React.DragEvent, gateId: string) => {
    if (!editable) return;
    const gate = gates.find((g) => g.id === gateId);
    if (gate) {
      dragGateTypeRef.current = gate.type;
      e.dataTransfer.effectAllowed = "move";
      setGates(gates.filter((g) => g.id !== gateId));
    }
  };

  const handleRun = () => {
    const hGates = gates.filter((g) => g.type === "H").length;
    const shots = 1024;
    const counts: Record<string, number> = {};
    if (hGates > 0) {
      const states = Math.min(Math.pow(2, hGates), 8);
      const stateKeys = Array.from({ length: states }, (_, i) => i.toString(2).padStart(NUM_QUBITS, "0"));
      for (let i = 0; i < shots; i++) {
        const key = stateKeys[Math.floor(Math.random() * states)];
        counts[key] = (counts[key] ?? 0) + 1;
      }
    } else {
      counts["00000"] = shots;
    }
    const lines = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([k, v]) => `  '${k}': ${v} (${((v / shots) * 100).toFixed(1)}%)`);
    setRunResult(`Shots: ${shots}\nResults:\n${lines.join("\n")}`);
  };

  const qasm = generateQASM(gates);

  return (
    <div className="flex h-full min-h-0 overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      {/* Circuit canvas */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-2 shrink-0 bg-white" style={{ borderBottom: "2px solid #fce4e4" }}>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <div className="w-3 h-3 rounded-full bg-red-400" />
          </div>
          <h2 className="font-black text-base ms-2" style={{ color: "#1a0f6e" }}>{t(language, "circuitLab")}</h2>
          <p className="text-xs ms-1" style={{ color: "#9b8abf" }}>
            {language === "en" ? "Drag gates from the palette, or click to place" : "اسحب البوابات من اللوحة أو انقر للوضع"}
          </p>
          <div className="ms-auto flex items-center gap-2">
            {editable && (
              <>
                <button onClick={handleRun} className="px-3 py-1 rounded-lg text-xs font-black" style={{ background: "#1a0f6e", color: "white" }}>
                  {t(language, "runCircuit")}
                </button>
                <button onClick={() => setGates([])} className="px-3 py-1 rounded-lg text-xs font-bold" style={{ background: "#fce4e4", color: "#1a0f6e" }}>
                  {t(language, "clearCircuit")}
                </button>
              </>
            )}
            {!isTeacher && synced && (
              <span className="text-xs font-medium" style={{ color: "#3a7abf" }}>● {t(language, "synced")}</span>
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-auto p-5" style={{ background: "#fce4e4" }}>
          <div className="min-w-max">
            {/* Step labels */}
            <div className="flex" style={{ paddingInlineStart: "64px", marginBottom: "4px" }}>
              {Array.from({ length: NUM_STEPS }, (_, s) => (
                <div key={s} className="text-center text-xs font-mono font-bold" style={{ width: "56px", color: "#9b8abf" }}>{s}</div>
              ))}
            </div>

            <div className="rounded-2xl overflow-hidden p-4 shadow-md bg-white" style={{ border: "2px solid #fce4e4" }}>
              {Array.from({ length: NUM_QUBITS }, (_, q) => (
                <div key={q} className="flex items-center" style={{ height: "56px" }}>
                  {/* Qubit label */}
                  <div className="flex items-center gap-1 font-mono text-xs font-black shrink-0" style={{ width: "64px", color: "#1a0f6e" }}>
                    <span style={{ color: "#7c6fcd" }}>q[{q}]</span>
                    <span style={{ fontSize: "10px" }}>|0⟩</span>
                  </div>
                  {/* Wire + cells */}
                  <div className="flex items-center relative flex-1">
                    <div className="absolute inset-y-0 left-0 right-0 flex items-center pointer-events-none">
                      <div className="w-full" style={{ height: "2px", background: "#1a0f6e" }} />
                    </div>
                    {Array.from({ length: NUM_STEPS }, (_, s) => {
                      const gate = getGateAt(q, s);
                      const gateType = GATE_TYPES.find((g) => g.id === gate?.type);
                      const isDropTarget = dragOver?.q === q && dragOver?.s === s;
                      return (
                        <div
                          key={s}
                          className="relative flex items-center justify-center z-10"
                          style={{ width: "56px", height: "56px", cursor: editable ? "pointer" : "default" }}
                          onClick={() => !gate && handleCellClick(q, s)}
                          onDragOver={(e) => handleCellDragOver(e, q, s)}
                          onDrop={(e) => handleCellDrop(e, q, s)}
                          onDragLeave={handleCellDragLeave}
                        >
                          {gate && gateType ? (
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-md select-none ${gateType.cls} ${editable ? "cursor-grab active:cursor-grabbing hover:scale-110 transition-transform" : ""}`}
                              draggable={editable}
                              onDragStart={(e) => handleGateDragStart(e, gate.id)}
                              onClick={(e) => { e.stopPropagation(); if (editable) setGates(gates.filter((g) => g.id !== gate.id)); }}
                              title={`${gateType.desc} — click to remove, drag to move`}
                            >
                              {gateType.label}
                            </div>
                          ) : (
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold transition-all"
                              style={{
                                border: isDropTarget ? "2px solid #7c6fcd" : editable ? "2px dashed #e0d8f5" : "none",
                                background: isDropTarget ? "#ddd4f8" : "transparent",
                                color: "#c5b8f5",
                                opacity: isDropTarget ? 1 : 0.5,
                              }}
                            >
                              {isDropTarget ? "+" : editable ? "+" : ""}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {/* Measure meter */}
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ms-1"
                      style={{ border: "2px solid #e8e0f8", background: "#f5f0ff" }}>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#7c6fcd" strokeWidth="1.5">
                        <circle cx="12" cy="14" r="7" /><path d="M12 7v4" /><path d="M7 9.5l3.5 4" /><path d="M17 9.5l-3.5 4" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {runResult && (
              <div className="mt-3 p-3 rounded-xl font-mono text-xs whitespace-pre" style={{ background: "#1a0f6e", color: "#a8f5c8" }}>
                {runResult}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-52 shrink-0 flex flex-col" style={{ background: "#fce4e4", borderInlineStart: "2px solid #f0b8b8" }}>
        {/* Gate palette */}
        <div className="p-3 shrink-0">
          <p className="font-black text-sm mb-2" style={{ color: "#1a0f6e" }}>{t(language, "gates")}</p>
          <p className="text-xs mb-3" style={{ color: "#9b8abf" }}>
            {language === "en" ? "Drag onto circuit" : "اسحب على الدائرة"}
          </p>
          <div className="grid grid-cols-3 gap-1.5 mb-3">
            {GATE_TYPES.map((g) => (
              <div
                key={g.id}
                draggable
                onDragStart={() => handleDragStart(g.id)}
                onClick={() => setSelectedGate(g.id)}
                title={g.desc}
                className={`h-10 rounded-xl flex items-center justify-center font-black text-sm cursor-grab active:cursor-grabbing select-none transition-all ${g.cls} ${selectedGate === g.id ? "ring-2 ring-offset-1 ring-indigo-500 scale-110" : "hover:scale-105"}`}
              >
                {g.label}
              </div>
            ))}
          </div>
          {editable && (
            <>
              <p className="text-xs font-bold mb-2" style={{ color: "#7c6fcd" }}>{t(language, "exampleCircuits")}</p>
              <div className="space-y-1">
                {EXAMPLES.map((ex) => (
                  <button key={ex.label} onClick={() => setGates(ex.gates)}
                    className="w-full px-2 py-1.5 rounded-lg text-xs font-bold transition-all bg-white"
                    style={{ color: "#1a0f6e", border: "2px solid #c5b8f5", textAlign: isRTL ? "right" : "left" }}>
                    {language === "ar" ? ex.label_ar : ex.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* QASM Editor */}
        <div className="flex-1 flex flex-col min-h-0 p-3" style={{ borderTop: "2px solid #f0b8b8" }}>
          <p className="font-black text-xs mb-2 shrink-0" style={{ color: "#1a0f6e" }}>{t(language, "editor")}</p>
          <div className="flex-1 rounded-xl p-3 font-mono text-xs overflow-auto" style={{ background: "#1a0f6e", color: "#a8d8f5", minHeight: "120px" }}>
            <pre className="whitespace-pre-wrap">{qasm}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
