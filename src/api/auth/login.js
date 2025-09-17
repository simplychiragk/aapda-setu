/* eslint-env node */
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

// Basic in-memory rate limiter per IP
const attemptMap = new Map();
const WINDOW_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 10;

function rateLimit(ip) {
  const now = Date.now();
  const rec = attemptMap.get(ip) || { count: 0, start: now };
  if (now - rec.start > WINDOW_MS) {
    rec.count = 0; rec.start = now;
  }
  rec.count += 1;
  attemptMap.set(ip, rec);
  return rec.count <= MAX_ATTEMPTS;
}

export async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405; res.end('Method Not Allowed'); return;
  }
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || 'unknown';
  if (!rateLimit(ip)) {
    res.statusCode = 429; res.end('Too Many Requests'); return;
  }

  let body = '';
  await new Promise((resolve) => {
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', resolve);
  });
  let parsed;
  try { parsed = JSON.parse(body || '{}'); } catch { parsed = {}; }
  const { userId, password, role } = parsed;
  if (!userId || !password || !role) {
    res.statusCode = 400; res.end(JSON.stringify({ message: 'Missing fields' })); return;
  }

  try {
    // DEMO-ONLY AUTH (hardcoded)
    const uid = String(userId || '').trim().toLowerCase();
    const pwd = String(password || '').trim();
    let u = null;
    if (uid === 'student' && pwd === 'student') {
      u = { userId: 'student', role: 'student', displayName: 'Student User', email: 'student@example.com' };
    } else if (uid === 'admin' && pwd === 'admin') {
      u = { userId: 'admin', role: 'staff', displayName: 'Administrator', email: 'admin@example.com' };
    }
    if (!u) { res.statusCode = 401; res.end(JSON.stringify({ message: 'Invalid credentials' })); return; }
    const token = jwt.sign({ userId: u.userId, role: u.role }, JWT_SECRET, { expiresIn: '8h' });
    const isProd = process.env.NODE_ENV === 'production';
    const setCookie = cookie.serialize('token', token, { httpOnly: true, sameSite: 'lax', secure: isProd, path: '/', maxAge: 60 * 60 * 8 });
    res.setHeader('Set-Cookie', setCookie);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: true, role: u.role, redirectTo: u.role === 'staff' ? '/admin' : '/dashboard' }));
  } catch {
    res.statusCode = 500; res.end(JSON.stringify({ message: 'Server error' }));
  }
}

export default handler;

