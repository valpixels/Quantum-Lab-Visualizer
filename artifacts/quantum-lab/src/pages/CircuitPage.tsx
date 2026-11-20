import { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { CircuitGate } from "@/lib/websocket";
import { t } from "@/lib/i18n";
import QuantumCircuit, { GatePalette } from "@/components/QuantumCircuit";
import {
  EXAMPLE_CIRCUITS,
  RunResult,
  cloneGates,
  generateQASM,
  runCircuit,
} from "@/lib/quantum";

function Histogram({ result, language }: { result: RunResult; language: "en" | "ar" }) {
  const entries = Object.entries(result.counts).sort((a, b) => a[0].localeCompare(b[0]));
  const max = Math.max(...entries.map(([, v]) => v), 1);
  return (
    <div className="mt-3 p-4 rounded-2xl bg-white" style={{ border: "2px solid #c5b8f5" }} dir="ltr">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
        <p className="font-black text-sm" style={{ color: "#1a0f6e" }}>
          {language === "ar" ? `النتائج (${result.shots} مرة قياس)` : `Results (${result.shots} measurements)`}
        </p>
        <p className="text-xs font-mono" style={{ color: "#7c6fcd" }}>
          {language === "ar" ? "البتات بالترتيب:" : "Bits in order:"}{" "}
          {result.qubits.map((q) => `q${q}`).join(" ")}
        </p>
      </div>
      <div className="space-y-1.5">
        {entries.map(([bits, count]) => (
          <div key={bits} className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold w-16 shrink-0" style={{ color: "#1a0f6e" }}>{bits}</span>
            <div className="flex-1 h-5 rounded-md overflow-hidden" style={{ background: "#f5f0ff" }}>
              <div
                className="h-full rounded-md"
                style={{ width: `${(count / max) * 100}%`, background: "#a89ae8", boxShadow: "inset -3px 0 0 0 #6b3abf" }}
              />
            </div>
            <span className="font-mono text-xs w-24 text-right shrink-0" style={{ color: "#1a0f6e" }}>
              {count} ({((count / result.shots) * 100).toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs mt-3" style={{ color: "#7c6fcd" }}>
        {result.hasMeasure
          ? language === "ar"
            ? "تُظهر النتائج الكيوبتات التي وضعتَ عليها بوابة قياس (M)."
            : "Only qubits with a measure (M) gate are shown."
          : language === "ar"
            ? "لم تضع بوابات قياس، فقيست كل الكيوبتات المستخدمة في النهاية."
            : "No measure gates, so every qubit you used is measured at the end."}{" "}
        {language === "ar"
          ? "هذه محاكاة مثالية بلا ضجيج، فالأعداد تتغير قليلاً في كل مرة."
          : "This is a noise-free simulation, so counts wobble a little from run to run."}
      </p>
      {result.skippedIncomplete > 0 && (
        <p className="text-xs mt-1 font-bold" style={{ color: "#a0361d" }}>
          {language === "ar"
            ? `تم تجاهل ${result.skippedIncomplete} بوابة غير مكتملة (CNOT أو SWAP بلا كيوبت ثانٍ).`
            : `${result.skippedIncomplete} unfinished gate(s) ignored (a CNOT or SWAP with no second qubit).`}
        </p>
      )}
    </div>
  );
}

export default function CircuitPage() {
  const { role, teacherState, updateTeacherState, synced, language } = useApp();
  const isTeacher = role === "teacher";
  const isRTL = language === "ar";
  const [localGates, setLocalGates] = useState<CircuitGate[]>([]);
  const [selectedGate, setSelectedGate] = useState<string>("H");
  const [result, setResult] = useState<RunResult | null>(null);

  const gates: CircuitGate[] = isTeacher || synced ? teacherState.circuitGates : localGates;
  const editable = isTeacher || !synced;

  const setGates = (next: CircuitGate[]) => {
    if (isTeacher) updateTeacherState({ circuitGates: next });
    else setLocalGates(next);
    setResult(null);
  };

  const qasm = useMemo(() => generateQASM(gates), [gates]);

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-0 overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      {/* Circuit canvas */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 px-4 py-2 shrink-0 bg-white" style={{ borderBottom: "2px solid #fce4e4" }}>
          <h2 className="font-black text-base" style={{ color: "#1a0f6e" }}>{t(language, "circuitLab")}</h2>
          <p className="text-xs" style={{ color: "#7c6fcd" }}>
            {language === "en"
              ? "Pick a gate, then click a cell (or drag the gate on). Time runs left to right."
              : "اختر بوابة ثم انقر خلية (أو اسحب البوابة). يسير الزمن من اليسار إلى اليمين."}
          </p>
          <div className="ms-auto flex items-center gap-2">
            {editable && (
              <>
                <button
                  onClick={() => setResult(runCircuit(gates))}
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
              <>
                <button
                  onClick={() => setResult(runCircuit(gates))}
                  className="px-3 py-1 rounded-lg text-xs font-black"
                  style={{ background: "#1a0f6e", color: "white" }}
                >
                  {t(language, "runCircuit")}
                </button>
                <span className="text-xs font-medium" style={{ color: "#3a7abf" }}>● {t(language, "synced")}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4" style={{ background: "#fce4e4" }}>
          <div className="rounded-2xl p-4 bg-white" style={{ border: "2px solid #f0b8b8" }}>
            <QuantumCircuit gates={gates} onChange={editable ? setGates : undefined} selectedGate={selectedGate} />
          </div>
          {result && <Histogram result={result} language={language} />}
        </div>
      </div>

      {/* Side panel */}
      <div
        className="lg:w-60 shrink-0 flex flex-col overflow-y-auto"
        style={{ background: "#fce4e4", borderInlineStart: "2px solid #f0b8b8" }}
      >
        <div className="p-3 shrink-0">
          <p className="font-black text-sm mb-2" style={{ color: "#1a0f6e" }}>{t(language, "gates")}</p>
          <GatePalette selected={selectedGate} onSelect={setSelectedGate} />
          {editable && (
            <>
              <p className="text-xs font-bold mt-4 mb-2" style={{ color: "#6b3abf" }}>{t(language, "exampleCircuits")}</p>
              <div className="space-y-1">
                {EXAMPLE_CIRCUITS.map((ex) => (
                  <button
                    key={ex.id}
                    onClick={() => setGates(cloneGates(ex.gates))}
                    className="w-full px-2 py-1.5 rounded-lg text-xs font-bold transition-all bg-white"
                    style={{ color: "#1a0f6e", border: "2px solid #c5b8f5", textAlign: isRTL ? "right" : "left" }}
                  >
                    {language === "ar" ? ex.label_ar : ex.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* QASM: always LTR and monospace, whatever the app language */}
        <div className="flex flex-col p-3" dir="ltr" style={{ borderTop: "2px solid #f0b8b8" }}>
          <p className="font-black text-xs mb-2 shrink-0" style={{ color: "#1a0f6e" }}>{t(language, "editor")}</p>
          <div
            className="rounded-xl p-3 text-xs overflow-auto"
            style={{ background: "#1a0f6e", color: "#a8d8f5", minHeight: 120, maxHeight: 260, fontFamily: "'JetBrains Mono', 'Fira Mono', Menlo, monospace" }}
          >
            <pre className="whitespace-pre-wrap" style={{ fontFamily: "inherit" }}>{qasm}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
