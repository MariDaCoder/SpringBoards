# Phase 2 Outline and Wireframes

**Project:** Springboards for Community Development Public Website  
**Source of Truth:** `project_brief.md`  
**Status:** Phase 2 Steps 1 through 5 Complete and Confirmed  
**Last Updated:** November 19, 2026

---

## 1. Visual Sitemap

### Home Page Ten Section Map

| Section | Name | Purpose |
| --- | --- | --- |
| 1 | **Hero** | Hook and capture interest right away with a direct offer statement, conversational subcopy, primary CTA `Check Training Eligibility`, and trust strip with no volunteer button in the hero. |
| 2 | **The Problem** | Validate visitor pain points, limited access to training, and current barriers holding local families back. |
| 3 | **The Solution** | Present free practical trade training, hands on instruction, and career guidance as the direct answer to those barriers. |
| 4 | **Why Trust Springboards** | Establish trust through founder Marvin Thompson, community roots, outcome records, and real local proof. |
| 5 | **How the Program Works** | Break the path into three clear steps from checking eligibility and Career Center guidance to starting training and paid work experience. |
| 6 | **Programs Overview** | Present only the five locked trade tracks of Carpentry, Electrical, Plumbing, Masonry, and Heating and Cooling cleanly with no extra cards. |
| 7 | **Social Proof** | Showcase measurable outcome goals, real trade progress, and career momentum. |
| 8 | **FAQ** | Remove hesitation and answer seven core questions directly about cost, eligibility, experience, trades taught, location, signup steps, and what happens after training. |
| 9 | **Final CTA** | Restate the core promise and replace the old CTA button with `Volunteer With Us` alongside a direct link to contact the team at `/contact`. |
| 10 | **Footer** | Provide public contact info at `2269 15th Ave SW, Lanett, AL 36863`, `731.388.WORK`, `info@springboardsfcd.org`, legal links to `/privacy` and `/terms`, and secondary links to `/partner`, `/donate`, and `/contact` with no volunteer button in the footer. |

---

### Locked Site Structure Tree

#### 1. Home Page
* **Slug:** `/`
* Contains all ten single page sections:
  * Section One: Hero with primary action button `Check Training Eligibility`
  * Section Two: The Problem
  * Section Three: The Solution
  * Section Four: Why Trust Springboards
  * Section Five: How the Program Works
  * Section Six: Programs Overview
  * Section Seven: Social Proof
  * Section Eight: Frequently Asked Questions
  * Section Nine: Final Call to Action with `Volunteer With Us` button and `Contact Us` link
  * Section Ten: Footer

#### 2. Main Top Navigation
* **About Us:** `/about`
* **How It Works:** `/how-it-works`
* **Programs:** `/programs`
  * **Menu List:**
    * Carpentry: `/programs/carpentry`
    * Electrical: `/programs/electrical`
    * Plumbing: `/programs/plumbing`
    * Masonry: `/programs/masonry`
    * Heating and Cooling: `/programs/hvac`
* **CTA Button:** `Check Training Eligibility` at `/eligibility`

#### 3. Partner and Support Pages
* **Partner Intake:** `/partner`
* **Donations:** `/donate`
* **Contact Us:** `/contact`
* **Volunteer Signup:** `/volunteer` reached from the Section Nine Final Call to Action button

#### 4. Legal and Compliance Pages
* **Privacy Policy:** `/privacy`
* **Terms of Service:** `/terms`
* **Page Not Found:** `/404.html`

---

### Visual Tree View

```text
Springboards Public Website  /
├── 1. Home Page  /
│   ├── Section One: Hero  [Primary CTA: Check Training Eligibility -> /eligibility]
│   ├── Section Two: The Problem
│   ├── Section Three: The Solution
│   ├── Section Four: Why Trust Springboards
│   ├── Section Five: How the Program Works
│   ├── Section Six: Programs Overview  [5 Trade Cards -> /programs/...]
│   ├── Section Seven: Social Proof
│   ├── Section Eight: Frequently Asked Questions
│   ├── Section Nine: Final Call to Action  [CTA Button: Volunteer With Us -> /volunteer | Link: Contact Us -> /contact]
│   └── Section Ten: Footer  [Partner /partner | Donate /donate | Contact /contact | Privacy /privacy | Terms /terms]
│
├── 2. Main Top Navigation
│   ├── Logo  /
│   ├── About Us  /about
│   ├── How It Works  `/how-it-works`
│   ├── Programs  /programs
│   │   ├── Carpentry  /programs/carpentry
│   │   ├── Electrical  /programs/electrical
│   │   ├── Plumbing  /programs/plumbing
│   │   ├── Masonry  /programs/masonry
│   │   └── Heating and Cooling  /programs/hvac
│   └── CTA Button: Check Training Eligibility  /eligibility
│
├── 3. Partner and Support Pages
│   ├── Partner Intake  /partner
│   ├── Donations  /donate
│   ├── Contact Us  /contact
│   └── Volunteer Signup  /volunteer
│
└── 4. Legal and Compliance Pages
    ├── Privacy Policy  /privacy
    ├── Terms of Service  /terms
    └── Page Not Found  /404.html
```

---

## 2. Core User Flows

### Flow One: Candidates
* **Entry Points:** Home Hero button `Check Training Eligibility`, top bar button `Check Training Eligibility`, `/about`, `/how-it-works`, `/programs`, any of the five trade pages `/programs/carpentry`, `/programs/electrical`, `/programs/plumbing`, `/programs/masonry`, and `/programs/hvac`, or direct visit to `/eligibility`.
* **Exploration Path:** Candidate reads Home or visits `/how-it-works` and a trade page under `/programs`. Every trade page and information page ends with a clear `Check Training Eligibility` button leading to `/eligibility`.
* **Decision Point on `/eligibility`:** Candidate answers four quick eligibility questions and enters a ZIP code or city name to match with the nearest Alabama Career Center in Valley, Opelika, or Phenix City.
  * **Branch A Likely Eligible:** Page shows their matched Career Center address, direct Google Maps link, and the required document checklist covering State photo ID, Social Security card, and SNAP or unemployment proof if applicable, then opens the Candidate Interest Form.
  * **Branch B Unsure or Needs Help:** Page shows all three local Career Centers, public phone `731.388.WORK`, and email `info@springboardsfcd.org`, and still allows the visitor to submit the Candidate Interest Form so staff can help.
* **Form Submission:** Visitor enters name, phone or email, chosen trade among the five trades, transportation notes, and preferred Career Center. Entry saves to Firestore `candidateApplications` and Firebase Trigger Email sends an alert to `info@springboardsfcd.org`.
* **Confirmation State and Next Step:** Page displays a thank you message, keeps the Career Center checklist and Google Maps link on screen, and provides clear buttons to explore `/programs` or return to `/` Home so there is no dead end.

### Flow Two: Volunteers
* **Entry Points:** Home Section Nine Final Call to Action button `Volunteer With Us` or direct visit to `/volunteer`.
* **Decision Point on `/volunteer`:** Visitor checks weekday service hours from Monday through Friday 8 AM to 4 PM at `2269 15th Ave SW, Lanett, AL 36863`, reviews the volunteer PPE checklist to verify required boots, work clothes, and safety gear, and selects an available service block and project task.
* **Form Submission:** Visitor enters name, phone or email, weekday availability block, and service interest. Entry saves to Firestore `volunteerSignups` and Firebase Trigger Email alerts `info@springboardsfcd.org`.
* **Confirmation State and Next Step:** Page displays a thank you confirmation repeating the Lanett address, weekday 8 AM to 4 PM schedule, and PPE checklist reminder, plus buttons to return to `/` Home or visit `/donate`.

### Flow Three: Partners
* **Entry Points:** Footer link `Partner` to `/partner`, link from `/about` or `/how-it-works`, or direct visit to `/partner`.
* **Decision Point on `/partner`:** State Workforce staff, Career Center staff, employers, contractors, trade mentors, and referral agencies review the public Transitional Jobs overview and pick their partnership track: offering work placements, hiring graduates, serving as a trade mentor, referring candidates, or sponsoring tools and materials.
* **Form Submission:** Visitor enters organization name, contact name, phone or email, partnership type, trade specialty, and message. Entry saves to Firestore `employerPartnerships` and Firebase Trigger Email alerts `info@springboardsfcd.org`.
* **Confirmation State and Next Step:** Page shows a confirmation note with `731.388.WORK` and `info@springboardsfcd.org` along with buttons to view `/programs` or return to `/` Home.

### Flow Four: Sponsors and Donors
* **Entry Points:** Footer link `Donate` to `/donate`, link from `/about` or `/partner`, or direct visit to `/donate`.
* **Decision Point on `/donate`:** Private philanthropist or corporate donor reviews the three measurable outcome goals and chooses how they want to support trainees through a monetary pledge or a tool and material sponsorship, with no tax receipt promise shown.
* **Form Submission:** Visitor enters donor name, phone or email, support type, pledge details, and message. Entry saves to Firestore `donationPledges` and Firebase Trigger Email alerts `info@springboardsfcd.org`.
* **Confirmation State and Next Step:** Page shows a thank you confirmation with `info@springboardsfcd.org` for follow up coordination and buttons to visit `/partner` or return to `/` Home.

