/* eslint-env node */
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
// Demo mode: in-memory settings store

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

function requireUser(req) {
  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.token;
    if (!token) return null;
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch { return null; }
}

const memorySettingsByUserId = new Map();

export async function handler(req, res) {
  const user = requireUser(req);
  if (!user) { res.statusCode = 401; res.end('Unauthorized'); return; }

  if (req.method === 'GET') {
    const settings = memorySettingsByUserId.get(user.userId) || {};
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ settings }));
    return;
  }

  if (req.method === 'POST') {
    let body = '';
    await new Promise((resolve) => { req.on('data', (c) => body += c); req.on('end', resolve); });
    let parsed; try { parsed = JSON.parse(body || '{}'); } catch { parsed = {}; }
    const newSettings = parsed?.settings || {};
    memorySettingsByUserId.set(user.userId, newSettings);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  res.statusCode = 405; res.end('Method Not Allowed');
}

export default handler;

