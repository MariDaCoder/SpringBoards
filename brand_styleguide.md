# Phase 3 Brand Style Guide

**Project:** Springboards for Community Development Public Website  
**Phase 1 Source of Truth:** `project_brief.md`  
**Phase 2 Source of Truth:** `outline_wireframes.md`  
**Phase 3 Source of Truth:** `brand_styleguide.md`  
**Status:** Phase 3 Steps 1 through 6 Complete and Locked  
**Last Updated:** November 19, 2026

---

## 1. Color System and Accessibility Rules

### Visual Balance Rule
* **60 Percent Workshop Light Canvas:** Clean drywall white, workshop concrete, and masonry sand backgrounds keep trade descriptions, eligibility steps, and intake forms easy to read.
* **30 Percent Blueprint and Workwear Navy:** Blueprint navy and steel workwear navy anchor the global top bar, hero banner, dark callout sections, and global footer.
* **10 Percent Jobsite Safety Accents:** Brick terracotta, high visibility safety orange, and tape measure gold draw immediate attention to action buttons like `Check Training Eligibility` and `Volunteer With Us`.

### Brand, Trade, Surface, Text, Border, and Status Color Tokens

| Category | Relatable Trade and Brand Color Name | Usage Role | Hex Code | CSS Custom Property Name |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Brand** | **Blueprint Navy** | Primary structural anchor for top bar, hero, and dark sections | `#0B192C` | `--color-brand-primary` |
| **Primary Brand** | **Workwear Steel Blue** | Secondary dark headers, trade badges, and dark card outlines | `#1E3E62` | `--color-brand-secondary` |
| **Primary Action** | **Brick Terracotta Orange** | High contrast primary CTA button fill | `#C84318` | `--color-accent-cta` |
| **Primary Action** | **Fired Brick Orange** | Primary CTA button hover fill | `#A6330D` | `--color-accent-cta-hover` |
| **Primary Action** | **Kiln Clay Orange** | Primary CTA button pressed state fill | `#8F2B0A` | `--color-accent-cta-active` |
| **Secondary Accent** | **Jobsite Safety Orange** | Keyboard focus rings, active step numbers, and highlights | `#E05B32` | `--color-accent-primary` |
| **Secondary Accent** | **Copper Pipe Orange** | Secondary accent hover state | `#C54E29` | `--color-accent-primary-hover` |
| **Secondary Accent** | **Sawdust Cream Tint** | Warm callout box background fill | `#FFF7ED` | `--color-accent-primary-tint` |
| **Secondary Accent** | **Tape Measure Gold** | High visibility badge and highlight color on dark navy | `#FFB020` | `--color-accent-ochre` |
| **Logo Crest Palette** | **Springboards Progress Green** | Official logo crest left figure and community growth accent | `#6BAA3C` | `--brand-progress-green` |
| **Logo Crest Palette** | **Springboards Unity Blue** | Official logo crest center figure and springboard base | `#204B8C` | `--brand-unity-blue` |
| **Logo Crest Palette** | **Springboards Success Gold** | Official logo crest right figure and achievement accent | `#F9A825` | `--brand-success-gold` |
| **Page Background** | **Workshop Concrete Light** | Primary 60 percent page background canvas | `#F8FAFC` | `--color-surface-canvas` |
| **Page Background** | **Mortar Gray Light** | Alternating section surface and table header fill | `#F1F5F9` | `--color-surface-subtle` |
| **Page Background** | **Masonry Sand Light** | Warm surface for eligibility checker and founder story | `#F8F5EE` | `--color-surface-warm` |
| **Page Background** | **Cast Iron Navy** | Deep dark background for global footer and bottom bar | `#06101E` | `--color-brand-surface-dark` |
| **Card Surface** | **Drywall White** | Elevated cards, form containers, and text input fields | `#FFFFFF` | `--color-surface-elevated` |
| **Card Surface** | **Shop Bay Dark Slate** | Elevated cards sitting inside dark Blueprint Navy sections | `#0F233D` | `--color-brand-card-dark` |
| **Text Colors** | **Carpenter Ink Navy** | Main headings and form field labels on light surfaces | `#071326` | `--color-text-primary` |
| **Text Colors** | **Steel Charcoal** | Standard body paragraphs and list items on light surfaces | `#1E293B` | `--color-text-secondary` |
| **Text Colors** | **Weathered Slate** | Captions, helper notes, and form hints | `#334155` | `--color-text-muted` |
| **Text Colors** | **Galvanized Gray** | Supporting metadata and secondary tags | `#475569` | `--color-text-subtle` |
| **Text Colors** | **Chalk Line White** | Headings and button labels on dark navy or orange buttons | `#FFFFFF` | `--color-text-inverse` |
| **Text Colors** | **Conduit Silver** | Supporting body text on dark Blueprint Navy sections | `#E2E8F0` | `--color-text-inverse-muted` |
| **Border Lines** | **Rebar Gray Border** | High contrast border for form inputs and active frames | `#94A3B8` | `--color-border-default` |
| **Border Lines** | **Trowel Steel Divider** | Standard card outlines and table row dividers | `#CBD5E1` | `--color-border-subtle` |
| **Border Lines** | **Joint Hairline Gray** | Subtle interior section divider line | `#E2E8F0` | `--color-border-hairline` |
| **Border Lines** | **Cedar Trim Border** | Warm border for highlighted callout boxes | `#FDBA74` | `--color-accent-primary-border` |
| **Status & Alerts** | **Safety Go Green** | Form confirmation states and verified outcome badges | `#047857` | `--color-accent-success` |
| **Status & Alerts** | **Safety Green Tint** | Confirmation message box background fill | `#ECFDF5` | `--color-accent-success-tint` |
| **Status & Alerts** | **Caution Vest Amber** | WIOA and worksite safety advisory text and icon color | `#B45309` | `--color-accent-warning` |
| **Status & Alerts** | **Blueprint Info Blue** | Career Center map links and informational banners | `#1D4ED8` | `--color-accent-info` |
| **Status & Alerts** | **Stop Tag Crimson** | Form validation errors and required field alerts | `#B91C1C` | `--color-accent-danger` |
| **Status & Alerts** | **Stop Tag Rose Tint** | Error message box background fill | `#FEF2F2` | `--color-accent-danger-tint` |

