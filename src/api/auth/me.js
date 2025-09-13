/* eslint-env node */
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { getSheetsClient } from '../_utils/sheets';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

export async function handler(req, res) {
  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.token;
    if (!token) { res.statusCode = 401; res.end(JSON.stringify({ user: null })); return; }
    const decoded = jwt.verify(token, JWT_SECRET);
    const useHardcoded = !process.env.GOOGLE_SERVICE_ACCOUNT_KEY || !process.env.GOOGLE_SHEETS_USERS_SHEET_ID || process.env.USE_HARDCODED_AUTH === 'true';
    let user;
    if (useHardcoded) {
      user = decoded.role === 'staff'
        ? { userId: 'admin', role: 'staff', displayName: 'Administrator', email: 'admin@example.com', settings: {} }
        : { userId: 'student', role: 'student', displayName: 'Student User', email: 'student@example.com', settings: {} };
    } else {
      const { sheets, spreadsheetId } = getSheetsClient();
      const range = 'Users!A:G';
      const resp = await sheets.spreadsheets.values.get({ spreadsheetId, range });
      const rows = resp.data.values || [];
      const header = rows[0] || [];
      const idx = (name) => header.indexOf(name);
      const userIdIdx = idx('userId');
      const roleIdx = idx('role');
      const displayIdx = idx('displayName');
      const emailIdx = idx('email');
      const settingsIdx = idx('settings_json');
      const found = rows.find((row) => (row[userIdIdx] || '') === decoded.userId);
      if (!found) { res.statusCode = 401; res.end(JSON.stringify({ user: null })); return; }
      user = {
        userId: found[userIdIdx],
        role: found[roleIdx],
        displayName: found[displayIdx] || '',
        email: found[emailIdx] || '',
        settings: (() => { try { return JSON.parse(found[settingsIdx] || '{}'); } catch { return {}; } })(),
      };
    }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ user }));
  } catch {
    res.statusCode = 401; res.end(JSON.stringify({ user: null }));
  }
}

export default handler;

