import 'dotenv/config';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const admin = require('firebase-admin');

console.log('--- TESTING CREATEREQUIRE FIREBASE ADMIN ---');
console.log('admin object exists:', !!admin);
console.log('apps length:', admin.apps ? admin.apps.length : 'no apps prop');
console.log('credential.cert exists:', typeof admin.credential?.cert === 'function');
console.log('firestore exists:', typeof admin.firestore === 'function');

process.exit(0);
