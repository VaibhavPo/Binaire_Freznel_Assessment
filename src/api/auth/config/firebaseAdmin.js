import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const credPath = path.join(__dirname, 'admin-cred.json');

let serviceAccount;

if (process.env.FIREBASE_CREDENTIALS) {
  try {
    serviceAccount = typeof process.env.FIREBASE_CREDENTIALS === 'string'
      ? JSON.parse(process.env.FIREBASE_CREDENTIALS)
      : process.env.FIREBASE_CREDENTIALS;
    fs.writeFileSync(credPath, JSON.stringify(serviceAccount, null, 2));
  } catch (err) {
    console.error('Error parsing process.env.FIREBASE_CREDENTIALS:', err);
  }
}

if (!serviceAccount) {
  try {
    serviceAccount = require('./admin-cred.json');
  } catch (err) {
    console.error('Could not load admin-cred.json:', err);
  }
}

// Initialize only if no app has been initialized yet
if (getApps().length === 0 && serviceAccount) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

// Export the Auth service
const auth = getAuth();

export default auth;