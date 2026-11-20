import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { CircuitGate } from "@/lib/websocket";
import { NUM_QUBITS, NUM_STEPS, gateQubits, isComplete, isTwoQubit } from "@/lib/quantum";

export const CELL = 56;
export const LABEL_W = 64;

export const GATE_TYPES = [
  { id: "H", label: "H", cls: "gate-H", en: "Hadamard: makes a 50/50 superposition", ar: "هادامار: يصنع تراكباً 50/50" },
  { id: "X", label: "X", cls: "gate-X", en: "Pauli-X: the quantum NOT, flips 0 and 1", ar: "باولي-X: NOT الكمومية، تقلب 0 و1" },
  { id: "Y", label: "Y", cls: "gate-Y", en: "Pauli-Y: flip with a phase twist", ar: "باولي-Y: قلب مع التواء في الطور" },
  { id: "Z", label: "Z", cls: "gate-Z", en: "Pauli-Z: flips the sign of the |1⟩ part", ar: "باولي-Z: تقلب إشارة الجزء |1⟩" },
  { id: "S", label: "S", cls: "gate-S", en: "S gate: quarter-turn phase", ar: "بوابة S: طور بمقدار ربع دورة" },
  { id: "T", label: "T", cls: "gate-T", en: "T gate: eighth-turn phase", ar: "بوابة T: طور بمقدار ثُمن دورة" },
  { id: "CNOT", label: "⊕", cls: "gate-CNOT", en: "CNOT: flips the target if the control is 1. Click the control qubit, then the target qubit in the same column", ar: "CNOT: تقلب الهدف إذا كان المتحكِّم 1. انقر الكيوبت المتحكِّم ثم الكيوبت الهدف في العمود نفسه" },
  { id: "SWAP", label: "✕", cls: "gate-SWAP", en: "SWAP: exchanges two qubits. Click one qubit, then the other in the same column", ar: "SWAP: تبدّل بين كيوبتين. انقر كيوبتاً ثم الآخر في العمود نفسه" },
  { id: "M", label: "M", cls: "gate-M", en: "Measure the qubit", ar: "قياس الكيوبت" },
] as const;

export type GateTypeId = (typeof GATE_TYPES)[number]["id"];

const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

