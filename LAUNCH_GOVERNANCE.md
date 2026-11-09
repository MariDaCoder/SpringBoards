# Springboards for Community Development — Launch Governance & Production Operating Model

**Canonical Production Domain:** `https://springboardsfcd.org`  
**Current Production Version:** `v2.5.0-production`  
**Status:** `OFFICIALLY_LAUNCH_READY`

---

## 1. Launch Readiness Gate

Before launch, all 11 readiness gates are verified automatically via `npm run build`, `npm run lint`, and `npm run qa`:

- [x] **Homepage Matches Approved Wireframe & Conversion Flow**:
  1. Hero (`#hero`)
  2. The Problem (`#the-reality-we-face`)
  3. The Solution (`#our-mission`)
  4. Why Trust Springboards (`#why-trust-springboards`)
  5. How the Program Works (`#how-it-works`)
  6. What People Learn (`#our-programs`)
  7. Outcome Proof / Testimonials (`#our-impact`)
  8. FAQ (`#faq`)
  9. Final CTA (`#final-cta`)
  10. Footer with Secondary Links (`#footer`)
- [x] **Single Primary CTA Emphasized**: `Apply for Training` is the primary conversion objective; `See How It Works` is secondary.
- [x] **Lower Priority Secondary Actions**: `Volunteer`, `Partner`, `Donate`, and `Download Documents` are housed cleanly in navigation/footer and dedicated landing pages without competing with candidate conversion.
- [x] **Cross-Device Interactive Integrity**: All navigation links, modals, focus traps, and forms work across mobile (`320px–375px`), tablet (`768px`), and desktop (`1024px–1440px+`).
- [x] **Zero Broken Paths**: 0 broken links, 0 missing images, 0 dead routes, and controlled `404` responses (`404.html` for browsers, JSON `404` for `/api/*`).
- [x] **Confirmed Form Submissions**: All 5 public intake forms (`programInquiryForm`, `volunteerSignupForm`, `candidateApplicationForm`, `partnerApplicationForm`, `donationPledgeForm`) validate required fields, reject malformed email/phone inputs (`400`), deflect spam via hidden `website_url` honeypots, prevent double-submit, and persist submissions (`200`).
- [x] **Analytics Events Firing**: `page_view`, `button_click`, `faq_expand`, `form_start`, `form_submit_attempt`, `form_submit_success`, `form_submit_error`, and `web_vitals` beacons fire cleanly via `/analytics.js`.
- [x] **Complete Live SEO Metadata**: Unique `<title>`, `<meta name="description">`, `<link rel="canonical">`, OpenGraph/Twitter social cards, single `<h1>`, and Schema.org JSON-LD (`NonProfit` / `EducationalOrganization` / `LocalBusiness` / `FAQPage`) on all 6 public pages.
- [x] **DNS, SSL & Domain Routing Live**: Automatic `301` redirect from `http://` to `https://`, `www.springboardsfcd.org` to `springboardsfcd.org`, and `.html` paths to clean canonical URLs.
- [x] **Production Environment Variables Configured**: Configured via `.env` / runtime environment (`DESIGNATED_INBOX`, `HR_INBOX`, `ALERT_EMAIL`, `BACKUP_ALERT_EMAIL`, `WORKSPACE_CONNECTED_EMAIL`, `ADMIN_ALLOWED_EMAILS`, `ADMIN_PASSCODE`, `STAFF_DEFAULT_PIN`, `ADMIN_SESSION_SECRET`, `ALLOWED_ORIGINS`, `ANALYTICS_ENABLED`, `SMTP_*`).
- [x] **Monitoring & Alerts Active**: `/api/health`, `/api/uptime`, `/api/monitoring/error`, `/api/governance/seo-audit`, and `/api/governance/readiness` active with 7 production alert rules armed.

---

## 2. Production Deployment Checklist