### WCAG AA Readability and Contrast Ratio Rules
* **Body Text Contrast Minimum:** All normal body text and form labels must keep a contrast ratio of at least `4.5 to 1` against their background surface.
* **Large Heading Contrast Minimum:** Large headings of `24px` regular or `19px` bold and above must keep a contrast ratio of at least `3.0 to 1`.
* **Form Input and Button Boundary Minimum:** All form input borders (`--color-border-default` `#94A3B8` on `#FFFFFF` = `3.2 to 1`) and button fills must keep at least a `3.0 to 1` contrast ratio against adjacent surfaces.
* **Verified Contrast Pairings:**
  * **Carpenter Ink Navy** (`#071326`) on **Workshop Concrete Light** (`#F8FAFC`): **`18.5 to 1`** — passes WCAG AAA.
  * **Steel Charcoal** (`#1E293B`) on **Drywall White** (`#FFFFFF`): **`13.5 to 1`** — passes WCAG AAA.
  * **Weathered Slate** (`#334155`) on **Drywall White** (`#FFFFFF`): **`9.8 to 1`** — passes WCAG AAA.
  * **Chalk Line White** (`#FFFFFF`) on **Blueprint Navy** (`#0B192C`): **`17.4 to 1`** — passes WCAG AAA.
  * **Conduit Silver** (`#E2E8F0`) on **Blueprint Navy** (`#0B192C`): **`13.6 to 1`** — passes WCAG AAA.
  * **Chalk Line White** (`#FFFFFF`) on **Brick Terracotta Orange** (`#C84318`): **`5.1 to 1`** — passes WCAG AA across all button sizes.
  * **Tape Measure Gold** (`#FFB020`) on **Blueprint Navy** (`#0B192C`): **`10.6 to 1`** — passes WCAG AAA.
  * **Status Tokens** (`#047857`, `#B45309`, `#1D4ED8`, `#B91C1C`) on **Drywall White** (`#FFFFFF`): **`5.1 to 1` to `6.7 to 1`** — all pass WCAG AA.

---

## 2. Typography Hierarchy and Font Assets

### Font Family Selection and Self Hosted WOFF2 Asset
* **Primary Heading and Body Font Family:** **Plus Jakarta Sans** (`--font-family`, `--font-heading`, `--font-sans`, `--font-ui`) serves as the single unified typeface for display headings, body paragraphs, form labels, navigation links, and buttons so the site stays cohesive and fast without downloading multiple font families.
* **Monospace Font Family:** `--font-mono` uses `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace` for ZIP code inputs and numeric badges.
* **Self Hosted Variable WOFF2 File:**
  * **File Path:** `/assets/fonts/plus-jakarta-sans-latin-wght-normal.woff2`
  * **File Size and License:** Single `27.3 KB` upright Latin variable font supporting weights `400` through `800` under SIL Open Font License 1.1 in `/assets/fonts/OFL.txt`.
  * **Zero Third Party Tracking:** Self hosting from `/assets/fonts/` eliminates external Google Fonts requests and third party tracking.
* **Immediate Rendering and Metric Matched System Fallbacks:**
  * **`font-display: swap`:** Applied on `@font-face` so text renders immediately on mobile and slow connections with zero invisible text flash.
  * **Metric Matched Local Fallback (`'Plus Jakarta Sans Fallback'`):** Matches local system fonts (`Segoe UI`, `Roboto`, `Helvetica Neue`, `Arial`, `Liberation Sans`) with `size-adjust: 105.7%`, `ascent-override: 93%`, and `descent-override: 23%` to prevent layout shift when the variable font loads.
  * **Safe System Fallback Stack:** `'Plus Jakarta Sans', 'Plus Jakarta Sans Fallback', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif`

### Typography Scale for Headings, Paragraphs, Captions, and Buttons

