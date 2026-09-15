import type { VercelRequest, VercelResponse } from '@vercel/node';

const DEFAULT_ADMIN_PASSWORD = 'AttriChem2026Admin!';

function getAdminToken() {
  const password = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
  return `attri_session_token_${password.split('').reverse().join('')}`;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ authenticated: false, error: 'Method not allowed' });
  }

  if (req.headers.authorization === `Bearer ${getAdminToken()}`) {
    return res.status(200).json({ authenticated: true });
  }

  return res.status(401).json({ authenticated: false });
}
