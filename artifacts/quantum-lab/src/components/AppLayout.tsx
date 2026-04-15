import { useState } from "react";
import { useApp } from "@/context/AppContext";
import LessonsPage from "@/pages/LessonsPage";
import BlochPage from "@/pages/BlochPage";
import CircuitPage from "@/pages/CircuitPage";

type Tab = "lessons" | "bloch" | "circuit";

export default function AppLayout() {
  const { role, clientName, synced, unsync, resync, clients, teacherState, updateTeacherState, connected } =
    useApp();

  const isTeacher = role === "teacher";
  const [localTab, setLocalTab] = useState<Tab>("lessons");

  const displayTab: Tab = isTeacher
    ? teacherState.activeView
    : synced
    ? teacherState.activeView
    : localTab;

  const handleTabChange = (tab: Tab) => {
    if (isTeacher) {
      updateTeacherState({ activeView: tab });
    } else if (!synced) {
      setLocalTab(tab);
    }
  };

  const teacherOnline = clients.some((c) => c.role === "teacher");
  const studentCount = clients.filter((c) => c.role === "student").length;

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {
      id: "lessons",
      label: "Lessons",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      ),
    },
    {
      id: "bloch",
      label: "Bloch Sphere",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(45 12 12)" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: "circuit",
      label: "Circuit",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="9" width="4" height="6" rx="1" />
          <rect x="10" y="9" width="4" height="6" rx="1" />
          <rect x="17" y="9" width="4" height="6" rx="1" />
          <line x1="7" y1="12" x2="10" y2="12" />
          <line x1="14" y1="12" x2="17" y2="12" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white overflow-hidden">
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900/80 backdrop-blur shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center">
            <svg className="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="9" />
              <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(45 12 12)" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <span className="font-semibold text-white text-sm">Quantum Lab</span>
          <div className={`hidden sm:flex items-center gap-1 text-xs ${connected ? "text-emerald-400" : "text-amber-400"}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-emerald-400" : "bg-amber-400 animate-pulse"}`} />
            {connected ? "Live" : "Reconnecting"}
          </div>
        </div>

        <nav className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              disabled={!isTeacher && synced}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                displayTab === tab.id
                  ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/40"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-default"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:block">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 text-xs text-gray-500">
            {teacherOnline ? (
              <span className="flex items-center gap-1 text-violet-400">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                Teacher online
              </span>
            ) : (
              <span>No teacher</span>
            )}
            <span>·</span>
            <span>{studentCount} student{studentCount !== 1 ? "s" : ""}</span>
          </div>

          {isTeacher ? (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-violet-600/20 border border-violet-500/30 text-xs text-violet-300">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
              </svg>
              Teacher
            </div>
          ) : synced ? (
            <button
              onClick={unsync}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-xs text-cyan-300 hover:bg-cyan-600/30 transition-colors"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Synced &middot; Unsync
            </button>
          ) : (
            <button
              onClick={resync}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gray-700/60 border border-gray-600/50 text-xs text-gray-300 hover:bg-gray-700 transition-colors"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
              Unsynced &middot; Resync
            </button>
          )}

          <div className="text-xs text-gray-500 hidden sm:block">
            {clientName}
          </div>
        </div>
      </header>

      {!isTeacher && synced && (
        <div className="px-4 py-2 bg-cyan-950/40 border-b border-cyan-900/50 text-xs text-cyan-300 flex items-center gap-2 shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Synced to teacher — navigation and visualizations are controlled by your teacher.
          <button onClick={unsync} className="ml-auto underline hover:no-underline">
            Unsync to explore independently
          </button>
        </div>
      )}

      {!isTeacher && !synced && (
        <div className="px-4 py-2 bg-amber-950/30 border-b border-amber-900/40 text-xs text-amber-400 flex items-center gap-2 shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          Exploring independently — your changes are not shared.
          <button onClick={resync} className="ml-auto underline hover:no-underline">
            Resync to teacher
          </button>
        </div>
      )}

      <main className="flex-1 overflow-auto">
        {displayTab === "lessons" && <LessonsPage />}
        {displayTab === "bloch" && <BlochPage />}
        {displayTab === "circuit" && <CircuitPage />}
      </main>
    </div>
  );
}
