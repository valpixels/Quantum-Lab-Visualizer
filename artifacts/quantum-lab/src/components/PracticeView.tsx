import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { t } from "@/lib/i18n";
import type { LessonModule, PracticeTask, BlochPractice, CircuitPractice } from "@/lib/lessons";
import type { CircuitGate } from "@/lib/websocket";
import { checkBlochTask, checkCircuitTask, formatProbabilities } from "@/lib/quantum";
import BlochSphere from "@/components/BlochSphere";
import QuantumCircuit, { GatePalette } from "@/components/QuantumCircuit";

function Feedback({ state, language, extra }: { state: "idle" | "ok" | "no"; language: "en" | "ar"; extra?: string }) {
  if (state === "idle") return null;
  const ok = state === "ok";
  return (
    <p
      role="status"
      className="mt-3 p-2.5 rounded-xl text-sm font-bold"
      style={{ background: ok ? "#e8fff0" : "#fff0f4", border: `2px solid ${ok ? "#1f9d5a" : "#c2305f"}`, color: "#1a0f6e" }}
    >
      {ok ? "✓ " + t(language, "taskDone") : "✗ " + t(language, "taskNotYet")}
      {extra ? <span className="block font-mono text-xs font-normal mt-1" dir="ltr">{extra}</span> : null}
    </p>
  );
}

function BlochTask({ task, onDone }: { task: BlochPractice; onDone: () => void }) {
  const { language } = useApp();
  const [theta, setTheta] = useState(0);
  const [phi, setPhi] = useState(0);
  const [state, setState] = useState<"idle" | "ok" | "no">("idle");
  const p0 = Math.cos(theta / 2) ** 2;
  const change = (th: number, ph: number) => {
    setTheta(th);
    setPhi(ph);
    setState("idle");
  };
  const check = () => {
    const ok = checkBlochTask(theta, phi, task.spec);
    setState(ok ? "ok" : "no");
    if (ok) onDone();
  };
  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-56 h-56 rounded-2xl overflow-hidden shrink-0" style={{ background: "#f5f0ff", border: "2px solid #c5b8f5" }}>
          <BlochSphere theta={theta} phi={phi} interactive onStateChange={change} dragMode="state" />
        </div>
        <div className="flex-1 min-w-0" dir="ltr">
          <label className="block text-xs mb-1 font-medium" style={{ color: "#7c6fcd" }}>θ (polar)</label>
          <input type="range" min={0} max={Math.PI} step={0.01} value={theta}
            onChange={(e) => change(parseFloat(e.target.value), phi)} className="w-full mb-3 accent-purple-400" />
          <label className="block text-xs mb-1 font-medium" style={{ color: "#7c6fcd" }}>φ (azimuthal)</label>
          <input type="range" min={0} max={Math.PI * 2} step={0.01} value={phi}
            onChange={(e) => change(theta, parseFloat(e.target.value))} className="w-full mb-3 accent-blue-400" />
          <p className="text-xs font-mono font-bold" style={{ color: "#1a0f6e" }}>
            P(|0⟩) = {(p0 * 100).toFixed(1)}%   P(|1⟩) = {((1 - p0) * 100).toFixed(1)}%
          </p>
        </div>
      </div>
      <button onClick={check} className="mt-3 px-4 py-2 rounded-xl text-sm font-black" style={{ background: "#1a0f6e", color: "white" }}>
        {t(language, "checkAnswer")}
      </button>
      <Feedback state={state} language={language} />
    </div>
  );
}

function CircuitTask({ task, onDone }: { task: CircuitPractice; onDone: () => void }) {
  const { language } = useApp();
  const [gates, setGates] = useState<CircuitGate[]>([]);
  const [selected, setSelected] = useState(task.palette[0] ?? "H");
  const [state, setState] = useState<"idle" | "ok" | "no">("idle");
  const [probs, setProbs] = useState<string>("");
  const change = (g: CircuitGate[]) => {
    setGates(g);
    setState("idle");
  };
  const check = () => {
    const r = checkCircuitTask(gates, task.spec);
    setProbs(formatProbabilities(r.probabilities));
    setState(r.ok ? "ok" : "no");
    if (r.ok) onDone();
  };
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-40 shrink-0">
          <GatePalette selected={selected} onSelect={setSelected} only={task.palette} columns={3} />
        </div>
        <div className="flex-1 min-w-0 overflow-x-auto rounded-2xl p-3 bg-white" style={{ border: "2px solid #f0b8b8" }}>
          <QuantumCircuit gates={gates} onChange={change} selectedGate={selected}
            numQubits={task.spec.numQubits} numSteps={task.numSteps} />
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button onClick={check} className="px-4 py-2 rounded-xl text-sm font-black" style={{ background: "#1a0f6e", color: "white" }}>
          {t(language, "checkAnswer")}
        </button>
        <button onClick={() => change([])} className="px-4 py-2 rounded-xl text-sm font-bold" style={{ background: "#fce4e4", color: "#1a0f6e" }}>
          {t(language, "clearCircuit")}
        </button>
      </div>
      <Feedback state={state} language={language} extra={state === "idle" ? undefined : probs} />
    </div>
  );
}

