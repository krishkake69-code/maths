import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readDataStore, writeDataStore } from '../lib/firebase';

const DEFAULT_ADMIN_PASSWORD = 'AttriChem2026Admin!';

function getAdminToken() {
  const password = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
  return `attri_session_token_${password.split('').reverse().join('')}`;
}

function isValidAdminToken(authHeader: string | undefined) {
  return authHeader === `Bearer ${getAdminToken()}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  try {
    if (req.method === 'GET') {
      const data = await readDataStore();
      if (!data) {
        return res.status(503).json({
          success: false,
          error: 'Firebase content store is not configured or has no content.',
        });
      }

      const cleanData = { ...data };
      delete cleanData.inquiries;
      return res.status(200).json(cleanData);
    }

    if (req.method === 'PUT') {
      if (!isValidAdminToken(req.headers.authorization)) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      let newData = req.body;
      if (typeof newData === 'string') {
        try {
          newData = JSON.parse(newData);
        } catch {
          return res.status(400).json({ success: false, error: 'Invalid JSON payload' });
        }
      }

      if (!newData || typeof newData !== 'object' || Array.isArray(newData)) {
        return res.status(400).json({ success: false, error: 'Content must be a JSON object' });
      }

      const existingData = (await readDataStore()) || {};
      await writeDataStore({
        ...newData,
        inquiries: Array.isArray(existingData.inquiries) ? existingData.inquiries : [],
      });

      return res.status(200).json({ success: true, message: 'Saved successfully' });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('Content persistence error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Content persistence failed',
    });
  }
}
