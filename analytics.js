// Springboards Web Analytics, Conversion Funnel & Real-User Monitoring Client
// Lightweight, privacy-respecting traffic, referral, conversion funnel, Core Web Vitals, and runtime error tracking
(function () {
  'use strict';

  // Generate or retrieve anonymous session ID
  let sessionId = sessionStorage.getItem('sb_analytics_sid');
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

  // Parse referrer category
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

  // Send event beacon
  function sendEvent(eventType, eventLabel, metadata = {}) {
    const payload = {
      eventType,
      eventLabel,
      sessionId,
      path: window.location.pathname + window.location.hash,
      pageRoute: window.location.pathname || '/',
      referrer: document.referrer || '',
      referralSource: getReferralSource(),
      deviceType: getDeviceType(),
      timestamp: new Date().toISOString(),
      screen: `${window.innerWidth}x${window.innerHeight}`,
      ...metadata
    };

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

  // Expose analytics helper API for form scripts
  window.SpringboardsAnalytics = {
    trackEvent: sendEvent,
    trackFormStart: (formId) => sendEvent('form_start', `Form Start: ${formId}`, { formId }),
    trackFormSuccess: (formId) => sendEvent('form_submit_success', `Form Completed: ${formId}`, { formId }),
    trackFormError: (formId, reason) => sendEvent('form_submit_error', `Form Error: ${formId}`, { formId, reason })
  };

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

    // Track form_start on first focus/input inside any form
    document.addEventListener('focusin', (event) => {
      const form = event.target && event.target.closest ? event.target.closest('form') : null;
      if (!form) return;
      const formId = form.id || form.getAttribute('name') || window.location.pathname;
      if (!startedForms.has(formId)) {
        startedForms.add(formId);
        sendEvent('form_start', `Form Start: ${formId}`, { formId });
      }
    });

    // Track form submission attempts
    document.addEventListener('submit', (event) => {
      const form = event.target;
      if (!form || form.tagName !== 'FORM') return;
      const formId = form.id || form.getAttribute('name') || window.location.pathname;
      sendEvent('form_submit_attempt', `Form Submit Attempt: ${formId}`, { formId });
    });

    // Track clicks on all CTAs and key buttons
    document.addEventListener('click', (event) => {
      const target = event.target.closest('a, button');
      if (!target) return;

      const href = target.getAttribute('href') || '';
      const text = (target.textContent || '').trim().replace(/\s+/g, ' ');
      const trackCta = target.getAttribute('data-track-cta') || '';

      if (trackCta) {
        sendEvent('button_click', `CTA: ${trackCta}`, { ctaId: trackCta, buttonText: text, href });
      }

      // Direct Contact Triggers
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

    // Track FAQ accordion interaction
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
