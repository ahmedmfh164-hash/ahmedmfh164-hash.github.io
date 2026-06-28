document.addEventListener('DOMContentLoaded', () => {
  // ---------- Starfield ----------
  const canvas = document.getElementById('starfield');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let stars = [];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const count = Math.floor((canvas.width * canvas.height) / 9000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.4 + 0.3,
        a: Math.random() * 0.6 + 0.25,
        tw: Math.random() * 0.015 + 0.003,
        dir: Math.random() > 0.5 ? 1 : -1,
      }));
    }
    resize();
    window.addEventListener('resize', resize);

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff';
      for (const s of stars) {
        if (!reduceMotion) {
          s.a += s.tw * s.dir;
          if (s.a > 0.9 || s.a < 0.15) s.dir *= -1;
        }
        ctx.globalAlpha = s.a;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!reduceMotion) requestAnimationFrame(draw);
    }
    draw();
  }

  // ---------- Scroll reveal ----------
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => io.observe(el));

  // ---------- Nav scroll shadow ----------
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---------- Back to top ----------
  const topBtn = document.createElement('button');
  topBtn.className = 'back-to-top';
  topBtn.setAttribute('aria-label', 'Back to top');
  topBtn.innerHTML = '↑';
  topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.body.appendChild(topBtn);
  const onScrollTop = () => topBtn.classList.toggle('visible', window.scrollY > 420);
  onScrollTop();
  window.addEventListener('scroll', onScrollTop, { passive: true });

  // ---------- Typing effect (hero role line) ----------
  const typed = document.querySelector('.hero-typed[data-roles]');
  if (typed) {
    const roles = JSON.parse(typed.getAttribute('data-roles'));
    const reduceMotionType = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotionType) {
      typed.textContent = roles[0];
    } else {
      let roleIndex = 0, charIndex = 0, deleting = false;
      function tick() {
        const current = roles[roleIndex];
        if (!deleting) {
          charIndex++;
          typed.textContent = current.slice(0, charIndex);
          if (charIndex === current.length) {
            deleting = true;
            setTimeout(tick, 1400);
            return;
          }
          setTimeout(tick, 55);
        } else {
          charIndex--;
          typed.textContent = current.slice(0, charIndex);
          if (charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(tick, 300);
            return;
          }
          setTimeout(tick, 28);
        }
      }
      tick();
    }
  }
});
