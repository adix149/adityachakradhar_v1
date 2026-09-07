/**
 * ADITYACHAKRADHAR REDDY - CINEMATIC HORIZONTAL PORTFOLIO
 * High-Performance, Glitch-Free Gaussian Horizontal Scroll Engine
 * In-Place Company Detail Switcher & Dedicated Education Screen
 */

document.addEventListener('DOMContentLoaded', () => {
  initCosmicCanvas();
  initCursorSpotlight();
  initGlitchFreeScrollEngine();
  initNavigation();
  initMobileDrawer();
  initInlineExperienceCard();
  initContactModals();
  initDynamicCopyrightYear();
});

/* --------------------------------------------------------------------------
   1. COSMIC CANVAS (TWINKLING STARS & SHOOTING METEORS)
   -------------------------------------------------------------------------- */
function initCosmicCanvas() {
  const canvas = document.getElementById('stars-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const numStars = Math.min(220, Math.floor((width * height) / 6000));
  const stars = [];

  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height * 0.8,
      radius: Math.random() * 1.4 + 0.3,
      alpha: Math.random() * 0.8 + 0.2,
      alphaSpeed: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1)
    });
  }

  const meteors = [];
  function maybeSpawnMeteor() {
    if (meteors.length < 2 && Math.random() < 0.025) {
      meteors.push({
        x: Math.random() * width * 0.8 + width * 0.1,
        y: Math.random() * height * 0.3,
        length: Math.random() * 90 + 50,
        speed: Math.random() * 10 + 12,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
        opacity: 1
      });
    }
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Twinkling stars
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.alpha += s.alphaSpeed;
      if (s.alpha <= 0.15 || s.alpha >= 0.95) {
        s.alphaSpeed = -s.alphaSpeed;
      }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
      ctx.fill();
    }

    // Meteors
    maybeSpawnMeteor();
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      const endX = m.x - Math.cos(m.angle) * m.length;
      const endY = m.y - Math.sin(m.angle) * m.length;

      const grad = ctx.createLinearGradient(m.x, m.y, endX, endY);
      grad.addColorStop(0, `rgba(255, 255, 255, ${m.opacity})`);
      grad.addColorStop(0.4, `rgba(168, 85, 247, ${m.opacity * 0.8})`);
      grad.addColorStop(1, 'rgba(168, 85, 247, 0)');

      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.8;
      ctx.stroke();

      m.x += Math.cos(m.angle) * m.speed;
      m.y += Math.sin(m.angle) * m.speed;
      m.opacity -= 0.015;

      if (m.opacity <= 0 || m.x > width || m.y > height) {
        meteors.splice(i, 1);
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

/* --------------------------------------------------------------------------
   2. SUBTLE AMBIENT MOUSE SPOTLIGHT
   -------------------------------------------------------------------------- */
function initCursorSpotlight() {
  const glow = document.getElementById('cursor-glow');
  if (!glow || window.matchMedia('(hover: none)').matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let glowX = mouseX, glowY = mouseY;
  let isVisible = false;

  window.addEventListener('pointermove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isVisible) {
      isVisible = true;
      glow.classList.add('active');
    }
  });

  document.addEventListener('mouseleave', () => {
    isVisible = false;
    glow.classList.remove('active');
  });

  // Interactive element hover bloom
  const interactiveElements = 'a, button, input, textarea, select, .timeline-node, .selector-chip, .modal-channel-card, .edu-card, .cert-badge, [role="button"]';
  
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest && e.target.closest(interactiveElements)) {
      glow.classList.add('hovering');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest && e.target.closest(interactiveElements)) {
      glow.classList.remove('hovering');
    }
  });

  function renderCursor() {
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;
    glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(renderCursor);
  }

  requestAnimationFrame(renderCursor);
}

/* --------------------------------------------------------------------------
   3. GLITCH-FREE HORIZONTAL SCROLL ENGINE WITH GAUSSIAN TRANSITIONS
   -------------------------------------------------------------------------- */
