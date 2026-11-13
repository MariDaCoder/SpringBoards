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

const ORG_PUBLIC_EMAIL = 'marilynnlward@gmail.com';

// Enforce Eastern Standard Time Zone (America/New_York / EST) across server runtime
process.env.TZ = process.env.TZ || 'America/New_York';
export const TIMEZONE = process.env.TZ || 'America/New_York';
export const TIMEZONE_LABEL = 'Eastern Standard Time (EST)';

const isAiStudioContainer = ROOT_DIR.startsWith('/app/applet');
export const PORT = Number(
  isAiStudioContainer && process.env.PORT === '8080' ? 3000 : process.env.PORT || 3000
);
export const NODE_ENV = process.env.NODE_ENV || 'production';
export const APP_URL = (process.env.APP_URL || 'https://springboardsfcd.org').replace(/\/+$/, '');

// Firebase Project, Web App & Enterprise Firestore Database Configuration
export const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'springboards-community-dev';
export const GCLOUD_PROJECT = process.env.GCLOUD_PROJECT || FIREBASE_PROJECT_ID;
export const FIREBASE_PROJECT_NUMBER = process.env.FIREBASE_PROJECT_NUMBER || '651964189612';
export const FIREBASE_MESSAGING_SENDER_ID = process.env.FIREBASE_MESSAGING_SENDER_ID || '651964189612';
export const FIREBASE_APP_ID = process.env.FIREBASE_APP_ID || '1:651964189612:web:fc444ee616bf91da99c809';
export const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY || 'AIzaSyCZbXdTnbIlmFc6Jm0AYt9scNYJFqGOyB8';
export const FIREBASE_AUTH_DOMAIN = process.env.FIREBASE_AUTH_DOMAIN || 'springboards-community-dev.firebaseapp.com';
export const FIREBASE_DATABASE_URL =
  process.env.FIREBASE_DATABASE_URL || 'https://springboards-community-dev-default-rtdb.firebaseio.com';
export const FIREBASE_STORAGE_BUCKET =
  process.env.FIREBASE_STORAGE_BUCKET || 'springboards-community-dev.firebasestorage.app';
export const FIRESTORE_DATABASE_ID =
  process.env.FIRESTORE_DATABASE_ID || 'main';
export const FIRESTORE_LOCATION = process.env.FIRESTORE_LOCATION || 'us-east1';
export const GOOGLE_OAUTH_CLIENT_ID =
  process.env.GOOGLE_OAUTH_CLIENT_ID || '651964189612-jdk3n5qnhq6s8trvrpbemnq4t3djffeo.apps.googleusercontent.com';
export const SPRINGBOARDS_TRACKER_SHEET_ID =
  process.env.SPRINGBOARDS_TRACKER_SHEET_ID || '1KZgNGpwHedOxN6oSSwdoAbXtV3bhTuLJBx65tdRbtlQ';

// Firebase App Hosting Backend Configuration
export const APPHOSTING_BACKEND_ID = process.env.APPHOSTING_BACKEND_ID || 'springboards-backend';
export const APPHOSTING_REGION = process.env.APPHOSTING_REGION || 'us-east4';
export const APPHOSTING_HOSTED_DOMAIN =
  process.env.APPHOSTING_HOSTED_DOMAIN || 'springboards-backend--springboards-community-dev.us-east4.hosted.app';

// Inbox & routing configuration
export const DESIGNATED_INBOX = process.env.DESIGNATED_INBOX || ORG_PUBLIC_EMAIL;
export const HR_INBOX = process.env.HR_INBOX || ORG_PUBLIC_EMAIL;
export const ALERT_EMAIL = process.env.ALERT_EMAIL || ORG_PUBLIC_EMAIL;
export const BACKUP_ALERT_EMAIL = process.env.BACKUP_ALERT_EMAIL || ORG_PUBLIC_EMAIL;
export const WORKSPACE_CONNECTED_EMAIL = process.env.WORKSPACE_CONNECTED_EMAIL || ORG_PUBLIC_EMAIL;

// Admin authentication & session secrets (environment-driven, ephemeral runtime secret fallback)
export const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || '';
export const STAFF_DEFAULT_PIN = process.env.STAFF_DEFAULT_PIN || '';
export const ADMIN_SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET || crypto.randomBytes(32).toString('hex');

export const ADMIN_ALLOWED_EMAILS = new Set([
  ORG_PUBLIC_EMAIL,
  'springboardforcommunitydev@gmail.com',
  'info@springboardsfcd.org',
  ...(process.env.ADMIN_ALLOWED_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
]);

// Analytics & telemetry keys
export const ANALYTICS_ENABLED =
  String(process.env.ANALYTICS_ENABLED ?? 'true').toLowerCase() !== 'false';
export const ANALYTICS_WRITE_KEY = process.env.ANALYTICS_WRITE_KEY || '';

// SMTP / Email transport configuration
export const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT || 587),
  user: process.env.SMTP_USER || ORG_PUBLIC_EMAIL,
  pass: process.env.SMTP_PASS || ''
};

// Cloud SQL / Drizzle ORM Connection Metadata
export const SQL_CONFIG = {
  host: process.env.SQL_HOST || '/cloudsql/springboards-community-dev:us-east1:ai-studio-71046992',
  user: process.env.SQL_USER || 'ai_studio_app_user',
  adminUser: process.env.SQL_ADMIN_USER || 'ai_studio_admin',
  database: process.env.SQL_DB_NAME || 'cloud_sql_development_database'
};

// CORS allowed origins
export const ALLOWED_ORIGINS = (
  process.env.ALLOWED_ORIGINS ||
  `${APP_URL},https://www.springboardsfcd.org,https://springboards-backend--springboards-community-dev.us-east4.hosted.app,https://springboards-community-dev.web.app,https://springboards-community-dev.firebaseapp.com,https://ais-dev-qnd7dwpxy5lvvqlhyhakyp-11235862349.us-west2.run.app,https://ais-pre-qnd7dwpxy5lvvqlhyhakyp-11235862349.us-west2.run.app,http://localhost:3000`
)
  .split(',')
  .map((o) => o.replace(/^\[.*\]\((.*)\)$/, '$1').trim())
  .filter(Boolean);