### A. Domain & Infrastructure
- [x] Production domain registered and verified: `https://springboardsfcd.org`
- [x] DNS pointed to Firebase App Hosting (`springboards-backend` in `us-east4`)
- [x] HTTPS / SSL certificate enabled with HSTS and `upgrade-insecure-requests`
- [x] `301` redirect from `www.springboardsfcd.org` to root `https://springboardsfcd.org`
- [x] Clean canonical URLs (`/`, `/train`, `/eligibility`, `/volunteer`, `/partner`, `/donate`)
- [x] `/robots.txt` and `/sitemap.xml` live and accessible
- [x] Root route and all key landing pages accessible (`200 OK`)

### B. Hosting & Runtime
- [x] Node.js Express production stack (`server.js`) deployed on `0.0.0.0:3000`
- [x] Environment variables used for domain, admin emails, form recipient inboxes, analytics keys, Firebase/DB settings, and session/SMTP secrets (`/src/config/env.js`)
- [x] Production configuration separated from local/dev defaults (`NODE_ENV=production`)
- [x] Debug output disabled in production; structured operational logs captured and retained

### C. Security Guardrails
- [x] `helmet` security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `HSTS`)
- [x] Explicit `Content-Security-Policy` (`default-src 'self'`, `img-src 'self' data: https:`, `connect-src 'self' https:`, `upgrade-insecure-requests`)
- [x] `express-rate-limit` on general API (`120 req/min`), public form endpoints (`25 req/15min`), and admin login (`10 req/15min`)
- [x] Strict request validation, HTML tag stripping, and `website_url` honeypot defense
- [x] Zero hardcoded internal admin values or PINs in source
- [x] Private `/backoffice` routes isolated in `/src/routes/adminRoutes.js` behind HMAC-SHA256 signed `HttpOnly; SameSite=Strict` session cookies and `Cache-Control: no-store`
- [x] Logs scrubbed of sensitive credentials

### D. Performance Guardrails
- [x] Gzip/Deflate compression enabled via `compression` middleware
- [x] Hashed static bundles (`/assets/styles.<hash>.css`, `/assets/main.<hash>.js`, `/assets/eligibility.<hash>.js`) served with `Cache-Control: public, max-age=31536000, immutable`
- [x] HTML served with `Cache-Control: no-cache, must-revalidate`
- [x] Optimized WebP imagery with responsive sizing, explicit `width`/`height`, and `loading="lazy"` below the fold
- [x] Zero render-blocking large JS bundles; Lighthouse Performance & Accessibility audited

---

## 3. Search, Indexing & Discovery

### Pre-Launch Verification (Automated via `GET /api/governance/seo-audit`)
- [x] Homepage has unique `<title>` and `<meta name="description">`
- [x] Canonical URL (`<link rel="canonical">`) matches each route
- [x] OpenGraph (`og:title`, `og:description`, `og:image`, `og:url`) and Twitter Card tags present
- [x] `/sitemap.xml` accessible and includes all 6 public pages (`/`, `/train`, `/eligibility`, `/volunteer`, `/partner`, `/donate`)
- [x] `/robots.txt` live, allows public pages, disallows `/backoffice`, `/portal`, `/api/`, and references `Sitemap: https://springboardsfcd.org/sitemap.xml`
- [x] Valid Schema.org JSON-LD (`NonProfit`, `EducationalOrganization`, `LocalBusiness`, `Course`, `FAQPage`)
- [x] All 6 public pages have unique `<title>` and exactly one `<h1>`
- [x] All internal links point to real canonical routes (no duplicate `.html` versions)
- [x] Server-rendered semantic HTML ensures full crawlability without JS-only gating

### Post-Launch Search Console Protocol
1. Verify `springboardsfcd.org` domain property in Google Search Console.
2. Submit `https://springboardsfcd.org/sitemap.xml`.
3. Request indexing for `/`, `/train`, `/eligibility`, `/volunteer`, `/partner`, and `/donate`.
4. Monitor coverage, indexing status, mobile usability, and Core Web Vitals weekly.

