# Project Brief

**Project:** Springboards for Community Development Public Website  
**Document Role:** Phase 1 Single Source of Truth  
**Status:** Phase 1 Complete and Locked  
**Last Updated:** November 19, 2026  
**Repository:** [MariDaCoder/SpringBoards](https://github.com/MariDaCoder/SpringBoards) main branch  
**Domain and Hosting:** `https://springboardsfcd.org` on Firebase project `springboards-community-dev` Blaze plan deployed via Firebase CLI

---

## 1. Define Project Purpose and Goals

### Primary Mission
The main goal of Springboards for Community Development is to provide free accelerated trade classes and direct jobs to break family poverty by giving underemployed adults, past offenders, and young adults a real choice when they feel stuck between low pay jobs or hustling.

### Three Measurable Outcomes
1. **Program Completion and Certificate Attainment:** Reach at least a 75 percent graduation rate across the five locked trade tracks of **Carpentry, Electrical, Plumbing, Masonry, and HVAC**. Graduates earn the **Springboards Certificate of Completion** only, with no outside government or industry licenses such as NCCER, OSHA, or EPA 608, by keeping at least a C grade or 68 percent average across quizzes, homework, and practical skill tests and finishing required in class trade curriculum hours.
2. **Paid Transitional Jobs Hours and Attendance:** Under WIOA Activity 220 with payroll vendor Sirius Workforce LLC, eligible participants complete up to 390 total paid field hours at no more than 32 hours per week on supervised projects, finish the mandatory job readiness training certificate before hour 195, and maintain consistent attendance under Alabama Transitional Jobs guidelines PY2025 13 where consistent absenteeism is grounds for termination alongside worksite rules.
3. **Job Placement and 90 Day Retention:** Place at least 80 percent of graduates into unsubsidized jobs, apprenticeships, or advanced trade work within 30 days of finishing, with at least 70 percent staying steadily employed after 90 days earning living wages.

### Primary Call to Action
* **Primary Conversion Goal:** Recruit Transitional Jobs candidates and volunteers.
* **Hero Primary CTA Button:** `Check Training Eligibility` at `/eligibility`
* **Section Nine Final CTA Button:** `Volunteer With Us` replacing the old Section Nine CTA button while removing the volunteer button from Hero and Footer
* **Hero Copy:** Ready to TRADE dead end jobs for a real career, free classes, hands on training and a clear path built for folks ready to WORK. Take 2 minutes to see if you qualify and get your next steps in our Transitional Jobs Program.
* **Compliance Note:** Google Drive and Docs records through November 18, 2026 show no agency signed Worksite Agreement or written approval from the Alabama Department of Workforce or Sirius Workforce LLC yet. Until written approval arrives, public text explains the pathway, directs candidates to Valley, Opelika, and Phenix City Career Centers, and collects interest without promising open enrollment dates, set wages, or barred duties such as power saws, heights over 8 feet, roofing, or driving.

---

## 2. Identify Target Audience and User Needs

### Primary Visitor Groups
1. **Candidates:** Local jobseekers, young adults, past offenders, and underemployed workers.
2. **Staff:** Board members, trade instructors, and administrative staff.
3. **Partners:** State Workforce, Career Centers, employers, contractors, trade mentors, and referral agencies.
4. **Sponsors:** Private philanthropists and corporate donors.
5. **Volunteers:** Local residents and community groups.

### Top Questions or Problems Each Group Arrives Trying to Solve
* **Candidates:** Need quick and clear answers on whether classes are free, details on the five trade tracks of Carpentry, Electrical, Plumbing, Masonry, and HVAC, schedules, location, safety gear support, how paid work placements work, and simple steps to check eligibility and sign up.
* **Staff:** Need quarterly financial reports, budgets, bylaws, meeting minutes, outcome records, student intake files, attendance logs, contact logs, syllabi, shop equipment inventory, safety checklists, and grading sheets.
* **Partners:** Need workforce program alignment, proof of participant eligibility, hour logs, placement checks, a clear way to offer placements or hire graduates, sponsor tools or materials, review cohort schedules, mentoring rubrics, and screening standards.
* **Sponsors:** Need clear funding impact, proof of measurable outcomes, and simple ways to sponsor trainees or donate tools.
* **Volunteers:** Need clear weekly center cleanup and repair hours, volunteer PPE checklist, and a direct signup form to book service blocks.

### Actions Each Visitor Group Completes on the Site
* **Candidates:** Confirm classes are free, explore the five trade pages under `/programs`, complete the 2 minute eligibility check and local Career Center finder at `/eligibility`, and submit the candidate interest form.
* **Staff:** No actions on the public website. All board, instructor, and admin records stay off site inside private Google Workspace Shared Drives, Sheets, Classroom, and Firebase Console.
* **Partners:** Read the public workforce overview and submit the partner intake form at `/partner` for work placements, hiring graduates, mentoring, referrals, or sponsoring tools. Confidential participant logs and timesheets stay off site in Google Workspace and the Sirius portal.
* **Sponsors:** Review public outcome targets and submit the pledge and tool sponsorship inquiry form at `/donate`.
* **Volunteers:** Use the Section Nine Final Call to Action button to review weekday 8 AM to 4 PM cleanup hours and the volunteer PPE checklist, then submit their volunteer service block signup.

---

## 3. Audit Existing Content and Brand Assets

### Existing Text, Logos, Photography, Documents, and Contact Details Available
* **Public Contact and Facility Details:**
  * Email: `info@springboardsfcd.org`
  * Phone: `731.388.WORK`
  * Facility Address: `2269 15th Ave SW, Lanett, AL 36863`
  * Volunteer Hours: Monday through Friday, 8:00 AM to 4:00 PM
* **Approved Photos on Main Branch to Keep:** `04_hero_photo_clean`, `director-marvin-thompson`, `hands-on-training`, `electrical-training`, `trades-team`, `classroom-discussion`, `classroom-training`, `springboards-community-flyer`, and `og-image.jpg`.
* **Approved Logos, Icons, and Font on Main Branch:** Logos in `/assets/aistudio/`, site favicons, PWA icons, and self hosted Plus Jakarta Sans font in `/assets/fonts/`.
* **Remaining Brand and Photo Assets in Google Drive Images Folder:** Import and optimize the Brand Identity Sheet, Wordmark files, Mobile Logo Variation, Main v2 graphics, Community Cleanup Flyer, and approved shop photos during Phase 3 and Phase 4. Skip internal screenshots like `domains.png`, `PageSpeed Insights.png`, and letterhead mockups.

### Five Trade Photo Mapping Table

| Trade Track | Page Route | Primary Assigned Image File | Backup or Drive Image File |
| --- | --- | --- | --- |
| **Carpentry** | `/programs/carpentry` | `hands-on-training.avif` and `hands-on-training.webp` | Drive `IMG_20260928_190050.jpg` |
| **Electrical** | `/programs/electrical` | `electrical-training.avif` and `electrical-training.webp` | Drive `media_1790008647789.png` |
| **Plumbing** | `/programs/plumbing` | `classroom-training.webp` | Drive `media_1790024273624.png` |
| **Masonry** | `/programs/masonry` | `trades-team.avif` and `trades-team.webp` | Drive `media_1790026871528.png` |
| **Heating and Cooling** | `/programs/hvac` | `classroom-discussion.webp` | Drive `Main_v2.webp` |

### Missing Copy, Photography, and Legal Disclosures to Create Before Building
* Remove all 100 plus NCCER, OSHA, and EPA 608 credential claims across all HTML, JS, JSON, and schema data.
* Write clean, plain English descriptions strictly for the five locked trades of Carpentry, Electrical, Plumbing, Masonry, and HVAC while honoring Sirius safety bans.
* Add the volunteer PPE checklist alongside weekday 8 AM to 4 PM service hours.
* Keep the Donate section focused on pledges and tool sponsorships without promising tax deductible receipts and without adding a pending nonprofit status notice.
* Update the Privacy Policy at `/privacy` and Terms of Service at `/terms` to cover static Firebase Hosting, direct Firestore form storage, Trigger Email alerts, GA4 tracking, and WIOA disclaimers.
* Review Drive shop photos for Masonry, Plumbing, and HVAC coverage before Phase 4 build.
* Replace placeholder GA4 tracking ID `G-SBFCD2026` in `analytics.js` with the live GA4 ID.

### Domain Names, Hosting Accounts, and Analytics Ownership
* **Domain and DNS:** Admin access confirmed for `springboardsfcd.org`.
* **Hosting and Database:** Admin access confirmed for Firebase project `springboards-community-dev` on the Blaze plan, deploying via Firebase CLI.
* **Analytics:** Admin access confirmed for Google Analytics 4.

---

## 4. Define Functional Requirements and Features

### Required Interactive Elements
* **Eligibility Check and Static Career Center Finder:** Four quick questions plus static ZIP and city lookup for Valley, Opelika, and Phenix City Career Centers with direct Google Maps direction links at `/eligibility`.
* **Candidate Interest Form:** Captures name, phone or email, trade pick among the five locked trades, transportation notes, and preferred Career Center. Saves to Firestore `candidateApplications`.
* **Volunteer Signup Form:** Reached from the Section Nine Final CTA button, showing weekday 8 AM to 4 PM hours and volunteer PPE checklist. Saves service block signups to Firestore `volunteerSignups`.
* **Partner Intake Form:** Captures employer placement, hiring, mentoring, referral, and tool sponsorship inquiries at `/partner`. Saves to Firestore `employerPartnerships`.
* **Donate Pledge and Tool Sponsorship Form:** Captures monetary pledge or tool sponsorship inquiries at `/donate` with no live payment link yet. Saves to Firestore `donationPledges`.
* **Contact Us General Inquiry Form:** Captures general questions and staff contact requests up to 1500 characters at `/contact`. Saves to Firestore `programInquiries`.
* **Mandatory Contact Validation Rule:** All five forms require either a valid phone number or a valid email address in both browser checks and `firestore.rules` so no blank contact entry can ever be saved.
* **Accessible Interface Controls:** Programs dropdown menu list, mobile menu drawer, FAQ expand and collapse controls, client side form checks, and spam honeypot fields.

### Strict Static Architecture Confirmation
* The website stays strictly a static informational and intake website built as clean HTML, minified CSS, and modular client side JS deployed from a clean `dist/` folder on Firebase Hosting.
* Zero Express or Node server runtimes. Retire `server.js`, all `/api/*` endpoints, and `backoffice-data.json`.
* Zero user logins, zero login modals, zero password gates, and zero admin dashboards.
* English only across every page with mobile first responsive layout and lightweight AVIF and WebP images.

### External Services Connected to the Site
* **Firebase Hosting:** Static file hosting, SSL security, and clean URLs for `springboardsfcd.org`.
* **Cloud Firestore:** Public write only storage for the five intake collections validated by `firestore.rules` with mandatory phone or email enforcement and 1500 character message support.
* **Firebase Trigger Email from Firestore Extension:** Active Blaze plan extension emailing `info@springboardsfcd.org` whenever a new form entry is saved.
* **Firebase App Check:** Recommended reCAPTCHA protection to stop automated spam writes to Firestore.
* **Google Analytics 4:** Direct client tag tracking visits, CTA clicks, eligibility checks, and form submissions.
* **External Google Maps Links:** Standard map links for the Lanett facility and local Career Centers with zero Maps API server proxy.

---

## 5. Establish High Level Sitemap and Page Scope

### Home Page 10 Section Structure and One Sentence Summaries
| Section | Name | One Sentence Purpose |
| --- | --- | --- |
| 1 | **Hero** | Hook and capture interest right away with a direct offer statement, conversational subcopy, primary CTA `Check Training Eligibility`, and trust strip with no volunteer button in the hero. |
| 2 | **The Problem** | Validate visitor pain points, limited access to training, and current barriers holding local families back. |
| 3 | **The Solution** | Present free practical trade training, hands on instruction, and career guidance as the direct answer to those barriers. |
| 4 | **Why Trust Springboards** | Establish trust through founder Marvin Thompson, community roots, outcome records, and real local proof. |
| 5 | **How the Program Works** | Break the path into three clear steps from checking eligibility and Career Center guidance to starting training and paid work experience. |
| 6 | **Programs Overview** | Present only the five locked trade tracks of **Carpentry, Electrical, Plumbing, Masonry, and HVAC** cleanly with no extra cards. |
| 7 | **Social Proof** | Showcase measurable outcome goals, real trade progress, and career momentum. |
| 8 | **FAQ** | Remove hesitation and answer seven core questions directly about cost, eligibility, experience, trades taught, location, signup steps, and what happens after training. |
| 9 | **Final CTA** | Restate the core promise and replace the old CTA button with the Volunteer action alongside a direct link to contact staff at `/contact`. |
| 10 | **Footer** | Provide public contact info at `2269 15th Ave SW, Lanett, AL 36863`, `731.388.WORK`, and `info@springboardsfcd.org`, legal links to `/privacy` and `/terms`, and secondary links to `/partner`, `/donate`, and `/contact` with no volunteer link in the footer. |

### Full Site Draft Tree
1. **Home Page**
   * Slug: `/` containing all ten sections above
2. **Main Top Navigation**
   * About Us: `/about`
   * How It Works: `/how-it-works`
   * Programs: `/programs`
     * Carpentry: `/programs/carpentry`
     * Electrical: `/programs/electrical`
     * Plumbing: `/programs/plumbing`
     * Masonry: `/programs/masonry`
     * Heating and Cooling: `/programs/hvac`
   * Primary CTA Button: `Check Training Eligibility` at `/eligibility`
3. **Partner and Support Pages**
   * Partner Intake: `/partner`
   * Donations: `/donate`
   * Contact Us: `/contact`
   * Volunteer Signup: `/volunteer` reached from the Section Nine Final CTA button
4. **Legal and Compliance Pages**
   * Privacy Policy: `/privacy`
   * Terms of Service: `/terms`
   * Page Not Found: `/404.html`

### Strict Launch Exclusions Boundary
Excluded completely from initial launch to protect scope, security, privacy, and compliance:
* Internal pages `/resources/backoffice`, `/resources/cms-workflows`, `/resources/style-guide`, `/utility/password`, and `/utility/search`.
* Legacy route redirect lists from old paths such as `/programs/train` so the current sitemap serves as the sole Single Source of Truth.
* All staff dashboards, student portals, login modals, password gates, and Express server code.
* Any trade card or program outside the five locked trades of Carpentry, Electrical, Plumbing, Masonry, and HVAC.
* The `Download Documents` footer link and all public links to internal Drive files or Worksite Agreements.
* Volunteer buttons or links inside the Hero or Footer.
* Personal phone numbers such as the 615 cell number, personal staff emails, staff rosters, and PIN records in public pages or git.
* Any live payment link, built in checkout processing, tax deductible receipt promises, or pending nonprofit status notice on Donate.
* Spanish language toggles and translated pages.
* Any claim of NCCER, OSHA, or EPA 608 certifications.

---

## 6. Set Project Timeline, Milestones, and Approval Gates

### Target Completion Dates
One week target per phase starting November 19, 2026:

| Phase | Milestone | Target Completion Date |
| --- | --- | --- |
| Phase 1 | Strategy and Discovery | November 26, 2026 |
| Phase 2 | Outline and Wireframe | December 3, 2026 |
| Phase 3 | Style Guide | December 10, 2026 |
| Phase 4 | Site Build | December 17, 2026 |
| Phase 5 | Testing and QA | December 24, 2026 |
| Phase 6 | Launch | December 31, 2026 |

### Phase Review and Lock Rule
* **`project_brief.md` is the Phase 1 Single Source of Truth.**
* Each phase locks only after its work matches `project_brief.md` and gets clear owner approval before moving to the next phase.
* Any later change to content, layout, or features must be updated inside `project_brief.md` first so scope stays under control.

### Master Brief Workspace Record
All Phase 1 decisions are recorded in this single master project brief inside your workspace, GitHub repository, and Google Drive project folder before editing any repository code.
