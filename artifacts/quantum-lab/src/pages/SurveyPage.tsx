import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { t } from "@/lib/i18n";
import { LESSONS } from "@/lib/lessons";

interface SurveyData {
  overallRating: number;
  difficulty: number;
  mostInteresting: string;
  leastClear: string;
  wouldRecommend: string;
  comments: string;
}

export default function SurveyPage({ onClose }: { onClose?: () => void }) {
  const { language, reportProgress, mySurveyDone, connected } = useApp();
  const [error, setError] = useState<string | null>(null);
  const isRTL = language === "ar";
  const [submitted, setSubmitted] = useState(mySurveyDone);
  const [data, setData] = useState<SurveyData>({
    overallRating: 0,
    difficulty: 3,
    mostInteresting: "",
    leastClear: "",
    wouldRecommend: "",
    comments: "",
  });

  const set = (key: keyof SurveyData, value: string | number) =>
    setData((d) => ({ ...d, [key]: value }));

  const submit = () => {
    if (data.overallRating < 1) {
      setError(t(language, "surveyRatingNeeded"));
      return;
    }
    if (!connected || !reportProgress({ kind: "survey", data })) {
      setError(t(language, "surveyOffline"));
      return;
    }
    setError(null);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 p-8 text-center" dir={isRTL ? "rtl" : "ltr"}>
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ background: "#a8f5c8" }}
        >
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="#0f6e3a" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="text-2xl font-black mb-2" style={{ color: "#1a0f6e" }}>
          {t(language, "surveySubmitted")}
        </h2>
        <p className="text-sm" style={{ color: "#7c6fcd" }}>
          {language === "en" ? "Your feedback helps improve Quantum Lab for future students." : "ملاحظاتك تساعد على تحسين مختبر الكم للطلاب القادمين."}
        </p>
        {onClose && (
          <button onClick={onClose} className="mt-4 px-6 py-2 rounded-xl text-sm font-bold"
            style={{ background: "#c5b8f5", color: "#1a0f6e" }}>
            {language === "en" ? "Close" : "إغلاق"}
          </button>
        )}
      </div>
    );
  }

  const questions_en = [
    "Overall, how would you rate the Quantum Lab program?",
    "How would you rate the difficulty of the material?",
    "Which topic did you find most interesting?",
    "Which topic was least clear to you?",
    "Would you recommend this program to others?",
  ];
  const questions_ar = [
    "بشكل عام، كيف تقيّم برنامج مختبر الكم؟",
    "كيف تقيّم صعوبة المادة؟",
    "أي موضوع وجدته الأكثر إثارةً للاهتمام؟",
    "أي موضوع كان أقل وضوحًا لك؟",
    "هل توصي بهذا البرنامج للآخرين؟",
  ];
  const questions = language === "ar" ? questions_ar : questions_en;

  const topicList = LESSONS.map((l) => ({
    id: l.id,
    label: language === "ar" ? (l.title_ar ?? l.title) : l.title,
  }));

  return (
    <div className="p-5 max-w-xl mx-auto" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mb-5">
        <h2 className="text-2xl font-black" style={{ color: "#1a0f6e" }}>
          {t(language, "survey")}
        </h2>
        <p className="text-sm mt-1" style={{ color: "#7c6fcd" }}>
          {t(language, "surveyIntro")}
        </p>
      </div>

      <div className="space-y-5">
        {/* Overall rating */}
        <div className="p-4 rounded-2xl bg-white" style={{ border: "2px solid #fce4e4" }}>
          <p className="text-sm font-bold mb-3" style={{ color: "#1a0f6e" }}>{questions[0]}</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                aria-label={`${star} / 5`}
                aria-pressed={data.overallRating === star}
                onClick={() => set("overallRating", star)}
                className="text-2xl transition-all"
                style={{ opacity: data.overallRating >= star ? 1 : 0.3 }}
              >
                ⭐
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div className="p-4 rounded-2xl bg-white" style={{ border: "2px solid #fce4e4" }}>
          <p className="text-sm font-bold mb-3" style={{ color: "#1a0f6e" }}>{questions[1]}</p>
          <div className="flex gap-2">
            {["1", "2", "3", "4", "5"].map((v) => {
              const labels_en = ["Very easy", "Easy", "Just right", "Hard", "Very hard"];
              const labels_ar = ["سهل جداً", "سهل", "مناسب", "صعب", "صعب جداً"];
              const labels = language === "ar" ? labels_ar : labels_en;
              return (
                <button
                  key={v}
                  onClick={() => set("difficulty", Number(v))}
                  className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
                  style={{
                    background: data.difficulty === Number(v) ? "#c5b8f5" : "#f5f0ff",
                    color: "#1a0f6e",
                    border: `2px solid ${data.difficulty === Number(v) ? "#a89ae8" : "transparent"}`,
                  }}
                >
                  {labels[Number(v) - 1]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Most interesting topic */}
        <div className="p-4 rounded-2xl bg-white" style={{ border: "2px solid #fce4e4" }}>
          <p className="text-sm font-bold mb-3" style={{ color: "#1a0f6e" }}>{questions[2]}</p>
          <div className="flex flex-wrap gap-2">
            {topicList.map(({ id: topic, label }) => (
              <button
                key={topic}
                type="button"
                aria-pressed={data.mostInteresting === topic}
                onClick={() => set("mostInteresting", topic)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                style={{
                  background: data.mostInteresting === topic ? "#a8d8f5" : "#eef8ff",
                  color: "#1a0f6e",
                  border: `2px solid ${data.mostInteresting === topic ? "#7ac0e8" : "transparent"}`,
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Least clear */}
        <div className="p-4 rounded-2xl bg-white" style={{ border: "2px solid #fce4e4" }}>
          <p className="text-sm font-bold mb-3" style={{ color: "#1a0f6e" }}>{questions[3]}</p>
          <div className="flex flex-wrap gap-2">
            {topicList.map(({ id: topic, label }) => (
              <button
                key={topic}
                type="button"
                aria-pressed={data.leastClear === topic}
                onClick={() => set("leastClear", topic)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                style={{
                  background: data.leastClear === topic ? "#f5a8c0" : "#fff0f4",
                  color: "#1a0f6e",
                  border: `2px solid ${data.leastClear === topic ? "#e87aa0" : "transparent"}`,
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Would recommend */}
        <div className="p-4 rounded-2xl bg-white" style={{ border: "2px solid #fce4e4" }}>
          <p className="text-sm font-bold mb-3" style={{ color: "#1a0f6e" }}>{questions[4]}</p>
          <div className="flex gap-3">
            {[
              { v: "yes", en: "Yes, definitely!", ar: "نعم، بالتأكيد!" },
              { v: "maybe", en: "Maybe", ar: "ربما" },
              { v: "no", en: "Not sure", ar: "غير متأكد" },
            ].map(({ v, en, ar }) => (
              <button
                key={v}
                onClick={() => set("wouldRecommend", v)}
                className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
                style={{
                  background: data.wouldRecommend === v ? "#c5b8f5" : "#f5f0ff",
                  color: "#1a0f6e",
                  border: `2px solid ${data.wouldRecommend === v ? "#a89ae8" : "transparent"}`,
                }}
              >
                {language === "ar" ? ar : en}
              </button>
            ))}
          </div>
        </div>

        {/* Open comments */}
        <div className="p-4 rounded-2xl bg-white" style={{ border: "2px solid #fce4e4" }}>
          <p className="text-sm font-bold mb-2" style={{ color: "#1a0f6e" }}>
            {language === "en" ? "Any other comments or suggestions?" : "أي تعليقات أو اقتراحات أخرى؟"}
          </p>
          <textarea
            value={data.comments}
            onChange={(e) => set("comments", e.target.value)}
            dir={isRTL ? "rtl" : "ltr"}
            rows={3}
            maxLength={500}
            placeholder={language === "en" ? "Your thoughts..." : "أفكارك..."}
            className="w-full p-3 rounded-xl text-sm resize-none outline-none"
            style={{ background: "#fce4e4", border: "none", color: "#1a0f6e" }}
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm font-bold" style={{ color: "#a0361d" }}>{error}</p>
      )}
      <button
        onClick={submit}
        className="w-full mt-5 py-3 rounded-2xl font-black text-sm transition-all"
        style={{ background: "#c5b8f5", color: "#1a0f6e" }}
      >
        {t(language, "submitSurvey")}
      </button>
    </div>
  );
}