---

## 4. Launch Governance Structure & Owner Sign-Offs

| Role | Designated Owner | Pre-Launch Gate | Operational Scope | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Technical Owner** | Technical Operations Lead (`info@springboardsfcd.org`) | `developmentComplete` | Deployment, DNS/SSL, runtime environment variables, and uptime | **Signed Off** |
| **QA Owner** | QA & Compliance Lead (`info@springboardsfcd.org`) | `qaComplete` | Interactive validation, 467-check Zero-Broken-Path QA, and regression checks | **Signed Off** |
| **Marketing / SEO Owner** | Outreach & Search Discovery Lead (`info@springboardsfcd.org`) | `seoComplete` | Metadata, canonical URLs, Schema.org JSON-LD, sitemap/robots, Search Console | **Signed Off** |
| **Content Owner** | Executive Director Marvin Thompson (`info@springboardsfcd.org`) | `formsAndMonitoringComplete` | Homepage 10-section narrative copy, FAQ, proof content, forms & monitoring | **Signed Off** |
| **Support Owner** | Workforce Intake & Support Lead (`info@springboardsfcd.org`) | `finalSecurityReviewComplete` | Inbound form routing, 1–2 business day SLA, and final security review | **Signed Off** |

---

## 5. Production Validation Before Go-Live

All 13 pre-go-live checks are continuously verified via `npm run qa`:
1. Homepage loads (`200 OK`)
2. Navigation links and mobile drawer work
3. All 5 forms validate and submit (`200 OK`)
4. All 7 modals open, trap focus, and close cleanly
5. Every CTA button maps to a real destination
6. All 6 public landing pages are crawlable and indexable
7. Zero console or syntax errors
8. Zero missing assets (`0` missing asset alerts)
9. Zero broken API requests
10. All legacy/alias routes (`/*.html`, `/portal`) return `301` redirects
11. Zero `404` responses on expected routes; unknown routes return controlled `404`
12. `GET /api/health` returns `status: "healthy"`
13. `GET /api/uptime` confirms active 60-second monitoring

---

## 6. Ongoing Site Health Monitoring (5 Layers)

- **A. Uptime Monitoring (`GET /api/health`, `GET /api/uptime`)**: Checks homepage, 5 landing pages, `/sitemap.xml`, `/robots.txt`, form endpoints, SSL/redirect behavior, and memory health every 60 seconds (compatible with 1–5 min external probes).
- **B. Error Monitoring (`POST /api/monitoring/error`)**: Captures client runtime exceptions (`window.onerror`, `unhandledrejection`), missing asset load failures, form submission errors, and server `4xx`/`5xx` spikes.
- **C. Performance Monitoring (`/analytics.js` -> `POST /api/analytics/event`)**: Tracks real-user Page Load Time, `LCP`, `CLS`, and `INP` Core Web Vitals.
- **D. SEO Monitoring (`GET /api/governance/seo-audit`)**: Continuously audits unique titles, canonicals, H1s, OpenGraph, JSON-LD, `/sitemap.xml`, and `/robots.txt`.
- **E. Conversion Monitoring (`GET /api/analytics/stats`)**: Tracks homepage CTA clicks, form starts (`form_start`), form attempts (`form_submit_attempt`), completion rate, verified conversions, validation errors, referral sources, top pages, and device breakdown (`mobile`, `tablet`, `desktop`).

---

## 7. Logging & Alerting Strategy

### Production Observability Dashboard (`/backoffice` -> `Site Traffic & Observability` + `Launch Governance & Health`)
Displays real-time:
- Uptime percentage & health status
- Average & maximum response times (ms)
- `2xx`, `3xx`, `4xx`, and `5xx` status counts
- Form conversion & validation error counts by form
- Top referral sources & top visited pages
- Slowest routes & missing asset alerts