### Flow Five: General Questions, Legal Pages, and Staff Boundary
* **Contact Us Flow at `/contact`:** Reached from the Home Section Nine `Contact Us` link or the Footer `Contact` link. Visitor sees the Lanett facility address with a Google Maps link, `731.388.WORK`, `info@springboardsfcd.org`, and the General Inquiry Form. Submitting saves to Firestore `programInquiries`, triggers an email to `info@springboardsfcd.org`, and shows a confirmation screen with buttons to `/eligibility` and `/` Home.
* **No Dead Ends on Content and Legal Pages:**
  * `/about`, `/how-it-works`, `/programs`, and all five `/programs/...` trade pages end with a primary `Check Training Eligibility` button and a secondary link to `/partner` or `/contact`.
  * `/privacy`, `/terms`, and `/404.html` end with clear buttons back to `/` Home and `/eligibility`.
* **Staff Boundary:** Board members, trade instructors, and administrative staff have zero login or portal path on the public website and manage all internal records directly in Google Workspace Shared Drives, Sheets, Classroom, and Firebase Console.

---

## 3. Page Content Hierarchy, Written Copy Outlines, Photo Mapping, and Exact Form Specifications

### Five Trade Photo Mapping Table

| Trade Track | Page Route | Primary Assigned Image File | Backup or Drive Image File |
| --- | --- | --- | --- |
| **Carpentry** | `/programs/carpentry` | `hands-on-training.avif` and `hands-on-training.webp` | Drive `IMG_20260928_190050.jpg` |
| **Electrical** | `/programs/electrical` | `electrical-training.avif` and `electrical-training.webp` | Drive `media_1790008647789.png` |
| **Plumbing** | `/programs/plumbing` | `classroom-training.webp` | Drive `media_1790024273624.png` |
| **Masonry** | `/programs/masonry` | `trades-team.avif` and `trades-team.webp` | Drive `media_1790026871528.png` |
| **Heating and Cooling** | `/programs/hvac` | `classroom-discussion.webp` | Drive `Main_v2.webp` |

### Global Header and Footer Copy Used Across All Pages

#### Global Top Navigation Bar
* **Brand Logo Link:** `Springboards for Community Development` linking to `/`
* **Navigation Link 1:** `About Us` linking to `/about`
* **Navigation Link 2:** `How It Works` linking to `/how-it-works`
* **Navigation Link 3:** `Programs` linking to `/programs` with dropdown items:
  * `Carpentry` linking to `/programs/carpentry`
  * `Electrical` linking to `/programs/electrical`
  * `Plumbing` linking to `/programs/plumbing`
  * `Masonry` linking to `/programs/masonry`
  * `Heating and Cooling` linking to `/programs/hvac`
* **Primary Action Button:** `Check Training Eligibility` linking to `/eligibility`

#### Global Footer
* **Organization Title:** `Springboards for Community Development`
* **Address Line:** `2269 15th Ave SW, Lanett, AL 36863`
* **Phone Line:** `731.388.WORK`
* **Email Line:** `info@springboardsfcd.org`
* **Support Links:** `Partner` `/partner` | `Donate` `/donate` | `Contact` `/contact`
* **Legal Links:** `Privacy Policy` `/privacy` | `Terms of Service` `/terms`
* **Compliance Footer Note:** `Springboards provides tuition free construction trade classes and works with local Alabama Career Centers for WIOA Transitional Jobs referrals. Graduates earn a Springboards Certificate of Completion.`

---

### Page 1: Home Page `/`

#### Section 1: Hero
* **Eyebrow Label:** `SPRINGBOARDS FOR COMMUNITY DEVELOPMENT`
* **Main Heading:** `Free Trade Training That Opens Real Career Paths`
* **Subheading Copy:** `Ready to TRADE dead end jobs for a real career, free classes, hands on training and a clear path built for folks ready to WORK. Take 2 minutes to see if you qualify and get your next steps in our Transitional Jobs Program.`
* **Primary Button:** `Check Training Eligibility` linking to `/eligibility`
* **Trust Strip Items:** `Free trade classes` • `Hands on shop learning` • `Career focused support` • `Community based mentorship`

#### Section 2: The Problem
* **Main Heading:** `Too many people are stuck before they ever get a fair chance.`
* **Body Copy:** `Many people in East Alabama face limited access to training, weak job pathways, and barriers that keep them from building stable work. For too many families, the challenge is not lack of effort. It is lack of access.`
* **Card 1 Heading:** `Limited access to career training`
  * **Card 1 Copy:** `Traditional trade schools often cost thousands of dollars and take years that working families cannot spare.`
* **Card 2 Heading:** `Few clear pathways into skilled work`
  * **Card 2 Copy:** `Without hands on shop experience and local contractor connections, breaking into construction trades feels out of reach.`
* **Card 3 Heading:** `Barriers that make stable employment harder to reach`
  * **Card 3 Copy:** `Underemployed adults, past offenders, and young adults need a real choice when they feel stuck between low pay jobs or hustling.`

#### Section 3: The Solution
* **Main Heading:** `A practical path from skill building to real work.`
* **Body Copy:** `Springboards helps people build job ready skills through free hands on trade training, practical instruction, and supportive career guidance. We focus on the practical skills, Springboards Certificate of Completion, and confidence people need to move forward.`
* **Card 1 Heading:** `Hands on trade instruction`
  * **Card 1 Copy:** `Learn real construction fundamentals inside our Lanett workshop bays under experienced trade instructors.`
* **Card 2 Heading:** `Tools, gear, and shop safety training`
  * **Card 2 Copy:** `Train with provided hand tools and protective gear while learning safe jobsite habits from day one.`
* **Card 3 Heading:** `Guidance toward work and opportunity`
  * **Card 3 Copy:** `Connect with local Alabama Career Centers for up to 390 paid Transitional Jobs hours and direct introductions to local employers.`

#### Section 4: Why Trust Springboards
* **Main Heading:** `Built on real community need. Grounded in practical training.`
* **Body Copy:** `Springboards is rooted in the communities it serves. Our work is designed around real barriers, real opportunities, and practical solutions that help people move toward stable employment.`
* **Founder Subheading:** `Marvin Thompson, Founder and Executive Director`
* **Founder Quote:** `"We believe people deserve a pathway that is honest, practical, and rooted in opportunity."`
* **Trust Strip Items:** `Free training model` • `Community based shop` • `Mentor led instruction` • `Five core trade pathways`

#### Section 5: How the Program Works
* **Main Heading:** `This is how you move forward.`
* **Subheading:** `Three clear milestones take you from checking your eligibility to learning in the shop and earning paid work experience.`
* **Step 1 Heading:** `1. Check Eligibility and Connect With a Career Center`
  * **Step 1 Copy:** `Answer four quick questions online and visit the Valley, Opelika, or Phenix City Career Center with your State ID and Social Security card for WIOA referral.`
* **Step 2 Heading:** `2. Train in the Shop and Earn Your Certificate`
  * **Step 2 Copy:** `Complete required in class curriculum hours and keep at least a C grade or 68 percent average across quizzes, homework, and practical skill checks to earn your Springboards Certificate of Completion.`
* **Step 3 Heading:** `3. Complete Paid Work Experience and Step Into a Career`
  * **Step 3 Copy:** `Work up to 32 hours per week and up to 390 total paid Transitional Jobs hours on supervised projects, finish your job readiness milestone before hour 195, and transition toward steady trade employment.`

#### Section 6: Programs Overview
* **Main Heading:** `Skills that lead to real opportunity.`
* **Subheading:** `Explore our five free construction trade tracks in Lanett, Alabama.`
* **Trade Card 1 Heading:** `Carpentry` — Image: `hands-on-training.webp`
  * **Trade Card 1 Copy:** `Learn tape measurement, hand tool mastery, wood framing layout, drywall hanging, and interior trim fundamentals.`
  * **Trade Card 1 Link Label:** `View Carpentry Track` linking to `/programs/carpentry`
* **Trade Card 2 Heading:** `Electrical` — Image: `electrical-training.webp`
  * **Trade Card 2 Copy:** `Learn residential wiring basics, circuit boxes, switches, outlets, conduit bending, and lockout safety habits.`
  * **Trade Card 2 Link Label:** `View Electrical Track` linking to `/programs/electrical`
* **Trade Card 3 Heading:** `Plumbing` — Image: `classroom-training.webp`
  * **Trade Card 3 Copy:** `Learn supply and drain piping, copper and plastic fittings, fixture installation, leak testing, and valve replacement.`
  * **Trade Card 3 Link Label:** `View Plumbing Track` linking to `/programs/plumbing`
* **Trade Card 4 Heading:** `Masonry` — Image: `trades-team.webp`
  * **Trade Card 4 Copy:** `Learn mortar mixing, trowel handling, brick and block laying, level and plumb checks, and joint finishing.`
  * **Trade Card 4 Link Label:** `View Masonry Track` linking to `/programs/masonry`
* **Trade Card 5 Heading:** `Heating and Cooling` — Image: `classroom-discussion.webp`
  * **Trade Card 5 Copy:** `Learn air distribution basics, ductwork sealing, thermostat wiring, condenser coil care, filter service, and multimeter checks.`
  * **Trade Card 5 Link Label:** `View Heating and Cooling Track` linking to `/programs/hvac`

#### Section 7: Social Proof
* **Main Heading:** `A path designed for momentum.`
* **Body Copy:** `The goal is not just learning. It is progress. Springboards helps participants build practical skills, confidence, and a pathway toward meaningful work.`
* **Outcome Card 1 Heading:** `75 Percent Graduation Target`
  * **Outcome Card 1 Copy:** `At least 75 percent of enrolled trainees finish their trade curriculum with a 68 percent or C average to earn the Springboards Certificate of Completion.`
