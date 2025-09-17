import React, { useEffect, useMemo, useState } from 'react';

function generateSyntheticStudents() {
  return Array.from({ length: 15 }).map((_, i) => {
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

export default function Leaderboard() {
  const [metric, setMetric] = useState('preparedness');
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const synth = generateSyntheticStudents();
    const myName = localStorage.getItem('username') || 'You';
    const myPrep = parseInt(localStorage.getItem('preparedness')) || 0;
    const myQuiz = parseInt(localStorage.getItem('lastQuizPercent')) || 0;
    const myDrills = (JSON.parse(localStorage.getItem('drillReports')) || []).length;
    const me = { userId: 'you', name: myName, quizScore: myQuiz, drillsCompleted: myDrills, preparedness: myPrep };
    setStudents([me, ...synth]);
  }, []);

  const sorted = useMemo(() => {
    const list = [...students];
    list.sort((a, b) => (b[metric] || 0) - (a[metric] || 0));
    return list.slice(0, 10);
  }, [students, metric]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-violet-500 to-blue-500 text-white p-8 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🏆</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
            <p className="text-violet-100">Top students by preparedness, quiz score, or drills</p>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold">Metric</div>
              <select value={metric} onChange={(e) => setMetric(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200 bg-white">
                <option value="preparedness">Preparedness %</option>
                <option value="quizScore">Quiz score</option>
                <option value="drillsCompleted">Drills completed</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-4 py-2">Rank</th>
                    <th className="text-left px-4 py-2">Name</th>
                    <th className="text-left px-4 py-2">Preparedness</th>
                    <th className="text-left px-4 py-2">Quiz Score</th>
                    <th className="text-left px-4 py-2">Drills</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((s, idx) => (
                    <tr key={s.userId} className={`border-t ${idx === 0 ? 'bg-yellow-50' : ''}`}>
                      <td className="px-4 py-2 font-bold">{idx + 1}</td>
                      <td className="px-4 py-2">{s.name}</td>
                      <td className="px-4 py-2">{s.preparedness}%</td>
                      <td className="px-4 py-2">{s.quizScore}%</td>
                      <td className="px-4 py-2">{s.drillsCompleted}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

