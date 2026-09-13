import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase only once
if (getApps().length === 0) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
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