* **Outcome Card 2 Heading:** `Up to 390 Paid Transitional Hours`
  * **Outcome Card 2 Copy:** `Eligible WIOA Activity 220 participants earn paid field experience at up to 32 hours per week while maintaining consistent attendance.`
* **Outcome Card 3 Heading:** `80 Percent Job Placement Target`
  * **Outcome Card 3 Copy:** `At least 80 percent of graduates step into unsubsidized jobs or apprenticeships within 30 days, with 70 percent retained at 90 days earning living wages.`

#### Section 8: Frequently Asked Questions
* **Main Heading:** `Common Questions`
* **Q1:** `Is the training really free?`
  * **A1:** `Yes. All trade classes, workshop tools, and safety gear at Springboards are provided at zero tuition cost to accepted trainees.`
* **Q2:** `Who is eligible?`
  * **A2:** `Adults ages 18 and over in East Alabama, including underemployed workers, young adults, and past offenders. Paid Transitional Jobs placement requires eligibility verification through a local Alabama Career Center.`
* **Q3:** `Do I need experience?`
  * **A3:** `No prior trade experience is needed. We teach tool safety, tape measurement, and entry level helper skills from the ground up.`
* **Q4:** `What skills are taught?`
  * **A4:** `We teach five core trades: Carpentry, Electrical, Plumbing, Masonry, and Heating and Cooling.`
* **Q5:** `Where are programs held?`
  * **A5:** `Classes and workshop labs take place at 2269 15th Ave SW, Lanett, AL 36863.`
* **Q6:** `How do I apply?`
  * **A6:** `Click Check Training Eligibility to complete our two minute check, find your nearest Career Center in Valley, Opelika, or Phenix City, and submit your candidate interest form.`
* **Q7:** `What happens after training?`
  * **A7:** `Graduates earn a Springboards Certificate of Completion, complete up to 390 paid Transitional Jobs hours if approved through WIOA, and connect with local contractors and employers for long term jobs.`

#### Section 9: Final Call to Action
* **Main Heading:** `Ready to take the next step with our community?`
* **Body Copy:** `Join our weekday workshop cleanup and repair blocks as a community volunteer, or reach out directly to our team in Lanett with your questions.`
* **Primary Button:** `Volunteer With Us` linking to `/volunteer`
* **Secondary Link:** `Contact Us` linking to `/contact`

#### Section 10: Footer
* Uses Global Footer copy above.

---

### Page 2: About Us `/about`

1. **Global Top Navigation Bar**
2. **Hero Banner**
   * **Heading:** `About Springboards for Community Development`
   * **Subheading:** `Providing free accelerated trade classes and direct job pathways in Lanett, Alabama.`
3. **Our Mission Section**
   * **Heading:** `Our Primary Mission`
   * **Body Copy:** `The main goal of Springboards for Community Development is to provide free accelerated trade classes and direct jobs to break family poverty by giving underemployed adults, past offenders, and young adults a real choice when they feel stuck between low pay jobs or hustling.`
4. **Founder Story Section**
   * **Heading:** `Leadership Rooted in East Alabama`
   * **Subheading:** `Marvin Thompson, Founder and Executive Director`
   * **Body Copy:** `Springboards was founded to bridge the gap between people willing to work hard and the hands on trade skills local contractors demand. Inside our Lanett training facility, trainees learn practical craft skills alongside one to one mentorship, workplace discipline, and mutual accountability.`
   * **Quote:** `"We believe people deserve a pathway that is honest, practical, and rooted in opportunity."`
5. **Measurable Standards Section**
   * **Heading:** `How We Measure Success`
   * **Bullet 1:** `Program Completion: At least a 75 percent graduation rate across Carpentry, Electrical, Plumbing, Masonry, and Heating and Cooling, earning the Springboards Certificate of Completion with at least a 68 percent or C average.`
   * **Bullet 2:** `Paid Work Experience: Up to 390 paid Transitional Jobs hours at up to 32 hours per week with consistent attendance and completion of the 195 hour job readiness milestone.`
   * **Bullet 3:** `Career Retention: At least 80 percent placement into unsubsidized jobs or apprenticeships within 30 days and 70 percent retention at 90 days.`
6. **Bottom CTA Section**
   * **Heading:** `Start Your Trade Pathway Today`
   * **Primary Button:** `Check Training Eligibility` linking to `/eligibility`
   * **Secondary Link:** `Partner With Springboards` linking to `/partner`
7. **Global Footer**

---

### Page 3: How It Works `/how-it-works`

1. **Global Top Navigation Bar**
2. **Hero Banner**
   * **Heading:** `How the Springboards Training and Transitional Jobs Path Works`
   * **Subheading:** `A clear step by step route from your local Career Center to our Lanett workshop and paid work experience.`
3. **Milestone 1 Section: Career Center Intake**
   * **Heading:** `Step 1: Check Eligibility and Visit Your Local Career Center`
   * **Body Copy:** `Start with our two minute eligibility check online. To participate in the WIOA Activity 220 Transitional Jobs track, candidates complete eligibility verification and an employment assessment at the Valley, Opelika, or Phenix City Alabama Career Center. Bring your State photo ID, Social Security card, and proof of SNAP or unemployment assistance if applicable.`
4. **Milestone 2 Section: Classroom and Shop Instruction**
   * **Heading:** `Step 2: Build Skills in the Lanett Workshop`
   * **Body Copy:** `Trainees learn foundational tool handling, measurement, safety habits, and entry level helper tasks in Carpentry, Electrical, Plumbing, Masonry, or Heating and Cooling. Trainees who finish their required in class trade curriculum hours and maintain at least a C grade or 68 percent average on quizzes, homework, and practical skill checks earn the Springboards Certificate of Completion.`
5. **Milestone 3 Section: Paid Transitional Jobs Work Experience**
   * **Heading:** `Step 3: Earn Paid Work Experience and Move Into Employment`
   * **Body Copy:** `Approved WIOA Transitional Jobs participants complete up to 32 hours per week and up to 390 total paid hours on supervised community building projects, with payroll and workers compensation administered by Sirius Workforce LLC. Participants complete a mandatory job readiness certificate before reaching 195 hours and maintain consistent attendance under Alabama Transitional Jobs guidelines.`
   * **Safety Rule Callout:** `Worksite Safety Standard: All field assignments strictly follow program safety boundaries. Participants perform supervised entry level tasks on the ground and never operate power saws, work above 8 feet, perform roofing, or drive work vehicles.`
6. **Bottom CTA Section**
   * **Heading:** `See If You Qualify in Two Minutes`
   * **Primary Button:** `Check Training Eligibility` linking to `/eligibility`
   * **Secondary Link:** `Explore All Five Trades` linking to `/programs`
7. **Global Footer**

---

### Page 4: Programs Hub `/programs`

1. **Global Top Navigation Bar**
2. **Hero Banner**
   * **Heading:** `Five Free Construction Trade Tracks`
   * **Subheading:** `Hands on shop training in Lanett, Alabama leading to a Springboards Certificate of Completion.`
3. **Five Trade Cards Section**
   * **Card 1:** `Carpentry` — Image: `hands-on-training.webp` — `Wood framing layout, hand tools, drywall hanging, and trim basics.` — Button: `Explore Carpentry` `/programs/carpentry`
   * **Card 2:** `Electrical` — Image: `electrical-training.webp` — `Residential circuit basics, boxes, switches, fixtures, and lockout safety.` — Button: `Explore Electrical` `/programs/electrical`
   * **Card 3:** `Plumbing` — Image: `classroom-training.webp` — `Supply and drain lines, copper and plastic fittings, fixtures, and leak checks.` — Button: `Explore Plumbing` `/programs/plumbing`
   * **Card 4:** `Masonry` — Image: `trades-team.webp` — `Mortar mixing, trowel technique, brick and block layout, and joint finishing.` — Button: `Explore Masonry` `/programs/masonry`
   * **Card 5:** `Heating and Cooling` — Image: `classroom-discussion.webp` — `Airflow basics, duct sealing, thermostat wiring, coil cleaning, and filter care.` — Button: `Explore Heating and Cooling` `/programs/hvac`
4. **Certificate and Standards Section**
   * **Heading:** `Springboards Certificate of Completion`
   * **Body Copy:** `Graduates earn a Springboards Certificate of Completion by finishing required in class curriculum hours and maintaining at least a C grade or 68 percent average on quizzes, homework, and hands on tests. Springboards does not issue third party government or industry licenses.`
5. **Bottom CTA Section**
   * **Primary Button:** `Check Training Eligibility` linking to `/eligibility`
6. **Global Footer**

---

### Pages 5 through 9: Five Individual Trade Pages

#### Page 5: Carpentry `/programs/carpentry`
* **Assigned Image:** `hands-on-training.avif` and `hands-on-training.webp`
* **Hero Heading:** `Carpentry Training Track`
* **Hero Subheading:** `Build practical framing, drywall, and interior finish helper skills in our Lanett workshop.`
* **Primary Button:** `Check Training Eligibility` linking to `/eligibility`
* **What You Will Learn Heading:** `Core Carpentry Helper Skills`
  * `Accurate tape measurement, square layout, and blueprint reading basics`
  * `Safe handling and care of non powered carpentry hand tools`
  * `Wall framing layout, stud spacing, and door or window rough opening prep`
  * `Drywall hanging, taping, mudding, sanding, and surface patching`
  * `Baseboard, casing, and interior trim alignment at ground level`
