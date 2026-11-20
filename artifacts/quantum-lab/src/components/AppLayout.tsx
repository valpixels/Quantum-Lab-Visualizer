import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { t } from "@/lib/i18n";
import Dashboard from "@/pages/Dashboard";
import LessonsPage from "@/pages/LessonsPage";
import BlochPage from "@/pages/BlochPage";
import CircuitPage from "@/pages/CircuitPage";
import SurveyPage from "@/pages/SurveyPage";
import ClassPage from "@/pages/ClassPage";
import { TOTAL_DAYS } from "@/lib/lessons";

type View = "home" | "lessons" | "bloch" | "circuit" | "survey" | "class";

const HomeIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);
const LessonsIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    <path d="M8 7h8M8 11h5" />
  </svg>
);
const BlochIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="9" />
    <ellipse cx="12" cy="12" rx="9" ry="3.5" opacity="0.5" transform="rotate(45 12 12)" />
    <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
    <line x1="12" y1="12" x2="12" y2="4" strokeWidth="2" />
  </svg>
);
const CircuitIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="2" y1="8" x2="22" y2="8" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <line x1="2" y1="16" x2="22" y2="16" />
    <rect x="7" y="6" width="3" height="4" rx="1" fill="currentColor" stroke="none" opacity="0.7" />
    <rect x="13" y="10" width="3" height="4" rx="1" fill="currentColor" stroke="none" opacity="0.7" />
    <rect x="9" y="14" width="3" height="4" rx="1" fill="currentColor" stroke="none" opacity="0.7" />
  </svg>
);
const ClassIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18" />
    <rect x="5" y="11" width="3.5" height="7" rx="1" />
    <rect x="10.25" y="6" width="3.5" height="12" rx="1" />
    <rect x="15.5" y="9" width="3.5" height="9" rx="1" />
  </svg>
);
const MegaphoneIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11l18-5v12L3 13v-2z" />
    <path d="M11.6 16.8a3 3 0 11-5.8-1.6" />
  </svg>
);
const SyncIcon = () => (
  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M4 4v5h5M20 20v-5h-5M20 9a8 8 0 00-14.93-2M4 15a8 8 0 0014.93 2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const TeacherBadgeIcon = () => (
  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" strokeLinecap="round" />
  </svg>
);

function BroadcastPanel({ onClose }: { onClose: () => void }) {
  const { sendBroadcast, language, clients } = useApp();
  const isRTL = language === "ar";
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!text.trim()) return;
    sendBroadcast(text.trim());
    setSent(true);
    setText("");
    setTimeout(() => setSent(false), 2000);
  };

  const studentCount = clients.filter((c) => c.role === "student").length;

  return (
    <div className="absolute top-full end-0 mt-2 w-72 rounded-2xl solid-shadow z-50 overflow-hidden" style={{ background: "white", border: "2px solid #c5b8f5" }} dir={isRTL ? "rtl" : "ltr"}>
      <div className="p-3" style={{ background: "#ddd4f8", borderBottom: "2px solid #c5b8f5" }}>
        <div className="flex items-center justify-between">
          <p className="font-black text-sm" style={{ color: "#1a0f6e" }}>
            {language === "en" ? "Broadcast to Students" : "بث رسالة للطلاب"}
          </p>
          <button onClick={onClose} className="text-lg font-bold" style={{ color: "#7c6fcd" }}>×</button>
        </div>
        <p className="text-xs mt-0.5" style={{ color: "#6b3abf" }}>
          {language === "en" ? `${studentCount} student${studentCount !== 1 ? "s" : ""} online` : `${studentCount} طالب متصل`}
        </p>
      </div>
      <div className="p-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={language === "en" ? "Type a message for all students..." : "اكتب رسالة لجميع الطلاب..."}
          rows={3}
          maxLength={280}
          dir={isRTL ? "rtl" : "ltr"}
          className="w-full p-2 rounded-xl text-sm resize-none outline-none"
          style={{ background: "#fce4e4", border: "none", color: "#1a0f6e" }}
          onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSend(); }}
        />
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs" style={{ color: "#9b8abf" }}>
            {text.length}/280 · {language === "en" ? "Ctrl+Enter to send" : "Ctrl+Enter للإرسال"}
          </p>
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className="px-4 py-1.5 rounded-xl text-xs font-black disabled:opacity-40 transition-all"
            style={{ background: sent ? "#a8f5c8" : "#1a0f6e", color: sent ? "#1a6e3a" : "white" }}
          >
            {sent ? (language === "en" ? "Sent!" : "تم الإرسال!") : (language === "en" ? "Send" : "إرسال")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AppLayout() {
  const {
    role, clientName, room, leave, synced, unsync, resync, clients,
    teacherState, updateTeacherState, connected, language, setLanguage,
    selfTeachingMode, programStartDate, currentDay,
    broadcastMessages, dismissBroadcast,
  } = useApp();

  const isTeacher = role === "teacher";
  const isRTL = language === "ar";
  const [localView, setLocalView] = useState<View>("home");
  const [localLessonId, setLocalLessonId] = useState<string | undefined>();
  const [surveyOpen, setSurveyOpen] = useState(false);
  const [broadcastOpen, setBroadcastOpen] = useState(false);

  const displayView: View = (() => {
    if (isTeacher) {
      if (localView === "class") return "class";
      if (teacherState.activeView === "bloch") return "bloch";
      if (teacherState.activeView === "circuit") return "circuit";
      return localView;
    }
    if (synced) {
      if (teacherState.activeView === "bloch") return "bloch";
      if (teacherState.activeView === "circuit") return "circuit";
      if (teacherState.currentLessonId) return "lessons";
      return "home";
    }
    return localView;
  })();

  const isFinalDay = selfTeachingMode && programStartDate && currentDay >= TOTAL_DAYS;

  const handleNavigate = (view: View | "lessons" | "bloch" | "circuit", lessonId?: string) => {
    const v = view as View;
    if (isTeacher && v !== "class") {
      // The class results page is private to the teacher, so students keep seeing what they had.
      if (v === "bloch") updateTeacherState({ activeView: "bloch" });
      else if (v === "circuit") updateTeacherState({ activeView: "circuit" });
      else updateTeacherState({ activeView: "lessons" });
    }
    if (lessonId) {
      setLocalLessonId(lessonId);
      setLocalView("lessons");
    } else {
      setLocalView(v === "home" ? "home" : v);
    }
  };

  const teacherOnline = clients.some((c) => c.role === "teacher");
  const studentCount = clients.filter((c) => c.role === "student").length;

  const navTabs: { id: View; icon: React.ReactNode; label: string }[] = [
    { id: "home", icon: <HomeIcon />, label: language === "ar" ? "الرئيسية" : "Home" },
    { id: "lessons", icon: <LessonsIcon />, label: t(language, "lessons") },
    { id: "bloch", icon: <BlochIcon />, label: t(language, "blochSphere") },
    { id: "circuit", icon: <CircuitIcon />, label: t(language, "circuitLab") },
    ...(isTeacher ? [{ id: "class" as View, icon: <ClassIcon />, label: t(language, "classResults") }] : []),
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: "hsl(350 100% 97%)" }} dir={isRTL ? "rtl" : "ltr"}>
      {/* Top nav */}
      <header className="flex items-center justify-between px-4 py-2.5 shrink-0 relative"
        style={{ background: "hsl(350 100% 93%)", borderBottom: "2px solid hsl(340 40% 88%)" }}>
        {/* Logo */}
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" style={{ color: "#1a0f6e" }}>
            <rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.7" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.4" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.4" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.7" />
          </svg>
          <span className="font-black text-sm hidden sm:block" style={{ color: "#1a0f6e" }}>
            {language === "ar" ? "مختبر الكم" : "Quantum Lab"}
          </span>
        </div>

        {/* Tab nav — icons with labels */}
        <nav className="flex items-center gap-0.5">
          {navTabs.map((tab) => {
            const isActive = displayView === tab.id;
            const disabled = !isTeacher && synced && (tab.id === "bloch" || tab.id === "circuit" || tab.id === "lessons");
            return (
              <button
                key={tab.id}
                onClick={() => !disabled && handleNavigate(tab.id)}
                disabled={disabled}
                title={tab.label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all disabled:opacity-40"
                style={{
                  background: isActive ? "#1a0f6e" : "transparent",
                  color: isActive ? "white" : "#1a0f6e",
                }}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Session info */}
          <div className="hidden lg:flex items-center gap-2 text-xs" style={{ color: "#7c6fcd" }}>
            {teacherOnline
              ? <span className="flex items-center gap-1 font-bold" style={{ color: "#6b3abf" }}><div className="w-1.5 h-1.5 rounded-full bg-violet-500" />{t(language, "teacherOnline")}</span>
              : <span>{t(language, "noTeacher")}</span>}
            <span>·</span>
            <span>{studentCount} {t(language, studentCount === 1 ? "student_one" : "students")}</span>
          </div>

          {/* Class code, shown to everyone so students can read it off the teacher's screen */}
          {room && (
            <button
              type="button"
              onClick={() => { try { void navigator.clipboard?.writeText(room); } catch { /* clipboard unavailable */ } }}
              title={t(language, "copyClassCode")}
              className="flex items-center gap-1.5 px-2 py-1 rounded-xl text-xs font-black transition-all solid-shadow-sm"
              style={{ background: "#ddd4f8", color: "#1a0f6e", border: "2px solid #6b3abf", ["--shadow-color" as string]: "#6b3abf" }}
            >
              <span className="hidden sm:inline" style={{ color: "#6b3abf" }}>{t(language, "classCode")}</span>
              <span className="font-mono tracking-widest text-sm" dir="ltr">{room}</span>
            </button>
          )}

          {/* Broadcast (teacher only) */}
          {isTeacher && (
            <div className="relative">
              <button
                onClick={() => setBroadcastOpen((o) => !o)}
                title={language === "en" ? "Broadcast message" : "بث رسالة"}
                className="flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-bold transition-all"
                style={{ background: broadcastOpen ? "#c5b8f5" : "#ddd4f8", color: "#1a0f6e" }}
              >
                <MegaphoneIcon />
                <span className="hidden sm:inline">{language === "en" ? "Broadcast" : "بث"}</span>
              </button>
              {broadcastOpen && <BroadcastPanel onClose={() => setBroadcastOpen(false)} />}
            </div>
          )}

          {/* Sync toggle */}
          {isTeacher ? (
            <div className="flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-bold" style={{ background: "#ddd4f8", color: "#1a0f6e" }}>
              <TeacherBadgeIcon />
              <span className="hidden sm:inline">{t(language, "teacher")}</span>
            </div>
          ) : synced ? (
            <button onClick={unsync} className="flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-bold transition-all"
              style={{ background: "#a8d8f5", color: "#1a0f6e" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="hidden sm:inline">{t(language, "synced")}</span>
              <SyncIcon />
            </button>
          ) : (
            <button onClick={resync} className="flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-bold transition-all"
              style={{ background: "#f5f0ff", color: "#1a0f6e", border: "1px solid #c5b8f5" }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#c5b8f5" }} />
              <span className="hidden sm:inline">{t(language, "resync")}</span>
              <SyncIcon />
            </button>
          )}

          {/* Feedback survey (students) */}
          {!isTeacher && (
            <button
              onClick={() => setSurveyOpen(true)}
              className="px-2 py-1 rounded-xl text-xs font-bold hidden sm:block"
              style={{ background: "#ddd4f8", color: "#1a0f6e" }}
            >
              {t(language, "feedback")}
            </button>
          )}

          {/* Language */}
          <button onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className="px-2 py-1 rounded-xl text-xs font-bold"
            style={{ background: "#c5b8f5", color: "#1a0f6e" }}>
            {t(language, "language")}
          </button>

          {/* Name */}
          <span className="text-xs font-medium hidden md:block" style={{ color: "#7c6fcd" }}>{clientName}</span>

          {/* Leave (important on shared lab computers) */}
          <button
            onClick={() => { if (window.confirm(t(language, "leaveConfirm"))) leave(); }}
            className="px-2 py-1 rounded-xl text-xs font-bold"
            style={{ background: "white", color: "#1a0f6e", border: "1px solid #c5b8f5" }}
          >
            {t(language, "leaveClass")}
          </button>

          {/* Connection */}
          <div
            className={`w-2 h-2 rounded-full ${connected ? "bg-green-400" : "bg-amber-400 animate-pulse"}`}
            title={connected ? t(language, "connectedToServer") : t(language, "reconnecting")}
          />
        </div>
      </header>

      {/* Connection lost banner */}
      {!connected && (
        <div className="px-4 py-1.5 text-xs font-bold shrink-0" role="status"
          style={{ background: "#fff3cd", borderBottom: "1px solid #f5e4b8", color: "#6e4a0f" }}>
          {t(language, "connectionLost")}
        </div>
      )}

      {/* Broadcast messages (students only) */}
      {broadcastMessages.length > 0 && (
        <div className="shrink-0 space-y-0.5">
          {broadcastMessages.map((msg) => (
            <div key={msg.timestamp} className="flex items-center gap-3 px-4 py-2"
              style={{ background: "#ddd4f8", borderBottom: "2px solid #c5b8f5" }}>
              <MegaphoneIcon />
              <div className="flex-1 min-w-0">
                <span className="font-black text-xs" style={{ color: "#1a0f6e" }}>{msg.from}: </span>
                <span className="text-xs" style={{ color: "#3a2a6e" }}>{msg.text}</span>
              </div>
              <button onClick={() => dismissBroadcast(msg.timestamp)}
                className="text-lg font-bold shrink-0" style={{ color: "#7c6fcd" }}>×</button>
            </div>
          ))}
        </div>
      )}

      {/* Sync banners */}
      {!isTeacher && synced && (
        <div className="px-4 py-1.5 flex items-center gap-2 text-xs font-medium shrink-0"
          style={{ background: "#e8f4ff", borderBottom: "1px solid #c8e8f8", color: "#1a4a6e" }}>
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          {t(language, "syncedBanner")}
          <button onClick={unsync} className="ms-auto underline" style={{ color: "#1a4a6e" }}>
            {t(language, "unsyncToExplore")}
          </button>
        </div>
      )}
      {!isTeacher && !synced && (
        <div className="px-4 py-1.5 flex items-center gap-2 text-xs font-medium shrink-0"
          style={{ background: "#fff8e8", borderBottom: "1px solid #f5e4b8", color: "#6e4a0f" }}>
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          {t(language, "unsyncedBanner")}
          <button onClick={resync} className="ms-auto underline" style={{ color: "#6e4a0f" }}>
            {t(language, "resyncToTeacher")}
          </button>
        </div>
      )}

      {/* Final day survey banner */}
      {isFinalDay && !surveyOpen && (
        <div className="px-4 py-2 flex items-center gap-3 text-xs font-medium shrink-0"
          style={{ background: "#ddd4f8", borderBottom: "2px solid #c5b8f5" }}>
          <span style={{ color: "#1a0f6e" }}>
            {language === "en" ? "You've completed the full program! Please share your feedback." : "أكملت البرنامج كاملاً! يرجى مشاركة ملاحظاتك."}
          </span>
          <button onClick={() => setSurveyOpen(true)} className="ms-auto px-3 py-1 rounded-lg font-bold"
            style={{ background: "#1a0f6e", color: "white" }}>
            {t(language, "survey")} →
          </button>
        </div>
      )}

      {/* Main view */}
      <main className="flex-1 overflow-auto min-h-0">
        {surveyOpen ? (
          <SurveyPage onClose={() => setSurveyOpen(false)} />
        ) : displayView === "home" ? (
          <Dashboard onNavigate={handleNavigate} />
        ) : displayView === "lessons" ? (
          <LessonsPage initialLessonId={localLessonId} onNavigate={handleNavigate} />
        ) : displayView === "bloch" ? (
          <BlochPage />
        ) : displayView === "circuit" ? (
          <CircuitPage />
        ) : displayView === "class" && isTeacher ? (
          <ClassPage />
        ) : (
          <Dashboard onNavigate={handleNavigate} />
        )}
      </main>
    </div>
  );
}
