import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { LESSONS, LessonModule, getLessonById } from "@/lib/lessons";
import { t } from "@/lib/i18n";
import BlochSphere from "@/components/BlochSphere";

type SubView = "content" | "quiz" | "faq";

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

  const question = language === "ar" && q.question_ar ? q.question_ar : q.question;
  const options = language === "ar" && q.options_ar ? q.options_ar : q.options;
  const explanation = language === "ar" && q.explanation_ar ? q.explanation_ar : q.explanation;

  const handleCheck = () => {
    if (selected === null) return;
    setChecked(true);
    if (selected === q.correctIndex) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (current + 1 >= lesson.quiz.length) setDone(true);
    else { setCurrent((c) => c + 1); setSelected(null); setChecked(false); }
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
        <span className="text-xs font-bold" style={{ color: "#7c6fcd" }}>{current + 1} / {lesson.quiz.length}</span>
        <span className="text-xs font-bold" style={{ color: "#1a0f6e" }}>
          {language === "en" ? `Score: ${score}` : `النتيجة: ${score}`}
        </span>
      </div>
      <p className="text-base font-bold mb-4 leading-relaxed" style={{ color: "#1a0f6e" }}>{question}</p>
      <div className="space-y-2 mb-4">
        {options.map((opt, i) => {
          let bg = "white";
          let border = "hsl(340 40% 88%)";
          if (checked) {
            if (i === q.correctIndex) { bg = "#a8f5c8"; border = "#5dd39e"; }
            else if (i === selected && selected !== q.correctIndex) { bg = "#f5a8c0"; border = "#e87aa0"; }
          } else if (selected === i) { bg = "#ddd4f8"; border = "#a89ae8"; }
          return (
            <button
              key={i}
              onClick={() => !checked && setSelected(i)}
              disabled={checked}
              className="w-full p-3 rounded-xl text-sm font-medium transition-all"
              style={{ background: bg, border: `2px solid ${border}`, color: "#1a0f6e", textAlign: isRTL ? "right" : "left" }}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {checked && (
        <div className="p-3 rounded-xl text-sm mb-4" style={{
          background: selected === q.correctIndex ? "#e8fff0" : "#fff0f4",
          border: `2px solid ${selected === q.correctIndex ? "#a8f5c8" : "#f5a8c0"}`,
          color: "#1a0f6e",
        }}>
          <span className="font-bold">{selected === q.correctIndex ? "✓ " + t(language, "correct") : "✗ " + t(language, "incorrect")}</span>{" "}{explanation}
        </div>
      )}
      {!checked ? (
        <button onClick={handleCheck} disabled={selected === null} className="w-full py-2.5 rounded-xl font-bold text-sm disabled:opacity-40" style={{ background: "#c5b8f5", color: "#1a0f6e" }}>
          {t(language, "checkAnswer")}
        </button>
      ) : (
        <button onClick={handleNext} className="w-full py-2.5 rounded-xl font-bold text-sm" style={{ background: "#1a0f6e", color: "white" }}>
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
      {lesson.faqs.map((faq, i) => {
        const question = language === "ar" && faq.question_ar ? faq.question_ar : faq.question;
        const answer = language === "ar" && faq.answer_ar ? faq.answer_ar : faq.answer;
        return (
          <div key={i} className="rounded-2xl overflow-hidden bg-white" style={{ border: "2px solid hsl(340 40% 90%)" }}>
            <button
              className="w-full p-4 flex items-start justify-between gap-3"
              onClick={() => setOpen(open === i ? null : i)}
              style={{ textAlign: isRTL ? "right" : "left" }}
            >
              <span className="font-semibold text-sm leading-snug" style={{ color: "#1a0f6e" }}>{question}</span>
              <span className="text-xl shrink-0" style={{ color: "#7c6fcd" }}>{open === i ? "−" : "+"}</span>
            </button>
            {open === i && (
              <div className="px-4 pb-4 text-sm leading-relaxed" style={{ color: "#3a2a6e" }}>{answer}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function PresentationView({ lesson, onClose }: { lesson: LessonModule; onClose: () => void }) {
  const { language } = useApp();
  const isRTL = language === "ar";
  const [slide, setSlide] = useState(0);
  const sections = lesson.content;
  const current = sections[slide];

  const title = language === "ar" && current.title_ar ? current.title_ar : current.title;
  const body = language === "ar" && current.body_ar ? current.body_ar : current.body;

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "#fce4e4" }} dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex items-center justify-between px-8 py-4 bg-white" style={{ borderBottom: "2px solid #f0b8b8" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm" style={{ background: "#c5b8f5", color: "#1a0f6e" }}>
            {lesson.dayIndex}
          </div>
          <span className="font-black text-lg" style={{ color: "#1a0f6e" }}>
            {language === "ar" && lesson.title_ar ? lesson.title_ar : lesson.title}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold" style={{ color: "#7c6fcd" }}>
            {slide + 1} / {sections.length}
          </span>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-xl font-bold" style={{ background: "#f0b8b8", color: "#1a0f6e" }}>×</button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-3xl rounded-3xl p-10 shadow-xl bg-white" style={{ border: "2px solid #f0b8b8", minHeight: "60vh" }}>
          <div className="px-3 py-1 rounded-full text-xs font-black inline-block mb-6" style={{ background: "#fce4e4", color: "#1a0f6e" }}>
            {slide + 1} / {sections.length}
          </div>
          <h2 className="text-3xl font-black mb-6" style={{ color: "#1a0f6e" }}>{title}</h2>
          <div className="flex gap-6">
            <p className="flex-1 text-base leading-relaxed whitespace-pre-line" style={{ color: "#3a2a6e" }}>{body}</p>
            {current.visualHint === "bloch" && current.blochState && (
              <div className="w-64 h-64 rounded-2xl overflow-hidden shrink-0" style={{ background: "#f5f0ff", border: "2px solid #c5b8f5" }}>
                <BlochSphere theta={current.blochState.theta} phi={current.blochState.phi} interactive={false} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-8 py-4 bg-white" style={{ borderTop: "2px solid #f0b8b8" }}>
        <button onClick={() => setSlide((s) => Math.max(0, s - 1))} disabled={slide === 0}
          className="px-5 py-2 rounded-xl font-bold text-sm disabled:opacity-30"
          style={{ background: "#fce4e4", color: "#1a0f6e" }}>
          {isRTL ? "→" : "←"} {t(language, "prevSection")}
        </button>
        <div className="flex gap-2">
          {sections.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} className="w-2.5 h-2.5 rounded-full transition-all"
              style={{ background: i === slide ? "#1a0f6e" : "#c5b8f5" }} />
          ))}
        </div>
        {slide < sections.length - 1 ? (
          <button onClick={() => setSlide((s) => s + 1)} className="px-5 py-2 rounded-xl font-bold text-sm"
            style={{ background: "#1a0f6e", color: "white" }}>
            {t(language, "nextSection")} {isRTL ? "←" : "→"}
          </button>
        ) : (
          <button onClick={onClose} className="px-5 py-2 rounded-xl font-bold text-sm"
            style={{ background: "#c5b8f5", color: "#1a0f6e" }}>
            {language === "en" ? "End Presentation" : "إنهاء العرض"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function LessonsPage({ initialLessonId, onNavigate: _onNavigate }: LessonsPageProps) {
  const { language, role, teacherState, updateTeacherState, selfTeachingMode, programStartDate, currentDay } = useApp();
  const isRTL = language === "ar";
  const isTeacher = role === "teacher";

  const [subView, setSubView] = useState<SubView>("content");
  const [presenting, setPresenting] = useState(false);
  const [sectionIdx, setSectionIdx] = useState(0);
  const [blochTheta, setBlochTheta] = useState(0);
  const [blochPhi, setBlochPhi] = useState(0);

  const activeLessonId = teacherState.currentLessonId ?? initialLessonId;
  const lesson = activeLessonId ? getLessonById(activeLessonId) : null;

  // Reset Bloch sphere to the section's default state whenever the section changes
  useEffect(() => {
    const s = lesson?.content[sectionIdx];
    if (s?.blochState) {
      setBlochTheta(s.blochState.theta);
      setBlochPhi(s.blochState.phi);
    }
  }, [sectionIdx, activeLessonId]);

  const canAccessLesson = (dayIndex: number) => {
    if (!selfTeachingMode || !programStartDate) return true;
    return dayIndex <= currentDay;
  };

  const handleSelectLesson = (id: string, dayIndex: number) => {
    if (!canAccessLesson(dayIndex)) return;
    updateTeacherState({ currentLessonId: id, activeView: "lessons" });
    setSubView("content");
    setSectionIdx(0);
  };

  const handleBack = () => {
    if (isTeacher) updateTeacherState({ currentLessonId: null });
    setSubView("content");
  };

  const lessonColors = ["#a8d8f5", "#c5b8f5", "#a8f5c8", "#f5d8a8", "#f5a8c0", "#c8eaf8"];

  if (!lesson) {
    return (
      <div className="p-5 max-w-2xl mx-auto" dir={isRTL ? "rtl" : "ltr"}>
        <h2 className="text-2xl font-black mb-4" style={{ color: "#1a0f6e" }}>{t(language, "lessons")}</h2>
        <div className="space-y-2">
          {LESSONS.map((l, i) => {
            const isActive = teacherState.currentLessonId === l.id;
            const unlocked = canAccessLesson(l.dayIndex);
            const bg = lessonColors[i % lessonColors.length];
            const displayTitle = language === "ar" && l.title_ar ? l.title_ar : l.title;
            const displayDesc = language === "ar" && l.description_ar ? l.description_ar : l.description;
            return (
              <button key={l.id}
                onClick={() => handleSelectLesson(l.id, l.dayIndex)}
                disabled={!unlocked}
                className="w-full flex items-center gap-3 p-3 rounded-2xl transition-all"
                style={{
                  background: isActive ? "#1a0f6e" : "white",
                  border: `2px solid ${isActive ? "#1a0f6e" : bg}`,
                  textAlign: isRTL ? "right" : "left",
                  opacity: unlocked ? 1 : 0.45,
                  cursor: unlocked ? "pointer" : "not-allowed",
                }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0"
                  style={{ background: bg, color: "#1a0f6e" }}>
                  {unlocked ? l.dayIndex : "🔒"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm" style={{ color: isActive ? "white" : "#1a0f6e" }}>{displayTitle}</div>
                  <div className="text-xs truncate" style={{ color: isActive ? "#c5b8f5" : "#7c6fcd" }}>
                    {unlocked
                      ? displayDesc
                      : (language === "ar" ? `متاح في اليوم ${l.dayIndex}` : `Available on Day ${l.dayIndex}`)}
                  </div>
                </div>
                <div className="text-xs font-medium px-2 py-0.5 rounded-full shrink-0"
                  style={{ background: isActive ? "#c5b8f5" : bg, color: "#1a0f6e" }}>
                  {unlocked ? `${l.estimatedMinutes}m` : "—"}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const section = lesson.content[sectionIdx];
  const sectionTitle = language === "ar" && section?.title_ar ? section.title_ar : section?.title;
  const sectionBody = language === "ar" && section?.body_ar ? section.body_ar : section?.body;
  const lessonTitle = language === "ar" && lesson.title_ar ? lesson.title_ar : lesson.title;

  return (
    <div className="flex h-full min-h-0" dir={isRTL ? "rtl" : "ltr"}>
      {presenting && <PresentationView lesson={lesson} onClose={() => setPresenting(false)} />}

      {/* Sidebar */}
      <div className="w-52 shrink-0 flex flex-col overflow-y-auto" style={{ background: "#fce4e4", borderInlineEnd: "2px solid #f0b8b8" }}>
        <button onClick={handleBack} className="flex items-center gap-2 px-4 py-3 text-xs font-bold" style={{ color: "#1a0f6e" }}>
          {isRTL ? "→" : "←"} {t(language, "backToLessons")}
        </button>
        <div className="px-2 pb-2 space-y-1">
          {LESSONS.map((l, i) => {
            const isActive = lesson.id === l.id;
            const unlocked = canAccessLesson(l.dayIndex);
            const bg = lessonColors[i % lessonColors.length];
            const displayTitle = language === "ar" && l.title_ar ? l.title_ar : l.title;
            return (
              <button key={l.id}
                onClick={() => handleSelectLesson(l.id, l.dayIndex)}
                disabled={!unlocked}
                className="w-full flex items-center gap-2 p-2 rounded-xl transition-all"
                style={{
                  background: isActive ? "#1a0f6e" : "white",
                  border: `2px solid ${isActive ? "#1a0f6e" : bg}`,
                  textAlign: isRTL ? "right" : "left",
                  opacity: unlocked ? 1 : 0.45,
                  cursor: unlocked ? "pointer" : "not-allowed",
                }}>
                <div className="w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs shrink-0"
                  style={{ background: bg, color: "#1a0f6e" }}>
                  {unlocked ? l.dayIndex : "🔒"}
                </div>
                <span className="text-xs font-bold truncate" style={{ color: isActive ? "white" : "#1a0f6e" }}>
                  {displayTitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3 flex items-center justify-between gap-3 shrink-0 bg-white" style={{ borderBottom: "2px solid #fce4e4" }}>
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-black text-lg truncate" style={{ color: "#1a0f6e" }}>
              {lesson.dayIndex}. {lessonTitle}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0" style={{ background: "#fce4e4", color: "#7c6fcd" }}>
              {lesson.estimatedMinutes}m
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {(["content", "faq", "quiz"] as SubView[]).map((v) => {
              const labels: Record<SubView, string> = {
                content: language === "en" ? "Notes" : "ملاحظات",
                faq: t(language, "faq"),
                quiz: t(language, "quiz"),
              };
              return (
                <button key={v} onClick={() => setSubView(v)}
                  className="px-3 py-1 rounded-xl text-xs font-bold transition-all"
                  style={{ background: subView === v ? "#1a0f6e" : "#fce4e4", color: subView === v ? "white" : "#1a0f6e" }}>
                  {labels[v]}
                </button>
              );
            })}
            <button onClick={() => setPresenting(true)}
              className="px-3 py-1 rounded-xl text-xs font-bold"
              style={{ background: "#c5b8f5", color: "#1a0f6e" }}>
              {language === "en" ? "▶ Present" : "▶ عرض"}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {subView === "content" && (
            <div className="max-w-2xl mx-auto">
              {/* Section tabs */}
              <div className="flex gap-2 mb-5 flex-wrap">
                {lesson.content.map((s, i) => {
                  const stitle = language === "ar" && s.title_ar ? s.title_ar : s.title;
                  return (
                    <button key={s.id} onClick={() => setSectionIdx(i)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                      style={{ background: sectionIdx === i ? "#1a0f6e" : "white", color: sectionIdx === i ? "white" : "#1a0f6e", border: `2px solid ${sectionIdx === i ? "#1a0f6e" : "hsl(340 40% 88%)"}` }}>
                      {i + 1}. {stitle}
                    </button>
                  );
                })}
              </div>

              {section && (
                <div>
                  <h3 className="text-xl font-black mb-4" style={{ color: "#1a0f6e" }}>
                    {sectionIdx + 1}. {sectionTitle}
                  </h3>

                  <div className="flex gap-5 items-start">
                    {/* Body text — plain, not in a box */}
                    <div className="flex-1 text-sm leading-7 whitespace-pre-line" style={{ color: "#3a2a6e" }}>
                      {sectionBody}
                    </div>

                    {section.visualHint === "bloch" && (
                      <div className="w-56 h-56 rounded-2xl overflow-hidden shrink-0" style={{ background: "#f5f0ff", border: "2px solid #c5b8f5" }}>
                        <BlochSphere theta={blochTheta} phi={blochPhi} interactive={false} />
                      </div>
                    )}
                  </div>

                  {section.visualHint === "bloch" && (
                    <div className="flex flex-wrap gap-2 mt-5">
                      {[
                        { label: "|0⟩", theta: 0, phi: 0 },
                        { label: "|1⟩", theta: Math.PI, phi: 0 },
                        { label: "|+⟩", theta: Math.PI / 2, phi: 0 },
                        { label: "|-⟩", theta: Math.PI / 2, phi: Math.PI },
                        { label: "|i⟩", theta: Math.PI / 2, phi: Math.PI / 2 },
                        { label: "|-i⟩", theta: Math.PI / 2, phi: (3 * Math.PI) / 2 },
                      ].map((p) => {
                        const isActive = Math.abs(blochTheta - p.theta) < 0.01 && Math.abs(blochPhi - p.phi) < 0.01;
                        return (
                          <button
                            key={p.label}
                            onClick={() => { setBlochTheta(p.theta); setBlochPhi(p.phi); }}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                            style={{
                              background: isActive ? "#1a0f6e" : "#a8d8f5",
                              color: isActive ? "white" : "#1a0f6e",
                              border: `2px solid ${isActive ? "#1a0f6e" : "#7ac0e8"}`,
                            }}>
                            {p.label}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Nav buttons */}
                  <div className="flex justify-between mt-6">
                    <button onClick={() => setSectionIdx((s) => Math.max(0, s - 1))} disabled={sectionIdx === 0}
                      className="px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-30"
                      style={{ background: "#fce4e4", color: "#1a0f6e" }}>
                      {isRTL ? "→" : "←"} {t(language, "prevSection")}
                    </button>
                    {sectionIdx < lesson.content.length - 1 ? (
                      <button onClick={() => setSectionIdx((s) => s + 1)}
                        className="px-4 py-2 rounded-xl text-sm font-bold"
                        style={{ background: "#1a0f6e", color: "white" }}>
                        {t(language, "nextSection")} {isRTL ? "←" : "→"}
                      </button>
                    ) : (
                      <button onClick={() => setSubView("quiz")}
                        className="px-4 py-2 rounded-xl text-sm font-bold"
                        style={{ background: "#c5b8f5", color: "#1a0f6e" }}>
                        {language === "en" ? "Take Quiz →" : "→ الاختبار"}
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
