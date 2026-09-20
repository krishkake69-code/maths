import { createSign } from 'crypto';

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

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const FIRESTORE_SCOPE = 'https://www.googleapis.com/auth/datastore';

function getRestBase() {
  if (!projectId || !clientEmail || !privateKey) return null;
  return `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
}

function b64url(input: string | Buffer) {
  return Buffer.from(input).toString('base64url');
}

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken() {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${b64url(
    JSON.stringify({
      iss: clientEmail,
      scope: FIRESTORE_SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    })
  )}`;

  const signer = createSign('RSA-SHA256');
  signer.update(unsigned);
  const jwt = `${unsigned}.${b64url(signer.sign(privateKey))}`;

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  const json: any = await res.json().catch(() => ({}));
  if (!res.ok || !json.access_token) {
    throw new Error(json.error_description || json.error || 'Google authentication failed');
  }

  cachedToken = {
    token: json.access_token,
    expiresAt: Date.now() + (Number(json.expires_in) || 3600) * 1000 - 60000,
  };
  return cachedToken.token;
}

type FirestoreValue = Record<string, any>;

function fromFirestoreValue(value: FirestoreValue | undefined): any {
  if (!value) return null;
  if ('nullValue' in value) return null;
  if ('stringValue' in value) return value.stringValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return Number(value.doubleValue);
  if ('booleanValue' in value) return value.booleanValue;
  if ('timestampValue' in value) return value.timestampValue;
  if ('arrayValue' in value) {
    return Array.isArray(value.arrayValue?.values)
      ? value.arrayValue.values.map(fromFirestoreValue)
      : [];
  }
  if ('mapValue' in value) {
    const fields = value.mapValue?.fields || {};
    const out: Record<string, any> = {};
    for (const [key, val] of Object.entries(fields)) {
      out[key] = fromFirestoreValue(val as FirestoreValue);
    }
    return out;
  }
  return null;
}

function toFirestoreValue(value: any): FirestoreValue {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'number') {
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  }
  if (typeof value === 'string') return { stringValue: value };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(toFirestoreValue) } };
  if (typeof value === 'object') {
    const fields: Record<string, FirestoreValue> = {};
    for (const [key, val] of Object.entries(value)) {
      if (val !== undefined) fields[key] = toFirestoreValue(val);
    }
    return { mapValue: { fields } };
  }
  return { nullValue: null };
}

export async function readDataStore(): Promise<any> {
  const base = getRestBase();
  if (!base) return null;

  const token = await getAccessToken();
  const res = await fetch(`${base}/appData/content`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 404) return null;
  const json: any = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.error?.message || `Firestore read failed (${res.status})`);
  }
  if (!json.fields) return null;

  const out: Record<string, any> = {};
  for (const [key, val] of Object.entries(json.fields)) {
    out[key] = fromFirestoreValue(val as FirestoreValue);
  }
  return out;
}

export async function writeDataStore(data: Record<string, unknown>) {
  const base = getRestBase();
  if (!base) throw new Error('Firebase is not configured');

  const token = await getAccessToken();
  const fields: Record<string, FirestoreValue> = {};
  for (const [key, val] of Object.entries(data)) {
    if (val !== undefined) fields[key] = toFirestoreValue(val);
  }

  const res = await fetch(`${base}/appData/content`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields }),
  });

  const json: any = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.error?.message || `Firestore write failed (${res.status})`);
  }
  return true;
}
