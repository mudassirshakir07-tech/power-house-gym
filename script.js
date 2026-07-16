/* =========================================================
   THE BRIGHT SOULS SCHOOL — SCRIPT
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- nav scroll state ---------- */
  const nav = document.getElementById('siteNav');
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  const burger = document.getElementById('burgerBtn');
  const navLinks = document.getElementById('navLinks');
  burger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    })
  );

  /* ---------- smooth scroll for in-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- animated stat counters ---------- */
  const statNums = document.querySelectorAll('.stat__num');
  const animateCount = (el) => {
    const target = parseInt(el.dataset.target, 10) || 0;
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statNums.forEach(animateCount);
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.4 });
  const statsContainer = document.querySelector('.stats');
  if (statsContainer) statsObserver.observe(statsContainer);

  /* ---------- contact form (front-end only) ---------- */
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const label = btn.querySelector('.btn-label');
      const originalText = label.textContent;
      label.textContent = 'Sending...';
      btn.disabled = true;

      setTimeout(() => {
        label.textContent = originalText;
        btn.disabled = false;
        note.textContent = 'Thank you! Our admissions team will reach out soon, or call +92 300 1111690 directly.';
        form.reset();
        setTimeout(() => { note.textContent = ''; }, 6000);
      }, 900);
    });
  }

  /* ---------- marquee: duplicate track for seamless infinite loop ---------- */
  const track = document.getElementById('marqueeTrack');
  if (track) {
    track.innerHTML += track.innerHTML;
  }

  /* ---------- hero "bright souls" particle canvas ---------- */
  const canvas = document.getElementById('soulCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height, particles;
    const PARTICLE_COUNT = 70;

    function resize() {
      const hero = canvas.parentElement;
      width = canvas.width = hero.offsetWidth;
      height = canvas.height = hero.offsetHeight;
    }

    function createParticles() {
      particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.8 + 0.6,
        baseAlpha: Math.random() * 0.5 + 0.25,
        speedX: (Math.random() - 0.5) * 0.18,
        speedY: (Math.random() - 0.5) * 0.18,
        twinkleSpeed: Math.random() * 0.02 + 0.008,
        twinklePhase: Math.random() * Math.PI * 2
      }));
    }

    let mouseX = -9999, mouseY = -9999;
    canvas.parentElement.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });
    canvas.parentElement.addEventListener('mouseleave', () => {
      mouseX = -9999; mouseY = -9999;
    });

    function drawLink(p1, p2, alpha) {
      ctx.strokeStyle = `rgba(124,155,255,${alpha})`;
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    function tick(t) {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        // gentle drift toward cursor (soul drawn to light)
        const dx = mouseX - p.x, dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
          p.x += dx * 0.0025;
          p.y += dy * 0.0025;
        }

        // wrap around edges
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        const twinkle = Math.sin(t * p.twinkleSpeed + p.twinklePhase) * 0.5 + 0.5;
        const alpha = p.baseAlpha * (0.5 + twinkle * 0.5);

        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
        glow.addColorStop(0, `rgba(124,155,255,${alpha})`);
        glow.addColorStop(1, 'rgba(124,155,255,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(238,241,251,${alpha + 0.2})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // constellation links between nearby souls
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 110) {
            drawLink(a, b, (1 - d / 110) * 0.12);
          }
        }
      }

      requestAnimationFrame(tick);
    }

    resize();
    createParticles();
    requestAnimationFrame(tick);

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resize();
        createParticles();
      }, 200);
    });
  }

});
