import { useState, useCallback } from "react";
import { CircuitGate } from "@/lib/websocket";

const GATE_TYPES = [
  { id: "H", label: "H", color: "bg-indigo-500", desc: "Hadamard" },
  { id: "X", label: "X", color: "bg-red-500", desc: "Pauli-X (NOT)" },
  { id: "Y", label: "Y", color: "bg-orange-500", desc: "Pauli-Y" },
  { id: "Z", label: "Z", color: "bg-yellow-500", desc: "Pauli-Z" },
  { id: "S", label: "S", color: "bg-green-500", desc: "Phase (S)" },
  { id: "T", label: "T", color: "bg-teal-500", desc: "T gate (π/8)" },
  { id: "CNOT", label: "⊕", color: "bg-purple-500", desc: "CNOT / CX" },
  { id: "SWAP", label: "×", color: "bg-pink-500", desc: "SWAP" },
  { id: "M", label: "M", color: "bg-gray-500", desc: "Measure" },
] as const;

const NUM_QUBITS = 4;
const NUM_STEPS = 10;

interface QuantumCircuitProps {
  gates: CircuitGate[];
  editable?: boolean;
  onChange?: (gates: CircuitGate[]) => void;
}

export default function QuantumCircuit({ gates, editable = false, onChange }: QuantumCircuitProps) {
  const [selectedGate, setSelectedGate] = useState<string>("H");
  const [hoveredCell, setHoveredCell] = useState<{ q: number; s: number } | null>(null);

  const getGateAt = useCallback(
    (qubit: number, step: number) => {
      return gates.find((g) => g.qubit === qubit && g.step === step);
    },
    [gates]
  );

  const handleCellClick = useCallback(
    (qubit: number, step: number) => {
      if (!editable || !onChange) return;
      const existing = getGateAt(qubit, step);
      if (existing) {
        onChange(gates.filter((g) => g.id !== existing.id));
      } else {
        const newGate: CircuitGate = {
          id: `${Date.now()}-${Math.random()}`,
          type: selectedGate,
          qubit,
          step,
        };
        onChange([...gates, newGate]);
      }
    },
    [editable, selectedGate, gates, getGateAt, onChange]
  );

  const clearCircuit = () => {
    if (onChange) onChange([]);
  };

  const gateInfo = GATE_TYPES.find((g) => g.id === selectedGate);

  return (
    <div className="flex flex-col gap-4 w-full">
      {editable && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Gate Palette</p>
          <div className="flex flex-wrap gap-1.5">
            {GATE_TYPES.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGate(g.id)}
                title={g.desc}
                className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg border transition-all ${
                  selectedGate === g.id
                    ? `${g.color} border-white/30 shadow-lg scale-105`
                    : "bg-gray-800 border-gray-700 hover:border-gray-500"
                }`}
              >
                <span className="font-bold text-white text-xs w-6 text-center">{g.label}</span>
                <span className="text-gray-300 text-[9px] hidden sm:block">{g.id}</span>
              </button>
            ))}
            <button
              onClick={clearCircuit}
              className="px-2 py-1.5 rounded-lg bg-red-900/40 border border-red-800/50 text-red-400 text-xs hover:bg-red-900/60 transition-colors"
            >
              Clear
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Selected: <span className="text-gray-300">{gateInfo?.desc}</span> — Click a cell to place/remove
          </p>
        </div>
      )}

      <div className="overflow-x-auto">
        <div className="min-w-max">
          <div className="flex items-start gap-0">
            <div className="flex flex-col justify-center" style={{ paddingTop: "20px" }}>
              {Array.from({ length: NUM_QUBITS }, (_, q) => (
                <div
                  key={q}
                  className="flex items-center justify-end pr-2"
                  style={{ height: "52px" }}
                >
                  <span className="text-xs font-mono text-indigo-300 whitespace-nowrap">
                    q{q} |0⟩
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col">
              <div className="flex gap-0" style={{ paddingBottom: "4px" }}>
                {Array.from({ length: NUM_STEPS }, (_, s) => (
                  <div key={s} className="text-center text-[9px] text-gray-600 font-mono" style={{ width: "52px" }}>
                    t{s + 1}
                  </div>
                ))}
              </div>

              <div className="flex flex-col border border-gray-800 rounded-xl overflow-hidden bg-gray-950/50">
                {Array.from({ length: NUM_QUBITS }, (_, q) => (
                  <div key={q} className="flex relative" style={{ height: "52px" }}>
                    <div className="absolute inset-y-0 left-0 right-0 flex items-center pointer-events-none">
                      <div className="w-full h-px bg-gray-700/60" />
                    </div>

                    {Array.from({ length: NUM_STEPS }, (_, s) => {
                      const gate = getGateAt(q, s);
                      const isHovered = hoveredCell?.q === q && hoveredCell?.s === s;
                      const gateStyle = gate
                        ? GATE_TYPES.find((g) => g.id === gate.type)
                        : null;

                      return (
                        <div
                          key={s}
                          className="relative flex items-center justify-center cursor-pointer z-10"
                          style={{ width: "52px", height: "52px" }}
                          onClick={() => handleCellClick(q, s)}
                          onMouseEnter={() => setHoveredCell({ q, s })}
                          onMouseLeave={() => setHoveredCell(null)}
                        >
                          {gate ? (
                            <div
                              className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-lg ${gateStyle?.color ?? "bg-gray-600"} transition-transform hover:scale-110`}
                            >
                              {gateStyle?.label ?? gate.type}
                            </div>
                          ) : (
                            editable && isHovered && (
                              <div className="w-9 h-9 rounded-lg border-2 border-dashed border-indigo-500/40 flex items-center justify-center text-indigo-500/50 text-xs">
                                +
                              </div>
                            )
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-center" style={{ paddingTop: "20px" }}>
              {Array.from({ length: NUM_QUBITS }, (_, q) => (
                <div
                  key={q}
                  className="flex items-center pl-2"
                  style={{ height: "52px" }}
                >
                  <div className="w-6 h-6 rounded border border-gray-600 bg-gray-800 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 3v3M21 12h-3M12 21v-3M3 12h3" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
        {GATE_TYPES.map((g) => (
          <span key={g.id} className="flex items-center gap-1">
            <span className={`w-3 h-3 rounded ${g.color}`} />
            {g.id} = {g.desc}
          </span>
        ))}
      </div>
    </div>
  );
}
