import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { t } from "@/lib/i18n";

const HelpIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
    <circle cx="12" cy="17" r=".5" fill="currentColor" />
  </svg>
);

const QubitIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="9" />
    <ellipse cx="12" cy="12" rx="9" ry="3.5" opacity="0.6" transform="rotate(45 12 12)" />
    <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
  </svg>
);

const GridIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

export default function JoinPage() {
  const { join, joinError, connected, language, setLanguage } = useApp();
  const [name, setName] = useState("");
  const [selectedRole, setSelectedRole] = useState<"teacher" | "student" | null>(null);
  const [joining, setJoining] = useState(false);

  const isRTL = language === "ar";

  function handleJoin() {
    if (!selectedRole || !name.trim() || !connected) return;
    setJoining(true);
    join(selectedRole, name.trim());
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen flex flex-col" style={{ background: "hsl(350 100% 97%)" }}>
      {/* Top nav with icons */}
      <nav className="flex items-center justify-between px-6 py-3" style={{ background: "hsl(350 100% 93%)", borderBottom: "1px solid hsl(340 40% 88%)" }}>
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" style={{ color: "#1a0f6e" }}>
            <rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.7" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.4" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.4" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.7" />
          </svg>
        </div>

        <div className="flex items-center gap-1">
          {[
            { icon: <HelpIcon />, label: t(language, "help") },
            { icon: <QubitIcon />, label: t(language, "qubit") },
            { icon: <GridIcon />, label: t(language, "grid") },
          ].map(({ icon, label }) => (
            <button
              key={label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
              style={{ color: "#1a0f6e" }}
              title={label}
            >
              <span style={{ color: "#1a0f6e" }}>{icon}</span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
          <button
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all"
            style={{ background: "#c5b8f5", color: "#1a0f6e", border: "2px solid #a89ae8" }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
            </svg>
            {t(language, "language")}
          </button>
        </div>
      </nav>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 relative">
        {/* Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-20" style={{ background: "#c5b8f5", filter: "blur(60px)" }} />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-20" style={{ background: "#a8d8f5", filter: "blur(60px)" }} />
        </div>

        <div className="w-full max-w-sm text-center relative">
          {/* Logo */}
          <div className="flex justify-center mb-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md" style={{ background: "#c5b8f5" }}>
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#1a0f6e" strokeWidth="1.5" />
                <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#1a0f6e" strokeWidth="1.2" opacity="0.6" transform="rotate(40 12 12)" />
                <circle cx="12" cy="12" r="2" fill="#1a0f6e" />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl font-black mb-1" style={{ color: "#1a0f6e" }}>
            {language === "en"
              ? <><span>Quantum</span> <span style={{ color: "#7c6fcd" }}>Lab</span></>
              : <><span style={{ color: "#7c6fcd" }}>مختبر</span> <span>الكم</span></>}
          </h1>
          <p className="text-sm mb-6" style={{ color: "#7c6fcd" }}>{t(language, "appSubtitle")}</p>

          {/* Connection status */}
          <div className="flex items-center justify-center gap-1.5 mb-5 text-xs" style={{ color: connected ? "#22c55e" : "#f59e0b" }}>
            <div className={`w-2 h-2 rounded-full ${connected ? "bg-green-400" : "bg-amber-400 animate-pulse"}`} />
            {connected ? t(language, "connectedToServer") : t(language, "connecting")}
          </div>

          {/* Name input */}
          <input
            type="text"
            placeholder={t(language, "namePlaceholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            dir={isRTL ? "rtl" : "ltr"}
            className="w-full px-4 py-3 rounded-2xl text-sm font-medium mb-5 outline-none transition-all"
            style={{ background: "#fce4e4", border: "2px solid #f0b8b8", color: "#1a0f6e" }}
          />

          {/* Role selection */}
          <p className="text-sm font-bold mb-3" style={{ color: "#1a0f6e" }}>{t(language, "joinAs")}</p>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button onClick={() => setSelectedRole("student")} className="p-4 rounded-2xl transition-all text-center"
              style={{ background: selectedRole === "student" ? "#a8d8f5" : "#c8eaf8", border: `3px solid ${selectedRole === "student" ? "#7ac0e8" : "#a8d8f5"}`, color: "#1a0f6e" }}>
              <div className="text-lg font-bold">{t(language, "student")}</div>
              <div className="text-xs mt-0.5 opacity-70">{t(language, "studentDesc")}</div>
              <div className="mt-2 flex justify-center">
                <svg className="w-6 h-6 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="7" r="4" />
                  <path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
                </svg>
              </div>
            </button>

            <button onClick={() => setSelectedRole("teacher")} className="p-4 rounded-2xl transition-all text-center"
              style={{ background: selectedRole === "teacher" ? "#c5b8f5" : "#ddd4f8", border: `3px solid ${selectedRole === "teacher" ? "#a89ae8" : "#c5b8f5"}`, color: "#1a0f6e" }}>
              <div className="text-lg font-bold">{t(language, "teacher")}</div>
              <div className="text-xs mt-0.5 opacity-70">{t(language, "teacherDesc")}</div>
              <div className="mt-2 flex justify-center">
                <svg className="w-6 h-6 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </div>
            </button>
          </div>

          {joinError && (
            <div className="mb-4 px-3 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: "#fee2e2", border: "1px solid #fca5a5", color: "#991b1b" }}>
              {joinError}
            </div>
          )}

          <button onClick={handleJoin} disabled={!selectedRole || !name.trim() || !connected}
            className="px-10 py-3 rounded-2xl text-base font-bold transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "#f0a0b8", color: "#1a0f6e", border: "none" }}>
            {joining ? t(language, "joiningSession") : t(language, "ok")}
          </button>

          <p className="mt-4 text-xs" style={{ color: "#9b8abf" }}>{t(language, "oneTeacherNote")}</p>
        </div>
      </div>
    </div>
  );
}