/** Clickable / draggable list of gates. Selecting one and clicking the grid places it. */
export function GatePalette({
  selected,
  onSelect,
  only,
  columns = 3,
}: {
  selected: string;
  onSelect: (id: string) => void;
  /** Limit the palette to these gate ids (used by beginner practice tasks). */
  only?: string[];
  columns?: number;
}) {
  const { language } = useApp();
  const gates = only ? GATE_TYPES.filter((g) => only.includes(g.id)) : GATE_TYPES;
  const info = GATE_TYPES.find((g) => g.id === selected);
  return (
    <div>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {gates.map((g) => (
          <button
            key={g.id}
            type="button"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", `gate:${g.id}`);
              e.dataTransfer.effectAllowed = "copy";
              onSelect(g.id);
            }}
            onClick={() => onSelect(g.id)}
            title={language === "ar" ? g.ar : g.en}
            aria-label={language === "ar" ? g.ar : g.en}
            aria-pressed={selected === g.id}
            className={`gate-tile solid-shadow-sm h-10 rounded-xl flex items-center justify-center font-black text-sm cursor-grab active:cursor-grabbing select-none transition-transform ${g.cls} ${
              selected === g.id ? "ring-2 ring-offset-1 ring-indigo-600 -translate-y-0.5" : "hover:-translate-y-0.5"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>
      {info && (
        <p className="text-xs mt-2 leading-snug" style={{ color: "#6b3abf" }}>
          <span className="font-black">{info.id}</span>: {language === "ar" ? info.ar : info.en}
        </p>
      )}
    </div>
  );
}

interface QuantumCircuitProps {
  gates: CircuitGate[];
  /** Present = editable. Omit for a read-only picture of a circuit. */
  onChange?: (gates: CircuitGate[]) => void;
  selectedGate?: string;
  numQubits?: number;
  numSteps?: number;
}

export default function QuantumCircuit({
  gates,
  onChange,
  selectedGate = "H",
  numQubits = NUM_QUBITS,
  numSteps = NUM_STEPS,
}: QuantumCircuitProps) {
  const { language } = useApp();
  const editable = !!onChange;
  const [hover, setHover] = useState<{ q: number; s: number } | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const pending = pendingId ? gates.find((g) => g.id === pendingId && !isComplete(g)) ?? null : null;

  const gateAtIn = (list: CircuitGate[], q: number, s: number) =>
    list.find((g) => g.step === s && gateQubits(g).includes(q));
  const gateAt = (q: number, s: number) => gateAtIn(gates, q, s);

  const commit = (next: CircuitGate[]) => onChange?.(next);

  const place = (base: CircuitGate[], type: string, q: number, s: number) => {
    const gate: CircuitGate = { id: newId(), type, qubit: q, step: s };
    commit([...base, gate]);
    setPendingId(isTwoQubit(type) ? gate.id : null);
  };

  const handleCellClick = (q: number, s: number) => {
    if (!editable) return;
    let base = gates;
    const existing = gateAt(q, s);

    if (pending) {
      if (existing?.id === pending.id) {
        commit(gates.filter((g) => g.id !== pending.id));
        setPendingId(null);
        return;
      }
      if (!existing && s === pending.step && q !== pending.qubit) {
        commit(gates.map((g) => (g.id === pending.id ? { ...g, target: q } : g)));
        setPendingId(null);
        return;
      }
      // Any other click cancels the half-placed gate.
      base = gates.filter((g) => g.id !== pending.id);
      setPendingId(null);
      if (existing) {
        commit(base);
        return;
      }
    }

    if (existing) {
      commit(base.filter((g) => g.id !== existing.id));
      return;
    }
    place(base, selectedGate, q, s);
  };

  const handleDrop = (e: React.DragEvent, q: number, s: number) => {
    if (!editable) return;
    e.preventDefault();
    setHover(null);
    const data = e.dataTransfer.getData("text/plain");
    let base = pending ? gates.filter((g) => g.id !== pending.id) : gates;
    setPendingId(null);

    const occupant = gateAtIn(base, q, s);
    if (data.startsWith("move:")) {
      const moving = base.find((g) => g.id === data.slice(5));
      if (!moving || isTwoQubit(moving.type)) return;
      base = base.filter((g) => g.id !== moving.id && g.id !== occupant?.id);
      commit([...base, { ...moving, qubit: q, step: s }]);
    } else if (data.startsWith("gate:")) {
      base = base.filter((g) => g.id !== occupant?.id);
      place(base, data.slice(5), q, s);
    }
  };

  const width = LABEL_W + numSteps * CELL + 40;
  const height = numQubits * CELL;
  const cx = (s: number) => LABEL_W + s * CELL + CELL / 2;
  const cy = (q: number) => q * CELL + CELL / 2;

  const renderEndpoint = (g: CircuitGate, q: number) => {
    const info = GATE_TYPES.find((t) => t.id === g.type);
    const complete = isComplete(g);
    const isFirst = q === g.qubit;
    const common = "absolute flex items-center justify-center select-none";

    if (g.type === "CNOT" && isFirst) {
      // Control dot.
      return (
        <div
          className={`${common} rounded-full ${complete ? "" : "animate-pulse"}`}
          style={{
            left: cx(g.step) - 9,
            top: cy(q) - 9,
            width: 18,
            height: 18,
            background: "#3a0f6e",
            boxShadow: "2px 2px 0 0 #b27cf0",
            outline: complete ? "none" : "3px dashed #b27cf0",
            outlineOffset: 3,
            zIndex: 12,
          }}
          title="CNOT control"
        />
      );
    }
    if (g.type === "CNOT") {
      return (
        <div
          className={`${common} rounded-full gate-CNOT gate-tile solid-shadow-sm font-black text-xl`}
          style={{ left: cx(g.step) - 18, top: cy(q) - 18, width: 36, height: 36, zIndex: 12 }}
          title="CNOT target"
        >
          ⊕
        </div>
      );
    }
    if (g.type === "SWAP") {
      return (
        <div
          className={`${common} rounded-lg gate-SWAP gate-tile solid-shadow-sm font-black text-lg ${complete ? "" : "animate-pulse"}`}
          style={{ left: cx(g.step) - 16, top: cy(q) - 16, width: 32, height: 32, zIndex: 12 }}
          title="SWAP"
        >
          ✕
        </div>
      );
    }
    return (
      <div
        className={`${common} rounded-xl gate-tile solid-shadow-sm font-black text-sm ${info?.cls ?? ""} ${
          editable ? "cursor-grab active:cursor-grabbing" : ""
        }`}
        style={{ left: cx(g.step) - 20, top: cy(q) - 20, width: 40, height: 40, zIndex: 12 }}
        title={info ? (language === "ar" ? info.ar : info.en) : g.type}
        draggable={editable}
        onDragStart={(e) => {
          e.dataTransfer.setData("text/plain", `move:${g.id}`);
          e.dataTransfer.effectAllowed = "move";
        }}
      >
        {info?.label ?? g.type}
      </div>
    );
  };

  const pendingHint =
    language === "ar"
      ? "الآن انقر الكيوبت الثاني في العمود نفسه (أو انقر البوابة لإلغائها)"
      : "Now click the second qubit in the same column (or click the gate to cancel)";

  return (
    <div dir="ltr" className="w-full">
      <div className="overflow-x-auto pb-2">
        <div style={{ width, minWidth: width }}>
          {/* Step numbers */}
          <div className="relative" style={{ height: 18 }}>
            {Array.from({ length: numSteps }, (_, s) => (
              <div
                key={s}
                className="absolute text-center text-xs font-mono font-bold"
                style={{ left: LABEL_W + s * CELL, width: CELL, color: "#7c6fcd" }}
              >
                {s + 1}
              </div>
            ))}
          </div>

          <div className="relative" style={{ height }}>
            {/* Wires and qubit labels */}
            {Array.from({ length: numQubits }, (_, q) => (
              <div key={q}>
                <div
                  className="absolute font-mono text-xs font-black flex items-center gap-1"
                  style={{ left: 0, top: q * CELL, height: CELL, width: LABEL_W, color: "#1a0f6e" }}
                >
                  <span style={{ color: "#6b3abf" }}>q[{q}]</span>
                  <span style={{ fontSize: 10 }}>|0⟩</span>
                </div>
                <div
                  className="absolute"
                  style={{ left: LABEL_W, right: 0, top: cy(q) - 1, height: 2, background: "#1a0f6e", opacity: 0.85 }}
                />
              </div>
            ))}

            {/* Vertical connectors for two-qubit gates */}
            {gates.filter((g) => isTwoQubit(g.type) && isComplete(g)).map((g) => {
              const top = Math.min(g.qubit, g.target as number);
              const span = Math.abs((g.target as number) - g.qubit);
              return (
                <div
                  key={`line-${g.id}`}
                  className="absolute"
                  style={{
                    left: cx(g.step) - 1,
                    top: cy(top),
                    width: 2,
                    height: span * CELL,
                    background: g.type === "CNOT" ? "#3a0f6e" : "#0f2a6e",
                    zIndex: 6,
                  }}
                />
              );
            })}

            {/* Cells */}
            {Array.from({ length: numQubits }, (_, q) =>
              Array.from({ length: numSteps }, (_, s) => {
                const existing = gateAt(q, s);
                const isHover = hover?.q === q && hover?.s === s;
                const isTargetOption = !!pending && !existing && s === pending.step && q !== pending.qubit;
                return (
                  <div
                    key={`${q}-${s}`}
                    role={editable ? "button" : undefined}
                    tabIndex={editable ? 0 : undefined}
                    aria-label={editable ? `qubit ${q}, step ${s + 1}` : undefined}
                    className="absolute flex items-center justify-center"
                    style={{
                      left: LABEL_W + s * CELL,
                      top: q * CELL,
                      width: CELL,
                      height: CELL,
                      cursor: editable ? "pointer" : "default",
                      zIndex: 8,
                    }}
                    onClick={() => handleCellClick(q, s)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleCellClick(q, s);
                      }
                    }}
                    onMouseEnter={() => setHover({ q, s })}
                    onMouseLeave={() => setHover(null)}
                    onDragOver={(e) => {
                      if (!editable) return;
                      e.preventDefault();
                      e.dataTransfer.dropEffect = "copy";
                      setHover({ q, s });
                    }}
                    onDragLeave={() => setHover(null)}
                    onDrop={(e) => handleDrop(e, q, s)}
                  >
                    {!existing && editable && (isHover || isTargetOption) && (
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold"
                        style={{
                          border: `2px dashed ${isTargetOption ? "#6b3abf" : "#a89ae8"}`,
                          background: isTargetOption ? "#ddd4f8" : "transparent",
                          color: "#6b3abf",
                        }}
                      >
                        +
                      </div>
                    )}
                  </div>
                );
              }),
            )}

            {/* Gates */}
            {gates.flatMap((g) =>
              gateQubits(g).map((q) => (
                // The wrapper has no box of its own; it only forwards clicks and drops to the cell underneath.
                <div
                  key={`${g.id}-${q}`}
                  onClick={() => handleCellClick(q, g.step)}
                  onDragOver={(e) => {
                    if (editable) e.preventDefault();
                  }}
                  onDrop={(e) => handleDrop(e, q, g.step)}
                >
                  {renderEndpoint(g, q)}
                </div>
              )),
            )}

            {/* Measurement dials at the end of each wire */}
            {Array.from({ length: numQubits }, (_, q) => (
              <div
                key={`dial-${q}`}
                className="absolute w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ left: LABEL_W + numSteps * CELL + 6, top: cy(q) - 14, border: "2px solid #a89ae8", background: "#f5f0ff" }}
                aria-hidden="true"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#6b3abf" strokeWidth="1.8">
                  <path d="M4 16a8 8 0 0116 0" />
                  <path d="M12 16l4-5" />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </div>
      {pending && (
        <p
          className="text-xs font-bold mt-1 px-3 py-1.5 rounded-lg inline-block"
          role="status"
          style={{ background: "#ddd4f8", color: "#3a0f6e" }}
        >
          {pendingHint}
        </p>
      )}
    </div>
  );
}
