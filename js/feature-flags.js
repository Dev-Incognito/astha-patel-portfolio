/* ============================================
   FEATURE FLAGS SYSTEM
   Toggles for every element on the portfolio
   ============================================ */

(function() {
  'use strict';

  const STORAGE_KEY = 'astha-portfolio-flags';

  // Flag-to-DOM mapping
  const FLAG_MAP = {
    // Global
    'animations':        { action: 'class-toggle', target: 'body', className: 'no-animations' },
    'scroll-progress':   { action: 'hide', selector: '.scroll-progress' },
    'navigation':        { action: 'hide', selector: '#mainNav' },
    'back-to-top':       { action: 'hide', selector: '#backToTop' },
    'footer':            { action: 'hide', selector: '.page-footer' },

    // Hero
    'hero-section':      { action: 'hide', selector: '#hero' },
    'hero-name':         { action: 'hide', selector: '.hero-name' },
    'hero-tagline':      { action: 'hide', selector: '.hero-tagline' },
    'hero-statement':    { action: 'hide', selector: '.hero-statement' },
    'hero-portrait':     { action: 'hide', selector: '.hero-portrait' },
    'hero-scroll-btn':   { action: 'hide', selector: '.hero-scroll' },
    'hero-bg-blobs':     { action: 'hide', selector: '.hero-bg-element', all: true },

    // Sections
    'section-brand':          { action: 'hide', selector: '#brand' },
    'section-strengths':      { action: 'hide', selector: '#strengths' },
    'section-differentiators':{ action: 'hide', selector: '#differentiators' },
    'section-exposure':       { action: 'hide', selector: '#exposure' },
    'section-capabilities':   { action: 'hide', selector: '#capabilities' },
    'section-vision':         { action: 'hide', selector: '#vision' },
    'section-introduction':   { action: 'hide', selector: '#introduction' },
    'section-contact':        { action: 'hide', selector: '#contact' },

    // Brand elements
    'brand-quote':       { action: 'hide', selector: '.brand-quote' },
    'brand-values':      { action: 'hide', selector: '.brand-values' },
    'brand-philosophy':  { action: 'hide', selector: '#brand [data-block="philosophy"]' },

    // Strengths elements
    'strengths-timeline':{ action: 'class-toggle', target: '.exp-timeline', className: 'no-timeline-line' },
    'strengths-tags':    { action: 'hide', selector: '.exp-skills', all: true },

    // Capabilities elements
    'cap-bars':          { action: 'hide', selector: '.cap-bar-container', all: true },
    'cap-descriptions':  { action: 'hide', selector: '.cap-item p', all: true },

    // Vision elements
    'vision-pillars':       { action: 'hide', selector: '.vision-pillars' },
    'vision-closing-quote': { action: 'hide', selector: '#vision [data-block="closing-quote"]' },

    // Contact elements
    'contact-portrait':    { action: 'hide', selector: '.contact-portrait' },
    'contact-info':        { action: 'hide', selector: '.contact-info' },
    'contact-references':  { action: 'hide', selector: '#contact [data-block="references"]' },

    // Visual effects (these use JS-level flags, read by script.js)
    'magnetic-hover':   { action: 'js-flag' },
    'portrait-tilt':    { action: 'js-flag' },
    'parallax-bg':      { action: 'js-flag' },
    'dividers':         { action: 'hide', selector: '.divider', all: true },
    'section-labels':   { action: 'hide', selector: '.section-label', all: true },
  };

  // State
  let defaultFlags = {};
  let flags = {};

  // Fetch defaults
  async function loadDefaultFlags() {
    try {
      const response = await fetch('data/feature-flags.json');
      if (response.ok) {
        defaultFlags = await response.json();
      }
    } catch(e) {
      console.warn('Failed to load default feature flags. Falling back to internal defaults.');
    }
  }

  // Load from localStorage
  function loadFlags() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        flags = { ...defaultFlags, ...JSON.parse(stored) };
      } else {
        flags = { ...defaultFlags };
      }
    } catch(e) {
      flags = { ...defaultFlags };
    }
  }

  // Save to localStorage
  function saveFlags() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(flags));
    } catch(e) {}
  }

  // Apply a single flag
  function applyFlag(flagName, isEnabled) {
    const mapping = FLAG_MAP[flagName];
    if (!mapping) return;

    if (mapping.action === 'hide') {
      if (mapping.all) {
        document.querySelectorAll(mapping.selector).forEach(el => {
          el.style.display = isEnabled ? '' : 'none';
        });
      } else {
        const el = document.querySelector(mapping.selector);
        if (el) el.style.display = isEnabled ? '' : 'none';
      }
    }
    else if (mapping.action === 'class-toggle') {
      const target = mapping.target === 'body'
        ? document.body
        : document.querySelector(mapping.target);
      if (target) {
        if (isEnabled) {
          target.classList.remove(mapping.className);
        } else {
          target.classList.add(mapping.className);
        }
      }
    }
    else if (mapping.action === 'js-flag') {
      window.__featureFlags = window.__featureFlags || {};
      window.__featureFlags[flagName] = isEnabled;
    }
  }


  // Apply all flags
  function applyAllFlags() {
    for (const flagName in FLAG_MAP) {
      const isEnabled = flags[flagName] !== false; // default true if missing
      applyFlag(flagName, isEnabled);
    }
  }

  // Sync checkboxes to state
  function syncCheckboxes() {
    document.querySelectorAll('.ff-toggle[data-flag]').forEach(toggle => {
      const flagName = toggle.getAttribute('data-flag');
      const checkbox = toggle.querySelector('input[type="checkbox"]');
      if (checkbox) {
        checkbox.checked = flags[flagName] !== false;
      }
    });
  }

  // Panel open/close
  function openPanel() {
    document.getElementById('ffPanel').classList.add('open');
    document.getElementById('ffOverlay').classList.add('open');
  }

  function closePanel() {
    document.getElementById('ffPanel').classList.remove('open');
    document.getElementById('ffOverlay').classList.remove('open');
  }

  // Reset all
  function resetAll() {
    flags = { ...defaultFlags }; // Reset to JSON defaults
    saveFlags();
    syncCheckboxes();
    applyAllFlags();
  }

  // Init
  async function init() {
    await loadDefaultFlags();
    loadFlags();

    // Initialize JS flags
    window.__featureFlags = window.__featureFlags || {};
    for (const flagName in FLAG_MAP) {
      if (FLAG_MAP[flagName].action === 'js-flag') {
        window.__featureFlags[flagName] = flags[flagName] !== false;
      }
    }

    // Apply flags after a short delay so DOM is ready
    requestAnimationFrame(() => {
      applyAllFlags();
      syncCheckboxes();
    });

    // Trigger button
    document.getElementById('ffTrigger').addEventListener('click', openPanel);

    // Close
    document.getElementById('ffClose').addEventListener('click', closePanel);
    document.getElementById('ffOverlay').addEventListener('click', closePanel);

    // Reset
    document.getElementById('ffReset').addEventListener('click', resetAll);

    // Toggle changes
    document.getElementById('ffBody').addEventListener('change', (e) => {
      const toggle = e.target.closest('.ff-toggle[data-flag]');
      if (!toggle) return;

      const flagName = toggle.getAttribute('data-flag');
      const checkbox = toggle.querySelector('input[type="checkbox"]');
      const isEnabled = checkbox.checked;

      flags[flagName] = isEnabled;
      saveFlags();
      applyFlag(flagName, isEnabled);
    });

    // Keyboard: Escape to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closePanel();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
