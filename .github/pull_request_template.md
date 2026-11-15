## Summary of Changes
<!-- Describe the custom HTML, CSS, JavaScript, CMS Collection, or Tag Management changes in this PR -->

## Controlled Repository & Environment Target
- **Source Branch**: `feature/*` or `fix/*` → merging into `main`
- **Development Host**: `https://ais-dev-qnd7dwpxy5lvvqlhyhakyp-11235862349.us-west2.run.app`
- **Staging Channel (Firebase Hosting)**: `https://springboards-community-dev--staging.web.app` (`https://ais-pre-qnd7dwpxy5lvvqlhyhakyp-11235862349.us-west2.run.app`)
- **Production CDN Host (Firebase Hosting)**: `https://springboardsfcd.org` (`springboards-community-dev`)

## Mandatory 4-Stage Governance & Review Checklist
- [ ] **1. Custom Code Ownership & Versioning (`@MariDaCoder`)**: All CSS changes are consolidated in `/styles.css` (zero inline `<style>` tags), custom JS updates in `/components.js`, `/main.js`, `/eligibility.js`, and `/analytics.js` pass `npm run lint` and `npm run build`, and SHA-256 integrity hashes are updated in `/assets/cms/custom-code-registry.json`.
- [ ] **2. Staging Host Verification**: Custom code files pushed to GitHub `main` have been verified on the Firebase Hosting staging environment (`cleanUrls: true`, `Access-Control-Allow-Origin: *`, and cache headers intact).
- [ ] **3. WIOA & Bilingual Localization Compliance (`Giselle Campos` / `Shamia Morgan`)**: WIOA Activity Code 220 (390-hour cap), Section 188 Equal Opportunity disclosures, and `en-US`/`es-US` translations are accurate.
- [ ] **4. Tag Management System (TMS) Governance (`Marvin Thompson` / `Marilynn Ward`)**: Any new analytics or marketing tags are registered in `window.SpringboardsTMS` (`GTM-SBFCD26` / `window.dataLayer`), respect Consent Mode v2, and are suppressed on protected routes (`/resources/backoffice` and `/utility/password`).
