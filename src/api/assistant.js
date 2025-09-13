import cookie from 'cookie';

const PROVIDER = process.env.LLM_PROVIDER || 'mock';
const MODEL_DEFAULT = process.env.LLM_MODEL_DEFAULT || '';
const MODEL_LONG = process.env.LLM_MODEL_LONG || '';

export async function handler(req, res) {
  if (req.method !== 'POST') { res.statusCode = 405; res.end('Method Not Allowed'); return; }
  let body = '';
  await new Promise((resolve) => { req.on('data', (c) => body += c); req.on('end', resolve); });
  let parsed; try { parsed = JSON.parse(body || '{}'); } catch { parsed = {}; }
  const { messages = [], modelOverride } = parsed;

  const model = modelOverride === 'long' ? MODEL_LONG : MODEL_DEFAULT;

  // Mock mode if provider/model/api key not set
  const missing = PROVIDER === 'mock' || !process.env.LLM_API_KEY || !model;
  if (missing) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Assistant is not configured. Ask an admin to set env vars in Settings.' }));
    return;
  }

  try {
    // Implement vendor calls here; to keep this generic, respond with echo
    const last = messages[messages.length - 1]?.content || '';
    const reply = `(${model}) ${last ? 'You asked: ' + last : 'Hello!'} `;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: reply }));
  } catch (err) {
    res.statusCode = 500; res.end('Assistant error');
  }
}

export default handler;

