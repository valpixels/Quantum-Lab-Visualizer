import { useApp } from "@/context/AppContext";
import { t } from "@/lib/i18n";
import { LESSONS, TOTAL_DAYS } from "@/lib/lessons";

type View = "lessons" | "bloch" | "circuit";

interface DashboardProps {
  onNavigate: (view: View, lessonId?: string) => void;
}

const lessonColors = [
  { bg: "#a8d8f5", num: "#3a7abf" },
  { bg: "#c5b8f5", num: "#6b3abf" },
  { bg: "#a8d8f5", num: "#3a7abf" },
  { bg: "#c5b8f5", num: "#6b3abf" },
  { bg: "#a8d8f5", num: "#3a7abf" },
  { bg: "#c5b8f5", num: "#6b3abf" },
];

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { language, role, selfTeachingMode, programStartDate, currentDay, enableSelfTeachingMode, startProgram, teacherState, updateTeacherState } = useApp();
  const isTeacher = role === "teacher";
  const isRTL = language === "ar";

  const handleLessonClick = (lessonId: string) => {
    if (isTeacher) {
      updateTeacherState({ currentLessonId: lessonId, activeView: "lessons" });
    }
    onNavigate("lessons", lessonId);
  };

  const canAccessLesson = (dayIndex: number) => {
    if (!selfTeachingMode) return true;
    if (!programStartDate) return false;
    return dayIndex <= currentDay;
  };

  return (
    <div className="p-5 max-w-2xl mx-auto" dir={isRTL ? "rtl" : "ltr"}>
      {/* Self-teaching mode banner */}
      {!selfTeachingMode ? (
        <div
          className="mb-5 p-4 rounded-2xl flex items-center justify-between gap-3 flex-wrap"
          style={{ background: "white", border: "2px solid #c5b8f5" }}
        >
          <div>
            <p className="font-bold text-sm" style={{ color: "#1a0f6e" }}>
              {t(language, "selfTeachingMode")}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#7c6fcd" }}>
              {t(language, "selfTeachingDesc")}
            </p>
          </div>
          <button
            onClick={enableSelfTeachingMode}
            className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
            style={{ background: "#c5b8f5", color: "#1a0f6e" }}
          >
            {t(language, "startProgram")}
          </button>
        </div>
      ) : !programStartDate ? (
        <div
          className="mb-5 p-4 rounded-2xl flex items-center justify-between gap-3"
          style={{ background: "#c5b8f5", border: "2px solid #a89ae8" }}
        >
          <p className="font-bold text-sm" style={{ color: "#1a0f6e" }}>
            {t(language, "selfTeachingMode")} — {t(language, "selfTeachingDesc")}
          </p>
          <button
            onClick={startProgram}
            className="px-4 py-2 rounded-xl text-sm font-bold"
            style={{ background: "#1a0f6e", color: "white" }}
          >
            {t(language, "startProgram")}
          </button>
        </div>
      ) : (
        <div
          className="mb-5 p-3 rounded-2xl flex items-center gap-3"
          style={{ background: "#e8f5e9", border: "2px solid #a8d8c8" }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm"
            style={{ background: "#a8d8c8", color: "#1a6e3a" }}
          >
            {currentDay}
          </div>
          <div>
            <p className="text-xs font-bold" style={{ color: "#1a6e3a" }}>
              {t(language, "dayOf", { day: currentDay, total: TOTAL_DAYS })}
            </p>
            <p className="text-xs" style={{ color: "#2a8a4a" }}>
              {t(language, "todaysLesson")}: {(() => { const l = LESSONS.find((x) => x.dayIndex === currentDay); return language === "ar" ? (l?.title_ar ?? l?.title) : l?.title; })()}
            </p>
          </div>
        </div>
      )}

      {/* Lessons grid */}
      <div
        className="p-5 rounded-2xl mb-4"
        style={{ background: "#fce4e4", border: "2px solid #f0b8b8" }}
      >
        <h2 className="text-2xl font-black mb-4" style={{ color: "#1a0f6e" }}>
          {t(language, "lessons")}
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {LESSONS.map((lesson, i) => {
            const unlocked = canAccessLesson(lesson.dayIndex);
            const color = lessonColors[i % lessonColors.length];
            const isActive = teacherState.currentLessonId === lesson.id;
            return (
              <button
                key={lesson.id}
                onClick={() => unlocked && handleLessonClick(lesson.id)}
                disabled={!unlocked && selfTeachingMode && !!programStartDate}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all relative"
                style={{
                  background: isActive ? "#1a0f6e" : "white",
                  border: `2px solid ${isActive ? "#1a0f6e" : color.bg}`,
                  opacity: !unlocked && selfTeachingMode && !!programStartDate ? 0.5 : 1,
                  cursor: !unlocked && selfTeachingMode && !!programStartDate ? "not-allowed" : "pointer",
                }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-sm shrink-0 solid-shadow-sm"
                  style={{ background: color.bg, color: color.num, border: `2px solid ${color.num}`, ["--shadow-color" as string]: color.num }}
                >
                  {lesson.dayIndex}
                </div>
                <span
                  className="text-xs font-bold truncate"
                  style={{ color: isActive ? "white" : "#1a0f6e" }}
                >
                  {language === "ar" ? (lesson.title_ar ?? lesson.title) : lesson.title}
                </span>
                {!unlocked && selfTeachingMode && !!programStartDate && (
                  <div className="absolute top-1 right-1">
                    <svg className="w-3 h-3 opacity-50" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#1a0f6e" }}>
                      <path d="M12 1a5 5 0 015 5v3h1a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V11a2 2 0 012-2h1V6a5 5 0 015-5zm0 2a3 3 0 00-3 3v3h6V6a3 3 0 00-3-3zm0 9a1 1 0 100 2 1 1 0 000-2z" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lab cards */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onNavigate("circuit")}
          className="p-5 rounded-2xl text-start transition-all hover:scale-105"
          style={{ background: "#c8eaf8", border: "2px solid #a8d8f5" }}
        >
          <div
            className="mb-3 w-12 h-12 rounded-xl flex items-center justify-center solid-shadow"
            style={{ background: "#a8d8f5", border: "2px solid #1c85b5", ["--shadow-color" as string]: "#1c85b5" }}
          >
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" style={{ color: "#1a0f6e" }}>
              <rect x="2" y="8" width="5" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
              <rect x="9.5" y="8" width="5" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
              <rect x="17" y="8" width="5" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
              <line x1="7" y1="12" x2="9.5" y2="12" stroke="currentColor" strokeWidth="1.5" />
              <line x1="14.5" y1="12" x2="17" y2="12" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="text-lg font-black" style={{ color: "#1a0f6e" }}>
            {t(language, "circuitLab")}
          </div>
          <div className="text-xs mt-1" style={{ color: "#3a7abf" }}>
            {t(language, "circuitLabDesc")}
          </div>
        </button>

        <button
          onClick={() => onNavigate("bloch")}
          className="p-5 rounded-2xl text-start transition-all hover:scale-105"
          style={{ background: "#ddd4f8", border: "2px solid #c5b8f5" }}
        >
          <div
            className="mb-3 w-12 h-12 rounded-xl flex items-center justify-center solid-shadow"
            style={{ background: "#c5b8f5", border: "2px solid #6b3abf", ["--shadow-color" as string]: "#6b3abf" }}
          >
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" style={{ color: "#1a0f6e" }}>
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
              <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="currentColor" strokeWidth="1.2" opacity="0.6" transform="rotate(45 12 12)" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
          </div>
          <div className="text-lg font-black" style={{ color: "#1a0f6e" }}>
            {t(language, "blochSphere")}
          </div>
          <div className="text-xs mt-1" style={{ color: "#6b3abf" }}>
            {t(language, "blochSphereDesc")}
          </div>
        </button>
      </div>
    </div>
  );
}