export default function PracticeView({ lesson }: { lesson: LessonModule }) {
  const { language, reportProgress, myTasks } = useApp();
  const isRTL = language === "ar";
  const tasks: PracticeTask[] = lesson.practice ?? [];
  const [idx, setIdx] = useState(0);
  const [hint, setHint] = useState(false);
  const task = tasks[idx];

  if (!task) {
    return (
      <p className="text-sm py-6 text-center" style={{ color: "#7c6fcd" }}>
        {language === "ar" ? "لا توجد مهام تدريب لهذا الدرس." : "There are no practice tasks for this lesson."}
      </p>
    );
  }

  const done = (id: string) => myTasks.includes(`${lesson.id}:${id}`) || myTasks.includes(id);
  const finish = () => {
    reportProgress({ kind: "task", lessonId: lesson.id, taskId: task.id });
  };
  const go = (i: number) => {
    setIdx(i);
    setHint(false);
  };
  const doneCount = tasks.filter((x) => done(x.id)).length;

  return (
    <div className="max-w-2xl mx-auto" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {tasks.map((x, i) => (
          <button key={x.id} onClick={() => go(i)} aria-current={i === idx}
            className="px-3 py-1.5 rounded-xl text-xs font-bold"
            style={{
              background: i === idx ? "#1a0f6e" : "white",
              color: i === idx ? "white" : "#1a0f6e",
              border: `2px solid ${done(x.id) ? "#1f9d5a" : i === idx ? "#1a0f6e" : "#c5b8f5"}`,
            }}>
            {done(x.id) ? "✓ " : ""}{i + 1}{x.challenge ? " ★" : ""}
          </button>
        ))}
        <span className="text-xs font-bold ms-auto" style={{ color: "#7c6fcd" }}>
          {doneCount} / {tasks.length} {t(language, "tasksDone")}
        </span>
      </div>

      <h3 className="text-lg font-black mb-2" style={{ color: "#1a0f6e" }}>
        {task.challenge && (
          <span className="text-xs px-2 py-0.5 rounded-full me-2 align-middle" style={{ background: "#f5e8a8", color: "#6e5c0f", border: "2px solid #b89a10" }}>
            ★ {t(language, "challenge")}
          </span>
        )}
        {language === "ar" ? task.prompt_ar : task.prompt}
      </h3>

      <button onClick={() => setHint((h) => !h)} className="text-xs font-bold underline mb-3" style={{ color: "#6b3abf" }}>
        {t(language, "showHint")}
      </button>
      {hint && (
        <p className="text-sm mb-3 p-2.5 rounded-xl" style={{ background: "#f5f0ff", color: "#3a2a6e" }}>
          {language === "ar" ? task.hint_ar : task.hint}
        </p>
      )}

      {/* key forces a fresh workspace per task */}
      {task.kind === "bloch" ? (
        <BlochTask key={task.id} task={task} onDone={finish} />
      ) : (
        <CircuitTask key={task.id} task={task} onDone={finish} />
      )}

      <div className="flex justify-between mt-6">
        <button onClick={() => go(Math.max(0, idx - 1))} disabled={idx === 0}
          className="px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-30" style={{ background: "#fce4e4", color: "#1a0f6e" }}>
          {isRTL ? "→" : "←"} {t(language, "prevSection")}
        </button>
        <button onClick={() => go(Math.min(tasks.length - 1, idx + 1))} disabled={idx >= tasks.length - 1}
          className="px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-30" style={{ background: "#1a0f6e", color: "white" }}>
          {t(language, "nextSection")} {isRTL ? "←" : "→"}
        </button>
      </div>
    </div>
  );
}
