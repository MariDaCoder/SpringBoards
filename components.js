/**
 * Springboards for Community Development
 * Reusable Layout Components, Dynamic CMS Schema, Localization (i18n) & Workflow Engine (/components.js)
 *
 * Principles:
 * 1. Flat DOM Hierarchy: Avoids unnecessary wrapper divs or deep nesting (max 2 levels).
 * 2. Component Properties (data-prop-*): Each instance accepts unique content and
 *    visual variant properties without duplicating structural markup or CSS.
 * 3. Relational CMS Schema & Dynamic Content: Defines structured Collections, field
 *    validation rules, 1:N / M:N relationships, and declarative dynamic rendering.
 * 4. Localization & Publishing Governance: Built-in en-US / es-US translation dictionary,
 *    localized SEO/hreflang generator, and 4-stage publishing workflow validator.
 */
(function () {
  'use strict';

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ==========================================================================
     1. CANONICAL FOLDER-BASED URL ROUTING MAP (Zero Duplicate Pages)
     ========================================================================== */
  var CANONICAL_ROUTE_MAP = {
    '/index.html': '/',
    '/train': '/programs/train',
    '/train.html': '/programs/train',
    '/programs/train/index.html': '/programs/train',
    '/eligibility': '/programs/eligibility',
    '/eligibility.html': '/programs/eligibility',
    '/programs/eligibility/index.html': '/programs/eligibility',
    '/volunteer': '/community/volunteer',
    '/volunteer.html': '/community/volunteer',
    '/community/volunteer/index.html': '/community/volunteer',
    '/partner': '/community/partner',
    '/partner.html': '/community/partner',
    '/community/partner/index.html': '/community/partner',
    '/donate': '/community/donate',
    '/donate.html': '/community/donate',
    '/community/donate/index.html': '/community/donate',
    '/style-guide': '/resources/style-guide',
    '/style-guide.html': '/resources/style-guide',
    '/resources/style-guide/index.html': '/resources/style-guide',
    '/cms-workflows': '/resources/cms-workflows',
    '/cms-workflows.html': '/resources/cms-workflows',
    '/resources/cms-workflows/index.html': '/resources/cms-workflows',
    '/backoffice': '/resources/backoffice',
    '/backoffice.html': '/resources/backoffice',
    '/resources/backoffice/index.html': '/resources/backoffice',
    '/portal': '/resources/backoffice',
    '/search': '/utility/search',
    '/search.html': '/utility/search',
    '/utility/search/index.html': '/utility/search',
    '/password': '/utility/password',
    '/password.html': '/utility/password',
    '/401': '/utility/password',
    '/utility/password/index.html': '/utility/password',
    '/privacy': '/utility/privacy-terms',
    '/terms': '/utility/privacy-terms',
    '/legal': '/utility/privacy-terms',
    '/privacy-terms': '/utility/privacy-terms',
    '/utility/privacy-terms/index.html': '/utility/privacy-terms',
    '/pathways': '/programs/pathways',
    '/programs/pathways/index.html': '/programs/pathways'
  };

  function normalizeRoute(pathOrHref) {
    if (!pathOrHref) return '/';
    var str = String(pathOrHref);
    if (str.indexOf('#') === 0 || str.indexOf('mailto:') === 0 || str.indexOf('tel:') === 0 || str.indexOf('http') === 0) {
      return str;
    }
    var parts = str.split('#');
    var queryParts = parts[0].split('?');
    var cleanPath = queryParts[0].replace(/\/+$/, '') || '/';
    var mapped = CANONICAL_ROUTE_MAP[cleanPath] || cleanPath;
    var suffix = (queryParts[1] ? '?' + queryParts[1] : '') + (parts[1] ? '#' + parts[1] : '');
    return mapped + suffix;
  }

  /* ==========================================================================
     2. WELL-PLANNED CMS SCHEMA: COLLECTIONS, FIELDS, VALIDATION & RELATIONSHIPS
     ========================================================================== */
  var COLLECTION_PUBLISHING_SETTINGS = {
    tradePrograms: {
      collectionId: 'tradePrograms',
      label: 'Trade Training Pathways',
      publishTemplatePages: true,
      folderPrefix: '/programs/pathways',
      urlPattern: '/programs/pathways/{slug}',
      canonicalParent: '/programs/train',
      indexableBySearch: true,
      blockDraftsAndInternal: true,
      blockEmptyContent: true,
      governanceNote: 'Public Collection template pages enabled under /programs/pathways/{slug} for published, non-empty trade curricula only.'
    },
    careerCenters: {
      collectionId: 'careerCenters',
      label: 'Regional WIOA Career Centers',
      publishTemplatePages: false,
      folderPrefix: null,
      urlPattern: '/programs/eligibility#{slug}',
      canonicalParent: '/programs/eligibility',
      indexableBySearch: false,
      blockDraftsAndInternal: true,
      blockEmptyContent: true,
      governanceNote: 'Collection template publishing DISABLED. Career Centers render inline inside /programs/eligibility and Trade Pathway templates to prevent thin standalone pages.'
    },
    partnerDirectory: {
      collectionId: 'partnerDirectory',
      label: 'Employer & Resource Partner Tracks',
      publishTemplatePages: false,
      folderPrefix: null,
      urlPattern: '/community/partner#{slug}',
      canonicalParent: '/community/partner',
      indexableBySearch: false,
      blockDraftsAndInternal: true,
      blockEmptyContent: true,
      governanceNote: 'Collection template publishing DISABLED. Partner tracks render inline on /community/partner and link relationally to Trade Pathways.'
    },
    faqItems: {
      collectionId: 'faqItems',
      label: 'Frequently Asked Questions',
      publishTemplatePages: false,
      folderPrefix: null,
      urlPattern: '/programs/train#faq',
      canonicalParent: '/programs/train',
      indexableBySearch: false,
      blockDraftsAndInternal: true,
      blockEmptyContent: true,
      governanceNote: 'Collection template publishing DISABLED. FAQ items are embedded components and never generate standalone public URLs.'
    },
    utilityPages: {
      collectionId: 'utilityPages',
      label: 'System & Governance Utility Pages',
      publishTemplatePages: false,
      folderPrefix: null,
      urlPattern: '{canonicalPath}',
      canonicalParent: '/resources/cms-workflows',
      indexableBySearch: false,
      blockDraftsAndInternal: true,
      blockEmptyContent: true,
      governanceNote: 'Collection template publishing DISABLED. Utility items reference dedicated static routes (/utility/search, /utility/password, /404.html) rather than dynamic CMS templates.'
    }
  };

  var CMS_IMPORT_FIELD_MAPS = {
    tradePrograms: {
      Program_ID: 'id',
      URL_Slug: 'slug',
      Curriculum_Code: 'code',
      Trade_Cluster: 'category',
      Program_Title_EN: 'title.en-US',
      Program_Title_ES: 'title.es-US',
      Summary_EN: 'summary.en-US',
      Summary_ES: 'summary.es-US',
      Cert_Credential: 'credential',
      Max_WIOA_Hours: 'hoursCap',
      Tuition_Policy: 'tuitionCost',
      Career_Center_Refs: 'careerCenterIds',
      Partner_Refs: 'partnerTrackIds',
      Publish_Status: 'status',
      Is_Internal_Only: 'isInternal'
    },
    careerCenters: {
      Center_ID: 'id',
      Center_Slug: 'slug',
      Center_Name_EN: 'name.en-US',
      Center_Name_ES: 'name.es-US',
      State_Code: 'state',
      Workforce_Board: 'wioaSystem',
      Counties_Covered: 'countiesServed',
      Street_Address: 'address',
      Direct_Phone: 'phone',
      Funded_Program_IDs: 'eligibleProgramIds'
    },
    partnerDirectory: {
      Track_ID: 'id',
      Track_Slug: 'slug',
      Track_Title_EN: 'title.en-US',
      Track_Title_ES: 'title.es-US',
      Partnership_Category: 'partnershipType',
      Reimbursement_Terms: 'reimbursementModel',
      Value_Prop_EN: 'summary.en-US',
      Value_Prop_ES: 'summary.es-US',
      Supported_Program_IDs: 'tradeProgramIds'
    }
  };

  var COLLECTIONS_SCHEMA = {
    tradePrograms: {
      collectionId: 'tradePrograms',
      label: 'Trade Training Pathways',
      singularLabel: 'Trade Pathway',
      urlPattern: '/programs/pathways/{slug}',
      publishTemplatePages: true,
      description: 'Core tuition-free construction and mechanical trade curricula offered at the Shawmut Training Center.',
      fields: [
        { name: 'id', type: 'string', required: true, description: 'Unique immutable primary key (e.g., prog-carpentry)' },
        { name: 'slug', type: 'slug', required: true, pattern: '^[a-z0-9-]+$', description: 'URL-safe identifier for dynamic folder path /programs/pathways/{slug}' },
        { name: 'code', type: 'string', required: true, description: 'Editorial curriculum index numeral (01–06)' },
        { name: 'category', type: 'enum', options: ['construction', 'mechanical', 'readiness'], required: true, description: 'Primary trade cluster for filtering' },
        { name: 'title', type: 'localized-string', locales: ['en-US', 'es-US'], required: true, maxLength: 70, description: 'Bilingual program title' },
        { name: 'summary', type: 'localized-string', locales: ['en-US', 'es-US'], required: true, maxLength: 220, description: 'Bilingual card summary copy' },
        { name: 'credential', type: 'string', required: true, description: 'Industry certification earned (NCCER, OSHA-10, EPA 608)' },
        { name: 'hoursCap', type: 'number', required: true, description: 'Maximum WIOA Activity 220 paid transitional hours (390)' },
        { name: 'tuitionCost', type: 'string', required: true, description: 'Participant tuition requirement ($0 / 100% Tuition-Free)' },
        { name: 'careerCenterIds', type: 'multi-reference', targetCollection: 'careerCenters', required: true, description: 'Authorized Career Centers verifying WIOA intake for this pathway' },
        { name: 'partnerTrackIds', type: 'multi-reference', targetCollection: 'partnerDirectory', required: true, description: 'Employer OJT & material partner tracks linked to this trade' },
        { name: 'status', type: 'enum', options: ['published', 'draft', 'archived'], required: false, description: 'Publishing lifecycle state (only published items generate live template URLs)' }
      ]
    },
    careerCenters: {
      collectionId: 'careerCenters',
      label: 'Regional WIOA Career Centers',
      singularLabel: 'Career Center',
      urlPattern: '/programs/eligibility#{slug}',
      publishTemplatePages: false,
      description: 'Authorized Alabama Works! and WorkSource Georgia Career Centers providing Activity Code 220 & OJT eligibility verification.',
      fields: [
        { name: 'id', type: 'string', required: true, description: 'Primary key (e.g., cc-opelika)' },
        { name: 'slug', type: 'slug', required: true, description: 'URL-safe slug' },
        { name: 'name', type: 'localized-string', locales: ['en-US', 'es-US'], required: true, description: 'Official Career Center name' },
        { name: 'state', type: 'enum', options: ['AL', 'GA'], required: true, description: 'State workforce board jurisdiction' },
        { name: 'wioaSystem', type: 'string', required: true, description: 'Workforce system brand (Alabama Works! / WorkSource Georgia)' },
        { name: 'countiesServed', type: 'string', required: true, description: 'Counties covered by this center' },
        { name: 'address', type: 'string', required: true, description: 'Street address for in-person WIOA intake' },
        { name: 'phone', type: 'string', required: true, description: 'Direct Career Center telephone number' },
        { name: 'eligibleProgramIds', type: 'multi-reference', targetCollection: 'tradePrograms', required: true, description: 'Springboards trade programs funded by this center' }
      ]
    },
    partnerDirectory: {
      collectionId: 'partnerDirectory',
      label: 'Employer & Resource Partner Tracks',
      singularLabel: 'Partner Track',
      urlPattern: '/community/partner#{slug}',
      publishTemplatePages: false,
      description: 'Structured collaboration tracks for East Alabama contractors, OJT host employers, tool donors, and craft mentors.',
      fields: [
        { name: 'id', type: 'string', required: true, description: 'Primary key (e.g., part-ojt-host)' },
        { name: 'slug', type: 'slug', required: true, description: 'URL-safe slug' },
        { name: 'title', type: 'localized-string', locales: ['en-US', 'es-US'], required: true, description: 'Bilingual partnership track title' },
        { name: 'partnershipType', type: 'enum', options: ['OJT Host Employer', 'Material & Tool Donor', 'Guest Craft Mentor', 'Philanthropic Sponsor'], required: true, description: 'Classification of partner engagement' },
        { name: 'reimbursementModel', type: 'string', required: true, description: 'WIOA wage subsidy or 501(c)(3) tax deduction model' },
        { name: 'summary', type: 'localized-string', locales: ['en-US', 'es-US'], required: true, description: 'Bilingual partner value proposition' },
        { name: 'tradeProgramIds', type: 'multi-reference', targetCollection: 'tradePrograms', required: true, description: 'Related trade curricula supported by this partner track' }
      ]
    },
    faqItems: {
      collectionId: 'faqItems',
      label: 'Frequently Asked Questions',
      singularLabel: 'FAQ Entry',
      urlPattern: '/programs/train#faq',
      publishTemplatePages: false,
      description: 'Verified bilingual answers covering tuition-free funding, WIOA eligibility, schedule hours, and job placement.',
      fields: [
        { name: 'id', type: 'string', required: true, description: 'Primary key' },
        { name: 'category', type: 'enum', options: ['eligibility', 'training', 'outcomes'], required: true, description: 'FAQ filter category' },
        { name: 'question', type: 'localized-string', locales: ['en-US', 'es-US'], required: true, description: 'Question heading in English and Spanish' },
        { name: 'answer', type: 'localized-string', locales: ['en-US', 'es-US'], required: true, description: 'Rich text answer in English and Spanish' },
        { name: 'relatedProgramIds', type: 'multi-reference', targetCollection: 'tradePrograms', required: false, description: 'Associated trade pathways' }
      ]
    },
    utilityPages: {
      collectionId: 'utilityPages',
      label: 'System & Governance Utility Pages',
      singularLabel: 'Utility Page',
      urlPattern: '{canonicalPath}',
      publishTemplatePages: false,
      description: 'Core platform utility pages for search, password-protected gates, 404 recovery, legal/privacy, style guide, and CMS workflows.',
      fields: [
        { name: 'id', type: 'string', required: true, description: 'Primary key' },
        { name: 'canonicalPath', type: 'string', required: true, description: 'Clean folder URL path' },
        { name: 'httpStatus', type: 'string', required: true, description: 'HTTP status or gate classification (200, 401 Gate, 404 Recovery)' },
        { name: 'robotsPolicy', type: 'enum', options: ['index, follow', 'noindex, follow', 'noindex, nofollow'], required: true, description: 'Search crawler indexing directive' },
        { name: 'title', type: 'localized-string', locales: ['en-US', 'es-US'], required: true, description: 'Utility page title' },
        { name: 'purpose', type: 'localized-string', locales: ['en-US', 'es-US'], required: true, description: 'Functional role in site architecture' }
      ]
    }
  };

  /* ==========================================================================
     3. INITIAL SEEDED CMS COLLECTION DATA (WITH RELATIONAL KEYS & BILINGUAL COPY)
     ========================================================================== */
  var DEFAULT_CMS_DATA = {
    tradePrograms: [
      {
        id: 'prog-carpentry',
        slug: 'carpentry-framing',
        code: '01',
        category: 'construction',
        status: 'published',
        isInternal: false,
        title: {
          'en-US': 'Carpentry and Construction Basics',
          'es-US': 'Carpintería y Fundamentos de Construcción'
        },
        summary: {
          'en-US': 'Learn essential residential and commercial framing, blueprint reading, floor/wall layout, roof rafters, and power tool mastery on real workshop builds.',
          'es-US': 'Aprenda estructura residencial y comercial, lectura de planos, trazado de pisos y paredes, vigas de techo y manejo seguro de herramientas eléctricas.'
        },
        credential: 'NCCER Core & Carpentry Level 1 + OSHA-10',
        hoursCap: 390,
        tuitionCost: '$0 (100% Tuition-Free)',
        careerCenterIds: ['cc-opelika', 'cc-valley', 'cc-lagrange'],
        partnerTrackIds: ['part-ojt-host', 'part-materials-tools', 'part-craft-mentor']
      },
      {
        id: 'prog-electrical',
        slug: 'electrical-fundamentals',
        code: '02',
        category: 'mechanical',
        status: 'published',
        isInternal: false,
        title: {
          'en-US': 'Electrical Fundamentals & Wiring',
          'es-US': 'Fundamentos Eléctricos y Cableado'
        },
        summary: {
          'en-US': 'Master National Electrical Code (NEC) fundamentals, circuit installation, conduit bending, breaker panels, switches, and multimeter diagnostics.',
          'es-US': 'Domine los fundamentos del Código Eléctrico Nacional (NEC), instalación de circuitos, doblado de tubería conduit, paneles y diagnóstico con multímetro.'
        },
        credential: 'NCCER Electrical Readiness + OSHA-10',
        hoursCap: 390,
        tuitionCost: '$0 (100% Tuition-Free)',
        careerCenterIds: ['cc-opelika', 'cc-valley', 'cc-lagrange'],
        partnerTrackIds: ['part-ojt-host', 'part-materials-tools', 'part-craft-mentor']
      },
      {
        id: 'prog-plumbing',
        slug: 'plumbing-pipefitting',
        code: '03',
        category: 'mechanical',
        status: 'published',
        isInternal: false,
        title: {
          'en-US': 'Plumbing and Pipefitting',
          'es-US': 'Plomería e Instalación de Tuberías'
        },
        summary: {
          'en-US': 'Install and test copper, PEX, and PVC piping systems, drainage assemblies, soldering joints, valves, and commercial/residential fixtures.',
          'es-US': 'Instale y pruebe sistemas de tuberías de cobre, PEX y PVC, drenajes, soldadura de uniones, válvulas y accesorios residenciales y comerciales.'
        },
        credential: 'NCCER Plumbing Fundamentals + OSHA-10',
        hoursCap: 390,
        tuitionCost: '$0 (100% Tuition-Free)',
        careerCenterIds: ['cc-opelika', 'cc-valley'],
        partnerTrackIds: ['part-ojt-host', 'part-materials-tools']
      },
      {
        id: 'prog-hvac',
        slug: 'hvac-mechanical',
        code: '04',
        category: 'mechanical',
        status: 'published',
        isInternal: false,
        title: {
          'en-US': 'HVAC and Mechanical Systems',
          'es-US': 'Sistemas Mecánicos y Climatización (HVAC)'
        },
        summary: {
          'en-US': 'Introduction to heating, ventilation, air conditioning, and refrigeration systems, airflow diagnostics, ductwork, and EPA Section 608 certification prep.',
          'es-US': 'Introducción a sistemas de calefacción, ventilación, aire acondicionado y refrigeración, diagnóstico de flujo de aire, ductos y preparación EPA 608.'
        },
        credential: 'EPA Section 608 Prep + NCCER HVAC',
        hoursCap: 390,
        tuitionCost: '$0 (100% Tuition-Free)',
        careerCenterIds: ['cc-opelika', 'cc-valley', 'cc-lagrange'],
        partnerTrackIds: ['part-ojt-host', 'part-craft-mentor']
      },
      {
        id: 'prog-safety',
        slug: 'jobsite-safety-osha',
        code: '05',
        category: 'readiness',
        status: 'published',
        isInternal: false,
        title: {
          'en-US': 'Jobsite Safety and Certifications',
          'es-US': 'Seguridad en la Obra y Certificaciones OSHA'
        },
        summary: {
          'en-US': 'Earn portable industry credentials including OSHA 10-Hour Construction Safety and NCCER Core modules with full PPE provided at zero cost.',
          'es-US': 'Obtenga credenciales reconocidas como OSHA 10-Horas en Construcción y módulos básicos NCCER con equipo de protección personal (EPP) gratuito.'
        },
        credential: 'OSHA 10-Hour Construction Card + NCCER Core',
        hoursCap: 195,
        tuitionCost: '$0 (100% Tuition-Free)',
        careerCenterIds: ['cc-opelika', 'cc-valley', 'cc-lagrange'],
        partnerTrackIds: ['part-sponsor-stipend', 'part-materials-tools']
      },
      {
        id: 'prog-readiness',
        slug: 'work-readiness-ojt',
        code: '06',
        category: 'readiness',
        status: 'published',
        isInternal: false,
        title: {
          'en-US': 'Teamwork, Discipline & Transitional Jobs',
          'es-US': 'Preparación Laboral y Empleos Transicionales'
        },
        summary: {
          'en-US': 'Build professional jobsite communication, timekeeping, and teamwork while transitioning into paid WIOA Activity 220 and On-the-Job Training placements.',
          'es-US': 'Desarrolle comunicación profesional, puntualidad y trabajo en equipo mientras avanza hacia empleos transicionales pagados WIOA Actividad 220 y OJT.'
        },
        credential: 'WIOA Activity 220 Worksite Readiness Verification',
        hoursCap: 390,
        tuitionCost: '$0 (100% Tuition-Free)',
        careerCenterIds: ['cc-opelika', 'cc-valley', 'cc-lagrange'],
        partnerTrackIds: ['part-ojt-host', 'part-sponsor-stipend']
      },
      {
        id: 'prog-industrial-welding-draft',
        slug: 'industrial-welding-draft',
        code: '08',
        category: 'mechanical',
        status: 'draft',
        isInternal: true,
        title: {
          'en-US': 'Industrial Pipe Welding (Internal Syllabus Draft)',
          'es-US': 'Soldadura Industrial de Tuberías (Borrador Interno)'
        },
        summary: {
          'en-US': 'Internal curriculum draft pending Shawmut shop ventilation inspection—blocked from public Collection template publishing.',
          'es-US': 'Borrador interno pendiente de inspección de ventilación en el taller de Shawmut—bloqueado para publicación pública.'
        },
        credential: 'AWS Entry Welder (Pending Review)',
        hoursCap: 390,
        tuitionCost: '$0 (100% Tuition-Free)',
        careerCenterIds: ['cc-opelika'],
        partnerTrackIds: ['part-ojt-host']
      }
    ],
    careerCenters: [
      {
        id: 'cc-opelika',
        slug: 'opelika-career-center',
        name: {
          'en-US': 'Opelika Career Center (Alabama Works!)',
          'es-US': 'Centro de Carreras de Opelika (Alabama Works!)'
        },
        state: 'AL',
        wioaSystem: 'Alabama Works! Region 5',
        countiesServed: 'Chambers, Lee, Macon, Russell & Tallapoosa Counties, AL',
        address: '2300 Frederick Rd, Opelika, AL 36801',
        phone: '(334) 749-5065',
        eligibleProgramIds: ['prog-carpentry', 'prog-electrical', 'prog-plumbing', 'prog-hvac', 'prog-safety', 'prog-readiness']
      },
      {
        id: 'cc-valley',
        slug: 'valley-chambers-outreach',
        name: {
          'en-US': 'Valley / Shawmut Workforce Intake Hub',
          'es-US': 'Centro de Admisión Laboral de Valley / Shawmut'
        },
        state: 'AL',
        wioaSystem: 'Alabama Works! & Springboards Campus',
        countiesServed: 'Lanett, Shawmut, Valley & LaFayette (Chambers County, AL)',
        address: '2269 15th Ave. S.W., Lanett, AL 36863',
        phone: '731.388.WORK',
        eligibleProgramIds: ['prog-carpentry', 'prog-electrical', 'prog-plumbing', 'prog-hvac', 'prog-safety', 'prog-readiness']
      },
      {
        id: 'cc-lagrange',
        slug: 'worksource-georgia-lagrange',
        name: {
          'en-US': 'WorkSource Three Rivers (LaGrange / West Point)',
          'es-US': 'WorkSource Three Rivers (LaGrange / West Point, GA)'
        },
        state: 'GA',
        wioaSystem: 'WorkSource Georgia Region 4',
        countiesServed: 'Troup, Heard & Meriwether Counties, GA (Chattahoochee Valley)',
        address: '1000 Corporate Center Dr, LaGrange, GA 30241',
        phone: '(706) 845-4000',
        eligibleProgramIds: ['prog-carpentry', 'prog-electrical', 'prog-hvac', 'prog-safety', 'prog-readiness']
      }
    ],
    partnerDirectory: [
      {
        id: 'part-ojt-host',
        slug: 'ojt-employer-host',
        title: {
          'en-US': 'WIOA Activity 220 & OJT Host Employers',
          'es-US': 'Empleadores Anfitriones WIOA Actividad 220 y OJT'
        },
        partnershipType: 'OJT Host Employer',
        reimbursementModel: '100% WIOA Subsidized (390 hrs) + Up to 50%–75% OJT Wage Reimbursement',
        summary: {
          'en-US': 'Host pre-screened trainees for 390 hours of payroll-subsidized transitional work before hiring permanently through On-the-Job Training.',
          'es-US': 'Reciba aprendices preseleccionados durante 390 horas con nómina subsidiada antes de contratarlos permanentemente mediante capacitación en el trabajo.'
        },
        tradeProgramIds: ['prog-carpentry', 'prog-electrical', 'prog-plumbing', 'prog-hvac', 'prog-readiness']
      },
      {
        id: 'part-materials-tools',
        slug: 'materials-tools-donor',
        title: {
          'en-US': 'Commercial Tools, Lumber & Material Suppliers',
          'es-US': 'Donantes de Herramientas, Madera y Materiales'
        },
        partnershipType: 'Material & Tool Donor',
        reimbursementModel: '100% IRS 501(c)(3) Tax-Deductible In-Kind Contribution Receipt',
        summary: {
          'en-US': 'Contribute framing lumber, copper/PVC pipe, electrical conduit, wire, or commercial power tools directly to our Shawmut training shop.',
          'es-US': 'Done madera estructural, tubería de cobre/PVC, conductos eléctricos o herramientas comerciales directamente a nuestro taller en Shawmut.'
        },
        tradeProgramIds: ['prog-carpentry', 'prog-electrical', 'prog-plumbing', 'prog-safety']
      },
      {
        id: 'part-craft-mentor',
        slug: 'guest-craft-mentor',
        title: {
          'en-US': 'Master Tradesperson & Guest Craft Mentors',
          'es-US': 'Maestros de Oficio y Mentores Invitados'
        },
        partnershipType: 'Guest Craft Mentor',
        reimbursementModel: 'Mon–Thu Morning (8 AM–12 PM EST) or Afternoon (12 PM–4 PM EST) Blocks',
        summary: {
          'en-US': 'Lead a 4-hour hands-on workshop block sharing real-world code compliance, blueprint layout, and safety habits with cohorts.',
          'es-US': 'Dirija un bloque práctico de 4 horas compartiendo normas de código, lectura de planos y hábitos de seguridad con los participantes.'
        },
        tradeProgramIds: ['prog-carpentry', 'prog-electrical', 'prog-hvac']
      },
      {
        id: 'part-sponsor-stipend',
        slug: 'trainee-sponsorship',
        title: {
          'en-US': 'Trainee Tool Belt & Safety Gear Sponsorships',
          'es-US': 'Patrocinio de Cinturón de Herramientas y Equipo OSHA'
        },
        partnershipType: 'Philanthropic Sponsor',
        reimbursementModel: '$50 OSHA Gear • $150 Tool Belt • $500 Exam Fees • $1,500 Full Cohort Stipend',
        summary: {
          'en-US': 'Eliminate out-of-pocket barriers so every jobseeker steps onto their first jobsite with steel-toe boots, PPE, and personal hand tools.',
          'es-US': 'Elimine las barreras económicas para que cada participante llegue a la obra con botas de seguridad, EPP y herramientas propias.'
        },
        tradeProgramIds: ['prog-safety', 'prog-readiness']
      }
    ],
    faqItems: [
      {
        id: 'faq-tuition-free',
        category: 'eligibility',
        question: {
          'en-US': 'Is the trade training really 100% tuition-free?',
          'es-US': '¿La capacitación en oficios es realmente 100% gratuita?'
        },
        answer: {
          'en-US': 'Yes. All Springboards trade training is 100% tuition-free for participants. Training fees, tools, safety gear (PPE), and certification exams are fully covered through WIOA workforce grants, partners, and donors.',
          'es-US': 'Sí. Toda la capacitación de Springboards es 100% gratuita para los participantes. La matrícula, herramientas, equipo de seguridad (EPP) y exámenes de certificación están totalmente cubiertos.'
        },
        relatedProgramIds: ['prog-carpentry', 'prog-electrical', 'prog-plumbing', 'prog-hvac', 'prog-safety']
      },
      {
        id: 'faq-eligibility',
        category: 'eligibility',
        question: {
          'en-US': 'Who is eligible for WIOA Activity 220 Transitional Jobs?',
          'es-US': '¿Quién es elegible para los Empleos Transicionales WIOA Actividad 220?'
        },
        answer: {
          'en-US': 'We serve young adults (ages 18–24), returning citizens, veterans, and unemployed or underemployed adults in Shawmut, Lanett, Valley, and across East Alabama and West Georgia.',
          'es-US': 'Servimos a jóvenes adultos (18 a 24 años), ciudadanos que reingresan a la fuerza laboral, veteranos y adultos desempleados o subempleados en el este de Alabama y oeste de Georgia.'
        },
        relatedProgramIds: ['prog-readiness', 'prog-carpentry']
      },
      {
        id: 'faq-schedule',
        category: 'training',
        question: {
          'en-US': 'Where are programs held and what are the hours?',
          'es-US': '¿Dónde se imparten los programas y cuál es el horario?'
        },
        answer: {
          'en-US': 'Training takes place at the Springboards Community Center at 2269 15th Ave. S.W., Lanett, AL 36863 (Shawmut), Monday through Thursday from 8:00 AM to 4:00 PM EST.',
          'es-US': 'La capacitación se realiza en el Centro Comunitario Springboards en 2269 15th Ave. S.W., Lanett, AL 36863 (Shawmut), de lunes a jueves de 8:00 AM a 4:00 PM EST.'
        },
        relatedProgramIds: ['prog-carpentry', 'prog-electrical', 'prog-plumbing', 'prog-hvac']
      },
      {
        id: 'faq-outcomes',
        category: 'outcomes',
        question: {
          'en-US': 'What happens after I complete foundational training?',
          'es-US': '¿Qué sucede después de completar la capacitación básica?'
        },
        answer: {
          'en-US': 'Participants progress through up to 390 hours of WIOA wage-subsidized transitional work and connect directly with local East Alabama contractors for permanent On-the-Job Training (OJT) employment.',
          'es-US': 'Los participantes avanzan hasta 390 horas de trabajo transicional pagado por WIOA y se conectan directamente con contratistas locales para empleo permanente.'
        },
        relatedProgramIds: ['prog-readiness', 'prog-safety']
      }
    ],
    utilityPages: [
      {
        id: 'util-search',
        canonicalPath: '/utility/search',
        httpStatus: '200 OK · Search Utility',
        robotsPolicy: 'noindex, follow',
        title: {
          'en-US': 'Site Search & Dynamic Collection Directory',
          'es-US': 'Búsqueda del Sitio y Directorio Dinámico'
        },
        purpose: {
          'en-US': 'URL-addressable full-text search across trade programs, WIOA eligibility rules, Career Centers, FAQs, and downloadable documents.',
          'es-US': 'Búsqueda de texto completo por URL en programas de oficios, elegibilidad WIOA, Centros de Carreras, preguntas frecuentes y documentos.'
        }
      },
      {
        id: 'util-password',
        canonicalPath: '/utility/password',
        httpStatus: '401 Protected Gate',
        robotsPolicy: 'noindex, nofollow',
        title: {
          'en-US': 'Password-Protected Worksite & Trainee Gate',
          'es-US': 'Portal Protegido con Contraseña para Obras y Aprendices'
        },
        purpose: {
          'en-US': 'Passcode-authenticated utility gate unlocking the 390-hour WIOA milestone tracker and official Host Worksite Agreement packet.',
          'es-US': 'Portal autenticado por código para desbloquear el seguimiento de 390 horas WIOA y el Acuerdo Oficial de Lugar de Trabajo.'
        }
      },
      {
        id: 'util-404',
        canonicalPath: '/404.html',
        httpStatus: '404 Not Found Recovery',
        robotsPolicy: 'noindex, follow',
        title: {
          'en-US': '404 Diagnostic & Route Recovery Directory',
          'es-US': 'Página 404 de Diagnóstico y Recuperación de Rutas'
        },
        purpose: {
          'en-US': 'Captures mistyped or legacy URLs, suggests smart route matches, and provides a filterable recovery directory.',
          'es-US': 'Detecta enlaces antiguos o mal escritos, sugiere rutas equivalentes y ofrece un directorio interactivo de recuperación.'
        }
      },
      {
        id: 'util-legal',
        canonicalPath: '/utility/privacy-terms',
        httpStatus: '200 OK · Legal & WIOA Notice',
        robotsPolicy: 'index, follow',
        title: {
          'en-US': 'Privacy Policy, WIOA Section 188 & Accessibility Statement',
          'es-US': 'Política de Privacidad, Igualdad WIOA Sección 188 y Accesibilidad'
        },
        purpose: {
          'en-US': 'Statutory WIOA Section 188 Equal Opportunity notice, 501(c)(3) donor privacy protections, and WCAG 2.2 AA accessibility compliance.',
          'es-US': 'Aviso legal de Igualdad de Oportunidades WIOA Sección 188, privacidad de donantes 501(c)(3) y cumplimiento de accesibilidad WCAG 2.2 AA.'
        }
      },
      {
        id: 'util-cms-workflows',
        canonicalPath: '/resources/cms-workflows',
        httpStatus: '200 OK · CMS & Localization Hub',
        robotsPolicy: 'index, follow',
        title: {
          'en-US': 'CMS Schema, Localization & Publishing Workflows Hub',
          'es-US': 'Centro de Esquema CMS, Localización y Flujos de Publicación'
        },
        purpose: {
          'en-US': 'Interactive console for managing CMS Collections, relational fields, en-US/es-US localization, SEO hreflang tags, and 4-stage publishing.',
          'es-US': 'Consola interactiva para gestionar Colecciones CMS, campos relacionales, localización inglés/español, SEO hreflang y publicación en 4 etapas.'
        }
      },
      {
        id: 'util-style-guide',
        canonicalPath: '/resources/style-guide',
        httpStatus: '200 OK · Design System',
        robotsPolicy: 'index, follow',
        title: {
          'en-US': 'Living Style Guide & 3-Tier CSS Token Reference',
          'es-US': 'Guía de Estilo Viva y Sistema de Tokens CSS'
        },
        purpose: {
          'en-US': 'Single source of truth for typography, WCAG 2.2 AA color tokens, spacing, form validation states, and reusable layout patterns.',
          'es-US': 'Fuente única de verdad para tipografía, tokens de color WCAG 2.2 AA, espaciado, validación de formularios y patrones de diseño.'
        }
      }
    ]
  };

  /* ==========================================================================
     4. LOCALIZATION (i18n), ASSET LOCALIZATION & SEO GOVERNANCE ENGINE
     ========================================================================== */
  var LOCALIZATION_GLOSSARY = [
    {
      termKey: 'tuition_free',
      en: '100% Tuition-Free Trade Training',
      es: 'Capacitación en Oficios 100% Gratuita (Sin Matrícula)',
      rule: 'Always emphasize zero student debt and covered tools/PPE; never translate as a loan or deferred fee.'
    },
    {
      termKey: 'wioa_activity_220',
      en: 'WIOA Activity Code 220 Transitional Jobs (Up to 390 Paid Hours)',
      es: 'Empleos Transicionales WIOA Código de Actividad 220 (Hasta 390 Horas Pagadas)',
      rule: 'Keep statutory identifier "WIOA" and "220" intact in both locales for Career Center case manager verification.'
    },
    {
      termKey: 'ojt_pathway',
      en: 'On-the-Job Training (OJT) Employer Placement',
      es: 'Capacitación en el Trabajo (OJT) con Empleadores Locales',
      rule: 'Retain the acronym "(OJT)" in parentheses in Spanish so bilingual forms map directly to state workforce packets.'
    },
    {
      termKey: 'safety_credentials',
      en: 'OSHA 10-Hour Construction Card & NCCER Core',
      es: 'Tarjeta de Seguridad OSHA 10-Horas y Certificación NCCER Core',
      rule: 'Do not translate certification acronyms (OSHA-10, NCCER, EPA 608); localize the descriptive credential noun.'
    },
    {
      termKey: 'tax_deductible',
      en: 'IRS 501(c)(3) Tax-Deductible Contribution',
      es: 'Contribución Deducible de Impuestos IRS 501(c)(3)',
      rule: 'Maintain "IRS 501(c)(3)" exact legal designation for donor receipt compliance.'
    }
  ];

  var PUBLISHING_WORKFLOW_STAGES = [
    {
      stageId: 'stage_1_schema_validation',
      stepNumber: '01',
      ownerRole: 'Technical Publisher / Content Author (Marilynn Ward)',
      title: 'Schema, Field & Relational Integrity Check',
      checklist: [
        'All required Collection fields (id, slug, localized title/summary, category) pass schema validation.',
        'Multi-reference links between tradePrograms, careerCenters, and partnerDirectory resolve with zero orphan IDs.',
        'Clean folder URL slug matches firebase.json cleanUrls hierarchy with zero root duplicate HTML files.'
      ]
    },
    {
      stageId: 'stage_2_localization_seo',
      stepNumber: '02',
      ownerRole: 'Localization & SEO Specialist (Giselle Campos / Marilynn Ward)',
      title: 'Translation, Asset Localization & SEO Metadata Audit',
      checklist: [
        'English (en-US) and Spanish (es-US) strings are populated with statutory WIOA/OSHA acronyms preserved.',
        'Page <title> (30–60 chars), <meta name="description"> (120–160 chars), canonical URL, and hreflang tags are verified.',
        'All visual assets include localized alt text and zero text is baked into raster WebP/PNG graphics.'
      ]
    },
    {
      stageId: 'stage_3_compliance_review',
      stepNumber: '03',
      ownerRole: 'WIOA Compliance & Policy Custodian (Shamia Morgan / Rasheeda Abdullah)',
      title: 'WIOA Section 188 Equal Opportunity & 501(c)(3) Compliance Gate',
      checklist: [
        'Confirm WIOA Activity 220 (390-hour cap / 195-hour classroom milestone) accuracy.',
        'Verify Section 188 Equal Opportunity & Nondiscrimination notice accessibility in English and Spanish.',
        'Confirm 501(c)(3) tax-receipt disclosures and eastern time zone (Mon–Thu 8 AM–4 PM EST) accuracy.'
      ]
    },
    {
      stageId: 'stage_4_executive_publish',
      stepNumber: '04',
      ownerRole: 'Executive Director Approver (Marvin Thompson)',
      title: 'Executive Sign-Off & Firebase Hosting Production Rollout',
      checklist: [
        'Run automated build & lint audit (npm run build && npm run lint) with zero warnings.',
        'Verify all utility pages (/utility/search, /utility/password, /utility/privacy-terms, /404.html) respond cleanly.',
        'Deploy static bundle and Firestore security rules via firebase deploy --only hosting,firestore:rules.'
      ]
    }
  ];

  var currentLocale = 'en-US';
  try {
    var savedLocale = localStorage.getItem('sb_site_locale');
    if (savedLocale === 'en-US' || savedLocale === 'es-US') {
      currentLocale = savedLocale;
    }
  } catch {
    // Ignore storage access errors
  }

  function getPublishingSettings(collectionId) {
    try {
      var raw = localStorage.getItem('sb_cms_publishing_settings');
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed[collectionId]) {
          return Object.assign({}, COLLECTION_PUBLISHING_SETTINGS[collectionId], parsed[collectionId]);
        }
      }
    } catch {
      // Ignore storage errors
    }
    return COLLECTION_PUBLISHING_SETTINGS[collectionId] || null;
  }

  function setCollectionTemplatePublishing(collectionId, enabled) {
    if (!COLLECTION_PUBLISHING_SETTINGS[collectionId]) return null;
    COLLECTION_PUBLISHING_SETTINGS[collectionId].publishTemplatePages = Boolean(enabled);
    if (COLLECTIONS_SCHEMA[collectionId]) {
      COLLECTIONS_SCHEMA[collectionId].publishTemplatePages = Boolean(enabled);
    }
    try {
      var raw = localStorage.getItem('sb_cms_publishing_settings');
      var saved = raw ? JSON.parse(raw) : {};
      saved[collectionId] = { publishTemplatePages: Boolean(enabled) };
      localStorage.setItem('sb_cms_publishing_settings', JSON.stringify(saved));
    } catch {
      // Ignore storage errors
    }
    mountAll(document);
    return getPublishingSettings(collectionId);
  }

  /**
   * Determines whether a specific CMS record is allowed to publish a live standalone
   * Collection Template Page. Prevents empty, internal, draft, or disabled-collection
   * items from being publicly published.
   */
  function canPublishTemplateItem(collectionId, item) {
    var pubSettings = getPublishingSettings(collectionId);
    if (!pubSettings || !pubSettings.publishTemplatePages) {
      return {
        allowed: false,
        reason: 'Collection template page publishing is disabled for "' + collectionId + '". ' + (pubSettings ? pubSettings.governanceNote : '')
      };
    }
    if (!item) {
      return {
        allowed: false,
        reason: 'Requested CMS record does not exist in "' + collectionId + '".'
      };
    }
    if (item.isInternal === true || item.status === 'draft' || item.status === 'archived') {
      return {
        allowed: false,
        reason: 'Record "' + (item.slug || item.id) + '" is marked as ' + (item.status || 'internal') + ' and blocked from public publication.'
      };
    }
    var titleEn = getLocalizedField(item.title || item.name, 'en-US').trim();
    var summaryEn = getLocalizedField(item.summary || item.purpose || item.answer, 'en-US').trim();
    if (!titleEn || !summaryEn) {
      return {
        allowed: false,
        reason: 'Record "' + (item.slug || item.id) + '" has empty required body content and cannot be published as a public page.'
      };
    }
    return {
      allowed: true,
      canonicalUrl: (pubSettings.folderPrefix || '/programs/pathways') + '/' + item.slug,
      reason: 'Published and verified for public Collection template rendering.'
    };
  }

  function getDynamicItemUrl(collectionId, item) {
    var pubSettings = getPublishingSettings(collectionId);
    if (pubSettings && pubSettings.publishTemplatePages && item && item.slug && canPublishTemplateItem(collectionId, item).allowed) {
      return (pubSettings.folderPrefix || '/programs/pathways') + '/' + encodeURIComponent(item.slug);
    }
    if (collectionId === 'tradePrograms' && item && item.slug) {
      return '/programs/eligibility?program=' + encodeURIComponent(item.slug);
    }
    if (collectionId === 'careerCenters' && item && item.slug) {
      return '/programs/eligibility#' + encodeURIComponent(item.slug);
    }
    if (collectionId === 'partnerDirectory' && item && item.slug) {
      return '/community/partner#' + encodeURIComponent(item.slug);
    }
    if (collectionId === 'utilityPages' && item && item.canonicalPath) {
      return item.canonicalPath;
    }
    return '/programs/train';
  }

  function getCustomCmsItems(collectionId) {
    try {
      var raw = localStorage.getItem('sb_cms_custom_' + collectionId);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore storage errors
    }
    return [];
  }

  function getCollectionItems(collectionId, includeDrafts) {
    var base = DEFAULT_CMS_DATA[collectionId] || [];
    var custom = getCustomCmsItems(collectionId);
    var combined = custom.concat(base);
    if (includeDrafts === true) {
      return combined;
    }
    return combined.filter(function (item) {
      return item.status !== 'draft' && item.status !== 'archived' && item.isInternal !== true;
    });
  }

  /**
   * Maps a raw source row (from CSV, external API, or MCP payload) to the target Collection schema.
   */
  function mapSourceRowToSchema(collectionId, rawRow) {
    var fieldMap = CMS_IMPORT_FIELD_MAPS[collectionId] || {};
    var mapped = {};

    Object.keys(rawRow || {}).forEach(function (srcKey) {
      var targetPath = fieldMap[srcKey] || srcKey;
      var rawVal = rawRow[srcKey];
      if (typeof rawVal === 'string') {
        rawVal = rawVal.trim();
      }
      if (targetPath.indexOf('.') !== -1) {
        var parts = targetPath.split('.');
        if (!mapped[parts[0]] || typeof mapped[parts[0]] !== 'object') {
          mapped[parts[0]] = {};
        }
        mapped[parts[0]][parts[1]] = rawVal;
      } else if (targetPath === 'careerCenterIds' || targetPath === 'partnerTrackIds' || targetPath === 'eligibleProgramIds' || targetPath === 'tradeProgramIds') {
        if (Array.isArray(rawVal)) {
          mapped[targetPath] = rawVal;
        } else if (typeof rawVal === 'string' && rawVal) {
          mapped[targetPath] = rawVal.split(/[|,;]/).map(function (s) { return s.trim(); }).filter(Boolean);
        }
      } else if (targetPath === 'hoursCap') {
        mapped[targetPath] = Number(rawVal) || 390;
      } else if (targetPath === 'isInternal') {
        mapped[targetPath] = rawVal === true || String(rawVal).toLowerCase() === 'true';
      } else {
        mapped[targetPath] = rawVal;
      }
    });

    if (collectionId === 'tradePrograms') {
      if (!mapped.id && mapped.slug) mapped.id = 'prog-' + mapped.slug;
      if (!mapped.code) mapped.code = '0' + (getCollectionItems('tradePrograms', true).length + 1);
      if (!mapped.hoursCap) mapped.hoursCap = 390;
      if (!mapped.tuitionCost) mapped.tuitionCost = '$0 (100% Tuition-Free)';
      if (!mapped.status) mapped.status = 'published';
      if (mapped.isInternal === undefined) mapped.isInternal = false;
    }

    return mapped;
  }

  function parseCsvToObjects(csvText) {
    var lines = String(csvText || '')
      .split(/\r?\n/)
      .map(function (l) { return l.trim(); })
      .filter(Boolean);
    if (lines.length < 2) return [];
    var headers = lines[0].split(',').map(function (h) { return h.trim(); });
    return lines.slice(1).map(function (line) {
      var values = line.split(',');
      var obj = {};
      headers.forEach(function (h, i) {
        obj[h] = values[i] !== undefined ? values[i].trim() : '';
      });
      return obj;
    });
  }

  /**
   * Prepares and imports dynamic content from CSV, JSON array, API payload, or MCP tool call
   * into the target Collection after mapping source columns to schema fields.
   */
  function importFromSource(collectionId, rawPayload, format) {
    var rows = [];
    if (format === 'csv' || (typeof rawPayload === 'string' && rawPayload.indexOf('\n') !== -1 && rawPayload.trim().indexOf('[') !== 0 && rawPayload.trim().indexOf('{') !== 0)) {
      rows = parseCsvToObjects(rawPayload);
    } else if (typeof rawPayload === 'string') {
      try {
        var parsed = JSON.parse(rawPayload);
        rows = Array.isArray(parsed) ? parsed : (parsed.records || [parsed]);
      } catch (e) {
        return { valid: false, importedCount: 0, blockedDraftCount: 0, errors: ['Invalid JSON payload: ' + e.message] };
      }
    } else if (Array.isArray(rawPayload)) {
      rows = rawPayload;
    } else if (rawPayload && typeof rawPayload === 'object') {
      rows = Array.isArray(rawPayload.records) ? rawPayload.records : [rawPayload];
    }

    var imported = [];
    var blockedDrafts = [];
    var errors = [];
    var existingCustom = getCustomCmsItems(collectionId);

    rows.forEach(function (rawRow, idx) {
      var mapped = mapSourceRowToSchema(collectionId, rawRow);
      var validation = validateCmsRecord(collectionId, mapped);
      if (!validation.valid) {
        errors.push('Row ' + (idx + 1) + ': ' + validation.errors.join(' '));
        return;
      }
      var pubCheck = canPublishTemplateItem(collectionId, mapped);
      if (!pubCheck.allowed) {
        blockedDrafts.push({ record: mapped, reason: pubCheck.reason });
      }
      existingCustom = existingCustom.filter(function (item) {
        return item.id !== mapped.id && item.slug !== mapped.slug;
      });
      existingCustom.unshift(mapped);
      imported.push(mapped);
    });

    if (imported.length > 0) {
      try {
        localStorage.setItem('sb_cms_custom_' + collectionId, JSON.stringify(existingCustom.slice(0, 40)));
      } catch {
        // Ignore storage errors
      }
      mountAll(document);
    }

    return {
      valid: errors.length === 0,
      importedCount: imported.length,
      blockedDraftCount: blockedDrafts.length,
      blockedDrafts: blockedDrafts,
      records: imported,
      errors: errors
    };
  }

  function getLocalizedField(fieldVal, locale) {
    var lang = locale || currentLocale || 'en-US';
    if (fieldVal && typeof fieldVal === 'object' && !Array.isArray(fieldVal)) {
      return fieldVal[lang] || fieldVal['en-US'] || '';
    }
    return String(fieldVal == null ? '' : fieldVal);
  }

  function resolveProgramRelations(program, locale) {
    var lang = locale || currentLocale || 'en-US';
    var allCenters = getCollectionItems('careerCenters');
    var allPartners = getCollectionItems('partnerDirectory');
    var allFaqs = getCollectionItems('faqItems');

    var centers = (program.careerCenterIds || [])
      .map(function (id) {
        return allCenters.find(function (c) { return c.id === id; });
      })
      .filter(Boolean)
      .map(function (c) {
        return {
          id: c.id,
          name: getLocalizedField(c.name, lang),
          state: c.state,
          phone: c.phone
        };
      });

    var partners = (program.partnerTrackIds || [])
      .map(function (id) {
        return allPartners.find(function (p) { return p.id === id; });
      })
      .filter(Boolean)
      .map(function (p) {
        return {
          id: p.id,
          title: getLocalizedField(p.title, lang),
          partnershipType: p.partnershipType
        };
      });

    var faqs = allFaqs
      .filter(function (f) {
        return Array.isArray(f.relatedProgramIds) && f.relatedProgramIds.indexOf(program.id) !== -1;
      })
      .map(function (f) {
        return {
          id: f.id,
          question: getLocalizedField(f.question, lang)
        };
      });

    return {
      careerCenters: centers,
      partnerTracks: partners,
      relatedFaqs: faqs
    };
  }

  function validateCmsRecord(collectionId, record) {
    var schema = COLLECTIONS_SCHEMA[collectionId];
    if (!schema) {
      return { valid: false, errors: ['Unknown collection: ' + collectionId] };
    }
    var errors = [];
    schema.fields.forEach(function (field) {
      var val = record ? record[field.name] : undefined;
      if (field.required) {
        if (val === undefined || val === null || val === '') {
          errors.push('Missing required field "' + field.name + '".');
          return;
        }
        if (field.type === 'localized-string') {
          if (typeof val === 'object') {
            if (!val['en-US'] || !String(val['en-US']).trim()) {
              errors.push('Field "' + field.name + '" requires an English (en-US) value.');
            }
          } else if (!String(val).trim()) {
            errors.push('Field "' + field.name + '" cannot be empty.');
          }
        }
        if (field.type === 'multi-reference' && (!Array.isArray(val) || val.length === 0)) {
          errors.push('Relational field "' + field.name + '" must reference at least one "' + field.targetCollection + '" record.');
        }
      }
      if (field.pattern && typeof val === 'string' && !(new RegExp(field.pattern).test(val))) {
        errors.push('Field "' + field.name + '" does not match required format (' + field.pattern + ').');
      }
    });
    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  function addDynamicCmsRecord(collectionId, rawRecord) {
    var validation = validateCmsRecord(collectionId, rawRecord);
    if (!validation.valid) {
      return validation;
    }
    try {
      var existing = getCustomCmsItems(collectionId);
      existing.unshift(rawRecord);
      localStorage.setItem('sb_cms_custom_' + collectionId, JSON.stringify(existing.slice(0, 30)));
    } catch {
      // Ignore storage errors
    }
    mountAll(document);
    return { valid: true, errors: [], record: rawRecord };
  }

  function generateLocalizedSeoSnippet(routePath, locale) {
    var lang = locale || currentLocale || 'en-US';
    var cleanRoute = normalizeRoute(routePath || window.location.pathname);
    var canonicalUrl = 'https://springboardsfcd.org' + (cleanRoute === '/' ? '/' : cleanRoute);
    var isEs = lang === 'es-US';
    var title = isEs
      ? 'Capacitación Gratuita en Oficios y Empleos WIOA | Springboards'
      : 'Free Trade Training & WIOA Career Pathways | Springboards';
    var desc = isEs
      ? 'Capacitación práctica y 100% gratuita en carpintería, electricidad, plomería, HVAC y seguridad OSHA-10 en Shawmut, Alabama.'
      : 'Hands-on, 100% tuition-free construction and skilled-trade training with WIOA Activity 220 transitional job pathways in East Alabama.';

    return [
      '<html lang="' + lang + '">',
      '<head>',
      '  <title>' + title + '</title>',
      '  <meta name="description" content="' + desc + '">',
      '  <link rel="canonical" href="' + canonicalUrl + '">',
      '  <link rel="alternate" hreflang="en-US" href="' + canonicalUrl + '">',
      '  <link rel="alternate" hreflang="es-US" href="' + canonicalUrl + '?lang=es-US">',
      '  <link rel="alternate" hreflang="x-default" href="' + canonicalUrl + '">',
      '  <meta property="og:locale" content="' + (isEs ? 'es_US' : 'en_US') + '">',
      '  <meta property="og:locale:alternate" content="' + (isEs ? 'en_US' : 'es_US') + '">',
      '  <meta property="og:title" content="' + title + '">',
      '  <meta property="og:description" content="' + desc + '">',
      '  <meta property="og:url" content="' + canonicalUrl + '">',
      '</head>'
    ].join('\n');
  }

  /* ==========================================================================
     5. REUSABLE UI & DYNAMIC CONTENT COMPONENTS
     ========================================================================== */

  /**
   * 1. Section Header Component ([data-component="section-header"] / .c-section-header)
   */
  function renderSectionHeader(el) {
    el.classList.add('c-section-header');
    var align = el.getAttribute('data-prop-align') || 'left';
    el.classList.toggle('is-centered', align === 'center');

    var eyebrow = el.getAttribute('data-prop-eyebrow');
    var title = el.getAttribute('data-prop-title');
    var subtitle = el.getAttribute('data-prop-subtitle');
    var headingTag = (el.getAttribute('data-prop-heading-tag') || 'h2').toLowerCase();
    if (['h1', 'h2', 'h3'].indexOf(headingTag) === -1) headingTag = 'h2';

    if (!el.children.length && (eyebrow || title || subtitle)) {
      var html = '';
      if (eyebrow) {
        html += '<span class="c-section-header__eyebrow section-eyebrow">' + escapeHtml(eyebrow) + '</span>';
      }
      if (title) {
        html += '<' + headingTag + ' class="c-section-header__title section-title">' + escapeHtml(title) + '</' + headingTag + '>';
      }
      if (subtitle) {
        html += '<p class="c-section-header__subtitle section-subtitle">' + escapeHtml(subtitle) + '</p>';
      }
      el.innerHTML = html;
      return;
    }

    var eyebrowEl = el.querySelector('.c-section-header__eyebrow, .section-eyebrow, .section-tag');
    var titleEl = el.querySelector('.c-section-header__title, .section-title, h1, h2, h3');
    var subtitleEl = el.querySelector('.c-section-header__subtitle, .section-subtitle, p');

    if (eyebrow && eyebrowEl) eyebrowEl.textContent = eyebrow;
    if (title && titleEl) titleEl.textContent = title;
    if (subtitle && subtitleEl) subtitleEl.textContent = subtitle;
  }

  /**
   * 2. Feature / Proof Card Component ([data-component="feature-card"] / .c-feature-card)
   */
  function renderFeatureCard(el) {
    el.classList.add('c-feature-card');
    var variant = el.getAttribute('data-prop-variant') || 'light';
    ['is-dark', 'is-light', 'is-warm', 'is-featured'].forEach(function (cls) {
      el.classList.remove(cls);
    });
    el.classList.add('is-' + variant);

    var indexText = el.getAttribute('data-prop-index');
    var title = el.getAttribute('data-prop-title');
    var desc = el.getAttribute('data-prop-description');
    var ctaLabel = el.getAttribute('data-prop-cta-label');
    var ctaHref = el.getAttribute('data-prop-cta-href');

    if (!el.children.length && (indexText || title || desc)) {
      var html = '';
      if (indexText) {
        html += '<span class="c-feature-card__index" aria-hidden="true">' + escapeHtml(indexText) + '</span>';
      }
      if (title) {
        html += '<h3 class="c-feature-card__title">' + escapeHtml(title) + '</h3>';
      }
      if (desc) {
        html += '<p class="c-feature-card__desc">' + escapeHtml(desc) + '</p>';
      }
      if (ctaLabel && ctaHref) {
        html += '<a href="' + escapeHtml(normalizeRoute(ctaHref)) + '" class="c-feature-card__cta link-text is-arrow">' + escapeHtml(ctaLabel) + ' <span aria-hidden="true">→</span></a>';
      }
      el.innerHTML = html;
      return;
    }

    var indexEl = el.querySelector('.c-feature-card__index, .proof-card-index');
    var titleEl = el.querySelector('.c-feature-card__title, h2, h3, h4');
    var descEl = el.querySelector('.c-feature-card__desc, p');
    var ctaEl = el.querySelector('.c-feature-card__cta');

    if (indexText !== null && indexEl) indexEl.textContent = indexText;
    if (title !== null && titleEl) titleEl.textContent = title;
    if (desc !== null && descEl) descEl.textContent = desc;
    if (ctaLabel !== null && ctaEl) {
      ctaEl.innerHTML = escapeHtml(ctaLabel) + ' <span aria-hidden="true">→</span>';
    }
    if (ctaHref !== null && ctaEl) {
      ctaEl.setAttribute('href', normalizeRoute(ctaHref));
    }
  }

  /**
   * 3. Civic Action / CTA Banner Component ([data-component="cta-banner"] / .c-cta-banner)
   */
  function renderCtaBanner(el) {
    el.classList.add('c-cta-banner');
    var theme = el.getAttribute('data-prop-theme') || 'navy';
    ['is-navy', 'is-warm', 'is-subtle'].forEach(function (cls) {
      el.classList.remove(cls);
    });
    el.classList.add('is-' + theme);

    var eyebrow = el.getAttribute('data-prop-eyebrow');
    var title = el.getAttribute('data-prop-title');
    var desc = el.getAttribute('data-prop-description');
    var primaryLabel = el.getAttribute('data-prop-primary-label');
    var primaryHref = normalizeRoute(el.getAttribute('data-prop-primary-href') || '/programs/eligibility');
    var secondaryLabel = el.getAttribute('data-prop-secondary-label');
    var secondaryHref = normalizeRoute(el.getAttribute('data-prop-secondary-href') || '/programs/train');
    var secondaryBtnClass = theme === 'navy' ? 'btn-outline' : 'btn-outline-dark';

    if (!el.children.length && (title || desc)) {
      var html = '<div class="c-cta-banner__copy">';
      if (eyebrow) {
        html += '<span class="c-cta-banner__eyebrow">' + escapeHtml(eyebrow) + '</span>';
      }
      if (title) {
        html += '<h2 class="c-cta-banner__title">' + escapeHtml(title) + '</h2>';
      }
      if (desc) {
        html += '<p class="c-cta-banner__desc">' + escapeHtml(desc) + '</p>';
      }
      html += '</div>';
      html += '<div class="c-cta-banner__actions">';
      if (primaryLabel) {
        html += '<a href="' + escapeHtml(primaryHref) + '" class="btn-cta c-cta-banner__primary">' + escapeHtml(primaryLabel) + '</a>';
      }
      if (secondaryLabel) {
        html += '<a href="' + escapeHtml(secondaryHref) + '" class="' + secondaryBtnClass + ' c-cta-banner__secondary">' + escapeHtml(secondaryLabel) + '</a>';
      }
      html += '</div>';
      el.innerHTML = html;
      return;
    }

    var eyebrowEl = el.querySelector('.c-cta-banner__eyebrow');
    var titleEl = el.querySelector('.c-cta-banner__title, h2, h3');
    var descEl = el.querySelector('.c-cta-banner__desc, p');
    var primaryEl = el.querySelector('.c-cta-banner__primary');
    var secondaryEl = el.querySelector('.c-cta-banner__secondary');

    if (eyebrow !== null && eyebrowEl) eyebrowEl.textContent = eyebrow;
    if (title !== null && titleEl) titleEl.textContent = title;
    if (desc !== null && descEl) descEl.textContent = desc;
    if (primaryLabel !== null && primaryEl) primaryEl.textContent = primaryLabel;
    if (primaryHref !== null && primaryEl) primaryEl.setAttribute('href', primaryHref);
    if (secondaryLabel !== null && secondaryEl) secondaryEl.textContent = secondaryLabel;
    if (secondaryHref !== null && secondaryEl) secondaryEl.setAttribute('href', secondaryHref);
    if (secondaryEl) {
      secondaryEl.classList.toggle('btn-outline', theme === 'navy');
      secondaryEl.classList.toggle('btn-outline-dark', theme !== 'navy');
    }
  }

  /**
   * 4. Site Navbar Component ([data-component="site-navbar"])
   */
  function renderSiteNavbar(el) {
    var activeRoute = normalizeRoute(el.getAttribute('data-prop-active-route') || window.location.pathname);
    var ctaLabel = el.getAttribute('data-prop-cta-label');
    var ctaHref = el.getAttribute('data-prop-cta-href');

    el.querySelectorAll('.nav-logo').forEach(function (logoImg) {
      logoImg.setAttribute('src', '/assets/aistudio/springboards_logo_white_text.png?v=20261114-clean');
      if (!logoImg.getAttribute('alt')) {
        logoImg.setAttribute('alt', 'Springboards for Community Development');
      }
    });

    el.querySelectorAll('.nav-link').forEach(function (link) {
      var rawHref = link.getAttribute('href');
      var canonicalHref = normalizeRoute(rawHref);
      if (rawHref && CANONICAL_ROUTE_MAP[rawHref]) {
        link.setAttribute('href', canonicalHref);
      }
      var isMatch = canonicalHref === activeRoute || (canonicalHref === '/programs/train' && activeRoute.indexOf('/programs/pathways') === 0);
      link.classList.toggle('active', isMatch);
      if (isMatch) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    if (ctaLabel || ctaHref) {
      el.querySelectorAll('.desktop-cta, .mobile-cta').forEach(function (btn) {
        if (ctaLabel) btn.textContent = ctaLabel;
        if (ctaHref) btn.setAttribute('href', normalizeRoute(ctaHref));
      });
    }
  }

  /**
   * 5. Site Footer Component ([data-component="site-footer"])
   */
  function renderSiteFooter(el) {
    var activeRoute = normalizeRoute(el.getAttribute('data-prop-active-route') || window.location.pathname);
    el.querySelectorAll('.footer-logo').forEach(function (footerLogo) {
      footerLogo.setAttribute('src', '/assets/aistudio/springboards_logo_icon.png?v=20261114-clean');
    });
    el.querySelectorAll('.footer-wordmark-img').forEach(function (wordmarkImg) {
      wordmarkImg.setAttribute('src', '/assets/aistudio/springboards_logo_white_text.png?v=20261114-clean');
    });
    el.querySelectorAll('a[href]').forEach(function (link) {
      var rawHref = link.getAttribute('href');
      var canonicalHref = normalizeRoute(rawHref);
      if (rawHref && CANONICAL_ROUTE_MAP[rawHref]) {
        link.setAttribute('href', canonicalHref);
      }
      if (canonicalHref === activeRoute) {
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  /**
   * 6. Dynamic CMS Collection Component ([data-component="cms-collection"])
   *    Props:
   *      - data-prop-collection: "tradePrograms" | "careerCenters" | "partnerDirectory" | "utilityPages"
   *      - data-prop-filter-category: Optional category filter (e.g., "all", "construction", "mechanical")
   *      - data-prop-locale: "en-US" | "es-US"
   */
  function renderCmsCollection(el) {
    var collectionId = el.getAttribute('data-prop-collection') || 'tradePrograms';
    var filterCat = el.getAttribute('data-prop-filter-category') || 'all';
    var searchQuery = (el.getAttribute('data-prop-search') || '').trim().toLowerCase();
    var locale = el.getAttribute('data-prop-locale') || currentLocale || 'en-US';
    var items = getCollectionItems(collectionId, false);

    var filtered = items.filter(function (item) {
      var catMatch = filterCat === 'all' || !item.category || item.category === filterCat;
      if (!catMatch) return false;
      if (!searchQuery) return true;
      var textDump = JSON.stringify(item).toLowerCase();
      return textDump.indexOf(searchQuery) !== -1;
    });

    if (filtered.length === 0) {
      el.innerHTML =
        '<div class="collection-empty-state" role="status" aria-live="polite">' +
        '<p class="collection-empty-eyebrow">CMS COLLECTION FILTER</p>' +
        '<h3 class="collection-empty-title">No records matched your current filter</h3>' +
        '<p class="collection-empty-desc">Try selecting "All" or clearing your search query to view all structured records in <code>' +
        escapeHtml(collectionId) +
        '</code>.</p>' +
        '</div>';
      return;
    }

    if (collectionId === 'tradePrograms') {
      var pubSettings = getPublishingSettings('tradePrograms');
      var templateEnabled = pubSettings && pubSettings.publishTemplatePages;
      el.innerHTML = filtered
        .map(function (prog) {
          var rels = resolveProgramRelations(prog, locale);
          var centerNames = rels.careerCenters.map(function (c) { return escapeHtml(c.name); }).join(' · ');
          var partnerNames = rels.partnerTracks.map(function (p) { return escapeHtml(p.title); }).join(' · ');
          var title = getLocalizedField(prog.title, locale);
          var summary = getLocalizedField(prog.summary, locale);
          var dynamicUrl = getDynamicItemUrl('tradePrograms', prog);
          var actionLabel = templateEnabled
            ? (locale === 'es-US' ? 'Ver Ruta de Oficio' : 'Explore Pathway Template')
            : (locale === 'es-US' ? 'Verificar Elegibilidad WIOA' : 'Check WIOA Eligibility');

          return (
            '<article class="sb-card c-feature-card is-light" data-cms-item-id="' + escapeHtml(prog.id) + '">' +
            '<div class="u-flex-between u-mb-2">' +
            '<span class="t-eyebrow c-text-accent">' + escapeHtml(prog.code) + ' · ' + escapeHtml(String(prog.category).toUpperCase()) + '</span>' +
            '<span class="t-caption u-font-mono c-text-muted">' + escapeHtml(prog.hoursCap + ' Paid Hrs · ' + prog.tuitionCost) + '</span>' +
            '</div>' +
            '<h3 class="t-h4 c-text-brand u-mt-0 u-mb-2"><a href="' + escapeHtml(dynamicUrl) + '" class="c-text-brand" style="text-decoration: none;">' + escapeHtml(title) + '</a></h3>' +
            '<p class="t-body-sm c-text-secondary u-mt-0 u-mb-3">' + escapeHtml(summary) + '</p>' +
            '<div class="u-pt-3 c-border-subtle" style="border-top: 1px solid var(--color-border-subtle);">' +
            '<p class="t-caption c-text-primary u-m-0 u-mb-1"><strong>Credential:</strong> ' + escapeHtml(prog.credential) + '</p>' +
            '<p class="t-caption c-text-secondary u-m-0 u-mb-1"><strong>Linked Career Centers (' + rels.careerCenters.length + '):</strong> ' + (centerNames || 'East Alabama') + '</p>' +
            '<p class="t-caption c-text-secondary u-m-0 u-mb-2"><strong>Partner Tracks (' + rels.partnerTracks.length + '):</strong> ' + (partnerNames || 'OJT Employers') + '</p>' +
            '<p class="t-caption u-font-mono c-text-muted u-m-0 u-mb-3">URL: <code>' + escapeHtml(dynamicUrl) + '</code></p>' +
            '<div class="u-flex-between">' +
            '<a href="' + escapeHtml(dynamicUrl) + '" class="link-text is-arrow">' + escapeHtml(actionLabel) + ' <span aria-hidden="true">→</span></a>' +
            '<a href="/programs/eligibility?program=' + encodeURIComponent(prog.slug) + '" class="t-caption link-text">WIOA Intake</a>' +
            '</div>' +
            '</div>' +
            '</article>'
          );
        })
        .join('');
      return;
    }

    if (collectionId === 'careerCenters') {
      el.innerHTML = filtered
        .map(function (center) {
          var name = getLocalizedField(center.name, locale);
          return (
            '<article class="sb-card c-feature-card is-light" data-cms-item-id="' + escapeHtml(center.id) + '">' +
            '<span class="t-eyebrow c-text-accent">' + escapeHtml(center.state + ' · ' + center.wioaSystem) + '</span>' +
            '<h3 class="t-h4 c-text-brand u-mt-1 u-mb-2">' + escapeHtml(name) + '</h3>' +
            '<p class="t-body-sm c-text-secondary u-mt-0 u-mb-2"><strong>Counties Served:</strong> ' + escapeHtml(center.countiesServed) + '</p>' +
            '<p class="t-caption c-text-primary u-m-0 u-mb-1"><strong>Address:</strong> ' + escapeHtml(center.address) + '</p>' +
            '<p class="t-caption c-text-primary u-m-0 u-mb-3"><strong>Phone:</strong> <a href="tel:' + escapeHtml(center.phone) + '" class="link-text">' + escapeHtml(center.phone) + '</a></p>' +
            '<span class="t-caption c-text-muted">Funds ' + (center.eligibleProgramIds ? center.eligibleProgramIds.length : 6) + ' Springboards Trade Pathways</span>' +
            '</article>'
          );
        })
        .join('');
      return;
    }

    if (collectionId === 'partnerDirectory') {
      el.innerHTML = filtered
        .map(function (partner) {
          var title = getLocalizedField(partner.title, locale);
          var summary = getLocalizedField(partner.summary, locale);
          return (
            '<article class="sb-card c-feature-card is-light" data-cms-item-id="' + escapeHtml(partner.id) + '">' +
            '<span class="t-eyebrow c-text-accent">' + escapeHtml(partner.partnershipType) + '</span>' +
            '<h3 class="t-h4 c-text-brand u-mt-1 u-mb-2">' + escapeHtml(title) + '</h3>' +
            '<p class="t-body-sm c-text-secondary u-mt-0 u-mb-3">' + escapeHtml(summary) + '</p>' +
            '<p class="t-caption c-text-primary u-m-0 u-mb-3"><strong>Model:</strong> ' + escapeHtml(partner.reimbursementModel) + '</p>' +
            '<a href="/community/partner#' + escapeHtml(partner.slug) + '" class="link-text is-arrow">Open Partner Track <span aria-hidden="true">→</span></a>' +
            '</article>'
          );
        })
        .join('');
      return;
    }

    if (collectionId === 'utilityPages') {
      el.innerHTML = filtered
        .map(function (uPage) {
          var title = getLocalizedField(uPage.title, locale);
          var purpose = getLocalizedField(uPage.purpose, locale);
          return (
            '<article class="sb-card c-feature-card is-light" data-cms-item-id="' + escapeHtml(uPage.id) + '">' +
            '<div class="u-flex-between u-mb-2">' +
            '<span class="t-eyebrow c-text-accent">' + escapeHtml(uPage.httpStatus) + '</span>' +
            '<code class="t-caption u-font-mono">' + escapeHtml(uPage.canonicalPath) + '</code>' +
            '</div>' +
            '<h3 class="t-h4 c-text-brand u-mt-0 u-mb-2">' + escapeHtml(title) + '</h3>' +
            '<p class="t-body-sm c-text-secondary u-mt-0 u-mb-3">' + escapeHtml(purpose) + '</p>' +
            '<div class="u-flex-between u-pt-2" style="border-top: 1px solid var(--color-border-subtle);">' +
            '<span class="t-caption c-text-muted">Robots: <code>' + escapeHtml(uPage.robotsPolicy) + '</code></span>' +
            '<a href="' + escapeHtml(uPage.canonicalPath) + '" class="link-text is-arrow">Open Utility Page <span aria-hidden="true">→</span></a>' +
            '</div>' +
            '</article>'
          );
        })
        .join('');
    }
  }

  function setLocale(nextLocale) {
    if (nextLocale !== 'en-US' && nextLocale !== 'es-US') return;
    currentLocale = nextLocale;
    try {
      localStorage.setItem('sb_site_locale', currentLocale);
    } catch {
      // Ignore storage errors
    }
    document.querySelectorAll('[data-component="cms-collection"]').forEach(function (el) {
      el.setAttribute('data-prop-locale', currentLocale);
      renderCmsCollection(el);
    });
    document.querySelectorAll('[data-i18n-en]').forEach(function (el) {
      var text = currentLocale === 'es-US'
        ? el.getAttribute('data-i18n-es') || el.getAttribute('data-i18n-en')
        : el.getAttribute('data-i18n-en');
      if (text) el.textContent = text;
    });
    document.querySelectorAll('[data-locale-toggle]').forEach(function (btn) {
      var isSelected = btn.getAttribute('data-locale-toggle') === currentLocale;
      btn.classList.toggle('is-active', isSelected);
      btn.setAttribute('aria-pressed', String(isSelected));
    });
  }

  function renderComponent(el) {
    if (!el || !el.getAttribute) return;
    var type = el.getAttribute('data-component');
    switch (type) {
      case 'section-header':
        renderSectionHeader(el);
        break;
      case 'feature-card':
        renderFeatureCard(el);
        break;
      case 'cta-banner':
        renderCtaBanner(el);
        break;
      case 'site-navbar':
        renderSiteNavbar(el);
        break;
      case 'site-footer':
        renderSiteFooter(el);
        break;
      case 'cms-collection':
        renderCmsCollection(el);
        break;
      default:
        break;
    }
  }

  function updateProps(el, props) {
    if (!el || !props) return;
    Object.keys(props).forEach(function (key) {
      var attrName = key.indexOf('data-prop-') === 0 ? key : 'data-prop-' + key;
      el.setAttribute(attrName, props[key]);
    });
    renderComponent(el);
  }

  function mountAll(root) {
    var scope = root || document;
    scope.querySelectorAll('[data-component]').forEach(renderComponent);
  }

  /**
   * Static Firebase Hosting + Local Preview Resilient Form Submission Helper
   */
  async function submitFormWithStaticFallback(apiEndpoint, firestoreCollection, payload) {
    try {
      var res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      var contentType = (res.headers && res.headers.get('content-type')) || '';
      if (contentType.indexOf('application/json') !== -1) {
        var data = await res.json();
        if (res.ok) return { ok: true, data: data };
        if (res.status === 400 || res.status === 429) {
          throw new Error(data.error || 'Please check your entries and try again.');
        }
      }
    } catch (err) {
      if (err && err.message && err.message.indexOf('Action Required') !== -1) {
        throw err;
      }
    }

    var fields = {
      createdAt: { timestampValue: new Date().toISOString() },
      deliveredTo: { stringValue: 'info@springboardsfcd.org' }
    };
    Object.keys(payload || {}).forEach(function (k) {
      var v = payload[k];
      if (typeof v === 'boolean') {
        fields[k] = { booleanValue: v };
      } else {
        fields[k] = { stringValue: String(v == null ? '' : v) };
      }
    });

    try {
      await fetch(
        'https://firestore.googleapis.com/v1/projects/springboards-community-dev/databases/main/documents/' +
          encodeURIComponent(firestoreCollection),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fields: fields })
        }
      );
    } catch {
      // Offline or restricted network fallback
    }

    try {
      var key = 'sb_static_' + firestoreCollection;
      var existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.unshift(Object.assign({ id: 'local-' + Date.now(), createdAt: new Date().toISOString() }, payload));
      localStorage.setItem(key, JSON.stringify(existing.slice(0, 50)));
    } catch {
      // Ignore storage quota errors
    }

    return { ok: true, data: { success: true, mode: 'firebase-hosting-static' } };
  }

  /* ==========================================================================
     7. CONTROLLED REPOSITORY, DEV/STAGING/PRODUCTION HOSTING & TMS GOVERNANCE
     ========================================================================== */
  var CUSTOM_CODE_HOST_CONFIG = {
    version: '3.2.0',
    repository: {
      provider: 'GitHub Controlled Version Repository',
      branch: 'main',
      codeowners: '/.github/CODEOWNERS',
      prTemplate: '/.github/pull_request_template.md',
      ciWorkflow: '/.github/workflows/firebase-deploy.yml',
      leadOwner: 'Marilynn Ward (@MariDaCoder)'
    },
    environments: {
      development: {
        id: 'development',
        label: 'Development Host (Local & AI Studio Preview)',
        baseUrl: 'https://ais-dev-qnd7dwpxy5lvvqlhyhakyp-11235862349.us-west2.run.app',
        cacheControl: 'no-cache, must-revalidate'
      },
      staging: {
        id: 'staging',
        label: 'Firebase Hosting Staging Channel (GitHub main Auto-Deploy)',
        baseUrl: 'https://springboards-community-dev--staging.web.app',
        mirrorUrl: 'https://ais-pre-qnd7dwpxy5lvvqlhyhakyp-11235862349.us-west2.run.app',
        cacheControl: 'public, max-age=300, stale-while-revalidate=600'
      },
      production: {
        id: 'production',
        label: 'Firebase Hosting Production Global CDN',
        baseUrl: 'https://springboardsfcd.org',
        firebaseSite: 'springboards-community-dev',
        cacheControl: 'public, max-age=3600, stale-while-revalidate=86400'
      }
    },
    files: [
      { path: '/styles.css', type: 'CSS Stylesheet', owner: '@MariDaCoder', version: '3.2.0' },
      { path: '/components.js', type: 'Component & CMS Engine', owner: '@MariDaCoder', version: '3.2.0' },
      { path: '/main.js', type: 'Interactive UI Controller', owner: '@MariDaCoder', version: '3.2.0' },
      { path: '/eligibility.js', type: 'WIOA Eligibility Wizard', owner: '@MariDaCoder', version: '3.2.0' },
      { path: '/analytics.js', type: 'Tag Management & Telemetry', owner: '@MariDaCoder', version: '3.2.0' }
    ]
  };

  function detectActiveEnvironment() {
    try {
      var override = localStorage.getItem('sb_custom_code_env');
      if (override && CUSTOM_CODE_HOST_CONFIG.environments[override]) {
        return override;
      }
    } catch {
      // Ignore storage errors
    }
    var host = (window.location && window.location.hostname) || '';
    if (host.indexOf('springboardsfcd.org') !== -1 || host === 'springboards-community-dev.web.app') {
      return 'production';
    }
    if (host.indexOf('--staging') !== -1 || host.indexOf('ais-pre-') !== -1) {
      return 'staging';
    }
    return 'development';
  }

  function resolveCustomCodeUrl(assetPath, envOverride) {
    var envKey = envOverride || detectActiveEnvironment();
    var envObj = CUSTOM_CODE_HOST_CONFIG.environments[envKey] || CUSTOM_CODE_HOST_CONFIG.environments.production;
    var cleanPath = String(assetPath || '').indexOf('/') === 0 ? assetPath : '/' + assetPath;
    return envObj.baseUrl + cleanPath + '?v=' + CUSTOM_CODE_HOST_CONFIG.version;
  }

  window.SpringboardsCustomCodeHost = {
    config: CUSTOM_CODE_HOST_CONFIG,
    getActiveEnvironment: detectActiveEnvironment,
    setEnvironmentOverride: function (envKey) {
      if (!CUSTOM_CODE_HOST_CONFIG.environments[envKey]) return null;
      try {
        localStorage.setItem('sb_custom_code_env', envKey);
      } catch {
        // Ignore storage errors
      }
      return CUSTOM_CODE_HOST_CONFIG.environments[envKey];
    },
    resolveUrl: resolveCustomCodeUrl
  };

  // Ensure analytics.js (Tag Management System) is loaded across all pages
  if (!window.SpringboardsTMS && !document.querySelector('script[src*="analytics.js"]')) {
    var tmsScript = document.createElement('script');
    tmsScript.src = '/analytics.js';
    tmsScript.defer = true;
    document.head.appendChild(tmsScript);
  }

  window.SpringboardsCMS = {
    schemas: COLLECTIONS_SCHEMA,
    publishingSettings: COLLECTION_PUBLISHING_SETTINGS,
    importFieldMaps: CMS_IMPORT_FIELD_MAPS,
    glossary: LOCALIZATION_GLOSSARY,
    workflows: PUBLISHING_WORKFLOW_STAGES,
    customCodeHost: window.SpringboardsCustomCodeHost,
    getCollectionItems: getCollectionItems,
    getPublishingSettings: getPublishingSettings,
    setCollectionTemplatePublishing: setCollectionTemplatePublishing,
    canPublishTemplateItem: canPublishTemplateItem,
    getDynamicItemUrl: getDynamicItemUrl,
    mapSourceRowToSchema: mapSourceRowToSchema,
    importFromSource: importFromSource,
    resolveProgramRelations: resolveProgramRelations,
    validateRecord: validateCmsRecord,
    addRecord: addDynamicCmsRecord,
    getLocale: function () { return currentLocale; },
    setLocale: setLocale,
    generateSeoSnippet: generateLocalizedSeoSnippet
  };

  window.SpringboardsComponents = {
    mountAll: mountAll,
    renderComponent: renderComponent,
    updateProps: updateProps,
    normalizeRoute: normalizeRoute,
    submitForm: submitFormWithStaticFallback,
    setLocale: setLocale,
    cms: window.SpringboardsCMS,
    customCodeHost: window.SpringboardsCustomCodeHost
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      mountAll(document);
    });
  } else {
    mountAll(document);
  }
})();
