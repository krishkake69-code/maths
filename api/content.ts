import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readDataStore, writeDataStore } from '../lib/firebase';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const ADMIN_TOKEN = 'attri_session_token_' + ADMIN_PASSWORD.split('').reverse().join('');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const data = await readDataStore() || {};
      const cleanData = { ...data };
      delete cleanData.inquiries;
      return res.json(cleanData);
    } catch (err) {
      console.error('Firestore read error:', err);
      return res.json({});
    }
  }

  if (req.method === 'PUT') {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${ADMIN_TOKEN}`) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const newData = req.body;
    if (!newData) {
      return res.status(400).json({ success: false, error: 'Empty body' });
    }

    try {
      const existingData = await readDataStore() || {};
      newData.inquiries = existingData.inquiries || [];
      await writeDataStore(newData);
      return res.json({ success: true, message: 'Saved successfully' });
    } catch (err) {
      console.error('Firestore write error:', err);
      return res.status(500).json({ success: false, error: 'Save failed' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}