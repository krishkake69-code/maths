import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

const parsePrivateKey = (key: string | undefined) => {
  if (!key) return '';
  let cleanKey = key.trim();
  if ((cleanKey.startsWith('"') && cleanKey.endsWith('"')) || (cleanKey.startsWith("'") && cleanKey.endsWith("'"))) {
    cleanKey = cleanKey.slice(1, -1);
  }
  return cleanKey.replace(/\\n/g, '\n');
};

const inMemoryStore = new Map<string, any>();

function getDefaultData() {
  try {
    const dataFilePath = path.join(process.cwd(), 'src', 'data-store.json');
    if (fs.existsSync(dataFilePath)) {
      const raw = fs.readFileSync(dataFilePath, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading default data file:', err);
  }
  return null;
}

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
    if (db) {
      const doc = await db.collection('attri-data').doc('store').get();
      if (doc.exists) {
        const data = doc.data();
        inMemoryStore.set('data-store', data);
        return data;
      }
    }
  } catch (error) {
    console.error('Error reading from Firestore:', error);
  }

  if (!inMemoryStore.has('data-store')) {
    const defaultData = getDefaultData();
    if (defaultData) {
      inMemoryStore.set('data-store', defaultData);
    }
  }
  return inMemoryStore.get('data-store') || null;
};

export const writeDataStore = async (data: any): Promise<boolean> => {
  inMemoryStore.set('data-store', data);
  try {
    const db = getDb();
    if (db) {
      await db.collection('attri-data').doc('store').set(data);
    }
  } catch (error) {
    console.error('Error writing to Firestore:', error);
  }
  return true;
};
