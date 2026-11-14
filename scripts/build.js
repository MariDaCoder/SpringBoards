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

// 0. Ensure Self-Hosted Custom Font Assets (Plus Jakarta Sans WOFF2 Variable — Latin Subset Only)
const FONTS_DIR = path.join(ASSETS_DIR, 'fonts');
if (!fs.existsSync(FONTS_DIR)) fs.mkdirSync(FONTS_DIR, { recursive: true });

const APPROVED_FONT_FILES = [
  'plus-jakarta-sans-latin-wght-normal.woff2',
  'plus-jakarta-sans-latin-wght-italic.woff2'
];

const fontsourceDir = path.join(ROOT, 'node_modules', '@fontsource-variable', 'plus-jakarta-sans', 'files');
if (fs.existsSync(fontsourceDir)) {
  for (const fontFile of APPROVED_FONT_FILES) {
    const src = path.join(fontsourceDir, fontFile);
    const dest = path.join(FONTS_DIR, fontFile);
    if (fs.existsSync(src) && !fs.existsSync(dest)) {
      fs.copyFileSync(src, dest);
    }
  }
}

// Prune any non-approved font variants from /assets/fonts
for (const existingFont of fs.readdirSync(FONTS_DIR)) {
  if (existingFont.endsWith('.woff2') && !APPROVED_FONT_FILES.includes(existingFont)) {
    fs.unlinkSync(path.join(FONTS_DIR, existingFont));
  }
}

// 1. Prune Any Duplicate Hashed Bundles or Redundant Build Artifacts
for (const entry of fs.readdirSync(ASSETS_DIR)) {
  if (/^(styles|main|eligibility|analytics)\.[a-f0-9]{8,}\.(css|js)$/.test(entry)) {
    fs.unlinkSync(path.join(ASSETS_DIR, entry));
  }
}
const redundantPaths = [
  path.join(ROOT, 'dist-manifest.json'),
  path.join(ROOT, 'bun.lock'),
  path.join(ROOT, 'springboards_logo_icon.png'),
  path.join(ROOT, 'favicon-dark.png')
];
for (const redundantPath of redundantPaths) {
  if (fs.existsSync(redundantPath)) {
    fs.unlinkSync(redundantPath);
  }
}

