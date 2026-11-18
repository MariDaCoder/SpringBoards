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
    },
    programEvidenceDocs: {
      collectionId: 'programEvidenceDocs',
      label: 'Google Workspace & WIOA Evidence Documents',
      publishTemplatePages: false,
      folderPrefix: null,
      urlPattern: '/resources/cms-workflows#doc-{slug}',
      canonicalParent: '/resources/cms-workflows#section-cms-import',
      indexableBySearch: false,
      blockDraftsAndInternal: true,
      blockEmptyContent: true,
      governanceNote: 'Collection template publishing DISABLED. Policy PDFs, Worksite Agreements, and Google Drive/Sheets sources are internal/compliance reference items rendered inline.'
    }
  };

  var CMS_IMPORT_FIELD_MAPS = {
    tradePrograms: {
      Program_ID: 'id',
      URL_Slug: 'slug',
      Curriculum_Code: 'code',
      Trade_Cluster: 'category',
      WIOA_Track_Type: 'wioaTrackType',
      Readiness_Status: 'readinessStatus',
      Program_Title_EN: 'title.en-US',
      Program_Title_ES: 'title.es-US',
      Summary_EN: 'summary.en-US',
      Summary_ES: 'summary.es-US',
      Cert_Credential: 'credential',
      Max_WIOA_Hours: 'hoursCap',
      Tuition_Policy: 'tuitionCost',
      Career_Center_Refs: 'careerCenterIds',
      Partner_Refs: 'partnerTrackIds',
      Evidence_Doc_Refs: 'evidenceDocIds',
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
      Funded_Program_IDs: 'eligibleProgramIds',
      Publish_Status: 'status',
      Is_Internal_Only: 'isInternal'
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
      Supported_Program_IDs: 'tradeProgramIds',
      Evidence_Doc_Refs: 'evidenceDocIds',
      Publish_Status: 'status',
      Is_Internal_Only: 'isInternal'
    },
    programEvidenceDocs: {
      Doc_ID: 'id',
      Doc_Slug: 'slug',
      Document_Title_EN: 'title.en-US',
      Document_Title_ES: 'title.es-US',
      Workspace_App_Source: 'workspaceApp',
      Drive_File_ID: 'driveFileId',
      Source_URI: 'sourceUri',
      Local_Mirror_Path: 'localPath',
      Program_Classification: 'programClassification',
      Readiness_Status: 'readinessStatus',
      Summary_EN: 'summary.en-US',
      Summary_ES: 'summary.es-US',
      Related_Program_IDs: 'relatedProgramIds',
      Publish_Status: 'status',
      Is_Internal_Only: 'isInternal'
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
        { name: 'code', type: 'string', required: true, description: 'Editorial curriculum index numeral (01–07)' },
        { name: 'category', type: 'enum', options: ['construction', 'mechanical', 'readiness'], required: true, description: 'Primary trade cluster for filtering' },
        { name: 'title', type: 'localized-string', locales: ['en-US', 'es-US'], required: true, maxLength: 70, description: 'Bilingual program title' },
        { name: 'summary', type: 'localized-string', locales: ['en-US', 'es-US'], required: true, maxLength: 220, description: 'Bilingual card summary copy' },
        { name: 'credential', type: 'string', required: true, description: 'Industry certification earned (NCCER, OSHA-10, EPA 608)' },
        { name: 'hoursCap', type: 'number', required: true, description: 'Maximum WIOA Activity 220 paid transitional hours (390)' },
        { name: 'tuitionCost', type: 'string', required: true, description: 'Participant tuition requirement ($0 / 100% Tuition-Free)' },
        { name: 'careerCenterIds', type: 'multi-reference', targetCollection: 'careerCenters', required: true, description: 'Authorized Career Centers verifying WIOA intake for this pathway' },
        { name: 'partnerTrackIds', type: 'multi-reference', targetCollection: 'partnerDirectory', required: true, description: 'Employer OJT & material partner tracks linked to this trade' },
        { name: 'evidenceDocIds', type: 'multi-reference', targetCollection: 'programEvidenceDocs', required: false, description: 'Linked Google Workspace & WIOA policy evidence documents' },
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
    },
    programEvidenceDocs: {
      collectionId: 'programEvidenceDocs',
      label: 'Google Workspace & WIOA Evidence Documents',
      singularLabel: 'Evidence Document',
      urlPattern: '/resources/cms-workflows#doc-{slug}',
      publishTemplatePages: false,
      description: 'Google Drive, Sheets, Docs, and ADWA policy packets mapped from /reference_documents and /program-readiness/*.md.',
      fields: [
        { name: 'id', type: 'string', required: true, description: 'Primary key (e.g., doc-worksite-agreement)' },
        { name: 'slug', type: 'slug', required: true, description: 'URL-safe slug' },
        { name: 'title', type: 'localized-string', locales: ['en-US', 'es-US'], required: true, description: 'Bilingual document title' },
        { name: 'workspaceApp', type: 'string', required: true, description: 'Source Google Workspace app (Google Sheets, Google Docs, Google Drive PDF)' },
        { name: 'driveFileId', type: 'string', required: true, description: 'Google Drive File ID' },
        { name: 'sourceUri', type: 'string', required: true, description: 'Canonical Google Drive URL' },
        { name: 'localPath', type: 'string', required: false, description: 'Local workspace mirror path if downloadable' },
        { name: 'programClassification', type: 'string', required: true, description: 'WIOA program readiness track' },
        { name: 'readinessStatus', type: 'string', required: true, description: 'Operational readiness status from MASTER-TRACKER.md' },
        { name: 'summary', type: 'localized-string', locales: ['en-US', 'es-US'], required: true, description: 'Bilingual summary of statutory/operational scope' },
        { name: 'relatedProgramIds', type: 'multi-reference', targetCollection: 'tradePrograms', required: false, description: 'Linked trade pathways' }
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
        wioaTrackType: 'Transitional Jobs (Activity 220) + OJT',
        readinessStatus: 'Ready Now',
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
        curriculumModules: [
          'Blueprint Reading, Tape Measure Precision & Site Layout',
          'Floor Framing, Sill Plates, Joists & Subfloor Assembly',
          'Wall Framing, Rough Openings, Headers & Structural Bracing',
          'Roof Rafters, Trusses, Exterior Sheathing & Jobsite Safety'
        ],
        careerCenterIds: ['cc-opelika', 'cc-valley', 'cc-lagrange', 'cc-phenix-city'],
        partnerTrackIds: ['part-ojt-host', 'part-materials-tools', 'part-craft-mentor'],
        evidenceDocIds: ['doc-worksite-agreement', 'doc-job-descriptions', 'doc-transitional-jobs-policy', 'doc-workforce-tracker']
      },
      {
        id: 'prog-electrical',
        slug: 'electrical-fundamentals',
        code: '02',
        category: 'mechanical',
        wioaTrackType: 'Transitional Jobs (Activity 220) + OJT',
        readinessStatus: 'Ready Now',
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
        curriculumModules: [
          'Electrical Theory, Ohm’s Law & National Electrical Code (NEC) Safety',
          'EMT & PVC Conduit Bending, Pull Boxes & Raceway Installation',
          'Residential & Commercial Branch Circuits, Receptacles & 3-Way Switches',
          'Service Panel Termination, Grounding & Digital Multimeter Troubleshooting'
        ],
        careerCenterIds: ['cc-opelika', 'cc-valley', 'cc-lagrange', 'cc-phenix-city'],
        partnerTrackIds: ['part-ojt-host', 'part-materials-tools', 'part-craft-mentor'],
        evidenceDocIds: ['doc-worksite-agreement', 'doc-job-descriptions', 'doc-transitional-jobs-policy', 'doc-workforce-tracker']
      },
      {
        id: 'prog-plumbing',
        slug: 'plumbing-pipefitting',
        code: '03',
        category: 'mechanical',
        wioaTrackType: 'Transitional Jobs (Activity 220) + OJT',
        readinessStatus: 'Ready Now',
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
        curriculumModules: [
          'Plumbing Safety, Isometric Drawings & International Plumbing Code Basics',
          'Copper Sweating/Soldering, PEX Crimping & CPVC/PVC Solvent Welding',
          'Drain-Waste-Vent (DWV) Pitching, Traps, Cleanouts & Pressure Testing',
          'Water Heaters, Shutoff Valves & Commercial/Residential Fixture Trim-Out'
        ],
        careerCenterIds: ['cc-opelika', 'cc-valley', 'cc-phenix-city'],
        partnerTrackIds: ['part-ojt-host', 'part-materials-tools'],
        evidenceDocIds: ['doc-worksite-agreement', 'doc-job-descriptions', 'doc-transitional-jobs-policy']
      },
      {
        id: 'prog-hvac',
        slug: 'hvac-mechanical',
        code: '04',
        category: 'mechanical',
        wioaTrackType: 'Transitional Jobs (Activity 220) + OJT',
        readinessStatus: 'Ready Now',
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
        curriculumModules: [
          'Thermodynamics, Refrigerant Cycle & EPA Section 608 Regulatory Prep',
          'Brazing Copper Line Sets, Manifold Gauges, Vacuum Evacuation & Recovery',
          'Sheet Metal & Flex Ductwork Fabrication, Sealing & Airflow Balancing',
          'Low-Voltage Thermostats, Contactors, Capacitors & Heat Pump Diagnostics'
        ],
        careerCenterIds: ['cc-opelika', 'cc-valley', 'cc-lagrange', 'cc-phenix-city'],
        partnerTrackIds: ['part-ojt-host', 'part-craft-mentor'],
        evidenceDocIds: ['doc-worksite-agreement', 'doc-job-descriptions', 'doc-transitional-jobs-policy']
      },
      {
        id: 'prog-safety',
        slug: 'jobsite-safety-osha',
        code: '05',
        category: 'readiness',
        wioaTrackType: 'Foundational Safety & Pre-Employment',
        readinessStatus: 'Ready Now',
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
        curriculumModules: [
          'OSHA Focus Four Hazards: Falls, Caught-In/Between, Struck-By & Electrocution',
          'Personal Protective Equipment (PPE), Respirators, Ladders & Scaffolding',
          'Lockout/Tagout (LOTO), Trenching/Excavation & Hazard Communication (SDS)',
          'NCCER Core: Hand/Power Tool Safety, Material Handling & Basic Rigging'
        ],
        careerCenterIds: ['cc-opelika', 'cc-valley', 'cc-lagrange', 'cc-phenix-city'],
        partnerTrackIds: ['part-sponsor-stipend', 'part-materials-tools'],
        evidenceDocIds: ['doc-worksite-agreement', 'doc-general-provisions-b1-b19', 'doc-transitional-jobs-policy']
      },
      {
        id: 'prog-readiness',
        slug: 'work-readiness-ojt',
        code: '06',
        category: 'readiness',
        wioaTrackType: 'WIOA Activity 220 Transitional Jobs',
        readinessStatus: 'Ready Now',
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
        curriculumModules: [
          'Bi-Weekly Timekeeping, Attendance Verification & Crew Accountability',
          'Jobsite Crew Communication, Supervisor Check-Ins & Conflict Resolution',
          '195-Hour Classroom & Lab Milestone Assessment before Worksite Placement',
          'Direct Employer Interviewing & On-the-Job Training (OJT) Wage Transition'
        ],
        careerCenterIds: ['cc-opelika', 'cc-valley', 'cc-lagrange', 'cc-phenix-city'],
        partnerTrackIds: ['part-ojt-host', 'part-sponsor-stipend'],
        evidenceDocIds: ['doc-worksite-agreement', 'doc-transitional-jobs-policy', 'doc-master-execution-package', 'doc-workforce-tracker']
      },
      {
        id: 'prog-masonry',
        slug: 'masonry-concrete-foundations',
        code: '07',
        category: 'construction',
        wioaTrackType: 'Transitional Jobs (Activity 220) + OJT',
        readinessStatus: 'Ready Now',
        status: 'published',
        isInternal: false,
        title: {
          'en-US': 'Masonry & Concrete Foundations',
          'es-US': 'Albañilería y Cimientos de Concreto'
        },
        summary: {
          'en-US': 'Hands-on concrete form setting, rebar placement, slab finishing, and structural CMU block laying for residential and commercial rehab builds.',
          'es-US': 'Instalación práctica de moldes de concreto, armado de varilla, acabado de losas y colocación de bloques estructurales para obras residenciales y comerciales.'
        },
        credential: 'NCCER Masonry Level 1 + OSHA-10',
        hoursCap: 390,
        tuitionCost: '$0 (100% Tuition-Free)',
        curriculumModules: [
          'Batter Boards, Footing Excavation, Form Setting & Laser Leveling',
          'Rebar Tie-In, Vapor Barriers, Concrete Pouring, Screeding & Bull Floating',
          'Mortar Mixing Proportions, Trowel Control & Structural CMU Block Laying',
          'Brick Veneer Bonds, Control Joints, Tuckpointing & Masonry Restoration'
        ],
        careerCenterIds: ['cc-opelika', 'cc-valley', 'cc-phenix-city'],
        partnerTrackIds: ['part-ojt-host', 'part-materials-tools'],
        evidenceDocIds: ['doc-worksite-agreement', 'doc-job-descriptions', 'doc-transitional-jobs-policy']
      },
      {
        id: 'prog-industrial-welding-draft',
        slug: 'industrial-welding-draft',
        code: '08',
        category: 'mechanical',
        wioaTrackType: 'Internal Curriculum Syllabus Draft',
        readinessStatus: 'In Preparation',
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
        partnerTrackIds: ['part-ojt-host'],
        evidenceDocIds: ['doc-master-execution-package']
      },
      {
        id: 'prog-ita-etpl-prep',
        slug: 'ita-etpl-provider-track',
        code: '09',
        category: 'readiness',
        wioaTrackType: 'WIOA ITA / ETPL Training Provider Track',
        readinessStatus: 'In Preparation',
        status: 'draft',
        isInternal: true,
        title: {
          'en-US': 'WIOA ITA / ETPL Eligible Training Provider Track (In Preparation)',
          'es-US': 'Proveedor Elegible WIOA ITA / ETPL (En Preparación)'
        },
        summary: {
          'en-US': 'Internal compliance preparation track for Alabama Eligible Training Provider List (ETPL) and Individual Training Account (ITA) vouchers. Blocked from public publishing until ACCS licensure and state approval are finalized.',
          'es-US': 'Ruta interna de preparación para la Lista de Proveedores Elegibles (ETPL) y Cuentas Individuales de Capacitación (ITA). Bloqueada hasta aprobación estatal.'
        },
        credential: 'State ETPL / ACCS Private School Licensure Packet (Pending)',
        hoursCap: 390,
        tuitionCost: 'Pending State ETPL Schedule',
        careerCenterIds: ['cc-opelika'],
        partnerTrackIds: ['part-ojt-host'],
        evidenceDocIds: ['doc-etpl-guide-jill-grant', 'doc-ita-guidelines-2025-11', 'doc-ad-policy-2024-04']
      },
      {
        id: 'prog-apprenticeship-future',
        slug: 'registered-apprenticeship-future',
        code: '10',
        category: 'construction',
        wioaTrackType: 'Registered Apprenticeship (RA)',
        readinessStatus: 'Future Program',
        status: 'archived',
        isInternal: true,
        title: {
          'en-US': 'Registered Apprenticeship Sponsor Pathway (Future Program)',
          'es-US': 'Programa de Aprendizaje Registrado (Futuro)'
        },
        summary: {
          'en-US': 'Long-term roadmap for U.S. DOL / Alabama Office of Apprenticeship registration (2,000 OJT hours + 144 RTI hours). Disabled from public template publishing.',
          'es-US': 'Hoja de ruta futura para registro oficial de aprendizaje (2,000 horas OJT + 144 horas RTI). Deshabilitado para publicación pública.'
        },
        credential: 'USDOL Registered Apprenticeship Sponsor (Future)',
        hoursCap: 2000,
        tuitionCost: '$0 (Future Sponsor Track)',
        careerCenterIds: ['cc-opelika'],
        partnerTrackIds: ['part-ojt-host'],
        evidenceDocIds: ['doc-master-execution-package']
      },
      {
        id: 'prog-staars-vendor-internal',
        slug: 'staars-vendor-activation',
        code: '11',
        category: 'readiness',
        wioaTrackType: 'State of Alabama STAARS Vendor Compliance',
        readinessStatus: 'Operational / In Preparation',
        status: 'draft',
        isInternal: true,
        title: {
          'en-US': 'State of Alabama STAARS Vendor Activation (Internal Operations)',
          'es-US': 'Activación de Proveedor Estatal STAARS (Operaciones Internas)'
        },
        summary: {
          'en-US': 'Internal administrative record tracking State of Alabama Accounting and Resource System (STAARS) vendor registration and E-Verify compliance. Never published as a public page.',
          'es-US': 'Registro administrativo interno para el sistema estatal STAARS y cumplimiento E-Verify. No se publica como página pública.'
        },
        credential: 'STAARS Vendor ID & E-Verify MOU',
        hoursCap: 390,
        tuitionCost: 'N/A (Internal Operations)',
        careerCenterIds: ['cc-opelika'],
        partnerTrackIds: ['part-ojt-host'],
        evidenceDocIds: ['doc-general-provisions-b1-b19', 'doc-master-execution-package']
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
        eligibleProgramIds: ['prog-carpentry', 'prog-electrical', 'prog-plumbing', 'prog-hvac', 'prog-safety', 'prog-readiness', 'prog-masonry']
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
        eligibleProgramIds: ['prog-carpentry', 'prog-electrical', 'prog-plumbing', 'prog-hvac', 'prog-safety', 'prog-readiness', 'prog-masonry']
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
      },
      {
        id: 'cc-phenix-city',
        slug: 'phenix-city-career-center',
        name: {
          'en-US': 'Phenix City Career Center (Alabama Works!)',
          'es-US': 'Centro de Carreras de Phenix City (Alabama Works!)'
        },
        state: 'AL',
        wioaSystem: 'Alabama Works! Region 5',
        countiesServed: 'Russell, Lee & East Alabama Corridor',
        address: '1703B 4th Ave, Phenix City, AL 36867',
        phone: '(334) 214-4828',
        eligibleProgramIds: ['prog-carpentry', 'prog-electrical', 'prog-plumbing', 'prog-hvac', 'prog-safety', 'prog-readiness', 'prog-masonry']
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
        tradeProgramIds: ['prog-carpentry', 'prog-electrical', 'prog-plumbing', 'prog-hvac', 'prog-readiness', 'prog-masonry']
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
        tradeProgramIds: ['prog-carpentry', 'prog-electrical', 'prog-plumbing', 'prog-safety', 'prog-masonry']
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
        relatedProgramIds: ['prog-carpentry', 'prog-electrical', 'prog-plumbing', 'prog-hvac', 'prog-safety', 'prog-masonry']
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
        relatedProgramIds: ['prog-readiness', 'prog-carpentry', 'prog-masonry']
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
        relatedProgramIds: ['prog-carpentry', 'prog-electrical', 'prog-plumbing', 'prog-hvac', 'prog-masonry']
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
        relatedProgramIds: ['prog-readiness', 'prog-safety', 'prog-carpentry', 'prog-electrical']
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
    ],
    programEvidenceDocs: [
      {
        id: 'doc-workforce-tracker',
        slug: 'springboards-workforce-programs-tracker',
        title: {
          'en-US': 'Springboards Workforce Programs Master Tracker',
          'es-US': 'Registro Maestro de Programas Laborales de Springboards'
        },
        workspaceApp: 'Google Sheets',
        driveFileId: '1KZgNGpwHedOxN6oSSwdoAbXtV3bhTuLJBx65tdRbtlQ',
        sourceUri: 'https://drive.google.com/open?id=1KZgNGpwHedOxN6oSSwdoAbXtV3bhTuLJBx65tdRbtlQ',
        localPath: '/program-readiness/MASTER-TRACKER.md',
        programClassification: 'All Programs (Master Readiness Matrix)',
        readinessStatus: 'Operational / Active',
        summary: {
          'en-US': '10-column Google Sheets master candidate & program readiness tracker governing Transitional Jobs, OJT, ITA/ETPL, Apprenticeship, and STAARS.',
          'es-US': 'Hoja de cálculo maestra en Google Sheets que gestiona empleos transicionales, OJT, ITA/ETPL, aprendizaje y STAARS.'
        },
        relatedProgramIds: ['prog-carpentry', 'prog-electrical', 'prog-plumbing', 'prog-hvac', 'prog-safety', 'prog-readiness', 'prog-masonry'],
        status: 'published',
        isInternal: false
      },
      {
        id: 'doc-worksite-agreement',
        slug: 'worksite-agreement-springboards',
        title: {
          'en-US': 'WIOA Host Worksite Agreement (Springboards)',
          'es-US': 'Acuerdo Oficial de Obra y Empleador Anfitrión WIOA'
        },
        workspaceApp: 'Google Docs / PDF Packet',
        driveFileId: '1hRsffn1SSBwSy4sI-_l6igpqDyCgVsbE',
        sourceUri: 'https://drive.google.com/open?id=1hRsffn1SSBwSy4sI-_l6igpqDyCgVsbE',
        localPath: '/Worksite Agreement_Springboards.pdf',
        programClassification: 'Transitional Jobs (Activity 220) & OJT',
        readinessStatus: 'Ready Now',
        summary: {
          'en-US': 'Executed worksite host agreement specifying supervision ratios, OSHA safety compliance, workers compensation, and 390-hour timekeeping.',
          'es-US': 'Acuerdo oficial de lugar de trabajo que establece supervisión, normas OSHA, compensación laboral y registro de 390 horas.'
        },
        relatedProgramIds: ['prog-carpentry', 'prog-electrical', 'prog-plumbing', 'prog-hvac', 'prog-safety', 'prog-readiness', 'prog-masonry'],
        status: 'published',
        isInternal: false
      },
      {
        id: 'doc-job-descriptions',
        slug: 'job-descriptions-springboards',
        title: {
          'en-US': 'Standardized Trade Trainee Job Descriptions',
          'es-US': 'Descripciones de Puesto para Aprendices de Oficios'
        },
        workspaceApp: 'Google Docs',
        driveFileId: '1rbPPzLyPEeCMlia-ixjSm1U0WWqig99W',
        sourceUri: 'https://drive.google.com/open?id=1rbPPzLyPEeCMlia-ixjSm1U0WWqig99W',
        localPath: '/program-readiness/TRANSITIONAL-JOBS.md',
        programClassification: 'Transitional Jobs & On-the-Job Training (OJT)',
        readinessStatus: 'Ready Now',
        summary: {
          'en-US': 'Competency checklists and duty descriptions for Carpentry, Electrical, Plumbing, HVAC, and Masonry trainees placed at East Alabama worksites.',
          'es-US': 'Listas de competencias y funciones para aprendices de carpintería, electricidad, plomería, HVAC y albañilería.'
        },
        relatedProgramIds: ['prog-carpentry', 'prog-electrical', 'prog-plumbing', 'prog-hvac', 'prog-masonry'],
        status: 'published',
        isInternal: false
      },
      {
        id: 'doc-transitional-jobs-policy',
        slug: 'guidelines-2025-13-transitional-jobs',
        title: {
          'en-US': 'Alabama Policy 2025-13: Transitional Jobs Guidelines',
          'es-US': 'Política de Alabama 2025-13: Lineamientos de Empleos Transicionales'
        },
        workspaceApp: 'Google Drive PDF',
        driveFileId: '1OF-StQe79K1dzMBdt-Fk8NrQSLVo-5Gr',
        sourceUri: 'https://drive.google.com/open?id=1OF-StQe79K1dzMBdt-Fk8NrQSLVo-5Gr',
        localPath: '/program-readiness/TRANSITIONAL-JOBS.md',
        programClassification: 'Transitional Jobs (Activity Code 220)',
        readinessStatus: 'Ready Now',
        summary: {
          'en-US': 'Statutory Alabama Workforce Development Division policy governing Activity Code 220 eligibility, 390-hour caps, and employer transition.',
          'es-US': 'Política oficial de Alabama que regula el Código de Actividad 220, el límite de 390 horas y la transición laboral.'
        },
        relatedProgramIds: ['prog-carpentry', 'prog-electrical', 'prog-plumbing', 'prog-hvac', 'prog-safety', 'prog-readiness', 'prog-masonry'],
        status: 'published',
        isInternal: false
      },
      {
        id: 'doc-master-execution-package',
        slug: 'springboards-master-execution-package',
        title: {
          'en-US': 'Springboards Master Execution Package',
          'es-US': 'Paquete Maestro de Ejecución Operativa de Springboards'
        },
        workspaceApp: 'Google Drive PDF',
        driveFileId: '1uMFzOdeoIIrFkXK03Qydy3_8zEzoBD-l',
        sourceUri: 'https://drive.google.com/open?id=1uMFzOdeoIIrFkXK03Qydy3_8zEzoBD-l',
        localPath: '/program-readiness/MASTER-TRACKER.md',
        programClassification: 'Cross-Program Governance & WIOA Execution',
        readinessStatus: 'Ready Now',
        summary: {
          'en-US': 'Consolidated operating manual covering WIOA intake routing, Career Center coordination, payroll documentation, and compliance sign-off.',
          'es-US': 'Manual operativo consolidado sobre admisión WIOA, coordinación con Centros de Carreras y cumplimiento.'
        },
        relatedProgramIds: ['prog-readiness', 'prog-carpentry', 'prog-electrical'],
        status: 'published',
        isInternal: false
      },
      {
        id: 'doc-general-provisions-b1-b19',
        slug: 'general-provisions-b1-b19',
        title: {
          'en-US': 'General Provisions B1–B19 (WIOA Section 188 & Fiscal Rules)',
          'es-US': 'Disposiciones Generales B1–B19 (Igualdad WIOA Sección 188)'
        },
        workspaceApp: 'Google Drive PDF',
        driveFileId: '12vyqltnx3TOJ_jx8glCAulI6SFaN0Mw6',
        sourceUri: 'https://drive.google.com/open?id=12vyqltnx3TOJ_jx8glCAulI6SFaN0Mw6',
        localPath: '/program-readiness/STAARS.md',
        programClassification: 'STAARS & WIOA Section 188 Compliance',
        readinessStatus: 'Operational / In Preparation',
        summary: {
          'en-US': 'Standard state grant provisions covering Section 188 Equal Opportunity, E-Verify, grievance procedures, and fiscal audit standards.',
          'es-US': 'Disposiciones estatales sobre Igualdad de Oportunidades Sección 188, E-Verify y auditoría fiscal.'
        },
        relatedProgramIds: ['prog-safety', 'prog-readiness'],
        status: 'published',
        isInternal: false
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
      ownerRole: 'Marilynn Ward (Lead Site Designer, Developer & Content Manager) + Domain Contributors',
      title: 'Stage 1: Design, Code, Content & Schema Authoring',
      checklist: [
        'Marilynn Ward oversees UI/UX design, full-stack architecture, and content authoring across all 14 routes and 6 CMS Collections.',
        'All required Collection fields (id, slug, localized title/summary, category) and multi-reference links pass schema validation.',
        'Clean folder URL slug matches firebase.json cleanUrls hierarchy with zero root duplicate HTML files.'
      ]
    },
    {
      stageId: 'stage_2_localization_seo',
      stepNumber: '02',
      ownerRole: 'Marilynn Ward (Principal Reviewer) + Giselle Campos (Curriculum Advisor)',
      title: 'Stage 2: Translation, Asset Localization & SEO Metadata Review',
      checklist: [
        'English (en-US) and Spanish (es-US) strings are populated with statutory WIOA/OSHA acronyms preserved.',
        'Page <title> (30–60 chars), <meta name="description"> (120–160 chars), canonical URL, and hreflang tags are verified.',
        'All visual assets include localized alt text and zero text is baked into raster WebP/PNG graphics.'
      ]
    },
    {
      stageId: 'stage_3_compliance_review',
      stepNumber: '03',
      ownerRole: 'Marilynn Ward (Principal Change Reviewer) + Board & WIOA Compliance Advisors',
      title: 'Stage 3: WIOA Section 188, Governance & 501(c)(3) Approval Gate',
      checklist: [
        'Marilynn Ward reviews and signs off all changes with advisory input from Marvin Thompson, Melvin M.L. Ward, Krisse Pollard Story, and Shamia Morgan.',
        'Confirm WIOA Activity 220 (390-hour cap / 195-hour classroom milestone) and Section 188 Equal Opportunity notice accuracy.',
        'Confirm 501(c)(3) tax-receipt disclosures and Eastern Time Zone (America/New_York · Mon–Thu 8 AM–4 PM EST) accuracy.'
      ]
    },
    {
      stageId: 'stage_4_executive_publish',
      stepNumber: '04',
      ownerRole: 'Marilynn Ward (Sole Production Publisher & Release Authority)',
      title: 'Stage 4: Technical Build, Private Staging Promotion & Production Publishing',
      checklist: [
        'Verify changes on Private Staging Domain (private staging enabled; staging domain indexing disabled via X-Robots-Tag: noindex).',
        'Run automated build & lint audit (npm run build && npm run lint) with zero errors or duplicate records.',
        'Marilynn Ward promotes verified build and Firestore security rules to production (https://springboardsfcd.org) and logs the release.'
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
    if (collectionId === 'programEvidenceDocs' && item && item.sourceUri) {
      return item.sourceUri;
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
    var seenIds = {};
    var combined = [];
    custom.concat(base).forEach(function (item) {
      var key = (item && (item.id || item.slug)) || Math.random();
      if (!seenIds[key]) {
        seenIds[key] = true;
        combined.push(item);
      }
    });
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
      } else if (
        targetPath === 'careerCenterIds' ||
        targetPath === 'partnerTrackIds' ||
        targetPath === 'eligibleProgramIds' ||
        targetPath === 'tradeProgramIds' ||
        targetPath === 'evidenceDocIds' ||
        targetPath === 'relatedProgramIds'
      ) {
        if (Array.isArray(rawVal)) {
          mapped[targetPath] = rawVal;
        } else if (typeof rawVal === 'string' && rawVal) {
          mapped[targetPath] = rawVal.split(/[|,;]/).map(function (s) { return s.trim(); }).filter(Boolean);
        } else {
          mapped[targetPath] = [];
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

  function splitCsvLine(line) {
    var result = [];
    var current = '';
    var inQuotes = false;
    for (var i = 0; i < line.length; i++) {
      var ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  }

  function parseCsvToObjects(csvText) {
    var lines = String(csvText || '')
      .split(/\r?\n/)
      .map(function (l) { return l.trim(); })
      .filter(Boolean);
    if (lines.length < 2) return [];
    var headers = splitCsvLine(lines[0]);
    return lines.slice(1).map(function (line) {
      var values = splitCsvLine(line);
      var obj = {};
      headers.forEach(function (h, i) {
        obj[h] = values[i] !== undefined ? values[i] : '';
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

  function fetchAndImportCsvSource(collectionId, csvUrl) {
    return fetch(csvUrl, { headers: { Accept: 'text/csv,text/plain,*/*' } })
      .then(function (r) {
        if (!r.ok) throw new Error('Failed to load CSV source: ' + csvUrl);
        return r.text();
      })
      .then(function (csvText) {
        return importFromSource(collectionId, csvText, 'csv');
      });
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
    var allDocs = getCollectionItems('programEvidenceDocs', true);

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
          phone: c.phone,
          address: c.address,
          wioaSystem: c.wioaSystem,
          countiesServed: c.countiesServed
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
          slug: p.slug,
          title: getLocalizedField(p.title, lang),
          partnershipType: p.partnershipType,
          reimbursementModel: p.reimbursementModel,
          summary: getLocalizedField(p.summary, lang)
        };
      });

    var faqs = allFaqs
      .filter(function (f) {
        return Array.isArray(f.relatedProgramIds) && f.relatedProgramIds.indexOf(program.id) !== -1;
      })
      .map(function (f) {
        return {
          id: f.id,
          question: getLocalizedField(f.question, lang),
          answer: getLocalizedField(f.answer, lang)
        };
      });

    var evidenceDocs = (program.evidenceDocIds || [])
      .map(function (id) {
        return allDocs.find(function (d) { return d.id === id; });
      })
      .filter(Boolean)
      .map(function (d) {
        return {
          id: d.id,
          slug: d.slug,
          title: getLocalizedField(d.title, lang),
          workspaceApp: d.workspaceApp,
          driveFileId: d.driveFileId,
          sourceUri: d.sourceUri,
          localPath: d.localPath,
          programClassification: d.programClassification,
          readinessStatus: d.readinessStatus,
          summary: getLocalizedField(d.summary, lang)
        };
      });

    return {
      careerCenters: centers,
      partnerTracks: partners,
      relatedFaqs: faqs,
      evidenceDocs: evidenceDocs
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
      logoImg.setAttribute('src', '/assets/aistudio/springboards_logo_white_text.webp?v=20261118-opt');
      logoImg.setAttribute('width', logoImg.getAttribute('width') || '260');
      logoImg.setAttribute('height', logoImg.getAttribute('height') || '52');
      logoImg.setAttribute('loading', 'eager');
      logoImg.setAttribute('fetchpriority', 'high');
      logoImg.setAttribute('decoding', 'async');
      var currentAlt = (logoImg.getAttribute('alt') || '').trim();
      if (!currentAlt || currentAlt === 'Springboards Logo') {
        logoImg.setAttribute('alt', 'Springboards for Community Development — Home');
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

  function initFooterInteractiveMap(card) {
    if (!card || card.getAttribute('data-map-bound') === 'true') return;
    card.setAttribute('data-map-bound', 'true');

    var DEFAULT_LAT = 32.8529;
    var DEFAULT_LNG = -85.2045;
    var DEFAULT_ZOOM = 15;
    var AUTOCOMPLETE_FIELDS = [
      'displayName',
      'formattedAddress',
      'location',
      'viewport',
      'nationalPhoneNumber',
      'googleMapsURI'
    ];

    var LOCATIONS = {
      'springboards-lanett-hq': {
        id: 'springboards-lanett-hq',
        shortLabel: 'Lanett HQ',
        displayName: 'Springboards for Community Development HQ',
        category: 'Primary Workforce & Housing Hub',
        formattedAddress: '2269 15th Ave. S.W., Lanett, AL 36863',
        nationalPhoneNumber: '731.388.WORK',
        phoneHref: 'tel:731.388.WORK',
        hours: 'Mon–Fri 8am–5pm',
        services: 'Paid Up-Skilling (Up to 350 Hrs), Transitional Housing Rehab & WIOA Intake',
        latitude: 32.8529,
        longitude: -85.2045,
        googleMapsURI: 'https://www.google.com/maps/search/?api=1&query=2269+15th+Ave+SW,+Lanett,+AL+36863',
        directionsURI: 'https://www.google.com/maps/dir/?api=1&destination=2269+15th+Ave+SW,+Lanett,+AL+36863',
        isPrimary: true
      },
      'springboards-valley-site': {
        id: 'springboards-valley-site',
        shortLabel: 'Valley Lab',
        displayName: 'Springboards Valley / Shawmut Field Lab',
        category: 'Residential Rehab & Trade Lab',
        formattedAddress: '2900 20th Ave., Valley, AL 36854 (HQ: 2269 15th Ave. S.W., Lanett, AL)',
        nationalPhoneNumber: '731.388.WORK',
        phoneHref: 'tel:731.388.WORK',
        hours: 'Mon–Fri 7:30am–4:30pm',
        services: 'Hands-On Carpentry, Electrical, HVAC & Plumbing Field Training',
        latitude: 32.8187,
        longitude: -85.1794,
        googleMapsURI: 'https://www.google.com/maps/search/?api=1&query=2900+20th+Ave,+Valley,+AL+36854',
        directionsURI: 'https://www.google.com/maps/dir/?api=1&destination=2900+20th+Ave,+Valley,+AL+36854',
        isPrimary: false
      },
      'opelika-wioa-center': {
        id: 'opelika-wioa-center',
        shortLabel: 'Opelika WIOA',
        displayName: 'Opelika Alabama Career Center (WIOA Partner)',
        category: 'Regional WIOA Career Center',
        formattedAddress: '2300 Frederick Rd., Opelika, AL 36801 (Springboards HQ: Lanett, AL)',
        nationalPhoneNumber: '731.388.WORK · (334) 749-5065',
        phoneHref: 'tel:731.388.WORK',
        hours: 'Mon–Fri 8am–4:30pm',
        services: 'WIOA Tuition Vouchers & OJT Wage Reimbursement for Springboards Trainees',
        latitude: 32.6454,
        longitude: -85.3783,
        googleMapsURI: 'https://www.google.com/maps/search/?api=1&query=2300+Frederick+Rd,+Opelika,+AL+36801',
        directionsURI: 'https://www.google.com/maps/dir/?api=1&destination=2300+Frederick+Rd,+Opelika,+AL+36801',
        isPrimary: false
      },
      'lagrange-partner-hub': {
        id: 'lagrange-partner-hub',
        shortLabel: 'LaGrange',
        displayName: 'Chattahoochee Valley / LaGrange Corridor Hub',
        category: 'Employer & Transit Partner Point',
        formattedAddress: '1002 Longley Ave., LaGrange, GA 30240 (Springboards HQ: Lanett, AL)',
        nationalPhoneNumber: '731.388.WORK',
        phoneHref: 'tel:731.388.WORK',
        hours: 'Mon–Fri 8am–5pm',
        services: 'Regional Industrial & Commercial Contractor Placement Network',
        latitude: 33.0393,
        longitude: -85.0313,
        googleMapsURI: 'https://www.google.com/maps/search/?api=1&query=1002+Longley+Ave,+LaGrange,+GA+30240',
        directionsURI: 'https://www.google.com/maps/dir/?api=1&destination=1002+Longley+Ave,+LaGrange,+GA+30240',
        isPrimary: false
      }
    };

    var MAP_STYLES = {
      default: [],
      silver: [
        { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
        { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
        { featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{ color: '#bdbdbd' }] },
        { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
        { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
        { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
        { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
        { featureType: 'road.arterial', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
        { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#dadada' }] },
        { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
        { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
        { featureType: 'transit.line', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
        { featureType: 'transit.station', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9c9c9' }] },
        { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] }
      ],
      night: [
        { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
        { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
        { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
        { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#263c3f' }] },
        { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#6b9a76' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
        { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
        { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
        { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#746855' }] },
        { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1f2835' }] },
        { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#f3d19c' }] },
        { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2f3948' }] },
        { featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
        { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#515c6d' }] },
        { featureType: 'water', elementType: 'labels.text.stroke', stylers: [{ color: '#17263c' }] }
      ],
      retro: [
        { elementType: 'geometry', stylers: [{ color: '#ebe3cd' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#523735' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f1e6' }] },
        { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#c9b2a6' }] },
        { featureType: 'administrative.land_parcel', elementType: 'geometry.stroke', stylers: [{ color: '#dcd2be' }] },
        { featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{ color: '#ae9e90' }] },
        { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#dfd2ae' }] },
        { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#dfd2ae' }] },
        { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#93817c' }] },
        { featureType: 'poi.park', elementType: 'geometry.fill', stylers: [{ color: '#a5b076' }] },
        { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#447530' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#f5f1e6' }] },
        { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#fdfcf8' }] },
        { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#f8c967' }] },
        { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#e9bc62' }] },
        { featureType: 'road.highway.controlled_access', elementType: 'geometry', stylers: [{ color: '#e98d58' }] },
        { featureType: 'road.highway.controlled_access', elementType: 'geometry.stroke', stylers: [{ color: '#db8555' }] },
        { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#806b63' }] },
        { featureType: 'transit.line', elementType: 'geometry', stylers: [{ color: '#dfd2ae' }] },
        { featureType: 'transit.line', elementType: 'labels.text.fill', stylers: [{ color: '#8f7d77' }] },
        { featureType: 'transit.line', elementType: 'labels.text.stroke', stylers: [{ color: '#ebe3cd' }] },
        { featureType: 'transit.station', elementType: 'geometry', stylers: [{ color: '#dfd2ae' }] },
        { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#b9d3c2' }] },
        { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#92998d' }] }
      ],
      hiding: [
        { featureType: 'poi.business', stylers: [{ visibility: 'off' }] },
        { featureType: 'transit', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] }
      ]
    };

    var state = {
      lat: parseFloat(card.getAttribute('data-map-lat')) || DEFAULT_LAT,
      lng: parseFloat(card.getAttribute('data-map-lng')) || DEFAULT_LNG,
      zoom: parseInt(card.getAttribute('data-map-zoom'), 10) || DEFAULT_ZOOM,
      style: card.getAttribute('data-map-style') || 'retro',
      activeMarkerId: 'springboards-lanett-hq',
      addressOpen: card.getAttribute('data-address-open') === 'true',
      userLocation: null,
      gmpMap: null,
      gmpMarkers: {},
      gmpInfoWindow: null,
      gmpGeocoder: null,
      MarkerClasses: null
    };

    var iframe = card.querySelector('.footer-map');
    var jsCanvas = card.querySelector('.footer-map-js-canvas');
    var styleControl = card.querySelector('#style-selector-control');
    var styleSelector = card.querySelector('#style-selector');
    var searchBar = card.querySelector('#footerMapSearchBar, .footer-map-search-bar');
    var addressTriggerBtn = card.querySelector('#footerMapAddressTrigger');
    var markersBar = card.querySelector('.footer-map-markers-bar');
    var locateBtn = card.querySelector('#footerMapLocateUserBtn');
    var acInput = card.querySelector('#footerMapAutocompleteInput');
    var acList = card.querySelector('#footerMapAutocompleteList');
    var detailCategory = card.querySelector('#footerMapDetailCategory');
    var detailDistance = card.querySelector('#footerMapDetailDistance');
    var detailTitle = card.querySelector('#footerMapDetailTitle');
    var detailCoords = card.querySelector('#footerMapDetailCoords');
    var detailServices = card.querySelector('#footerMapDetailServices');
    var detailAddressLink = card.querySelector('#footerMapDetailAddressLink');
    var detailAddressText = card.querySelector('#footerMapDetailAddressText');
    var detailPhoneLink = card.querySelector('#footerMapDetailPhoneLink');
    var detailPhoneText = card.querySelector('#footerMapDetailPhoneText');
    var detailDirectionsLink = card.querySelector('#footerMapDetailDirectionsLink');
    var primaryFooterAddressLink = document.getElementById('footerSpringboardsAddressLink');
    var primaryFooterPhoneLink = document.getElementById('footerPhonePrimaryLink');

    card.removeAttribute('tabindex');

    function setAddressEntryOpen(isOpen, focusInput) {
      state.addressOpen = Boolean(isOpen);
      card.setAttribute('data-address-open', String(state.addressOpen));
      if (searchBar) {
        searchBar.hidden = !state.addressOpen;
        searchBar.inert = !state.addressOpen;
        searchBar.setAttribute('aria-hidden', String(!state.addressOpen));
      }
      card.querySelectorAll('[data-map-action="toggle-address-entry"]').forEach(function (btn) {
        btn.setAttribute('aria-expanded', String(state.addressOpen));
        btn.setAttribute('aria-controls', 'footerMapSearchBar');
      });
      if (addressTriggerBtn) {
        addressTriggerBtn.textContent = state.addressOpen ? 'Close Search' : 'Enter Address';
      }
      if (state.addressOpen && focusInput && acInput) {
        window.setTimeout(function () {
          acInput.focus();
        }, 60);
      } else if (!state.addressOpen && acList) {
        acList.hidden = true;
      }
    }

    setAddressEntryOpen(state.addressOpen, false);

    if (styleSelector) {
      styleSelector.value = MAP_STYLES[state.style] ? state.style : 'retro';
      styleSelector.addEventListener('change', function () {
        var nextStyle = styleSelector.value;
        if (MAP_STYLES[nextStyle]) {
          state.style = nextStyle;
          syncMapViewport(false);
        }
      });
    }

    function computeMiles(lat1, lon1, lat2, lon2) {
      var R = 3958.8;
      var dLat = ((lat2 - lat1) * Math.PI) / 180;
      var dLon = ((lon2 - lon1) * Math.PI) / 180;
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    }

    function updatePlaceDetailsPanel(loc) {
      if (!loc) return;
      var latDir = loc.latitude >= 0 ? 'N' : 'S';
      var lngDir = loc.longitude >= 0 ? 'E' : 'W';
      var coordStr =
        Math.abs(loc.latitude).toFixed(4) + '° ' + latDir + ', ' +
        Math.abs(loc.longitude).toFixed(4) + '° ' + lngDir +
        (loc.hours ? ' · ' + loc.hours : '');

      if (detailCategory) detailCategory.textContent = loc.category || 'Springboards Location';
      if (detailTitle) detailTitle.textContent = loc.displayName || 'Springboards for Community Development';
      if (detailCoords) detailCoords.textContent = coordStr;
      if (detailServices) {
        detailServices.textContent =
          loc.services ||
          'Connected to Springboards HQ · 2269 15th Ave. S.W., Lanett, AL 36863';
      }

      var gmpPlaceUrl =
        loc.googleMapsURI ||
        'https://www.google.com/maps/search/?api=1&query=' +
          encodeURIComponent(loc.formattedAddress || '2269 15th Ave SW, Lanett, AL 36863');
      var phoneHref = loc.phoneHref || 'tel:731.388.WORK';
      var phoneDisplay = loc.nationalPhoneNumber || '731.388.WORK';

      if (detailAddressLink) detailAddressLink.setAttribute('href', gmpPlaceUrl);
      if (detailAddressText) {
        detailAddressText.textContent =
          loc.formattedAddress || '2269 15th Ave. S.W., Lanett, AL 36863';
      }
      if (detailPhoneLink) detailPhoneLink.setAttribute('href', phoneHref);
      if (detailPhoneText) detailPhoneText.textContent = phoneDisplay;

      var dirUrl = loc.directionsURI ||
        'https://www.google.com/maps/dir/?api=1&destination=' +
          encodeURIComponent(loc.formattedAddress || '2269 15th Ave SW, Lanett, AL 36863');
      if (state.userLocation) {
        var originParam =
          state.userLocation.latitude.toFixed(5) + ',' + state.userLocation.longitude.toFixed(5);
        dirUrl =
          'https://www.google.com/maps/dir/?api=1&origin=' +
          encodeURIComponent(originParam) +
          '&destination=' +
          encodeURIComponent(loc.formattedAddress || '2269 15th Ave SW, Lanett, AL 36863');
      }
      if (detailDirectionsLink) detailDirectionsLink.setAttribute('href', dirUrl);

      if (primaryFooterAddressLink) {
        primaryFooterAddressLink.setAttribute('href', gmpPlaceUrl);
      }
      if (primaryFooterPhoneLink) {
        primaryFooterPhoneLink.setAttribute('href', 'tel:731.388.WORK');
      }

      if (detailDistance) {
        if (state.userLocation) {
          var milesToLoc = computeMiles(
            state.userLocation.latitude,
            state.userLocation.longitude,
            loc.latitude,
            loc.longitude
          );
          var milesToHq = computeMiles(
            state.userLocation.latitude,
            state.userLocation.longitude,
            DEFAULT_LAT,
            DEFAULT_LNG
          );
          detailDistance.hidden = false;
          detailDistance.textContent =
            milesToLoc < 0.1
              ? milesToHq.toFixed(1) + ' mi to Lanett HQ'
              : milesToLoc.toFixed(1) + ' mi away';
        } else {
          detailDistance.hidden = true;
        }
      }

      if (markersBar) {
        markersBar.querySelectorAll('[data-map-marker-id]').forEach(function (chip) {
          var id = chip.getAttribute('data-map-marker-id');
          var isSel = id === loc.id;
          chip.classList.toggle('is-active', isSel);
          chip.setAttribute('aria-selected', String(isSel));
          chip.setAttribute('tabindex', isSel ? '0' : '-1');
          var chipLoc = LOCATIONS[id];
          if (chipLoc && state.userLocation && id !== 'user-current-location') {
            var dist = computeMiles(
              state.userLocation.latitude,
              state.userLocation.longitude,
              chipLoc.latitude,
              chipLoc.longitude
            );
            chip.textContent = chipLoc.shortLabel + ' (' + dist.toFixed(1) + 'm)';
          }
        });
      }

      if (state.gmpMap && state.gmpInfoWindow && state.gmpMarkers[loc.id]) {
        var iwHtml =
          '<div style="font-family:sans-serif;max-width:220px;line-height:1.35;">' +
          '<strong style="color:#093057;font-size:12px;display:block;">' + escapeHtml(loc.displayName) + '</strong>' +
          '<a href="' + escapeHtml(gmpPlaceUrl) + '" target="_blank" rel="noopener noreferrer" style="color:#204B8C;font-size:11px;text-decoration:underline;display:block;margin-top:2px;">' +
          escapeHtml(loc.formattedAddress) +
          '</a>' +
          '<a href="tel:731.388.WORK" style="color:#093057;font-size:11px;font-weight:700;display:inline-block;margin-top:3px;">📞 ' +
          escapeHtml(phoneDisplay) +
          '</a>' +
          '</div>';
        state.gmpInfoWindow.setContent(iwHtml);
        state.gmpInfoWindow.open({
          map: state.gmpMap,
          anchor: state.gmpMarkers[loc.id],
          shouldFocus: false
        });
      }
    }

    function ensureMarkerChipAndGmpPin(loc) {
      if (!loc || !loc.id) return;
      LOCATIONS[loc.id] = loc;

      if (markersBar && !markersBar.querySelector('[data-map-marker-id="' + loc.id + '"]')) {
        var chip = document.createElement('button');
        chip.type = 'button';
        chip.setAttribute('role', 'tab');
        chip.className = 'footer-map-marker-chip';
        chip.setAttribute('data-map-marker-id', loc.id);
        chip.setAttribute('aria-selected', 'false');
        chip.setAttribute('tabindex', '-1');
        chip.title = (loc.formattedAddress || loc.displayName) + ' (' + loc.latitude.toFixed(4) + ', ' + loc.longitude.toFixed(4) + ')';
        chip.textContent = loc.shortLabel || 'Pinned';
        markersBar.appendChild(chip);
      }

      if (state.gmpMap && state.MarkerClasses && !state.gmpMarkers[loc.id]) {
        var isUser = loc.id === 'user-current-location';
        var pin = new state.MarkerClasses.PinElement({
          background: isUser ? '#6BAA3C' : (loc.isPrimary ? '#204B8C' : '#C84318'),
          borderColor: '#093057',
          glyphColor: '#FFFFFF',
          glyphText: isUser ? 'YOU' : (loc.isPrimary ? 'HQ' : '•'),
          scale: loc.isPrimary ? 1.08 : 0.95
        });
        var marker = new state.MarkerClasses.AdvancedMarkerElement({
          map: state.gmpMap,
          position: { lat: loc.latitude, lng: loc.longitude },
          title: loc.displayName + ' — ' + loc.formattedAddress
        });
        if (typeof marker.append === 'function') {
          marker.append(pin);
        }
        marker.addListener('gmp-click', function () {
          selectLocationMarker(loc.id);
        });
        marker.addListener('click', function () {
          selectLocationMarker(loc.id);
        });
        state.gmpMarkers[loc.id] = marker;
      } else if (state.gmpMap && state.gmpMarkers[loc.id]) {
        state.gmpMarkers[loc.id].position = { lat: loc.latitude, lng: loc.longitude };
      }
    }

    function selectLocationMarker(markerId) {
      var loc = LOCATIONS[markerId];
      if (!loc) return;
      state.activeMarkerId = markerId;
      state.lat = loc.latitude;
      state.lng = loc.longitude;
      syncMapViewport(true, loc);
      updatePlaceDetailsPanel(loc);
    }

    function syncMapViewport(updateIframeSrc, activeLoc) {
      card.setAttribute('data-map-style', state.style);
      card.setAttribute('data-map-zoom', String(state.zoom));
      card.setAttribute('data-map-lat', state.lat.toFixed(5));
      card.setAttribute('data-map-lng', state.lng.toFixed(5));

      if (styleSelector && styleSelector.value !== state.style && MAP_STYLES[state.style]) {
        styleSelector.value = state.style;
      }

      if (state.gmpMap) {
        state.gmpMap.panTo({ lat: state.lat, lng: state.lng });
        state.gmpMap.setZoom(state.zoom);
        if (MAP_STYLES[state.style]) {
          state.gmpMap.setOptions({ styles: MAP_STYLES[state.style] });
        }
        return;
      }

      if (iframe && updateIframeSrc) {
        var latLngStr = state.lat.toFixed(5) + ',' + state.lng.toFixed(5);
        var currentLoc = activeLoc || LOCATIONS[state.activeMarkerId];
        var queryTarget =
          currentLoc && currentLoc.formattedAddress && Math.abs(state.lat - currentLoc.latitude) < 0.0005
            ? currentLoc.formattedAddress.split(' (')[0]
            : latLngStr;
        var nextSrc =
          'https://maps.google.com/maps?q=' +
          encodeURIComponent(queryTarget) +
          '&ll=' +
          encodeURIComponent(latLngStr) +
          '&t=m&z=' +
          encodeURIComponent(String(state.zoom)) +
          '&ie=UTF8&iwloc=&output=embed';
        if (iframe.getAttribute('src') !== nextSrc) {
          iframe.setAttribute('src', nextSrc);
        }
      }
    }

    function geocodeAndPinAddress(rawQuery, customSuggestion) {
      var q = String(rawQuery || '').trim();
      if (!q && !customSuggestion) return;
      if (acList) {
        acList.hidden = true;
        if (acInput) acInput.setAttribute('aria-expanded', 'false');
      }

      if (customSuggestion && customSuggestion.location) {
        var sugId = customSuggestion.id || 'custom-geocoded-pin';
        var sugLoc = {
          id: sugId,
          shortLabel: (customSuggestion.displayName || 'Pinned').slice(0, 14),
          displayName: customSuggestion.displayName || q,
          category: customSuggestion.category || 'Geocoded Map Marker',
          formattedAddress:
            (customSuggestion.formattedAddress || q) +
            (String(customSuggestion.formattedAddress || '').indexOf('2269 15th') === -1
              ? ' · Springboards HQ: 2269 15th Ave. S.W., Lanett, AL'
              : ''),
          nationalPhoneNumber: customSuggestion.nationalPhoneNumber || '731.388.WORK',
          phoneHref: customSuggestion.phoneHref || 'tel:731.388.WORK',
          hours: 'Springboards Support: 731.388.WORK',
          services:
            customSuggestion.services ||
            'Linked to Springboards Community Development (2269 15th Ave. S.W., Lanett, AL 36863)',
          latitude: Number(customSuggestion.location.lat),
          longitude: Number(customSuggestion.location.lng),
          googleMapsURI:
            customSuggestion.googleMapsURI ||
            'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(customSuggestion.formattedAddress || q),
          directionsURI:
            customSuggestion.directionsURI ||
            'https://www.google.com/maps/dir/?api=1&origin=' +
              encodeURIComponent(customSuggestion.formattedAddress || q) +
              '&destination=2269+15th+Ave+SW,+Lanett,+AL+36863',
          isPrimary: false
        };
        ensureMarkerChipAndGmpPin(sugLoc);
        state.zoom = 15;
        selectLocationMarker(sugId);
        return;
      }

      // Use the domain-restricted /api/maps/geocode REST API proxy (never deprecated google.maps.Geocoder JS class)

      if (typeof window.fetch === 'function') {
        window
          .fetch('/api/maps/geocode?address=' + encodeURIComponent(q), {
            headers: { Accept: 'application/json' }
          })
          .then(function (r) { return r.ok ? r.json() : null; })
          .then(function (data) {
            if (data && typeof data.latitude === 'number' && typeof data.longitude === 'number') {
              geocodeAndPinAddress(q, {
                id: 'custom-geocoded-pin',
                displayName: data.displayName || q,
                formattedAddress: data.formattedAddress || q,
                location: { lat: data.latitude, lng: data.longitude },
                nationalPhoneNumber: data.nationalPhoneNumber || '731.388.WORK',
                googleMapsURI: data.googleMapsURI
              });
            }
          })
          .catch(function () {});
      }
    }

    function locateUserOnMap() {
      if (!navigator.geolocation) {
        setAddressEntryOpen(true, true);
        if (acInput) {
          acInput.placeholder = 'Enter your ZIP or address to locate...';
        }
        return;
      }
      if (locateBtn) {
        locateBtn.classList.add('is-active');
      }
      navigator.geolocation.getCurrentPosition(
        function (pos) {
          var uLat = pos.coords.latitude;
          var uLng = pos.coords.longitude;
          state.userLocation = { latitude: uLat, longitude: uLng };

          window
            .fetch('/api/maps/geocode?lat=' + encodeURIComponent(uLat) + '&lng=' + encodeURIComponent(uLng), {
              headers: { Accept: 'application/json' }
            })
            .then(function (r) { return r.ok ? r.json() : null; })
            .then(function (rev) {
              var milesToHq = computeMiles(uLat, uLng, DEFAULT_LAT, DEFAULT_LNG);
              var userLocRecord = {
                id: 'user-current-location',
                shortLabel: 'My Location',
                displayName: 'Your Geographic Location',
                category: 'User Location · ' + milesToHq.toFixed(1) + ' mi to Springboards HQ',
                formattedAddress:
                  (rev && rev.formattedAddress ? rev.formattedAddress : uLat.toFixed(4) + ', ' + uLng.toFixed(4)) +
                  ' (Nearest Hub: 2269 15th Ave. S.W., Lanett, AL)',
                nationalPhoneNumber: '731.388.WORK',
                phoneHref: 'tel:731.388.WORK',
                hours: 'Springboards HQ: Mon–Fri 8am–5pm',
                services:
                  'Convenient to Springboards Lanett HQ (' +
                  milesToHq.toFixed(1) +
                  ' mi) · Call 731.388.WORK for intake & transit routing',
                latitude: uLat,
                longitude: uLng,
                googleMapsURI: 'https://www.google.com/maps/search/?api=1&query=2269+15th+Ave+SW,+Lanett,+AL+36863',
                directionsURI:
                  'https://www.google.com/maps/dir/?api=1&origin=' +
                  encodeURIComponent(uLat + ',' + uLng) +
                  '&destination=2269+15th+Ave+SW,+Lanett,+AL+36863',
                isPrimary: false
              };
              ensureMarkerChipAndGmpPin(userLocRecord);
              state.zoom = 14;
              selectLocationMarker('user-current-location');
            })
            .catch(function () {});
        },
        function () {
          if (locateBtn) {
            locateBtn.classList.remove('is-active');
          }
          setAddressEntryOpen(true, true);
          if (acInput) {
            acInput.placeholder = 'Type your ZIP/city (e.g. 36863, Valley, Opelika)...';
          }
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    }

    var currentSuggestions = [];
    var activeAcIndex = -1;

    function updateAcActiveOption(nextIdx) {
      if (!acList || !currentSuggestions.length) {
        activeAcIndex = -1;
        if (acInput) acInput.removeAttribute('aria-activedescendant');
        return;
      }
      var total = currentSuggestions.length;
      if (nextIdx < 0) nextIdx = total - 1;
      if (nextIdx >= total) nextIdx = 0;
      activeAcIndex = nextIdx;
      var items = acList.querySelectorAll('[data-ac-idx]');
      items.forEach(function (el, idx) {
        var isFocused = idx === activeAcIndex;
        el.classList.toggle('is-focused', isFocused);
        el.setAttribute('aria-selected', String(isFocused));
        if (isFocused && acInput) {
          acInput.setAttribute('aria-activedescendant', el.id);
          if (typeof el.scrollIntoView === 'function') {
            el.scrollIntoView({ block: 'nearest' });
          }
        }
      });
    }

    function renderAutocompleteDropdown(suggestions) {
      if (!acList) return;
      currentSuggestions = Array.isArray(suggestions) ? suggestions : [];
      activeAcIndex = -1;
      if (currentSuggestions.length === 0) {
        acList.hidden = true;
        if (acInput) {
          acInput.setAttribute('aria-expanded', 'false');
          acInput.removeAttribute('aria-activedescendant');
        }
        return;
      }
      acList.innerHTML = currentSuggestions
        .map(function (s, idx) {
          var optId = 'footerMapAcOption-' + idx;
          return (
            '<li class="footer-map-autocomplete-item" role="option" id="' +
            optId +
            '" aria-selected="false" data-ac-idx="' +
            idx +
            '">' +
            '<strong>' +
            escapeHtml(s.displayName || s.formattedAddress) +
            '</strong>' +
            '<span>' +
            escapeHtml(s.formattedAddress || '') +
            ' · 📞 ' +
            escapeHtml(s.nationalPhoneNumber || '731.388.WORK') +
            '</span>' +
            '</li>'
          );
        })
        .join('');
      acList.hidden = false;
      if (acInput) acInput.setAttribute('aria-expanded', 'true');

      acList.querySelectorAll('[data-ac-idx]').forEach(function (itemEl) {
        itemEl.addEventListener('mousedown', function (ev) {
          ev.preventDefault();
          var idx = parseInt(itemEl.getAttribute('data-ac-idx'), 10);
          var chosen = currentSuggestions[idx];
          if (chosen) {
            if (acInput) acInput.value = chosen.displayName || chosen.formattedAddress || '';
            geocodeAndPinAddress(chosen.formattedAddress || chosen.displayName, chosen);
          }
        });
      });
    }

    var acDebounce = null;
    if (acInput) {
      acInput.addEventListener('input', function () {
        var val = acInput.value.trim();
        if (acDebounce) window.clearTimeout(acDebounce);
        if (!val) {
          if (acList) acList.hidden = true;
          acInput.setAttribute('aria-expanded', 'false');
          acInput.removeAttribute('aria-activedescendant');
          return;
        }
        acDebounce = window.setTimeout(function () {
          var fieldsParam = AUTOCOMPLETE_FIELDS.join(',');
          window
            .fetch(
              '/api/maps/autocomplete?input=' +
                encodeURIComponent(val) +
                '&fields=' +
                encodeURIComponent(fieldsParam),
              { headers: { Accept: 'application/json' } }
            )
            .then(function (r) { return r.ok ? r.json() : null; })
            .then(function (data) {
              if (data && Array.isArray(data.suggestions)) {
                renderAutocompleteDropdown(data.suggestions);
              }
            })
            .catch(function () {});
        }, 160);
      });

      acInput.addEventListener('focus', function () {
        if (!acInput.value.trim()) {
          renderAutocompleteDropdown(
            Object.keys(LOCATIONS).map(function (k) {
              var l = LOCATIONS[k];
              return {
                id: l.id,
                displayName: l.displayName,
                formattedAddress: l.formattedAddress,
                location: { lat: l.latitude, lng: l.longitude },
                nationalPhoneNumber: l.nationalPhoneNumber,
                phoneHref: l.phoneHref,
                googleMapsURI: l.googleMapsURI,
                directionsURI: l.directionsURI,
                category: l.category,
                services: l.services
              };
            })
          );
        }
      });

      acInput.addEventListener('blur', function () {
        window.setTimeout(function () {
          if (acList) acList.hidden = true;
          acInput.setAttribute('aria-expanded', 'false');
          acInput.removeAttribute('aria-activedescendant');
        }, 180);
      });

      acInput.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown') {
          if (acList && !acList.hidden && currentSuggestions.length > 0) {
            e.preventDefault();
            updateAcActiveOption(activeAcIndex + 1);
          }
        } else if (e.key === 'ArrowUp') {
          if (acList && !acList.hidden && currentSuggestions.length > 0) {
            e.preventDefault();
            updateAcActiveOption(activeAcIndex - 1);
          }
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (acList && !acList.hidden && activeAcIndex >= 0 && currentSuggestions[activeAcIndex]) {
            var chosen = currentSuggestions[activeAcIndex];
            acInput.value = chosen.displayName || chosen.formattedAddress || '';
            geocodeAndPinAddress(chosen.formattedAddress || chosen.displayName, chosen);
          } else {
            geocodeAndPinAddress(acInput.value);
          }
        } else if (e.key === 'Escape') {
          e.preventDefault();
          if (acList && !acList.hidden) {
            acList.hidden = true;
            acInput.setAttribute('aria-expanded', 'false');
            acInput.removeAttribute('aria-activedescendant');
          } else {
            setAddressEntryOpen(false, false);
            if (addressTriggerBtn) addressTriggerBtn.focus();
          }
        }
      });
    }

    if (markersBar) {
      markersBar.addEventListener('keydown', function (e) {
        var chips = Array.prototype.slice.call(markersBar.querySelectorAll('[data-map-marker-id]'));
        if (!chips.length) return;
        var currentChip = e.target.closest('[data-map-marker-id]');
        if (!currentChip) return;
        var idx = chips.indexOf(currentChip);
        if (idx === -1) return;
        var nextIdx = -1;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          nextIdx = (idx + 1) % chips.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          nextIdx = (idx - 1 + chips.length) % chips.length;
        } else if (e.key === 'Home') {
          nextIdx = 0;
        } else if (e.key === 'End') {
          nextIdx = chips.length - 1;
        }
        if (nextIdx !== -1) {
          e.preventDefault();
          var targetChip = chips[nextIdx];
          targetChip.focus();
          selectLocationMarker(targetChip.getAttribute('data-map-marker-id'));
        }
      });
    }

    if (searchBar) {
      searchBar.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && e.target !== acInput) {
          e.preventDefault();
          setAddressEntryOpen(false, false);
          if (addressTriggerBtn) addressTriggerBtn.focus();
        }
      });
    }

    function handleMapAction(action) {
      switch (action) {
        case 'toggle-address-entry':
          setAddressEntryOpen(!state.addressOpen, !state.addressOpen);
          break;
        case 'locate-user':
          locateUserOnMap();
          break;
        case 'geocode-input':
          if (acInput) geocodeAndPinAddress(acInput.value);
          break;
        default:
          break;
      }
    }

    card.addEventListener('click', function (e) {
      var linkEl = e.target.closest('a[href], select, input');
      if (linkEl) {
        return;
      }
      var markerChip = e.target.closest('[data-map-marker-id]');
      if (markerChip) {
        e.preventDefault();
        selectLocationMarker(markerChip.getAttribute('data-map-marker-id'));
        return;
      }
      var actionBtn = e.target.closest('[data-map-action]');
      if (actionBtn) {
        e.preventDefault();
        handleMapAction(actionBtn.getAttribute('data-map-action'));
        return;
      }
      // Click on the card opens address entry if closed
      if (!state.addressOpen) {
        setAddressEntryOpen(true, true);
      }
    });

    document.addEventListener('click', function (e) {
      if (state.addressOpen && !card.contains(e.target)) {
        setAddressEntryOpen(false, false);
      }
    });

    syncMapViewport(false);
    updatePlaceDetailsPanel(LOCATIONS['springboards-lanett-hq']);

    if (typeof window.fetch === 'function' && jsCanvas) {
      window.fetch('/api/maps/config', { headers: { Accept: 'application/json' } })
        .then(function (res) { return res.ok ? res.json() : null; })
        .then(function (cfg) {
          if (!cfg || !cfg.enabled || !cfg.apiKey) return;
          var allowedReferrers = Array.isArray(cfg.domainRestrictions) ? cfg.domainRestrictions : [];
          var currentOrigin = window.location.origin || '';
          var domainPermitted = allowedReferrers.length === 0 || allowedReferrers.some(function (pattern) {
            var baseOrigin = String(pattern || '').replace(/\/\*$/, '').replace(/\/+$/, '');
            return baseOrigin && currentOrigin.indexOf(baseOrigin) === 0;
          });
          card.setAttribute('data-maps-key-verified', domainPermitted ? 'true' : 'false');
          card.setAttribute('data-maps-project', cfg.projectId || 'springboards-community-dev');
          if (!domainPermitted) return;

          // Graceful fallback if browser key has strict Console referrer rules in preview iframe
          window.gm_authFailure = function () {
            state.gmpMap = null;
            jsCanvas.hidden = true;
            if (iframe) iframe.hidden = false;
            card.setAttribute('data-maps-render-mode', 'verified-embed-fallback');
          };

          // Only initialize dynamic JS Map canvas when an explicit Maps JS browser key is enabled
          if (!cfg.enableDirectJsTiles) {
            card.setAttribute('data-maps-render-mode', 'verified-hybrid-proxy');
            return;
          }

          if (!window.google || !window.google.maps || !window.google.maps.importLibrary) {
            (function (g) {
              var h, a, k, p = 'The Google Maps JavaScript API', c = 'google', l = 'importLibrary', q = '__ib__', m = document, b = window;
              b = b[c] || (b[c] = {});
              var d = b.maps || (b.maps = {}), r = new Set(), e = new URLSearchParams(),
                u = function () {
                  return h || (h = new Promise(function (f, n) {
                    a = m.createElement('script');
                    e.set('libraries', Array.from(r) + '');
                    for (k in g) e.set(k.replace(/[A-Z]/g, function (t) { return '_' + t[0].toLowerCase(); }), g[k]);
                    e.set('callback', c + '.maps.' + q);
                    a.src = 'https://maps.' + c + 'apis.com/maps/api/js?' + e;
                    d[q] = f;
                    a.onerror = function () { h = n(Error(p + ' could not load.')); };
                    a.nonce = (m.querySelector('script[nonce]') || {}).nonce || '';
                    m.head.append(a);
                  }));
                };
              if (!d[l]) {
                d[l] = function (f) {
                  r.add(f);
                  return u().then(function () { return d[l](f); });
                };
              }
            })({ key: cfg.apiKey, v: 'weekly' });
          }

          Promise.all([
            window.google.maps.importLibrary('maps'),
            window.google.maps.importLibrary('marker'),
            window.google.maps.importLibrary('places')
          ]).then(function (libs) {
            var Map = libs[0].Map;
            var InfoWindow = libs[0].InfoWindow;
            var AdvancedMarkerElement = libs[1].AdvancedMarkerElement;
            var PinElement = libs[1].PinElement;
            var PlaceAutocompleteElement = libs[2].PlaceAutocompleteElement;

            jsCanvas.hidden = false;
            if (iframe) iframe.hidden = true;

            var initialStyles = MAP_STYLES[state.style] || MAP_STYLES.retro;
            var map = new Map(jsCanvas, {
              center: { lat: state.lat, lng: state.lng },
              zoom: state.zoom,
              mapId: cfg.mapId || 'DEMO_MAP_ID',
              styles: initialStyles,
              gestureHandling: 'greedy',
              zoomControl: true,
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false,
              internalUsageAttributionIds: ['gmp_mcp_codeassist_v1_aistudio']
            });

            if (styleControl && window.google.maps.ControlPosition) {
              map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(styleControl);
            }

            map.addListener('click', function () {
              setAddressEntryOpen(true, true);
            });

            state.gmpMap = map;
            state.gmpInfoWindow = new InfoWindow();
            state.MarkerClasses = {
              AdvancedMarkerElement: AdvancedMarkerElement,
              PinElement: PinElement
            };

            Object.keys(LOCATIONS).forEach(function (locId) {
              ensureMarkerChipAndGmpPin(LOCATIONS[locId]);
            });

            var gmpAcHost = card.querySelector('#footerMapGmpAutocompleteHost');
            if (PlaceAutocompleteElement && gmpAcHost) {
              try {
                var placeAutocomplete = new PlaceAutocompleteElement({
                  locationBias: {
                    radius: 45000,
                    center: { lat: DEFAULT_LAT, lng: DEFAULT_LNG }
                  }
                });
                placeAutocomplete.setAttribute('internal-usage-attribution-ids', 'gmp_mcp_codeassist_v1_aistudio');
                placeAutocomplete.addEventListener('gmp-select', function (ev) {
                  var placePrediction = ev.placePrediction;
                  if (!placePrediction) return;
                  var place = placePrediction.toPlace();
                  place
                    .fetchFields({
                      fields: AUTOCOMPLETE_FIELDS
                    })
                    .then(function () {
                      if (place.location) {
                        geocodeAndPinAddress(place.formattedAddress || place.displayName, {
                          id: 'gmp-autocomplete-place',
                          displayName: place.displayName || place.formattedAddress,
                          formattedAddress: place.formattedAddress,
                          location: {
                            lat: place.location.lat(),
                            lng: place.location.lng()
                          },
                          nationalPhoneNumber: place.nationalPhoneNumber || '731.388.WORK',
                          googleMapsURI: place.googleMapsURI
                        });
                      }
                    })
                    .catch(function () {});
                });
                gmpAcHost.appendChild(placeAutocomplete);
              } catch {
                // Keep custom autocomplete input active
              }
            }

            map.addListener('zoom_changed', function () {
              var z = map.getZoom();
              if (typeof z === 'number') {
                state.zoom = z;
              }
            });

            map.addListener('center_changed', function () {
              var c = map.getCenter();
              if (c) {
                state.lat = c.lat();
                state.lng = c.lng();
              }
            });
          }).catch(function () {
            jsCanvas.hidden = true;
            if (iframe) iframe.hidden = false;
          });
        })
        .catch(function () {
          // Keep interactive embed fallback active
        });
    }
  }

  /**
   * 5. Site Footer Component ([data-component="site-footer"])
   */
  function renderSiteFooter(el) {
    var activeRoute = normalizeRoute(el.getAttribute('data-prop-active-route') || window.location.pathname);
    if (!el.querySelector('#footerHeading, h2.sr-only')) {
      var srHeading = document.createElement('h2');
      srHeading.className = 'sr-only';
      srHeading.textContent = 'Site Footer Navigation and Contact Information';
      el.insertBefore(srHeading, el.firstChild);
    }
    el.querySelectorAll('.footer-col > h4').forEach(function (oldH4) {
      var newH3 = document.createElement('h3');
      newH3.innerHTML = oldH4.innerHTML;
      if (oldH4.className) newH3.className = oldH4.className;
      oldH4.parentNode.replaceChild(newH3, oldH4);
    });
    el.querySelectorAll('.footer-logo').forEach(function (footerLogo) {
      footerLogo.setAttribute('src', '/assets/aistudio/springboards_logo_icon.webp?v=20261118-opt');
      footerLogo.setAttribute('width', footerLogo.getAttribute('width') || '116');
      footerLogo.setAttribute('height', footerLogo.getAttribute('height') || '100');
      footerLogo.setAttribute('loading', 'lazy');
      footerLogo.setAttribute('decoding', 'async');
      if (!footerLogo.getAttribute('alt')) {
        footerLogo.setAttribute('alt', 'Springboards for Community Development emblem');
      }
    });
    el.querySelectorAll('.footer-wordmark-group, .footer-wordmark-img').forEach(function (wordmarkEl) {
      wordmarkEl.remove();
    });
    el.querySelectorAll('.footer-map-card').forEach(function (mapCard) {
      initFooterInteractiveMap(mapCard);
    });
    var legalGroup = el.querySelector('.footer-legal-group, .footer-bottom-flex .ds-cluster');
    if (legalGroup && !legalGroup.querySelector('[data-open-consent-preferences], #footerConsentPreferencesBtn')) {
      var consentBtn = document.createElement('button');
      consentBtn.type = 'button';
      consentBtn.className = 'footer-legal-link';
      consentBtn.setAttribute('data-open-consent-preferences', 'true');
      consentBtn.textContent = 'Cookie & Consent Preferences';
      legalGroup.appendChild(consentBtn);
    }
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
            '<article class="sb-card c-feature-card is-light cms-collection-card" data-cms-item-id="' + escapeHtml(prog.id) + '">' +
            '<div class="u-flex-between u-mb-2">' +
            '<span class="t-eyebrow c-text-accent">' + escapeHtml(prog.code) + ' · ' + escapeHtml(String(prog.category).toUpperCase()) + '</span>' +
            '<span class="t-caption u-font-mono c-text-muted">' + escapeHtml(prog.hoursCap + ' Paid Hrs · ' + prog.tuitionCost) + '</span>' +
            '</div>' +
            '<h3 class="t-h4 c-text-brand u-mt-0 u-mb-2"><a href="' + escapeHtml(dynamicUrl) + '" class="cms-card-title-link">' + escapeHtml(title) + '</a></h3>' +
            '<p class="t-body-sm c-text-secondary u-mt-0 u-mb-3">' + escapeHtml(summary) + '</p>' +
            '<div class="u-pt-3 cms-card-meta-divider">' +
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
            '<article class="sb-card c-feature-card is-light cms-collection-card" data-cms-item-id="' + escapeHtml(center.id) + '">' +
            '<span class="t-eyebrow c-text-accent">' + escapeHtml(center.state + ' · ' + center.wioaSystem) + '</span>' +
            '<h3 class="t-h4 c-text-brand u-mt-1 u-mb-2">' + escapeHtml(name) + '</h3>' +
            '<p class="t-body-sm c-text-secondary u-mt-0 u-mb-2"><strong>Counties Served:</strong> ' + escapeHtml(center.countiesServed) + '</p>' +
            '<p class="t-caption c-text-primary u-m-0 u-mb-1"><strong>Address:</strong> ' + escapeHtml(center.address) + '</p>' +
            '<p class="t-caption c-text-primary u-m-0 u-mb-3"><strong>Phone:</strong> <a href="tel:' + escapeHtml(center.phone) + '" class="link-text">' + escapeHtml(center.phone) + '</a></p>' +
            '<span class="t-caption c-text-muted">Funds ' + (center.eligibleProgramIds ? center.eligibleProgramIds.length : 7) + ' Springboards Trade Pathways</span>' +
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
            '<article class="sb-card c-feature-card is-light cms-collection-card" data-cms-item-id="' + escapeHtml(partner.id) + '">' +
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

    if (collectionId === 'programEvidenceDocs') {
      el.innerHTML = filtered
        .map(function (docItem) {
          var title = getLocalizedField(docItem.title, locale);
          var summary = getLocalizedField(docItem.summary, locale);
          return (
            '<article class="sb-card c-feature-card is-light cms-collection-card" data-cms-item-id="' + escapeHtml(docItem.id) + '">' +
            '<div class="u-flex-between u-mb-2">' +
            '<span class="t-eyebrow c-text-accent">' + escapeHtml(docItem.workspaceApp || 'Google Workspace') + '</span>' +
            '<code class="t-caption u-font-mono">' + escapeHtml(docItem.readinessStatus || 'Verified') + '</code>' +
            '</div>' +
            '<h3 class="t-h4 c-text-brand u-mt-0 u-mb-2">' + escapeHtml(title) + '</h3>' +
            '<p class="t-body-sm c-text-secondary u-mt-0 u-mb-3">' + escapeHtml(summary) + '</p>' +
            '<div class="u-pt-2 cms-card-meta-divider">' +
            '<p class="t-caption c-text-primary u-m-0 u-mb-2"><strong>Track:</strong> ' + escapeHtml(docItem.programClassification || 'WIOA') + '</p>' +
            '<div class="u-flex-between">' +
            '<a href="' + escapeHtml(docItem.sourceUri) + '" target="_blank" rel="noopener" class="link-text is-arrow">Google Drive Source <span aria-hidden="true">↗</span></a>' +
            '<span class="t-caption u-font-mono c-text-muted">Inline Only</span>' +
            '</div>' +
            '</div>' +
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
            '<article class="sb-card c-feature-card is-light cms-collection-card" data-cms-item-id="' + escapeHtml(uPage.id) + '">' +
            '<div class="u-flex-between u-mb-2">' +
            '<span class="t-eyebrow c-text-accent">' + escapeHtml(uPage.httpStatus) + '</span>' +
            '<code class="t-caption u-font-mono">' + escapeHtml(uPage.canonicalPath) + '</code>' +
            '</div>' +
            '<h3 class="t-h4 c-text-brand u-mt-0 u-mb-2">' + escapeHtml(title) + '</h3>' +
            '<p class="t-body-sm c-text-secondary u-mt-0 u-mb-3">' + escapeHtml(purpose) + '</p>' +
            '<div class="u-flex-between u-pt-2 cms-card-meta-divider">' +
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

  var ROUTE_HIERARCHY_METADATA = {
    '/programs/train': {
      pillarTitle: 'Programs & WIOA Eligibility',
      pillarHref: '/programs/pathways',
      pageTitle: 'Transitional Jobs & On-the-Job Training',
      canonicalPath: '/programs/train'
    },
    '/programs/eligibility': {
      pillarTitle: 'Programs & WIOA Eligibility',
      pillarHref: '/programs/pathways',
      pageTitle: 'WIOA Eligibility Wizard & Career Centers',
      canonicalPath: '/programs/eligibility'
    },
    '/community/volunteer': {
      pillarTitle: 'Community & Employer Partnerships',
      pillarHref: '/utility/search?collection=partnerDirectory',
      pageTitle: 'Volunteer & Trade Mentorship',
      canonicalPath: '/community/volunteer'
    },
    '/community/partner': {
      pillarTitle: 'Community & Employer Partnerships',
      pillarHref: '/utility/search?collection=partnerDirectory',
      pageTitle: 'Employer OJT & Material Partnerships',
      canonicalPath: '/community/partner'
    },
    '/community/donate': {
      pillarTitle: 'Community & Employer Partnerships',
      pillarHref: '/utility/search?collection=partnerDirectory',
      pageTitle: '501(c)(3) Sponsorships & Donations',
      canonicalPath: '/community/donate'
    },
    '/utility/search': {
      pillarTitle: 'Visitor Utilities & Compliance',
      pillarHref: '/utility/search',
      pageTitle: 'Site Search & Topic Directory',
      canonicalPath: '/utility/search'
    },
    '/utility/password': {
      pillarTitle: 'Visitor Utilities & Compliance',
      pillarHref: '/utility/search',
      pageTitle: 'Protected Worksite Milestone Gate',
      canonicalPath: '/utility/password'
    },
    '/utility/privacy-terms': {
      pillarTitle: 'Visitor Utilities & Compliance',
      pillarHref: '/utility/search',
      pageTitle: 'Privacy, Terms & WIOA Section 188 Notice',
      canonicalPath: '/utility/privacy-terms'
    },
    '/resources/cms-workflows': {
      pillarTitle: 'CMS Governance & Design System',
      pillarHref: '/resources/cms-workflows',
      pageTitle: 'CMS Schema, Imports & Publishing Hub',
      canonicalPath: '/resources/cms-workflows'
    },
    '/resources/style-guide': {
      pillarTitle: 'CMS Governance & Design System',
      pillarHref: '/resources/cms-workflows',
      pageTitle: 'Design System & Accessibility Tokens',
      canonicalPath: '/resources/style-guide'
    },
    '/resources/backoffice': {
      pillarTitle: 'CMS Governance & Design System',
      pillarHref: '/resources/cms-workflows',
      pageTitle: 'Authorized Staff Backoffice Portal',
      canonicalPath: '/resources/backoffice'
    }
  };

  function initSubpageBreadcrumbAndHierarchy() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    var route = normalizeRoute(window.location.pathname || '/');
    var meta = ROUTE_HIERARCHY_METADATA[route];
    if (!meta) return;

    // Avoid duplicating if the page already includes a breadcrumb nav
    if (document.querySelector('nav[aria-label*="Breadcrumb"], .site-breadcrumb-bar, .cms-breadcrumb')) {
      return;
    }

    var mainEl = document.querySelector('main');
    if (!mainEl) return;

    var navEl = document.createElement('nav');
    navEl.className = 'site-breadcrumb-bar';
    navEl.setAttribute('aria-label', 'Breadcrumb');

    var isSamePillarHref = meta.pillarHref === meta.canonicalPath;
    var pillarItemHtml = isSamePillarHref
      ? '<li class="site-breadcrumb-item"><span class="site-breadcrumb-pillar">' + escapeHtml(meta.pillarTitle) + '</span></li>'
      : '<li class="site-breadcrumb-item"><a href="' + escapeHtml(meta.pillarHref) + '" class="site-breadcrumb-link">' + escapeHtml(meta.pillarTitle) + '</a></li>';

    navEl.innerHTML =
      '<div class="container site-breadcrumb-inner">' +
        '<ol class="site-breadcrumb-list">' +
          '<li class="site-breadcrumb-item"><a href="/" class="site-breadcrumb-link">Home</a></li>' +
          pillarItemHtml +
          '<li class="site-breadcrumb-item" aria-current="page"><span class="site-breadcrumb-current">' + escapeHtml(meta.pageTitle) + '</span></li>' +
        '</ol>' +
        '<span class="site-breadcrumb-url" aria-label="Canonical page path">' + escapeHtml(meta.canonicalPath) + '</span>' +
      '</div>';

    mainEl.insertBefore(navEl, mainEl.firstChild);

    if (!document.getElementById('sbBreadcrumbSchemaJsonLd')) {
      var ldScript = document.createElement('script');
      ldScript.id = 'sbBreadcrumbSchemaJsonLd';
      ldScript.type = 'application/ld+json';
      ldScript.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://springboardsfcd.org/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: meta.pillarTitle,
            item: 'https://springboardsfcd.org' + meta.pillarHref
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: meta.pageTitle,
            item: 'https://springboardsfcd.org' + meta.canonicalPath
          }
        ]
      });
      document.head.appendChild(ldScript);
    }
  }

  function initSkipLinksAndKeyboardHelpers(scope) {
    var root = scope || document;
    root.querySelectorAll('.skip-link').forEach(function (skipLink) {
      if (skipLink.getAttribute('data-skip-bound') === 'true') return;
      skipLink.setAttribute('data-skip-bound', 'true');
      skipLink.addEventListener('click', function (e) {
        var targetHref = skipLink.getAttribute('href') || '#main-content';
        if (targetHref.indexOf('#') === 0) {
          var mainEl = document.querySelector(targetHref) || document.querySelector('main');
          if (mainEl) {
            e.preventDefault();
            if (!mainEl.hasAttribute('tabindex')) {
              mainEl.setAttribute('tabindex', '-1');
            }
            mainEl.focus({ preventScroll: false });
            if (typeof mainEl.scrollIntoView === 'function') {
              var prefersReducedMotion =
                window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
              mainEl.scrollIntoView({
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
                block: 'start'
              });
            }
          }
        }
      });
    });

    root.querySelectorAll('form').forEach(function (formEl) {
      if (formEl.getAttribute('data-a11y-bound') === 'true') return;
      formEl.setAttribute('data-a11y-bound', 'true');
      formEl.addEventListener('input', function (ev) {
        if (ev.target && ev.target.getAttribute && ev.target.getAttribute('aria-invalid') === 'true') {
          ev.target.removeAttribute('aria-invalid');
        }
      });
      formEl.addEventListener('change', function (ev) {
        if (ev.target && ev.target.getAttribute && ev.target.getAttribute('aria-invalid') === 'true') {
          ev.target.removeAttribute('aria-invalid');
        }
      });
    });
  }

  function mountAll(root) {
    var scope = root || document;
    scope.querySelectorAll('[data-component]').forEach(renderComponent);
    scope.querySelectorAll('.footer-map-card').forEach(initFooterInteractiveMap);
    initSubpageBreadcrumbAndHierarchy();
    initSkipLinksAndKeyboardHelpers(scope);
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
    version: '3.3.0',
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
      { path: '/styles.css', type: 'CSS Stylesheet', owner: '@MariDaCoder', version: '3.3.0' },
      { path: '/components.js', type: 'Component & CMS Engine', owner: '@MariDaCoder', version: '3.3.0' },
      { path: '/main.js', type: 'Interactive UI Controller', owner: '@MariDaCoder', version: '3.3.0' },
      { path: '/eligibility.js', type: 'WIOA Eligibility Wizard', owner: '@MariDaCoder', version: '3.3.0' },
      { path: '/analytics.js', type: 'Tag Management & Telemetry', owner: '@MariDaCoder', version: '3.3.0' },
      { path: '/workspace-sheets.js', type: 'Google Workspace OAuth & Sheets Sync', owner: '@MariDaCoder', version: '3.3.0' }
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

  function fetchCustomCodeRegistry() {
    return fetch('/assets/cms/custom-code-registry.json', { headers: { Accept: 'application/json' } })
      .then(function (res) {
        if (!res.ok) throw new Error('Registry HTTP ' + res.status);
        return res.json();
      })
      .then(function (registry) {
        if (registry && Array.isArray(registry.customCodeAssets)) {
          var integrityByPath = {};
          registry.customCodeAssets.forEach(function (asset) {
            integrityByPath[asset.path] = asset;
          });
          CUSTOM_CODE_HOST_CONFIG.files = CUSTOM_CODE_HOST_CONFIG.files.map(function (f) {
            var matched = integrityByPath[f.path];
            return matched
              ? Object.assign({}, f, {
                  integrity: matched.integrity,
                  sizeBytes: matched.sizeBytes,
                  version: matched.version || f.version
                })
              : f;
          });
        }
        return registry;
      })
      .catch(function () {
        return null;
      });
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
    resolveUrl: resolveCustomCodeUrl,
    fetchRegistry: fetchCustomCodeRegistry
  };

  // Ensure analytics.js (Tag Management System) is loaded once across all pages
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
    fetchAndImportCsvSource: fetchAndImportCsvSource,
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
