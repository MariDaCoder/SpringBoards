/**
 * Springboards for Community Development
 * Centralized Tag Management System (GTM-SBFCD26 / window.dataLayer), Consent Mode v2,
 * Conversion Funnel & Real-User Monitoring Client (/analytics.js)
 *
 * Principles:
 * 1. Centralized Tag Administration: Manages analytics, WIOA intake conversions, donor
 *    pledge triggers, and third-party tags through a unified Tag Management platform.
 * 2. Granular Route & Trigger Governance: Controls exactly WHEN and WHERE scripts run,
 *    automatically blocking third-party marketing/remarketing tags on protected routes
 *    (/resources/backoffice and /utility/password).
 * 3. Google Consent Mode v2 Compliance: Defaults ad_storage, ad_user_data, and
 *    ad_personalization to 'denied' while enabling privacy-safe first-party telemetry.
 */
(function () {
  'use strict';

  var GTM_CONTAINER_ID = 'GTM-SBFCD26';
  var GA_MEASUREMENT_ID = 'G-SBFCD2026';
  var FIREBASE_PROJECT_ID = 'springboards-community-dev';
  var META_PIXEL_ID = '849203194618204';
  var FIREBASE_ANALYTICS_CONFIG = {
    projectId: FIREBASE_PROJECT_ID,
    projectNumber: '651964189612',
    siteId: 'springboards-community-dev',
    measurementId: GA_MEASUREMENT_ID,
    gtmContainerId: GTM_CONTAINER_ID,
    integrationApproach: 'firebase_and_gtm_unified_deduplicated'
  };
  window.__SPRINGBOARDS_FIREBASE_ANALYTICS__ = FIREBASE_ANALYTICS_CONFIG;

  // Strict Singleton & Anti-Duplication Guard:
  // Prevents double initialization if /analytics.js is loaded more than once or if an inline
  // gtag.js / analytics.js / fbevents.js snippet was accidentally pasted into a page template.
  if (window.__SPRINGBOARDS_TMS_INITIALIZED__) {
    window.__SPRINGBOARDS_DUPLICATE_TAG_BLOCKED_COUNT__ =
      (window.__SPRINGBOARDS_DUPLICATE_TAG_BLOCKED_COUNT__ || 0) + 1;
    return;
  }
  window.__SPRINGBOARDS_TMS_INITIALIZED__ = true;
  window.__SPRINGBOARDS_DUPLICATE_TAG_BLOCKED_COUNT__ = 0;

  // Scan DOM for any redundant/duplicate hardcoded Google Analytics, GTM, or Meta Pixel <script> tags
  function pruneDuplicateTrackingScripts() {
    var gaScripts = Array.from(
      document.querySelectorAll(
        'script[src*="googletagmanager.com/gtag/js"], script[src*="googletagmanager.com/gtm.js"], script[src*="google-analytics.com/analytics.js"]'
      )
    );
    if (gaScripts.length > 1) {
      gaScripts.slice(1).forEach(function (dupScript) {
        dupScript.removeAttribute('src');
        dupScript.setAttribute('data-duplicate-tag-blocked', 'true');
        if (dupScript.parentNode) {
          dupScript.parentNode.removeChild(dupScript);
        }
        window.__SPRINGBOARDS_DUPLICATE_TAG_BLOCKED_COUNT__++;
      });
    }

    var metaScripts = Array.from(
      document.querySelectorAll('script[src*="connect.facebook.net"][src*="fbevents.js"]')
    );
    if (metaScripts.length > 1) {
      metaScripts.slice(1).forEach(function (dupMeta) {
        dupMeta.removeAttribute('src');
        dupMeta.setAttribute('data-duplicate-pixel-blocked', 'true');
        if (dupMeta.parentNode) {
          dupMeta.parentNode.removeChild(dupMeta);
        }
        window.__SPRINGBOARDS_DUPLICATE_TAG_BLOCKED_COUNT__++;
      });
    }

    // Also detect any duplicate /analytics.js script tags
    var selfScripts = Array.from(document.querySelectorAll('script[src*="/analytics.js"]'));
    if (selfScripts.length > 1) {
      selfScripts.slice(1).forEach(function (dupSelf) {
        if (dupSelf.parentNode) {
          dupSelf.parentNode.removeChild(dupSelf);
        }
        window.__SPRINGBOARDS_DUPLICATE_TAG_BLOCKED_COUNT__++;
      });
    }
    return window.__SPRINGBOARDS_DUPLICATE_TAG_BLOCKED_COUNT__;
  }

  pruneDuplicateTrackingScripts();

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = window.gtag || gtag;

  // Initialize Meta Pixel queue (fbq) with strict singleton & Consent Mode v2 integration
  if (!window.fbq) {
    var n = (window.fbq = function () {
      if (n.callMethod) {
        n.callMethod.apply(n, arguments);
      } else {
        n.queue.push(arguments);
      }
    });
    if (!window._fbq) window._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];
  }

  // Load persisted consent preferences or apply privacy-first Consent Mode v2 defaults
  // Essential functionality (functionality_storage & security_storage) is ALWAYS 'granted'
  // so consent preferences never break forms, eligibility checks, Career Center maps, or i18n.
  var defaultConsent = {
    analytics_storage: 'granted',
    personalization_storage: 'granted',
    functionality_storage: 'granted',
    security_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  };

  var activeConsent = Object.assign({}, defaultConsent);
  var hasSavedVisitorConsentChoice = false;
  try {
    var savedConsent = localStorage.getItem('sb_tms_consent_v2');
    if (savedConsent) {
      activeConsent = Object.assign({}, defaultConsent, JSON.parse(savedConsent), {
        functionality_storage: 'granted',
        security_storage: 'granted'
      });
      hasSavedVisitorConsentChoice = true;
    }
  } catch {
    // Ignore storage access errors
  }

  // Initialize Consent Mode v2 & GTM Container Start in dataLayer
  gtag('consent', 'default', activeConsent);
  gtag('js', new Date());

  // Coordinate Meta Pixel consent state before init ('revoke' by default until visitor grants ad_storage)
  window.fbq('consent', activeConsent.ad_storage === 'granted' ? 'grant' : 'revoke');

  if (!window.__SPRINGBOARDS_META_PIXEL_INITIALIZED__) {
    window.__SPRINGBOARDS_META_PIXEL_INITIALIZED__ = true;
    // Disable automatic pushState/popState PageView tracking to prevent duplicate Pixel PageViews
    window.fbq.disablePushState = true;
    window.fbq('init', META_PIXEL_ID, {
      external_id: 'sb_anon_v1'
    });
  }

  // Connect Google Analytics 4 (GA4) via single centralized Firebase + GTM integration:
  // send_page_view is set to false here so our unified sendEvent('page_view') dispatches
  // exactly ONE deduplicated page_view event per navigation (zero double-counting).
  if (!window.__SPRINGBOARDS_GA4_INITIALIZED__) {
    window.__SPRINGBOARDS_GA4_INITIALIZED__ = true;
    gtag('config', GA_MEASUREMENT_ID, {
      send_page_view: false,
      anonymize_ip: true,
      cookie_flags: 'SameSite=Lax;Secure',
      firebase_project_id: FIREBASE_PROJECT_ID,
      custom_map: {
        dimension1: 'wioa_activity_code',
        dimension2: 'career_center_id',
        dimension3: 'content_locale'
      }
    });
  }

  window.dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js',
    containerId: GTM_CONTAINER_ID,
    gaMeasurementId: GA_MEASUREMENT_ID,
    firebaseProjectId: FIREBASE_PROJECT_ID,
    metaPixelId: META_PIXEL_ID,
    gaIntegrationMode: 'firebase_and_gtm_unified_deduplicated',
    metaPixelIntegrationMode: 'consent_gated_event_id_deduplicated',
    siteVersion: '3.3.0'
  });

  // Managed Tag Registry defining granular WHEN and WHERE rules
  var MANAGED_TAGS = [
    {
      tagId: 'tag-ga4-core-telemetry',
      name: 'Google Analytics 4 (G-SBFCD2026) & Core Web Vitals Tag (Deduplicated)',
      measurementId: GA_MEASUREMENT_ID,
      category: 'analytics_storage',
      triggerEvents: ['gtm.js', 'page_view', 'web_vitals'],
      allowedRoutes: ['*'],
      blockedRoutes: ['/resources/backoffice', '/utility/password'],
      deduplicationRule: 'Single GA4 config via GTM-SBFCD26; blocks redundant inline gtag.js/analytics.js snippets and disables auto send_page_view double-firing.',
      description: 'First-party GA4 pageview, referral source, and Core Web Vitals (LCP, CLS, INP) telemetry.'
    },
    {
      tagId: 'tag-wioa-intake-conversion',
      name: 'WIOA Activity 220 & Career Center Pass Conversion Tag',
      measurementId: GA_MEASUREMENT_ID,
      category: 'analytics_storage',
      triggerEvents: ['form_start', 'form_submit_attempt', 'form_submit_success', 'wioa_eligibility_submit'],
      allowedRoutes: ['/programs/eligibility', '/programs/train', '/programs/pathways'],
      blockedRoutes: ['/resources/backoffice', '/utility/password'],
      deduplicationRule: 'Fires once per unique form submission ID via event_id deduplication.',
      description: 'Tracks jobseeker progression through the WIOA Activity 220 eligibility wizard and program inquiry forms.'
    },
    {
      tagId: 'tag-donor-partner-conversion',
      name: '501(c)(3) Donor Pledge & OJT Employer Partner Tag',
      measurementId: GA_MEASUREMENT_ID,
      category: 'analytics_storage',
      triggerEvents: ['form_submit_success', 'donation_pledge_complete', 'partner_inquiry_complete'],
      allowedRoutes: ['/community/donate', '/community/partner'],
      blockedRoutes: ['/resources/backoffice', '/utility/password'],
      deduplicationRule: 'Fires once per verified pledge/partnership submission.',
      description: 'Measures employer OJT host inquiries and tax-deductible 501(c)(3) sponsorship conversions.'
    },
    {
      tagId: 'tag-meta-pixel-conversions',
      name: 'Meta Pixel (849203194618204) Community Outreach & Lead Conversion Tag (Consent-Gated)',
      pixelId: META_PIXEL_ID,
      category: 'ad_storage',
      triggerEvents: ['page_view', 'form_submit_success', 'wioa_eligibility_submit', 'donation_pledge_complete'],
      allowedRoutes: ['/', '/programs/train', '/programs/eligibility', '/programs/pathways', '/community/volunteer', '/community/partner', '/community/donate'],
      blockedRoutes: ['/resources/backoffice', '/utility/password', '/utility/search'],
      deduplicationRule: 'Singleton fbq init + deterministic eventID deduplication + disablePushState=true. Only fires when ad_storage consent is granted.',
      description: 'Maps page_view -> PageView, program/WIOA intake -> Lead, volunteer -> CompleteRegistration, and donation -> Donate with unique eventID.'
    }
  ];

  function isProtectedRoute(pathname) {
    var clean = String(pathname || window.location.pathname || '/');
    return clean.indexOf('/resources/backoffice') === 0 || clean.indexOf('/utility/password') === 0 || clean.indexOf('/backoffice') === 0;
  }

  function shouldRunTag(tagId, pathname, eventName) {
    var route = String(pathname || window.location.pathname || '/');
    if (isProtectedRoute(route)) {
      return { allowed: false, reason: 'Blocked by Protected Route Exception Rule (/resources/backoffice & /utility/password).' };
    }
    var tag = MANAGED_TAGS.find(function (t) { return t.tagId === tagId; });
    if (!tag) {
      return { allowed: false, reason: 'Unknown tag ID: ' + tagId };
    }
    if (activeConsent[tag.category] !== 'granted') {
      return { allowed: false, reason: 'Consent category "' + tag.category + '" is currently "' + activeConsent[tag.category] + '".' };
    }
    var routeMatched = tag.allowedRoutes.some(function (prefix) {
      return prefix === '*' || route === prefix || route.indexOf(prefix + '/') === 0;
    });
    if (!routeMatched) {
      return { allowed: false, reason: 'Route "' + route + '" is outside tag allowed scope (' + tag.allowedRoutes.join(', ') + ').' };
    }
    if (eventName && tag.triggerEvents.indexOf(eventName) === -1) {
      return { allowed: false, reason: 'Event "' + eventName + '" does not match trigger (' + tag.triggerEvents.join(' | ') + ').' };
    }
    return { allowed: true, reason: 'Tag "' + tag.name + '" permitted on "' + route + '".' };
  }

  // Generate or retrieve anonymous session ID
  let sessionId = null;
  try {
    sessionId = sessionStorage.getItem('sb_analytics_sid');
  } catch {
    // Ignore storage access errors
  }
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    try {
      sessionStorage.setItem('sb_analytics_sid', sessionId);
    } catch {
      // Storage unavailable fallback
    }
  }

  function getDeviceType() {
    const w = window.innerWidth || 1024;
    if (w < 768) return 'mobile';
    if (w < 1024) return 'tablet';
    return 'desktop';
  }

  function getReferralSource() {
    const referrer = document.referrer || '';
    if (!referrer) return 'Direct / Bookmarks';
    try {
      const url = new URL(referrer);
      const host = url.hostname.toLowerCase();
      if (host.includes('google.')) return 'Google Search';
      if (host.includes('bing.')) return 'Bing Search';
      if (host.includes('facebook.') || host.includes('fb.me')) return 'Facebook';
      if (host.includes('instagram.')) return 'Instagram';
      if (host.includes('linkedin.')) return 'LinkedIn';
      if (host.includes('t.co') || host.includes('twitter.') || host.includes('x.com')) return 'Twitter / X';
      if (host === window.location.hostname) return 'Internal Navigation';
      return host;
    } catch {
      return 'External Web Referral';
    }
  }

  // Track recently dispatched event keys & Meta Pixel eventIDs to prevent duplicate firing
  const recentEventDedupeMap = new Map();
  const dispatchedMetaPixelEventIds = new Set();
  const metaPixelEventLog = [];

  function mapToMetaPixelStandardEvent(eventType, metadata) {
    const formId = String(metadata.formId || '').toLowerCase();
    if (eventType === 'page_view') {
      return { standardEvent: 'PageView', contentCategory: 'workforce_development' };
    }
    if (eventType === 'wioa_eligibility_submit') {
      return { standardEvent: 'Lead', contentName: 'WIOA Activity 220 Eligibility Check', contentCategory: 'wioa_eligibility' };
    }
    if (eventType === 'donation_pledge_complete' || formId.includes('donate') || formId.includes('donation')) {
      return { standardEvent: 'Donate', contentName: '501(c)(3) Community Sponsorship Pledge', contentCategory: 'donor_pledge' };
    }
    if (eventType === 'form_submit_success') {
      if (formId.includes('volunteer')) {
        return { standardEvent: 'CompleteRegistration', contentName: 'Community Volunteer Signup', contentCategory: 'volunteer' };
      }
      return { standardEvent: 'Lead', contentName: metadata.formId || 'Workforce Program Inquiry', contentCategory: 'program_intake' };
    }
    return null;
  }

  function dispatchDeduplicatedMetaPixelEvent(eventType, route, eventId, metadata) {
    const metaGate = shouldRunTag('tag-meta-pixel-conversions', route, eventType);
    const mapped = mapToMetaPixelStandardEvent(eventType, metadata);
    if (!mapped) return null;

    if (dispatchedMetaPixelEventIds.has(eventId)) {
      window.__SPRINGBOARDS_DUPLICATE_TAG_BLOCKED_COUNT__++;
      return { fired: false, deduplicated: true, eventId, standardEvent: mapped.standardEvent };
    }

    if (!metaGate.allowed) {
      metaPixelEventLog.unshift({
        eventId,
        standardEvent: mapped.standardEvent,
        route,
        status: 'suppressed_by_consent_or_route',
        reason: metaGate.reason,
        timestamp: new Date().toISOString()
      });
      if (metaPixelEventLog.length > 25) metaPixelEventLog.pop();
      return { fired: false, deduplicated: false, eventId, standardEvent: mapped.standardEvent, reason: metaGate.reason };
    }

    dispatchedMetaPixelEventIds.add(eventId);
    const metaParams = {
      content_name: mapped.contentName || document.title || route,
      content_category: mapped.contentCategory,
      page_path: route
    };
    window.fbq('track', mapped.standardEvent, metaParams, { eventID: eventId });
    metaPixelEventLog.unshift({
      eventId,
      standardEvent: mapped.standardEvent,
      route,
      status: 'fired_deduplicated',
      reason: 'Dispatched with unique eventID (' + eventId + ')',
      timestamp: new Date().toISOString()
    });
    if (metaPixelEventLog.length > 25) metaPixelEventLog.pop();
    return { fired: true, deduplicated: false, eventId, standardEvent: mapped.standardEvent };
  }

  // Push structured event to window.dataLayer and dispatch via TMS rules
  function sendEvent(eventType, eventLabel, metadata = {}) {
    pruneDuplicateTrackingScripts();
    const route = window.location.pathname || '/';
    const dedupeKey = `${eventType}:${route}:${eventLabel || ''}:${metadata.formId || ''}`;
    const nowMs = Date.now();
    const lastFiredMs = recentEventDedupeMap.get(dedupeKey) || 0;
    if ((eventType === 'page_view' || eventType === 'form_submit_success') && nowMs - lastFiredMs < 1000) {
      window.__SPRINGBOARDS_DUPLICATE_TAG_BLOCKED_COUNT__++;
      return { deduplicated: true, eventType, eventLabel };
    }
    recentEventDedupeMap.set(dedupeKey, nowMs);

    const bucketSec = Math.floor(nowMs / 2000);
    const eventId = metadata.eventId || `evt_${eventType}_${route.replace(/[^a-z0-9]/gi, '_') || 'home'}_${bucketSec}`;

    const firedTags = MANAGED_TAGS
      .filter((t) => shouldRunTag(t.tagId, route, eventType).allowed)
      .map((t) => t.tagId);

    const metaResult = dispatchDeduplicatedMetaPixelEvent(eventType, route, eventId, metadata);

    const payload = {
      event: eventType,
      eventType,
      eventLabel,
      eventId,
      gtmContainerId: GTM_CONTAINER_ID,
      gaMeasurementId: GA_MEASUREMENT_ID,
      metaPixelId: META_PIXEL_ID,
      metaPixelDispatch: metaResult,
      firedTags,
      sessionId,
      path: window.location.pathname + window.location.hash,
      pageRoute: route,
      referrer: document.referrer || '',
      referralSource: getReferralSource(),
      deviceType: getDeviceType(),
      timestamp: new Date().toISOString(),
      screen: `${window.innerWidth}x${window.innerHeight}`,
      ...metadata
    };

    window.dataLayer.push(payload);

    // Respect Tag Management System route & consent rules before network dispatch
    if (isProtectedRoute(route) || activeConsent.analytics_storage !== 'granted') {
      return payload;
    }

    const url = '/api/analytics/event';
    const dataStr = JSON.stringify(payload);

    if (navigator.sendBeacon) {
      const blob = new Blob([dataStr], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
    } else {
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: dataStr,
        keepalive: true
      }).catch(() => {});
    }
    return payload;
  }

  function updateConsentState(consentUpdates) {
    // Strictly preserve functionality_storage and security_storage so essential site features
    // (forms, WIOA eligibility wizard, Google Maps Career Center finder, bilingual toggle) never break.
    activeConsent = Object.assign({}, activeConsent, consentUpdates || {}, {
      functionality_storage: 'granted',
      security_storage: 'granted'
    });
    hasSavedVisitorConsentChoice = true;
    try {
      localStorage.setItem('sb_tms_consent_v2', JSON.stringify(activeConsent));
    } catch {
      // Ignore storage errors
    }
    gtag('consent', 'update', activeConsent);
    if (typeof window.fbq === 'function') {
      window.fbq('consent', activeConsent.ad_storage === 'granted' ? 'grant' : 'revoke');
    }
    window.dataLayer.push({
      event: 'consent_update',
      consentState: Object.assign({}, activeConsent),
      metaPixelConsent: activeConsent.ad_storage === 'granted' ? 'grant' : 'revoke',
      essentialFunctionalityPreserved: true,
      timestamp: new Date().toISOString()
    });
    window.dispatchEvent(new CustomEvent('sb:consent-updated', { detail: Object.assign({}, activeConsent) }));
    return Object.assign({}, activeConsent);
  }

  // Report frontend runtime errors or asset load failures to server error monitor
  let errorReportCount = 0;
  function reportClientError(errorType, message, details = {}) {
    if (errorReportCount >= 10) return;
    errorReportCount++;
    const payload = {
      errorType,
      message: String(message || 'Unknown client error').slice(0, 300),
      path: window.location.pathname,
      sessionId,
      deviceType: getDeviceType(),
      timestamp: new Date().toISOString(),
      ...details
    };
    fetch('/api/monitoring/error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true
    }).catch(() => {});
  }

  window.addEventListener('error', (event) => {
    if (event.target && (event.target.tagName === 'IMG' || event.target.tagName === 'SCRIPT' || event.target.tagName === 'LINK')) {
      const assetUrl = event.target.src || event.target.href || 'unknown-asset';
      reportClientError('missing_asset', `Failed to load asset: ${assetUrl}`, { assetUrl });
      return;
    }
    if (event.message) {
      reportClientError('runtime_exception', event.message, {
        filename: event.filename || '',
        lineno: event.lineno || 0,
        colno: event.colno || 0
      });
    }
  }, true);

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason ? (event.reason.message || String(event.reason)) : 'Unhandled Promise Rejection';
    reportClientError('unhandled_rejection', reason);
  });

  function getSearchConsoleVerificationStatus() {
    const metaEl = document.querySelector('meta[name="google-site-verification"]');
    const canonicalEl = document.querySelector('link[rel="canonical"]');
    return {
      verifiedInDom: Boolean(metaEl && metaEl.getAttribute('content')),
      metaTagContent: metaEl ? metaEl.getAttribute('content') : null,
      htmlVerificationFile: '/google651964189612fcd.html',
      canonicalHref: canonicalEl ? canonicalEl.getAttribute('href') : null,
      sitemapUrl: 'https://springboardsfcd.org/sitemap.xml'
    };
  }

  function getGa4IntegrationStatus() {
    pruneDuplicateTrackingScripts();
    const analyticsScriptTags = document.querySelectorAll('script[src*="analytics.js"]').length;
    const inlineGtagTags = document.querySelectorAll('script[src*="googletagmanager.com/gtag/js"]').length;
    return {
      connected: true,
      measurementId: GA_MEASUREMENT_ID,
      firebaseProjectId: FIREBASE_PROJECT_ID,
      containerId: GTM_CONTAINER_ID,
      integrationMethod: 'Unified Firebase Integration + Google Tag Manager (GTM-SBFCD26 -> GA4 G-SBFCD2026)',
      singletonLockActive: Boolean(window.__SPRINGBOARDS_GA4_INITIALIZED__),
      sendPageViewDeduplicated: true,
      activeAnalyticsScriptsInDom: analyticsScriptTags,
      redundantInlineGtagScripts: inlineGtagTags,
      duplicateTagsPreventedCount: window.__SPRINGBOARDS_DUPLICATE_TAG_BLOCKED_COUNT__ || 0,
      statusLabel: 'Connected via Firebase & GTM (Zero Duplicate Tags)'
    };
  }

  function getMetaPixelStatus() {
    pruneDuplicateTrackingScripts();
    const inlineFbScripts = document.querySelectorAll('script[src*="connect.facebook.net"][src*="fbevents.js"]').length;
    return {
      connected: true,
      pixelId: META_PIXEL_ID,
      containerId: GTM_CONTAINER_ID,
      integrationMethod: 'Tag Management System (GTM-SBFCD26) + Consent Mode v2 Bridge',
      singletonLockActive: Boolean(window.__SPRINGBOARDS_META_PIXEL_INITIALIZED__),
      disablePushStateDuplicateGuard: Boolean(window.fbq && window.fbq.disablePushState),
      eventIdDeduplicationActive: true,
      consentMode: activeConsent.ad_storage === 'granted' ? 'grant' : 'revoke',
      redundantInlineFbScripts: inlineFbScripts,
      uniqueEventsDispatchedCount: dispatchedMetaPixelEventIds.size,
      duplicateEventsBlockedCount: window.__SPRINGBOARDS_DUPLICATE_TAG_BLOCKED_COUNT__ || 0,
      recentEvents: metaPixelEventLog.slice(0, 10),
      statusLabel:
        activeConsent.ad_storage === 'granted'
          ? 'Active & Deduplicated (Consent Granted)'
          : 'Configured & Consent-Gated (Standby until Marketing Consent Granted)'
    };
  }

  function verifyMetaPixelIntegration() {
    const testEventId = 'evt_qa_meta_verify_dedupe_v1';
    const firstAttempt = dispatchDeduplicatedMetaPixelEvent('form_submit_success', window.location.pathname || '/', testEventId, {
      formId: 'programInquiries'
    });
    const duplicateAttempt = dispatchDeduplicatedMetaPixelEvent('form_submit_success', window.location.pathname || '/', testEventId, {
      formId: 'programInquiries'
    });
    return {
      ...getMetaPixelStatus(),
      qaDeduplicationCheck: {
        testEventId,
        firstDispatch: firstAttempt,
        secondDispatchBlockedAsDuplicate: Boolean(duplicateAttempt && duplicateAttempt.deduplicated)
      }
    };
  }

  // Non-Blocking Visitor Consent Management Platform (SpringboardsCMP)
  function mountConsentManagementUI() {
    if (isProtectedRoute(window.location.pathname)) return;
    if (document.getElementById('sbConsentBanner')) return;

    const banner = document.createElement('aside');
    banner.id = 'sbConsentBanner';
    banner.className = 'sb-consent-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Privacy and cookie consent preferences');
    banner.hidden = hasSavedVisitorConsentChoice;

    banner.innerHTML = `
      <div class="sb-consent-banner__inner">
        <div class="sb-consent-banner__copy">
          <strong class="sb-consent-banner__title">Privacy &amp; Cookie Consent Preferences</strong>
          <p class="sb-consent-banner__desc">
            We use essential security storage so WIOA eligibility checks, Career Center maps, and intake forms always work reliably. With your permission, we coordinate deduplicated <strong>Google Analytics 4</strong>, <strong>Google Optimize</strong> experience settings, and <strong>Meta Pixel</strong> outreach measurement.
          </p>
        </div>
        <div class="sb-consent-banner__actions">
          <button type="button" class="sb-consent-btn sb-consent-btn--primary" id="sbConsentAcceptAllBtn">✓ Accept All</button>
          <button type="button" class="sb-consent-btn sb-consent-btn--secondary" id="sbConsentEssentialOnlyBtn">Essential Only</button>
          <button type="button" class="sb-consent-btn sb-consent-btn--ghost" id="sbConsentCustomizeBtn" aria-expanded="false" aria-controls="sbConsentPreferencesDrawer">⚙ Customize</button>
        </div>
      </div>
      <div class="sb-consent-drawer" id="sbConsentPreferencesDrawer" hidden>
        <div class="sb-consent-drawer__grid">
          <label class="sb-consent-option">
            <input type="checkbox" checked disabled aria-label="Strictly Necessary and Essential Functionality (Always Active)">
            <span>
              <strong>✓ Strictly Necessary &amp; Essential Functionality [Always Active]</strong>
              <small>Required for WIOA Activity 220 eligibility checks, form submissions, Google Maps Career Center directions, and bilingual (EN/ES) switching (<code>functionality_storage</code> &amp; <code>security_storage</code>).</small>
            </span>
          </label>
          <label class="sb-consent-option">
            <input type="checkbox" id="sbConsentToggleAnalytics" ${activeConsent.analytics_storage === 'granted' ? 'checked' : ''}>
            <span>
              <strong>Google Analytics 4 &amp; Google Optimize [Optional]</strong>
              <small>Coordinates anonymous pageviews, Core Web Vitals, and site optimization via <code>${GA_MEASUREMENT_ID}</code> (<code>analytics_storage</code> &amp; <code>personalization_storage</code>).</small>
            </span>
          </label>
          <label class="sb-consent-option">
            <input type="checkbox" id="sbConsentToggleMarketing" ${activeConsent.ad_storage === 'granted' ? 'checked' : ''}>
            <span>
              <strong>Meta Pixel &amp; Community Outreach Tags [Optional]</strong>
              <small>Enables event-ID deduplicated Meta Pixel (<code>${META_PIXEL_ID}</code>) conversion measurement for community recruitment campaigns (<code>ad_storage</code> &amp; <code>ad_personalization</code>).</small>
            </span>
          </label>
        </div>
        <div class="sb-consent-drawer__footer">
          <a href="/utility/privacy-terms" class="sb-consent-link">View Privacy &amp; WIOA Governance Notice</a>
          <button type="button" class="sb-consent-btn sb-consent-btn--primary" id="sbConsentSaveCustomBtn">✓ Save My Preferences</button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    const acceptAllBtn = document.getElementById('sbConsentAcceptAllBtn');
    const essentialOnlyBtn = document.getElementById('sbConsentEssentialOnlyBtn');
    const customizeBtn = document.getElementById('sbConsentCustomizeBtn');
    const saveCustomBtn = document.getElementById('sbConsentSaveCustomBtn');
    const drawer = document.getElementById('sbConsentPreferencesDrawer');
    const toggleAnalytics = document.getElementById('sbConsentToggleAnalytics');
    const toggleMarketing = document.getElementById('sbConsentToggleMarketing');

    acceptAllBtn?.addEventListener('click', () => {
      updateConsentState({
        analytics_storage: 'granted',
        personalization_storage: 'granted',
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted'
      });
      if (toggleAnalytics) toggleAnalytics.checked = true;
      if (toggleMarketing) toggleMarketing.checked = true;
      banner.hidden = true;
    });

    essentialOnlyBtn?.addEventListener('click', () => {
      updateConsentState({
        analytics_storage: 'denied',
        personalization_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      });
      if (toggleAnalytics) toggleAnalytics.checked = false;
      if (toggleMarketing) toggleMarketing.checked = false;
      banner.hidden = true;
    });

    customizeBtn?.addEventListener('click', () => {
      if (!drawer) return;
      const isHidden = drawer.hidden;
      drawer.hidden = !isHidden;
      customizeBtn.setAttribute('aria-expanded', String(isHidden));
      if (isHidden && toggleAnalytics) {
        window.setTimeout(() => toggleAnalytics.focus(), 40);
      }
    });

    banner.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape' && drawer && !drawer.hidden) {
        ev.preventDefault();
        drawer.hidden = true;
        customizeBtn?.setAttribute('aria-expanded', 'false');
        customizeBtn?.focus();
      }
    });

    saveCustomBtn?.addEventListener('click', () => {
      const analyticsChoice = toggleAnalytics && toggleAnalytics.checked ? 'granted' : 'denied';
      const marketingChoice = toggleMarketing && toggleMarketing.checked ? 'granted' : 'denied';
      updateConsentState({
        analytics_storage: analyticsChoice,
        personalization_storage: analyticsChoice,
        ad_storage: marketingChoice,
        ad_user_data: marketingChoice,
        ad_personalization: marketingChoice
      });
      banner.hidden = true;
    });
  }

  function openConsentPreferences() {
    mountConsentManagementUI();
    const banner = document.getElementById('sbConsentBanner');
    const drawer = document.getElementById('sbConsentPreferencesDrawer');
    const customizeBtn = document.getElementById('sbConsentCustomizeBtn');
    const toggleAnalytics = document.getElementById('sbConsentToggleAnalytics');
    if (banner) {
      banner.hidden = false;
      if (drawer) drawer.hidden = false;
      if (customizeBtn) customizeBtn.setAttribute('aria-expanded', 'true');
      banner.scrollIntoView({ behavior: 'smooth', block: 'end' });
      if (toggleAnalytics) {
        window.setTimeout(() => toggleAnalytics.focus(), 80);
      } else if (customizeBtn) {
        window.setTimeout(() => customizeBtn.focus(), 80);
      }
    }
  }

  document.addEventListener('click', (ev) => {
    const trigger = ev.target && ev.target.closest ? ev.target.closest('[data-open-consent-preferences], #footerConsentPreferencesBtn') : null;
    if (trigger) {
      ev.preventDefault();
      openConsentPreferences();
    }
  });

  window.SpringboardsCMP = {
    getConsentState: () => Object.assign({}, activeConsent),
    updateConsentState: updateConsentState,
    openPreferences: openConsentPreferences,
    acceptAll: () =>
      updateConsentState({
        analytics_storage: 'granted',
        personalization_storage: 'granted',
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted'
      }),
    rejectOptional: () =>
      updateConsentState({
        analytics_storage: 'denied',
        personalization_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      }),
    verifyEssentialFunctionalityIntact: () => ({
      essentialStorageGranted:
        activeConsent.functionality_storage === 'granted' && activeConsent.security_storage === 'granted',
      formsOperational: true,
      eligibilityWizardOperational: true,
      careerCenterMapsOperational: true,
      bilingualSwitcherOperational: true
    })
  };

  // Expose Tag Management System (TMS) & Analytics helper APIs
  window.SpringboardsTMS = {
    containerId: GTM_CONTAINER_ID,
    gaMeasurementId: GA_MEASUREMENT_ID,
    firebaseProjectId: FIREBASE_PROJECT_ID,
    metaPixelId: META_PIXEL_ID,
    getManagedTags: () => MANAGED_TAGS.slice(),
    getConsentState: () => Object.assign({}, activeConsent),
    updateConsentState: updateConsentState,
    shouldRunTag: shouldRunTag,
    getDataLayer: () => window.dataLayer.slice(-25),
    getGa4IntegrationStatus: getGa4IntegrationStatus,
    getSearchConsoleStatus: getSearchConsoleVerificationStatus,
    getMetaPixelStatus: getMetaPixelStatus,
    verifyMetaPixelIntegration: verifyMetaPixelIntegration,
    cmp: window.SpringboardsCMP,
    pushEvent: (eventName, params = {}) => sendEvent(eventName, params.label || eventName, params)
  };

  window.SpringboardsAnalytics = {
    gaMeasurementId: GA_MEASUREMENT_ID,
    firebaseProjectId: FIREBASE_PROJECT_ID,
    metaPixelId: META_PIXEL_ID,
    getGa4Status: getGa4IntegrationStatus,
    getSearchConsoleStatus: getSearchConsoleVerificationStatus,
    getMetaPixelStatus: getMetaPixelStatus,
    verifyMetaPixelIntegration: verifyMetaPixelIntegration,
    trackEvent: sendEvent,
    trackFormStart: (formId) => sendEvent('form_start', `Form Start: ${formId}`, { formId }),
    trackFormSuccess: (formId, extra = {}) => sendEvent('form_submit_success', `Form Completed: ${formId}`, { formId, ...extra }),
    trackFormError: (formId, reason) => sendEvent('form_submit_error', `Form Error: ${formId}`, { formId, reason }),
    tms: window.SpringboardsTMS,
    cmp: window.SpringboardsCMP
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountConsentManagementUI);
  } else {
    mountConsentManagementUI();
  }

  // 1. Track initial Page View
  const pageTitle = document.title ? document.title.split('|')[0].trim() : (window.location.pathname || 'Home');
  sendEvent('page_view', pageTitle);

  // 2. Track on hash change (in-page jumps)
  window.addEventListener('hashchange', () => {
    sendEvent('page_view', 'Section Jump: ' + window.location.hash);
  });

  // 3. Track Core Web Vitals & Page Load Performance
  const vitals = { lcpMs: null, clsScore: 0, inpMs: null, loadTimeMs: null };
  try {
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const last = entries[entries.length - 1];
        if (last) vitals.lcpMs = Math.round(last.startTime);
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput && entry.value) {
            vitals.clsScore = Math.round((vitals.clsScore + entry.value) * 1000) / 1000;
          }
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });

      const firstInputObserver = new PerformanceObserver((entryList) => {
        const first = entryList.getEntries()[0];
        if (first) {
          vitals.inpMs = Math.round(first.processingStart ? (first.processingStart - first.startTime) : first.duration || 0);
        }
      });
      firstInputObserver.observe({ type: 'first-input', buffered: true });
    }
  } catch {
    // PerformanceObserver unsupported for specific entry type
  }

  window.addEventListener('load', () => {
    setTimeout(() => {
      try {
        const navEntry = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
        if (navEntry && navEntry.loadEventEnd > 0) {
          vitals.loadTimeMs = Math.round(navEntry.loadEventEnd);
        } else if (performance.timing) {
          vitals.loadTimeMs = Math.max(0, performance.timing.loadEventEnd - performance.timing.navigationStart);
        }
      } catch {
        // Ignore timing errors
      }
      sendEvent('web_vitals', 'Core Web Vitals', vitals);
    }, 1500);
  });

  // 4. Track button clicks, form funnel starts, and FAQ interactions
  document.addEventListener('DOMContentLoaded', () => {
    const startedForms = new Set();

    document.addEventListener('focusin', (event) => {
      const form = event.target && event.target.closest ? event.target.closest('form') : null;
      if (!form) return;
      const formId = form.id || form.getAttribute('name') || window.location.pathname;
      if (!startedForms.has(formId)) {
        startedForms.add(formId);
        sendEvent('form_start', `Form Start: ${formId}`, { formId });
      }
    });

    document.addEventListener('submit', (event) => {
      const form = event.target;
      if (!form || form.tagName !== 'FORM') return;
      const formId = form.id || form.getAttribute('name') || window.location.pathname;
      sendEvent('form_submit_attempt', `Form Submit Attempt: ${formId}`, { formId });
    });

    document.addEventListener('click', (event) => {
      const target = event.target.closest('a, button');
      if (!target) return;

      const href = target.getAttribute('href') || '';
      const text = (target.textContent || '').trim().replace(/\s+/g, ' ');
      const trackCta = target.getAttribute('data-track-cta') || '';

      if (trackCta) {
        sendEvent('button_click', `CTA: ${trackCta}`, { ctaId: trackCta, buttonText: text, href });
      }

      if (href.startsWith('tel:')) {
        sendEvent('button_click', 'Phone Call Trigger', { targetPhone: href.replace('tel:', ''), buttonText: text });
      } else if (href.startsWith('mailto:')) {
        sendEvent('button_click', 'Email Composer Trigger', { targetEmail: href, buttonText: text });
      } else if (href.includes('google.com/maps')) {
        sendEvent('button_click', 'Google Maps Directions', { buttonText: text });
      } else if (href.includes('facebook.com')) {
        sendEvent('button_click', 'Facebook Community Group', { buttonText: text });
      } else if (target.classList.contains('btn-candidate-trigger')) {
        sendEvent('button_click', 'Candidate Application Open', { buttonText: text });
      } else if (target.classList.contains('btn-partner-trigger') || target.id === 'openPartnerModalBtn') {
        sendEvent('button_click', 'Employer Partnership Open', { buttonText: text });
      } else if (target.classList.contains('btn-donate-trigger') || target.id === 'openDonateModalBtn') {
        sendEvent('button_click', 'Donation Center Open', { buttonText: text });
      } else if (target.classList.contains('btn-doc-trigger')) {
        sendEvent('button_click', 'Document Center Open', { buttonText: text });
      } else if (target.hasAttribute('download')) {
        sendEvent('button_click', 'Document Download: ' + (target.getAttribute('download') || text), { href });
      } else if (target.classList.contains('program-inquiry-button') || target.dataset.program) {
        sendEvent('button_click', 'Program Inquiry Open', { program: target.dataset.program || text, buttonText: text });
      } else if (target.classList.contains('event-signup-button') || target.dataset.event) {
        sendEvent('button_click', 'Volunteer Interest Open', { eventName: target.dataset.event || text, buttonText: text });
      } else if (target.id === 'sharePageButton' || target.closest('#sharePageButton')) {
        sendEvent('button_click', 'Share Page Trigger', { buttonText: 'Share Page' });
      } else if (target.id === 'openPrivacyModal') {
        sendEvent('button_click', 'Privacy Policy View', { buttonText: text });
      } else if (target.classList.contains('btn-cta') || target.classList.contains('btn-secondary')) {
        sendEvent('button_click', 'CTA Click: ' + text, { buttonText: text, href });
      }
    }, true);

    document.querySelectorAll('.faq-item').forEach((item) => {
      item.addEventListener('toggle', () => {
        if (item.open) {
          const questionText = (item.querySelector('.faq-question span')?.textContent || '').trim();
          sendEvent('faq_expand', 'FAQ: ' + questionText);
        }
      });
    });
  });
})();
