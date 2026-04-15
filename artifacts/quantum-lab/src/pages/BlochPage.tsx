import { useState } from "react";
import BlochSphere from "@/components/BlochSphere";
import { useApp } from "@/context/AppContext";

const PRESET_STATES = [
  { label: "|0⟩", theta: 0, phi: 0 },
  { label: "|1⟩", theta: Math.PI, phi: 0 },
  { label: "|+⟩", theta: Math.PI / 2, phi: 0 },
  { label: "|-⟩", theta: Math.PI / 2, phi: Math.PI },
  { label: "|i⟩", theta: Math.PI / 2, phi: Math.PI / 2 },
  { label: "|-i⟩", theta: Math.PI / 2, phi: (3 * Math.PI) / 2 },
];

export default function BlochPage() {
  const { role, teacherState, updateTeacherState, synced } = useApp();
  const isTeacher = role === "teacher";

  const theta = teacherState.blochState.theta;
  const phi = teacherState.blochState.phi;

  const [localTheta, setLocalTheta] = useState(theta);
  const [localPhi, setLocalPhi] = useState(phi);

  const displayTheta = isTeacher || !synced ? localTheta : theta;
  const displayPhi = isTeacher || !synced ? localPhi : phi;

  const handleStateChange = (th: number, ph: number) => {
    if (isTeacher) {
      updateTeacherState({ blochState: { theta: th, phi: ph } });
    }
    setLocalTheta(th);
    setLocalPhi(ph);
  };

  const handlePreset = (th: number, ph: number) => {
    setLocalTheta(th);
    setLocalPhi(ph);
    if (isTeacher) {
      updateTeacherState({ blochState: { theta: th, phi: ph } });
    }
  };

  const syncedTheta = synced ? theta : localTheta;
  const syncedPhi = synced ? phi : localPhi;

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-white text-lg">Bloch Sphere</h2>
          <p className="text-gray-400 text-xs">3D visualization of qubit state</p>
        </div>
        {!isTeacher && synced && (
          <div className="flex items-center gap-1.5 text-xs text-cyan-400">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Synced to teacher
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
        <div className="flex-1 min-h-[320px] bg-gray-950/60 rounded-2xl border border-gray-800 overflow-hidden">
          <BlochSphere
            theta={synced && !isTeacher ? theta : localTheta}
            phi={synced && !isTeacher ? phi : localPhi}
            interactive={isTeacher || !synced}
            onStateChange={isTeacher || !synced ? handleStateChange : undefined}
          />
        </div>

        <div className="flex flex-col gap-4 w-full lg:w-64">
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
            <p className="text-xs font-medium text-gray-400 mb-3 uppercase tracking-wider">State Info</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs">θ (theta)</span>
                <span className="text-white text-xs font-mono">
                  {((synced && !isTeacher ? theta : localTheta) / Math.PI).toFixed(3)}π
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs">φ (phi)</span>
                <span className="text-white text-xs font-mono">
                  {((synced && !isTeacher ? phi : localPhi) / Math.PI).toFixed(3)}π
                </span>
              </div>
              <div className="h-px bg-gray-800 my-2" />
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs">P(|0⟩)</span>
                <span className="text-emerald-400 text-xs font-mono">
                  {(Math.cos((synced && !isTeacher ? theta : localTheta) / 2) ** 2).toFixed(3)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs">P(|1⟩)</span>
                <span className="text-indigo-400 text-xs font-mono">
                  {(Math.sin((synced && !isTeacher ? theta : localTheta) / 2) ** 2).toFixed(3)}
                </span>
              </div>
            </div>
          </div>

          {(isTeacher || !synced) && (
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
              <p className="text-xs font-medium text-gray-400 mb-3 uppercase tracking-wider">Preset States</p>
              <div className="grid grid-cols-3 gap-1.5">
                {PRESET_STATES.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => handlePreset(p.theta, p.phi)}
                    className="py-1.5 rounded-lg bg-gray-800 hover:bg-indigo-600/30 border border-gray-700 hover:border-indigo-500/50 text-xs font-mono text-white transition-all"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(isTeacher || !synced) && (
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
              <p className="text-xs font-medium text-gray-400 mb-3 uppercase tracking-wider">Adjust</p>
              <label className="block mb-1 text-xs text-gray-400">θ (polar)</label>
              <input
                type="range"
                min={0}
                max={Math.PI}
                step={0.01}
                value={localTheta}
                onChange={(e) => handleStateChange(parseFloat(e.target.value), localPhi)}
                className="w-full accent-indigo-500 mb-3"
              />
              <label className="block mb-1 text-xs text-gray-400">φ (azimuthal)</label>
              <input
                type="range"
                min={0}
                max={Math.PI * 2}
                step={0.01}
                value={localPhi}
                onChange={(e) => handleStateChange(localTheta, parseFloat(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