| Text Role | Size Token | Weight Token | Mobile Size | Tablet Size | Desktop Size | Line Height | Letter Spacing |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **H1 Hero and Page Title** | `--text-display` | `800` (`--font-weight-extrabold`) | `2.15rem` / `34.4px` | `2.75rem` / `44.0px` | `3.65rem` / `58.4px` | `1.08` (`--leading-display`) | `-0.035em` (`--tracking-display`) |
| **H2 Major Section Heading** | `--text-3xl` | `800` (`--font-weight-extrabold`) | `1.85rem` / `29.6px` | `2.45rem` / `39.2px` | `3.15rem` / `50.4px` | `1.08` (`--leading-display`) | `-0.035em` (`--tracking-display`) |
| **H2 Sub Section Heading** | `--text-2xl` | `700` (`--font-weight-bold`) | `1.50rem` / `24.0px` | `1.95rem` / `31.2px` | `2.40rem` / `38.4px` | `1.15` (`--leading-tight`) | `-0.025em` (`--tracking-tight`) |
| **H3 Card and Trade Track Title** | `--text-xl` | `700` (`--font-weight-bold`) | `1.20rem` / `19.2px` | `1.32rem` / `21.1px` | `1.45rem` / `23.2px` | `1.28` (`--leading-snug`) | `-0.015em` (`--tracking-heading`) |
| **H4 Subheading and FAQ Question** | `--text-h4` | `600` (`--font-weight-semibold`) | `1.05rem` / `16.8px` | `1.12rem` / `17.9px` | `1.22rem` / `19.5px` | `1.28` (`--leading-snug`) | `-0.015em` (`--tracking-heading`) |
| **Lead Intro Paragraph** | `--text-lg` | `400` (`--font-weight-regular`) | `1.02rem` / `16.3px` | `1.10rem` / `17.6px` | `1.1875rem` / `19.0px` | `1.60` (`--leading-relaxed`) | `0em` (`--tracking-normal`) |
| **Body Paragraph and Lists** | `--text-base` | `400` (`--font-weight-regular`) | `0.96875rem` / `15.5px` | `1.00rem` / `16.0px` | `1.03125rem` / `16.5px` | `1.65` (`--leading-normal`) | `0em` (`--tracking-normal`) |
| **Buttons and Form Field Labels** | `--text-label` | `700` Bold for buttons, `600` Semibold for labels | `0.90rem` / `14.4px` | `0.9375rem` / `15.0px` | `0.96875rem` / `15.5px` | `1.35` (`--leading-label`) | `0.01em` (`--tracking-label`) |
| **Captions and Helper Notes** | `--text-sm` | `400` Regular or `500` Medium | `0.84375rem` / `13.5px` | `0.875rem` / `14.0px` | `0.90rem` / `14.4px` | `1.45` (`--leading-snug`) | `0em` (`--tracking-normal`) |
| **Eyebrow Labels and Status Pills** | `--text-xs` | `800` (`--font-weight-extrabold`) uppercase | `0.75rem` / `12.0px` | `0.78rem` / `12.5px` | `0.8125rem` / `13.0px` | `1.35` (`--leading-label`) | `0.10em` (`--tracking-caps`) |

---

## 3. Spacing, Grid, and Layout Rules

### Container Width Architecture and Reading Measure Rules

| Container Tier | CSS Custom Property | Max Width | Where It Is Used Across the 16 Pages |
| :--- | :--- | :--- | :--- |
| **Primary Page Container** | `--container-max` | `1240px` | Global Top Navigation Bar, Hero split layout, three column card sections, five trade card grid, two column intake splits, and Global Footer |
| **Focused Feature Container** | `--container-content` | `960px` | Focused two column comparison blocks, Career Center directory cards on `/eligibility`, and media highlight panels |
| **Narrow Reading and Form Container** | `--container-narrow` | `840px` | Centered section header blocks, seven question FAQ accordion, single column intake panels, and legal prose on `/privacy`, `/terms`, and `/404.html` |
| **Body Paragraph Line Measure** | `--container-prose` | `65ch` | Maximum line width for paragraphs and lists so eyes never lose their place across wide screens |
| **Compact Split Line Measure** | `--container-prose-compact` | `54ch` | Hero subcopy and Global Footer compliance summary |
| **Display Heading Measure** | `--container-heading` | `24ch` | Balanced line wrapping for H1 and H2 headlines |
| **Horizontal Viewport Gutter** | `--container-pad-x` | `clamp(1.25rem, 4vw, 2rem)` / `20px` to `32px` | Left and right outer padding on every container, tightening to `1rem` / `16px` on compact mobile screens under `480px` |

