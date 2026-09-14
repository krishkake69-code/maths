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
    } catch {
      return res.status(400).json({ success: false, error: 'Invalid request body' });
    }
  }

  const { password } = body as { password?: unknown };
  if (typeof password === 'string' && password === ADMIN_PASSWORD) {
    return res.json({ success: true, token: ADMIN_TOKEN });
  }
  return res.status(401).json({ success: false, error: 'Incorrect password' });
}
