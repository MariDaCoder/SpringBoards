import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appletConfig = {};

let runtimeWebAppConfig = {};
if (process.env.FIREBASE_WEBAPP_CONFIG) {
  try {
    runtimeWebAppConfig = JSON.parse(process.env.FIREBASE_WEBAPP_CONFIG);
  } catch {
    runtimeWebAppConfig = {};
  }
} else if (process.env.FIREBASE_CONFIG && process.env.FIREBASE_CONFIG.trim().startsWith('{')) {
  try {
    runtimeWebAppConfig = JSON.parse(process.env.FIREBASE_CONFIG);
  } catch {
    runtimeWebAppConfig = {};
  }
}

function cleanEnv(val, fallback, validator) {
  const s = String(val || '').trim();
  if (
    !s ||
    s.toLowerCase() === 'secret value' ||
    s.toLowerCase() === 'undefined' ||
    s.toLowerCase() === 'null' ||
    s.startsWith('replace-with-')
  ) {
    return fallback;
  }
  if (typeof validator === 'function' && !validator(s)) {
    return fallback;
  }
  return s;
}

export const firebaseProjectId = cleanEnv(
  process.env.FIREBASE_PROJECT_ID ||
    process.env.GCLOUD_PROJECT ||
    runtimeWebAppConfig.projectId ||
    appletConfig.projectId,
  'springboards-community-dev',
  (v) => v.toLowerCase() === 'springboards-community-dev'
).toLowerCase();

export const firebaseProjectNumber = cleanEnv(
  process.env.FIREBASE_PROJECT_NUMBER ||
    process.env.FIREBASE_MESSAGING_SENDER_ID ||
    runtimeWebAppConfig.messagingSenderId ||
    appletConfig.messagingSenderId,
  '651964189612',
  (v) => v === '651964189612'
);

export const firebaseAppId = cleanEnv(
  (
    process.env.FIREBASE_APP_ID ||
    runtimeWebAppConfig.appId ||
    appletConfig.appId ||
    ''
  ).replace(/\s+/g, ''),
  '1:651964189612:web:fc444ee616bf91da99c809',
  (v) => v === '1:651964189612:web:fc444ee616bf91da99c809'
);

export const firestoreDatabaseId = cleanEnv(
  process.env.FIRESTORE_DATABASE_ID ||
    runtimeWebAppConfig.firestoreDatabaseId ||
    appletConfig.firestoreDatabaseId,
  'main'
);

export const adminApp =
  getApps().length === 0
    ? initializeApp({
        projectId: firebaseProjectId,
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

export const apphostingBackendId = cleanEnv(
  process.env.APPHOSTING_BACKEND_ID,
  'springboards-backend',
  (v) => v === 'springboards-backend'
);

export const apphostingRegion = cleanEnv(
  process.env.APPHOSTING_REGION,
  'us-east4',
  (v) => v === 'us-east4'
);

export const apphostingHostedDomain = cleanEnv(
  process.env.APPHOSTING_HOSTED_DOMAIN,
  'springboards-backend--springboards-community-dev.us-east4.hosted.app',
  (v) => v === 'springboards-backend--springboards-community-dev.us-east4.hosted.app'
);

export const apphostingDomains = [
  apphostingHostedDomain,
  'springboardsfcd.org'
];

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
      apphostingEnvVariables = matches.map((m) => m[1]);
      const nodeEnvBlock = rawYaml.match(/-\s*variable:\s*NODE_ENV[\s\S]*?(?=\n\s*-\s*variable:|\n\s*#|$)/);
      nodeEnvRuntimeOnly = Boolean(nodeEnvBlock && !/-\s*BUILD\b/.test(nodeEnvBlock[0]) && /-\s*RUNTIME\b/.test(nodeEnvBlock[0]));
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
    authDomain: runtimeWebAppConfig.authDomain || appletConfig.authDomain || `${firebaseProjectId}.firebaseapp.com`,
    storageBucket: runtimeWebAppConfig.storageBucket || appletConfig.storageBucket || `${firebaseProjectId}.firebasestorage.app`,
    oAuthClientId: appletConfig.oAuthClientId || '651964189612-jdk3n5qnhq6s8trvrpbemnq4t3djffeo.apps.googleusercontent.com',
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



