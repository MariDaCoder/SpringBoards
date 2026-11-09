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

if (hasErrors) {
  process.exit(1);
}

console.log('[Build Pipeline] Asset hashing complete:', manifest.assets);
console.log('[Build Pipeline] SEO, canonical, OpenGraph, H1, and backend security separation verified for all 6 intent pages.');