* **Safety and Certificate Block:** `Trainees complete required curriculum hours with at least a 68 percent or C average to earn the Springboards Certificate of Completion. All worksite practice follows strict safety rules with no operation of power saws, no roofing, and no work above 8 feet.`

#### Page 6: Electrical `/programs/electrical`
* **Assigned Image:** `electrical-training.avif` and `electrical-training.webp`
* **Hero Heading:** `Electrical Training Track`
* **Hero Subheading:** `Learn foundational residential wiring, conduit prep, and electrical safety habits.`
* **Primary Button:** `Check Training Eligibility` linking to `/eligibility`
* **What You Will Learn Heading:** `Core Electrical Helper Skills`
  * `Electrical theory fundamentals, voltage, current, resistance, and circuit diagrams`
  * `De energized lockout safety procedures and insulated hand tool usage`
  * `Outlet box, switch box, and fixture mounting on ground level training walls`
  * `Wire stripping, terminal connections, receptacles, and three way switches`
  * `Conduit measuring, manual bending, and low voltage cable routing`
* **Safety and Certificate Block:** `Trainees complete required curriculum hours with at least a 68 percent or C average to earn the Springboards Certificate of Completion. All lab drills are performed on de energized boards at ground level.`

#### Page 7: Plumbing `/programs/plumbing`
* **Assigned Image:** `classroom-training.webp`
* **Hero Heading:** `Plumbing Training Track`
* **Hero Subheading:** `Learn pipe measurement, fittings, fixture installation, and residential maintenance basics.`
* **Primary Button:** `Check Training Eligibility` linking to `/eligibility`
* **What You Will Learn Heading:** `Core Plumbing Helper Skills`
  * `Identification and sizing of PEX, PVC, CPVC, and copper piping`
  * `Manual pipe cutting, deburring, solvent welding, and compression fittings`
  * `Sink, toilet, faucet, and shutoff valve installation and repair`
  * `Drain trap assembly, slope checks, and basic clog clearing`
  * `Water pressure inspection and leak troubleshooting at ground level`
* **Safety and Certificate Block:** `Trainees complete required curriculum hours with at least a 68 percent or C average to earn the Springboards Certificate of Completion. All worksite tasks stay above ground with zero trenching or excavation exposure.`

#### Page 8: Masonry `/programs/masonry`
* **Assigned Image:** `trades-team.avif` and `trades-team.webp`
* **Hero Heading:** `Masonry Training Track`
* **Hero Subheading:** `Master mortar mixing, brick and block layout, and trowel craftsmanship.`
* **Primary Button:** `Check Training Eligibility` linking to `/eligibility`
* **What You Will Learn Heading:** `Core Masonry Helper Skills`
  * `Mortar batching, dry mix proportions, and hydration consistency`
  * `Trowel control for spreading bed joints and buttering head joints`
  * `Brick and concrete block corner leads, line blocks, and course layout`
  * `Plumb, level, and square verification using mason levels and rules`
  * `Joint tooling, striking, brushing, and wet dust suppression cleanup`
* **Safety and Certificate Block:** `Trainees complete required curriculum hours with at least a 68 percent or C average to earn the Springboards Certificate of Completion. All masonry practice is performed at ground level without elevated scaffolding or power saws.`

#### Page 9: Heating and Cooling `/programs/hvac`
* **Assigned Image:** `classroom-discussion.webp`
* **Hero Heading:** `Heating and Cooling Training Track`
* **Hero Subheading:** `Learn airflow basics, ductwork service, thermostat wiring, and preventive system care.`
* **Primary Button:** `Check Training Eligibility` linking to `/eligibility`
* **What You Will Learn Heading:** `Core Heating and Cooling Helper Skills`
  * `Heating, cooling, and air distribution fundamentals and trade math`
  * `Air filter replacement, return grille service, and condenser coil cleaning`
  * `Sheet metal and flex duct assembly and sealing with mastic and tape`
  * `Low voltage thermostat mounting, color code wiring, and continuity checks`
  * `Multimeter usage for testing capacitors, switches, and basic controls`
* **Safety and Certificate Block:** `Trainees complete required curriculum hours with at least a 68 percent or C average to earn the Springboards Certificate of Completion. Springboards does not issue third party government licenses.`

---

### Page 10: Eligibility Check and Career Center Finder `/eligibility`

1. **Global Top Navigation Bar**
2. **Hero Header**
   * **Heading:** `Check Your Training Eligibility in Two Minutes`
   * **Subheading:** `Answer four quick questions, find your nearest Alabama Career Center, and send your interest form to our Lanett team.`
3. **Form A: Four Question Eligibility Quick Check** — Client Side Browser Check

| Exact Field Label | Input Name | Input Type | Required | Allowed Values and Validation Rule | Inline Error Message |
| --- | --- | --- | --- | --- | --- |
| `Are you 18 years of age or older?` | `q_age` | Radio buttons | Required | `Yes` or `No` | `Please select Yes or No for age 18 or older.` |
| `Can you attend training in Lanett, Alabama and visit the Valley, Opelika, or Phenix City Career Center?` | `q_location` | Radio buttons | Required | `Yes` or `No` | `Please select Yes or No for local travel.` |
| `Are you currently unemployed, underemployed, a young adult, or overcoming past employment barriers?` | `q_barrier` | Radio buttons | Required | `Yes` or `No` | `Please select Yes or No for work history need.` |
| `Are you ready for hands on shop training and up to 32 hours per week of supervised field work?` | `q_schedule` | Radio buttons | Required | `Yes` or `No` | `Please select Yes or No for weekday availability.` |

* **Button Label:** `Show My Next Steps`

4. **Form B: Static Career Center Finder** — Client Side Local Lookup

| Exact Field Label | Input Name | Input Type | Required | Allowed Values and Validation Rule | Inline Error Message |
| --- | --- | --- | --- | --- | --- |
| `Enter Your 5 Digit ZIP Code or City` | `zipOrCity` | Text input | Required on search | Trimmed string, 2 to 60 characters; matches East Alabama 5 digit ZIP codes such as `36863`, `36854`, `36801`, `36869` or city names `Lanett`, `Valley`, `Opelika`, `Phenix City` | `Please enter a 5 digit ZIP code or city name in East Alabama.` |

* **Button Label:** `Find Nearest Career Center`
* **Three Static Career Center Cards:**
  * `Valley Career Center: 3300 23rd Drive, Valley, AL 36854` — Button: `Open in Google Maps`
  * `Opelika Career Center: 2300 Frederick Road, Opelika, AL 36801` — Button: `Open in Google Maps`
  * `Phenix City Career Center: 2602 College Dr, Brassell Hall Room 132, Phenix City, AL 36869` — Button: `Open in Google Maps`
* **What to Bring Checklist:** `1. State photo ID` • `2. Social Security card` • `3. Proof of SNAP or unemployment benefits if applicable`

5. **Form C: Candidate Interest Form** — Saves to Firestore `candidateApplications`

| Exact Field Label | Firestore Key | Input Type | Required | Exact Validation Rule Enforced in Browser and `firestore.rules` | Inline Error Message |
| --- | --- | --- | --- | --- | --- |
| `Full Name` | `name` | Text | Required | Trimmed string, 2 to 100 characters | `Please enter your full name between 2 and 100 characters.` |
| `Phone Number` | `phone` | Tel | Required if `email` is blank | Trimmed string, 7 to 40 characters; enforced by `hasPhoneOrEmail` in `firestore.rules` | `Please enter a valid phone number or provide an email address.` |
| `Email Address` | `email` | Email | Required if `phone` is blank | Trimmed valid email format, 3 to 120 characters; enforced by `hasPhoneOrEmail` in `firestore.rules` | `Please enter a valid email address up to 120 characters.` |
| `Preferred Trade Track` | `trade` | Select dropdown | Required | String, 2 to 120 characters; must be one of `Carpentry`, `Electrical`, `Plumbing`, `Masonry`, `Heating and Cooling` | `Please select one of the five trade tracks.` |
| `Nearest Career Center` | `careerCenter` | Select dropdown | Optional | String up to 160 characters; `Valley Career Center`, `Opelika Career Center`, `Phenix City Career Center` | `Selected Career Center name is too long.` |
| `Transportation Status` | `transportation` | Select dropdown | Optional | String up to 120 characters; `Have reliable ride`, `Need local transit help`, `Other` | `Transportation selection must be under 120 characters.` |
| `Work History Note` | `backgroundStatus` | Select dropdown | Optional | String up to 120 characters; `Looking for full time trade career`, `Returning citizen seeking fresh start`, `Underemployed seeking better pay`, `Opportunity youth ages 18 to 24` | `Work history selection must be under 120 characters.` |
| `Questions or Notes` | `notes` | Textarea | Optional | String up to 1500 characters | `Notes cannot exceed 1500 characters.` |
| `Leave This Field Blank` | `website_hp` | Hidden honeypot | Must be empty | Client check blocks submit if populated; omitted from Firestore payload | `Submission blocked by spam filter.` |
| `Submitted Timestamp` | `createdAt` | Auto generated | Required | ISO timestamp string up to 64 characters or Firestore server timestamp | `Timestamp is generated automatically.` |

