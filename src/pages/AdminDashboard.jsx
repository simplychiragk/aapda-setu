import React, { useEffect, useMemo, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';

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
  const [pageStats, setPageStats] = useState({ mostVisited: [], timeline: [] });

  useEffect(() => {
    // Hardcoded student data
    const hardcodedStudents = [
      { userId: 'stu001', name: 'Rajesh Kumar', email: 'rajesh@example.com', latestQuizScore: 85, videoCompletionsCount: 12, alertsAcknowledged: 3, preparednessPercent: 82 },
      { userId: 'stu002', name: 'Priya Sharma', email: 'priya@example.com', latestQuizScore: 92, videoCompletionsCount: 15, alertsAcknowledged: 5, preparednessPercent: 95 },
      { userId: 'stu003', name: 'Amit Patel', email: 'amit@example.com', latestQuizScore: 78, videoCompletionsCount: 8, alertsAcknowledged: 2, preparednessPercent: 65 },
      { userId: 'stu004', name: 'Sneha Gupta', email: 'sneha@example.com', latestQuizScore: 65, videoCompletionsCount: 6, alertsAcknowledged: 1, preparednessPercent: 45 },
      { userId: 'stu005', name: 'Vikram Singh', email: 'vikram@example.com', latestQuizScore: 45, videoCompletionsCount: 4, alertsAcknowledged: 0, preparednessPercent: 32 },
      { userId: 'stu006', name: 'Anjali Mehta', email: 'anjali@example.com', latestQuizScore: 88, videoCompletionsCount: 10, alertsAcknowledged: 4, preparednessPercent: 79 },
      { userId: 'stu007', name: 'Gigachad', email: 'giga@example.com', latestQuizScore: 99, videoCompletionsCount: 20, alertsAcknowledged: 7, preparednessPercent: 99 },
      { userId: 'stu008', name: 'Sigmaboy', email: 'sigma@example.com', latestQuizScore: 97, videoCompletionsCount: 18, alertsAcknowledged: 6, preparednessPercent: 96 },
      { userId: 'stu009', name: 'Alphamale', email: 'alpha@example.com', latestQuizScore: 95, videoCompletionsCount: 16, alertsAcknowledged: 5, preparednessPercent: 94 },
      { userId: 'stu010', name: 'Innerwolf', email: 'inner@example.com', latestQuizScore: 90, videoCompletionsCount: 14, alertsAcknowledged: 4, preparednessPercent: 88 },
      { userId: 'stu011', name: 'Neha Reddy', email: 'neha@example.com', latestQuizScore: 72, videoCompletionsCount: 7, alertsAcknowledged: 2, preparednessPercent: 58 },
      { userId: 'stu012', name: 'Rahul Verma', email: 'rahul@example.com', latestQuizScore: 38, videoCompletionsCount: 3, alertsAcknowledged: 0, preparednessPercent: 28 },
      { userId: 'stu013', name: 'Divya Joshi', email: 'divya@example.com', latestQuizScore: 82, videoCompletionsCount: 11, alertsAcknowledged: 3, preparednessPercent: 75 },
      { userId: 'stu014', name: 'Karan Malhotra', email: 'karan@example.com', latestQuizScore: 55, videoCompletionsCount: 5, alertsAcknowledged: 1, preparednessPercent: 42 },
      { userId: 'stu015', name: 'Pooja Desai', email: 'pooja@example.com', latestQuizScore: 91, videoCompletionsCount: 13, alertsAcknowledged: 4, preparednessPercent: 87 }
    ];

    // Merge demo current user metrics from localStorage
    const name = localStorage.getItem('username') || 'You';
    const prep = parseInt(localStorage.getItem('preparedness')) || 0;
    const quiz = parseInt(localStorage.getItem('lastQuizPercent')) || 0;
    const drills = (JSON.parse(localStorage.getItem('drillReports')) || []).length;
    const me = { userId: 'you', name, email: '', latestQuizScore: quiz || Math.floor(prep * 0.8), videoCompletionsCount: drills, alertsAcknowledged: 0, preparednessPercent: prep };
    const merged = [me, ...hardcodedStudents];
    setStudents(merged);

    // Build analytics from localStorage visits
    const keys = Object.keys(localStorage).filter((k) => k.startsWith('analytics:'));
    const visitEntries = keys.flatMap((k) => { try { return (JSON.parse(localStorage.getItem(k))?.visits) || []; } catch { return []; } });
    
    // If no analytics data, create sample data
    let mostVisited, timeline;
    if (visitEntries.length === 0) {
      mostVisited = [
        { path: '/courses', count: 42 },
        { path: '/quiz', count: 38 },
        { path: '/dashboard', count: 35 },
        { path: '/videos', count: 29 },
        { path: '/profile', count: 22 },
        { path: '/settings', count: 18 }
      ];
      
      timeline = [
        { day: '2023-10-01', visits: 12 },
        { day: '2023-10-02', visits: 18 },
        { day: '2023-10-03', visits: 15 },
        { day: '2023-10-04', visits: 22 },
        { day: '2023-10-05', visits: 19 },
        { day: '2023-10-06', visits: 8 },
        { day: '2023-10-07', visits: 5 },
        { day: '2023-10-08', visits: 14 },
        { day: '2023-10-09', visits: 21 },
        { day: '2023-10-10', visits: 25 }
      ];
    } else {
      const countByPath = visitEntries.reduce((acc, v) => { acc[v.path] = (acc[v.path] || 0) + 1; return acc; }, {});
      mostVisited = Object.entries(countByPath).map(([path, count]) => ({ path, count })).sort((a, b) => b.count - a.count).slice(0, 6);
      // timeline by day
      const byDay = visitEntries.reduce((acc, v) => { const d = new Date(v.at); const key = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`; acc[key] = (acc[key] || 0) + 1; return acc; }, {});
      timeline = Object.entries(byDay).map(([day, visits]) => ({ day, visits })).sort((a, b) => (a.day > b.day ? 1 : -1));
    }
    
    setPageStats({ mostVisited, timeline });
    setLoading(false);
  }, []);

  const atRisk = useMemo(() => students.filter(s => s.preparednessPercent < 50), [students]);
  const avgQuiz = useMemo(() => Math.round(students.reduce((a, s) => a + (s.latestQuizScore || 0), 0) / (students.length || 1)), [students]);
  const participation = useMemo(() => Math.round(100 * students.filter(s => s.videoCompletionsCount > 0).length / (students.length || 1)), [students]);

  const chartData = useMemo(() => students.slice(0, 8).map((s) => ({ name: s.name || s.userId, score: s.latestQuizScore, videos: s.videoCompletionsCount })), [students]);
  const COLORS = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4'];

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
        {/* Engagement Over Time */}
        <div className="rounded-2xl p-4 bg-white shadow border border-slate-100 lg:col-span-2">
          <div className="font-semibold mb-2">Engagement Over Time</div>
          <div className="h-64">
            {loading ? (
              <div className="animate-pulse h-full bg-slate-100 rounded" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={pageStats.timeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="visits" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        {/* Most Visited Pages */}
        <div className="rounded-2xl p-4 bg-white shadow border border-slate-100 lg:col-span-2">
          <div className="font-semibold mb-2">Most Visited Pages</div>
          <div className="h-72">
            {loading ? (
              <div className="animate-pulse h-full bg-slate-100 rounded" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pageStats.mostVisited}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="path" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count">
                    {pageStats.mostVisited.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
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
