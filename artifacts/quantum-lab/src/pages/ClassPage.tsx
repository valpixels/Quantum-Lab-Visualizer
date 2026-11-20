import { useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { LESSONS } from "@/lib/lessons";
import { t } from "@/lib/i18n";

/** Quote a CSV cell and neutralise spreadsheet formulas (=, +, -, @) typed by students. */
function csvCell(value: string | number): string {
  let s = String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return `"${s.replace(/"/g, '""')}"`;
}

function download(filename: string, rows: (string | number)[][]) {
  const text = "﻿" + rows.map((r) => r.map(csvCell).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const totalTasks = LESSONS.reduce((n, l) => n + (l.practice?.length ?? 0), 0);

export default function ClassPage() {
  const { language, progress, clients, room } = useApp();
  const isRTL = language === "ar";
  const title = (l: (typeof LESSONS)[number]) => (language === "ar" ? (l.title_ar ?? l.title) : l.title);

  const students = progress?.students ?? [];
  const surveys = progress?.surveys ?? [];

  const onlineIds = useMemo(() => {
    const m = new Map<string, boolean>();
    for (const c of clients) if (c.studentId) m.set(c.studentId, c.synced);
    return m;
  }, [clients]);

  const avg = (xs: number[]) => (xs.length ? (xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(1) : "–");
  const topicCounts = (key: "mostInteresting" | "leastClear") =>
    LESSONS.map((l) => ({ l, n: surveys.filter((s) => s[key] === l.id).length })).filter((x) => x.n > 0);

  const exportProgress = () =>
    download(`quantum-lab-progress-${room ?? "class"}.csv`, [
      ["Name", ...LESSONS.map((l) => `Quiz: ${l.title}`), "Practice tasks done", "Feedback sent"],
      ...students.map((s) => [
        s.name,
        ...LESSONS.map((l) => (s.quizzes[l.id] ? `${s.quizzes[l.id].score}/${s.quizzes[l.id].total}` : "")),
        s.tasks.length,
        s.surveyDone ? "yes" : "no",
      ]),
    ]);

  const exportSurvey = () =>
    download(`quantum-lab-survey-${room ?? "class"}.csv`, [
      ["Overall rating", "Difficulty", "Most interesting", "Least clear", "Would recommend", "Comments"],
      ...surveys.map((s) => [s.overallRating, s.difficulty, s.mostInteresting, s.leastClear, s.wouldRecommend, s.comments]),
    ]);

  const card = { background: "white", border: "2px solid #c5b8f5", ["--shadow-color" as string]: "#6b3abf" };

  return (
    <div className="p-5 max-w-4xl mx-auto" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <h2 className="text-2xl font-black" style={{ color: "#1a0f6e" }}>{t(language, "classResults")}</h2>
        <div className="ms-auto flex gap-2">
          <button onClick={exportProgress} disabled={!students.length}
            className="px-3 py-1.5 rounded-xl text-xs font-black disabled:opacity-40" style={{ background: "#c5b8f5", color: "#1a0f6e" }}>
            {t(language, "downloadProgress")}
          </button>
          <button onClick={exportSurvey} disabled={!surveys.length}
            className="px-3 py-1.5 rounded-xl text-xs font-black disabled:opacity-40" style={{ background: "#a8d8f5", color: "#1a0f6e" }}>
            {t(language, "downloadSurvey")}
          </button>
        </div>
      </div>

      <div className="rounded-2xl p-3 overflow-x-auto solid-shadow-sm" style={card}>
        {students.length === 0 ? (
          <p className="text-sm py-4 text-center" style={{ color: "#7c6fcd" }}>{t(language, "noStudentsYet")}</p>
        ) : (
          <table className="w-full text-xs" style={{ color: "#1a0f6e" }}>
            <thead>
              <tr style={{ textAlign: isRTL ? "right" : "left" }}>
                <th className="p-2"> </th>
                {LESSONS.map((l) => (
                  <th key={l.id} className="p-2 font-black" title={title(l)}>{l.dayIndex}</th>
                ))}
                <th className="p-2 font-black">{t(language, "practice")}</th>
                <th className="p-2 font-black">{t(language, "feedback")}</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => {
                const on = onlineIds.has(s.studentId);
                return (
                  <tr key={s.studentId} style={{ borderTop: "1px solid #fce4e4" }}>
                    <td className="p-2 font-bold whitespace-nowrap">
                      <span aria-label={on ? t(language, "online") : t(language, "offline")}
                        className="inline-block w-2 h-2 rounded-full me-2"
                        style={{ background: on ? "#1f9d5a" : "#c9c2e8" }} />
                      {s.name}
                    </td>
                    {LESSONS.map((l) => {
                      const q = s.quizzes[l.id];
                      return (
                        <td key={l.id} className="p-2 font-mono" dir="ltr">
                          {q ? `${q.score}/${q.total}` : "–"}
                        </td>
                      );
                    })}
                    <td className="p-2 font-mono" dir="ltr">{s.tasks.length}/{totalTasks}</td>
                    <td className="p-2">{s.surveyDone ? "✓" : "–"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        <p className="text-xs mt-2" style={{ color: "#7c6fcd" }}>
          {LESSONS.map((l) => `${l.dayIndex} = ${title(l)}`).join(" · ")}
        </p>
      </div>

      <h3 className="text-lg font-black mt-6 mb-2" style={{ color: "#1a0f6e" }}>
        {t(language, "anonymousSurvey")} ({surveys.length})
      </h3>
      <div className="rounded-2xl p-4 solid-shadow-sm" style={card}>
        {surveys.length === 0 ? (
          <p className="text-sm text-center" style={{ color: "#7c6fcd" }}>–</p>
        ) : (
          <div className="space-y-3 text-sm" style={{ color: "#1a0f6e" }}>
            <p>
              ⭐ {avg(surveys.map((s) => s.overallRating))} / 5 &nbsp;·&nbsp;
              {language === "ar" ? "الصعوبة" : "Difficulty"} {avg(surveys.map((s) => s.difficulty))} / 5
            </p>
            {(["mostInteresting", "leastClear"] as const).map((k) => (
              <p key={k}>
                <b>{k === "mostInteresting" ? (language === "ar" ? "الأكثر إثارة: " : "Most interesting: ") : (language === "ar" ? "الأقل وضوحاً: " : "Least clear: ")}</b>
                {topicCounts(k).map(({ l, n }) => `${title(l)} (${n})`).join(", ") || "–"}
              </p>
            ))}
            <ul className="space-y-1">
              {surveys.filter((s) => s.comments).map((s, i) => (
                <li key={i} className="p-2 rounded-xl text-xs" style={{ background: "#f5f0ff" }}>“{s.comments}”</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
