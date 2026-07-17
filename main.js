/* BarbieSPA — animations */
gsap.registerPlugin(ScrollTrigger);

const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

document.fonts.ready.then(() => {
  gsap.to('body', { opacity: 1, duration: 0.01 });
  heroEntrance();
  ambientGlows();
  if (!isTouch) cursorParallax();
  scrollReveals();
  headerScroll();
  mobileMenu();
  ScrollTrigger.refresh();
});

/* ── HERO ────────────────────────────────────────────── */
function heroEntrance() {
  const title = document.querySelector('.hero-title');
  const lines = wrapLines(title);

  gsap.timeline({ defaults: { ease: 'expo.out' } })
    .from('.logo',        { opacity: 0, y: -12, duration: 0.6 })
    .from('.eyebrow-line',{ scaleX: 0, transformOrigin: 'left', duration: 0.5 }, '-=0.2')
    .from('.hero-eyebrow',{ opacity: 0, x: -20, duration: 0.5 }, '<+0.1')
    .from(lines, {
      yPercent: 105, opacity: 0,
      duration: isTouch ? 0.85 : 1.05,
      stagger: 0.12,
    }, '-=0.15')
    .from('.hero-cta', {
      opacity: 0, y: 18, scale: 0.96,
      duration: 0.7, ease: 'back.out(1.5)',
    }, '-=0.45')
    .from('.hero-deco-ring', { opacity: 0, scale: 0.7, stagger: 0.15, duration: 1.0, ease: 'expo.out' }, '-=0.8')
    .from('.hero-deco-line', { opacity: 0, scaleX: 0, duration: 0.7, ease: 'expo.out' }, '-=0.5')
    .from('.hero-scroll', { opacity: 0, duration: 0.5 }, '-=0.2');
}

function wrapLines(el) {
  const parts = el.innerHTML.split(/<br\s*\/?>/i).filter(p => p.trim());
  el.innerHTML = parts.map(p =>
    `<span class="title-line-wrap"><span class="title-line-inner">${p}</span></span>`
  ).join('');
  return el.querySelectorAll('.title-line-inner');
}

/* ── GLOWS ───────────────────────────────────────────── */
function ambientGlows() {
  gsap.to('.hero-glow--1', {
    x: 60, y: 40, scale: 1.1,
    duration: 10, repeat: -1, yoyo: true, ease: 'sine.inOut',
  });
  gsap.to('.hero-glow--2', {
    x: -40, y: -20, scale: 1.15,
    duration: 13, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 3,
  });
}

/* ── CURSOR PARALLAX (desktop) ───────────────────────── */
function cursorParallax() {
  const hero = document.querySelector('.hero');
  const left = document.querySelector('.hero-left');
  let tx = 0, ty = 0, cx = 0, cy = 0;

  hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width  - 0.5) * 16;
    ty = ((e.clientY - r.top)  / r.height - 0.5) * 10;
  });

  gsap.ticker.add(() => {
    cx += (tx - cx) * 0.055;
    cy += (ty - cy) * 0.055;
    if (left) gsap.set(left, { x: cx * 0.4, y: cy * 0.4 });
    gsap.set('.hero-glow--1', { x: -cx * 1.2 + 0, y: -cy * 1.2 });
  });
}

/* ── SCROLL REVEALS ──────────────────────────────────── */
function scrollReveals() {
  const start = isTouch ? 'top 93%' : 'top 86%';

  // Manifesto label
  gsap.from('.manifesto-label', {
    opacity: 0, x: -20, duration: 0.7, ease: 'expo.out',
    scrollTrigger: { trigger: '.manifesto', start, once: true },
  });

  // Manifesto quote lines
  const q = document.querySelector('.manifesto-text');
  if (q) {
    const qLines = wrapLines(q);
    gsap.from(qLines, {
      yPercent: 110, opacity: 0,
      duration: 0.95, stagger: 0.11, ease: 'expo.out',
      scrollTrigger: { trigger: '.manifesto', start, once: true },
    });
  }

  gsap.from('.manifesto-sub', {
    opacity: 0, y: 20, duration: 0.8, ease: 'expo.out',
    scrollTrigger: { trigger: '.manifesto-sub', start, once: true },
  });

  // Quality items
  gsap.from('.quality', {
    opacity: 0, y: 36,
    duration: 0.75, stagger: { amount: 0.4 }, ease: 'expo.out',
    scrollTrigger: { trigger: '.qualities', start, once: true },
  });

  gsap.from('.quality-num', {
    opacity: 0, scale: 0.6,
    duration: 0.6, stagger: { amount: 0.35 }, ease: 'back.out(1.4)',
    scrollTrigger: { trigger: '.qualities', start, once: true },
  });

  // Contact
  gsap.from('.contact-eyebrow', {
    opacity: 0, x: -24, duration: 0.7, ease: 'expo.out',
    scrollTrigger: { trigger: '.contact', start, once: true },
  });

  const tel = document.querySelector('.contact-tel');
  if (tel) {
    gsap.from(tel, {
      opacity: 0, y: 40, duration: 1, ease: 'expo.out',
      scrollTrigger: { trigger: '.contact', start, once: true },
    });
  }

  gsap.from('.contact-meta', {
    opacity: 0, duration: 0.7, delay: 0.3, ease: 'expo.out',
    scrollTrigger: { trigger: '.contact', start, once: true },
  });

  // Footer
  gsap.from('.footer-inner > *', {
    opacity: 0, y: 12,
    duration: 0.55, stagger: 0.09, ease: 'expo.out',
    scrollTrigger: { trigger: '.site-footer', start: 'top 98%', once: true },
  });
}

/* ── HEADER ──────────────────────────────────────────── */
function headerScroll() {
  const h = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    h.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

/* ── MOBILE MENU ─────────────────────────────────────── */
function mobileMenu() {
  const burger  = document.querySelector('.burger');
  const navList = document.querySelector('.nav-list');

  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!open));
    navList.classList.toggle('open', !open);
    document.body.style.overflow = !open ? 'hidden' : '';
    if (!open) {
      gsap.from(navList.querySelectorAll('li'), {
        opacity: 0, y: 16, duration: 0.4, stagger: 0.08, ease: 'expo.out',
      });
    }
  });

  navList.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      burger.setAttribute('aria-expanded', 'false');
      navList.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}