const TOTAL_SLIDES = 5;
let currentSlideIndex = 0;
let isScrollLocked = false;
let scrollLockTimer = null;

function initGlitchFreeScrollEngine() {
  const track = document.getElementById('slider-track');
  const progressBar = document.getElementById('scroll-progress');

  // Initialize slide state based on URL hash or default to 0
  const initialHash = window.location.hash;
  let initialIndex = 0;
  if (initialHash) {
    const targetEl = document.querySelector(initialHash);
    if (targetEl && targetEl.getAttribute('data-index') !== null) {
      initialIndex = parseInt(targetEl.getAttribute('data-index'), 10);
    }
  }
  goToSlide(initialIndex, false);

  // Strictly eliminate any native browser scroll drift (e.g. from focus or hash events)
  window.addEventListener('scroll', () => {
    if (window.scrollX !== 0 || window.scrollY !== 0) {
      window.scrollTo(0, 0);
    }
  });

  // A. GUARANTEED VERTICAL & HORIZONTAL WHEEL SCROLL LISTENER (NO JITTER, NO GLITCH)
  window.addEventListener('wheel', (e) => {
    // If modal is open, let user scroll inside modal
    const modal = document.getElementById('detail-modal');
    if (modal && modal.classList.contains('open')) return;

    // If mobile drawer is open, let user interact with drawer
    const mobileDrawer = document.getElementById('mobile-nav-drawer');
    if (mobileDrawer && mobileDrawer.classList.contains('open')) return;

    // Check if the current slide is scrolling internally
    const activeSlide = document.querySelector('.slide.active-slide');
    if (activeSlide && activeSlide.scrollHeight > activeSlide.clientHeight) {
      const isAtBottom = activeSlide.scrollTop + activeSlide.clientHeight >= activeSlide.scrollHeight - 10;
      const isAtTop = activeSlide.scrollTop <= 5;
      if (e.deltaY > 0 && !isAtBottom) return;
      if (e.deltaY < 0 && !isAtTop) return;
    }

    e.preventDefault();

    // If already animating, ignore subsequent rapid wheel events to keep transition silky smooth
    if (isScrollLocked) return;

    // Dominant delta (vertical wheel or horizontal trackpad gesture)
    const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;

    // Filter out accidental tiny micro-twitches and inertia residue
    if (Math.abs(delta) < 16) return;

    // Engage scroll lock immediately
    isScrollLocked = true;

    if (delta > 0) {
      // Scrolling Down / Right -> Advance to Next Slide
      goToSlide(currentSlideIndex + 1);
    } else {
      // Scrolling Up / Left -> Go to Previous Slide
      goToSlide(currentSlideIndex - 1);
    }

    clearTimeout(scrollLockTimer);
    scrollLockTimer = setTimeout(() => {
      isScrollLocked = false;
    }, 780); // Synchronized to Gaussian transition
  }, { passive: false });

  // B. MOUSE DRAG / SWIPE TO SCROLL (DESKTOP & TABLET)
  let isMouseDown = false;
  let dragStartX = 0;

  window.addEventListener('mousedown', (e) => {
    if (e.target.closest('button, a, input, textarea, .timeline-node, .article-row, .now-card, .modal-card, .mobile-nav-panel')) {
      return;
    }
    isMouseDown = true;
    dragStartX = e.clientX;
  });

  window.addEventListener('mouseup', (e) => {
    if (!isMouseDown) return;
    isMouseDown = false;
    const diff = dragStartX - e.clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToSlide(currentSlideIndex + 1);
      } else {
        goToSlide(currentSlideIndex - 1);
      }
    }
  });

  // C. TOUCH SWIPE (MOBILE & TABLETS)
  let touchStartX = 0;
  let touchStartY = 0;

  window.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    // If modal or mobile drawer is open, let user interact with modal/drawer
    const modal = document.getElementById('detail-modal');
    if (modal && modal.classList.contains('open')) return;
    const mobileDrawer = document.getElementById('mobile-nav-drawer');
    if (mobileDrawer && mobileDrawer.classList.contains('open')) return;

    if (e.changedTouches.length === 1) {
      const diffX = touchStartX - e.changedTouches[0].clientX;
      const diffY = touchStartY - e.changedTouches[0].clientY;

      // Primary: Horizontal Swipe detection (Swipe Left = Next, Swipe Right = Prev)
      if (Math.abs(diffX) > 36 && Math.abs(diffX) > Math.abs(diffY) * 1.15) {
        if (diffX > 0) {
          goToSlide(currentSlideIndex + 1);
        } else {
          goToSlide(currentSlideIndex - 1);
        }
      } else if (currentSlideIndex === 0 && diffY > 48 && Math.abs(diffY) > Math.abs(diffX) * 1.25) {
        // On Hero slide, swiping upward advances to About slide
        goToSlide(1);
      }
    }
  }, { passive: true });

  // D. KEYBOARD ARROWS NAVIGATION
  window.addEventListener('keydown', (e) => {
    const modal = document.getElementById('detail-modal');
    if (modal && modal.classList.contains('open')) return;

    if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key)) {
      e.preventDefault();
      goToSlide(currentSlideIndex + 1);
    } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) {
      e.preventDefault();
      goToSlide(currentSlideIndex - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      goToSlide(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      goToSlide(TOTAL_SLIDES - 1);
    }
  });

  // Window Resize
  window.addEventListener('resize', () => {
    goToSlide(currentSlideIndex, false);
  });
}

