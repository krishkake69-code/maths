import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ADMIN_PASSWORD, ADMIN_TOKEN } from '../../server-utils';

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
