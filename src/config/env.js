import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../..');

// Load .env file if present without overriding existing process.env variables
const envFilePath = path.join(ROOT_DIR, '.env');
if (fs.existsSync(envFilePath)) {
  try {
    const envRaw = fs.readFileSync(envFilePath, 'utf8');
    for (const line of envRaw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
      if (key && process.env[key] === undefined) {
        process.env[key] = val;
      }
    }
  } catch {
    // Ignore .env read errors
  }
}

// Parse runtime Firebase JSON config if injected by Cloud Run / App Hosting
let runtimeFirebaseConfig = {};
const rawRuntimeJson = process.env.FIREBASE_WEBAPP_CONFIG || process.env.FIREBASE_CONFIG || '';
if (rawRuntimeJson.trim().startsWith('{')) {
  try {
    runtimeFirebaseConfig = JSON.parse(rawRuntimeJson);
  } catch {
    runtimeFirebaseConfig = {};
  }
}

function resolveEnvValue(val, fallback) {
  const s = String(val ?? '').trim();
  if (
    !s ||
    s.toLowerCase() === 'secret value' ||
    s.toLowerCase() === 'undefined' ||
    s.toLowerCase() === 'null' ||
    s.startsWith('replace-with-')
  ) {
    return fallback;
  }
  return s;
}

function deriveProjectSecret(scope, length = 64) {
  return crypto
    .createHmac('sha256', 'springboards-community-dev:651964189612:fc444ee616bf91da99c809')
    .update(scope)
    .digest('hex')
    .slice(0, length);
}

const ORG_PUBLIC_EMAIL = 'marilynnlward@gmail.com';

// 1. Runtime, Time Zone (America/New_York / EST) & Canonical URLs
process.env.TZ = resolveEnvValue(process.env.TZ, 'America/New_York');
export const TIMEZONE = process.env.TZ;
export const TIMEZONE_LABEL = 'Eastern Standard Time (EST)';

const isAiStudioContainer = ROOT_DIR.startsWith('/app/applet');
export const PORT = Number(
  isAiStudioContainer && process.env.PORT === '8080' ? 3000 : process.env.PORT || 3000
);
export const NODE_ENV = resolveEnvValue(process.env.NODE_ENV, 'production');
export const APP_URL = resolveEnvValue(process.env.APP_URL, 'https://springboardsfcd.org').replace(/\/+$/, '');
export const DEV_APP_URL = 'https://ais-dev-qnd7dwpxy5lvvqlhyhakyp-11235862349.us-west2.run.app';
export const SHARED_APP_URL = 'https://ais-pre-qnd7dwpxy5lvvqlhyhakyp-11235862349.us-west2.run.app';

// 2. Firebase Project, Web App & Enterprise Firestore Database Configuration
export const FIREBASE_PROJECT_ID = resolveEnvValue(
  process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || runtimeFirebaseConfig.projectId,
  'springboards-community-dev'
).toLowerCase();
export const GCLOUD_PROJECT = resolveEnvValue(process.env.GCLOUD_PROJECT, FIREBASE_PROJECT_ID);
export const FIREBASE_PROJECT_NUMBER = resolveEnvValue(
  process.env.FIREBASE_PROJECT_NUMBER || runtimeFirebaseConfig.messagingSenderId,
  '651964189612'
);
export const FIREBASE_MESSAGING_SENDER_ID = resolveEnvValue(
  process.env.FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_PROJECT_NUMBER
);
export const FIREBASE_APP_ID = resolveEnvValue(
  (process.env.FIREBASE_APP_ID || runtimeFirebaseConfig.appId || '').replace(/\s+/g, ''),
  '1:651964189612:web:fc444ee616bf91da99c809'
);
export const FIREBASE_API_KEY = resolveEnvValue(
  process.env.FIREBASE_API_KEY || runtimeFirebaseConfig.apiKey,
  'AIzaSyCZbXdTnbIlmFc6Jm0AYt9scNYJFqGOyB8'
);
export const FIREBASE_AUTH_DOMAIN = resolveEnvValue(
  process.env.FIREBASE_AUTH_DOMAIN || runtimeFirebaseConfig.authDomain,
  `${FIREBASE_PROJECT_ID}.firebaseapp.com`
);
export const FIREBASE_DATABASE_URL = resolveEnvValue(
  process.env.FIREBASE_DATABASE_URL || runtimeFirebaseConfig.databaseURL,
  `https://${FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`
);
export const FIREBASE_STORAGE_BUCKET = resolveEnvValue(
  process.env.FIREBASE_STORAGE_BUCKET || runtimeFirebaseConfig.storageBucket,
  `${FIREBASE_PROJECT_ID}.firebasestorage.app`
);
export const FIRESTORE_DATABASE_ID = resolveEnvValue(
  process.env.FIRESTORE_DATABASE_ID || runtimeFirebaseConfig.firestoreDatabaseId,
  'main'
);
export const FIRESTORE_LOCATION = resolveEnvValue(process.env.FIRESTORE_LOCATION, 'us-east1');
export const GOOGLE_OAUTH_CLIENT_ID = resolveEnvValue(
  process.env.GOOGLE_OAUTH_CLIENT_ID,
  '651964189612-jdk3n5qnhq6s8trvrpbemnq4t3djffeo.apps.googleusercontent.com'
);
export const SPRINGBOARDS_TRACKER_SHEET_ID = resolveEnvValue(
  process.env.SPRINGBOARDS_TRACKER_SHEET_ID,
  '1KZgNGpwHedOxN6oSSwdoAbXtV3bhTuLJBx65tdRbtlQ'
);

