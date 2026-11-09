import crypto from 'crypto';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { ADMIN_SESSION_SECRET, ALLOWED_ORIGINS } from '../config/env.js';

// 1. Helmet Security Headers & Content Security Policy (CSP)
export const cspAndSecurityHeaders = helmet({
  frameguard: false, // Allow AI Studio preview iframe while protecting via CSP
  crossOriginResourcePolicy: false,
  crossOriginOpenerPolicy: false,
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        'https://apis.google.com',
        'https://accounts.google.com',
        'https://www.gstatic.com',
        'https://maps.googleapis.com'
      ],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
      imgSrc: ["'self'", 'data:', 'https:'],
      frameSrc: [
        "'self'",
        'https://www.google.com',
        'https://maps.google.com',
        'https://accounts.google.com',
        'https://*.firebaseapp.com',
        'https://*.web.app',
        'https://*.hosted.app'
      ],
      connectSrc: [
        "'self'",
        'https://firestore.googleapis.com',
        'https://*.googleapis.com',
        'https://identitytoolkit.googleapis.com',
        'https://securetoken.googleapis.com',
        'https://www.gstatic.com',
        'https://nominatim.openstreetmap.org'
      ],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      upgradeInsecureRequests: []
    }
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
});

// 2. Restricted CORS Middleware for API Routes
export const apiCorsMiddleware = cors({
  origin: (origin, callback) => {
    if (
      !origin ||
      ALLOWED_ORIGINS.includes(origin) ||
      /\.(run\.app|ai\.studio|hosted\.app|web\.app|firebaseapp\.com)$/.test(origin)
    ) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  credentials: true
});

// 3. Rate Limiting Middleware
export const apiGeneralLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 240,
  standardHeaders: true,
  legacyHeaders: false,
  validate: false,
  message: { error: 'Too many requests. Please wait a moment and try again.' }
});

export const publicFormLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  keyGenerator: (req) => `${req.ip || '127.0.0.1'}:${req.path}`,
  standardHeaders: true,
  legacyHeaders: false,
  validate: false,
  message: { error: 'Too many form submissions from this IP. Please try again in 15 minutes.' }
});

export const adminAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  validate: false,
  message: { error: 'Too many login attempts. Please wait 15 minutes before retrying.' }
});

// 4. Signed Session Token Helpers & Admin No-Store Protection
export function createAdminSessionToken(payload) {
  const data = Buffer.from(
    JSON.stringify({
      ...payload,
      exp: Date.now() + 8 * 60 * 60 * 1000 // 8-hour session expiry
    })
  ).toString('base64url');
  const sig = crypto.createHmac('sha256', ADMIN_SESSION_SECRET).update(data).digest('base64url');
  return `${data}.${sig}`;
}

export function verifyAdminSessionToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const [data, sig] = token.split('.');
  const expectedSig = crypto.createHmac('sha256', ADMIN_SESSION_SECRET).update(data).digest('base64url');
  if (sig !== expectedSig) return null;
  try {
    const parsed = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
    if (!parsed.exp || Date.now() > parsed.exp) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function parseCookies(req) {
  const raw = req.headers.cookie || '';
  return Object.fromEntries(
    raw
      .split(';')
      .map((part) => {
        const idx = part.indexOf('=');
        if (idx === -1) return ['', ''];
        return [part.slice(0, idx).trim(), decodeURIComponent(part.slice(idx + 1).trim())];
      })
      .filter(([k]) => k)
  );
}

export function getAdminSessionFromRequest(req) {
  const cookies = parseCookies(req);
  const bearer = (req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
  return verifyAdminSessionToken(bearer || cookies.sb_admin_session);
}

export function adminNoStore(req, res, next) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  next();
}

export function requireAdminSession(req, res, next) {
  const sessionUser = getAdminSessionFromRequest(req);
  if (sessionUser) {
    req.adminUser = sessionUser;
    return next();
  }
  return res.status(401).json({ error: 'Authentication required. Please sign in to the Executive Admin Portal.' });
}

// 5. Form Validation & Input Sanitization Helpers
export function sanitizeInput(val, maxLength = 500) {
  if (val === null || val === undefined) return '';
  return String(val)
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/<[^>]*>/g, '')
    .trim()
    .slice(0, maxLength);
}

export function isValidEmail(email) {
  if (!email) return false;
  return /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(String(email).trim());
}

export function isValidPhone(phone) {
  if (!phone) return false;
  const digits = String(phone).replace(/[^\d]/g, '');
  return digits.length === 10 || (digits.length === 11 && digits.startsWith('1'));
}
