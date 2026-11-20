import { readDataStore, writeDataStore } from './lib/firebase.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const STUDENT_TOKEN_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours
const BCRYPT_ROUNDS = 10;

function getAdminPassword(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  return pw && pw.trim() ? pw : null;
}

function getAuthSecret(): string | null {
  if (process.env.AUTH_SECRET && process.env.AUTH_SECRET.trim()) {
    return process.env.AUTH_SECRET.trim();
  }
  const password = getAdminPassword();
  if (!password) return null;
  return crypto.createHash('sha256').update(`attri-session:${password}`).digest('hex');
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(plain, hash);
  } catch {
    return false;
  }
}

export function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

function signPayload(payloadObj: Record<string, any>): string | null {
  const secret = getAuthSecret();
  if (!secret) return null;
  const payload = Buffer.from(JSON.stringify(payloadObj)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function verifyAndDecode(token: string | undefined | null): Record<string, any> | null {
  const secret = getAuthSecret();
  if (!secret || !token) return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payload, signature] = parts;
  if (!payload || !signature) return null;

  const expected = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  if (!safeEqual(signature, expected)) return null;

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (typeof decoded?.exp !== 'number') return null;
    if (decoded.exp <= Date.now()) return null;
    return decoded;
  } catch {
    return null;
  }
}

export function createSessionToken(): string | null {
  return signPayload({
    sub: 'admin',
    role: 'admin',
    exp: Date.now() + TOKEN_TTL_MS,
    nonce: crypto.randomBytes(8).toString('hex'),
  });
}

export function createStudentSessionToken(studentId: string): string | null {
  if (!studentId) return null;
  return signPayload({
    sub: studentId,
    role: 'student',
    exp: Date.now() + STUDENT_TOKEN_TTL_MS,
    nonce: crypto.randomBytes(8).toString('hex'),
  });
}

export function verifySessionToken(token: string | undefined | null): boolean {
  const decoded = verifyAndDecode(token);
  if (!decoded) return false;
  if (decoded.role === undefined) return true;
  return decoded.role === 'admin';
}

export function verifyStudentSessionToken(token: string | undefined | null): string | null {
  const decoded = verifyAndDecode(token);
  if (!decoded || decoded.role !== 'student') return null;
  if (typeof decoded.sub !== 'string' || !decoded.sub) return null;
  return decoded.sub;
}

export function bearerToken(header: string | undefined): string | null {
  if (!header || !header.startsWith('Bearer ')) return null;
  return header.slice(7) || null;
}

export { readDataStore, writeDataStore, getAdminPassword };