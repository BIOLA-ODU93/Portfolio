/**
 * Case-study motion: scroll progress for the cinematic opening and the pinned
 * key-decisions scene, reveal-on-scroll, a live countdown, tilting phones and
 * counting results. Everything degrades to a static page under reduced motion.
 */
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

export function initCaseStudy() {
  const root = document.querySelector<HTMLElement>('[data-cs]');
  if (!root) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const narrow = window.matchMedia('(max-width: 900px)');

  // ── reveal on scroll (and draw the site map lines)
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -12% 0px' });
  root.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));

  // ── scroll-driven scenes
  const intro = root.querySelector<HTMLElement>('[data-cs-intro]');
  const bar = document.querySelector<HTMLElement>('[data-cs-bar]');
  const dec = root.querySelector<HTMLElement>('[data-cs-decisions]');
  const steps = dec ? Array.from(dec.querySelectorAll<HTMLElement>('[data-step]')) : [];
  const layers = dec ? Array.from(dec.querySelectorAll<HTMLElement>('[data-layer]')) : [];
  const dots = dec ? Array.from(dec.querySelectorAll<HTMLElement>('[data-dot]')) : [];
  const screen = dec?.querySelector<HTMLElement>('[data-screen]');
  const progress = (el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    const span = r.height - window.innerHeight;
    return span > 0 ? clamp(-r.top / span) : 0;
  };
  let active = -1;
  const setActive = (i: number) => {
    if (i === active) return;
    active = i;
    steps.forEach((s, k) => s.classList.toggle('is-on', k === i));
    layers.forEach((l, k) => l.classList.toggle('is-on', k === i));
    dots.forEach((d, k) => d.classList.toggle('is-on', k === i));
  };
  const sizeScreen = () => screen && screen.style.setProperty('--fh', `${screen.clientHeight}px`);

  let ticking = false;
  const update = () => {
    ticking = false;
    if (intro) {
      const p = progress(intro);
      intro.style.setProperty('--p', p.toFixed(4));
      bar?.classList.toggle('is-hidden', p < 0.55);
    }
    if (dec && steps.length && !narrow.matches) {
      // the first viewport-height settles the scene; then one viewport per decision
      const p = progress(dec) * steps.length;
      const i = Math.min(steps.length - 1, Math.floor(p));
      setActive(i);
      layers.forEach((l, k) => {
        const t = k < i ? 1 : k > i ? 0 : smooth(clamp((p - i) / 0.75));
        l.style.setProperty('--t', t.toFixed(4));
      });
    }
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };

  if (reduce) {
    steps.forEach((s) => s.classList.add('is-on'));
  } else {
    sizeScreen();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => { sizeScreen(); onScroll(); });
    narrow.addEventListener('change', () => { steps.forEach((s) => s.classList.toggle('is-on', narrow.matches)); active = -1; onScroll(); });
    if (narrow.matches) steps.forEach((s) => s.classList.add('is-on'));
    update();
  }

  // ── live countdowns to the real event (same date as the live site)
  const counters = Array.from(root.querySelectorAll<HTMLElement>('[data-live-count]'));
  if (counters.length) {
    const pad = (n: number) => String(n).padStart(2, '0');
    const draw = () => {
      for (const el of counters) {
        const left = Math.floor((Date.parse(el.dataset.liveCount!) - Date.now()) / 1000);
        if (left <= 0) { el.textContent = el.dataset.fallback ?? ''; continue; }
        const d = Math.floor(left / 86400), h = Math.floor((left % 86400) / 3600), m = Math.floor((left % 3600) / 60), sec = left % 60;
        el.textContent = `${d} DAYS : ${pad(h)} HRS : ${pad(m)} MIN : ${pad(sec)} SEC`;
      }
    };
    draw();
    window.setInterval(draw, 1000);
  }

  // ── the hero video: play only while it can be seen; stay still for reduced motion
  const video = root.querySelector<HTMLVideoElement>('.pv__video');
  if (video) {
    // started from here rather than with `autoplay`: Chrome pauses autoplaying muted video it thinks is hidden,
    // and it misjudges this one inside the pinned, resizing frame
    video.muted = true; // the attribute alone isn't always honoured, and only muted video may start on its own
    if (reduce) video.pause();
    else {
      // watch the whole opening (the video's own box changes size as the frame shrinks)
      let seen = true;
      const sync = () => (seen && document.visibilityState === 'visible' ? video.play().catch(() => {}) : video.pause());
      new IntersectionObserver(([e]) => { seen = e.isIntersecting; sync(); }).observe(intro ?? video);
      document.addEventListener('visibilitychange', sync);
    }
  }

  // ── lineup cards flip to show a bio; the first time the lineup step appears, one card flips by itself as a hint
  const setFlip = (card: HTMLElement, on: boolean) => {
    card.classList.toggle('is-flipped', on);
    const b = card.querySelector<HTMLButtonElement>('[data-flip]');
    const name = card.querySelector('.mc__name')?.textContent ?? '';
    b?.setAttribute('aria-expanded', String(on));
    b?.setAttribute('aria-label', `${on ? 'Hide' : 'Show'} ${name}'s bio`);
    card.querySelector('.mc__back')?.setAttribute('aria-hidden', String(!on));
  };
  let touched = false;
  root.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-flip]');
    if (!b) return;
    touched = true;
    const card = b.closest<HTMLElement>('[data-card]')!;
    setFlip(card, !card.classList.contains('is-flipped'));
  });
  const hint = (lineup: HTMLElement) => {
    if (reduce || touched) return;
    const first = lineup.querySelector<HTMLElement>('.mc__col--up [data-card]');
    if (!first) return;
    window.setTimeout(() => { if (!touched) setFlip(first, true); }, 1500);
    window.setTimeout(() => { if (!touched) setFlip(first, false); }, 4000);
  };
  // the entrance: cards slide into their places, staggered (delays are set per card in the markup)
  const showCards = (lineup: HTMLElement, on: boolean) =>
    lineup.querySelectorAll<HTMLElement>('[data-card]').forEach((c) => c.classList.toggle('is-shown', on));
  const lineupLayer = layers.find((l) => l.querySelector('[data-lineup]'));
  let hinted = false, hideTimer = 0;
  if (lineupLayer) {
    const lu = lineupLayer.querySelector<HTMLElement>('[data-lineup]')!;
    // replays every time the lineup step comes back into view
    new MutationObserver(() => {
      const on = lineupLayer.classList.contains('is-on');
      window.clearTimeout(hideTimer);
      if (on) {
        // start just after the screen has begun fading in, so the whole slide is visible
        hideTimer = window.setTimeout(() => showCards(lu, true), 220);
        if (!hinted) { hinted = true; hint(lu); }
      } else {
        hideTimer = window.setTimeout(() => { showCards(lu, false); lu.querySelectorAll<HTMLElement>('[data-card]').forEach((c) => setFlip(c, false)); }, 650);
      }
    }).observe(lineupLayer, { attributes: true, attributeFilter: ['class'] });
  }
  // phones / narrow screens: the inline copy plays its entrance when it scrolls into view
  root.querySelectorAll<HTMLElement>('.cs-step__demo [data-lineup]').forEach((el) =>
    new IntersectionObserver(([e], o) => {
      if (!e.isIntersecting || !narrow.matches) return;
      o.disconnect();
      showCards(el, true);
      hint(el);
    }, { threshold: 0.35 }).observe(el));
  if (reduce) root.querySelectorAll<HTMLElement>('[data-lineup]').forEach((el) => showCards(el, true));

  // ── statements that light up word by word as they scroll through the screen
  const statements = Array.from(root.querySelectorAll<HTMLElement>('[data-words]')).map((el) => ({ el, words: Array.from(el.querySelectorAll<HTMLElement>('.w')), lit: -1 }));
  if (statements.length) {
    const light = () => {
      const vh = window.innerHeight;
      for (const b of statements) {
        const r = b.el.getBoundingClientRect();
        const lit = clamp((vh * 0.85 - r.top) / (vh * 0.45 + r.height * 0.5)) * b.words.length;
        if (Math.abs(lit - b.lit) < 0.05) continue;
        b.lit = lit;
        b.words.forEach((w, i) => w.style.setProperty('--o', String(0.16 + 0.84 * clamp(lit - i))));
      }
    };
    if (reduce) statements.forEach((b) => b.words.forEach((w) => w.style.setProperty('--o', '1')));
    else { window.addEventListener('scroll', () => requestAnimationFrame(light), { passive: true }); light(); }
  }

  // ── type tester: pick a weight
  root.querySelectorAll<HTMLElement>('[data-spec]').forEach((spec) =>
    spec.querySelectorAll<HTMLButtonElement>('[data-weight]').forEach((b) => b.addEventListener('click', () => {
      spec.style.setProperty('--w', b.dataset.weight!);
      spec.querySelectorAll('[data-weight]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    })));

  // ── colour swatches copy their hex
  const copyStatus = root.querySelector('[data-copy-status]');
  root.querySelectorAll<HTMLButtonElement>('[data-copy-hex]').forEach((b) => b.addEventListener('click', async () => {
    const hex = b.dataset.copyHex!, label = b.querySelector('[data-hex]');
    try { await navigator.clipboard.writeText(hex); if (label) label.textContent = 'Copied'; if (copyStatus) copyStatus.textContent = `${hex} copied`; }
    catch { /* clipboard blocked: leave the hex visible */ }
    window.setTimeout(() => { if (label) label.textContent = hex; }, 1400);
  }));

  // ── phones lean towards the mouse
  const phones = root.querySelector<HTMLElement>('[data-phones]');
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (phones && fine && !reduce) {
    const frames = Array.from(phones.querySelectorAll<HTMLElement>('[data-tilt]'));
    phones.addEventListener('pointermove', (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1, y = (e.clientY / window.innerHeight) * 2 - 1;
      frames.forEach((f) => { f.style.setProperty('--ry', `${x * 12}deg`); f.style.setProperty('--rx', `${-y * 8}deg`); });
    });
    phones.addEventListener('pointerleave', () => frames.forEach((f) => { f.style.setProperty('--ry', '0deg'); f.style.setProperty('--rx', '0deg'); }));
  }

  // ── results count up once they're in view
  const list = root.querySelector<HTMLElement>('[data-count-up]');
  if (list && !reduce) {
    const nums = Array.from(list.querySelectorAll<HTMLElement>('[data-count]'))
      .map((el) => ({ el, n: Number(el.dataset.count) }))
      .filter((x) => Number.isFinite(x.n));
    nums.forEach((x) => (x.el.textContent = '0'));
    new IntersectionObserver((entries, o) => {
      if (!entries[0].isIntersecting) return;
      o.disconnect();
      nums.forEach(({ el, n }, i) => {
        const start = performance.now() + i * 160, dur = 1300;
        const tick = (now: number) => {
          const t = clamp((now - start) / dur);
          el.textContent = String(Math.round(n * (1 - Math.pow(1 - t, 3))));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 }).observe(list);
  }
}
