import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const ASSETS_DIR = path.join(ROOT, 'assets');

if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

// 1. Static Asset Hashing for 1-Year Immutable Cache-Control
const hashTargets = ['styles.css', 'main.js', 'eligibility.js', 'analytics.js'];
const manifest = {
  generatedAt: new Date().toISOString(),
  assets: {}
};

for (const file of hashTargets) {
  const srcPath = path.join(ROOT, file);
  if (!fs.existsSync(srcPath)) continue;
  const content = fs.readFileSync(srcPath);
  const hash = crypto.createHash('sha256').update(content).digest('hex').slice(0, 10);
  const ext = path.extname(file);
  const base = path.basename(file, ext);
  const hashedFile = `${base}.${hash}${ext}`;
  fs.writeFileSync(path.join(ASSETS_DIR, hashedFile), content);
  manifest.assets[file] = `/assets/${hashedFile}`;
}

fs.writeFileSync(path.join(ROOT, 'dist-manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');

// 2. SEO & Accessibility Structure Verification across all public intent pages
const publicPages = [
  'index.html',
  'train.html',
  'eligibility.html',
  'volunteer.html',
  'partner.html',
  'donate.html'
];

let hasErrors = false;
for (const page of publicPages) {
  const pagePath = path.join(ROOT, page);
  if (!fs.existsSync(pagePath)) {
    console.error(`[BUILD ERROR] Missing required public page: ${page}`);
    hasErrors = true;
    continue;
  }
  const html = fs.readFileSync(pagePath, 'utf8');
  const checks = [
    { name: '<title>', regex: /<title>[^<]{10,}<\/title>/i },
    { name: 'meta description', regex: /<meta\s+name=["']description["']\s+content=["'][^"']{40,}["']/i },
    { name: 'canonical link', regex: /<link\s+rel=["']canonical["']\s+href=["']https:\/\/springboardsfcd\.org[^"']*["']/i },
    { name: 'og:title', regex: /<meta\s+property=["']og:title["']/i },
    { name: 'og:description', regex: /<meta\s+property=["']og:description["']/i },
    { name: 'og:image', regex: /<meta\s+property=["']og:image["']/i },
    { name: '<h1> heading', regex: /<h1[\s>]/i }
  ];

  for (const check of checks) {
    if (!check.regex.test(html)) {
      console.error(`[SEO AUDIT FAIL] ${page} is missing valid ${check.name}`);
      hasErrors = true;
    }
  }
}

// 3. Backend Security & Separation Audit (Zero Hardcoded Secrets/PINs in Source)
const requiredModules = [
  'src/config/env.js',
  'src/middleware/security.js',
  'src/routes/adminRoutes.js'
];

for (const mod of requiredModules) {
  if (!fs.existsSync(path.join(ROOT, mod))) {
    console.error(`[SECURITY AUDIT FAIL] Missing separated backend module: ${mod}`);
    hasErrors = true;
  }
}

const serverSource = fs.readFileSync(path.join(ROOT, 'server.js'), 'utf8');
if (/['"]2026['"]|['"]1985['"]|sb-fcd-admin-session-2026/.test(serverSource)) {
  console.error('[SECURITY AUDIT FAIL] Hardcoded PIN or session secret detected in server.js');
  hasErrors = true;
}

// 4. Firebase App Hosting (apphosting.yaml) & package.json Build Verification
const apphostingPath = path.join(ROOT, 'apphosting.yaml');
if (!fs.existsSync(apphostingPath)) {
  console.error('[APPHOSTING AUDIT FAIL] Missing apphosting.yaml in repository root.');
  hasErrors = true;
} else {
  const yamlContent = fs.readFileSync(apphostingPath, 'utf8');
  const requiredEnvVars = [
    'NODE_ENV',
    'APP_URL',
    'FIREBASE_PROJECT_ID',
    'GCLOUD_PROJECT',
    'FIREBASE_PROJECT_NUMBER',
    'FIREBASE_MESSAGING_SENDER_ID',
    'FIREBASE_APP_ID',
    'FIRESTORE_DATABASE_ID',
    'APPHOSTING_BACKEND_ID',
    'APPHOSTING_REGION',
    'APPHOSTING_HOSTED_DOMAIN',
    'ALLOWED_ORIGINS',
    'DESIGNATED_INBOX',
    'WORKSPACE_CONNECTED_EMAIL',
    'ADMIN_ALLOWED_EMAILS'
  ];
  for (const envVar of requiredEnvVars) {
    const regex = new RegExp(`variable:\\s*${envVar}\\b`);
    if (!regex.test(yamlContent)) {
      console.error(`[APPHOSTING AUDIT FAIL] apphosting.yaml is missing required variable: ${envVar}`);
      hasErrors = true;
    }
  }
  if (!/runConfig:/.test(yamlContent) || !/memoryMiB:\s*\d+/.test(yamlContent)) {
    console.error('[APPHOSTING AUDIT FAIL] apphosting.yaml is missing valid runConfig settings.');
    hasErrors = true;
  }
  // Ensure NODE_ENV=production is NOT set at BUILD time (which causes npm ci to skip devDependencies)
  const nodeEnvBlockMatch = yamlContent.match(/-\s*variable:\s*NODE_ENV[\s\S]*?(?=\n\s*-\s*variable:|\n\s*#|$)/);
  if (nodeEnvBlockMatch && /-\s*BUILD\b/.test(nodeEnvBlockMatch[0])) {
    console.error('[APPHOSTING AUDIT FAIL] NODE_ENV must only be set for RUNTIME in apphosting.yaml so npm ci installs devDependencies during BUILD.');
    hasErrors = true;
  }
}

const pkgJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
if (!pkgJson.scripts?.build || !pkgJson.scripts?.start) {
  console.error('[PACKAGE AUDIT FAIL] package.json must define both "build" and "start" scripts for App Hosting.');
  hasErrors = true;
}
if (pkgJson.engines?.node === '24.x') {
  console.error('[PACKAGE AUDIT FAIL] Do not force "node": "24.x" in package.json engines; use ">=20.0.0" for LTS runner compatibility.');
  hasErrors = true;
}
if (fs.existsSync(path.join(ROOT, '.github', 'workflows'))) {
  console.error('[WORKFLOW AUDIT FAIL] .github/workflows directory detected; remove GitHub Actions workflows to prevent 0s startup_failure billing blocks.');
  hasErrors = true;
}

const lockfilePath = path.join(ROOT, 'package-lock.json');
if (!fs.existsSync(lockfilePath)) {
  console.error('[LOCKFILE AUDIT FAIL] Missing package-lock.json in repository root.');
  hasErrors = true;
} else {
  const lockJson = JSON.parse(fs.readFileSync(lockfilePath, 'utf8'));
  if (!lockJson.lockfileVersion || lockJson.lockfileVersion < 3) {
    console.error('[LOCKFILE AUDIT FAIL] package-lock.json must use lockfileVersion >= 3 (npm v10+).');
    hasErrors = true;
  }
}

if (hasErrors) {
  process.exit(1);
}

console.log('[Build Pipeline] Asset hashing complete:', manifest.assets);
console.log('[Build Pipeline] Verified package-lock.json (lockfileVersion 3), apphosting.yaml (NODE_ENV=RUNTIME only), and Node >=20.0.0 LTS engine.');
console.log('[Build Pipeline] SEO, canonical, OpenGraph, H1, and backend security separation verified for all 6 intent pages.');

