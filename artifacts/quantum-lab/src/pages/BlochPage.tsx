import { useState } from "react";
import BlochSphere from "@/components/BlochSphere";
import { useApp } from "@/context/AppContext";
import { t } from "@/lib/i18n";

const PRESET_STATES = [
  { label: "|0⟩", theta: 0, phi: 0 },
  { label: "|1⟩", theta: Math.PI, phi: 0 },
  { label: "|+⟩", theta: Math.PI / 2, phi: 0 },
  { label: "|-⟩", theta: Math.PI / 2, phi: Math.PI },
  { label: "|i⟩", theta: Math.PI / 2, phi: Math.PI / 2 },
  { label: "|-i⟩", theta: Math.PI / 2, phi: (3 * Math.PI) / 2 },
];

export default function BlochPage() {
  const { role, teacherState, updateTeacherState, synced, language } = useApp();
  const isTeacher = role === "teacher";
  const isRTL = language === "ar";

  const teacherTheta = teacherState.blochState.theta;
  const teacherPhi = teacherState.blochState.phi;

  const [localTheta, setLocalTheta] = useState(teacherTheta);
  const [localPhi, setLocalPhi] = useState(teacherPhi);
  const [dragMode, setDragMode] = useState<"state" | "view">("state");

  const displayTheta = synced && !isTeacher ? teacherTheta : localTheta;
  const displayPhi = synced && !isTeacher ? teacherPhi : localPhi;
  const interactive = isTeacher || !synced;

  const handleStateChange = (th: number, ph: number) => {
    setLocalTheta(th);
    setLocalPhi(ph);
    if (isTeacher) updateTeacherState({ blochState: { theta: th, phi: ph } });
  };

  const handlePreset = (th: number, ph: number) => {
    handleStateChange(th, ph);
  };

  const p0 = Math.cos(displayTheta / 2) ** 2;
  const p1 = Math.sin(displayTheta / 2) ** 2;

  return (
    <div className="flex flex-col h-full p-4 gap-4" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="font-black text-xl" style={{ color: "#1a0f6e" }}>
            {t(language, "blochSphereTitle")}
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "#7c6fcd" }}>
            {t(language, "blochSphereSubtitle")}
          </p>
        </div>
        {!isTeacher && synced && (
          <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: "#3a7abf" }}>
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            {t(language, "syncedToTeacher")}
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
        {/* Sphere */}
        <div
          className="flex-1 min-h-[320px] rounded-2xl overflow-hidden"
          style={{ background: "white", border: "3px solid #c5b8f5" }}
        >
          <BlochSphere
            theta={displayTheta}
            phi={displayPhi}
            interactive={interactive}
            dragMode={interactive ? dragMode : "view"}
            onStateChange={interactive ? handleStateChange : undefined}
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-3 w-full lg:w-60 shrink-0 overflow-y-auto">
          {/* What dragging the sphere does */}
          <div className="p-3 rounded-2xl" style={{ background: "white", border: "2px solid #fce4e4" }}>
            <p className="text-xs font-black mb-2 uppercase tracking-wider" style={{ color: "#7c6fcd" }}>
              {t(language, "dragSphere")}
            </p>
            {interactive ? (
              <div className="grid grid-cols-2 gap-1.5" role="group" aria-label={t(language, "dragSphere")}>
                {(["state", "view"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    aria-pressed={dragMode === m}
                    onClick={() => setDragMode(m)}
                    className="py-1.5 rounded-xl text-xs font-black transition-all"
                    style={{
                      background: dragMode === m ? "#c5b8f5" : "white",
                      color: "#1a0f6e",
                      border: "2px solid #c5b8f5",
                    }}
                  >
                    {t(language, m === "state" ? "dragSetState" : "dragRotateView")}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs" style={{ color: "#7c6fcd" }}>{t(language, "dragViewOnly")}</p>
            )}
          </div>

          {/* State info */}
          <div
            className="p-4 rounded-2xl"
            style={{ background: "white", border: "2px solid #fce4e4" }}
          >
            <p className="text-xs font-black mb-3 uppercase tracking-wider" style={{ color: "#7c6fcd" }}>
              {t(language, "stateInfo")}
            </p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs font-medium" style={{ color: "#7c6fcd" }}>θ (theta)</span>
                <span className="text-xs font-mono font-bold" style={{ color: "#1a0f6e" }}>
                  {(displayTheta / Math.PI).toFixed(3)}π
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs font-medium" style={{ color: "#7c6fcd" }}>φ (phi)</span>
                <span className="text-xs font-mono font-bold" style={{ color: "#1a0f6e" }}>
                  {(displayPhi / Math.PI).toFixed(3)}π
                </span>
              </div>
              <div className="h-px" style={{ background: "#fce4e4" }} />
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium" style={{ color: "#7c6fcd" }}>P(|0⟩)</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 rounded-full overflow-hidden" style={{ background: "#fce4e4" }}>
                    <div className="h-full rounded-full" style={{ width: `${p0 * 100}%`, background: "#a8d8f5" }} />
                  </div>
                  <span className="text-xs font-mono font-bold w-12 text-right" style={{ color: "#1a0f6e" }}>
                    {(p0 * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium" style={{ color: "#7c6fcd" }}>P(|1⟩)</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 rounded-full overflow-hidden" style={{ background: "#fce4e4" }}>
                    <div className="h-full rounded-full" style={{ width: `${p1 * 100}%`, background: "#c5b8f5" }} />
                  </div>
                  <span className="text-xs font-mono font-bold w-12 text-right" style={{ color: "#1a0f6e" }}>
                    {(p1 * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Preset states */}
          <div
            className="p-4 rounded-2xl"
            style={{ background: "white", border: "2px solid #fce4e4" }}
          >
            <p className="text-xs font-black mb-3 uppercase tracking-wider" style={{ color: "#7c6fcd" }}>
              {t(language, "presetStates")}
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {PRESET_STATES.map((p) => (
                <button
                  key={p.label}
                  onClick={() => (interactive ? handlePreset(p.theta, p.phi) : null)}
                  disabled={!interactive}
                  className="py-2 rounded-xl text-xs font-black transition-all disabled:opacity-40"
                  style={{ background: "#a8d8f5", color: "#1a0f6e", border: "2px solid #7ac0e8" }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          {interactive && (
            <div
              className="p-4 rounded-2xl"
              style={{ background: "white", border: "2px solid #fce4e4" }}
            >
              <p className="text-xs font-black mb-3 uppercase tracking-wider" style={{ color: "#7c6fcd" }}>
                {t(language, "adjust")}
              </p>
              <label className="block text-xs mb-1 font-medium" style={{ color: "#7c6fcd" }}>θ (polar)</label>
              <input
                type="range" min={0} max={Math.PI} step={0.01} value={localTheta}
                onChange={(e) => handleStateChange(parseFloat(e.target.value), localPhi)}
                className="w-full mb-3 accent-purple-400"
              />
              <label className="block text-xs mb-1 font-medium" style={{ color: "#7c6fcd" }}>φ (azimuthal)</label>
              <input
                type="range" min={0} max={Math.PI * 2} step={0.01} value={localPhi}
                onChange={(e) => handleStateChange(localTheta, parseFloat(e.target.value))}
                className="w-full accent-blue-400"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
