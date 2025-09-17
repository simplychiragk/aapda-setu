/* eslint-env node */
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import authLogin from './src/api/auth/login.js';
import authMe from './src/api/auth/me.js';
import authLogout from './src/api/auth/logout.js';
import adminStudents from './src/api/admin/students.js';
import adminStudent from './src/api/admin/student.js';
import assistant from './src/api/assistant.js';
import userSettings from './src/api/user/settings.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Basic JSON body parsing for POST endpoints
app.use(express.json({ limit: '1mb' }));

// Basic CORS for local development (Vite proxy to API)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.statusCode = 204; res.end(); return;
  }
  next();
});

// Minimal security headers (helmet-lite)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  next();
});

// wire API routes
app.post('/api/auth/login', (req, res) => authLogin(req, res));
app.get('/api/auth/me', (req, res) => authMe(req, res));
app.post('/api/auth/logout', (req, res) => authLogout(req, res));
app.get('/api/admin/students', (req, res) => adminStudents(req, res));
app.get('/api/admin/student/:id', (req, res) => adminStudent(req, res));
app.post('/api/assistant', (req, res) => assistant(req, res));
app.get('/api/user/settings', (req, res) => userSettings(req, res));
app.post('/api/user/settings', (req, res) => userSettings(req, res));

// 404 handler for unknown API routes
app.use('/api', (req, res) => {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ message: 'Not Found' }));
});

// Centralized error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  try {
    // Avoid leaking internals
    // eslint-disable-next-line no-console
    console.error('API error:', err && err.stack ? err.stack : err);
  } catch (e) { void e; }
  res.statusCode = err && err.statusCode ? err.statusCode : 500;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ message: 'Server error' }));
});

const port = process.env.PORT || 5174;
app.listen(port, () => {
  console.log(`API server listening on ${port}`);
});

