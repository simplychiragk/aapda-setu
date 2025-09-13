import { google } from 'googleapis';

export function getSheetsClient() {
  const SHEET_ID = process.env.GOOGLE_SHEETS_USERS_SHEET_ID;
  const SA_RAW = process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}';
  const SA_KEY = typeof SA_RAW === 'string' ? JSON.parse(SA_RAW) : SA_RAW;

  if (!SHEET_ID || !SA_KEY?.client_email || !SA_KEY?.private_key) {
    throw new Error('Google Sheets env not configured');
  }

  const authClient = new google.auth.JWT(
    SA_KEY.client_email,
    null,
    SA_KEY.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
  );
  const sheets = google.sheets({ version: 'v4', auth: authClient });
  return { sheets, spreadsheetId: SHEET_ID };
}

export function nowIso() {
  return new Date().toISOString();
}

