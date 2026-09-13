import type { VercelRequest, VercelResponse } from '@vercel/node';

const adminPassword = process.env.ADMIN_PASSWORD || 'AttriChem2026Admin!';
const adminToken = `attri_session_token_${adminPassword.split('').reverse().join('')}`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (authHeader === `Bearer ${adminToken}`) {
    return res.json({ authenticated: true });
  }
  return res.status(401).json({ authenticated: false });
}
