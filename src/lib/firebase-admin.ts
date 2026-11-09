import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let appletConfig: Record<string, string> = {};
try {
  const configPath = path.resolve(__dirname, '../../firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    appletConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }
} catch {
  appletConfig = {};
}

function cleanEnv(
  val: string | undefined,
  fallback: string,
  validator?: (v: string) => boolean
): string {
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
    appletConfig.projectId,
  'springboards-community-dev',
  (v) => v.toLowerCase() === 'springboards-community-dev'
).toLowerCase();

export const firebaseProjectNumber = cleanEnv(
  process.env.FIREBASE_PROJECT_NUMBER ||
    process.env.FIREBASE_MESSAGING_SENDER_ID ||
    appletConfig.messagingSenderId,
  '651964189612',
  (v) => v === '651964189612'
);

export const firebaseAppId = cleanEnv(
  (process.env.FIREBASE_APP_ID || appletConfig.appId || '').replace(/\s+/g, ''),
  '1:651964189612:web:fc444ee616bf91da99c809',
  (v) => v === '1:651964189612:web:fc444ee616bf91da99c809'
);

export const firestoreDatabaseId = cleanEnv(
  process.env.FIRESTORE_DATABASE_ID || appletConfig.firestoreDatabaseId,
  'ai-studio-springboardsland-71046992-4c5a-4c20-bdcd-c5ee24b8cc0a'
);

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

