import { useApp } from "@/context/AppContext";
import { LESSONS } from "@/lib/lessons";

const difficultyColors = {
  Beginner: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Intermediate: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Advanced: "text-red-400 bg-red-400/10 border-red-400/20",
};

export default function LessonsPage() {
  const { role, teacherState, updateTeacherState } = useApp();

  const handleSelectLesson = (lessonId: string) => {
    if (role !== "teacher") return;
    updateTeacherState({ currentLessonId: lessonId, activeView: "lessons" });
  };

  const currentLesson = LESSONS.find((l) => l.id === teacherState.currentLessonId);

  if (currentLesson) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <button
          onClick={() => updateTeacherState({ currentLessonId: null })}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to lessons
        </button>

        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h1 className="text-2xl font-bold text-white">{currentLesson.title}</h1>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${difficultyColors[currentLesson.difficulty]}`}>
              {currentLesson.difficulty}
            </span>
          </div>
          <p className="text-gray-400 text-sm">{currentLesson.description}</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {currentLesson.topics.map((t) => (
              <span key={t} className="text-xs px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {currentLesson.content.map((section, i) => (
            <div key={section.id} className="bg-gray-900/60 border border-gray-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono text-gray-600 w-5">{i + 1}.</span>
                <h3 className="font-semibold text-white">{section.title}</h3>
                {section.visualHint && section.visualHint !== "none" && (
                  <span
                    className="ml-auto text-xs px-1.5 py-0.5 rounded bg-indigo-600/20 text-indigo-300 border border-indigo-600/30 cursor-pointer hover:bg-indigo-600/30 transition-colors"
                    onClick={() => {
                      if (role === "teacher" && section.visualHint === "bloch") {
                        updateTeacherState({
                          activeView: "bloch",
                          ...(section.blochState ? { blochState: section.blochState } : {}),
                        });
                      } else if (role === "teacher" && section.visualHint === "circuit") {
                        updateTeacherState({ activeView: "circuit" });
                      }
                    }}
                  >
                    {section.visualHint === "bloch" ? "Open Bloch Sphere" : "Open Circuit"}
                  </span>
                )}
              </div>
              <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line font-mono bg-gray-950/50 rounded-lg p-3 border border-gray-800">
                {section.body}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Lessons</h1>
        <p className="text-gray-400 text-sm">
          {role === "teacher"
            ? "Select a lesson to begin. Students will see your selection in sync."
            : "Follow along as your teacher selects and navigates lessons."}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {LESSONS.map((lesson) => {
          const isActive = teacherState.currentLessonId === lesson.id;
          return (
            <button
              key={lesson.id}
              onClick={() => handleSelectLesson(lesson.id)}
              disabled={role === "student"}
              className={`text-left p-4 rounded-xl border transition-all ${
                isActive
                  ? "border-indigo-500 bg-indigo-500/10"
                  : role === "teacher"
                  ? "border-gray-800 bg-gray-900/60 hover:border-gray-600 hover:bg-gray-900"
                  : "border-gray-800 bg-gray-900/40 cursor-default"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-white text-sm">{lesson.title}</h3>
                <span className={`shrink-0 text-xs font-medium px-1.5 py-0.5 rounded border ${difficultyColors[lesson.difficulty]}`}>
                  {lesson.difficulty}
                </span>
              </div>
              <p className="text-gray-400 text-xs mb-3 line-clamp-2">{lesson.description}</p>
              <div className="flex flex-wrap gap-1 mb-2">
                {lesson.topics.slice(0, 3).map((t) => (
                  <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>{lesson.content.length} sections</span>
                <span>~{lesson.estimatedMinutes} min</span>
                {isActive && <span className="text-indigo-400 font-medium">Active</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
