# Springboards Design System Translation Plan

This document defines how visual styles, components, layouts, and Google integrations translate into code across `springboardsfcd.org`.

---

## 1. Architecture & Framework Strategy
- **Core Styling Engine (`/styles.css` + Custom Variables)**: To minimize rework and maintain the high performance of Firebase App Hosting deployment, the site continues using its native CSS architecture with custom variables (`:root` design tokens) rather than adopting a heavy external CSS framework.
- **Brand Precision & Zero Utility Bloat**: The `/styles.css` architecture ensures strict adherence to the Springboards brand (60-30-10 color hierarchy, `#E05B32` Safety Orange / `#C54E29` Deep Amber accents, `3px` button geometry, and fluid typography) without the payload bloat or build overhead of unused utility classes.
- **App Hosting Build Pipeline**: `scripts/build.js` hashes `/styles.css` into `/assets/styles.<hash>.css` for 1-year immutable caching (`Cache-Control: public, max-age=31536000, immutable`) and verifies zero external framework dependencies at build time.
- **Google Standards Integration**:
  - **Google Identity Services (GIS) & Material 3 Button Specs**: Scoped `.gsi-material-button` classes in `/styles.css` for Google Workspace OAuth (`workspace-sheets.js` and `/backoffice`).
  - **Self-Hosted Google Fonts (`Plus Jakarta Sans` Variable WOFF2)**: Served locally from `/assets/fonts/` with `font-display: swap` and metric-adjusted `'Plus Jakarta Sans Fallback'` for privacy compliance and zero layout shift (CLS).

---

## 2. Foundation: Global CSS Variables & Typography (`:root` in `/styles.css`)

All brand and domain colors are centralized exclusively in the global `:root` scope of `/styles.css` using semantic variable names (with zero duplicate `:root` overrides in HTML files).

### Semantic Color Tokens (60-30-10 Architecture)
| Semantic Role | Primary Semantic Token | Legacy / Domain Alias | Hex | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **60% Neutral Canvas** | `--color-surface-canvas` / `--color-surface-elevated` / `--color-surface-subtle` | `--bg-light` / `--bg-white` / `--admin-bg` / `--admin-card` | `#F8FAFC` / `#FFFFFF` / `#F1F5F9` | Public & backoffice backgrounds, elevated cards |
| **30% Brand Structural** | `--color-brand-primary` / `--color-brand-secondary` / `--color-brand-surface-dark` | `--primary-navy` / `--secondary-navy` / `--navy-surface` | `#0B192C` / `#1E3E62` / `#06101E` | Header, footer, hero overlays, structural anchors |
| **10% Primary Accent** | `--color-accent-primary` / `--color-accent-primary-hover` | `--accent-orange` / `--wizard-orange` | `#E05B32` (Safety Orange) / `#C54E29` (Deep Amber) | Primary CTA buttons, hover/active states, focus rings |
| **Semantic Status** | `--color-accent-success` / `--color-accent-warning` / `--color-accent-info` | `--accent-green` / `--accent-gold` / `--accent-blue` | `#059669` / `#D97706` / `#2563EB` | WIOA eligibility badges, credentials, trust notices |
| **Semantic Typography** | `--color-text-primary` / `--color-text-secondary` / `--color-text-muted` | `--text-dark` / `--text-body` / `--text-muted` | `#0F172A` / `#334155` / `#64748B` | Headings, body copy, metadata captions |

### Global Typography (`Plus Jakarta Sans`)
- **Global Enforcement**: `Plus Jakarta Sans` is enforced globally across `html`, `body`, all headings (`h1–h6` via `--font-heading`), body copy (`p, li, blockquote, dt, dd` via `--font-sans`), and interactive UI controls (`button, input, select, textarea, label, a, th, td` via `--font-ui`).
- **Primary Stack (`--font-family`)**: `'Plus Jakarta Sans', 'Plus Jakarta Sans Variable', 'Plus Jakarta Sans Fallback', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- **Monospace Stack (`--font-mono`)**: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`

---

