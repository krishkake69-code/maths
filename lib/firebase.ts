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

let cachedDb: import('firebase-admin/firestore').Firestore | null = null;

async function getDb() {
  if (!projectId || !clientEmail || !privateKey) return null;
  if (cachedDb) return cachedDb;

  const appMod = await import('firebase-admin/app');
  const firestoreMod = await import('firebase-admin/firestore');
  const app = appMod.getApps()[0] ?? appMod.initializeApp({
    credential: appMod.cert({ projectId, clientEmail, privateKey }),
  });
  cachedDb = firestoreMod.getFirestore(app);
  return cachedDb;
}

export async function readDataStore() {
  const db = await getDb();
  if (!db) return null;

  const snapshot = await db.collection('appData').doc('content').get();
  return snapshot.exists ? snapshot.data() : null;
}

export async function writeDataStore(data: Record<string, unknown>) {
  const db = await getDb();
  if (!db) throw new Error('Firebase is not configured');

  await db.collection('appData').doc('content').set(data, { merge: false });
  return true;
}
