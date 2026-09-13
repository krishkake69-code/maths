import fs from 'fs';
import path from 'path';

const DATA_KEY = 'attri:data-store';
const memoryStore = new Map<string, any>();

// Preload memory store from src/data-store.json if available
try {
  const dataFilePath = path.join(process.cwd(), 'src', 'data-store.json');
  if (fs.existsSync(dataFilePath)) {
    const raw = fs.readFileSync(dataFilePath, 'utf8');
    memoryStore.set(DATA_KEY, JSON.parse(raw));
  }
} catch {
  // in-memory fallback
}

let kvClient: any = null;

async function getKv() {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    if (!kvClient) {
      try {
        const { kv } = await import('@vercel/kv');
        kvClient = kv;
      } catch {
        kvClient = null;
      }
    }
    return kvClient;
  }
  return null;
}

export async function readDataStore() {
  try {
    const kv = await getKv();
    if (kv) {
      const data = await kv.get(DATA_KEY);
      if (data) return data;
    }
  } catch (err) {
    console.error('KV read error, falling back to memory store:', err);
  }
  return memoryStore.get(DATA_KEY) ?? null;
}

export async function writeDataStore(data: any) {
  memoryStore.set(DATA_KEY, data);
  try {
    const kv = await getKv();
    if (kv) {
      await kv.set(DATA_KEY, data);
      return true;
    }
  } catch (err) {
    console.error('KV write error (saved in memory):', err);
  }
  return true;
}

export function getAdminToken(): string {
  const password = process.env.ADMIN_PASSWORD || '';
  return 'attri_session_token_' + password.split('').reverse().join('');
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || '';
}