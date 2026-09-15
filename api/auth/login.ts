import type { VercelRequest, VercelResponse } from '@vercel/node';

const DEFAULT_ADMIN_PASSWORD = 'AttriChem2026Admin!';

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
}

function getAdminToken() {
  return `attri_session_token_${getAdminPassword().split('').reverse().join('')}`;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (password !== getAdminPassword()) {
    return res.status(401).json({ success: false, error: 'Incorrect password' });
  }

  return res.status(200).json({ success: true, token: getAdminToken() });
}
