import React, { useEffect, useMemo, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';

function toCSV(rows) {
  const header = Object.keys(rows[0] || {});
  const csv = [header.join(',')].concat(rows.map(r => header.map(h => JSON.stringify(r[h] ?? '')).join(',')));
  return csv.join('\n');
}

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setErrorText] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/students', { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to load');
        const data = await res.json();
        setStudents(data.students || []);
      } catch { setErrorText('Failed to load students'); }
      finally { setLoading(false); }
    })();
  }, []);

  const atRisk = useMemo(() => students.filter(s => s.preparednessPercent < 50), [students]);
  const avgQuiz = useMemo(() => Math.round(students.reduce((a, s) => a + (s.latestQuizScore || 0), 0) / (students.length || 1)), [students]);
  const participation = useMemo(() => Math.round(100 * students.filter(s => s.videoCompletionsCount > 0).length / (students.length || 1)), [students]);

  const chartData = useMemo(() => students.slice(0, 8).map((s) => ({ name: s.name || s.userId, score: s.latestQuizScore, videos: s.videoCompletionsCount })), [students]);

  const exportCSV = () => {
    if (!students.length) return;
    const csv = toCSV(students);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'students.csv'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Admin Dashboard</h1>
        <p className="text-slate-600">Overview of student preparedness</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl p-5 bg-white shadow border border-slate-100">
          <div className="text-sm text-slate-600">Average Quiz Score</div>
          <div className="text-3xl font-bold text-blue-600">{loading ? '—' : `${avgQuiz}%`}</div>
        </div>
        <div className="rounded-2xl p-5 bg-white shadow border border-slate-100">
          <div className="text-sm text-slate-600">Participation Rate</div>
          <div className="text-3xl font-bold text-emerald-600">{loading ? '—' : `${participation}%`}</div>
        </div>
        <div className="rounded-2xl p-5 bg-white shadow border border-slate-100">
          <div className="text-sm text-slate-600">At-Risk Students</div>
          <div className="text-3xl font-bold text-rose-600">{loading ? '—' : atRisk.length}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl p-4 bg-white shadow border border-slate-100">
          <div className="font-semibold mb-2">Average Quiz Scores</div>
          <div className="h-64">
            {loading ? (
              <div className="animate-pulse h-full bg-slate-100 rounded" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" hide />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        <div className="rounded-2xl p-4 bg-white shadow border border-slate-100">
          <div className="font-semibold mb-2">Videos Watched</div>
          <div className="h-64">
            {loading ? (
              <div className="animate-pulse h-full bg-slate-100 rounded" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" hide />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="videos" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white shadow border border-slate-100 overflow-hidden">
        <div className="p-4 flex items-center justify-between">
          <div className="font-semibold">Students</div>
          <div className="flex gap-2">
            <button onClick={exportCSV} className="px-3 py-2 rounded-lg bg-slate-900 text-white">Export CSV</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-4 py-2">Name</th>
                <th className="text-left px-4 py-2">User ID</th>
                <th className="text-left px-4 py-2">Quiz</th>
                <th className="text-left px-4 py-2">Videos</th>
                <th className="text-left px-4 py-2">Alerts</th>
                <th className="text-left px-4 py-2">Preparedness</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6"><div className="h-24 animate-pulse bg-slate-100" /></td></tr>
              ) : (
                students.map((s) => (
                  <tr key={s.userId} className="border-t border-slate-100 hover:bg-slate-50 cursor-pointer" onClick={() => setSelected(s)}>
                    <td className="px-4 py-2">{s.name}</td>
                    <td className="px-4 py-2">{s.userId}</td>
                    <td className="px-4 py-2">{s.latestQuizScore}%</td>
                    <td className="px-4 py-2">{s.videoCompletionsCount}</td>
                    <td className="px-4 py-2">{s.alertsAcknowledged}</td>
                    <td className="px-4 py-2 font-semibold">{s.preparednessPercent}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* At risk panel */}
      <div className="rounded-2xl p-4 bg-white shadow border border-slate-100">
        <div className="font-semibold mb-2">At-Risk Students</div>
        {atRisk.length === 0 ? (
          <div className="text-slate-500 text-sm">None 🎉</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {atRisk.map((s) => (
              <div key={s.userId} className="px-3 py-2 rounded-full border border-rose-200 text-rose-700 bg-rose-50">
                {s.name} ({s.preparednessPercent}%)
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail side panel */}
      {selected && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSelected(null)} />
          <div className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold">{selected.name}</div>
              <button onClick={() => setSelected(null)}>✖</button>
            </div>
            <div className="space-y-2 text-sm">
              <div>User ID: {selected.userId}</div>
              <div>Latest Quiz Score: {selected.latestQuizScore}%</div>
              <div>Videos Watched: {selected.videoCompletionsCount}</div>
              <div>Alerts Acknowledged: {selected.alertsAcknowledged}</div>
              <div>Preparedness: {selected.preparednessPercent}%</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
