import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { t } from "@/lib/i18n";
import Dashboard from "@/pages/Dashboard";
import LessonsPage from "@/pages/LessonsPage";
import BlochPage from "@/pages/BlochPage";
import CircuitPage from "@/pages/CircuitPage";
import SurveyPage from "@/pages/SurveyPage";
import { LESSONS, TOTAL_DAYS } from "@/lib/lessons";

type View = "home" | "lessons" | "bloch" | "circuit" | "survey";

export default function AppLayout() {
  const {
    role, clientName, synced, unsync, resync, clients,
    teacherState, updateTeacherState, connected, language, setLanguage,
    selfTeachingMode, programStartDate, currentDay,
  } = useApp();

  const isTeacher = role === "teacher";
  const isRTL = language === "ar";
  const [localView, setLocalView] = useState<View>("home");
  const [localLessonId, setLocalLessonId] = useState<string | undefined>();
  const [surveyOpen, setSurveyOpen] = useState(false);

  const displayView: View = (() => {
    if (isTeacher) {
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
    if (isTeacher) {
      if (v === "bloch") updateTeacherState({ activeView: "bloch" });
      else if (v === "circuit") updateTeacherState({ activeView: "circuit" });
      else updateTeacherState({ activeView: "lessons" });
    }
    setLocalView(v === "home" ? "home" : v);
    if (lessonId) {
      setLocalLessonId(lessonId);
      setLocalView("lessons");
    }
  };

  const teacherOnline = clients.some((c) => c.role === "teacher");
  const studentCount = clients.filter((c) => c.role === "student").length;

  const navTabs: { id: View; label: string }[] = [
    { id: "home", label: language === "ar" ? "الرئيسية" : "Home" },
    { id: "lessons", label: t(language, "lessons") },
    { id: "bloch", label: t(language, "blochSphere") },
    { id: "circuit", label: t(language, "circuitLab") },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: "hsl(350 100% 97%)" }} dir={isRTL ? "rtl" : "ltr"}>
      {/* Top nav — matching the design slide */}
      <header
        className="flex items-center justify-between px-4 py-2.5 shrink-0"
        style={{ background: "hsl(350 100% 93%)", borderBottom: "2px solid hsl(340 40% 88%)" }}
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" style={{ color: "#1a0f6e" }}>
            <rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.7" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.4" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.4" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.7" />
          </svg>
        </div>

        {/* Tab nav */}
        <nav className="flex items-center gap-1">
          {navTabs.map((tab) => {
            const isActive = displayView === tab.id || (displayView === "lessons" && tab.id === "lessons");
            return (
              <button
                key={tab.id}
                onClick={() => handleNavigate(tab.id)}
                disabled={!isTeacher && synced && (tab.id === "bloch" || tab.id === "circuit" || tab.id === "lessons")}
                className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all disabled:opacity-40"
                style={{
                  background: isActive ? "#1a0f6e" : "transparent",
                  color: isActive ? "white" : "#1a0f6e",
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/* Session info */}
          <div className="hidden md:flex items-center gap-2 text-xs" style={{ color: "#7c6fcd" }}>
            {teacherOnline ? (
              <span className="flex items-center gap-1 font-bold" style={{ color: "#6b3abf" }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#6b3abf" }} />
                {t(language, "teacherOnline")}
              </span>
            ) : (
              <span>{t(language, "noTeacher")}</span>
            )}
            <span>·</span>
            <span>{studentCount} {t(language, studentCount === 1 ? "student_one" : "students")}</span>
          </div>

          {/* Sync toggle */}
          {isTeacher ? (
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-bold"
              style={{ background: "#ddd4f8", color: "#1a0f6e" }}
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              </svg>
              {t(language, "teacher")}
            </div>
          ) : synced ? (
            <button
              onClick={unsync}
              className="flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-bold transition-all"
              style={{ background: "#a8d8f5", color: "#1a0f6e" }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              {t(language, "synced")} · {t(language, "unsync")}
            </button>
          ) : (
            <button
              onClick={resync}
              className="flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-bold transition-all"
              style={{ background: "#f5f0ff", color: "#1a0f6e", border: "1px solid #c5b8f5" }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#c5b8f5" }} />
              {t(language, "unsynced")} · {t(language, "resync")}
            </button>
          )}

          {/* Language toggle */}
          <button
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className="px-2 py-1 rounded-xl text-xs font-bold"
            style={{ background: "#c5b8f5", color: "#1a0f6e" }}
          >
            {t(language, "language")}
          </button>

          <div className="text-xs font-medium hidden sm:block" style={{ color: "#7c6fcd" }}>
            {clientName}
          </div>

          {/* Connection */}
          <div className={`w-2 h-2 rounded-full ${connected ? "bg-green-400" : "bg-amber-400 animate-pulse"}`} />
        </div>
      </header>

      {/* Sync banners */}
      {!isTeacher && synced && (
        <div
          className="px-4 py-1.5 flex items-center gap-2 text-xs font-medium shrink-0"
          style={{ background: "#e8f4ff", borderBottom: "1px solid #c8e8f8", color: "#1a4a6e" }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          {t(language, "syncedBanner")}
          <button onClick={unsync} className="ml-auto underline" style={{ color: "#1a4a6e" }}>
            {t(language, "unsyncToExplore")}
          </button>
        </div>
      )}
      {!isTeacher && !synced && (
        <div
          className="px-4 py-1.5 flex items-center gap-2 text-xs font-medium shrink-0"
          style={{ background: "#fff8e8", borderBottom: "1px solid #f5e4b8", color: "#6e4a0f" }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          {t(language, "unsyncedBanner")}
          <button onClick={resync} className="ml-auto underline" style={{ color: "#6e4a0f" }}>
            {t(language, "resyncToTeacher")}
          </button>
        </div>
      )}

      {/* Final day survey prompt */}
      {isFinalDay && !surveyOpen && (
        <div
          className="px-4 py-2 flex items-center gap-3 text-xs font-medium shrink-0"
          style={{ background: "#ddd4f8", borderBottom: "2px solid #c5b8f5" }}
        >
          <span style={{ color: "#1a0f6e" }}>
            {language === "en" ? "🎓 You've completed the full program! Please share your feedback." : "🎓 أكملت البرنامج كاملاً! يرجى مشاركة ملاحظاتك."}
          </span>
          <button
            onClick={() => setSurveyOpen(true)}
            className="ml-auto px-3 py-1 rounded-lg font-bold"
            style={{ background: "#1a0f6e", color: "white" }}
          >
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
        ) : (
          <Dashboard onNavigate={handleNavigate} />
        )}
      </main>
    </div>
  );
}
