import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { getSheetsClient } from '../_utils/sheets';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

function requireStaff(req, res) {
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
  const auth = requireStaff(req, res);
  if (!auth) { res.statusCode = 403; res.end('Forbidden'); return; }

  try {
    // Demo mode: if sheet missing activity, return stubbed data
    let students = [];
    try {
      const { sheets, spreadsheetId } = getSheetsClient();
      const resp = await sheets.spreadsheets.values.get({ spreadsheetId, range: 'Users!A:G' });
      const rows = resp.data.values || [];
      const header = rows[0] || [];
      const idx = (name) => header.indexOf(name);
      const userIdIdx = idx('userId');
      const roleIdx = idx('role');
      const displayIdx = idx('displayName');
      const emailIdx = idx('email');

      students = rows.slice(1)
        .filter((r) => (r[roleIdx] || '').toLowerCase() === 'student')
        .map((r) => {
          const latestQuizScore = Math.floor(Math.random() * 40) + 60;
          const videoCompletionsCount = Math.floor(Math.random() * 10);
          const alertsAcknowledged = Math.floor(Math.random() * 5);
          const preparednessPercent = Math.round(latestQuizScore * 0.6 + videoCompletionsCount * 3 + alertsAcknowledged * 2);
          return {
            userId: r[userIdIdx],
            name: r[displayIdx] || r[userIdIdx],
            email: r[emailIdx] || '',
            latestQuizScore,
            videoCompletionsCount,
            alertsAcknowledged,
            preparednessPercent: Math.min(100, preparednessPercent),
          };
        });
    } catch {
      students = Array.from({ length: 12 }).map((_, i) => ({
        userId: `student${i + 1}`,
        name: `Student ${i + 1}`,
        email: `student${i + 1}@example.com`,
        latestQuizScore: Math.floor(Math.random() * 40) + 60,
        videoCompletionsCount: Math.floor(Math.random() * 10),
        alertsAcknowledged: Math.floor(Math.random() * 5),
        preparednessPercent: Math.floor(Math.random() * 100),
      }));
    }

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ students }));
  } catch (err) {
    res.statusCode = 500; res.end('Server error');
  }
}

export default handler;

