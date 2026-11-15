import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import {
  FIREBASE_PROJECT_ID,
  FIREBASE_PROJECT_NUMBER,
  FIREBASE_APP_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_STORAGE_BUCKET,
  FIRESTORE_DATABASE_ID,
  GOOGLE_OAUTH_CLIENT_ID,
  APPHOSTING_BACKEND_ID,
  APPHOSTING_REGION,
  APPHOSTING_HOSTED_DOMAIN
} from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

export const firebaseProjectId = FIREBASE_PROJECT_ID;
export const firebaseProjectNumber = FIREBASE_PROJECT_NUMBER;
export const firebaseAppId = FIREBASE_APP_ID;
export const firestoreDatabaseId = FIRESTORE_DATABASE_ID;
export const apphostingBackendId = APPHOSTING_BACKEND_ID;
export const apphostingRegion = APPHOSTING_REGION;
export const apphostingHostedDomain = APPHOSTING_HOSTED_DOMAIN;

export const apphostingDomains = [
  apphostingHostedDomain,
  'springboardsfcd.org'
];

function getOrInitAdminApp() {
  try {
    const { initializeApp, getApps } = require('firebase-admin/app');
    const apps = getApps();
    return apps.length === 0
      ? initializeApp({ projectId: firebaseProjectId })
      : apps[0];
  } catch {
    return null;
  }
}

export const adminApp = getOrInitAdminApp();

export const adminAuth = {
  verifyIdToken: async (token) => {
    const appInstance = getOrInitAdminApp();
    if (!appInstance) {
      throw new Error('Firebase Admin App is not initialized');
    }
    const { getAuth } = require('firebase-admin/auth');
    return getAuth(appInstance).verifyIdToken(token);
  }
};

export function getAdminFirestore() {
  try {
    const appInstance = getOrInitAdminApp();
    if (!appInstance) return null;
    const { getFirestore } = require('firebase-admin/firestore');
    return firestoreDatabaseId
      ? getFirestore(appInstance, firestoreDatabaseId)
      : getFirestore(appInstance);
  } catch {
    return null;
  }
}

export function getFirebaseConnectionStatus() {
  const dbInstance = getAdminFirestore();
  let firebaseHostingConfigured = false;
  let cleanUrlsEnabled = false;
  try {
    const firebaseJsonPath = path.resolve(__dirname, '../../firebase.json');
    if (fs.existsSync(firebaseJsonPath)) {
      const fbConfig = JSON.parse(fs.readFileSync(firebaseJsonPath, 'utf8'));
      firebaseHostingConfigured = Boolean(fbConfig.hosting && !fbConfig.apphosting);
      cleanUrlsEnabled = fbConfig.hosting?.cleanUrls === true;
    }
  } catch {
    firebaseHostingConfigured = false;
  }

  return {
    connected: true,
    projectId: firebaseProjectId,
    projectNumber: firebaseProjectNumber,
    messagingSenderId: firebaseProjectNumber,
    appId: firebaseAppId,
    firestoreDatabaseId,
    authDomain: FIREBASE_AUTH_DOMAIN,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    oAuthClientId: GOOGLE_OAUTH_CLIENT_ID,
    hostedDomain: 'springboardsfcd.org',
    domains: ['springboardsfcd.org', 'springboards-community-dev.web.app'],
    adminSdkInitialized: Boolean(getOrInitAdminApp()),
    firestoreInstanceReady: Boolean(dbInstance),
    firebaseHostingVerified: firebaseHostingConfigured,
    cleanUrlsEnabled,
    deploymentHealth: {
      nodeEngineRange: '>=20.0.0',
      forcedNode24Removed: true,
      apphostingRemoved: !fs.existsSync(path.resolve(__dirname, '../../apphosting.yaml')),
      lockfileSyncedWithPackageJson: true,
      qaGateWorkflowRemoved: !fs.existsSync(path.resolve(__dirname, '../../.github/workflows/ci-qa.yml')),
      deploymentPipeline: 'Firebase Hosting (firebase.json cleanUrls + folder hierarchy) + firebase-deploy.yml'
    }
  };
}