## 3. Spacing System (8px Base Grid / 4px Sub-Grid)
All padding, margins, and grid gaps align to CSS custom properties:
- `--space-1`: `0.25rem` (`4px`) | `--space-2`: `0.5rem` (`8px`) | `--space-3`: `0.75rem` (`12px`) | `--space-4`: `1rem` (`16px`)
- `--space-6`: `1.5rem` (`24px`) | `--space-8`: `2rem` (`32px`) | `--space-12`: `3rem` (`48px`) | `--space-16`: `4rem` (`64px`)
- `--section-pad-y`: `clamp(3.5rem, 6vw, 5.5rem)`
- `--container-max`: `1240px` with horizontal fluid gutter `--container-pad-x: clamp(1.25rem, 4vw, 2rem)`

---

## 4. BEM Naming Convention (`[domain]-[block]__[element]--[modifier]`)
To prevent style leaks between the public landing pages, eligibility wizard, and executive backoffice, components enforce strict **Block Element Modifier (BEM)** naming prefixed by logical domain:
- **Global Primitives (`sb-`)**: `.sb-btn`, `.sb-btn__icon`, `.sb-btn__label`, `.sb-btn--primary`, `.sb-btn--secondary`, `.sb-btn--large`, `.sb-card`, `.sb-card__header`, `.sb-card__title`, `.sb-card__body`, `.sb-card__actions`, `.sb-card--dark`
- **Public Navigation & Hero (`nav-`, `hero-`)**: `.navbar-wrapper`, `.nav-left`, `.nav-logo-link`, `.hero-primary-cta`
- **Trade Training Domain (`train-`)**: `.train-card__block`, `.train-card__header`, `.train-card__title`, `.train-card__body`, `.train-card__actions`
- **WIOA & Transitional Jobs Wizard (`wizard-`, `prequal-`, `tj-`)**: `.wizard-card__block`, `.wizard-card__header`, `.wizard-card__title`, `.wizard-card__actions`, `.tj-pass-code`, `.tj-pass-badge`
- **Executive Backoffice & Workspace (`admin-`, `ws-`)**: `.admin-panel__block`, `.admin-panel__header`, `.admin-panel__title`, `.admin-panel__body`, `.admin-panel__actions`

---

## 5. Layouts & Responsive Behavior
The design system adapts seamlessly from desktop environments down to mobile devices using four core layout rules:
1. **Fluid Typography & Spacing (`clamp()`)**:
   - Uses CSS `clamp()` for organic viewport scaling without excessive media queries:
     - `--space-fluid` / `--text-2xl`: `clamp(1.5rem, 4vw, 2.4rem)`
     - `--section-pad-y`: `clamp(3.5rem, 6vw, 5.5rem)`
     - `--container-pad-x`: `clamp(1.25rem, 4vw, 2rem)`
2. **Auto-Fitting Grids (`repeat(auto-fit, minmax(220px, 1fr))`)**:
   - Modular card and item collections (`.sb-grid--auto-fit`, `.donation-tiers-grid`, `.admin-panel__grid--modular`) use `display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));` so items wrap naturally as the viewport narrows.
3. **Targeted Mobile Breakpoints (`600px` & `480px`)**:
   - `@media (max-width: 600px)`: Shifts multi-column split layouts (`.sb-layout--split`, `.form-grid-row`, `.admin-panel__split`, `.journey-detail-panel`) into single-column stacks.
   - `@media (max-width: 480px)`: Collapses modular grids to `1fr` and stacks action buttons to full width (`min-height: 48px` touch targets).
4. **Accessibility Motion (`@media (prefers-reduced-motion: reduce)`)**:
   - Automatically disables smooth scrolling (`scroll-behavior: auto !important`) and collapses transition/animation durations (`0.01ms !important`) for users with reduced-motion preferences.

---

## 6. Component Library & Reusable Patterns
1. **Card Architectures (`.sb-card`, `.train-card__block`, `.wizard-card__block`, `.admin-panel__block`, `.wizard-panel`, `.wizard-result-card`)**:
   - Standardized structural padding (`var(--space-fluid, clamp(1.5rem, 4vw, 2.4rem))`), `border-radius: var(--radius-md)` (`8px`), `1px solid var(--color-border-default)`, and `box-shadow: var(--shadow-sm)` so container elements look and feel identical across public pages, the eligibility wizard, and the backoffice.
