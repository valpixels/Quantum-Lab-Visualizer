import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { LESSONS, LessonModule, getLessonById } from "@/lib/lessons";
import { t } from "@/lib/i18n";
import BlochSphere from "@/components/BlochSphere";

type SubView = "content" | "quiz" | "faq" | "presentation";

interface LessonsPageProps {
  initialLessonId?: string;
  onNavigate?: (view: "lessons" | "bloch" | "circuit") => void;
}

function QuizView({ lesson }: { lesson: LessonModule }) {
  const { language } = useApp();
  const isRTL = language === "ar";
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = lesson.quiz[current];
  if (!q) return null;

  const handleCheck = () => {
    if (selected === null) return;
    setChecked(true);
    if (selected === q.correctIndex) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (current + 1 >= lesson.quiz.length) {
      setDone(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setChecked(false);
    }
  };

  if (done) {
    const pct = Math.round((score / lesson.quiz.length) * 100);
    return (
      <div className="flex flex-col items-center py-10 text-center" dir={isRTL ? "rtl" : "ltr"}>
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black mb-4"
          style={{ background: pct >= 70 ? "#a8f5c8" : "#f5a8c0", color: "#1a0f6e" }}
        >
          {pct}%
        </div>
        <h3 className="text-xl font-black mb-2" style={{ color: "#1a0f6e" }}>
          {language === "en" ? `${score} / ${lesson.quiz.length} correct` : `${score} / ${lesson.quiz.length} صحيح`}
        </h3>
        <p className="text-sm" style={{ color: "#7c6fcd" }}>
          {pct >= 70
            ? (language === "en" ? "Great work! You understand this lesson well." : "عمل رائع! أنت تفهم هذا الدرس جيداً.")
            : (language === "en" ? "Review the lesson content and try again." : "راجع محتوى الدرس وحاول مرة أخرى.")}
        </p>
        <button
          onClick={() => { setCurrent(0); setSelected(null); setChecked(false); setScore(0); setDone(false); }}
          className="mt-4 px-5 py-2 rounded-xl text-sm font-bold"
          style={{ background: "#c5b8f5", color: "#1a0f6e" }}
        >
          {language === "en" ? "Retry Quiz" : "إعادة الاختبار"}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-4" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold" style={{ color: "#7c6fcd" }}>
          {current + 1} / {lesson.quiz.length}
        </span>
        <span className="text-xs font-bold" style={{ color: "#1a0f6e" }}>
          {language === "en" ? `Score: ${score}` : `النتيجة: ${score}`}
        </span>
      </div>

      <div className="p-5 rounded-2xl mb-4 bg-white" style={{ border: "2px solid #fce4e4" }}>
        <p className="font-bold text-sm" style={{ color: "#1a0f6e" }}>{q.question}</p>
      </div>

      <div className="space-y-2 mb-4">
        {q.options.map((opt, i) => {
          let bg = "white";
          let border = "#e8d8f0";
          if (checked) {
            if (i === q.correctIndex) { bg = "#a8f5c8"; border = "#5dd39e"; }
            else if (i === selected && selected !== q.correctIndex) { bg = "#f5a8c0"; border = "#e87aa0"; }
          } else if (selected === i) {
            bg = "#ddd4f8"; border = "#a89ae8";
          }
          return (
            <button
              key={i}
              onClick={() => !checked && setSelected(i)}
              disabled={checked}
              className="w-full p-3 rounded-xl text-sm font-medium text-left transition-all"
              dir={isRTL ? "rtl" : "ltr"}
              style={{ background: bg, border: `2px solid ${border}`, color: "#1a0f6e" }}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {checked && (
        <div
          className="p-3 rounded-xl text-sm mb-4"
          style={{
            background: selected === q.correctIndex ? "#e8fff0" : "#fff0f4",
            border: `2px solid ${selected === q.correctIndex ? "#a8f5c8" : "#f5a8c0"}`,
            color: "#1a0f6e",
          }}
        >
          <span className="font-bold">{selected === q.correctIndex ? "✓ " + t(language, "correct") : "✗ " + t(language, "incorrect")}</span>{" "}
          {q.explanation}
        </div>
      )}

      {!checked ? (
        <button
          onClick={handleCheck}
          disabled={selected === null}
          className="w-full py-2.5 rounded-xl font-bold text-sm disabled:opacity-40"
          style={{ background: "#c5b8f5", color: "#1a0f6e" }}
        >
          {t(language, "checkAnswer")}
        </button>
      ) : (
        <button
          onClick={handleNext}
          className="w-full py-2.5 rounded-xl font-bold text-sm"
          style={{ background: "#1a0f6e", color: "white" }}
        >
          {current + 1 >= lesson.quiz.length
            ? (language === "en" ? "See Results" : "عرض النتائج")
            : t(language, "nextSection")}
        </button>
      )}
    </div>
  );
}

function FAQView({ lesson }: { lesson: LessonModule }) {
  const { language } = useApp();
  const isRTL = language === "ar";
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-3 py-2" dir={isRTL ? "rtl" : "ltr"}>
      {lesson.faqs.map((faq, i) => (
        <div key={i} className="rounded-2xl overflow-hidden" style={{ border: "2px solid #fce4e4", background: "white" }}>
          <button
            className="w-full p-4 text-left flex items-center justify-between"
            onClick={() => setOpen(open === i ? null : i)}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <span className="font-bold text-sm" style={{ color: "#1a0f6e" }}>{faq.question}</span>
            <span className="text-lg ml-2" style={{ color: "#7c6fcd" }}>{open === i ? "−" : "+"}</span>
          </button>
          {open === i && (
            <div className="px-4 pb-4 text-sm leading-relaxed" style={{ color: "#3a2a6e" }}>
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function PresentationView({ lesson, onClose }: { lesson: LessonModule; onClose: () => void }) {
  const { language } = useApp();
  const isRTL = language === "ar";
  const allSlides = lesson.content;
  const [slide, setSlide] = useState(0);
  const current = allSlides[slide];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "#fce4e4" }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Slide header */}
      <div
        className="flex items-center justify-between px-8 py-4"
        style={{ background: "white", borderBottom: "2px solid #f0b8b8" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
            style={{ background: "#c5b8f5", color: "#1a0f6e" }}
          >
            {lesson.dayIndex}
          </div>
          <span className="font-black text-lg" style={{ color: "#1a0f6e" }}>{lesson.title}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold" style={{ color: "#7c6fcd" }}>
            {t(language, "sectionOf", { current: slide + 1, total: allSlides.length })}
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{ background: "#f0b8b8", color: "#1a0f6e" }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Slide body */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div
          className="w-full max-w-3xl rounded-3xl p-10 shadow-xl"
          style={{ background: "white", border: "2px solid #f0b8b8", minHeight: "60vh" }}
        >
          <div className="flex items-center gap-2 mb-6">
            <div
              className="px-3 py-1 rounded-full text-xs font-black"
              style={{ background: "#fce4e4", color: "#1a0f6e" }}
            >
              {slide + 1} / {allSlides.length}
            </div>
          </div>
          <h2 className="text-3xl font-black mb-6" style={{ color: "#1a0f6e" }}>
            {current.title}
          </h2>
          <div className="flex gap-6">
            <div className="flex-1 text-base leading-relaxed font-mono whitespace-pre-line"
              style={{ color: "#3a2a6e" }}>
              {current.body}
            </div>
            {current.visualHint === "bloch" && current.blochState && (
              <div
                className="w-64 h-64 rounded-2xl overflow-hidden shrink-0"
                style={{ background: "#f5f0ff", border: "2px solid #c5b8f5" }}
              >
                <BlochSphere theta={current.blochState.theta} phi={current.blochState.phi} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Slide navigation */}
      <div
        className="flex items-center justify-between px-8 py-4"
        style={{ background: "white", borderTop: "2px solid #f0b8b8" }}
      >
        <button
          onClick={() => setSlide((s) => Math.max(0, s - 1))}
          disabled={slide === 0}
          className="px-5 py-2 rounded-xl font-bold text-sm disabled:opacity-30"
          style={{ background: "#fce4e4", color: "#1a0f6e" }}
        >
          ← {t(language, "prevSection")}
        </button>

        <div className="flex gap-2">
          {allSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className="w-2.5 h-2.5 rounded-full transition-all"
              style={{ background: i === slide ? "#1a0f6e" : "#c5b8f5" }}
            />
          ))}
        </div>

        {slide < allSlides.length - 1 ? (
          <button
            onClick={() => setSlide((s) => s + 1)}
            className="px-5 py-2 rounded-xl font-bold text-sm"
            style={{ background: "#1a0f6e", color: "white" }}
          >
            {t(language, "nextSection")} →
          </button>
        ) : (
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl font-bold text-sm"
            style={{ background: "#c5b8f5", color: "#1a0f6e" }}
          >
            {language === "en" ? "End Presentation" : "إنهاء العرض"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function LessonsPage({ initialLessonId, onNavigate }: LessonsPageProps) {
  const { language, role, teacherState, updateTeacherState } = useApp();
  const isRTL = language === "ar";
  const isTeacher = role === "teacher";

  const [subView, setSubView] = useState<SubView>("content");
  const [presenting, setPresenting] = useState(false);
  const [sectionIdx, setSectionIdx] = useState(0);

  const activeLessonId = teacherState.currentLessonId ?? initialLessonId;
  const lesson = activeLessonId ? getLessonById(activeLessonId) : null;

  const handleSelectLesson = (id: string) => {
    if (isTeacher) updateTeacherState({ currentLessonId: id, activeView: "lessons" });
    setSubView("content");
    setSectionIdx(0);
  };

  const handleBack = () => {
    if (isTeacher) updateTeacherState({ currentLessonId: null });
    setSubView("content");
  };

  if (!lesson) {
    // Lesson list
    return (
      <div className="p-5 max-w-2xl mx-auto" dir={isRTL ? "rtl" : "ltr"}>
        <h2 className="text-2xl font-black mb-4" style={{ color: "#1a0f6e" }}>
          {t(language, "lessons")}
        </h2>
        <div className="space-y-2">
          {LESSONS.map((l, i) => {
            const isActive = teacherState.currentLessonId === l.id;
            const colors = [
              { bg: "#a8d8f5", num: "#3a7abf" },
              { bg: "#c5b8f5", num: "#6b3abf" },
              { bg: "#a8f5c8", num: "#0f6e3a" },
              { bg: "#f5d8a8", num: "#6e4a0f" },
              { bg: "#f5a8c0", num: "#6e0f2a" },
              { bg: "#c8eaf8", num: "#1a5080" },
            ];
            const c = colors[i % colors.length];
            return (
              <button
                key={l.id}
                onClick={() => handleSelectLesson(l.id)}
                disabled={!isTeacher && role === "student" && teacherState.activeView !== "lessons"}
                className="w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all"
                style={{
                  background: isActive ? "#1a0f6e" : "white",
                  border: `2px solid ${isActive ? "#1a0f6e" : c.bg}`,
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0"
                  style={{ background: c.bg, color: c.num }}
                >
                  {l.dayIndex}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm" style={{ color: isActive ? "white" : "#1a0f6e" }}>
                    {l.title}
                  </div>
                  <div className="text-xs truncate" style={{ color: isActive ? "#c5b8f5" : "#7c6fcd" }}>
                    {l.description}
                  </div>
                </div>
                <div className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ background: isActive ? "#c5b8f5" : c.bg, color: isActive ? "#1a0f6e" : c.num }}>
                  {l.estimatedMinutes}m
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const section = lesson.content[sectionIdx];

  return (
    <div className="flex h-full min-h-0" dir={isRTL ? "rtl" : "ltr"}>
      {presenting && (
        <PresentationView lesson={lesson} onClose={() => setPresenting(false)} />
      )}

      {/* Sidebar */}
      <div
        className="w-56 shrink-0 flex flex-col border-r overflow-y-auto"
        style={{ background: "#fce4e4", borderColor: "#f0b8b8" }}
      >
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-3 text-xs font-bold"
          style={{ color: "#1a0f6e" }}
        >
          <span>←</span> {t(language, "backToLessons")}
        </button>
        <div className="px-2 pb-2 space-y-1">
          {LESSONS.map((l, i) => {
            const colors = ["#a8d8f5", "#c5b8f5", "#a8f5c8", "#f5d8a8", "#f5a8c0", "#c8eaf8"];
            const isActive = lesson.id === l.id;
            return (
              <button
                key={l.id}
                onClick={() => handleSelectLesson(l.id)}
                className="w-full flex items-center gap-2 p-2 rounded-xl text-left transition-all"
                style={{
                  background: isActive ? "#1a0f6e" : "white",
                  border: `2px solid ${isActive ? "#1a0f6e" : colors[i % colors.length]}`,
                }}
              >
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs shrink-0"
                  style={{ background: colors[i % colors.length], color: "#1a0f6e" }}
                >
                  {l.dayIndex}
                </div>
                <span className="text-xs font-bold truncate" style={{ color: isActive ? "white" : "#1a0f6e" }}>
                  {l.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Lesson header */}
        <div
          className="px-5 py-3 flex items-center justify-between gap-3 shrink-0"
          style={{ background: "white", borderBottom: "2px solid #fce4e4" }}
        >
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black" style={{ color: "#1a0f6e" }}>
              {lesson.dayIndex} - {lesson.title}
            </h2>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: "#fce4e4", color: "#7c6fcd" }}
            >
              {t(language, "difficulty")[lesson.difficulty]}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {(["content", "faq", "quiz"] as SubView[]).map((v) => {
              const labels: Record<SubView, string> = {
                content: lesson.content[sectionIdx]?.title ?? "Content",
                faq: t(language, "faq"),
                quiz: t(language, "quiz"),
                presentation: t(language, "presentation"),
              };
              const shortLabels: Record<SubView, string> = {
                content: language === "en" ? "Notes" : "ملاحظات",
                faq: t(language, "faq"),
                quiz: t(language, "quiz"),
                presentation: t(language, "presentation"),
              };
              return (
                <button
                  key={v}
                  onClick={() => setSubView(v)}
                  className="px-3 py-1 rounded-xl text-xs font-bold transition-all"
                  style={{
                    background: subView === v ? "#1a0f6e" : "#fce4e4",
                    color: subView === v ? "white" : "#1a0f6e",
                  }}
                >
                  {shortLabels[v]}
                </button>
              );
            })}
            <button
              onClick={() => setPresenting(true)}
              className="px-3 py-1 rounded-xl text-xs font-bold transition-all"
              style={{ background: "#c5b8f5", color: "#1a0f6e" }}
            >
              {language === "en" ? "▶ Present" : "▶ عرض"}
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-5">
          {subView === "content" && (
            <div className="max-w-2xl mx-auto">
              {/* Section nav */}
              <div className="flex gap-2 mb-4 flex-wrap">
                {lesson.content.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => setSectionIdx(i)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                    style={{
                      background: sectionIdx === i ? "#1a0f6e" : "white",
                      color: sectionIdx === i ? "white" : "#1a0f6e",
                      border: `2px solid ${sectionIdx === i ? "#1a0f6e" : "#fce4e4"}`,
                    }}
                  >
                    {i + 1}. {s.title}
                  </button>
                ))}
              </div>

              {section && (
                <div>
                  <h3 className="text-xl font-black mb-4" style={{ color: "#1a0f6e" }}>
                    {sectionIdx + 1}. {section.title}
                  </h3>
                  <div className="flex gap-5">
                    <div
                      className="flex-1 p-4 rounded-2xl font-mono text-sm leading-relaxed whitespace-pre-line"
                      style={{ background: "white", border: "2px solid #fce4e4", color: "#3a2a6e" }}
                    >
                      {section.body}
                    </div>
                    {section.visualHint === "bloch" && section.blochState && (
                      <div
                        className="w-64 h-64 rounded-2xl overflow-hidden shrink-0"
                        style={{ background: "#f5f0ff", border: "2px solid #c5b8f5" }}
                      >
                        <BlochSphere
                          theta={section.blochState.theta}
                          phi={section.blochState.phi}
                          interactive={false}
                        />
                      </div>
                    )}
                  </div>
                  {section.visualHint === "bloch" && section.blochState && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {[
                        { label: "|0⟩", theta: 0, phi: 0 },
                        { label: "|1⟩", theta: Math.PI, phi: 0 },
                        { label: "|+⟩", theta: Math.PI / 2, phi: 0 },
                        { label: "|-⟩", theta: Math.PI / 2, phi: Math.PI },
                        { label: "|i⟩", theta: Math.PI / 2, phi: Math.PI / 2 },
                        { label: "|-i⟩", theta: Math.PI / 2, phi: (3 * Math.PI) / 2 },
                      ].map((p) => (
                        <button
                          key={p.label}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold"
                          style={{ background: "#a8d8f5", color: "#1a0f6e", border: "2px solid #7ac0e8" }}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Section nav buttons */}
                  <div className="flex justify-between mt-5">
                    <button
                      onClick={() => setSectionIdx((s) => Math.max(0, s - 1))}
                      disabled={sectionIdx === 0}
                      className="px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-30"
                      style={{ background: "#fce4e4", color: "#1a0f6e" }}
                    >
                      ← {t(language, "prevSection")}
                    </button>
                    {sectionIdx < lesson.content.length - 1 ? (
                      <button
                        onClick={() => setSectionIdx((s) => s + 1)}
                        className="px-4 py-2 rounded-xl text-sm font-bold"
                        style={{ background: "#1a0f6e", color: "white" }}
                      >
                        {t(language, "nextSection")} →
                      </button>
                    ) : (
                      <button
                        onClick={() => setSubView("quiz")}
                        className="px-4 py-2 rounded-xl text-sm font-bold"
                        style={{ background: "#c5b8f5", color: "#1a0f6e" }}
                      >
                        {language === "en" ? "Take Quiz →" : "الاختبار →"}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {subView === "quiz" && <QuizView lesson={lesson} />}
          {subView === "faq" && <FAQView lesson={lesson} />}
        </div>
      </div>
    </div>
  );
}
