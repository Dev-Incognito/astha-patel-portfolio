/* ============================================
   ASTHA PATEL - Personal Brand Portfolio
   Interactive Behaviors & Animations
   ============================================ */

// Expose initializeAnimations globally so content-loader can call it
// after dynamic content is injected into the DOM.
window.initializeAnimations = function() {

  const f = window.__featureFlags || {};

  // ---------- 1. Lenis Smooth Scroll ----------
  if (f['lenis-scroll'] !== false && typeof Lenis !== 'undefined' && !window._lenisInit) {
    window._lenisInit = true;
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }

  // ---------- 2. Custom Cursor ----------
  if (f['custom-cursor'] !== false && typeof kursor !== 'undefined' && !window._kursorInit) {
    window._kursorInit = true;
    new kursor({ type: 1, color: '#e94560' });
  }

  // ---------- 3. GSAP ScrollTrigger (Premium Reveal) ----------
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    document.querySelectorAll('.reveal:not(.gsap-observed)').forEach(el => {
      el.classList.add('gsap-observed');
      // Remove any CSS transitions so GSAP can take over smoothly
      el.style.transition = 'none';
      gsap.fromTo(el, 
        { y: 60, opacity: 0 },
        { 
          y: 0, opacity: 1, duration: 1.2, ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  } else {
    // Fallback Intersection Observer if GSAP fails to load
    const revealElements = document.querySelectorAll('.reveal:not(.observed)');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    revealElements.forEach(el => { el.classList.add('observed'); revealObserver.observe(el); });
  }

  // ---------- 5. Premium Typing Animation (TypeIt) ----------
  if (typeof TypeIt !== 'undefined' && !window._typeItInit) {
    const taglineEl = document.querySelector('.hero-tagline, .hero-cin-tagline-small, .hero-pro-tagline');
    if (taglineEl && taglineEl.textContent.trim().length > 0) {
      window._typeItInit = true;
      // Extract text and hide original
      const originalHTML = taglineEl.innerHTML;
      taglineEl.innerHTML = '';
      new TypeIt(taglineEl, {
        strings: originalHTML,
        speed: 50,
        html: true,
        cursor: false,
        waitUntilVisible: true
      }).go();
    }
  }

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

  // ---------- 4. Premium 3D Tilt Hover ----------
  if (typeof VanillaTilt !== 'undefined' && window.__featureFlags && window.__featureFlags['magnetic-hover'] !== false) {
    const tiltElements = document.querySelectorAll('.value-card:not(.tilt-applied), .diff-card:not(.tilt-applied), .cap-item:not(.tilt-applied), .vision-pillar:not(.tilt-applied), .biz-highlight:not(.tilt-applied), .hero-pro-img-wrap:not(.tilt-applied), .hero-art-portrait:not(.tilt-applied), .contact-avatar:not(.tilt-applied)');
    tiltElements.forEach(el => {
      el.classList.add('tilt-applied');
      VanillaTilt.init(el, {
        max: 12,
        speed: 400,
        glare: true,
        "max-glare": 0.2,
        scale: 1.02
      });
    });
  }

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