/**
 * Smoothly translates the content track using pure Gaussian acceleration & deceleration
 * while keeping the sidebar and topbar perfectly constant and synchronized.
 */
function goToSlide(index, animate = true) {
  if (index < 0) index = 0;
  if (index >= TOTAL_SLIDES) index = TOTAL_SLIDES - 1;

  currentSlideIndex = index;

  // STRICT GUARANTEE: Reset any native browser window scroll offset
  window.scrollTo(0, 0);
  if (document.documentElement) {
    document.documentElement.scrollLeft = 0;
    document.documentElement.scrollTop = 0;
  }
  if (document.body) {
    document.body.scrollLeft = 0;
    document.body.scrollTop = 0;
  }

  const track = document.getElementById('slider-track');
  const progressBar = document.getElementById('scroll-progress');

  if (track) {
    if (!animate) {
      track.style.transition = 'none';
    } else {
      track.style.transition = 'transform 0.88s cubic-bezier(0.65, 0, 0.35, 1)';
    }

    // Apply GPU-accelerated horizontal transform (gliding content behind fixed bars)
    track.style.transform = `translate3d(${-currentSlideIndex * 100}vw, 0, 0)`;
  }

  // Update progress bar
  if (progressBar) {
    const pct = (currentSlideIndex / (TOTAL_SLIDES - 1)) * 100;
    progressBar.style.width = `${pct}%`;
  }

  // Synchronize Top Navbar, Mobile Drawer & Active Slide State
  updateNavStates(currentSlideIndex);

  // Update active slide class for cinematic backdrop breath
  document.querySelectorAll('.slide').forEach((slideEl, idx) => {
    slideEl.classList.toggle('active-slide', idx === currentSlideIndex);
    if (idx !== currentSlideIndex) {
      slideEl.scrollTop = 0;
    }
  });
}

/* --------------------------------------------------------------------------
   4. NAVIGATION CONTROLS & SYNCHRONIZED TOP BAR HIGHLIGHTS
   -------------------------------------------------------------------------- */
