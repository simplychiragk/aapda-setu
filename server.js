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

// wire API routes
app.post('/api/auth/login', (req, res) => authLogin(req, res));
app.get('/api/auth/me', (req, res) => authMe(req, res));
app.post('/api/auth/logout', (req, res) => authLogout(req, res));
app.get('/api/admin/students', (req, res) => adminStudents(req, res));
app.get('/api/admin/student/:id', (req, res) => adminStudent(req, res));
app.post('/api/assistant', (req, res) => assistant(req, res));
app.get('/api/user/settings', (req, res) => userSettings(req, res));
app.post('/api/user/settings', (req, res) => userSettings(req, res));

const port = process.env.PORT || 5174;
app.listen(port, () => {
  console.log(`API server listening on ${port}`);
});

