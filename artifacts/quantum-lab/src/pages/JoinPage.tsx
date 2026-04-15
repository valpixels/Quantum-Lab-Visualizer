import { useState } from "react";
import { useApp } from "@/context/AppContext";

export default function JoinPage() {
  const { join, joinError, connected } = useApp();
  const [name, setName] = useState("");
  const [selectedRole, setSelectedRole] = useState<"teacher" | "student" | null>(null);

  function handleJoin() {
    if (!selectedRole || !name.trim()) return;
    join(selectedRole, name.trim());
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-indigo-950 to-gray-950">
      <div className="w-full max-w-md px-6">
        {/* Logo / Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 mb-4">
            <svg className="w-8 h-8 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="9" />
              <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(45 12 12)" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Quantum Lab</h1>
          <p className="text-indigo-300/70 mt-2 text-sm">Interactive Quantum Computing Classroom</p>
        </div>

        <div className="bg-gray-900/80 backdrop-blur border border-gray-800 rounded-2xl p-6 shadow-2xl">
          {/* Connection status */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`w-2 h-2 rounded-full ${connected ? "bg-emerald-400" : "bg-amber-400 animate-pulse"}`} />
            <span className="text-xs text-gray-400">{connected ? "Connected to server" : "Connecting..."}</span>
          </div>

          <label className="block text-sm font-medium text-gray-300 mb-1.5">Your name</label>
          <input
            type="text"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-5"
            placeholder="Enter your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
          />

          <p className="text-sm font-medium text-gray-300 mb-3">Join as...</p>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button
              onClick={() => setSelectedRole("teacher")}
              className={`relative p-4 rounded-xl border text-left transition-all ${
                selectedRole === "teacher"
                  ? "border-violet-500 bg-violet-500/15"
                  : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center mb-2">
                <svg className="w-4 h-4 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <div className="text-sm font-semibold text-white">Teacher</div>
              <div className="text-xs text-gray-400 mt-0.5">Control the session</div>
              {selectedRole === "teacher" && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="currentColor">
                    <path d="M8.5 2.5L4 7 1.5 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </svg>
                </div>
              )}
            </button>

            <button
              onClick={() => setSelectedRole("student")}
              className={`relative p-4 rounded-xl border text-left transition-all ${
                selectedRole === "student"
                  ? "border-cyan-500 bg-cyan-500/15"
                  : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-2">
                <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="7" r="4" />
                  <path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
                </svg>
              </div>
              <div className="text-sm font-semibold text-white">Student</div>
              <div className="text-xs text-gray-400 mt-0.5">Follow along</div>
              {selectedRole === "student" && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-cyan-500 flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="currentColor">
                    <path d="M8.5 2.5L4 7 1.5 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </svg>
                </div>
              )}
            </button>
          </div>

          {joinError && (
            <div className="mb-4 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {joinError}
            </div>
          )}

          <button
            onClick={handleJoin}
            disabled={!selectedRole || !name.trim() || !connected}
            className="w-full py-3 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
          >
            {connected ? "Join Session" : "Waiting for connection..."}
          </button>
        </div>

        <p className="text-center text-gray-600 text-xs mt-4">
          Only one teacher can be active at a time
        </p>
      </div>
    </div>
  );
}
