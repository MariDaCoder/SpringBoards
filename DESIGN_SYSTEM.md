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

## 6. Reusable Design Patterns
1. **Primary Action Buttons (`.btn-cta`)**: `background: var(--accent-orange)` (`#E05B32`), `:hover` / `:focus-visible` `background: var(--accent-orange-hover)` (`#C54E29`), `border-radius: var(--radius-btn)` (`3px`), `min-height: 48px`, `font-weight: 700`.
2. **Elevated Content Cards (`.train-card`, `.pathway-card`, `.admin-card`)**: `background: var(--bg-card)`, `1px solid var(--border-color)`, `border-radius: var(--radius-lg)`, `box-shadow: var(--shadow-sm)`.
3. **Accessible Form Controls (`.form-input`, `.form-select`)**: Explicit `<label>` associations, `1px solid var(--border-color)`, high-contrast focus ring (`outline: 3px solid var(--accent-orange)`), inline validation states.
4. **Intent Page Shell**: Shared sticky header, skip-to-content link (`.skip-link`), structured JSON-LD schema, and unified footer across `/`, `/train`, `/eligibility`, `/volunteer`, `/partner`, and `/donate`.