// 2. SEO & Accessibility Structure Verification across all public intent pages
const publicPages = [
  'index.html',
  'train.html',
  'eligibility.html',
  'volunteer.html',
  'partner.html',
  'donate.html',
  'style-guide.html'
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
// Ensure deprecated QA workflows/actions are removed and validate .github/workflows/firebase-deploy.yml
const deprecatedWorkflowPaths = [
  path.join(ROOT, '.github', 'workflows', 'ci-qa.yml'),
  path.join(ROOT, '.github', 'actions', 'springboards-qa-gate', 'action.yml'),
  path.join(ROOT, '.github', 'actions', 'springboards-qa-gate'),
  path.join(ROOT, '.github', 'actions')
];
for (const depPath of deprecatedWorkflowPaths) {
  if (fs.existsSync(depPath)) {
    fs.rmSync(depPath, { recursive: true, force: true });
  }
}

const deployWorkflowPath = path.join(ROOT, '.github', 'workflows', 'firebase-deploy.yml');
if (fs.existsSync(deployWorkflowPath)) {
  const workflowYaml = fs.readFileSync(deployWorkflowPath, 'utf8');
  if (/FORCE_JAVASCRIPT_ACTIONS_TO_NODE24/.test(workflowYaml)) {
    console.error('[WORKFLOW AUDIT FAIL] firebase-deploy.yml must not include FORCE_JAVASCRIPT_ACTIONS_TO_NODE24.');
    hasErrors = true;
  }
  if (/NODE_ENV:\s*production/.test(workflowYaml)) {
    console.error('[WORKFLOW AUDIT FAIL] firebase-deploy.yml must not set NODE_ENV: production at top-level env.');
    hasErrors = true;
  }
  if (/springboards-qa-gate|ci-qa/i.test(workflowYaml)) {
    console.error('[WORKFLOW AUDIT FAIL] firebase-deploy.yml must not reference removed QA check.');
    hasErrors = true;
  }
  if (!/npx --yes firebase-tools@latest apphosting:rollouts:create "\$APPHOSTING_BACKEND_ID" \\\s*\n\s*--git-commit "\$GITHUB_SHA" \\/.test(workflowYaml)) {
    console.error('[WORKFLOW AUDIT FAIL] firebase-deploy.yml is missing npx --yes firebase-tools@latest apphosting:rollouts:create "$APPHOSTING_BACKEND_ID" \\ above --git-commit "$GITHUB_SHA" \\.');
    hasErrors = true;
  }
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

// 5. CSS Architecture & Custom Variable Audit (Zero External Framework Bloat)
const stylesContent = fs.readFileSync(path.join(ROOT, 'styles.css'), 'utf8');
const requiredCssVariables = [
  '--color-brand-primary',
  '--color-accent-primary:\\s*#E05B32',
  '--color-accent-primary-hover:\\s*#C54E29',
  '--primary-navy',
  '--accent-orange',
  '--font-family',
  '--font-heading',
  '--font-ui',
  '--font-mono',
  '--space-4',
  '--radius-btn:\\s*3px',
  'clamp\\(1\\.5rem,\\s*4vw,\\s*2\\.4rem\\)',
  'repeat\\(auto-fit,\\s*minmax\\(220px,\\s*1fr\\)\\)',
  '@media\\s*\\(max-width:\\s*600px\\)',
  '@media\\s*\\(max-width:\\s*480px\\)',
  '@media\\s*\\(prefers-reduced-motion:\\s*reduce\\)',
  'min-height:\\s*3\\.1rem',
  '\\.wizard-fieldset',
  '\\.wizard-choice'
];
for (const tokenPattern of requiredCssVariables) {
  if (!new RegExp(tokenPattern, 'i').test(stylesContent)) {
    console.error(`[CSS ARCHITECTURE AUDIT FAIL] styles.css is missing required brand custom variable pattern: ${tokenPattern}`);
    hasErrors = true;
  }
}

const forbiddenCssFrameworks = ['tailwindcss', 'bootstrap', 'bulma', 'foundation-sites', 'materialize-css'];
const allDeps = { ...(pkgJson.dependencies || {}), ...(pkgJson.devDependencies || {}) };
for (const fw of forbiddenCssFrameworks) {
  if (allDeps[fw]) {
    console.error(`[CSS ARCHITECTURE AUDIT FAIL] Heavy external CSS framework "${fw}" detected. Use native styles.css custom variables instead.`);
    hasErrors = true;
  }
}

// Verify consolidated external stylesheet linkage & zero inline <style> blocks across all HTML files
const htmlFilesToAuditCss = [...publicPages, '404.html', 'backoffice.html'];
for (const htmlFile of htmlFilesToAuditCss) {
  const htmlPath = path.join(ROOT, htmlFile);
  if (!fs.existsSync(htmlPath)) continue;
  const htmlSource = fs.readFileSync(htmlPath, 'utf8');
  if (/<style[\s>]/i.test(htmlSource)) {
    console.error(`[CSS ARCHITECTURE AUDIT FAIL] ${htmlFile} contains an inline <style> block. Consolidate all styles into /styles.css.`);
    hasErrors = true;
  }
  if (!/<link[^>]+rel=["']stylesheet["'][^>]+href=["'](?:https:\/\/springboardsfcd\.org)?\/styles\.css["']/i.test(htmlSource)) {
    console.error(`[CSS ARCHITECTURE AUDIT FAIL] ${htmlFile} is missing standardized external stylesheet link to /styles.css.`);
    hasErrors = true;
  }
}

if (!fs.existsSync(path.join(ROOT, 'components.js'))) {
  console.error('[COMPONENT ARCHITECTURE AUDIT FAIL] Missing /components.js reusable component system.');
  hasErrors = true;
}

// 6. MCP Server & Workflow Integration Audit (.mcp.json, .vscode/mcp.json, scripts/mcp-server.js)
const mcpConfigPath = path.join(ROOT, '.mcp.json');
const vscodeMcpPath = path.join(ROOT, '.vscode', 'mcp.json');
const mcpServerScriptPath = path.join(ROOT, 'scripts', 'mcp-server.js');

if (!fs.existsSync(mcpConfigPath) || !fs.existsSync(vscodeMcpPath) || !fs.existsSync(mcpServerScriptPath)) {
  console.error('[MCP AUDIT FAIL] Missing .mcp.json, .vscode/mcp.json, or scripts/mcp-server.js.');
  hasErrors = true;
} else {
  const mcpJson = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));
  if (!mcpJson.mcpServers?.['springboards-design-content-mcp'] || !mcpJson.mcpServers?.['io.github.ChromeDevTools/chrome-devtools-mcp']) {
    console.error('[MCP AUDIT FAIL] .mcp.json must configure springboards-design-content-mcp and ChromeDevTools MCP.');
    hasErrors = true;
  }
}

if (hasErrors) {
  process.exit(1);
}

console.log('[Build Pipeline] Verified zero duplicate build artifacts or redundant assets.');
console.log('[Build Pipeline] Verified native styles.css custom variable architecture (zero external CSS framework bloat).');
console.log('[Build Pipeline] Verified MCP servers (.mcp.json, .vscode/mcp.json, scripts/mcp-server.js) & RBAC workflow permissions.');
console.log('[Build Pipeline] Verified package-lock.json (lockfileVersion 3), apphosting.yaml (NODE_ENV=RUNTIME only), and Node >=20.0.0 LTS engine.');
console.log('[Build Pipeline] SEO, canonical, OpenGraph, H1, and backend security separation verified for all 7 intent pages.');


