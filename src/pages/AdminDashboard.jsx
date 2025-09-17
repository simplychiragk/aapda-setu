import React, { useEffect, useMemo, useState } from 'react';
import { Download, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import LoadingSpinner from '../components/LoadingSpinner';

function toCSV(rows) {
  const header = Object.keys(rows[0] || {});
  const csv = [header.join(',')].concat(rows.map(r => header.map(h => JSON.stringify(r[h] ?? '')).join(',')));
  return csv.join('\n');
}

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [pageStats, setPageStats] = useState({ mostVisited: [], timeline: [] });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/students', { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to load');
        const data = await res.json();
        // Merge demo current user metrics from localStorage
        const name = localStorage.getItem('username') || 'You';
        const prep = parseInt(localStorage.getItem('preparedness')) || 0;
        const quiz = parseInt(localStorage.getItem('lastQuizPercent')) || 0;
        const me = { userId: 'you', name, email: '', latestQuizScore: quiz || Math.floor(prep * 0.8), videoCompletionsCount: 0, alertsAcknowledged: 0, preparednessPercent: prep };
        const merged = [me, ...(data.students || [])];
        setStudents(merged);

        // Build analytics from localStorage visits
        const keys = Object.keys(localStorage).filter((k) => k.startsWith('analytics:'));
        const visitEntries = keys.flatMap((k) => { try { return (JSON.parse(localStorage.getItem(k))?.visits) || []; } catch { return []; } });
        const countByPath = visitEntries.reduce((acc, v) => { acc[v.path] = (acc[v.path] || 0) + 1; return acc; }, {});
        const mostVisited = Object.entries(countByPath).map(([path, count]) => ({ path, count })).sort((a, b) => b.count - a.count).slice(0, 6);
        // timeline by day
        const byDay = visitEntries.reduce((acc, v) => { const d = new Date(v.at); const key = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`; acc[key] = (acc[key] || 0) + 1; return acc; }, {});
        const timeline = Object.entries(byDay).map(([day, visits]) => ({ day, visits })).sort((a, b) => (a.day > b.day ? 1 : -1));
        setPageStats({ mostVisited, timeline });
      } catch (err) { 
        setError('Failed to load students'); 
        console.error('Admin dashboard error:', err);
      }
      finally { setLoading(false); }
    })();
  }, []);

  const atRisk = useMemo(() => students.filter(s => s.preparednessPercent < 50), [students]);
  const avgQuiz = useMemo(() => Math.round(students.reduce((a, s) => a + (s.latestQuizScore || 0), 0) / (students.length || 1)), [students]);
  const participation = useMemo(() => Math.round(100 * students.filter(s => s.videoCompletionsCount > 0).length / (students.length || 1)), [students]);

  const chartData = useMemo(() => students.slice(0, 8).map((s) => ({ name: s.name || s.userId, score: s.latestQuizScore, videos: s.videoCompletionsCount })), [students]);
  const COLORS = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4'];

  const exportCSV = () => {
    if (!students.length) return;
    try {
    const csv = toCSV(students);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'students.csv'; a.click(); URL.revokeObjectURL(url);
    } catch (err) {
      console.error('CSV export error:', err);
      alert('Failed to export CSV');
    }
  };

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-600 mb-4">
          <AlertTriangle size={48} className="mx-auto mb-2" />
          <h2 className="text-xl font-semibold">Error Loading Dashboard</h2>
          <p className="text-sm">{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Admin Dashboard</h1>
        <p className="text-slate-600">Overview of student preparedness</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl p-5 bg-white shadow border border-slate-100">
          <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-slate-600">Average Quiz Score</div>
            <TrendingUp size={20} className="text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-blue-600">{loading ? '—' : `${avgQuiz}%`}</div>
        </div>
        <div className="rounded-2xl p-5 bg-white shadow border border-slate-100">
          <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-slate-600">Participation Rate</div>
            <Users size={20} className="text-emerald-600" />
          </div>
          <div className="text-3xl font-bold text-emerald-600">{loading ? '—' : `${participation}%`}</div>
        </div>
        <div className="rounded-2xl p-5 bg-white shadow border border-slate-100">
          <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-slate-600">At-Risk Students</div>
            <AlertTriangle size={20} className="text-rose-600" />
          </div>
          <div className="text-3xl font-bold text-rose-600">{loading ? '—' : atRisk.length}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl p-4 bg-white shadow border border-slate-100">
          <div className="font-semibold mb-2">Average Quiz Scores</div>
          <div className="h-64">
            {loading ? (
              <LoadingSpinner message="Loading chart data..." />
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
              <LoadingSpinner message="Loading chart data..." />
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
              <LoadingSpinner message="Loading engagement data..." />
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
              <LoadingSpinner message="Loading page data..." />
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
            <button 
              onClick={exportCSV} 
              disabled={loading || !students.length}
              className="px-3 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Download size={16} />
              Export CSV
            </button>
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
                <tr><td colSpan="6"><LoadingSpinner message="Loading students..." /></td></tr>
              ) : (
                students.map((s) => (
                  <tr 
                    key={s.userId} 
                    className="border-t border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors" 
                    onClick={() => setSelected(s)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setSelected(s)}
                  >
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
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="student-detail-title">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSelected(null)} />
          <div className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 id="student-detail-title" className="font-semibold">{selected.name}</h2>
              <button 
                onClick={() => setSelected(null)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                aria-label="Close student details"
              >
                ✖
              </button>
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
