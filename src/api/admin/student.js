/* eslint-env node */
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
// Sheets removed in demo mode

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

function requireStaff(req) {
  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.token;
    if (!token) return null;
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'staff') return null;
    return decoded;
  } catch { return null; }
}

export async function handler(req, res) {
  if (req.method !== 'GET') { res.statusCode = 405; res.end('Method Not Allowed'); return; }
  const auth = requireStaff(req);
  if (!auth) { res.statusCode = 403; res.end('Forbidden'); return; }
  const raw = (req.params && req.params.id) || req.url.split('/').pop() || '';
  const id = String(raw).split('?')[0];
  try {
    let detail = null;
    // Demo detail
    detail = { userId: id, name: id, email: `${id}@example.com` };

    if (!detail) detail = { userId: id, name: id, email: `${id}@example.com` };
    // Stub analytics
    detail.analytics = {
      lastQuizAttempts: Array.from({ length: 3 }).map((_, i) => ({ attempt: i + 1, score: Math.floor(Math.random() * 40) + 60, at: new Date(Date.now() - i * 86400000).toISOString() })),
      lastVideosWatched: Array.from({ length: 3 }).map((_, i) => ({ title: `Prep Video ${i + 1}`, at: new Date(Date.now() - i * 43200000).toISOString() })),
      lastAlertsAcknowledged: Array.from({ length: 3 }).map((_, i) => ({ type: 'Drill', at: new Date(Date.now() - i * 7200000).toISOString() })),
    };

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ student: detail }));
  } catch {
    res.statusCode = 500; res.end('Server error');
  }
}

export default handler;

