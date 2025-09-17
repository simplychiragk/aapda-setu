/* eslint-env node */
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
// Sheets removed in demo mode

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

export async function handler(req, res) {
  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.token;
    if (!token) { res.statusCode = 401; res.end(JSON.stringify({ user: null })); return; }
    const decoded = jwt.verify(token, JWT_SECRET);
    const useHardcoded = true;
    let user;
    if (useHardcoded) {
      // Normalize by userId when available to avoid role mismatch from client
      if (decoded.userId === 'admin') {
        user = { userId: 'admin', role: 'staff', displayName: 'Administrator', email: 'admin@example.com', settings: {} };
      } else {
        user = { userId: 'student', role: 'student', displayName: 'Student User', email: 'student@example.com', settings: {} };
      }
    }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ user }));
  } catch {
    res.statusCode = 401; res.end(JSON.stringify({ user: null }));
  }
}

export default handler;

