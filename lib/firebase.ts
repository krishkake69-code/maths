import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Parse private key safely, handling both literal newlines and escaped newlines
const parsePrivateKey = (key: string | undefined) => {
  if (!key) return '';
  if (key.includes('\\n')) return key.replace(/\\n/g, '\n');
  if (key.startsWith('"') && key.endsWith('"')) {
    key = key.slice(1, -1);
    if (key.includes('\\n')) return key.replace(/\\n/g, '\n');
  }
  return key;
};

// Initialize Firebase only once
if (getApps().length === 0) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = parsePrivateKey(process.env.FIREBASE_PRIVATE_KEY);
    
    if (projectId && clientEmail && privateKey) {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      console.log('Firebase initialized successfully in production.');
    } else {
      console.warn('Firebase credentials missing from environment variables.');
    }
  } catch (error) {
    console.error('Firebase initialization error', error);
  }
}

const db = getApps().length > 0 ? getFirestore() : null;

export const readDataStore = async (): Promise<any> => {
  if (!db) return null;
  try {
    const doc = await db.collection('attri-data').doc('store').get();
    return doc.exists ? doc.data() : null;
  } catch (error) {
    console.error('Error reading from Firestore:', error);
    return null;
  }
};

export const writeDataStore = async (data: any): Promise<boolean> => {
  if (!db) return false;
  try {
    await db.collection('attri-data').doc('store').set(data);
    return true;
  } catch (error) {
    console.error('Error writing to Firestore:', error);
    return false;
  }
};