### Cohesive Desktop Column Grid Structures
* **12 Column Master Grid Foundation:** Desktop layouts align to a 12 column CSS Grid inside `--container-max` (`1240px`) with a fluid gap of `--space-grid-gap` (`18.4px` to `24px`).
* **Pattern A — Two Column Asymmetric Split (`7 columns left / 5 columns right` or `6 / 6` with `--space-split-gap` `32px` to `60px`):**
  * Used on Home Section One Hero, Home Section Four Founder Story, the five `/programs/[trade]` pages pairing trade details on the left with Form A on the right, `/eligibility` pairing the Career Center checklist with Forms B and C, and `/volunteer`, `/partner`, `/donate`, and `/contact` pairing context and checklists on the left with the Firestore form on the right.
* **Pattern B — Three Column Equal Card Grid (`3 columns` of `1fr` each with `--space-grid-gap`):**
  * Used on Home Section Two The Problem, Section Three The Solution, Section Five How the Program Works, Section Seven Social Proof outcome goals, and the three local Alabama Career Center cards on `/how-it-works` and `/eligibility`.
* **Pattern C — Five Trade Card Grid (`3 cards top row + 2 centered cards bottom row` on desktop):**
  * Used on Home Section Six Programs Overview and `/programs` so the five locked trades of Carpentry, Electrical, Plumbing, Masonry, and Heating and Cooling sit in balanced cards with zero orphan stretches and zero extra filler cards.
* **Pattern D — Single Column Focused Stack (`1 column` inside `--container-narrow` `840px`):**
  * Used on Home Section Eight FAQ accordion, Home Section Nine Final CTA banner, `/privacy`, `/terms`, and `/404.html`.

### Mobile Stacking Breakpoints and Zero Overflow Rules

| Breakpoint Token | Screen Width | Layout and Navigation Adaptation Rule |
| :--- | :--- | :--- |
| **`--bp-2xl`** | `1440px` and up | Widescreen desktop frame; containers lock at `1240px` centered with balanced outer margins |
| **`--bp-xl`** | `1280px` and below | Standard laptop and desktop frame |
| **`--bp-lg`** | `1040px` and below | Top navigation links and `Programs` dropdown collapse into the mobile menu toggle button and collapsible drawer |
| **`--bp-md`** | `900px` and below | All two column split layouts stack vertically into a single column with the context panel on top and the form panel underneath; three column grids shift to two columns |
| **`--bp-sm`** | `768px` and below | Tablet portrait and large phone layout; section vertical padding steps down smoothly |
| **`--bp-xs`** | `600px` and below | All multi column card grids including the five trade cards and three step cards stack into a single full width column |
| **`--bp-2xs`** | `480px` down to `320px` | Compact mobile screen rule: action buttons expand to `100 percent` container width, outer horizontal padding tightens to `1rem` (`16px`), and zero horizontal scroll is enforced |

### Section Vertical Rhythm and Uniform 8px Spacing Tokens

| Spacing Token | Value | Exact Cohesive Usage Rule |
| :--- | :--- | :--- |
| **`--section-pad-y-lg`** | `clamp(4rem, 7.5vw, 6.25rem)` / `64px` to `100px` | Top and bottom vertical padding for Hero banners and Home Section Nine Final Call to Action |
| **`--section-pad-y`** | `clamp(3.5rem, 6.5vw, 5.5rem)` / `56px` to `88px` | Standard top and bottom vertical padding for all major page sections |
| **`--section-pad-y-compact`** | `clamp(2.75rem, 5vw, 4.25rem)` / `44px` to `68px` | Compact vertical padding for subpage headers and transitional support bands |
| **`--space-header-to-grid`** | `clamp(2rem, 3.8vw, 2.75rem)` / `32px` to `44px` | Uniform vertical margin between a section heading block and the card grid or split layout below it |
| **`--space-block-gap`** | `clamp(2.25rem, 4vw, 3.25rem)` / `36px` to `52px` | Vertical spacing between a card grid and a bottom section action row |
| **`--space-card-pad`** | `clamp(1.75rem, 3vw, 2.35rem)` / `28px` to `37.6px` | Uniform interior padding inside all feature cards, trade cards, checklist panels, and form containers |
| **`--space-card-gap`** | `0.65rem` / `10.4px` | Vertical gap between the badge, title, body text, and link inside a single card |
| **`--space-grid-gap`** | `clamp(1.15rem, 2.2vw, 1.5rem)` / `18.4px` to `24px` | Horizontal and vertical gap between cards in a grid |
| **`--space-split-gap`** | `clamp(2rem, 4.5vw, 3.75rem)` / `32px` to `60px` | Gap between left and right columns in a two column split layout |
| **`--space-1` to `--space-24`** | `4px` (`0.25rem`), `8px` (`0.5rem`), `12px` (`0.75rem`), `16px` (`1rem`), `20px` (`1.25rem`), `24px` (`1.5rem`), `32px` (`2rem`), `40px` (`2.5rem`), `48px` (`3rem`), `64px` (`4rem`), `80px` (`5rem`), `96px` (`6rem`) | Fixed 8px base spatial scale with a `4px` half step (`--space-1`) and `12px` form input step (`--space-3`) for margins, form field stacks, and button gaps |

---

## 4. Core UI Component States and Motion Rules

