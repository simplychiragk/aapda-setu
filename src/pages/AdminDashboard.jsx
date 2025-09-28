// AdminDashboard.jsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

/**
 * Guardian Theme constants
 */
const THEME = {
  bg: '#212121', // dark charcoal
  headerBg: '#0D47A1', // deep blue
  accent: '#FF6F00', // accent orange
  alert: '#D50000', // alert red
  primaryText: '#FFFFFF',
  secondaryText: '#B0B0B0',
  glassBorder: 'border-slate-700',
};

function toCSV(rows = []) {
  if (!rows.length) return '';
  const header = Object.keys(rows[0]);
  const csv = [header.join(',')].concat(
    rows.map((r) => header.map((h) => JSON.stringify(r[h] ?? '')).join(','))
  );
  return csv.join('\n');
}

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [pageStats, setPageStats] = useState({ mostVisited: [], timeline: [] });

  useEffect(() => {
    // Hardcoded demo student data (you can replace with API calls)
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

    // Demo: merge "me" from localStorage if present
    const name = localStorage.getItem('username') || 'You';
    const prep = parseInt(localStorage.getItem('preparedness')) || 0;
    const quiz = parseInt(localStorage.getItem('lastQuizPercent')) || 0;
    const drills = (JSON.parse(localStorage.getItem('drillReports')) || []).length;
    const me = { userId: 'you', name, email: '', latestQuizScore: quiz || Math.floor(prep * 0.8), videoCompletionsCount: drills, alertsAcknowledged: 0, preparednessPercent: prep };
    const merged = [me, ...hardcodedStudents];
    setStudents(merged);

    // Build demo analytics (or read from localStorage)
    const keys = Object.keys(localStorage).filter((k) => k.startsWith('analytics:'));
    const visitEntries = keys.flatMap((k) => {
      try { return (JSON.parse(localStorage.getItem(k))?.visits) || []; } catch { return []; }
    });

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
      const byDay = visitEntries.reduce((acc, v) => { const d = new Date(v.at); const key = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`; acc[key] = (acc[key] || 0) + 1; return acc; }, {});
      timeline = Object.entries(byDay).map(([day, visits]) => ({ day, visits })).sort((a, b) => (a.day > b.day ? 1 : -1));
    }

    setPageStats({ mostVisited, timeline });
    setLoading(false);
  }, []);

  const atRisk = useMemo(() => students.filter((s) => s.preparednessPercent < 50), [students]);
  const avgQuiz = useMemo(() => Math.round(students.reduce((a, s) => a + (s.latestQuizScore || 0), 0) / (students.length || 1)), [students]);
  const participation = useMemo(() => Math.round(100 * students.filter((s) => s.videoCompletionsCount > 0).length / (students.length || 1)), [students]);

  const chartData = useMemo(() => students.slice(0, 8).map((s) => ({ name: s.name || s.userId, score: s.latestQuizScore, videos: s.videoCompletionsCount })), [students]);

  const COLORS = ['#0D47A1', '#06b6d4', THEME.accent, '#8b5cf6', '#10b981', '#b91c1c'];

  const exportCSV = () => {
    if (!students.length) return;
    const csv = toCSV(students);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ background: THEME.bg, minHeight: '100vh', color: THEME.primaryText }} className="p-6">
      {/* Header */}
      <div
        className="rounded-2xl mb-6"
        style={{
          background: THEME.headerBg,
          boxShadow: '0 6px 20px rgba(0,0,0,0.6)',
        }}
      >
        <div className="p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold" style={{ color: THEME.primaryText }}>Command Center</h1>
            <p className="text-sm" style={{ color: THEME.secondaryText }}>Admin dashboard — Guardian theme</p>
          </div>
          <div className="flex items-center gap-3">
            {/* lightweight action placeholders */}
            <div className="text-sm px-3 py-2 rounded-md" style={{ color: THEME.primaryText, background: 'rgba(255,255,255,0.04)' }}>
              Last sync: {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* generic glass card style */}
        <div className={`rounded-2xl p-5 backdrop-blur-md ${THEME.glassBorder} border bg-[rgba(255,255,255,0.03)]`}>
          <div className="text-sm" style={{ color: THEME.secondaryText }}>Average Quiz Score</div>
          <div className="text-3xl font-bold" style={{ color: THEME.primaryText }}>{loading ? '—' : `${avgQuiz}%`}</div>
          <div className="mt-2 text-xs" style={{ color: THEME.secondaryText }}>Live overview of quiz performance</div>
        </div>

        <div className={`rounded-2xl p-5 backdrop-blur-md ${THEME.glassBorder} border bg-[rgba(255,255,255,0.03)]`}>
          <div className="text-sm" style={{ color: THEME.secondaryText }}>Participation Rate</div>
          <div className="text-3xl font-bold" style={{ color: THEME.primaryText }}>{loading ? '—' : `${participation}%`}</div>
          <div className="mt-2 text-xs" style={{ color: THEME.secondaryText }}>Active learners (watched at least one video)</div>
        </div>

        {/* At-Risk card: add red glow/border when >0 */}
        <div
          className={`rounded-2xl p-5 backdrop-blur-md ${THEME.glassBorder} border bg-[rgba(255,255,255,0.03)] relative`}
          style={{
            borderColor: atRisk.length > 0 ? THEME.alert : undefined,
            boxShadow: atRisk.length > 0 ? `0 6px 20px ${THEME.alert}33, 0 0 12px ${THEME.alert}66` : undefined,
          }}
        >
          <div className="text-sm" style={{ color: THEME.secondaryText }}>At-Risk Students</div>
          <div className="text-3xl font-bold" style={{ color: atRisk.length > 0 ? THEME.alert : THEME.primaryText }}>
            {loading ? '—' : atRisk.length}
          </div>
          <div className="mt-2 text-xs" style={{ color: THEME.secondaryText }}>Students with preparedness &lt; 50%</div>
        </div>
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Avg Quiz Line */}
        <div className={`rounded-2xl p-4 backdrop-blur-md ${THEME.glassBorder} border bg-[rgba(255,255,255,0.03)]`}>
          <div className="font-semibold mb-2" style={{ color: THEME.primaryText }}>Average Quiz Scores</div>
          <div className="h-64">
            {loading ? (
              <div className="animate-pulse h-full rounded" style={{ background: 'rgba(255,255,255,0.02)' }} />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(176,176,176,0.08)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: THEME.secondaryText }} tickLine={false} axisLine={{ stroke: 'rgba(176,176,176,0.08)' }} />
                  <YAxis tick={{ fill: THEME.secondaryText }} tickLine={false} axisLine={{ stroke: 'rgba(176,176,176,0.08)' }} />
                  <Tooltip
                    wrapperStyle={{ background: '#111827', border: '1px solid rgba(176,176,176,0.08)' }}
                    contentStyle={{ background: '#0b1220', borderRadius: 6 }}
                    itemStyle={{ color: THEME.primaryText }}
                    labelStyle={{ color: THEME.secondaryText }}
                  />
                  <Line type="monotone" dataKey="score" stroke={THEME.accent} strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Videos Bar */}
        <div className={`rounded-2xl p-4 backdrop-blur-md ${THEME.glassBorder} border bg-[rgba(255,255,255,0.03)]`}>
          <div className="font-semibold mb-2" style={{ color: THEME.primaryText }}>Videos Watched</div>
          <div className="h-64">
            {loading ? (
              <div className="animate-pulse h-full rounded" style={{ background: 'rgba(255,255,255,0.02)' }} />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(176,176,176,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: THEME.secondaryText }} tickLine={false} axisLine={{ stroke: 'rgba(176,176,176,0.06)' }} />
                  <YAxis tick={{ fill: THEME.secondaryText }} tickLine={false} axisLine={{ stroke: 'rgba(176,176,176,0.06)' }} />
                  <Tooltip
                    wrapperStyle={{ background: '#111827', border: '1px solid rgba(176,176,176,0.06)' }}
                    contentStyle={{ background: '#0b1220', borderRadius: 6 }}
                    itemStyle={{ color: THEME.primaryText }}
                    labelStyle={{ color: THEME.secondaryText }}
                  />
                  <Bar dataKey="videos">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Engagement Over Time - large spanning */}
        <div className={`rounded-2xl p-4 backdrop-blur-md ${THEME.glassBorder} border bg-[rgba(255,255,255,0.03)] lg:col-span-2`}>
          <div className="font-semibold mb-2" style={{ color: THEME.primaryText }}>Engagement Over Time</div>
          <div className="h-64">
            {loading ? (
              <div className="animate-pulse h-full rounded" style={{ background: 'rgba(255,255,255,0.02)' }} />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={pageStats.timeline} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(176,176,176,0.06)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: THEME.secondaryText }} tickLine={false} axisLine={{ stroke: 'rgba(176,176,176,0.06)' }} />
                  <YAxis tick={{ fill: THEME.secondaryText }} tickLine={false} axisLine={{ stroke: 'rgba(176,176,176,0.06)' }} />
                  <Tooltip
                    wrapperStyle={{ background: '#111827', border: '1px solid rgba(176,176,176,0.06)' }}
                    contentStyle={{ background: '#0b1220', borderRadius: 6 }}
                    itemStyle={{ color: THEME.primaryText }}
                    labelStyle={{ color: THEME.secondaryText }}
                  />
                  <Line type="monotone" dataKey="visits" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Most Visited Pages */}
        <div className={`rounded-2xl p-4 backdrop-blur-md ${THEME.glassBorder} border bg-[rgba(255,255,255,0.03)] lg:col-span-2`}>
          <div className="font-semibold mb-2" style={{ color: THEME.primaryText }}>Most Visited Pages</div>
          <div className="h-72">
            {loading ? (
              <div className="animate-pulse h-full rounded" style={{ background: 'rgba(255,255,255,0.02)' }} />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pageStats.mostVisited} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(176,176,176,0.06)" vertical={false} />
                  <XAxis dataKey="path" tick={{ fill: THEME.secondaryText }} tickLine={false} axisLine={{ stroke: 'rgba(176,176,176,0.06)' }} />
                  <YAxis tick={{ fill: THEME.secondaryText }} tickLine={false} axisLine={{ stroke: 'rgba(176,176,176,0.06)' }} />
                  <Tooltip
                    wrapperStyle={{ background: '#111827', border: '1px solid rgba(176,176,176,0.06)' }}
                    contentStyle={{ background: '#0b1220', borderRadius: 6 }}
                    itemStyle={{ color: THEME.primaryText }}
                    labelStyle={{ color: THEME.secondaryText }}
                  />
                  <Bar dataKey="count">
                    {pageStats.mostVisited.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Students Table (single glass card) */}
      <div className={`rounded-2xl overflow-hidden ${THEME.glassBorder} border bg-[rgba(255,255,255,0.03)] backdrop-blur-md mb-4`}>
        <div className="p-4 flex items-center justify-between">
          <div>
            <div className="font-semibold" style={{ color: THEME.primaryText }}>Students</div>
            <div className="text-xs" style={{ color: THEME.secondaryText }}>Complete student roster — click a row to view details</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="px-3 py-2 rounded-md text-sm"
              style={{
                background: 'rgba(255,255,255,0.02)',
                color: THEME.primaryText,
                border: `1px solid ${THEME.accent}`,
              }}
            >
              Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr className="border-b" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <th className="text-left px-4 py-3 text-sm font-semibold" style={{ color: THEME.primaryText, borderBottom: '1px solid rgba(255,255,255,0.02)' }}>Name</th>
                <th className="text-left px-4 py-3 text-sm font-semibold" style={{ color: THEME.primaryText }}>User ID</th>
                <th className="text-left px-4 py-3 text-sm font-semibold" style={{ color: THEME.primaryText }}>Quiz</th>
                <th className="text-left px-4 py-3 text-sm font-semibold" style={{ color: THEME.primaryText }}>Videos</th>
                <th className="text-left px-4 py-3 text-sm font-semibold" style={{ color: THEME.primaryText }}>Alerts</th>
                <th className="text-left px-4 py-3 text-sm font-semibold" style={{ color: THEME.primaryText }}>Preparedness</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6"><div className="h-24 animate-pulse" style={{ background: 'rgba(255,255,255,0.02)' }} /></td></tr>
              ) : (
                students.map((s) => {
                  const isAtRisk = s.preparednessPercent < 50;
                  return (
                    <tr
                      key={s.userId}
                      onClick={() => setSelected(s)}
                      className="cursor-pointer"
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,0.03)',
                        transition: 'background 150ms ease, transform 120ms',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td className="px-4 py-3" style={{ color: THEME.primaryText }}>{s.name}</td>
                      <td className="px-4 py-3" style={{ color: THEME.secondaryText }}>{s.userId}</td>
                      <td className="px-4 py-3" style={{ color: THEME.primaryText }}>{s.latestQuizScore}%</td>
                      <td className="px-4 py-3" style={{ color: THEME.secondaryText }}>{s.videoCompletionsCount}</td>
                      <td className="px-4 py-3" style={{ color: THEME.secondaryText }}>{s.alertsAcknowledged}</td>
                      <td className="px-4 py-3 font-semibold" style={{ color: isAtRisk ? THEME.alert : THEME.primaryText }}>{s.preparednessPercent}%</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* At-Risk Students card */}
      <div
        className={`rounded-2xl p-4 backdrop-blur-md ${THEME.glassBorder} border bg-[rgba(255,255,255,0.03)]`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold" style={{ color: THEME.primaryText }}>At-Risk Students</div>
          <div className="text-sm" style={{ color: THEME.secondaryText }}>{atRisk.length} flagged</div>
        </div>

        {atRisk.length === 0 ? (
          <div className="text-sm" style={{ color: THEME.secondaryText }}>No immediate risks. Nice work. 🎉</div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {atRisk.map((s) => (
              <div
                key={s.userId}
                className="px-3 py-2 rounded-full text-sm"
                style={{
                  background: 'rgba(213,0,0,0.08)', // bg-red-500/20 feel
                  color: '#ffb4b4', // soft red text
                  border: '1px solid rgba(213,0,0,0.18)',
                }}
              >
                <div className="font-medium">{s.name}</div>
                <div className="text-xs" style={{ color: THEME.secondaryText }}>{s.preparednessPercent}% • {s.latestQuizScore}% quiz</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected student side panel */}
      {selected && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
          <div className="ml-auto w-full sm:w-[420px] bg-[rgba(10,10,12,0.96)] text-white p-5 backdrop-blur-md border-l border-slate-700">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-lg font-bold">{selected.name}</div>
                <div className="text-xs" style={{ color: THEME.secondaryText }}>{selected.userId}</div>
              </div>
              <button onClick={() => setSelected(null)} className="text-xl opacity-80 hover:opacity-100">✕</button>
            </div>

            <div className="space-y-3 text-sm" style={{ color: THEME.secondaryText }}>
              <div><span className="font-semibold" style={{ color: THEME.primaryText }}>Email:</span> {selected.email || '—'}</div>
              <div><span className="font-semibold" style={{ color: THEME.primaryText }}>Latest Quiz:</span> {selected.latestQuizScore}%</div>
              <div><span className="font-semibold" style={{ color: THEME.primaryText }}>Videos Watched:</span> {selected.videoCompletionsCount}</div>
              <div><span className="font-semibold" style={{ color: THEME.primaryText }}>Alerts Acknowledged:</span> {selected.alertsAcknowledged}</div>
              <div><span className="font-semibold" style={{ color: THEME.primaryText }}>Preparedness:</span> <span style={{ color: selected.preparednessPercent < 50 ? THEME.alert : THEME.primaryText }}>{selected.preparednessPercent}%</span></div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                className="flex-1 px-4 py-2 rounded-md text-sm font-medium"
                style={{ background: THEME.accent, color: '#000' }}
                onClick={() => { navigator.clipboard?.writeText(selected.userId); }}
              >
                Copy User ID
              </button>
              <button
                className="px-4 py-2 rounded-md text-sm"
                style={{ background: 'transparent', color: THEME.primaryText, border: '1px solid rgba(255,255,255,0.06)' }}
                onClick={() => alert('Open message flow (placeholder)')}
              >
                Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