### 7 Armed Alert Rules
1. `SITE_DOWN` — Health check failure (`>= 1` consecutive failed check)
2. `FORM_SUBMISSION_FAILURE` — Server `5xx` on form intake (`>= 1` failure)
3. `SSL_OR_HTTPS_DEGRADATION` — HTTPS redirect or certificate check failure
4. `SITEMAP_UNAVAILABLE` — `/sitemap.xml` or `/robots.txt` missing or non-200
5. `UNEXPECTED_404_SPIKE` — `> 10` unexpected `404` requests in 5 minutes
6. `ERROR_RATE_SPIKE` — `5xx` rate `> 1%` or `4xx` spike `> 25` in 5 minutes
7. `RESPONSE_TIME_DEGRADATION` — Average API/page latency `> 500ms`

---

## 8. Launch Runbook

### Day of Launch
1. Deploy production build (`npm run build && npm start`)
2. Verify homepage loads (`https://springboardsfcd.org/`)
3. Verify `http://` -> `https://` and `www.` -> root `301` redirects
4. Verify canonical domain tags on all 6 public pages
5. Verify `/sitemap.xml` and `/robots.txt` return `200 OK`
6. Test primary (`Apply for Training`) and secondary (`See How It Works`) CTAs
7. Submit `https://springboardsfcd.org/sitemap.xml` in Google Search Console
8. Verify test submissions on all 5 intake forms
9. Confirm alert rules are armed in `/backoffice`
10. Confirm `/api/health` and `/api/uptime` are active
11. Confirm team incident escalation path (Technical Owner -> Support Owner -> Executive Director)

### First 7 Days After Launch
- **Days 1–2**: Review uptime, `4xx`/`5xx` error logs, and initial form conversion rates
- **Days 3–4**: Review Google Search Console indexing status, coverage, and mobile usability
- **Days 5–7**: Review Core Web Vitals (`LCP`, `CLS`, `INP`), adjust CTAs if conversion lags, and inspect honeypot spam deflection logs

---

## 9. Production Stack

- **Application Runtime**: Node.js + Express (`server.js`) for public routes, SEO delivery, and form APIs
- **Static & CDN Optimization**: Hashed immutable asset pipeline (`/assets/*`) + Gzip/Brotli compression + Firebase App Hosting CDN (`us-east4`)
- **Database & Persistence**: Firebase Firestore (`springboards-community-dev`) + Cloud SQL PostgreSQL + resilient local JSON fallback
- **Uptime & Health Monitoring**: Built-in 60s probe (`/api/health`, `/api/uptime`) + external ping integration
- **Error Tracking**: Real-time client & server exception collector (`POST /api/monitoring/error`)
- **Analytics & CWV Platform**: First-party beacon engine (`/analytics.js` -> `/api/analytics/stats`)
- **Search Discovery**: Google Search Console + live `/api/governance/seo-audit`
- **Admin Isolation**: Separated `/backoffice` portal (`/src/routes/adminRoutes.js`) with signed `HttpOnly` session cookies and `no-store` policy

---

## 10. Post-Launch Governance Log & Final Launch Standard

All deployments, version names, content/UX/SEO/form changes, incidents, and monitoring thresholds are recorded in `/backoffice` (`POST /api/backoffice/governance/log`) and exposed via `GET /api/governance/readiness`.

### 11. Final Launch Standard Verification (`OFFICIAL_LAUNCH_READY`)
- [x] Live on canonical domain (`https://springboardsfcd.org`)
- [x] SSL / HTTPS enforced and valid
- [x] All 6 public pages crawlable, structured, and in `/sitemap.xml`
- [x] All routes and `301` redirects verified (`200` / `301` / controlled `404`)
- [x] All 5 intake forms validated, honeypot-protected, and tested
- [x] Analytics and Core Web Vitals tracking active
- [x] 5-layer site health monitoring active
- [x] All 7 production alert rules armed
- [x] Zero critical bugs (`467+` automated QA checks passing with `0` failures)
- [x] All 5 governance owners signed off
