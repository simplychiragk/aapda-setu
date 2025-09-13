/* eslint-env node */
// #!/usr/bin/env node
import bcrypt from 'bcryptjs';
import { google } from 'googleapis';

async function main() {
  const SHEET_ID = process.env.GOOGLE_SHEETS_USERS_SHEET_ID;
  const SA_RAW = process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}';
  const SA_KEY = typeof SA_RAW === 'string' ? JSON.parse(SA_RAW) : SA_RAW;
  if (!SHEET_ID || !SA_KEY?.client_email || !SA_KEY?.private_key) {
    console.error('Missing Google Sheets env');
    process.exit(1);
  }
  const authClient = new google.auth.JWT(
    SA_KEY.client_email,
    null,
    SA_KEY.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
  );
  const sheets = google.sheets({ version: 'v4', auth: authClient });
  const range = 'Users!A:G';
  const resp = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range });
  const rows = resp.data.values || [];
  const header = rows[0] || [];
  const idx = (name) => header.indexOf(name);
  const userIdIdx = idx('userId');
  const passIdx = idx('password_hash');
  const migratedIdx = idx('migrated_at');
  let updates = 0;
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const stored = row[passIdx] || '';
    if (!stored.startsWith('$2b$') && !stored.startsWith('$2a$') && stored.length > 0) {
      const hash = await bcrypt.hash(stored, 10);
      const newRow = [...row];
      newRow[passIdx] = hash;
      if (migratedIdx >= 0) newRow[migratedIdx] = new Date().toISOString();
      await sheets.spreadsheets.values.update({ spreadsheetId: SHEET_ID, range: `Users!A${i + 1}:G${i + 1}` , valueInputOption: 'RAW', requestBody: { values: [newRow] }});
      updates++;
      try {
        await sheets.spreadsheets.values.append({ spreadsheetId: SHEET_ID, range: 'Audit!A:C', valueInputOption: 'RAW', requestBody: { values: [[row[userIdIdx], new Date().toISOString(), 'password_migrated_script']] }});
      } catch { /* ignore audit append errors */ }
      console.log(`Migrated userId=${row[userIdIdx]}`);
    }
  }
  console.log(`Done. Updated ${updates} rows.`);
}

main().catch((e) => { console.error(e); process.exit(1); });