* **Submit Button Label:** `Submit Candidate Interest`
* **Confirmation Copy:** `Thank you. Your interest form has been saved and emailed to info@springboardsfcd.org. Bring your State ID and Social Security card to your selected Career Center to start WIOA verification.`
6. **Global Footer**

---

### Page 11: Volunteer Signup and PPE Checklist `/volunteer`

1. **Global Top Navigation Bar**
2. **Hero Header**
   * **Heading:** `Volunteer at the Springboards Community Center`
   * **Subheading:** `Help keep our Lanett training bays, tool room, and community projects clean, safe, and ready for trainees.`
3. **Schedule and Location Block**
   * **Heading:** `Weekday Service Hours and Location`
   * **Copy:** `Volunteer blocks run Monday through Friday from 8:00 AM to 4:00 PM at 2269 15th Ave SW, Lanett, AL 36863.`
   * **Link Button:** `Get Directions on Google Maps`
4. **Volunteer PPE Checklist Block**
   * **Heading:** `Required Volunteer PPE and Gear Checklist`
   * **Checklist Items:**
     * `Closed toe work boots or sturdy leather shoes with no sandals or open shoes`
     * `Long work pants and durable shirt suitable for shop cleanup and repairs`
     * `Heavy duty work gloves for handling lumber, brick, and tools`
     * `Safety glasses or eye protection inside workshop bays`
     * `Dust mask when sweeping floors or cleaning storage areas`
     * `Hearing protection when working near shop equipment`
5. **Form D: Volunteer Signup Form** — Saves to Firestore `volunteerSignups`

| Exact Field Label | Firestore Key | Input Type | Required | Exact Validation Rule Enforced in Browser and `firestore.rules` | Inline Error Message |
| --- | --- | --- | --- | --- | --- |
| `Full Name` | `name` | Text | Required | Trimmed string, 2 to 100 characters | `Please enter your full name between 2 and 100 characters.` |
| `Phone Number` | `phone` | Tel | Required if `email` is blank | Trimmed string, 7 to 40 characters; enforced by `hasPhoneOrEmail` in `firestore.rules` | `Please enter a phone number or provide an email address.` |
| `Email Address` | `email` | Email | Required if `phone` is blank | Trimmed valid email format, 3 to 120 characters; enforced by `hasPhoneOrEmail` in `firestore.rules` | `Please enter a valid email address up to 120 characters.` |
| `Preferred Weekday Time Block` | `availability` | Select dropdown | Required | String, 1 to 60 characters; `Weekday Mornings 8 AM to 12 PM`, `Weekday Afternoons 12 PM to 4 PM`, `Full Weekday 8 AM to 4 PM`, `Flexible` | `Please select a weekday time block.` |
| `Volunteer Area` | `interest` | Select dropdown | Required | String, 1 to 80 characters; `Workshop Cleanup and Organization`, `Building and Facility Repairs`, `Tool Room Inventory`, `Guest Trade Mentoring`, `Community Outreach` | `Please select a volunteer area.` |
| `City or Community Group Name` | `location` | Text | Optional | Trimmed string up to 160 characters | `City or group name cannot exceed 160 characters.` |
| `Leave This Field Blank` | `website_hp` | Hidden honeypot | Must be empty | Client check blocks submit if populated; omitted from Firestore payload | `Submission blocked by spam filter.` |
| `Submitted Timestamp` | `createdAt` | Auto generated | Required | ISO timestamp string up to 64 characters or Firestore server timestamp | `Timestamp is generated automatically.` |

* **Submit Button Label:** `Reserve Volunteer Block`
* **Confirmation Copy:** `Thank you for signing up to volunteer. Our team at info@springboardsfcd.org has received your time block request. Please remember to wear closed toe boots and work clothes when arriving at 2269 15th Ave SW, Lanett, AL.`
6. **Global Footer**

---

### Page 12: Partner Intake `/partner`

1. **Global Top Navigation Bar**
2. **Hero Header**
   * **Heading:** `Partner With Springboards to Build East Alabama's Skilled Workforce`
   * **Subheading:** `Connect with our Lanett trade shop as an employer, workforce agency, trade mentor, or material sponsor.`
3. **Four Partner Tracks Block**
   * **Card 1:** `State Workforce and Career Centers` — `Coordinate WIOA Activity 220 Transitional Jobs referrals and candidate progress across Valley, Opelika, and Phenix City.`
   * **Card 2:** `Employers and Contractors` — `Interview and hire graduates trained in Carpentry, Electrical, Plumbing, Masonry, and Heating and Cooling.`
   * **Card 3:** `Trade Mentors` — `Share real world craft standards and workplace habits with trainees in our Lanett shop.`
   * **Card 4:** `Referral Agencies` — `Connect returning citizens, young adults, and underemployed neighbors with tuition free trade classes.`
4. **Form E: Partner Intake Form** — Saves to Firestore `employerPartnerships`

| Exact Field Label | Firestore Key | Input Type | Required | Exact Validation Rule Enforced in Browser and `firestore.rules` | Inline Error Message |
| --- | --- | --- | --- | --- | --- |
| `Company or Agency Name` | `companyName` | Text | Required | Trimmed string, 2 to 120 characters | `Please enter your company or agency name between 2 and 120 characters.` |
| `Contact Person Name` | `contactName` | Text | Required | Trimmed string, 2 to 100 characters | `Please enter a contact name between 2 and 100 characters.` |
| `Phone Number` | `phone` | Tel | Required if `email` is blank | Trimmed string, 7 to 40 characters; enforced by `hasPhoneOrEmail` in `firestore.rules` | `Please enter a phone number or provide an email address.` |
| `Email Address` | `email` | Email | Required if `phone` is blank | Trimmed valid email format, 3 to 120 characters; enforced by `hasPhoneOrEmail` in `firestore.rules` | `Please enter a valid email address up to 120 characters.` |
| `Partnership Track` | `partnershipType` | Select dropdown | Required | String up to 120 characters; `Hire Graduates`, `Host Work Placement`, `Trade Mentor`, `Refer Candidates`, `Sponsor Tools or Materials`, `Workforce Agency Coordination` | `Please select a partnership track.` |
| `Trade Focus` | `tradeSpecialty` | Select dropdown | Optional | String up to 120 characters; `Carpentry`, `Electrical`, `Plumbing`, `Masonry`, `Heating and Cooling`, `All Trades` | `Trade focus must be under 120 characters.` |
| `How Would You Like to Partner?` | `message` | Textarea | Optional | String up to 1500 characters | `Message cannot exceed 1500 characters.` |
| `Leave This Field Blank` | `website_hp` | Hidden honeypot | Must be empty | Client check blocks submit if populated; omitted from Firestore payload | `Submission blocked by spam filter.` |
| `Submitted Timestamp` | `createdAt` | Auto generated | Required | ISO timestamp string up to 64 characters or Firestore server timestamp | `Timestamp is generated automatically.` |

* **Submit Button Label:** `Submit Partner Inquiry`
* **Confirmation Copy:** `Thank you. Your partnership inquiry has been saved and sent to info@springboardsfcd.org. Our team will follow up shortly.`
5. **Global Footer**

---

### Page 13: Donations and Tool Sponsorship `/donate`

1. **Global Top Navigation Bar**
2. **Hero Header**
   * **Heading:** `Keep Trade Training Free in East Alabama`
   * **Subheading:** `Sponsor workshop hand tools, trainee work boots, safety gear, and building materials in Lanett.`
3. **Where Your Support Goes Block**
   * **Card 1:** `Trainee Toolkits and Boots` — `Provide day one hand tools, steel toe boots, gloves, and safety glasses so every student starts prepared.`
   * **Card 2:** `Shop Lumber and Trade Supplies` — `Supply framing lumber, wire, pipe fittings, brick, mortar, and ductwork for hands on lab bays.`
   * **Card 3:** `Measurable Community Impact` — `Support our target of 75 percent graduation, up to 390 paid Transitional Jobs hours, and 80 percent job placement.`
4. **Form F: Pledge and Tool Sponsorship Form** — Saves to Firestore `donationPledges`

| Exact Field Label | Firestore Key | Input Type | Required | Exact Validation Rule Enforced in Browser and `firestore.rules` | Inline Error Message |
| --- | --- | --- | --- | --- | --- |
| `Your Name or Organization` | `donorName` | Text | Required | Trimmed string, 2 to 120 characters | `Please enter your name or organization between 2 and 120 characters.` |
| `Phone Number` | `phone` | Tel | Required if `email` is blank | Trimmed string, 7 to 40 characters; enforced by `hasPhoneOrEmail` in `firestore.rules` | `Please enter a phone number or provide an email address.` |
| `Email Address` | `email` | Email | Required if `phone` is blank | Trimmed valid email format, 3 to 120 characters; enforced by `hasPhoneOrEmail` in `firestore.rules` | `Please enter a valid email address up to 120 characters.` |
| `Support Type` | `donationType` | Select dropdown | Required | String up to 100 characters; `Monetary Pledge`, `Hand Tools and PPE`, `Lumber and Trade Materials`, `Workshop Equipment` | `Please select a support type.` |
| `Pledge Amount or Material Summary` | `pledgeAmount` | Text | Required | Trimmed string, 1 to 150 characters | `Please enter a pledge amount or brief material summary up to 150 characters.` |
| `Delivery or Coordination Notes` | `message` | Textarea | Optional | String up to 1500 characters | `Notes cannot exceed 1500 characters.` |
| `Leave This Field Blank` | `website_hp` | Hidden honeypot | Must be empty | Client check blocks submit if populated; omitted from Firestore payload | `Submission blocked by spam filter.` |
| `Submitted Timestamp` | `createdAt` | Auto generated | Required | ISO timestamp string up to 64 characters or Firestore server timestamp | `Timestamp is generated automatically.` |

