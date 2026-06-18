/* ============================================
   ASTHA PATEL - Personal Brand Portfolio
   Interactive Behaviors & Animations
   ============================================ */

// Expose initializeAnimations globally so content-loader can call it
// after dynamic content is injected into the DOM.
window.initializeAnimations = function() {

  // ---------- Scroll Reveal - REPLAY on scroll back ----------
  const revealElements = document.querySelectorAll('.reveal:not(.observed)');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Re-animate capability bars inside this element
        const bars = entry.target.querySelectorAll('.cap-bar');
        bars.forEach((bar, i) => {
          bar.classList.remove('animate');
          void bar.offsetWidth; // force reflow to reset scaleX
          setTimeout(() => bar.classList.add('animate'), 200 + i * 100);
        });

      } else {
        // Remove visible so it replays next time it enters
        entry.target.classList.remove('visible');

        // Reset bars so they animate again on re-entry
        const bars = entry.target.querySelectorAll('.cap-bar');
        bars.forEach(bar => bar.classList.remove('animate'));
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => {
    el.classList.add('observed');
    revealObserver.observe(el);
  });

  // ---------- Diff numbers - replay ----------
  const diffNumbers = document.querySelectorAll('.diff-number:not(.diff-observed)');
  const diffObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('count-in');
      } else {
        entry.target.classList.remove('count-in');
      }
    });
  }, { threshold: 0.3 });

  diffNumbers.forEach(num => {
    num.classList.add('diff-observed');
    diffObserver.observe(num);
  });

  // ---------- Standalone cap bars (not inside reveal) ----------
  const standaloneBars = document.querySelectorAll('.cap-bar:not(.bar-observed)');
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        void entry.target.offsetWidth;
        setTimeout(() => entry.target.classList.add('animate'), 200);
      } else {
        entry.target.classList.remove('animate');
      }
    });
  }, { threshold: 0.5 });

  standaloneBars.forEach(bar => {
    bar.classList.add('bar-observed');
    barObserver.observe(bar);
  });

  // ---------- Magnetic Hover on Cards ----------
  const cards = document.querySelectorAll('.value-card, .diff-card, .cap-item, .vision-pillar, .biz-highlight');
  cards.forEach(card => {
    if (card.dataset.tiltBound) return;
    card.dataset.tiltBound = 'true';

    card.addEventListener('mousemove', (e) => {
      if (window.__featureFlags && window.__featureFlags['magnetic-hover'] === false) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = (y - rect.height / 2) / 20;
      const rotateY = (rect.width / 2 - x) / 20;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      const px = (x / rect.width) * 100;
      const py = (y / rect.height) * 100;
      card.style.setProperty('--spotlight-x', px + '%');
      card.style.setProperty('--spotlight-y', py + '%');
      card.classList.add('has-spotlight');
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.classList.remove('has-spotlight');
    });
  });

  // ---------- Text data-text for section titles ----------
  document.querySelectorAll('.section-title').forEach(title => {
    title.setAttribute('data-text', title.textContent);
  });
};

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Smooth Page Load ----------
  document.body.classList.add('page-loaded');

  // ---------- Navigation Scroll Effect ----------
  const nav = document.getElementById('mainNav');
  const backToTop = document.getElementById('backToTop');

  const handleNavScroll = () => {
    const scrollY = window.scrollY;
    nav.classList.toggle('scrolled', scrollY > 60);
    backToTop.classList.toggle('visible', scrollY > 500);
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // ---------- Back to Top ----------
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---------- Mobile Navigation ----------
  const menuBtn = document.getElementById('menuBtn');
  const mobileNav = document.getElementById('mobileNav');
  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });

  // ---------- Smooth Anchor Scrolling (event delegation) ----------
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });

  // ---------- Active Nav Link Highlighting ----------
  const sections = document.querySelectorAll('section[id]');
  const highlightNav = () => {
    const scrollY = window.scrollY + 120;
    const navLinks = document.querySelectorAll('.nav-links a');
    sections.forEach(section => {
      const id = section.getAttribute('id');
      if (scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight) {
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--rose-gold)' : '';
        });
      }
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });

  // ---------- Parallax Background Blobs ----------
  const heroBgElements = document.querySelectorAll('.hero-bg-element');
  let ticking = false;
  const handleParallax = () => {
    if (window.__featureFlags && window.__featureFlags['parallax-bg'] === false) {
      heroBgElements.forEach(el => el.style.transform = '');
      return;
    }
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight * 1.5) {
        heroBgElements.forEach((el, i) => {
          el.style.transform = `translateY(${scrollY * (i + 1) * 0.12}px)`;
        });
      }
      ticking = false;
    });
  };
  window.addEventListener('scroll', handleParallax, { passive: true });

  // ---------- Portrait Parallax Tilt ----------
  const portraitFrame = document.querySelector('.portrait-frame');
  if (portraitFrame) {
    const hero = document.querySelector('.hero');
    hero.addEventListener('mousemove', (e) => {
      if (window.__featureFlags && window.__featureFlags['portrait-tilt'] === false) return;
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      portraitFrame.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    });
    hero.addEventListener('mouseleave', () => { portraitFrame.style.transform = ''; });
  }

  // ---------- Scroll Progress Bar ----------
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);
  const updateProgress = () => {
    const progress = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = progress + '%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });

  // ---------- Image Loading Priority ----------
  const portrait = document.querySelector('.portrait-img');
  if (portrait) portrait.loading = 'eager';
  document.querySelectorAll('img:not(.portrait-img)').forEach(img => img.loading = 'lazy');

});

// ---------- Global Functions ----------
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
}

function closeMobileNav() {
  document.getElementById('menuBtn').classList.remove('active');
  document.getElementById('mobileNav').classList.remove('open');
  document.body.style.overflow = '';
}
