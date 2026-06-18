/* ============================================
   ASTHA PATEL - Personal Brand Portfolio
   Interactive Behaviors & Animations
   ============================================ */

// Expose initializeAnimations globally so content-loader can call it
// after dynamic content is injected into the DOM.
window.initializeAnimations = function() {

  // ---------- Scroll Reveal with Stagger ----------
  const revealElements = document.querySelectorAll('.reveal:not(.observed)');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Animate capability bars if present inside revealed element
        const bars = entry.target.querySelectorAll('.cap-bar');
        bars.forEach((bar, i) => {
          setTimeout(() => bar.classList.add('animate'), 300 + i * 100);
        });

        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => {
    el.classList.add('observed');
    revealObserver.observe(el);
  });

  // ---------- Magnetic Hover on Cards ----------
  const cards = document.querySelectorAll('.value-card, .diff-card, .cap-item, .vision-pillar, .biz-highlight');

  cards.forEach(card => {
    // Avoid attaching duplicate listeners
    if (card.dataset.tiltBound) return;
    card.dataset.tiltBound = 'true';

    card.addEventListener('mousemove', (e) => {
      if (window.__featureFlags && window.__featureFlags['magnetic-hover'] === false) {
        return;
      }

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;

      // Spotlight glow
      const percentX = (x / rect.width) * 100;
      const percentY = (y / rect.height) * 100;
      card.style.setProperty('--spotlight-x', percentX + '%');
      card.style.setProperty('--spotlight-y', percentY + '%');
      card.classList.add('has-spotlight');
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.classList.remove('has-spotlight');
    });
  });

  // ---------- Capability Bar Animation ----------
  const capBars = document.querySelectorAll('.cap-bar:not(.bar-observed)');

  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('animate'), 200);
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  capBars.forEach(bar => {
    bar.classList.add('bar-observed');
    barObserver.observe(bar);
  });

  // ---------- Smooth Counter for Diff Numbers ----------
  const diffNumbers = document.querySelectorAll('.diff-number:not(.diff-observed)');
  const diffObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('count-in');
        diffObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  diffNumbers.forEach(num => {
    num.classList.add('diff-observed');
    diffObserver.observe(num);
  });

  // ---------- Text Split Animation for Section Titles ----------
  const animatedTitles = document.querySelectorAll('.section-title');
  animatedTitles.forEach(title => {
    const text = title.textContent;
    title.setAttribute('data-text', text);
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

    if (scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    if (scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
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

  // ---------- Smooth Anchor Scrolling ----------
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });

  // ---------- Active Nav Link Highlighting ----------
  const sections = document.querySelectorAll('section[id]');

  const highlightNav = () => {
    const scrollY = window.scrollY + 120;
    const navLinks = document.querySelectorAll('.nav-links a');

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = 'var(--rose-gold)';
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });

  // ---------- Parallax Background Elements ----------
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
          const speed = (i + 1) * 0.12;
          el.style.transform = `translateY(${scrollY * speed}px)`;
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
      if (window.__featureFlags && window.__featureFlags['portrait-tilt'] === false) {
        return;
      }

      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      portraitFrame.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    });

    hero.addEventListener('mouseleave', () => {
      portraitFrame.style.transform = '';
    });
  }

  // ---------- Horizontal Scroll Progress Indicator ----------
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = progress + '%';
  };

  window.addEventListener('scroll', updateProgress, { passive: true });

  // ---------- Page Load Performance ----------
  const portrait = document.querySelector('.portrait-img');
  if (portrait) {
    portrait.loading = 'eager';
  }

  const lazyImages = document.querySelectorAll('img:not(.portrait-img)');
  lazyImages.forEach(img => {
    img.loading = 'lazy';
  });

});

// ---------- Global Functions ----------
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    const offset = 80;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

function closeMobileNav() {
  const menuBtn = document.getElementById('menuBtn');
  const mobileNav = document.getElementById('mobileNav');
  menuBtn.classList.remove('active');
  mobileNav.classList.remove('open');
  document.body.style.overflow = '';
}
