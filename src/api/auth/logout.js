import cookie from 'cookie';

export async function handler(req, res) {
  if (req.method !== 'POST') { res.statusCode = 405; res.end('Method Not Allowed'); return; }
  const expired = cookie.serialize('token', '', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 0 });
  res.setHeader('Set-Cookie', expired);
  res.statusCode = 200; res.end('ok');
}

export default handler;