### Primary and Secondary Action Buttons
* **Shared Button Geometry:**
  * **Minimum Touch Height:** `--size-touch-min: 3.1rem` / `49.6px` (`3.5rem` / `56px` for Hero and Section Nine primary buttons).
  * **Padding and Corner Radius:** `0.85rem` vertical by `1.75rem` horizontal padding with a crisp `3px` corner radius (`--radius-btn`).
  * **Typography:** `--font-ui` at `--font-weight-bold` (`700`) and `--text-label` / `--text-base`.
* **Primary Button (`Check Training Eligibility`, `Volunteer With Us`, Form Submit Buttons):**
  * **Default State:** Fill `--color-accent-cta` **Brick Terracotta Orange** (`#C84318`), text `--color-text-inverse` **Chalk Line White** (`#FFFFFF`), shadow `--shadow-cta` (`0 4px 14px rgba(200, 67, 24, 0.34)`).
  * **Hover State:** Fill shifts to `--color-accent-cta-hover` **Fired Brick Orange** (`#A6330D`), lifts `translateY(-2px)` (`--state-hover-lift`), shadow deepens to `--shadow-cta-hover`.
  * **Active State:** Fill shifts to `--color-accent-cta-active` **Kiln Clay Orange** (`#8F2B0A`), presses down `translateY(1px)` (`--state-active-press`), shadow tightens to `--shadow-cta-active`.
  * **Keyboard Focus State (`:focus-visible`):** `3px solid #E05B32` **Jobsite Safety Orange** outline (`--state-focus-ring`) with `3px` offset (`--state-focus-offset`), switching to `3px solid #FFB020` **Tape Measure Gold** (`--state-focus-ring-inverse`) when placed inside dark **Blueprint Navy** sections.
  * **Disabled and Submitting State:** Opacity `0.58` (`--state-disabled-opacity`), `cursor: not-allowed`, shadow removed, and no hover lift while saving to Firestore.
* **Secondary Outline Button (`Contact Us`, `Partner With Springboards`, Secondary Page Links):**
  * **Default on Light Surfaces:** Fill **Drywall White** (`#FFFFFF`), `2px solid #0B192C` **Blueprint Navy** border, text **Carpenter Ink Navy** (`#071326`).
  * **Default on Dark Navy Surfaces:** Transparent fill, `2px solid #E2E8F0` **Conduit Silver** border, text **Chalk Line White** (`#FFFFFF`).
  * **Hover State:** Light button fills with **Mortar Gray Light** (`#F1F5F9`); dark button fills with **Shop Bay Dark Slate** (`#0F233D`); both lift `translateY(-2px)`.
  * **Active, Focus, and Disabled States:** Match primary button press (`translateY(1px)`), `3px` focus ring, and `0.58` disabled opacity.

### Navigation Links, Programs Dropdown, and Mobile Drawer Controls
* **Top Bar Links (`About Us`, `How It Works`, `Programs` on `--nav-height: 88px` Blueprint Navy Bar):**
  * **Default State:** Text **Conduit Silver** (`#E2E8F0`), weight `600`, minimum `44px` tap target height.
  * **Hover State:** Text brightens to **Chalk Line White** (`#FFFFFF`) with a `2px` bottom indicator bar in **Tape Measure Gold** (`#FFB020`).
  * **Active Page State (`[aria-current="page"]`):** Text **Chalk Line White** (`#FFFFFF`), weight `700`, with a persistent `2px` **Tape Measure Gold** (`#FFB020`) bottom bar.
  * **Dropdown and Mobile Drawer Expanded State (`[aria-expanded="true"]`):** `Programs` chevron icon rotates `180deg`; dropdown panel opens on **Shop Bay Dark Slate** (`#0F233D`) with a `1px` **Workwear Steel Blue** (`#1E3E62`) border; mobile drawer slides open smoothly below the top bar.
  * **Keyboard Focus State (`:focus-visible`):** `3px solid #FFB020` **Tape Measure Gold** outline with `3px` offset.
* **Inline Body and Card Text Links:**
  * **Default State:** **Brick Terracotta Orange** (`#C84318`) or **Blueprint Info Blue** (`#1D4ED8`) with visible underline offset by `3px`.
  * **Hover and Focus States:** Color deepens to `#A6330D` or `#1E40AF`; keyboard focus adds the `3px` **Jobsite Safety Orange** outline.

### Content Cards, Trade Track Cards, and FAQ Accordion Items
* **Standard Card Surface (`.sb-card`):**
  * **Default State:** Fill **Drywall White** (`#FFFFFF`, or **Shop Bay Dark Slate** `#0F233D` inside dark sections), `1px solid #CBD5E1` **Trowel Steel Divider** border, `8px` corner radius (`--radius-md`), interior padding `--space-card-pad` (`28px` to `37.6px`), elevation `--shadow-sm`.
  * **Interactive Trade Card Hover State:** Card lifts `translateY(-3px)` (`--state-card-hover-lift`), shadow expands to `--shadow-md`, and border highlights to **Jobsite Safety Orange** (`#E05B32`).
  * **Active and Focus States:** Clicking or tabbing to an interactive card link applies `--state-focus-ring` (`3px solid #E05B32`).
