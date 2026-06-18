/* ============================================
   CONTENT LOADER
   Fetches content.json and populates the DOM,
   then kicks off animations.
   ============================================ */

(async function() {
  try {
    const response = await fetch('data/content.json');
    if (!response.ok) throw new Error('Failed to load content.json');
    const data = await response.json();

    // -- GLOBAL --
    document.querySelector('.nav-brand').textContent = data.global.navBrand;
    document.querySelector('.footer-brand').textContent = data.global.footerBrand;
    document.querySelector('.footer-text').textContent = data.global.footerText;

    const navLinksList = document.getElementById('navLinks');
    navLinksList.innerHTML = data.global.navLinks.map(link =>
      `<li><a href="#${link.id}">${link.label}</a></li>`
    ).join('');

    const mobileNavEl = document.getElementById('mobileNav');
    mobileNavEl.innerHTML = data.global.navLinks.map(link =>
      `<a href="#${link.id}" onclick="closeMobileNav()">${link.label}</a>`
    ).join('');

    // -- HERO --
    const heroName = document.querySelector('.hero-name');
    heroName.innerHTML = `${data.hero.nameFirst}<span>${data.hero.nameLast}</span>`;

    const heroTagline = document.querySelector('.hero-tagline');
    heroTagline.innerHTML = data.hero.tagline.map((tag, i, arr) =>
      `<span>${tag}</span>${i < arr.length - 1 ? '<span class="dot"></span>' : ''}`
    ).join('');

    document.querySelector('.hero-statement').textContent = data.hero.statement;
    document.querySelector('.hero-scroll span').textContent = data.hero.scrollBtn;

    // -- BRAND --
    document.querySelector('#brand .section-label').textContent = data.brand.sectionLabel;
    document.querySelector('#brand .section-title').textContent = data.brand.sectionTitle;
    document.querySelector('#brand .section-subtitle').textContent = data.brand.sectionSubtitle;
    document.querySelector('.brand-quote').textContent = data.brand.quote;

    const brandValues = document.querySelector('.brand-values');
    brandValues.innerHTML = data.brand.values.map((v, i) => `
      <div class="value-card reveal reveal-delay-${i + 1}">
        <div class="value-icon">${v.icon}</div>
        <h3>${v.title}</h3>
        <p>${v.desc}</p>
      </div>
    `).join('');

    // Philosophy block - target by data attribute to be safe
    const philosophyBlock = document.querySelector('#brand [data-block="philosophy"]');
    if (philosophyBlock) {
      philosophyBlock.innerHTML = `
        <h3 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 500; margin-bottom: 16px; color: var(--charcoal);">${data.brand.philosophyTitle}</h3>
        <p style="font-family: var(--font-display); font-size: 1.05rem; line-height: 1.9; color: var(--graphite); font-style: italic;">
          ${data.brand.philosophyText}
        </p>
      `;
    }

    // -- STRENGTHS --
    document.querySelector('#strengths .section-label').textContent = data.strengths.sectionLabel;
    document.querySelector('#strengths .section-title').textContent = data.strengths.sectionTitle;
    document.querySelector('#strengths .section-subtitle').textContent = data.strengths.sectionSubtitle;

    const expTimeline = document.querySelector('.exp-timeline');
    expTimeline.innerHTML = data.strengths.timeline.map((item, i) => `
      <div class="exp-item reveal ${i > 0 ? 'reveal-delay-' + i : ''}">
        <div class="exp-period">${item.period}</div>
        <div class="exp-role">${item.role}</div>
        <div class="exp-company">${item.company}</div>
        <p class="exp-description">${item.desc}</p>
        <div class="exp-skills">
          ${item.skills.map(skill => `<span class="exp-skill-tag">${skill}</span>`).join('')}
        </div>
      </div>
    `).join('');

    // -- DIFFERENTIATORS --
    document.querySelector('#differentiators .section-label').textContent = data.differentiators.sectionLabel;
    document.querySelector('#differentiators .section-title').textContent = data.differentiators.sectionTitle;
    document.querySelector('#differentiators .section-subtitle').textContent = data.differentiators.sectionSubtitle;

    const diffGrid = document.querySelector('.diff-grid');
    diffGrid.innerHTML = data.differentiators.cards.map((card, i) => `
      <div class="diff-card reveal reveal-delay-${(i % 3) + 1}">
        <div class="diff-number">${card.number}</div>
        <h3>${card.title}</h3>
        <p>${card.desc}</p>
      </div>
    `).join('');

    // -- EXPOSURE --
    document.querySelector('#exposure .section-label').textContent = data.exposure.sectionLabel;
    document.querySelector('#exposure .section-title').textContent = data.exposure.sectionTitle;
    document.querySelector('#exposure .section-subtitle').textContent = data.exposure.sectionSubtitle;

    document.querySelector('.biz-narrative').innerHTML = `
      <p>${data.exposure.narrativeP1}</p>
      <p>${data.exposure.narrativeP2}</p>
      <p>${data.exposure.narrativeP3}</p>
    `;

    document.querySelector('.biz-highlights').innerHTML = data.exposure.highlights.map((h, i) => `
      <div class="biz-highlight reveal reveal-delay-${i + 1}">
        <h4>${h.title}</h4>
        <p>${h.desc}</p>
      </div>
    `).join('');

    // -- CAPABILITIES --
    document.querySelector('#capabilities .section-label').textContent = data.capabilities.sectionLabel;
    document.querySelector('#capabilities .section-title').textContent = data.capabilities.sectionTitle;
    document.querySelector('#capabilities .section-subtitle').textContent = data.capabilities.sectionSubtitle;

    const capVisual = document.querySelector('.cap-visual');
    let capHtml = '';
    for (let i = 0; i < data.capabilities.items.length; i += 3) {
      capHtml += `<div class="cap-row reveal ${i > 0 ? 'reveal-delay-' + (i / 3) : ''}">`;
      for (let j = 0; j < 3 && i + j < data.capabilities.items.length; j++) {
        const item = data.capabilities.items[i + j];
        capHtml += `
          <div class="cap-item">
            <h3>${item.title}</h3>
            <div class="cap-bar-container">
              <div class="cap-bar" style="width: ${item.progress}"></div>
            </div>
            <p>${item.desc}</p>
          </div>
        `;
      }
      capHtml += `</div>`;
    }
    capVisual.innerHTML = capHtml;

    // -- VISION --
    document.querySelector('#vision .section-label').textContent = data.vision.sectionLabel;
    document.querySelector('#vision .section-title').textContent = data.vision.sectionTitle;
    document.querySelector('.vision-statement').innerHTML = data.vision.statement;

    document.querySelector('.vision-pillars').innerHTML = data.vision.pillars.map((p, i) => `
      <div class="vision-pillar reveal reveal-delay-${i + 1}">
        <div class="vision-pillar-icon">${p.icon}</div>
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
      </div>
    `).join('');

    const visionQuoteEl = document.querySelector('#vision [data-block="closing-quote"] p');
    if (visionQuoteEl) visionQuoteEl.textContent = data.vision.closingQuote;

    // -- INTRODUCTION --
    document.querySelector('#introduction .section-label').textContent = data.introduction.sectionLabel;
    document.querySelector('#introduction .section-title').textContent = data.introduction.sectionTitle;

    document.querySelector('.intro-text').innerHTML = data.introduction.paragraphs.map(p => `<p>${p}</p>`).join('');
    document.querySelector('.intro-signature .name').textContent = data.introduction.signature;

    // -- CONTACT --
    document.querySelector('#contact .section-label').textContent = data.contact.sectionLabel;
    document.querySelector('#contact .section-title').textContent = data.contact.sectionTitle;

    document.querySelector('.contact-name').textContent = data.contact.cardName;
    document.querySelector('.contact-tagline').textContent = data.contact.cardTagline;

    document.querySelector('.contact-info').innerHTML = data.contact.info.map(info => `
      <div class="contact-item">
        <span class="icon">${info.icon}</span>
        <span>${info.text}</span>
      </div>
    `).join('');

    document.querySelector('.contact-footer').textContent = data.contact.footer;

    const referencesEl = document.querySelector('#contact [data-block="references"] p');
    if (referencesEl) referencesEl.textContent = data.contact.references;

    console.log('✦ Content loaded from content.json');
  } catch (error) {
    console.error('Content loader error:', error);
  }

  // Initialize animations after content injection
  // Uses requestAnimationFrame to ensure DOM has painted
  requestAnimationFrame(() => {
    if (typeof window.initializeAnimations === 'function') {
      window.initializeAnimations();
    }
  });
})();
