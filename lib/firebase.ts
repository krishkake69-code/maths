import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const parsePrivateKey = (key: string | undefined) => {
  if (!key) return '';
  // Remove wrapping quotes if present
  let cleanKey = key.trim();
  if ((cleanKey.startsWith('"') && cleanKey.endsWith('"')) || (cleanKey.startsWith("'") && cleanKey.endsWith("'"))) {
    cleanKey = cleanKey.slice(1, -1);
  }
  // Replace escaped newlines with real newlines
  return cleanKey.replace(/\\n/g, '\n');
};

function getDb() {
  try {
    if (getApps().length === 0) {
      const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
      const privateKey = parsePrivateKey(process.env.FIREBASE_PRIVATE_KEY);
      
      if (projectId && clientEmail && privateKey) {
        initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });
      }
    }
    
    if (getApps().length > 0) {
      return getFirestore();
    }
  } catch (error) {
    console.error('Firebase DB initialization error:', error);
  }
  return null;
}

export const readDataStore = async (): Promise<any> => {
  try {
    const db = getDb();
    if (!db) return null;
    const doc = await db.collection('attri-data').doc('store').get();
    return doc.exists ? doc.data() : null;
  } catch (error) {
    console.error('Error reading from Firestore:', error);
    return null;
  }
};

export const writeDataStore = async (data: any): Promise<boolean> => {
  try {
    const db = getDb();
    if (!db) return false;
    await db.collection('attri-data').doc('store').set(data);
    return true;
  } catch (error) {
    console.error('Error writing to Firestore:', error);
    return false;
  }
};