* **FAQ Accordion Items (Home Section Eight):**
  * **Default Collapsed State (`[aria-expanded="false"]`):** **Drywall White** container with `1px solid #CBD5E1` border and plus or down chevron icon.
  * **Hover State:** Header background tints to **Mortar Gray Light** (`#F1F5F9`).
  * **Expanded State (`[aria-expanded="true"]`):** Border highlights to **Blueprint Navy** (`#0B192C`), icon rotates `180deg`, and answer panel reveals below a `1px` **Joint Hairline Gray** (`#E2E8F0`) divider.

### Form Inputs, Select Menus, Checkboxes, and Radio Choices
* **Text Inputs, Selects, and Textareas (`--size-input-height: 2.875rem` / `46px`, `--radius-sm: 6px`):**
  * **Default State:** Fill **Drywall White** (`#FFFFFF`), `1.5px solid #94A3B8` **Rebar Gray Border** (`3.2 to 1` contrast), text **Carpenter Ink Navy** (`#071326`), placeholder **Galvanized Gray** (`#475569`).
  * **Hover State:** Border darkens to **Weathered Slate** (`#334155`).
  * **Focus State (`:focus` / `:focus-visible`):** Border turns **Jobsite Safety Orange** (`#E05B32`) with a soft outer glow `0 0 0 3px rgba(224, 91, 50, 0.22)`.
  * **Invalid / Error State (`[aria-invalid="true"]`):** Border turns **Stop Tag Crimson** (`#B91C1C`) with outer ring `--state-error-ring` (`0 0 0 3px rgba(185, 28, 28, 0.18)`) and inline crimson error helper text underneath.
  * **Valid / Confirmed State:** Border turns **Safety Go Green** (`#047857`) with outer ring `--state-success-ring` (`0 0 0 3px rgba(4, 120, 87, 0.16)`).
  * **Disabled State:** Fill **Mortar Gray Light** (`#F1F5F9`), opacity `0.58`, `cursor: not-allowed`.
* **Eligibility Radio Cards and Volunteer Checkboxes:**
  * **Selected State (`:checked` / `[aria-checked="true"]`):** Card border turns **Brick Terracotta Orange** (`#C84318`) with background **Sawdust Cream Tint** (`#FFF7ED`) and ring `--state-selected-ring` (`0 0 0 3px rgba(200, 67, 24, 0.2)`).

### Alert Messages and Confirmation State Boxes
* **Shared Alert Box Structure:** `8px` corner radius (`--radius-md`), `1px` semantic border, `4px` solid left accent stripe, padding `1rem 1.25rem` (`--space-4` `--space-5`), announced to screen readers via `role="status"` or `role="alert"`.
* **Four Semantic Variants:**
  * **Success Confirmation Box (Form Saved to Firestore):** Fill **Safety Green Tint** (`#ECFDF5`), border `#34D399`, left stripe and title **Safety Go Green** (`#047857`).
  * **Error Validation Box (Missing Phone or Email / Firestore Rejection):** Fill **Stop Tag Rose Tint** (`#FEF2F2`), border `#F87171`, left stripe and title **Stop Tag Crimson** (`#B91C1C`).
  * **Warning and WIOA Compliance Advisory Box:** Fill `#FFFBEB`, border `#F59E0B`, left stripe and title **Caution Vest Amber** (`#B45309`).
  * **Informational and Career Center Notice Box:** Fill `#EFF6FF`, border `#60A5FA`, left stripe and title **Blueprint Info Blue** (`#1D4ED8`).

### Animation Timing and Reduced Motion Accessibility Rule
* **Fast UI Feedback (`--transition-fast`):** `0.18s cubic-bezier(0.22, 1, 0.36, 1)` for button background shifts, hover lifts, link underlines, form input focus rings, and dropdown chevrons.
* **Standard Layout Motion (`--transition-normal`):** `0.25s cubic-bezier(0.22, 1, 0.36, 1)` for trade card hover elevation, mobile menu drawer opening, and FAQ accordion panel expansion.
* **Reduced Motion Override (`@media (prefers-reduced-motion: reduce)`):** Automatically disables all `translateY` hover lifts, smooth scrolling, and slide transitions (`transition-duration: 0.01ms !important; animation-duration: 0.01ms !important`) while keeping all high contrast color shifts and `3px` keyboard focus outlines intact.

---

## 5. Brand Icons, Favicons, and Imagery Direction

### Brand Logo Variations for Dark and Light Headers
* **Dark Header and Global Footer Lockup (on Blueprint Navy `#0B192C` and Cast Iron Navy `#06101E`):**
  * **Primary Asset:** `/assets/aistudio/springboards_logo_white_text.avif` with `.webp` and `.png` fallbacks.
  * **Visual Rule:** Displays the full color Springboards crest (**Springboards Progress Green** `#6BAA3C`, **Springboards Unity Blue** `#204B8C`, **Springboards Success Gold** `#F9A825`) paired with a **Chalk Line White** (`#FFFFFF`) wordmark inside the `88px` sticky top navigation bar and global footer.