* **Submit Button Label:** `Submit Support Pledge`
* **Confirmation Copy:** `Thank you for supporting Springboards trainees. Your pledge details have been sent to info@springboardsfcd.org and our team will contact you to coordinate.`
5. **Global Footer**

---

### Page 14: Contact Us `/contact`

1. **Global Top Navigation Bar**
2. **Hero Header**
   * **Heading:** `Contact Springboards for Community Development`
   * **Subheading:** `Reach our team in Lanett, Alabama by phone, email, or the inquiry form below.`
3. **Facility and Direct Contact Block**
   * **Address:** `2269 15th Ave SW, Lanett, AL 36863` — Button: `Open in Google Maps`
   * **Phone:** `731.388.WORK`
   * **Email:** `info@springboardsfcd.org`
   * **Hours:** `Monday through Friday, 8:00 AM to 4:00 PM`
4. **Form G: General Inquiry Form** — Saves to Firestore `programInquiries`

| Exact Field Label | Firestore Key | Input Type | Required | Exact Validation Rule Enforced in Browser and `firestore.rules` | Inline Error Message |
| --- | --- | --- | --- | --- | --- |
| `Full Name` | `name` | Text | Required | Trimmed string, 2 to 100 characters | `Please enter your full name between 2 and 100 characters.` |
| `Phone Number` | `phone` | Tel | Required if `email` is blank | Trimmed string, 7 to 40 characters; enforced by `hasPhoneOrEmail` in `firestore.rules` | `Please enter a phone number or provide an email address.` |
| `Email Address` | `email` | Email | Required if `phone` is blank | Trimmed valid email format, 3 to 120 characters; enforced by `hasPhoneOrEmail` in `firestore.rules` | `Please enter a valid email address up to 120 characters.` |
| `Topic` | `program` | Select dropdown | Required | String, 1 to 100 characters; `General Question`, `Carpentry Track`, `Electrical Track`, `Plumbing Track`, `Masonry Track`, `Heating and Cooling Track`, `Career Center Referral` | `Please select a topic.` |
| `Your Message` | `tag` | Textarea | Required | Trimmed string, 2 to 1500 characters; updated to 1500 characters in `firestore.rules` | `Please enter a message up to 1500 characters.` |
| `Leave This Field Blank` | `website_hp` | Hidden honeypot | Must be empty | Client check blocks submit if populated; omitted from Firestore payload | `Submission blocked by spam filter.` |
| `Submitted Timestamp` | `createdAt` | Auto generated | Required | ISO timestamp string up to 64 characters or Firestore server timestamp | `Timestamp is generated automatically.` |

* **Submit Button Label:** `Send Message`
* **Confirmation Copy:** `Thank you. Your message has been sent to info@springboardsfcd.org.`
5. **Global Footer**

---

### Pages 15, 16, and 17: Legal and Error Pages

#### Page 15: Privacy Policy `/privacy`
* **Heading:** `Privacy Policy`
* **Sections:**
  * `Information We Collect:` Form submissions voluntarily entered on `/eligibility`, `/volunteer`, `/partner`, `/donate`, and `/contact`.
  * `How Data Is Stored and Routed:` Entries save directly to secure Google Cloud Firestore collections and trigger an automated email alert to `info@springboardsfcd.org`. Public visitors cannot read or list database records.
  * `Analytics:` Google Analytics 4 collects anonymous page visit and button click metrics to help us improve our website.
  * `No Public Accounts or Data Sales:` Springboards does not host public login accounts and never sells or rents personal information.
  * `Contact:` Reach `info@springboardsfcd.org` or call `731.388.WORK` at `2269 15th Ave SW, Lanett, AL 36863`.
* **Bottom Buttons:** `Return Home` `/` | `Check Training Eligibility` `/eligibility`

#### Page 16: Terms of Service `/terms`
* **Heading:** `Terms of Service and Program Disclaimers`
* **Sections:**
  * `Training Certificate Notice:` Springboards awards an internal **Springboards Certificate of Completion** to trainees who finish required curriculum hours with at least a 68 percent or C average. Springboards does not issue third party government or industry licenses.
  * `WIOA Transitional Jobs Disclaimer:` Eligibility for WIOA Activity 220 Transitional Jobs is determined exclusively by authorized Alabama Career Centers in Valley, Opelika, and Phenix City. Participant payroll and workers compensation for approved Transitional Jobs hours are administered by Sirius Workforce LLC.
  * `Worksite Safety Rules:` All trainees and volunteers must follow Lanett facility safety rules, required PPE standards, and activity restrictions.
* **Bottom Buttons:** `Return Home` `/` | `Check Training Eligibility` `/eligibility`

#### Page 17: Page Not Found `/404.html`
* **Heading:** `Page Not Found`
* **Body Copy:** `We could not find the page you were looking for. Use the buttons below to return to the Springboards home page or check your training eligibility.`
* **Buttons:** `Return Home` `/` | `Check Training Eligibility` `/eligibility`

---

## 4. Structural Wireframes and Layout Sketches

All sketches below are plain black and white structural wireframes mapping exact section order, containers, image boxes, form inputs, and button locations across Desktop and Mobile widths without colors or decorative styling.

### Sketch 1: Home Page `/` — Desktop and Mobile Wireframe

```text
DESKTOP VIEW: HOME PAGE /
+----------------------------------------------------------------------------------+
| [LOGO: Springboards]     About Us   How It Works   Programs v   [Check Training  |
|                                                    * Carpentry   Eligibility]    |
|                                                    * Electrical                  |
|                                                    * Plumbing                    |
|                                                    * Masonry                     |
|                                                    * Heating & Cooling           |
+----------------------------------------------------------------------------------+
| SECTION 1: HERO [Image Box: 04_hero_photo_clean.webp]                            |
| [EYEBROW: SPRINGBOARDS FOR COMMUNITY DEVELOPMENT]                                |
| H1: Free Trade Training That Opens Real Career Paths                             |
| Copy: Ready to TRADE dead end jobs for a real career, free classes, hands on     |
| training and a clear path built for folks ready to WORK. Take 2 minutes to see   |
| if you qualify and get your next steps in our Transitional Jobs Program.         |
|                                                                                  |
| [PRIMARY CTA BUTTON: Check Training Eligibility -> /eligibility]                 |
+----------------------------------------------------------------------------------+
| TRUST STRIP: Free trade classes | Hands on shop learning | Community mentorship  |
+----------------------------------------------------------------------------------+
| SECTION 2: THE PROBLEM                                                           |
| H2: Too many people are stuck before they ever get a fair chance.                |
| Copy: Many people in East Alabama face limited access to training...             |
| +------------------------+ +------------------------+ +------------------------+ |
| | Card 1                 | | Card 2                 | | Card 3                 | |
| | Limited access to      | | Few clear pathways     | | Barriers that make     | |
| | career training        | | into skilled work      | | stable work harder     | |
| +------------------------+ +------------------------+ +------------------------+ |
+----------------------------------------------------------------------------------+
| SECTION 3: THE SOLUTION                                                          |
| H2: A practical path from skill building to real work.                           |
| Copy: Springboards helps people build job ready skills through free training...  |
| +------------------------+ +------------------------+ +------------------------+ |
| | Card 1                 | | Card 2                 | | Card 3                 | |
| | Hands on trade         | | Tools, gear, and       | | Guidance toward work   | |
| | instruction            | | shop safety training   | | and opportunity        | |
| +------------------------+ +------------------------+ +------------------------+ |
+----------------------------------------------------------------------------------+
| SECTION 4: WHY TRUST SPRINGBOARDS                                                |
| H2: Built on real community need. Grounded in practical training.                |
| +-------------------------------+ +--------------------------------------------+ |
| | [IMAGE: director-marvin-      | | Copy: Springboards is rooted in the        | |
| |  thompson.webp]               | | communities it serves...                   | |
| | Marvin Thompson               | | Quote: "We believe people deserve a        | |
| | Founder & Executive Director  | | pathway that is honest, practical..."      | |
| +-------------------------------+ +--------------------------------------------+ |
| Trust Strip: Free model | Community shop | Mentor led | Five core trade tracks   |
+----------------------------------------------------------------------------------+
| SECTION 5: HOW THE PROGRAM WORKS                                                 |
| H2: This is how you move forward.                                                |
| +------------------------+ +------------------------+ +------------------------+ |
| | STEP 1                 | | STEP 2                 | | STEP 3                 | |
| | Check Eligibility &    | | Train in the Shop &    | | Complete up to 390     | |
| | Career Center Intake   | | Earn Your Certificate  | | Paid Work Hours        | |
| +------------------------+ +------------------------+ +------------------------+ |
+----------------------------------------------------------------------------------+
| SECTION 6: PROGRAMS OVERVIEW [5 LOCKED TRADES ONLY]                              |
| H2: Skills that lead to real opportunity.                                        |
| +--------------+ +--------------+ +--------------+ +--------------+ +----------+ |
| | Carpentry    | | Electrical   | | Plumbing     | | Masonry      | | Heating  | |
| | [hands-on-   | | [electrical- | | [classroom-  | | [trades-     | | & Cooling| |
| |  training]   | |  training]   | |  training]   | |  team]       | | [discuss]| |
| | Summary copy | | Summary copy | | Summary copy | | Summary copy | | Summary  | |
| | [View Track] | | [View Track] | | [View Track] | | [View Track] | | [View]   | |
| +--------------+ +--------------+ +--------------+ +--------------+ +----------+ |
+----------------------------------------------------------------------------------+
| SECTION 7: SOCIAL PROOF                                                          |
| H2: A path designed for momentum.                                                |
| +------------------------+ +------------------------+ +------------------------+ |
| | 75% Graduation Target  | | Up to 390 Paid Hours   | | 80% Placement Target   | |
| | Springboards           | | WIOA Activity 220      | | 70% retained at 90     | |
| | Certificate 68%+ avg   | | <=32 hrs/wk & 195 gate | | days at living wages   | |
| +------------------------+ +------------------------+ +------------------------+ |
+----------------------------------------------------------------------------------+
| SECTION 8: FREQUENTLY ASKED QUESTIONS                                            |
| H2: Common Questions                                                             |
| [+] 1. Is the training really free?                                              |
| [+] 2. Who is eligible?                                                          |
| [+] 3. Do I need experience?                                                     |
| [+] 4. What skills are taught?                                                   |
| [+] 5. Where are programs held?                                                  |
| [+] 6. How do I apply?                                                           |
| [+] 7. What happens after training?                                              |
+----------------------------------------------------------------------------------+
| SECTION 9: FINAL CALL TO ACTION                                                  |
| H2: Ready to take the next step with our community?                              |
| Copy: Join our weekday workshop cleanup and repair blocks or reach out directly. |
| [PRIMARY CTA BUTTON: Volunteer With Us -> /volunteer]   [LINK: Contact Us]       |
+----------------------------------------------------------------------------------+
| SECTION 10: FOOTER                                                               |
| 2269 15th Ave SW, Lanett, AL 36863 | 731.388.WORK | info@springboardsfcd.org     |
| Links: Partner /partner | Donate /donate | Contact /contact                      |
| Legal: Privacy Policy /privacy | Terms of Service /terms                         |
+----------------------------------------------------------------------------------+
```

