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

const ORG_PUBLIC_EMAIL = 'info@springboardsfcd.org';

export const PORT = Number(process.env.PORT || 3000);
export const NODE_ENV = process.env.NODE_ENV || 'production';
export const APP_URL = (process.env.APP_URL || 'https://springboardsfcd.org').replace(/\/+$/, '');

// Inbox & routing configuration (zero hardcoded personal identities in source)
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

// CORS allowed origins
export const ALLOWED_ORIGINS = (
  process.env.ALLOWED_ORIGINS ||
  `${APP_URL},https://www.springboardsfcd.org,https://springboards-backend--springboards-community-dev.us-east4.hosted.app,https://springboards-community-dev.web.app,http://localhost:3000`
)
  .split(',')
  .map((o) => o.replace(/^\[.*\]\((.*)\)$/, '$1').trim())
  .filter(Boolean);
