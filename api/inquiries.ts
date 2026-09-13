import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readDataStore, writeDataStore } from '../lib/firebase';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const ADMIN_TOKEN = 'attri_session_token_' + ADMIN_PASSWORD.split('').reverse().join('');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { id } = req.query;

    if (req.method === 'POST') {
      const { name, phone, email, course, message, type } = req.body || {};
      if (!name || !phone) {
        return res.status(400).json({ success: false, error: 'Name and Phone are required.' });
      }

      const data = await readDataStore() || {};
      const inquiries = data.inquiries || [];

      const newInquiry = {
        id: 'inq_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        name,
        phone,
        email: email || '',
        course: course || 'General Inquiry',
        message: message || '',
        type: type === 'enroll' ? 'enroll' : 'contact',
        timestamp: new Date().toISOString(),
        read: false
      };

      inquiries.unshift(newInquiry);
      data.inquiries = inquiries;
      const success = await writeDataStore(data);

      if (success) {
        return res.status(200).json({ success: true, message: 'Your booking has been registered successfully!' });
      } else {
        return res.status(500).json({ success: false, error: 'Failed to write inquiry to database.' });
      }
    }

    if (req.method === 'GET') {
      const authHeader = req.headers.authorization;
      if (authHeader !== `Bearer ${ADMIN_TOKEN}`) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const data = await readDataStore() || {};
      return res.status(200).json(data.inquiries || []);
    }

    if (id && req.method === 'PUT') {
      const authHeader = req.headers.authorization;
      if (authHeader !== `Bearer ${ADMIN_TOKEN}`) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const data = await readDataStore() || {};
      const inquiries = data.inquiries || [];
      const inquiry = inquiries.find((inq: any) => inq.id === id);
      if (inquiry) {
        inquiry.read = !inquiry.read;
        data.inquiries = inquiries;
        await writeDataStore(data);
        return res.status(200).json({ success: true, inquiries });
      }
      return res.status(404).json({ success: false, error: 'Inquiry not found' });
    }

    if (id && req.method === 'DELETE') {
      const authHeader = req.headers.authorization;
      if (authHeader !== `Bearer ${ADMIN_TOKEN}`) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const data = await readDataStore() || {};
      const inquiries = data.inquiries || [];
      const filtered = inquiries.filter((inq: any) => inq.id !== id);
      data.inquiries = filtered;
      await writeDataStore(data);

      return res.status(200).json({ success: true, inquiries: filtered });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('Unhandled API Inquiries error:', err);
    return res.status(500).json({ success: false, error: err?.message || 'Server error' });
  }
}