```text
MOBILE VIEW: HOME PAGE / [375px Stacked Single Column]
+--------------------------------------+
| [LOGO]                   [= Menu]    |
+--------------------------------------+
| [Collapsible Menu Drawer When Open:] |
| * About Us /about                    |
| * How It Works /how-it-works         |
| * Programs /programs                 |
|   + Carpentry /programs/carpentry    |
|   + Electrical /programs/electrical  |
|   + Plumbing /programs/plumbing      |
|   + Masonry /programs/masonry        |
|   + Heating & Cooling /programs/hvac |
| [BTN: Check Training Eligibility]    |
+--------------------------------------+
| SECTION 1: HERO                      |
| [Image: 04_hero_photo_clean.webp]    |
| H1: Free Trade Training That Opens   |
| Real Career Paths                    |
| Copy: Ready to TRADE dead end jobs...|
| [BTN: Check Training Eligibility]    |
| Trust Strip 2x2 Grid                 |
+--------------------------------------+
| SECTION 2: THE PROBLEM               |
| H2 + Body Copy                       |
| [Card 1 Stacked]                     |
| [Card 2 Stacked]                     |
| [Card 3 Stacked]                     |
+--------------------------------------+
| SECTION 3: THE SOLUTION              |
| H2 + Body Copy                       |
| [Card 1 Stacked]                     |
| [Card 2 Stacked]                     |
| [Card 3 Stacked]                     |
+--------------------------------------+
| SECTION 4: WHY TRUST SPRINGBOARDS    |
| H2 + [director-marvin-thompson.webp] |
| Founder Quote + Trust List           |
+--------------------------------------+
| SECTION 5: HOW THE PROGRAM WORKS     |
| [Step 1 Stacked]                     |
| [Step 2 Stacked]                     |
| [Step 3 Stacked]                     |
+--------------------------------------+
| SECTION 6: PROGRAMS OVERVIEW         |
| [1. Carpentry Card -> /programs/...] |
| [2. Electrical Card -> /programs/...]|
| [3. Plumbing Card -> /programs/...]  |
| [4. Masonry Card -> /programs/...]   |
| [5. Heating & Cooling -> /programs/..|
+--------------------------------------+
| SECTION 7: SOCIAL PROOF              |
| [75% Graduation Target Card]         |
| [Up to 390 Paid Hours Card]          |
| [80% Job Placement Card]             |
+--------------------------------------+
| SECTION 8: FAQ [7 Accordion Rows]    |
+--------------------------------------+
| SECTION 9: FINAL CTA                 |
| [BTN: Volunteer With Us ->/volunteer]|
| [Link: Contact Us -> /contact]       |
+--------------------------------------+
| SECTION 10: FOOTER [Stacked]         |
| 2269 15th Ave SW, Lanett, AL 36863   |
| 731.388.WORK | info@springboards...  |
| Partner | Donate | Contact           |
| Privacy Policy | Terms of Service    |
+--------------------------------------+
```

---

### Sketch 2: Story and Program Pages `/about`, `/how-it-works`, `/programs`, and `/programs/[trade]`

```text
DESKTOP & MOBILE WIREFRAME: /about, /how-it-works, /programs, /programs/[trade]
+----------------------------------------------------------------------------------+
| GLOBAL TOP NAVIGATION BAR [Collapsible Drawer on Mobile]                         |
+----------------------------------------------------------------------------------+
| PAGE HERO BANNER                                                                 |
| H1: Page Title [Carpentry Training Track / How It Works / About Us / Programs]   |
| Subheading: Plain English summary of page purpose                                |
| [PRIMARY BUTTON: Check Training Eligibility -> /eligibility]                     |
+----------------------------------------------------------------------------------+
| CORE CONTENT BLOCKS [2 Column on Desktop, Stacked 1 Column on Mobile]            |
| +--------------------------------------+ +-------------------------------------+ |
| | Left Block:                          | | Right Block:                        | |
| | * About: Mission & Founder Story     | | * Assigned Trade Photo Placeholder  | |
| | * How It Works: 3 Detailed Steps     | | * Certificate & Safety Standards    | |
| | * Programs Hub: 5 Trade Cards        | |   Springboards Certificate only,    | |
| | * Trade Page: 5 Core Helper Skills   | |   68% C avg, 390 paid hours,        | |
| |                                      | |   Sirius ground level safety rules  | |
| +--------------------------------------+ +-------------------------------------+ |
+----------------------------------------------------------------------------------+
| TRADE SWITCHER [On /programs/[trade] pages only; Stacked pills on Mobile]        |
| [Carpentry]  [Electrical]  [Plumbing]  [Masonry]  [Heating and Cooling]          |
+----------------------------------------------------------------------------------+
| BOTTOM CALL TO ACTION BANNER                                                     |
| H2: Ready to Check Your Training Eligibility?                                    |
| [PRIMARY BUTTON: Check Training Eligibility -> /eligibility]                     |
+----------------------------------------------------------------------------------+
| GLOBAL FOOTER                                                                    |
+----------------------------------------------------------------------------------+
```

---

### Sketch 3: Eligibility Check and Career Center Finder `/eligibility`

```text
DESKTOP & MOBILE WIREFRAME: /eligibility [2 Column on Desktop, Stacked on Mobile]
+----------------------------------------------------------------------------------+
| GLOBAL TOP NAVIGATION BAR [Collapsible Drawer on Mobile]                         |
+----------------------------------------------------------------------------------+
| PAGE HEADER                                                                      |
| H1: Check Your Training Eligibility in Two Minutes                               |
| Subheading: Answer four quick questions and find your local Career Center.       |
+----------------------------------------------------------------------------------+
| FORM A: 4 QUESTION QUICK CHECK              | FORM B: STATIC CAREER CENTER FINDER|
| 1. Age 18 or older?          [Yes] [No]     | Enter ZIP or City: [ 36863      ]  |
| 2. Local to East Alabama?    [Yes] [No]     | [BTN: Find Nearest Career Center]  |
| 3. Seeking work/overcoming   [Yes] [No]     |                                    |
|    employment barriers?                     | Matched Center Cards:              |
| 4. Ready for shop & up to    [Yes] [No]     | * Valley Career Center   [Map Link]|
|    32 hrs/wk field schedule?                | * Opelika Career Center  [Map Link]|
| [BTN: Show My Next Steps]                   | * Phenix City Center     [Map Link]|
|                                             |                                    |
|                                             | What to Bring Checklist:           |
|                                             | [x] State photo ID                 |
|                                             | [x] Social Security card           |
|                                             | [x] SNAP/UI proof if applicable    |
+---------------------------------------------+------------------------------------+
| FORM C: CANDIDATE INTEREST FORM [Saves to Firestore: candidateApplications]      |
| Full Name *              [____________________________] 2 to 100 chars           |
| Phone Number *           [____________________________] Phone or Email required  |
| Email Address *          [____________________________] max 120 chars            |
| Preferred Trade Track *  [Carpentry / Electrical / Plumbing / Masonry / HVAC v]  |
| Nearest Career Center    [Valley / Opelika / Phenix City                     v]  |
| Transportation Status    [Select option                                      v]  |
| Work History Note        [Select option                                      v]  |
| Questions or Notes       [____________________________________________________]  |
| [SUBMIT BUTTON: Submit Candidate Interest]                                       |
| [Confirmation Box: Thank you message + Career Center checklist + link to /]      |
+----------------------------------------------------------------------------------+
| GLOBAL FOOTER                                                                    |
+----------------------------------------------------------------------------------+
```

