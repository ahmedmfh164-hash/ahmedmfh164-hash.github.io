document.addEventListener('DOMContentLoaded', () => {
  // Scroll reveal
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

  // Nav scroll shadow
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Back to top
  const topBtn = document.createElement('button');
  topBtn.className = 'back-to-top';
  topBtn.setAttribute('aria-label', 'Back to top');
  topBtn.innerHTML = '↑';
  topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.body.appendChild(topBtn);
  const onScrollTop = () => topBtn.classList.toggle('visible', window.scrollY > 420);
  onScrollTop();
  window.addEventListener('scroll', onScrollTop, { passive: true });

  // Terminal typing effect (hero only)
  const term = document.querySelector('.term-body[data-typed]');
  if (term) {
    const lines = JSON.parse(term.getAttribute('data-typed'));
    term.innerHTML = '';
    let lineIndex = 0;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function renderStatic() {
      term.innerHTML = lines.map(l => l.html).join('');
    }

    if (reduceMotion) {
      renderStatic();
      return;
    }

    function typeLine() {
      if (lineIndex >= lines.length) return;
      const line = lines[lineIndex];
      const row = document.createElement('div');
      row.className = 'term-line';
      term.appendChild(row);

      if (line.type === 'cmd') {
        const prompt = document.createElement('span');
        prompt.className = 'term-prompt';
        prompt.textContent = '$';
        const cmdSpan = document.createElement('span');
        cmdSpan.className = 'term-cmd';
        row.appendChild(prompt);
        row.appendChild(cmdSpan);
        let i = 0;
        const text = line.text;
        const speed = 32;
        function typeChar() {
          if (i <= text.length) {
            cmdSpan.textContent = text.slice(0, i);
            i++;
            setTimeout(typeChar, speed);
          } else {
            lineIndex++;
            setTimeout(typeLine, 220);
          }
        }
        typeChar();
      } else {
        row.outerHTML = line.html;
        lineIndex++;
        setTimeout(typeLine, 80);
      }
    }
    typeLine();
  }
});
