(() => {
  const questionScreen = document.getElementById("questionScreen");
  const resultScreen = document.getElementById("resultScreen");
  const centerScreen = document.getElementById("centerScreen");
  const questionForm = document.getElementById("questionForm");
  const questionMount = document.getElementById("questionMount");
  const questionError = document.getElementById("questionError");
  const stepCount = document.getElementById("stepCount");
  const progressTrack = document.querySelector(".wizard-progress-track");
  const progressValue = document.getElementById("progressValue");
  const backButton = document.getElementById("backButton");
  const nextButton = document.getElementById("nextButton");
  const resultTop = document.getElementById("resultTop");
  const resultEyebrow = document.getElementById("resultEyebrow");
  const resultTitle = document.getElementById("resultTitle");
  const resultMessage = document.getElementById("resultMessage");
  const profileIntro = document.getElementById("profileIntro");
  const profileTags = document.getElementById("profileTags");
  const activityCode = document.getElementById("activityCode");
  const restartButton = document.getElementById("restartButton");
  const seeNextStepButton = document.getElementById("seeNextStepButton");
  const centerBackButton = document.getElementById("centerBackButton");
  const centerHeading = document.getElementById("centerHeading");
  const centerList = document.getElementById("centerList");
  const centerMap = document.getElementById("centerMap");
  const centerMapCaption = document.getElementById("centerMapCaption");
  const addressSearchForm = document.getElementById("addressSearchForm");
  const startingAddress = document.getElementById("startingAddress");
  const addressSearchStatus = document.getElementById("addressSearchStatus");
  const calendarDays = document.getElementById("calendarDays");
  const appointmentTimes = document.getElementById("appointmentTimes");
  const calendarStatus = document.getElementById("calendarStatus");
  const previewAppointmentButton = document.getElementById("previewAppointmentButton");
  const documentReadiness = document.getElementById("documentReadiness");
  const documentReadinessStatus = document.getElementById("documentReadinessStatus");
  const missingDocuments = document.getElementById("missingDocuments");
  const contactButton = document.getElementById("contactButton");

  if (!questionScreen || !resultScreen || !centerScreen || !questionForm || !questionMount || !questionError ||
      !stepCount || !progressTrack || !progressValue || !backButton || !nextButton || !resultTop ||
      !resultEyebrow || !resultTitle || !resultMessage || !profileIntro || !profileTags || !activityCode ||
      !restartButton || !seeNextStepButton || !centerBackButton || !centerHeading || !centerList || !centerMap ||
      !centerMapCaption || !addressSearchForm || !startingAddress || !addressSearchStatus ||
      !calendarDays || !appointmentTimes || !calendarStatus || !previewAppointmentButton ||
      !documentReadiness || !documentReadinessStatus || !missingDocuments) return;

  const careerCenters = [
    {
      id: "valley",
      name: "Valley Career Center",
      address: "3300 23rd Drive, Valley, AL 36854 inside Growth Academy",
      hours: "Monday–Friday, 8:00 AM–4:30 PM Eastern Time",
      phone: "(334) 756-3065",
      callLink: "tel:+13347563065",
      latitude: 32.8187,
      longitude: -85.1794
    },
    {
      id: "opelika",
      name: "Opelika Career Center",
      address: "2300 Frederick Road, Opelika, AL 36801",
      hours: "Monday–Friday, 8:00 AM–4:30 PM Central Time",
      phone: "(334) 749-5065",
      callLink: "tel:+13347495065",
      latitude: 32.6454,
      longitude: -85.3783
    },
    {
      id: "phenix-city",
      name: "Phenix City Career Center",
      address: "2602 College Dr, CVCC campus, Brassell Hall Room 132, Phenix City, AL 36869",
      hours: "Monday–Friday, 8:00 AM–4:30 PM Eastern Time",
      phone: "(334) 214-4828",
      callLink: "tel:+13342144828",
      latitude: 32.4709,
      longitude: -85.0008
    }
  ];
  let selectedCareerCenter = careerCenters[0];
  let directionsOrigin = "";
  let nearestCenterId = "";
  let selectedAppointmentDate = "";
  let selectedAppointmentTime = "";
  const sampleAppointmentTimes = ["8:30 AM", "10:00 AM", "11:30 AM", "1:00 PM", "2:30 PM"];

  const barrierChoices = [
    { value: "displaced-homemaker", label: "I’m rebuilding after caring for home or family", detail: "Displaced homemaker", icon: "🏡" },
    { value: "low-income", label: "My household income is limited", detail: "Low-income household", icon: "🌱" },
    { value: "native", label: "I’m American Indian, Alaska Native, or Native Hawaiian", detail: "Native community member", icon: "🧡" },
    { value: "disability", label: "I live with a disability", detail: "Person with a disability", icon: "♿" },
    { value: "justice-involved", label: "I’ve been involved with the justice system", detail: "Justice-involved / returning citizen", icon: "🤝" },
    { value: "foster-care", label: "I’m in foster care or have aged out", detail: "Foster care experience (adult pathway)", icon: "🏠" },
    { value: "english-literacy-cultural", label: "Language, reading, or cultural barriers make work harder to access", detail: "Language, literacy, or cultural barrier", icon: "💬" },
    { value: "farmworker", label: "I’m an eligible migrant or seasonal farmworker", detail: "Migrant or seasonal farmworker", icon: "🌾" },
    { value: "single-parent", label: "I’m raising a child on my own, or expecting a child on my own", detail: "Single parent / single expectant parent", icon: "🫶" },
    { value: "long-term-unemployed", label: "I’ve been out of work for 27 weeks or more", detail: "Long-term unemployed (27+ weeks)", icon: "📅" },
    { value: "public-assistance", label: "I receive public assistance or TANF, or my TANF benefits have ended", detail: "Public assistance / current or exhausted TANF", icon: "🧾" },
    { value: "dislocated-worker", label: "I lost my job and may qualify for support to get back to work", detail: "Worker displaced from a previous job", icon: "🧰" },
    { value: "homeless", label: "I’m without stable housing right now", detail: "Without stable housing", icon: "🧭" },
    { value: "none", label: "None of these sound like me", detail: "No barrier selected", icon: "↔️" },
    { value: "unsure", label: "I’m not sure yet", detail: "Barrier needs a conversation", icon: "❔" }
  ];

  const chronicChoices = [
    {
      value: "significant-unemployment",
      label: "I’m out of work now, and it’s been a big part of the last six months",
      detail: "Out of work for a significant part of the last 26 weeks",
      image: "/trades-team.webp",
      icon: "🗓️"
    },
    {
      value: "minimum-wage",
      label: "Most of my jobs have paid minimum wage",
      detail: "Work history is mainly minimum-wage jobs",
      image: "/classroom-training.webp",
      icon: "💵"
    },
    {
      value: "limited-mismatch-work",
      label: "My current job is seasonal, temporary, under 10 weeks, or below my skills",
      detail: "Short-term, seasonal, or below-skill work",
      image: "/hands-on-training.webp",
      icon: "🛠️"
    },
    {
      value: "ui",
      label: "I’m receiving unemployment benefits or have used them up",
      detail: "Receiving or exhausted unemployment benefits",
      image: "/classroom-discussion.webp",
      icon: "📄"
    },
    {
      value: "justice-recent",
      label: "I’m on parole or probation, or came home from jail or prison in the last year",
      detail: "Parole, probation, or release within the past 12 months",
      image: "/trades-team.webp",
      icon: "🔑"
    },
    {
      value: "low-income-standard",
      label: "My income is below the local basic-needs guideline",
      detail: "Income below the local basic-needs threshold",
      image: "/04_hero_photo_clean.webp",
      icon: "🏘️"
    },
    {
      value: "wioa-dislocated-worker",
      label: "I lost a job and qualify for help finding a new path",
      detail: "Eligible worker who lost a previous job",
      image: "/electrical-training.webp",
      icon: "🔌"
    },
    { value: "none", label: "None of these fit my situation", detail: "No chronic-unemployment scenario selected", icon: "↔️" },
    { value: "unsure", label: "I’m not sure—let’s talk it through", detail: "Work-history scenario needs a conversation", icon: "❔" }
  ];

  const answers = {};
  let currentQuestion = 0;
  let youthWorkHistoryApplies = false;

  const getQuestions = () => {
    const questions = [
      {
        name: "age",
        prompt: "How old are you?",
        help: "Transitional Jobs is an adult pathway. Choose the range that fits you today.",
        type: "single",
        layout: "compact",
        choices: [
          { value: "under-18", label: "17 or younger", detail: "I’m not yet 18", icon: "🌿" },
          { value: "18-24", label: "18–24", detail: "I’m a young adult", icon: "✨" },
          { value: "25-plus", label: "25 or older", detail: "I’m an adult", icon: "💪" },
          { value: "unsure", label: "I’d like help figuring that out", detail: "Let’s confirm together", icon: "❔" }
        ]
      },
      {
        name: "apprentice",
        prompt: "Are you currently an apprentice?",
        help: "Choose the answer that fits right now.",
        type: "single",
        layout: "compact",
        choices: [
          { value: "yes", label: "Yes, I’m an apprentice", icon: "🧑🏾‍🏭" },
          { value: "no", label: "No, I’m not an apprentice", icon: "🙌🏾" },
          { value: "unsure", label: "I’m not sure", icon: "❔" }
        ]
      }
    ];

    if (answers.age === "18-24") {
      questions.push({
        name: "youthWbl",
        prompt: "Have you already taken part in work-based learning as a young person?",
        help: "This can include a work experience placement or learning on a job site.",
        type: "single",
        layout: "compact",
        choices: [
          { value: "yes", label: "Yes, I have", icon: "🧰" },
          { value: "no", label: "No, I haven’t", icon: "🌟" },
          { value: "unsure", label: "I’m not sure", icon: "❔" }
        ]
      });
    }

    questions.push(
      {
        name: "barriers",
        prompt: "Which of these sound like your situation?",
        help: "Pick every one that fits. These are different life experiences that can make finding or keeping a good job harder.",
        type: "multiple",
        layout: "chips",
        choices: barrierChoices
      },
      {
        name: "chronic",
        prompt: "Which work or benefit situations have you experienced?",
        help: "Pick any card that feels familiar. We’re looking at the full picture—not just what’s happening this week.",
        type: "multiple",
        layout: "scenarios",
        choices: chronicChoices
      },
      {
        name: "inconsistentWork",
        prompt: "Have most of your jobs lasted about six months or less, with gaps between them?",
        help: "Think about the pattern across your work history. Short jobs followed by time out of work count.",
        type: "single",
        layout: "scenarios",
        choices: [
          { value: "yes", label: "Yes—short jobs and gaps are part of my story", detail: "My jobs have often been around six months or less, with breaks between them.", image: "/hands-on-training.webp", icon: "🔁" },
          { value: "no", label: "No—my work history has been mostly steady", detail: "I’ve usually stayed in jobs longer, without long gaps.", image: "/trades-team.webp", icon: "🧱" },
          { value: "unsure", label: "I’m not sure", detail: "I’d like someone to help me look at my work history.", icon: "❔" }
        ]
      }
    );

    const documents = [
      { value: "photo-id", label: "Valid state or government photo ID", detail: "A state ID or driver’s license", icon: "🪪" },
      { value: "social-security-card", label: "Original Social Security card", detail: "Bring the original card if you have it", icon: "📄" }
    ];
    const selectedBarriers = answers.barriers || [];
    const selectedWorkSituations = answers.chronic || [];
    const benefitsDocumentationMayApply = selectedBarriers.includes("public-assistance") || selectedWorkSituations.includes("ui");
    if (benefitsDocumentationMayApply) {
      documents.push({
        value: "benefit-proof",
        label: "Proof of SNAP, public benefits, or unemployment assistance",
        detail: "Only if you receive or have received one of these benefits",
        icon: "🧾"
      });
    }
    documents.push(
      { value: "none", label: "I don’t have these ready yet", detail: "That’s okay—we can make a plan", icon: "🤝" },
      { value: "unsure", label: "I’m not sure which ones I need", detail: "A team member can help confirm", icon: "❔" }
    );
    questions.push({
      name: "documents",
      prompt: "Do you have the documents for your next step?",
      help: benefitsDocumentationMayApply
        ? "Choose each item you have ready. Bring benefit proof only if it applies to you. No uploads or document numbers needed."
        : "Choose each item you have ready. No uploads or document numbers needed.",
      type: "multiple",
      layout: "chips",
      choices: documents
    });

    // POLICIES & AVAILABILITY QUESTIONNAIRE (Success & Placement Checkpoints)
    questions.push(
      {
        name: "placementVision",
        chapter: "Your Journey Chapter: Setting Up Your Success & Placement",
        badge: "Checkpoint 1 · Aligning Your Vision (IEP & Placement Fit)",
        prompt: "Tell us which path is right for you so we don't send you somewhere you don't want to be: Whats your passion?",
        help: "A great career starts with a clear direction. To ensure your placement matches your passion (for example, stepping into healthcare if that's where your heart is, rather than manufacturing):",
        type: "single",
        layout: "compact",
        choices: [
          { value: "healthcare", label: "Healthcare / Medical Services", detail: "Care, clinic support, patient services & community wellness", icon: "🩺" },
          { value: "manufacturing", label: "Advanced Manufacturing / Technology", detail: "Modern production, machinery, technical assembly & industrial trades", icon: "⚙️" },
          { value: "community", label: "Community Services / Public Sector", detail: "Public agencies, municipal support, outreach & civic development", icon: "🤝" },
          { value: "undecided", label: "I dont have a specific industry in mind", detail: "Open to discovery—let's find the best high-growth match together", icon: "🌟" }
        ]
      },
      {
        name: "skillBoost",
        badge: "Checkpoint 2 · Leveling Up Your Skills (Readiness Training & Certifications)",
        prompt: "Before you hit your halfway mark of 195 hours, you'll want to lock in a quick credential to boost your resume. Which of these sounds like your style?",
        help: "Lock in a quick credential to boost your resume before you hit your halfway mark of 195 hours.",
        type: "single",
        layout: "compact",
        choices: [
          { value: "alison", label: "Alison Online Course via AlabamaWorks!", detail: "Flexible online modules tailored through AlabamaWorks! career pathways", icon: "🎓" },
          { value: "skills-for-success", label: "Skills for Success", detail: "Rapid employer-recognized job readiness & workplace excellence certification", icon: "🏆" },
          { value: "maps", label: "MAPs (Modules for Academic Proficiency)", detail: "Foundational math, reading & workplace communication boosters", icon: "📚" },
          { value: "ace", label: "ACE Training", detail: "Accelerated career & essential work ethic credential", icon: "⚡" }
        ]
      },
      {
        name: "scheduleCommitment",
        badge: "Checkpoint 3 · Securing Your Schedule & Support",
        prompt: "To keep you moving forward without burnout, we cap work at 32 hours a week (up to 390 total hours). How does that fit into your life?",
        help: "This program is built to give you momentum without burnout. Work hours are structured up to 32 hours per week for a maximum of 390 total hours, ensuring you balance work, life, and growth. Note: Supportive services are available to help you succeed along the way (supportiveservices@workforce.alabama.gov).",
        type: "single",
        layout: "compact",
        choices: [
          { value: "ready-schedule", label: "Yes, I’m ready to commit to this schedule.", detail: "Up to 32 hours per week for a maximum of 390 total hours fits my availability.", icon: "✅" },
          { value: "constraints", label: "I have scheduling constraints to discuss with my career advisor.", detail: "I have caregiving, transit, or shift constraints we can work through together.", icon: "💬" }
        ]
      },
      {
        name: "subsidizedPayroll",
        badge: "Checkpoint 4 · Payroll & Status Verification",
        prompt: "To make sure you're heading down the exact right track and not mixed up with an apprenticeship or youth program:",
        help: "Your paycheck is fully covered—100% subsidized and managed smoothly through our trusted payroll partner, Sirius Workforce LLC.",
        type: "single",
        layout: "compact",
        choices: [
          { value: "confirmed-transitional", label: "Sounds good! I confirm I'm not currently enrolled in an apprenticeship program and I'm ready to roll on this transitional track.", detail: "100% subsidized earnings via Sirius Workforce LLC · Transitional track confirmed.", icon: "💼" },
          { value: "need-discussion", label: "I'd like to talk with an advisor about my current program or apprenticeship status.", detail: "Let's connect with a Career Advisor to make sure you're routed to the right track.", icon: "ℹ️" }
        ]
      }
    );

    // CHAPTER: FINDING YOUR IDEAL WORKSITE & STAYING PROTECTED
    questions.push(
      {
        name: "worksiteEnvironment",
        chapter: "Chapter: Finding Your Ideal Worksite & Staying Protected",
        badge: "Finding Your Environment (Worksites)",
        prompt: "We partner with trusted public, non-profit, and private businesses across Alabama to host your work placement. Let's make sure you find a spot that fits your vision.",
        help: "You're stepping into an environment designed for your success. Here is how your placement, safety, and agreements come together:",
        type: "single",
        layout: "compact",
        choices: [
          {
            value: "ready-explore-worksites",
            label: "I'm ready to explore vetted public, non-profit, and private worksite options.",
            detail: "Vetted employer host sites aligned to your personal goals and trade pathway.",
            icon: "🏢"
          }
        ]
      },
      {
        name: "worksiteAgreement",
        badge: "Setting the Ground Rules (Worksite Agreement)",
        prompt: "Every great partnership starts with clear expectations. Your host site will handle the official agreement, walk you through orientation, and keep track of your hours and evaluations so you can focus entirely on growing.",
        help: "Your host site coordinates your orientation, tracks attendance, and provides continuous feedback.",
        type: "single",
        layout: "compact",
        choices: [
          {
            value: "confirm-worksite-rules",
            label: "Sounds good—I'm ready to review and confirm my site's onboarding and attendance guidelines.",
            detail: "Structured orientation, clear expectations, and regular evaluation feedback.",
            icon: "📋"
          }
        ]
      },
      {
        name: "prohibitedActivities",
        badge: "Keeping It Professional (Prohibited Activities)",
        prompt: "We keep things fair, safe, and strictly professional. That means a zero-tolerance policy for nepotism, political or religious activities, favoritism, or unsafe conditions—it's all about uplifting our people through professional excellence.",
        help: "A fair, safe, and respectful environment ensures every participant thrives.",
        type: "single",
        layout: "compact",
        choices: [
          {
            value: "respect-professional-standards",
            label: "I understand and respect these professional standards for a fair, safe, and respectful workplace.",
            detail: "Zero-tolerance for favoritism or unsafe conditions · 100% professional respect.",
            icon: "🛡️"
          }
        ]
      },
      {
        name: "worksiteSelection",
        badge: "The Perfect Match (Worksite Selection)",
        prompt: "Your placement should tie directly into your Individual Employment Plan (IEP) goals. We’ll hold a quick chat with your supervisor beforehand and lock in your official job description so you're set up for success.",
        help: "Your official job description will be confirmed before day one to support your career direction.",
        type: "single",
        layout: "compact",
        choices: [
          {
            value: "match-iep-goals",
            label: "Let's ensure my worksite placement matches my IEP goals and career path.",
            detail: "Aligned job description and supervisor check-in before starting your assignment.",
            icon: "🎯"
          }
        ]
      },
      {
        name: "workersCompensation",
        badge: "Covered Every Step of the Way (Workers’ Compensation)",
        prompt: "Your peace of mind matters. All approved job placements come with primary injury insurance coverage fully managed through our trusted partner, Sirius Workforce LLC.",
        help: "Comprehensive primary injury insurance coverage gives you complete confidence on the job.",
        type: "single",
        layout: "compact",
        choices: [
          {
            value: "reassured-sirius-coverage",
            label: "I'm reassured knowing my placement includes Sirius Workforce workers' compensation coverage.",
            detail: "Primary injury insurance active from day one through Sirius Workforce LLC.",
            icon: "🩹"
          }
        ]
      }
    );

    // CHAPTER: GETTING ONBOARDED, TRACKING YOUR TIME, AND GETTING PAID
    questions.push(
      {
        name: "payrollOnboarding",
        chapter: "Chapter: Getting Onboarded, Tracking Your Time, and Getting Paid",
        badge: "Getting Setup from Day One (Payroll Vendor & Onboarding)",
        prompt: "Your onboarding and weekly pay are managed smoothly through our trusted partner, Sirius Workforce LLC. They handle your placement forms, automated timesheets, and workers’ compensation coverage.",
        help: "You've put in the work, now let's make sure getting set up and receiving your weekly paycheck is completely frictionless:",
        type: "single",
        layout: "compact",
        choices: [
          {
            value: "sirius-form-email-ready",
            label: "Ready to complete my Sirius Placement Form and email it to wfonboarding@siriusstaffing.com at least 5 days before my start date.",
            detail: "Direct onboarding submission to wfonboarding@siriusstaffing.com.",
            icon: "✉️"
          }
        ]
      },
      {
        name: "timesheetRhythm",
        badge: "The Weekly Rhythm (Timesheets & Approvals)",
        prompt: "To keep your weekly pay hitting your account on time, consistency is key. You'll submit your hours by Monday at 10:00 a.m., and your supervisor and case manager will quickly review and approve them by Tuesday morning.",
        help: "Consistent weekly timesheets guarantee timely payroll every single week.",
        type: "single",
        layout: "compact",
        choices: [
          {
            value: "monday-timesheet-timeline",
            label: "I understand the weekly timeline to submit my timesheet by Monday morning so my team can verify and approve it.",
            detail: "Monday 10:00 a.m. submission deadline → Tuesday morning approvals.",
            icon: "⏰"
          }
        ]
      },
      {
        name: "wagesDirectDeposit",
        badge: "Your Weekly Payday (Wages & Direct Deposit)",
        prompt: "Hard work deserves reliable pay. Depending on your role and location, you'll earn between $7.25 and $19.66 per hour, with direct deposit payments hitting your account every Friday for all hours worked.",
        help: "Direct deposit ensures reliable weekly cash flow for all hours worked.",
        type: "single",
        layout: "compact",
        choices: [
          {
            value: "friday-direct-deposit",
            label: "Sounds great—I'm ready to earn competitive wages and receive my direct deposit every Friday (keeping in mind timecards reflect hours worked, excluding lunch and breaks).",
            detail: "Wages $7.25 to $19.66/hr · Weekly Friday direct deposit.",
            icon: "💵"
          }
        ]
      },
      {
        name: "requiredForms",
        badge: "Your Checklist for Success (Required Forms)",
        prompt: "Before you step onto the job site and officially begin your assignment, we just need to get three quick documents uploaded to your file:",
        help: "Checklist items: 1. Sirius Workforce Development Placement Form · 2. Worksite Agreement · 3. Participant Program Information and Guidelines Receipt Form",
        type: "single",
        layout: "compact",
        choices: [
          {
            value: "all-three-forms-ready",
            label: "All documents are ready to be uploaded so I can start my assignment with confidence.",
            detail: "Sirius Placement Form, Worksite Agreement & Participant Guidelines Receipt.",
            icon: "📑"
          }
        ]
      }
    );

    return questions;
  };

  const isMultiChoice = (question) => question.type === "multiple";

  const showCenterOnMap = (center) => {
    selectedCareerCenter = center;
    centerMap.src = `https://www.google.com/maps?q=${encodeURIComponent(`${center.name}, ${center.address}`)}&output=embed`;
    centerMap.title = `Interactive map showing ${center.name}`;
    centerMapCaption.textContent = `Map showing ${center.name}. Use the map controls to zoom or explore nearby streets.`;
  };

  const distanceInMiles = (latitudeA, longitudeA, latitudeB, longitudeB) => {
    const radians = (degrees) => degrees * (Math.PI / 180);
    const earthRadiusMiles = 3958.8;
    const latitudeDelta = radians(latitudeB - latitudeA);
    const longitudeDelta = radians(longitudeB - longitudeA);
    const haversine = Math.sin(latitudeDelta / 2) ** 2 +
      Math.cos(radians(latitudeA)) * Math.cos(radians(latitudeB)) * Math.sin(longitudeDelta / 2) ** 2;
    return earthRadiusMiles * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
  };

  const renderCareerCenters = () => {
    centerList.replaceChildren();
    careerCenters.forEach((center) => {
      const card = document.createElement("article");
      card.className = "wizard-center-card";
      card.dataset.selected = String(center.name === selectedCareerCenter.name);

      const heading = document.createElement("h3");
      heading.textContent = center.name;
      const address = document.createElement("p");
      address.textContent = center.address;
      if (nearestCenterId === center.id) {
        const nearest = document.createElement("p");
        nearest.textContent = "Approximate closest match based on city location";
        card.append(heading, address, nearest);
      } else {
        card.append(heading, address);
      }
      const hours = document.createElement("p");
      hours.textContent = center.hours;
      const phone = document.createElement("p");
      phone.textContent = center.phone;

      const actions = document.createElement("div");
      actions.className = "wizard-center-actions";
      const mapButton = document.createElement("button");
      mapButton.type = "button";
      mapButton.className = "wizard-button secondary";
      mapButton.textContent = "Show on map";
      mapButton.setAttribute("aria-pressed", String(center.name === selectedCareerCenter.name));
      mapButton.addEventListener("click", () => {
        showCenterOnMap(center);
        selectedAppointmentDate = "";
        selectedAppointmentTime = "";
        renderCareerCenters();
        renderAppointmentCalendar();
      });
      actions.append(mapButton);

      const phoneLink = document.createElement("a");
      phoneLink.className = "wizard-button secondary";
      phoneLink.href = center.callLink;
      phoneLink.textContent = "Call center";
      actions.append(phoneLink);

      if (directionsOrigin) {
        const directionsLink = document.createElement("a");
        directionsLink.className = "wizard-button";
        directionsLink.href = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(directionsOrigin)}&destination=${encodeURIComponent(`${center.name}, ${center.address}`)}`;
        directionsLink.target = "_blank";
        directionsLink.rel = "noopener noreferrer";
        directionsLink.textContent = "Get directions →";
        actions.append(directionsLink);
      }

      card.append(hours, phone, actions);
      centerList.append(card);
    });
  };

  const toLocalDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getSampleDates = () => {
    const dates = [];
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    while (dates.length < 7) {
      if (date.getDay() !== 0 && date.getDay() !== 6) dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return dates;
  };

  const renderAppointmentCalendar = () => {
    calendarDays.replaceChildren();
    appointmentTimes.replaceChildren();
    calendarStatus.textContent = "Choose a day to see sample appointment times.";
    previewAppointmentButton.disabled = !(selectedAppointmentDate && selectedAppointmentTime);

    getSampleDates().forEach((date) => {
      const dateValue = toLocalDateString(date);
      const dateButton = document.createElement("button");
      dateButton.type = "button";
      dateButton.className = "wizard-calendar-date";
      dateButton.setAttribute("aria-pressed", String(dateValue === selectedAppointmentDate));
      dateButton.setAttribute("aria-label", date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }));
      const day = document.createElement("span");
      day.textContent = date.toLocaleDateString(undefined, { weekday: "short" });
      const dateText = document.createElement("strong");
      dateText.textContent = date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
      dateButton.append(day, dateText);
      dateButton.addEventListener("click", () => {
        selectedAppointmentDate = dateValue;
        selectedAppointmentTime = "";
        renderAppointmentCalendar();
      });
      calendarDays.append(dateButton);
    });

    if (!selectedAppointmentDate) return;
    const chosenDate = new Date(`${selectedAppointmentDate}T12:00:00`);
    calendarStatus.textContent = `Sample times for ${chosenDate.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })} at ${selectedCareerCenter.name}.`;
    sampleAppointmentTimes.forEach((time) => {
      const timeButton = document.createElement("button");
      timeButton.type = "button";
      timeButton.className = "wizard-time-option";
      timeButton.textContent = time;
      timeButton.setAttribute("aria-pressed", String(time === selectedAppointmentTime));
      timeButton.addEventListener("click", () => {
        selectedAppointmentTime = time;
        previewAppointmentButton.disabled = false;
        renderAppointmentCalendar();
      });
      appointmentTimes.append(timeButton);
    });
  };

  const updateProgress = (question, questionIndex, questionCount) => {
    if (question.badge) {
      stepCount.textContent = `${question.badge.split(" · ")[0]} · Step ${questionIndex + 1} of ${questionCount}`;
    } else {
      stepCount.textContent = `Question ${questionIndex + 1} of ${questionCount}`;
    }
    const percentage = Math.round(((questionIndex + 1) / questionCount) * 100);
    progressValue.style.width = `${percentage}%`;
    progressTrack.setAttribute("aria-valuenow", String(percentage));
    nextButton.hidden = !isMultiChoice(question);
    backButton.hidden = questionIndex === 0;
    nextButton.textContent = questionIndex === questionCount - 1 ? "See my profile & next step →" : "Continue →";
  };

  const renderChoice = (question, choice, index) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    const isScenario = question.layout === "scenarios" && Boolean(choice.image);

    input.type = isMultiChoice(question) ? "checkbox" : "radio";
    input.name = question.name;
    input.value = choice.value;
    input.id = `${question.name}-${index}`;
    input.checked = isMultiChoice(question)
      ? (answers[question.name] || []).includes(choice.value)
      : answers[question.name] === choice.value;
    if (!isMultiChoice(question)) input.required = true;

    if (isScenario) {
      label.className = "wizard-scenario";
      label.htmlFor = input.id;
      label.append(input);
      const photo = document.createElement("span");
      photo.className = "wizard-scenario-photo";
      photo.setAttribute("aria-hidden", "true");
      if (choice.image) {
        const image = document.createElement("img");
        image.src = choice.image;
        image.alt = "";
        image.loading = "lazy";
        photo.append(image);
      }
      const mark = document.createElement("span");
      mark.className = "wizard-scenario-mark";
      mark.textContent = choice.icon || "✦";
      photo.append(mark);
      label.append(photo);
      const copy = document.createElement("span");
      copy.className = "wizard-scenario-copy";
      const title = document.createElement("strong");
      title.textContent = choice.label;
      copy.append(title);
      if (choice.detail) {
        const detail = document.createElement("span");
        detail.textContent = choice.detail;
        copy.append(detail);
      }
      label.append(copy);
      return label;
    }

    label.className = "wizard-choice";
    label.htmlFor = input.id;
    label.append(input);
    if (choice.icon) {
      const icon = document.createElement("span");
      icon.className = "wizard-choice-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = choice.icon;
      label.append(icon);
    }
    const copy = document.createElement("span");
    copy.className = "wizard-choice-copy";
    const title = document.createElement("strong");
    title.textContent = choice.label;
    copy.append(title);
    if (choice.detail) {
      const detail = document.createElement("span");
      detail.textContent = choice.detail;
      copy.append(detail);
    }
    label.append(copy);
    return label;
  };

  const renderQuestion = () => {
    const questions = getQuestions();
    currentQuestion = Math.min(currentQuestion, questions.length - 1);
    const question = questions[currentQuestion];
    questionMount.replaceChildren();
    questionError.textContent = "";
    updateProgress(question, currentQuestion, questions.length);

    const fieldset = document.createElement("fieldset");
    fieldset.className = "wizard-fieldset";
    fieldset.setAttribute("aria-describedby", question.help ? "activeQuestionHelp" : "");

    if (question.chapter) {
      const chapter = document.createElement("span");
      chapter.className = "wizard-eyebrow";
      chapter.style.display = "block";
      chapter.style.marginBottom = "0.4rem";
      chapter.textContent = question.chapter;
      fieldset.append(chapter);
    }

    if (question.badge) {
      const badge = document.createElement("span");
      badge.className = "wizard-code";
      badge.style.display = "inline-flex";
      badge.style.marginBottom = "0.75rem";
      badge.textContent = question.badge;
      fieldset.append(badge);
    }

    const legend = document.createElement("legend");
    legend.id = "questionTitle";
    legend.className = "wizard-question";
    legend.tabIndex = -1;
    legend.textContent = question.prompt;
    fieldset.append(legend);

    if (question.help) {
      const help = document.createElement("p");
      help.id = "activeQuestionHelp";
      help.className = "wizard-help";
      help.textContent = question.help;
      fieldset.append(help);
    }

    const options = document.createElement("div");
    options.className = `wizard-${question.layout === "scenarios" ? "scenarios" : "options"}${question.layout === "compact" ? " is-compact" : question.layout === "chips" ? " is-chips" : ""}`;
    question.choices.forEach((choice, index) => options.append(renderChoice(question, choice, index)));
    fieldset.append(options);
    questionMount.append(fieldset);

    fieldset.addEventListener("change", (event) => {
      const input = event.target;
      if (!(input instanceof HTMLInputElement)) return;
      questionError.textContent = "";
      if (isMultiChoice(question)) {
        const checked = Array.from(fieldset.querySelectorAll('input[type="checkbox"]:checked'));
        const exclusiveChoice = input.value === "none" || input.value === "unsure";
        if (exclusiveChoice && input.checked) {
          checked.forEach((other) => { if (other !== input) other.checked = false; });
        } else if (input.checked) {
          fieldset.querySelectorAll('input[value="none"], input[value="unsure"]').forEach((other) => { other.checked = false; });
        }
        answers[question.name] = Array.from(fieldset.querySelectorAll('input[type="checkbox"]:checked')).map((item) => item.value);
        return;
      }

      const previousAge = answers.age;
      answers[question.name] = input.value;
      if (question.name === "age") {
        youthWorkHistoryApplies = input.value === "18-24";
        if (previousAge !== input.value) delete answers.youthWbl;
      }
      if (question.name === "age" && input.value === "under-18") {
        showResult("not-eligible", "Age is the only thing holding this path back right now.", "Transitional Jobs is for adults 18 and older. You can still talk with Springboards about other ways to learn a trade and build your future.");
        return;
      }
      if (question.name === "apprentice" && input.value === "yes") {
        showResult("not-eligible", "You’re already on an apprenticeship path.", "Apprentices are not eligible for Transitional Jobs. Keep building on the path you’re on, and reach out if you want to explore other Springboards support.");
        return;
      }
      if (question.name === "youthWbl" && input.value === "yes") {
        showResult("not-eligible", "This Transitional Jobs path may not be the right fit today.", "Young people who have already taken part in work-based learning are not eligible for this program. Your skills still matter—our team can help you explore another next step.");
        return;
      }
      const latestQuestions = getQuestions();
      const nextQuestion = latestQuestions[currentQuestion + 1];
      if (nextQuestion) {
        currentQuestion += 1;
        renderQuestion();
      } else {
        evaluateAnswers();
      }
    });

    legend.focus({ preventScroll: true });
  };

  const addTag = (label) => {
    const item = document.createElement("li");
    item.className = "wizard-tag";
    item.textContent = label;
    profileTags.append(item);
  };

  const renderProfile = (outcome) => {
    profileTags.replaceChildren();
    const barrierValues = answers.barriers || [];
    const chronicValues = answers.chronic || [];
    barrierValues.forEach((value) => {
      const item = barrierChoices.find((choice) => choice.value === value);
      if (item && value !== "none" && value !== "unsure") addTag(item.detail);
    });
    chronicValues.forEach((value) => {
      const item = chronicChoices.find((choice) => choice.value === value);
      if (item && value !== "none" && value !== "unsure") addTag(item.detail);
    });
    if (answers.inconsistentWork === "yes") addTag("Short-term jobs with gaps between work");
    if (youthWorkHistoryApplies) addTag("Young adult · ages 18–24");

    const visionMap = {
      healthcare: "Placement Track: Healthcare / Medical Services",
      manufacturing: "Placement Track: Advanced Manufacturing & Tech",
      community: "Placement Track: Community Services / Public Sector",
      undecided: "Placement Track: Open to Discovery"
    };
    if (answers.placementVision && visionMap[answers.placementVision]) {
      addTag(visionMap[answers.placementVision]);
    }

    const skillMap = {
      alison: "195-Hr Credential: Alison Online via AlabamaWorks!",
      "skills-for-success": "195-Hr Credential: Skills for Success",
      maps: "195-Hr Credential: MAPs Modules",
      ace: "195-Hr Credential: ACE Training"
    };
    if (answers.skillBoost && skillMap[answers.skillBoost]) {
      addTag(skillMap[answers.skillBoost]);
    }

    if (answers.scheduleCommitment === "ready-schedule") {
      addTag("Schedule: 32 hrs/wk (390 Max Hours)");
    } else if (answers.scheduleCommitment === "constraints") {
      addTag("Schedule: Scheduling constraints to discuss");
    }

    if (answers.subsidizedPayroll === "confirmed-transitional") {
      addTag("Payroll: 100% Subsidized (Sirius Workforce LLC)");
    } else if (answers.subsidizedPayroll === "need-discussion") {
      addTag("Apprenticeship/Track Consultation Requested");
    }

    if (answers.worksiteEnvironment === "ready-explore-worksites") {
      addTag("Worksite: Vetted Public, Non-Profit & Private Options");
    }
    if (answers.worksiteAgreement === "confirm-worksite-rules") {
      addTag("Worksite Agreement & Orientation Confirmed");
    }
    if (answers.prohibitedActivities === "respect-professional-standards") {
      addTag("Professional Standards: Respectful & Safe Workplace");
    }
    if (answers.worksiteSelection === "match-iep-goals") {
      addTag("Worksite Aligned with IEP Goals");
    }
    if (answers.workersCompensation === "reassured-sirius-coverage") {
      addTag("Sirius Workers' Comp Injury Coverage Active");
    }
    if (answers.payrollOnboarding === "sirius-form-email-ready") {
      addTag("Sirius Onboarding Form Ready (5-Day Window)");
    }
    if (answers.timesheetRhythm === "monday-timesheet-timeline") {
      addTag("Timesheets: Monday 10:00 AM Submission Schedule");
    }
    if (answers.wagesDirectDeposit === "friday-direct-deposit") {
      addTag("Weekly Pay: $7.25–$19.66/hr Friday Direct Deposit");
    }
    if (answers.requiredForms === "all-three-forms-ready") {
      addTag("Checklist: 3 Required Onboarding Forms Ready");
    }

    if (contactButton) {
      const vText = visionMap[answers.placementVision] || "Open to Discovery";
      const sText = skillMap[answers.skillBoost] || "Credential booster";
      const schedText = answers.scheduleCommitment === "ready-schedule" ? "32 hrs/wk committed" : "Scheduling constraints noted";
      const payText = answers.subsidizedPayroll === "confirmed-transitional" ? "Transitional track confirmed" : "Advisor discussion requested";
      const subject = encodeURIComponent("Transitional Jobs Eligibility & Placement Profile");
      const body = encodeURIComponent(
        `Hello Springboards Team,\n\nI just completed my Eligibility, Placement, and Worksite onboarding checkpoints:\n\n` +
        `• Activity Code: 220 (Springboards Transitional Jobs)\n` +
        `• ${vText}\n` +
        `• ${sText}\n` +
        `• Schedule: ${schedText}\n` +
        `• Subsidized Payroll: ${payText}\n` +
        `• Worksite & Safety: Vetted site matching IEP, Workers' Comp active\n` +
        `• Timesheet Rhythm: Monday 10:00 a.m. submission routine\n` +
        `• Weekly Payday: Friday Direct Deposit ($7.25–$19.66/hr)\n` +
        `• Onboarding Package: 3 required forms ready for upload\n\n` +
        `I am ready to connect on next steps with my local Career Center!`
      );
      contactButton.href = `mailto:info@springboardsfcd.org?cc=supportiveservices@workforce.alabama.gov&subject=${subject}&body=${body}`;
    }

    if (!profileTags.childElementCount) {
      const fallback = outcome === "not-eligible"
        ? "No matching barrier or work-history tags selected"
        : "A team member can help fill in the details";
      addTag(fallback);
    }
  };

  const renderDocumentReadiness = () => {
    const selectedDocuments = answers.documents || [];
    if (!selectedDocuments.length) {
      documentReadiness.hidden = true;
      return;
    }

    documentReadiness.hidden = false;
    missingDocuments.replaceChildren();
    const requirements = [
      { value: "photo-id", label: "Valid state or government photo ID" },
      { value: "social-security-card", label: "Original Social Security card" }
    ];
    const benefitsDocumentationMayApply = (answers.barriers || []).includes("public-assistance") || (answers.chronic || []).includes("ui");
    if (benefitsDocumentationMayApply) {
      requirements.push({ value: "benefit-proof", label: "Proof of SNAP, public benefits, or unemployment assistance, if applicable" });
    }

    const isUnsure = selectedDocuments.includes("unsure");
    const missing = requirements.filter((item) => !selectedDocuments.includes(item.value));
    const isReady = missing.length === 0 && !isUnsure && !selectedDocuments.includes("none");
    if (isReady) {
      documentReadinessStatus.textContent = "You’ve marked all the listed documents as ready to bring. Nice work—you’re prepared for the next conversation.";
      return;
    }

    if (isUnsure) {
      documentReadinessStatus.textContent = "A Career Center team member can confirm which documents apply to your situation.";
    } else if (missing.length) {
      documentReadinessStatus.textContent = "You may still need to gather these items before your visit:";
    } else {
      documentReadinessStatus.textContent = "You marked that your documents aren’t ready yet. That won’t change this eligibility pre-screen; a team member can help you plan what to bring.";
    }
    missing.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.textContent = item.label;
      missingDocuments.append(listItem);
    });
  };

  function showResult(outcome, message, title) {
    questionScreen.hidden = true;
    resultScreen.hidden = false;
    centerScreen.hidden = true;
    resultTop.dataset.outcome = outcome;
    activityCode.hidden = outcome !== "eligible";
    seeNextStepButton.hidden = outcome !== "eligible";
    if (outcome === "eligible") {
      resultEyebrow.textContent = "YOUR TRANSITIONAL JOBS PROFILE";
      resultTitle.textContent = "This could be your next step.";
      resultMessage.textContent = "Your answers line up with the starting points for paid work experience and hands-on skill-building. Let’s keep the momentum going with a conversation.";
      profileIntro.textContent = "Based on what you shared, here are the strengths and experiences to bring into your next-step conversation:";
    } else if (outcome === "not-eligible") {
      resultEyebrow.textContent = "A DIFFERENT NEXT STEP";
      resultTitle.textContent = title || "Not eligible for Transitional Jobs right now";
      resultMessage.textContent = message || "Your answers do not match the starting requirements for this paid work experience path. Springboards can still talk with you about other ways to build skills.";
      profileIntro.textContent = "Here’s a simple snapshot of what you shared:";
    } else {
      resultEyebrow.textContent = "LET’S CHECK THIS TOGETHER";
      resultTitle.textContent = "A quick conversation can help.";
      resultMessage.textContent = "There may be a path here, and a couple of details need a closer look. Our team can help connect the dots—no need to figure it all out alone.";
      profileIntro.textContent = "Here are the work and life experiences you selected. A team member can help confirm anything still unclear:";
    }
    renderProfile(outcome);
    renderDocumentReadiness();
    resultTitle.focus();
  }

  function evaluateAnswers() {
    const barriers = answers.barriers || [];
    const chronic = answers.chronic || [];
    const hasBarrier = barriers.some((value) => value !== "none" && value !== "unsure");
    const hasChronicCriterion = chronic.some((value) => value !== "none" && value !== "unsure");
    const hasInconsistentCriterion = answers.inconsistentWork === "yes";
    const hasEmploymentCriterion = hasChronicCriterion || hasInconsistentCriterion;
    const hasHardExclusion = answers.age === "under-18" || answers.apprentice === "yes" || answers.youthWbl === "yes";
    const ageIsAdult = answers.age === "18-24" || answers.age === "25-plus";

    if (hasHardExclusion) {
      showResult("not-eligible");
      return;
    }

    const barrierWasUnclear = !hasBarrier && barriers.includes("unsure");
    const employmentWasUnclear = !hasEmploymentCriterion && (chronic.includes("unsure") || answers.inconsistentWork === "unsure");
    const exclusionWasUnclear = answers.age === "unsure" || answers.apprentice === "unsure" || (youthWorkHistoryApplies && answers.youthWbl === "unsure");
    if (exclusionWasUnclear || barrierWasUnclear || employmentWasUnclear) {
      showResult("review");
      return;
    }

    if (!ageIsAdult || !hasBarrier || !hasEmploymentCriterion) {
      let message = "Based on these answers, the starting requirements for this program are not all in place yet. A Career Center or Springboards team member can help you explore other ways to move forward.";
      if (!hasBarrier) message = "This path needs at least one listed barrier to employment, and none were selected. That does not close the door on other ways to build skills—let’s find a path that fits.";
      else if (!hasEmploymentCriterion) message = "This path looks for one qualifying work-history situation or a pattern of shorter jobs with gaps. A team member can help explore other opportunities if those don’t fit your story.";
      showResult("not-eligible", message);
      return;
    }

    showResult("eligible");
  }

  questionForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const question = getQuestions()[currentQuestion];
    if (!isMultiChoice(question)) return;
    const selected = Array.from(questionForm.querySelectorAll(`input[name="${question.name}"]:checked`)).map((input) => input.value);
    if (!selected.length) {
      questionError.textContent = "Choose the answer that feels closest to your situation to keep going.";
      questionForm.querySelector("input")?.focus();
      return;
    }
    answers[question.name] = selected;
    const questions = getQuestions();
    if (currentQuestion < questions.length - 1) {
      currentQuestion += 1;
      renderQuestion();
    } else {
      evaluateAnswers();
    }
  });

  seeNextStepButton.addEventListener("click", () => {
    resultScreen.hidden = true;
    centerScreen.hidden = false;
    centerHeading.focus();
  });

  centerBackButton.addEventListener("click", () => {
    centerScreen.hidden = true;
    resultScreen.hidden = false;
    resultTitle.focus();
  });

  addressSearchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const address = startingAddress.value.trim();
    if (address.length < 3) {
      addressSearchStatus.textContent = "Enter a street address, city, or ZIP code to find the closest center.";
      startingAddress.focus();
      return;
    }
    const submitButton = addressSearchForm.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;
    addressSearchStatus.textContent = "Finding the closest center…";

    fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&country=United%20States&q=${encodeURIComponent(address)}`, {
      headers: { Accept: "application/json" }
    })
      .then((response) => {
        if (!response.ok) throw new Error("Address lookup is unavailable.");
        return response.json();
      })
      .then((matches) => {
        const match = matches[0];
        if (!match || !Number.isFinite(Number(match.lat)) || !Number.isFinite(Number(match.lon))) {
          throw new Error("We couldn’t match that address.");
        }
        const latitude = Number(match.lat);
        const longitude = Number(match.lon);
        const rankedCenters = careerCenters
          .map((center) => ({
            center,
            miles: distanceInMiles(latitude, longitude, center.latitude, center.longitude)
          }))
          .sort((first, second) => first.miles - second.miles);
        const nearest = rankedCenters[0];
        directionsOrigin = address;
        nearestCenterId = nearest.center.id;
        selectedAppointmentDate = "";
        selectedAppointmentTime = "";
        showCenterOnMap(nearest.center);
        addressSearchStatus.textContent = `Approximate closest match: ${nearest.center.name}, based on city location. Choose a sample visit time below.`;
        renderCareerCenters();
        renderAppointmentCalendar();
      })
      .catch((error) => {
        directionsOrigin = address;
        addressSearchStatus.textContent = `${error.message} You can still compare the centers below or open directions from your address.`;
        renderCareerCenters();
      })
      .finally(() => {
        if (submitButton) submitButton.disabled = false;
      });
  });

  previewAppointmentButton.addEventListener("click", () => {
    if (!selectedAppointmentDate || !selectedAppointmentTime) return;
    const chosenDate = new Date(`${selectedAppointmentDate}T12:00:00`);
    const formattedDate = chosenDate.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
    calendarStatus.textContent = `You selected ${selectedAppointmentTime} on ${formattedDate} at ${selectedCareerCenter.name}. This preview has not booked or reserved a visit. Call ${selectedCareerCenter.phone} to confirm.`;
  });

  backButton.addEventListener("click", () => {
    if (currentQuestion === 0) return;
    const previousQuestion = getQuestions()[currentQuestion - 1];
    currentQuestion -= 1;
    if (previousQuestion?.name === "age") {
      youthWorkHistoryApplies = false;
    }
    renderQuestion();
  });

  restartButton.addEventListener("click", () => {
    Object.keys(answers).forEach((key) => delete answers[key]);
    currentQuestion = 0;
    youthWorkHistoryApplies = false;
    startingAddress.value = "";
    addressSearchStatus.textContent = "";
    directionsOrigin = "";
    nearestCenterId = "";
    selectedAppointmentDate = "";
    selectedAppointmentTime = "";
    showCenterOnMap(careerCenters[0]);
    resultScreen.hidden = true;
    centerScreen.hidden = true;
    questionScreen.hidden = false;
    renderCareerCenters();
    renderAppointmentCalendar();
    renderQuestion();
  });

  renderCareerCenters();
  renderAppointmentCalendar();
  renderQuestion();
})();