---

### Sketch 4: Intake Form Pages `/volunteer`, `/partner`, `/donate`, `/contact`

```text
DESKTOP & MOBILE WIREFRAME: /volunteer, /partner, /donate, /contact
+----------------------------------------------------------------------------------+
| GLOBAL TOP NAVIGATION BAR [Collapsible Drawer on Mobile]                         |
+----------------------------------------------------------------------------------+
| PAGE HEADER                                                                      |
| H1: Page Heading [Volunteer / Partner With Springboards / Support / Contact Us]  |
| Subheading: Direct one sentence guidance for that visitor group                  |
+----------------------------------------------------------------------------------+
| LEFT COLUMN [Stacked Top on Mobile]     | RIGHT COLUMN [Stacked Bottom on Mobile]|
|                                         |                                        |
| CONTEXT & CHECKLIST PANEL               | DIRECT FIRESTORE INTAKE FORM           |
|                                         |                                        |
| * /volunteer:                           | * /volunteer -> volunteerSignups       |
|   + Hours: Mon to Fri, 8 AM to 4 PM     |   Name*, Phone/Email*, Weekday Block*, |
|   + Address: 2269 15th Ave SW, Lanett   |   Volunteer Area*, City/Group          |
|   + Volunteer PPE Checklist:            |   [BTN: Reserve Volunteer Block]       |
|     - Closed toe work boots             |                                        |
|     - Long work pants & durable shirt   | * /partner -> employerPartnerships     |
|     - Heavy duty work gloves            |   Company*, Contact*, Phone/Email*,    |
|     - Safety glasses & dust mask        |   Partnership Track*, Trade, Message   |
|     - Hearing protection                |   [BTN: Submit Partner Inquiry]        |
|                                         |                                        |
| * /partner:                             | * /donate -> donationPledges           |
|   + 4 Partner Tracks: State Workforce,  |   Donor Name*, Phone/Email*,           |
|     Employers, Trade Mentors, Referrals |   Support Type*, Pledge Summary*, Note |
|                                         |   [BTN: Submit Support Pledge]         |
| * /donate:                              |                                        |
|   + Toolkits, Shop Supplies & Outcomes  | * /contact -> programInquiries         |
|   + Pledge & Tool Sponsorship only      |   Name*, Phone/Email*, Topic*,         |
|     with no tax receipt promise         |   Message* up to 1500 chars            |
|                                         |   [BTN: Send Message]                  |
| * /contact:                             |                                        |
|   + 2269 15th Ave SW, Lanett, AL 36863  | [Confirmation State Box with next step |
|   + 731.388.WORK | info@springboards... |  buttons so there is no dead end]      |
|   + Google Maps Directions Link         |                                        |
+-----------------------------------------+----------------------------------------+
| GLOBAL FOOTER                                                                    |
+----------------------------------------------------------------------------------+
```

---

### Sketch 5: Legal and Utility Pages `/privacy`, `/terms`, `/404.html`

```text
DESKTOP & MOBILE WIREFRAME: /privacy, /terms, /404.html
+----------------------------------------------------------------------------------+
| GLOBAL TOP NAVIGATION BAR [Collapsible Drawer on Mobile]                         |
+----------------------------------------------------------------------------------+
| SINGLE COLUMN READABLE CONTENT CONTAINER                                         |
| H1: Privacy Policy  OR  Terms of Service  OR  Page Not Found                     |
|                                                                                  |
| Structured Plain English Paragraphs:                                             |
| * /privacy: Firestore form storage, Trigger Email alerts, GA4, zero logins       |
| * /terms: Springboards Certificate of Completion, Career Center WIOA disclaimer, |
|           Sirius Workforce LLC payroll role, worksite safety rules               |
| * /404.html: Helpful recovery notice                                             |
|                                                                                  |
| [PRIMARY BUTTON: Return Home -> /]   [SECONDARY BUTTON: Check Training           |
|                                       Eligibility -> /eligibility]               |
+----------------------------------------------------------------------------------+
| GLOBAL FOOTER                                                                    |
+----------------------------------------------------------------------------------+
```

---

## 5. Review and Approve the Phase 2 Deliverable

### Phase 2 Deliverable Summary

* **Visual Sitemap Saved:** All 16 public pages plus `/404.html` are mapped in Section 1 with short slugs, `/programs/[trade]` menu paths, one to two click reachability, and zero legacy redirect clutter.
* **Core User Flows Saved:** Entry points, decision points, Firestore form submissions, Trigger Email alerts to `info@springboardsfcd.org`, and confirmation screens with zero dead ends are mapped in Section 2 for Candidates, Volunteers, Partners, Sponsors, and General Visitors.
* **Written Content Outlines and Photo Mapping Saved:** Actual headings, subheadings, body copy, button labels, exact image file assignments for all five trades, and exact field specification tables for all seven forms are locked in plain English in Section 3.
* **Structural Wireframes Saved:** Simple black and white ASCII structural wireframes across desktop and mobile widths, including navigation bars, content containers, assigned image placeholders, form fields, buttons, collapsible mobile menu drawer behavior, and stacked single column mobile layouts, are locked in Section 4.

### Phase 1 to Phase 2 Requirement Verification Matrix

| Phase 1 Requirement from `project_brief.md` | Where It Is Accounted For in `outline_wireframes.md` | Status |
| :--- | :--- | :--- |
| **Five Locked Trade Tracks Only:** Carpentry, Electrical, Plumbing, Masonry, and Heating and Cooling with no extra cards | Section 1 Sitemap, Section 3 Home Section Six and `/programs` outlines, Five Trade Photo Mapping Table, and Section 4 Sketches 1 and 2 | Verified & Locked |
| **Springboards Certificate of Completion Only:** Remove all 100 plus NCCER, OSHA, and EPA 608 claims and state the 68 percent grade requirement | Section 3 copy outlines for Home, `/about`, `/how-it-works`, `/programs`, all five `/programs/[trade]` pages, and `/terms` | Verified & Locked |
| **Sirius Workforce LLC Safety Bans Honored:** No power saws, heights above 8 feet, roofing, excavation, driving, or live circuit work in copy | Section 3 plain English trade descriptions for Carpentry, Electrical, Plumbing, Masonry, and Heating and Cooling | Verified & Locked |
| **WIOA Transitional Jobs Compliance Rules:** Up to 32 hours per week and 390 total paid hours via Sirius Workforce LLC, Job Readiness before hour 195, consistent attendance, and Career Center verification disclaimer | Section 2 Flow 1, Section 3 `/how-it-works`, `/eligibility`, and `/terms` copy outlines, and Section 4 Sketch 3 | Verified & Locked |
| **Hero and Section 9 CTA Placement:** Hero primary button `Check Training Eligibility` to `/eligibility` with no volunteer button in Hero or Footer; Section 9 primary button `Volunteer With Us` to `/volunteer` and secondary link `Contact Us` to `/contact` | Section 1 Sitemap, Section 2 Flows 1 and 2, Section 3 Home Section One and Section Nine outlines, and Section 4 Sketch 1 | Verified & Locked |
| **Volunteer Weekday Hours and PPE Checklist:** Monday through Friday, 8:00 AM to 4:00 PM at 2269 15th Ave SW, Lanett, AL 36863 plus five item PPE checklist | Section 2 Flow 2, Section 3 `/volunteer` copy outline and Form D specification table, and Section 4 Sketch 4 | Verified & Locked |
| **Donate Page Pledge and Tool Sponsorship Scope:** Focus strictly on pledges and tool sponsorships without promising tax deductible receipts and without a pending nonprofit status notice | Section 2 Flow 4, Section 3 `/donate` copy outline and Form F specification table, and Section 4 Sketch 4 | Verified & Locked |
| **Static Firebase Hosting, Direct Firestore Writes, and Trigger Email Alerts:** Five Firestore collections (`programInquiries`, `candidateApplications`, `volunteerSignups`, `employerPartnerships`, `donationPledges`) requiring phone or email and 1500 char contact messages | Section 2 Flows 1 through 5, Section 3 Form A through Form G specification tables, and `firestore.rules` | Verified & Locked |
| **Public Site Exclusions and Privacy:** Zero login modals, zero password or admin pages, zero document download bundles, English only copy, and updated `/privacy` and `/terms` disclosures | Section 1 Sitemap, Section 2 Flow 5 boundary rules, Section 3 `/privacy` and `/terms` outlines, and Section 4 Sketch 5 | Verified & Locked |
| **Public Contact Information:** 2269 15th Ave SW, Lanett, AL 36863, `731.388.WORK`, and `info@springboardsfcd.org` across Footer and `/contact` | Section 1 Sitemap, Section 3 Home Section Ten and `/contact` outlines, and Section 4 Sketches 1 through 5 | Verified & Locked |

### Phase 2 Approval Gate and Structure Lock

* **Deliverable File:** `outline_wireframes.md`
* **Companion Phase 1 Brief:** `project_brief.md`
* **Approval Status:** Phase 2 Outline and Wireframes are verified against every Phase 1 requirement and formally locked as the structural Single Source of Truth prior to Phase 3 Style Guide and Design.
