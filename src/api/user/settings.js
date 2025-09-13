import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { getSheetsClient } from '../_utils/sheets';

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

export async function handler(req, res) {
  const user = requireUser(req);
  if (!user) { res.statusCode = 401; res.end('Unauthorized'); return; }
  const { sheets, spreadsheetId } = getSheetsClient();
  const range = 'Users!A:G';
  const resp = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  const rows = resp.data.values || [];
  const header = rows[0] || [];
  const idx = (name) => header.indexOf(name);
  const userIdIdx = idx('userId');
  const settingsIdx = idx('settings_json');

  if (req.method === 'GET') {
    const row = rows.find((r) => (r[userIdIdx] || '') === user.userId);
    const settings = (() => { try { return JSON.parse(row?.[settingsIdx] || '{}'); } catch { return {}; } })();
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ settings }));
    return;
  }

  if (req.method === 'POST') {
    let body = '';
    await new Promise((resolve) => { req.on('data', (c) => body += c); req.on('end', resolve); });
    let parsed; try { parsed = JSON.parse(body || '{}'); } catch { parsed = {}; }
    const newSettings = parsed?.settings || {};

    let targetIndex = -1; let rowValues = null;
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][userIdIdx] === user.userId) { targetIndex = i; rowValues = rows[i]; break; }
    }
    if (targetIndex < 0) { res.statusCode = 404; res.end('User not found'); return; }
    const newRow = [...rowValues];
    newRow[settingsIdx] = JSON.stringify(newSettings);
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Users!A${targetIndex + 1}:G${targetIndex + 1}`,
      valueInputOption: 'RAW',
      requestBody: { values: [newRow] },
    });
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  res.statusCode = 405; res.end('Method Not Allowed');
}

export default handler;

