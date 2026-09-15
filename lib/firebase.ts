import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function normalizeEnvValue(value: string | undefined) {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

const projectId = normalizeEnvValue(process.env.FIREBASE_PROJECT_ID);
const clientEmail = normalizeEnvValue(process.env.FIREBASE_CLIENT_EMAIL);
const privateKey = normalizeEnvValue(process.env.FIREBASE_PRIVATE_KEY)?.replace(/\\n/g, '\n');

function getDb() {
  if (!projectId || !clientEmail || !privateKey) return null;

  const app = getApps()[0] ?? initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
  return getFirestore(app);
}

export async function readDataStore() {
  const db = getDb();
  if (!db) return null;

  const snapshot = await db.collection('appData').doc('content').get();
  return snapshot.exists ? snapshot.data() : null;
}

export async function writeDataStore(data: Record<string, unknown>) {
  const db = getDb();
  if (!db) throw new Error('Firebase is not configured');

  await db.collection('appData').doc('content').set(data, { merge: false });
  return true;
}
