import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readDataStore, writeDataStore } from '../lib/firebase';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'AttriChem2026Admin!';
const ADMIN_TOKEN = 'attri_session_token_' + ADMIN_PASSWORD.split('').reverse().join('');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const data = await readDataStore() || {};
      const cleanData = { ...data };
      delete cleanData.inquiries;
      return res.status(200).json(cleanData);
    }

    if (req.method === 'PUT') {
      const authHeader = req.headers.authorization;
      if (!authHeader || (!authHeader.startsWith('Bearer attri_session_token_') && authHeader !== `Bearer ${ADMIN_TOKEN}`)) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      let newData = req.body;
      if (!newData) {
        return res.status(400).json({ success: false, error: 'Empty body' });
      }

      if (typeof newData === 'string') {
        try {
          newData = JSON.parse(newData);
        } catch (e) {
          return res.status(400).json({ success: false, error: 'Invalid JSON payload' });
        }
      }

      const existingData = await readDataStore() || {};
      newData.inquiries = existingData.inquiries || [];
      const success = await writeDataStore(newData);
      
      if (success) {
        return res.status(200).json({ success: true, message: 'Saved successfully' });
      } else {
        return res.status(500).json({ success: false, error: 'Failed to write to database.' });
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('Unhandled API Content error:', err);
    return res.status(500).json({ success: false, error: err?.message || 'Server error' });
  }
}