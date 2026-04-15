import QuantumCircuit from "@/components/QuantumCircuit";
import { useApp } from "@/context/AppContext";
import { CircuitGate } from "@/lib/websocket";
import { useState } from "react";

export default function CircuitPage() {
  const { role, teacherState, updateTeacherState, synced } = useApp();
  const isTeacher = role === "teacher";

  const [localGates, setLocalGates] = useState<CircuitGate[]>([]);

  const displayGates =
    isTeacher
      ? teacherState.circuitGates
      : synced
      ? teacherState.circuitGates
      : localGates;

  const handleChange = (gates: CircuitGate[]) => {
    if (isTeacher) {
      updateTeacherState({ circuitGates: gates });
    } else {
      setLocalGates(gates);
    }
  };

  const EXAMPLE_CIRCUITS = [
    {
      label: "Bell State",
      gates: [
        { id: "bs-1", type: "H", qubit: 0, step: 0 },
        { id: "bs-2", type: "CNOT", qubit: 1, step: 1 },
      ] as CircuitGate[],
    },
    {
      label: "GHZ State",
      gates: [
        { id: "ghz-1", type: "H", qubit: 0, step: 0 },
        { id: "ghz-2", type: "CNOT", qubit: 1, step: 1 },
        { id: "ghz-3", type: "CNOT", qubit: 2, step: 2 },
      ] as CircuitGate[],
    },
    {
      label: "QFT (2-qubit)",
      gates: [
        { id: "qft-1", type: "H", qubit: 0, step: 0 },
        { id: "qft-2", type: "S", qubit: 0, step: 1 },
        { id: "qft-3", type: "H", qubit: 1, step: 2 },
        { id: "qft-4", type: "SWAP", qubit: 0, step: 3 },
      ] as CircuitGate[],
    },
    {
      label: "Superposition",
      gates: [
        { id: "sup-1", type: "H", qubit: 0, step: 0 },
        { id: "sup-2", type: "H", qubit: 1, step: 0 },
        { id: "sup-3", type: "H", qubit: 2, step: 0 },
        { id: "sup-4", type: "H", qubit: 3, step: 0 },
      ] as CircuitGate[],
    },
  ];

  return (
    <div className="p-4 flex flex-col gap-4 h-full overflow-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-bold text-white text-lg">Quantum Circuit Designer</h2>
          <p className="text-gray-400 text-xs">
            {isTeacher
              ? "Design circuits — students see your changes in real time"
              : synced
              ? "Viewing teacher's circuit"
              : "Working independently — your circuit is not shared"}
          </p>
        </div>
        {!isTeacher && synced && (
          <div className="flex items-center gap-1.5 text-xs text-cyan-400">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Synced to teacher
          </div>
        )}
      </div>

      {(isTeacher || !synced) && (
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-400 mb-3 uppercase tracking-wider">Example Circuits</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_CIRCUITS.map((ex) => (
              <button
                key={ex.label}
                onClick={() => handleChange(ex.gates)}
                className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30 transition-colors"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
        <QuantumCircuit
          gates={displayGates}
          editable={isTeacher || !synced}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