2. **Action Elements (`.btn-cta`, `.sb-btn`, `.sb-btn--primary`, `.wizard-button`)**:
   - Unified primary button utility classes enforcing a minimum touch-target height of `min-height: 3.1rem`, consistent `border-radius: var(--radius-btn)` (`3px`), Safety Orange background (`var(--color-accent-primary)` `#E05B32`), and distinct hover/focus transitions (`var(--color-accent-primary-hover)` `#C54E29`, `transform: translateY(-2px)`).
3. **Form Modules (`.wizard-fieldset`, `.wizard-choice`, `.wizard-error`)**:
   - Standardized form inputs, labels, option cards, and validation error messages into reusable `.wizard-fieldset` and `.wizard-choice` blocks in `/styles.css` sharing identical spacing (`gap: 0.8rem`, `padding: 1rem`, `border-radius: var(--radius-md)`), checked states (`:has(input:checked)`), and high-contrast focus outlines (`outline: 3px solid var(--color-accent-primary); outline-offset: 3px;`).

---

## 7. MCP & AI Tooling Workflow Integration (`.mcp.json` & `scripts/mcp-server.js`)

Model Context Protocol (MCP) servers and AI tools are integrated into both local development (`.mcp.json`, `.vscode/mcp.json`) and the Executive Backoffice API (`/api/backoffice/mcp/status`, `/api/backoffice/mcp/execute`):

1. **Configured MCP Servers**:
   - **`springboards-design-content-mcp` (`node scripts/mcp-server.js`)**: Custom JSON-RPC 2.0 MCP server providing design-system token inspection, compliance auditing, BEM component scaffolding, page structure auditing, and 4-stage content workflow management.
   - **`io.github.ChromeDevTools/chrome-devtools-mcp`**: Live DOM inspection, computed CSS token verification, responsive viewport testing (`600px` and `480px`), and Core Web Vitals checks.
   - **`firebase-mcp` (`firebase-tools experimental:mcp`)**: Firestore security rules auditing (`firestore.rules`), collection schema validation, and Firebase App Hosting configuration checks.

2. **Supported MCP Tools**:
   - `design_system_inspect_tokens`: Reads `:root` CSS custom properties in `/styles.css` by category (`brand`, `accent`, `surface`, `text`, `font`, `space`, `radius`).
   - `design_system_audit_compliance`: Verifies zero external CSS frameworks, `#E05B32` / `#C54E29` accents, `Plus Jakarta Sans` variable WOFF2 with `font-display: swap`, `clamp()`, `repeat(auto-fit, minmax(220px, 1fr))`, `600px`/`480px` breakpoints, `prefers-reduced-motion: reduce`, `min-height: 3.1rem` buttons, `var(--radius-md)` cards, and `.wizard-fieldset` / `.wizard-choice` modules.
   - `pages_list_and_inspect`: Audits all 7 site pages (`index.html`, `train.html`, `eligibility.html`, `volunteer.html`, `partner.html`, `donate.html`, `backoffice.html`) for SEO tags, font preloads, BEM class usage, and zero duplicate `:root` blocks.
   - `pages_scaffold_component`: Generates compliant HTML snippets using domain-prefixed BEM classes (`sb-card`, `train-card__block`, `wizard-card__block`, `admin-panel__block`, `wizard-fieldset`, `sb-btn--primary`, `sb-grid--auto-fit`).
   - `content_workflow_manage`: Lists, creates, or advances 4-stage publishing workflow requests (`stage_1_draft` -> `stage_2_domain_compliance_review` -> `stage_3_executive_board_approval` -> `stage_4_published`) with WIOA/ETPL claim validation.

3. **Capabilities & RBAC Permission Matrix**:
   - `mcp:design_system`: Restricted to `role_designer_developer_publisher` (Marilynn Ward).
   - `mcp:page_editor`: Restricted to `role_designer_developer_publisher` (Marilynn Ward) and `role_executive_content_approver` (Marvin Thompson).
   - `mcp:content_workflow`: Enabled for all 9 board/leadership roles according to their stage gate permissions (`workflow:submit_draft`, `workflow:review_compliance`, `workflow:approve_executive`, `workflow:publish`).
   - `mcp:audit_read`: Read-only design-system and page compliance auditing available across all authenticated roles.


