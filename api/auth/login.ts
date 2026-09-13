import type { VercelRequest, VercelResponse } from '@vercel/node';

const adminPassword = process.env.ADMIN_PASSWORD || 'AttriChem2026Admin!';
const adminToken = `attri_session_token_${adminPassword.split('').reverse().join('')}`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body = req.body || {};
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {}
  }

  const { password } = body;
  if (password === adminPassword) {
    return res.json({ success: true, token: adminToken });
  }
  return res.status(401).json({ success: false, error: 'Incorrect password' });
}