function initNavigation() {
  // Top Navbar Links Click (Bypass any scroll locks immediately)
  document.querySelectorAll('.menu-link[data-slide]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      isScrollLocked = false;
      clearTimeout(scrollLockTimer);
      const targetIdx = parseInt(link.getAttribute('data-slide'), 10);
      goToSlide(targetIdx);
    });
  });

  // Mobile Bottom Slide Dots Click
  document.querySelectorAll('.mobile-slide-dot[data-slide]').forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      isScrollLocked = false;
      clearTimeout(scrollLockTimer);
      const targetIdx = parseInt(dot.getAttribute('data-slide'), 10);
      goToSlide(targetIdx);
    });
  });

  // Hero Scroll Prompt Button
  const heroScrollBtn = document.getElementById('hero-scroll-btn');
  if (heroScrollBtn) {
    heroScrollBtn.addEventListener('click', (e) => {
      e.preventDefault();
      isScrollLocked = false;
      clearTimeout(scrollLockTimer);
      goToSlide(1); // 01 About
    });
  }

  // Brand click goes to slide 0 (Hero)
  const brand = document.querySelector('.nav-brand');
  if (brand) {
    brand.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      isScrollLocked = false;
      clearTimeout(scrollLockTimer);
      goToSlide(0);
    });
  }
}

/**
 * Mobile Navigation Drawer Controls
 */
function initMobileDrawer() {
  const drawer = document.getElementById('mobile-nav-drawer');
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const closeBtn = document.getElementById('mobile-nav-close');
  const backdrop = document.getElementById('mobile-nav-backdrop');
  if (!drawer || !toggleBtn) return;

  function openDrawer() {
    drawer.classList.add('open');
    toggleBtn.classList.add('active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    toggleBtn.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (drawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  closeBtn?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // Drawer menu items navigation
  document.querySelectorAll('.mobile-menu-item[data-slide]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetIdx = parseInt(item.getAttribute('data-slide'), 10);
      goToSlide(targetIdx);
      closeDrawer();
    });
  });

}

/**
 * Synchronizes Top Navigation links, mobile drawer links, and bottom dots to active slide
 */
function updateNavStates(index) {
  // Desktop Top Nav links
  document.querySelectorAll('.menu-link[data-slide]').forEach(link => {
    const targetIdx = parseInt(link.getAttribute('data-slide'), 10);
    link.classList.toggle('active', targetIdx === index);
  });

  // Mobile Drawer Links
  document.querySelectorAll('.mobile-menu-item[data-slide]').forEach(link => {
    const targetIdx = parseInt(link.getAttribute('data-slide'), 10);
    link.classList.toggle('active', targetIdx === index);
  });

  // Mobile Floating Bottom Slide Dots
  document.querySelectorAll('.mobile-slide-dot[data-slide]').forEach(dot => {
    const targetIdx = parseInt(dot.getAttribute('data-slide'), 10);
    dot.classList.toggle('active', targetIdx === index);
  });
}

/* --------------------------------------------------------------------------
   5. IN-PLACE COMPANY DETAIL SWITCHER (VISIBLE BY DEFAULT, NO MODAL)
   -------------------------------------------------------------------------- */
