/* eslint-env node */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { getSheetsClient, nowIso } from '../_utils/sheets';

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
    // Hardcoded fallback if Sheets not configured or explicitly requested
    const useHardcoded = !process.env.GOOGLE_SERVICE_ACCOUNT_KEY || !process.env.GOOGLE_SHEETS_USERS_SHEET_ID || process.env.USE_HARDCODED_AUTH === 'true';
    if (useHardcoded) {
      const users = [
        { userId: 'student', password: 'student', role: 'student', displayName: 'Student User', email: 'student@example.com' },
        { userId: 'admin', password: 'admin', role: 'staff', displayName: 'Administrator', email: 'admin@example.com' },
      ];
      const u = users.find((u) => u.userId === userId);
      if (!u || u.password !== password || u.role !== role) { res.statusCode = 401; res.end(JSON.stringify({ message: 'Invalid credentials' })); return; }
      const token = jwt.sign({ userId: u.userId, role: u.role }, JWT_SECRET, { expiresIn: '8h' });
      const isProd = process.env.NODE_ENV === 'production';
      const setCookie = cookie.serialize('token', token, { httpOnly: true, sameSite: 'lax', secure: isProd, path: '/', maxAge: 60 * 60 * 8 });
      res.setHeader('Set-Cookie', setCookie);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: true, role: u.role, redirectTo: u.role === 'staff' ? '/admin' : '/dashboard' }));
      return;
    }

    // Google Sheets path (unchanged)
    const { sheets, spreadsheetId } = getSheetsClient();
    const range = 'Users!A:G';
    const resp = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    const rows = resp.data.values || [];
    const header = rows[0] || [];
    const idx = (name) => header.indexOf(name);
    const userIdIdx = idx('userId');
    const passIdx = idx('password_hash');
    const roleIdx = idx('role');
    const displayIdx = idx('displayName');
    const emailIdx = idx('email');
    const settingsIdx = idx('settings_json');
    const migratedIdx = idx('migrated_at');

    let foundRowIndex = -1; // absolute row index in sheet
    let found = null;
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if ((row[userIdIdx] || '').toLowerCase() === String(userId).toLowerCase()) {
        foundRowIndex = i;
        found = row;
        break;
      }
    }
    if (!found) { res.statusCode = 401; res.end(JSON.stringify({ message: 'Invalid credentials' })); return; }

    const stored = found[passIdx] || '';
    let ok = false;
    if (stored.startsWith('$2b$') || stored.startsWith('$2a$')) {
      ok = await bcrypt.compare(password, stored);
    } else if (stored) {
      ok = stored === password;
      if (ok) {
        const hash = await bcrypt.hash(password, 10);
        const newRow = [...found];
        newRow[passIdx] = hash;
        if (migratedIdx >= 0) newRow[migratedIdx] = nowIso();
        await sheets.spreadsheets.values.update({ spreadsheetId, range: `Users!A${foundRowIndex + 1}:G${foundRowIndex + 1}`, valueInputOption: 'RAW', requestBody: { values: [newRow] } });
        try {
          await sheets.spreadsheets.values.append({ spreadsheetId, range: 'Audit!A:C', valueInputOption: 'RAW', requestBody: { values: [[userId, nowIso(), 'password_migrated']] } });
        } catch { /* audit optional */ }
      }
    } else {
      ok = false;
    }

    const roleOk = (found[roleIdx] || '').toLowerCase() === String(role).toLowerCase();
    if (!ok || !roleOk) { res.statusCode = 401; res.end(JSON.stringify({ message: 'Invalid credentials' })); return; }

    const user = {
      userId: found[userIdIdx],
      role: found[roleIdx],
      displayName: found[displayIdx] || '',
      email: found[emailIdx] || '',
      settings: (() => { try { return JSON.parse(found[settingsIdx] || '{}'); } catch { return {}; } })(),
    };

    const token = jwt.sign({ userId: user.userId, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
    const isProd = process.env.NODE_ENV === 'production';
    const setCookie = cookie.serialize('token', token, { httpOnly: true, sameSite: 'lax', secure: isProd, path: '/', maxAge: 60 * 60 * 8 });
    res.setHeader('Set-Cookie', setCookie);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: true, role: user.role, redirectTo: user.role === 'staff' ? '/admin' : '/dashboard' }));
  } catch {
    res.statusCode = 500; res.end(JSON.stringify({ message: 'Server error' }));
  }
}

export default handler;