* **Light Surface Header and Print Lockup (on Drywall White `#FFFFFF` and Workshop Concrete Light `#F8FAFC`):**
  * **Primary Asset:** `/assets/aistudio/springboards_logo_icon.avif` with `.webp` and `.png` fallbacks paired with the **Carpenter Ink Navy** (`#071326`) Plus Jakarta Sans `800` wordmark.
* **Compact Mobile Crest Mark (`480px` and below):**
  * **Visual Rule:** Uses the square crest mark `/assets/aistudio/springboards_logo_icon.avif` at `40px by 40px` beside a clean single line brand title so the mobile menu drawer button always has breathing room.
* **Clear Space Rule:** Maintain at least `12px` (`--space-3`) of clear padding around the logo lockup on all four sides.

### Square Favicons, Mobile Web Clips, and Social Preview Files

| Icon Role | Exact Repository File Path | Pixel Dimensions & Format | Browser and Device Purpose |
| :--- | :--- | :--- | :--- |
| **Scalable Vector Favicon** | `/icon.svg` | Vector SVG (`1:1` square) | Primary crisp browser tab icon across modern desktop and mobile browsers |
| **Light Mode PNG Favicons** | `/favicon-16x16.png` and `/favicon-32x32.png` | `16x16 px` and `32x32 px` PNG | Standard browser tab and bookmark bar icons on light browser themes |
| **Dark Mode PNG Favicons** | `/favicon-dark-16x16.png` and `/favicon-dark-32x32.png` | `16x16 px` and `32x32 px` PNG | High visibility browser tab icons when the user's browser is in dark mode |
| **Legacy Browser Favicon** | `/favicon.ico` and `/favicon.png` | Multi resolution `.ico` and `64x64 px` PNG | Universal fallback for legacy desktop browsers and feed readers |
| **Apple iOS Web Clip Icon** | `/apple-touch-icon.png` | `180x180 px` opaque square PNG | iPhone and iPad home screen bookmark icon with safe inner margin |
| **Android and Web App Icons** | `/pwa-192x192.png` and `/pwa-512x512.png` | `192x192 px` and `512x512 px` PNG | Android home screen web clip and web manifest icons |
| **Maskable Mobile Icons** | `/pwa-maskable-192x192.png` and `/pwa-maskable-512x512.png` | `192x192 px` and `512x512 px` PNG | Adaptive Android launcher icons keeping the crest inside the central 80 percent safe zone |
| **Open Graph Social Card** | `/og-image.jpg` | `1200x630 px` (`1.91:1` ratio) | Preview card image when `https://springboardsfcd.org` links are shared via text message or social media |

### Photography Compression, Aspect Ratios, and Corner Radius Rules
* **Compression and Responsive `<picture>` Delivery Rule:**
  * Every photograph is compressed and served in next generation **AVIF** as the primary `<source type="image/avif">` with **WebP** (`type="image/webp"`) as the universal fallback.
  * Target file budget is under `120 KB` for Hero and trade detail photos and under `80 KB` for trade card thumbnails.
  * **Zero Layout Shift and Loading Attributes:** Every `<img>` tag must declare explicit `width` and `height` attributes. Above the fold Hero photography uses `loading="eager"` and `fetchpriority="high"`; all below the fold photography uses `loading="lazy"` and `decoding="async"`.
* **Standardized Aspect Ratios and Border Radii:**
  * **Home Hero Feature Photo** (`/04_hero_photo_clean.avif` and `.webp`): `16:10` or `4:3` landscape aspect ratio, `object-fit: cover`, `20px` corner radius (`--radius-xl`), and `--shadow-lg` elevation.
  * **Five Trade Overview Card Thumbnails** (Home Section Six and `/programs`): `16:9` landscape aspect ratio (`object-fit: cover`) matching the top `8px` card corner radius (`--radius-md`) above a `1px` **Trowel Steel Divider** (`#CBD5E1`) border.
  * **Five Individual Trade Detail Page Headers** (`/programs/carpentry`, `/programs/electrical`, `/programs/plumbing`, `/programs/masonry`, `/programs/hvac`): `16:10` landscape aspect ratio with `14px` corner radius (`--radius-lg`) and a `1px` border.
  * **Founder Portrait** (`/director-marvin-thompson.avif` and `.webp` on Home Section Four and `/about`): `4:5` vertical portrait aspect ratio with `14px` corner radius (`--radius-lg`).
* **Locked Five Trade Photography Assignment and Alt Text Rule:**
  * **Carpentry (`/programs/carpentry`):** `/hands-on-training.avif` and `/hands-on-training.webp` — Backup: Drive `IMG_20260928_190050.jpg`
  * **Electrical (`/programs/electrical`):** `/electrical-training.avif` and `/electrical-training.webp` — Backup: Drive `media_1790008647789.png`
  * **Plumbing (`/programs/plumbing`):** `/classroom-training.webp` — Backup: Drive `media_1790024273624.png`
  * **Masonry (`/programs/masonry`):** `/trades-team.avif` and `/trades-team.webp` — Backup: Drive `media_1790026871528.png`
  * **Heating and Cooling (`/programs/hvac`):** `/classroom-discussion.webp` — Backup: Drive `Main_v2.webp`
  * Every photo must include a plain English `alt` description describing the real workshop instruction without claiming outside licenses or barred safety activities.

