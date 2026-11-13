import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
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

export const adminApp =
  getApps().length === 0
    ? initializeApp({
        projectId: firebaseProjectId
      })
    : getApps()[0];

export const adminAuth = getAuth(adminApp);

export function getAdminFirestore() {
  try {
    return firestoreDatabaseId
      ? getFirestore(adminApp, firestoreDatabaseId)
      : getFirestore(adminApp);
  } catch {
    return null;
  }
}

export function getFirebaseConnectionStatus() {
  const dbInstance = getAdminFirestore();
  let apphostingYamlExists = false;
  let apphostingEnvVariables = [];
  let nodeEnvRuntimeOnly = false;
  try {
    const yamlPath = path.resolve(__dirname, '../../apphosting.yaml');
    if (fs.existsSync(yamlPath)) {
      apphostingYamlExists = true;
      const rawYaml = fs.readFileSync(yamlPath, 'utf8');
      const matches = [...rawYaml.matchAll(/-\s*variable:\s*([A-Z0-9_]+)/g)];
      apphostingEnvVariables = Array.from(new Set(matches.map((m) => m[1])));
      const nodeEnvBlock = rawYaml.match(/-\s*variable:\s*NODE_ENV[\s\S]*?(?=\n\s*-\s*variable:|\n\s*#|$)/);
      nodeEnvRuntimeOnly = Boolean(
        nodeEnvBlock && !/-\s*BUILD\b/.test(nodeEnvBlock[0]) && /-\s*RUNTIME\b/.test(nodeEnvBlock[0])
      );
    }
  } catch {
    apphostingYamlExists = false;
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
    apphostingBackendId,
    region: apphostingRegion,
    hostedDomain: apphostingHostedDomain,
    domains: apphostingDomains,
    adminSdkInitialized: getApps().length > 0,
    firestoreInstanceReady: Boolean(dbInstance),
    apphostingYamlVerified: apphostingYamlExists,
    apphostingEnvVariables,
    deploymentHealth: {
      nodeEngineRange: '>=20.0.0',
      forcedNode24Removed: true,
      nodeEnvRuntimeOnlyForDevDeps: nodeEnvRuntimeOnly,
      githubActionsWorkflowsRemoved: !fs.existsSync(path.resolve(__dirname, '../../.github/workflows')),
      deploymentPipeline: 'Firebase App Hosting Cloud Build (apphosting.yaml)'
    }
  };
}
