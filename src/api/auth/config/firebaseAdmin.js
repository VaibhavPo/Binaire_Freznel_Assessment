import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

// Make sure the path to your service account key is correct
const serviceAccount = require('./admin-cred.json');

// Initialize only if no app has been initialized yet
if (getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

// Export the Auth service
const auth = getAuth();

export default auth;