// 3. Firebase App Hosting Backend Configuration
export const APPHOSTING_BACKEND_ID = resolveEnvValue(process.env.APPHOSTING_BACKEND_ID, 'springboards-backend');
export const APPHOSTING_REGION = resolveEnvValue(process.env.APPHOSTING_REGION, 'us-east4');
export const APPHOSTING_HOSTED_DOMAIN = resolveEnvValue(
  process.env.APPHOSTING_HOSTED_DOMAIN,
  'springboards-backend--springboards-community-dev.us-east4.hosted.app'
);

// 4. Designated Workforce & Alert Routing Inboxes
export const DESIGNATED_INBOX = resolveEnvValue(process.env.DESIGNATED_INBOX, ORG_PUBLIC_EMAIL);
export const HR_INBOX = resolveEnvValue(process.env.HR_INBOX, ORG_PUBLIC_EMAIL);
export const ALERT_EMAIL = resolveEnvValue(process.env.ALERT_EMAIL, ORG_PUBLIC_EMAIL);
export const BACKUP_ALERT_EMAIL = resolveEnvValue(process.env.BACKUP_ALERT_EMAIL, ORG_PUBLIC_EMAIL);
export const WORKSPACE_CONNECTED_EMAIL = resolveEnvValue(process.env.WORKSPACE_CONNECTED_EMAIL, ORG_PUBLIC_EMAIL);

// 5. Admin Authentication & Session Secrets (Deterministic HMAC-SHA256 fallback when not injected via Secret Manager)
export const ADMIN_PASSCODE = resolveEnvValue(
  process.env.ADMIN_PASSCODE,
  deriveProjectSecret('admin-passcode-v1', 16)
);
export const STAFF_DEFAULT_PIN = resolveEnvValue(
  process.env.STAFF_DEFAULT_PIN,
  deriveProjectSecret('staff-default-pin-v1', 12)
);
export const ADMIN_SESSION_SECRET = resolveEnvValue(
  process.env.ADMIN_SESSION_SECRET,
  deriveProjectSecret('admin-session-hmac-secret-v1', 64)
);

export const ADMIN_ALLOWED_EMAILS = new Set([
  ORG_PUBLIC_EMAIL,
  'springboardforcommunitydev@gmail.com',
  'info@springboardsfcd.org',
  ...(process.env.ADMIN_ALLOWED_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
]);

// 6. Analytics & Telemetry Keys
export const ANALYTICS_ENABLED =
  String(process.env.ANALYTICS_ENABLED ?? 'true').toLowerCase() !== 'false';
export const ANALYTICS_WRITE_KEY = resolveEnvValue(
  process.env.ANALYTICS_WRITE_KEY,
  deriveProjectSecret('analytics-write-key-v1', 32)
);

// 7. SMTP / Email Transport Configuration
export const SMTP_CONFIG = {
  host: resolveEnvValue(process.env.SMTP_HOST, 'smtp.gmail.com'),
  port: Number(process.env.SMTP_PORT || 587),
  user: resolveEnvValue(process.env.SMTP_USER, ORG_PUBLIC_EMAIL),
  pass: resolveEnvValue(process.env.SMTP_PASS, deriveProjectSecret('smtp-transport-token-v1', 24))
};

// 8. Cloud SQL / Drizzle ORM Connection & Secret Metadata
export const SQL_PASSWORD = resolveEnvValue(
  process.env.SQL_PASSWORD,
  deriveProjectSecret('cloudsql-app-user-password-v1', 32)
);
export const SQL_ADMIN_PASSWORD = resolveEnvValue(
  process.env.SQL_ADMIN_PASSWORD,
  deriveProjectSecret('cloudsql-admin-user-password-v1', 32)
);
export const SQL_CONFIG = {
  host: resolveEnvValue(
    process.env.SQL_HOST,
    '/app/cloudsql/springboards-community-dev:us-east1:ai-studio-71046992'
  ),
  user: resolveEnvValue(process.env.SQL_USER, 'ai_studio_app_user'),
  password: SQL_PASSWORD,
  adminUser: resolveEnvValue(process.env.SQL_ADMIN_USER, 'ai_studio_admin'),
  adminPassword: SQL_ADMIN_PASSWORD,
  database: resolveEnvValue(process.env.SQL_DB_NAME, 'cloud_sql_development_database')
};

// 9. Deduplicated CORS Allowed Origins
export const ALLOWED_ORIGINS = Array.from(
  new Set(
    (
      process.env.ALLOWED_ORIGINS ||
      `https://springboardsfcd.org,https://www.springboardsfcd.org,${APPHOSTING_HOSTED_DOMAIN ? `https://${APPHOSTING_HOSTED_DOMAIN}` : ''},https://springboards-community-dev.web.app,https://springboards-community-dev.firebaseapp.com,${DEV_APP_URL},${SHARED_APP_URL},http://localhost:3000`
    )
      .split(',')
      .map((o) => o.replace(/^\[.*\]\((.*)\)$/, '$1').trim().replace(/\/+$/, ''))
      .filter(Boolean)
  )
);
