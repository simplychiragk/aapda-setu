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

  try {
    // Demo mode: if sheet missing activity, return stubbed data
    let students = [];
    students = Array.from({ length: 12 }).map((_, i) => ({
      userId: `student${i + 1}`,
      name: `Student ${i + 1}`,
      email: `student${i + 1}@example.com`,
      latestQuizScore: Math.floor(Math.random() * 40) + 60,
      videoCompletionsCount: Math.floor(Math.random() * 10),
      alertsAcknowledged: Math.floor(Math.random() * 5),
      preparednessPercent: Math.floor(Math.random() * 100),
    }));

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ students }));
  } catch {
    res.statusCode = 500; res.end('Server error');
  }
}

export default handler;