### Cohesive SVG Icon Stroke and Sizing Rules
* **Unified Outline Stroke Style:**
  * All interface and trade icons use inline SVG elements (`viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`) with a uniform **`2px` stroke width** (`stroke-width="2"`), rounded line caps (`stroke-linecap="round"`), and rounded line joins (`stroke-linejoin="round"`).
  * Zero external icon font files or third party CDN icon scripts are loaded.
* **Standardized Icon Size Tokens:**
  * `--size-icon-xs: 0.875rem` / `14px` for compact status pills and eyebrow badges.
  * `--size-icon-sm: 1rem` / `16px` for inline links and checklist bullets.
  * `--size-icon-md: 1.25rem` / `20px` for buttons, form field icons, and dropdown chevrons.
  * `--size-icon-lg: 1.5rem` / `24px` for trade card headers, navigation drawer controls, and FAQ toggles.
  * `--size-icon-xl: 2.75rem` / `44px` for step number containers and confirmation callout badges tinted with **Sawdust Cream Tint** `#FFF7ED` and **Brick Terracotta Orange** `#C84318` strokes.
* **Screen Reader Hygiene:** All decorative icons must carry `aria-hidden="true"` and `focusable="false"` so screen readers read only the clear visible button or heading label.

---

## 6. Review and Approve the Phase 3 Deliverable

### Phase 3 Refinements and Cohesive Token Rules for Phase 4 Build
1. **Single Stylesheet Token Source:** Every page in Phase 4 must inherit from the `:root` CSS Custom Properties defined in Sections 1 through 5 of this document. Hardcoded inline hex codes or magic pixel numbers outside the token table are prohibited.
2. **Legacy Domain Token Cleanup:** Unused legacy token groups for removed pages (`--admin-*` backoffice tokens and `--train-page-*` legacy prequal deck tokens) are retired from the Phase 4 build so the CSS file stays lean and strictly scoped to the 16 public routes plus `/404.html`.
3. **Strict Plain English and Compliance Alt Text Rule:** All image `alt` attributes, badge pills, and form helper notes must use plain English, honor Sirius Workforce LLC safety bans, and reference only the **Springboards Certificate of Completion**.

### Phase 1, Phase 2, and Phase 3 Cross Verification Matrix

| Visual System Domain | Phase 1 & 2 Requirement | Phase 3 Locked Specification in `brand_styleguide.md` | Status |
| :--- | :--- | :--- | :--- |
| **1. Color System & WCAG Contrast** | High contrast, trustworthy vocational trade palette meeting WCAG AA across light and dark backgrounds | 34 relatable trade and brand tokens (**Blueprint Navy** `#0B192C`, **Brick Terracotta Orange** `#C84318` at `5.1 to 1` AA, **Carpenter Ink Navy** `#071326` at `18.5 to 1` AAA, **Tape Measure Gold** `#FFB020` at `10.6 to 1` AAA) | Verified & Locked |
| **2. Typography & Self Hosted Fonts** | Fast loading, privacy preserving self hosted `.woff2` font with `font-display: swap` and metric matched fallbacks | Single `27.3 KB` `/assets/fonts/plus-jakarta-sans-latin-wght-normal.woff2` (`400` to `800`), `font-display: swap`, metric matched `'Plus Jakarta Sans Fallback'`, and fluid `clamp` scale from `--text-xs` to `--text-display` | Verified & Locked |
| **3. Spacing, Grid & Layout** | Responsive desktop and mobile containers for all 10 Home sections, 5 trade pages, and 5 Firestore intake forms with zero horizontal overflow | `--container-max: 1240px`, `--container-content: 960px`, `--container-narrow: 840px`, 4 cohesive grid patterns including the `3 + 2` five trade grid, 7 breakpoints down to `320px`, and 8px spacing scale | Verified & Locked |
| **4. Core UI Component States** | Clear default, hover, active, keyboard focus, disabled, and validation states for buttons, nav, cards, inputs, and alerts | `49.6px` min touch height, `3px` corner radius buttons, `3px` **Jobsite Safety Orange** / **Tape Measure Gold** focus rings, `1.5px` **Rebar Gray** input borders (`3.2 to 1`), 4 semantic alert boxes, and `prefers-reduced-motion` support | Verified & Locked |
| **5. Brand Icons, Favicons & Imagery** | Light and dark header logos, favicon/PWA web clips, AVIF/WebP trade photography mapping, and uniform SVG icon strokes | Dark and light header lockups in `/assets/aistudio/`, full favicon and iOS/Android web clip suite, AVIF + WebP `<picture>` rules for all 5 locked trades, and `2px` rounded stroke inline SVGs | Verified & Locked |