const companyData = {
  aruba: {
    company: 'Aruba Networks',
    role: 'Software Engineering Intern',
    period: '2011 – 2012 · Bangalore, India',
    tag: 'Enterprise Networking · Wi-Fi & Switching',
    logoHtml: `<div class="card-logo-mini logo-aruba"><span>aruba</span></div>`,
    highlights: [
      'Built strong early foundation in enterprise networking, wireless access points, and controller software during undergraduate studies at BITS Pilani.',
      'Contributed to network protocol validation, packet processing diagnostics, and multi-tier embedded software testing.'
    ],
    skills: ['Wi-Fi 802.11', 'Enterprise Switching', 'Packet Processing', 'Embedded Linux', 'C / C++']
  },
  samsung: {
    company: 'Samsung Research India (SISO)',
    role: 'Software Engineer',
    period: 'Jul 2012 – Aug 2013 · Bangalore, India',
    tag: 'Modem Firmware · 3GPP Protocols',
    logoHtml: `<div class="card-logo-mini logo-samsung"><span>SAMSUNG</span></div>`,
    highlights: [
      'Part of the telecom software team commercializing 3GPP Modem Protocols for Universal Integrated Circuit Card (UICC / SIM Card) interoperability.',
      'Implemented, optimized, and debugged low-level embedded C protocol stacks under strict memory limits and real-time execution constraints.'
    ],
    skills: ['3GPP Protocol Stacks', 'UICC / SIM Interoperability', 'Embedded C', 'Real-Time OS', 'Firmware']
  },
  intel: {
    company: 'Intel Technology India',
    role: 'Graphics Hardware Engineer',
    period: 'Aug 2013 – Jul 2015 · Bangalore, India',
    tag: 'Hardware Validation · Intel HD Graphics',
    logoHtml: `<div class="card-logo-mini logo-intel"><span>intel</span></div>`,
    highlights: [
      'Demonstrated end-to-end technical ownership of Clipper Unit validation within the Fixed Function 3D pipeline of Intel HD Graphics.',
      'Delivered 100% bug-free verification code post design freeze, recognized with the prestigious Intel Department Recognition Award.'
    ],
    skills: ['Intel HD Graphics', '3D Graphics Pipeline', 'Clipper Unit', 'Hardware Validation', 'SystemVerilog / C++']
  },
  xilinx: {
    company: 'Xilinx India Technologies (now AMD)',
    role: 'Senior Software Engineer II',
    period: 'Aug 2015 – Jun 2021 · Hyderabad, India',
    tag: 'Compilers & EDA Tools · FPGA Systems',
    logoHtml: `<div class="card-logo-mini logo-xilinx"><span>X</span></div>`,
    highlights: [
      'Owned the core SystemVerilog to C++ Trans-Compiler, a critical engine within the Vivado SW toolset enabling engineers worldwide to synthesize and program Xilinx FPGAs.',
      'Significantly optimized the Xilinx TimeCap compiler for Static Timing Analysis (STA), achieving a 50% compile-time speedup and a 2X memory reduction.',
      'Engineered advanced Bitstream Verification tools using data-centric methodologies, delivering a 5X acceleration over traditional simulation runs.'
    ],
    skills: ['Trans-Compiler Engineering', 'Vivado EDA Toolset', 'Static Timing Analysis (STA)', 'High-Performance C++', 'FPGA Architecture']
  },
  microsoft: {
    company: 'Microsoft India (R&D)',
    role: 'Senior Software Engineer (Bing.com)',
    period: 'Jun 2021 – Aug 2024 · Hyderabad, India',
    tag: 'Hyperscale Pipelines · 1M+ DAU Impact',
    logoHtml: `<div class="card-logo-mini logo-microsoft"><div class="ms-grid"><span class="ms-r"></span><span class="ms-g"></span><span class="ms-b"></span><span class="ms-y"></span></div></div>`,
    highlights: [
      'Core member of the Bing.com search engineering team, developing critical search ecosystems for technology products and global application downloads.',
      'Architected and deployed the unified multi-store data pipeline aggregating app metadata across Windows Store, Google Play, and Apple App Store — scaling ingestion volume by 1000x with real-time automated refresh cycles.',
      'Directly drove pipeline scaling into 1 million new Daily Active Users (DAU), while mentoring and leading junior engineers through architectural reviews.'
    ],
    skills: ['Hyperscale Big Data', 'Unified Ingestion Pipelines', 'Bing.com Search Engine', '1M+ DAU Scalability', 'Distributed Data Streams']
  },
  salesforce: {
    company: 'Salesforce India',
    role: 'Lead Member of Technical Staff (LMTS)',
    period: 'Aug 2024 · Hyderabad, India',
    tag: 'Real-Time Services · Enterprise Messaging',
    logoHtml: `<div class="card-logo-mini logo-salesforce"><span>salesforce</span></div>`,
    highlights: [
      'Architected and implemented enterprise integration services enabling global customers to bridge custom conversational bots seamlessly with Salesforce Service Cloud.',
      'Guaranteed bidirectional real-time message routing, ultra-high throughput, and robust fault-isolation boundaries for mission-critical enterprise workflows.'
    ],
    skills: ['Service Cloud Integration', 'Real-Time Messaging', 'Conversational AI Bots', 'Enterprise Microservices', 'Fault Tolerance']
  },
  google: {
    company: 'Google',
    role: 'Senior Software Engineer',
    period: '2024 – Present · Hyderabad, India',
    tag: 'Current Role · Tools, Software & Big Data Pipelines',
    logoHtml: `<div class="card-logo-mini logo-google"><svg viewBox="0 0 24 24" width="22" height="22"><path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/><path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/></svg></div>`,
    highlights: [
      'Engineered high-impact internal tools and developer software that support Googlers worldwide, accelerating core engineering velocity and operational workflows.',
      'Architected and scaled massive, mission-critical data-driven pipelines processing complex organizational datasets to power executive and strategic decisions.',
      'Designed resilient, low-latency distributed systems with comprehensive telemetry, deterministic data consistency, and high-availability SLAs.'
    ],
    skills: ['Internal Googler Tools', 'Hyperscale Data Pipelines', 'Critical Decision Intelligence', 'Distributed Systems', 'Enterprise Software', 'High Availability']
  }
};

