// Leaderboard.jsx
import React, { useEffect, useMemo, useState } from "react";

/* ---------- helpers ---------- */
function generateSyntheticStudents() {
  return Array.from({ length: 15 }).map((_, i) => {
    const quizzes = Math.floor(Math.random() * 10) + 1;
    const score = Math.floor(Math.random() * 41) + 60; // 60-100
    const drills = Math.floor(Math.random() * 8);
    const preparedness = Math.min(100, Math.round(score * 0.6 + drills * 5));
    return {
      userId: `student${i + 1}`,
      name: `Student ${i + 1}`,
      quizScore: score,
      drillsCompleted: drills,
      preparedness,
    };
  });
}

const ACCENT = "#FF6F00"; // Accent Orange (Guardian)

function initials(name = "") {
  return name
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/* ---------- component ---------- */
export default function Leaderboard() {
  const [metric, setMetric] = useState("preparedness");
  const [students, setStudents] = useState([]);

  // load & synth
  useEffect(() => {
    const synth = generateSyntheticStudents();

    // your data from localStorage (same keys you used)
    const myName = localStorage.getItem("username") || "You";
    const myPrep = parseInt(localStorage.getItem("preparedness")) || 0;
    const myQuiz = parseInt(localStorage.getItem("lastQuizPercent")) || 0;
    const myDrills = (JSON.parse(localStorage.getItem("drillReports")) || []).length || 0;

    const me = {
      userId: "you",
      name: myName,
      quizScore: myQuiz,
      drillsCompleted: myDrills,
      preparedness: myPrep,
    };

    // Put 'me' in list (so user is part of ranking). We'll shuffle existing synth a bit to avoid deterministic ordering.
    setStudents([me, ...synth]);
  }, []);

  // sorted by chosen metric (descending)
  const sortedAll = useMemo(() => {
    const list = [...students].sort((a, b) => (b[metric] || 0) - (a[metric] || 0));
    return list;
  }, [students, metric]);

  // top3 for podium (pad if less than 3)
  const podium = useMemo(() => {
    const top = sortedAll.slice(0, 3);
    while (top.length < 3) {
      top.push({
        userId: `placeholder-${top.length}`,
        name: top.length === 0 ? "—" : top.length === 1 ? "—" : "—",
        preparedness: 0,
        quizScore: 0,
        drillsCompleted: 0,
      });
    }
    return top;
  }, [sortedAll]);

  // ranks for table (4..10)
  const tableRows = useMemo(() => sortedAll.slice(3, 10), [sortedAll]);

  // find your rank
  const myRank = useMemo(() => {
    if (!students || students.length === 0) return null;
    const idx = sortedAll.findIndex((s) => s.userId === "you");
    return idx >= 0 ? idx + 1 : null;
  }, [sortedAll, students]);

  const metricLabel = {
    preparedness: "Preparedness %",
    quizScore: "Quiz Score",
    drillsCompleted: "Drills Completed",
  }[metric];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#212121] text-slate-900 dark:text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-6 rounded-2xl overflow-hidden" aria-hidden>
          <div
            className="w-full px-6 py-8 text-center"
            style={{ background: "#0D47A1" }}
          >
            <h1 className="text-white text-3xl font-extrabold">Hall of Guardians — Leaderboard</h1>
            <p className="text-white/90 mt-1">Top performers & your position — stay sharp.</p>
          </div>
        </header>

        {/* Podium + Metric Selector */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-end">
          {/* Left: Metric selector + explanation */}
          <div className={
            "rounded-2xl p-5 " +
            "bg-white/70 border border-slate-200 backdrop-blur-xl " +
            "dark:bg-gray-800/50 dark:backdrop-blur-xl dark:border dark:border-slate-700"
          }>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold dark:text-white">Metric</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Choose which stat defines the ranking.</p>
              </div>
              <div>
                <select
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-transparent text-sm"
                  value={metric}
                  onChange={(e) => setMetric(e.target.value)}
                >
                  <option value="preparedness">Preparedness %</option>
                  <option value="quizScore">Quiz score</option>
                  <option value="drillsCompleted">Drills completed</option>
                </select>
              </div>
            </div>

            <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              {metric === "preparedness" && "Preparedness blends quiz performance and practice drills — top indicator of readiness."}
              {metric === "quizScore" && "Pure quiz performance — who aced the tests."}
              {metric === "drillsCompleted" && "Practice grind — who completed the most drills."}
            </div>
          </div>

          {/* Podium center (1) - larger */}
          <div className={
            "relative rounded-3xl p-6 flex flex-col items-center " +
            "bg-white/70 border border-slate-200 backdrop-blur-xl " +
            "dark:bg-gray-800/50 dark:backdrop-blur-xl dark:border dark:border-slate-700"
          }>
            {/* gold glow for #1 */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full" style={{
              boxShadow: `0 10px 40px -10px ${ACCENT}`,
              background: "linear-gradient(180deg, rgba(255,111,0,0.08), transparent)"
            }} />
            <div className="z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center border-4" style={{ borderColor: ACCENT, background: "rgba(255,111,0,0.06)" }}>
                <div className="text-xl font-bold text-black">{initials(podium[0].name)}</div>
              </div>
              <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">#1</div>
              <div className="mt-2 text-xl font-extrabold dark:text-white">{podium[0].name}</div>
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{metricLabel}: <span className="font-bold">{podium[0][metric]}{metric === "preparedness" ? "%" : ""}</span></div>
            </div>
          </div>

          {/* Podium right – 2 & 3 stacked */}
          <div className="space-y-4">
            {/* #2 */}
            <div className={
              "rounded-2xl p-4 flex items-center gap-4 " +
              "bg-white/70 border border-slate-200 backdrop-blur-xl " +
              "dark:bg-gray-800/50 dark:backdrop-blur-xl dark:border dark:border-slate-700"
            }>
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-slate-100 dark:bg-[rgba(255,255,255,0.03)] border" style={{ borderColor: "silver" }}>
                <div className="font-semibold">{initials(podium[1].name)}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500 dark:text-slate-400">#2 — {podium[1].name}</div>
                <div className="text-lg font-bold dark:text-white">{podium[1][metric]}{metric === "preparedness" ? "%" : ""}</div>
              </div>
            </div>

            {/* #3 */}
            <div className={
              "rounded-2xl p-4 flex items-center gap-4 " +
              "bg-white/70 border border-slate-200 backdrop-blur-xl " +
              "dark:bg-gray-800/50 dark:backdrop-blur-xl dark:border dark:border-slate-700"
            }>
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-slate-100 dark:bg-[rgba(255,255,255,0.03)] border" style={{ borderColor: "#b0763b" }}>
                <div className="font-semibold">{initials(podium[2].name)}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500 dark:text-slate-400">#3 — {podium[2].name}</div>
                <div className="text-lg font-bold dark:text-white">{podium[2][metric]}{metric === "preparedness" ? "%" : ""}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Your Rank widget (full width glass card) */}
        <section className={
          "rounded-2xl p-5 mb-6 " +
          "bg-white/70 border border-slate-200 backdrop-blur-xl " +
          "dark:bg-gray-800/50 dark:backdrop-blur-xl dark:border dark:border-slate-700"
        } aria-live="polite">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ border: `2px solid ${ACCENT}`, background: "rgba(255,111,0,0.06)" }}>
                <span className="font-bold text-black">{initials(students.find(s => s.userId === "you")?.name || "You")}</span>
              </div>
              <div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Your Rank</div>
                <div className="text-2xl font-extrabold dark:text-white">#{myRank ?? "—"}</div>
                <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">{students.find(s => s.userId === "you")?.name || "You"}</div>
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-2">
                <div>{metricLabel}</div>
                <div className="font-semibold dark:text-white">{students.find(s => s.userId === "you")?.[metric] ?? "—"}{metric === "preparedness" ? "%" : ""}</div>
              </div>

              {/* progress bar for preparedness (only visual) */}
              <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(100, Math.max(0, students.find(s => s.userId === "you")?.preparedness || 0))}%`,
                    background: `linear-gradient(90deg, ${ACCENT}, #FFA64D)`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Leaderboard table card (ranks 4+) */}
        <section className={
          "rounded-2xl p-6 " +
          "bg-white/70 border border-slate-200 backdrop-blur-xl " +
          "dark:bg-gray-800/50 dark:backdrop-blur-xl dark:border dark:border-slate-700"
        }>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold dark:text-white">Leaderboard — Ranks 4+</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Showing the next top performers based on <span className="font-semibold">{metricLabel}</span>.</p>
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Showing {Math.max(0, tableRows.length)} entries</div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left px-4 py-2 text-slate-600 dark:text-slate-400">Rank</th>
                  <th className="text-left px-4 py-2 text-slate-600 dark:text-slate-400">Name</th>
                  <th className="text-left px-4 py-2 text-slate-600 dark:text-slate-400">{metricLabel}</th>
                  <th className="text-left px-4 py-2 text-slate-600 dark:text-slate-400">Quiz</th>
                  <th className="text-left px-4 py-2 text-slate-600 dark:text-slate-400">Drills</th>
                </tr>
              </thead>

              <tbody>
                {tableRows.map((s, i) => {
                  const rank = i + 4; // because tableRows starts at index 0 -> rank 4
                  const isYou = s.userId === "you";
                  return (
                    <tr
                      key={s.userId}
                      className={`
                        ${isYou ? "ring-2 ring-[#FF6F00]/30" : ""}
                      `}
                    >
                      <td className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 font-semibold">{rank}</td>
                      <td className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-[rgba(255,255,255,0.03)] text-sm font-semibold">{initials(s.name)}</div>
                          <div>
                            <div className="font-medium dark:text-white">{s.name}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">ID: {s.userId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 font-bold">{s[metric]}{metric === "preparedness" ? "%" : ""}</td>
                      <td className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">{s.quizScore}%</td>
                      <td className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">{s.drillsCompleted}</td>
                    </tr>
                  );
                })}

                {tableRows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-slate-500 dark:text-slate-400">
                      No additional ranks to show.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
