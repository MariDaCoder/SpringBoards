/**
 * Springboards for Community Development
 * Reusable Layout & Content Component System (/components.js)
 *
 * Principles:
 * 1. Flat DOM Hierarchy: Avoids unnecessary wrapper divs or deep nesting (max 2 levels).
 * 2. Component Properties (data-prop-*): Each instance accepts unique content and
 *    visual variant properties without duplicating structural markup or CSS.
 * 3. Progressive Enhancement: Preserves server-rendered SEO headings (<h1>, <h2>)
 *    when present, or renders clean semantic children when mounted on an empty host.
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

  /**
   * 1. Section Header Component ([data-component="section-header"] / .c-section-header)
   *    Props:
   *      - data-prop-eyebrow: Uppercase kicker text
   *      - data-prop-title: Heading text
   *      - data-prop-subtitle: Supporting lead copy
   *      - data-prop-align: "left" | "center"
   *      - data-prop-heading-tag: "h1" | "h2" | "h3" (defaults to "h2")
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

    // If empty mount, render flat semantic children
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

    // Otherwise sync props onto existing flat children
    var eyebrowEl = el.querySelector('.c-section-header__eyebrow, .section-eyebrow, .section-tag');
    var titleEl = el.querySelector('.c-section-header__title, .section-title, h1, h2, h3');
    var subtitleEl = el.querySelector('.c-section-header__subtitle, .section-subtitle, p');

    if (eyebrow && eyebrowEl) eyebrowEl.textContent = eyebrow;
    if (title && titleEl) titleEl.textContent = title;
    if (subtitle && subtitleEl) subtitleEl.textContent = subtitle;
  }

  /**
   * 2. Feature / Proof Card Component ([data-component="feature-card"] / .c-feature-card)
   *    Props:
   *      - data-prop-index: Badge/step numeral (e.g., "01", "$50 – $150")
   *      - data-prop-title: Card heading
   *      - data-prop-description: Card body text
   *      - data-prop-variant: "dark" | "light" | "warm" | "featured"
   *      - data-prop-cta-label: Optional action link text
   *      - data-prop-cta-href: Optional action link URL
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
        html += '<a href="' + escapeHtml(ctaHref) + '" class="c-feature-card__cta link-text is-arrow">' + escapeHtml(ctaLabel) + ' <span aria-hidden="true">→</span></a>';
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
      ctaEl.setAttribute('href', ctaHref);
    }
  }

  /**
   * 3. Civic Action / CTA Banner Component ([data-component="cta-banner"] / .c-cta-banner)
   *    Props:
   *      - data-prop-eyebrow: Kicker label
   *      - data-prop-title: Banner heading
   *      - data-prop-description: Supporting copy
   *      - data-prop-primary-label / data-prop-primary-href: Primary CTA button
   *      - data-prop-secondary-label / data-prop-secondary-href: Secondary outline button
   *      - data-prop-theme: "navy" | "warm" | "subtle"
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
    var primaryHref = el.getAttribute('data-prop-primary-href') || '/eligibility';
    var secondaryLabel = el.getAttribute('data-prop-secondary-label');
    var secondaryHref = el.getAttribute('data-prop-secondary-href') || '/train';
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
   *    Props:
   *      - data-prop-active-route: e.g. "/donate", "/partner", "/volunteer"
   *      - data-prop-cta-label: Primary CTA text
   *      - data-prop-cta-href: Primary CTA destination
   */
  function renderSiteNavbar(el) {
    var activeRoute = el.getAttribute('data-prop-active-route') || window.location.pathname;
    var ctaLabel = el.getAttribute('data-prop-cta-label');
    var ctaHref = el.getAttribute('data-prop-cta-href');

    el.querySelectorAll('.nav-link').forEach(function (link) {
      var href = link.getAttribute('href');
      var isMatch = href === activeRoute;
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
        if (ctaHref) btn.setAttribute('href', ctaHref);
      });
    }
  }

  /**
   * 5. Site Footer Component ([data-component="site-footer"])
   *    Props:
   *      - data-prop-active-route: Highlights current route in footer links
   */
  function renderSiteFooter(el) {
    var activeRoute = el.getAttribute('data-prop-active-route') || window.location.pathname;
    el.querySelectorAll('a[href]').forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === activeRoute) {
        link.setAttribute('aria-current', 'page');
      }
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

  window.SpringboardsComponents = {
    mountAll: mountAll,
    renderComponent: renderComponent,
    updateProps: updateProps
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      mountAll(document);
    });
  } else {
    mountAll(document);
  }
})();