/**
 * Updates the in-place experience card and highlights corresponding timeline node & chip
 */
function selectCompany(key) {
  const data = companyData[key];
  if (!data) return;

  // Update active chip
  document.querySelectorAll('.selector-chip').forEach(chip => {
    chip.classList.toggle('active', chip.getAttribute('data-target') === key);
  });

  // Update active timeline node
  document.querySelectorAll('.timeline-node[data-company]').forEach(node => {
    node.classList.toggle('active-node', node.getAttribute('data-company') === key);
  });

  // Animate card content transition
  const card = document.getElementById('inline-experience-card');
  const tagEl = document.getElementById('exp-card-tag');
  const periodEl = document.getElementById('exp-card-period');
  const companyEl = document.getElementById('exp-card-company');
  const roleEl = document.getElementById('exp-card-role');
  const logoContainer = document.getElementById('exp-card-logo-container');
  const highlightsEl = document.getElementById('exp-card-highlights');
  const skillsEl = document.getElementById('exp-card-skills');

  if (card) {
    card.style.opacity = '0.4';
    card.style.transform = 'translateY(4px)';

    setTimeout(() => {
      if (tagEl) tagEl.textContent = data.tag;
      if (periodEl) periodEl.textContent = data.period;
      if (companyEl) companyEl.textContent = data.company;
      if (roleEl) roleEl.textContent = data.role;
      if (logoContainer && data.logoHtml) logoContainer.innerHTML = data.logoHtml;
      if (highlightsEl) {
        highlightsEl.innerHTML = data.highlights.map(item => `<li>${item}</li>`).join('');
      }
      if (skillsEl && data.skills) {
        skillsEl.innerHTML = data.skills.map(s => `<span class="card-skill-pill">${s}</span>`).join('');
      }

      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 140);
  }
}

function initInlineExperienceCard() {
  // Timeline nodes click -> update in-place card
  document.querySelectorAll('.timeline-node[data-company]').forEach(node => {
    node.addEventListener('click', () => {
      const key = node.getAttribute('data-company');
      selectCompany(key);
    });
  });

  // Selector chips click -> update in-place card
  document.querySelectorAll('.selector-chip[data-target]').forEach(chip => {
    chip.addEventListener('click', () => {
      const key = chip.getAttribute('data-target');
      selectCompany(key);
    });
  });
}

/* --------------------------------------------------------------------------
   6. CONTACT MODAL & COPY UTILITIES
   -------------------------------------------------------------------------- */
function initContactModals() {
  const sayHelloBtn = document.getElementById('open-contact-dialog-btn');
  const modal = document.getElementById('detail-modal');
  const modalArea = document.getElementById('modal-content-area');
  const closeBtn = document.getElementById('modal-close-btn');

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeModal();
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeModal();
    }
  });

  if (sayHelloBtn && modal && modalArea) {
    sayHelloBtn.addEventListener('click', () => {
      modalArea.innerHTML = `
        <div class="modal-header-badge">
          <span>●</span> <span>Direct Connect</span>
        </div>
        <h2 class="modal-header-title">Get In Touch</h2>
        <p class="modal-header-desc">Always happy to connect with curious engineers, leaders, and thinkers. Choose your preferred channel below:</p>
        
        <div class="modal-channels-list">
          <!-- Email -->
          <a href="mailto:" class="modal-channel-card" title="Send Email">
            <div class="channel-main">
              <div class="channel-icon-circle icon-email">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div class="channel-info">
                <span class="channel-name">Email</span>
                <span class="channel-value"></span>
              </div>
            </div>
            <span class="channel-action-badge">Email Me &rarr;</span>
          </a>

          <!-- LinkedIn -->
          <a href="https://www.linkedin.com/in/adityachakradharreddy/" target="_blank" rel="noopener noreferrer" class="modal-channel-card" title="LinkedIn Profile">
            <div class="channel-main">
              <div class="channel-icon-circle icon-linkedin">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </div>
              <div class="channel-info">
                <span class="channel-name">LinkedIn</span>
                <span class="channel-value">linkedin.com/in/adityachakradharreddy</span>
              </div>
            </div>
            <span class="channel-action-badge">Open Profile &rarr;</span>
          </a>

          <!-- GitHub -->
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer" class="modal-channel-card" title="GitHub Profile">
            <div class="channel-main">
              <div class="channel-icon-circle icon-github">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </div>
              <div class="channel-info">
                <span class="channel-name">GitHub</span>
                <span class="channel-value">github.com/</span>
              </div>
            </div>
            <span class="channel-action-badge">Open GitHub &rarr;</span>
          </a>

          <!-- Phone -->
          <div class="modal-channel-card" onclick="copyText('', 'Phone number copied to clipboard!')" title="Click to copy phone number">
            <div class="channel-main">
              <div class="channel-icon-circle icon-phone">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.4-1.1-.6-2.3-.6-3.5 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1zM5 5h1.5c.2.8.4 1.5.7 2.2l-1.1 1.1C5.5 7.1 5.2 6.1 5 5zm14 14c-1.1-.2-2.1-.5-3.1-.9l1.1-1.1c.7.3 1.4.5 2 .7V19z"/>
                </svg>
              </div>
              <div class="channel-info">
                <span class="channel-name">Direct Line / WhatsApp</span>
                <span class="channel-value"></span>
              </div>
            </div>
            <span class="channel-action-badge" style="color: var(--accent-purple); background: rgba(168, 85, 247, 0.12); border-color: rgba(168, 85, 247, 0.3);">Copy Number 📋</span>
          </div>
        </div>
      `;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    });
  }
}

window.copyText = function(text, successMsg = 'Copied to clipboard!') {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(
      () => showToast(successMsg),
      () => fallbackCopy(text, successMsg)
    );
  } else {
    fallbackCopy(text, successMsg);
  }
};

function fallbackCopy(text, successMsg) {
  const input = document.createElement('input');
  input.value = text;
  document.body.appendChild(input);
  input.select();
  try {
    document.execCommand('copy');
    showToast(successMsg);
  } catch (err) {
    showToast('Failed to copy');
  }
  document.body.removeChild(input);
}

function showToast(msg) {
  const box = document.getElementById('toast-box');
  if (!box) return;

  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  toast.textContent = msg;
  box.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s ease';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

/* --------------------------------------------------------------------------
   7. DYNAMIC COPYRIGHT YEAR
   -------------------------------------------------------------------------- */
function initDynamicCopyrightYear() {
  const yearElement = document.getElementById('copyright-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}
