/**
 * Work section: the Product / Graphic switch (with its own links, /#product and
 * /#graphic), hover video on the featured case study, the cursor-following
 * preview on the graphic index, and the full-screen gallery.
 */
import { pauseScroll, resumeScroll } from './smooth';

type Piece = { title: string; src: string; sm: string };
type Group = { slug: string; client: string; type: string; note: string; pieces: Piece[] };

export function initWork() {
  const root = document.querySelector<HTMLElement>('[data-work]');
  if (!root) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // ── switch
  const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-tab]'));
  const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-panel]'));
  const sw = root.querySelector<HTMLElement>('.work__switch');
  let current = 'product';
  const show = (name: string, focus = false) => {
    current = name;
    tabs.forEach((t) => {
      const on = t.dataset.tab === name;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    sw?.classList.toggle('is-graphic', name === 'graphic');
    panels.forEach((p) => {
      const on = p.dataset.panel === name;
      p.hidden = !on;
      p.classList.remove('is-in');
      if (on) requestAnimationFrame(() => requestAnimationFrame(() => p.classList.add('is-in')));
    });
  };
  tabs.forEach((t) => t.addEventListener('click', () => {
    show(t.dataset.tab!);
    history.replaceState(null, '', `#${t.dataset.tab}`);
  }));
  // arrow keys move between tabs (WAI-ARIA tabs pattern)
  root.querySelector('[role=tablist]')?.addEventListener('keydown', (e) => {
    const k = (e as KeyboardEvent).key;
    if (k !== 'ArrowLeft' && k !== 'ArrowRight') return;
    e.preventDefault();
    const next = current === 'product' ? 'graphic' : 'product';
    show(next, true);
    history.replaceState(null, '', `#${next}`);
  });
  // links: /#graphic or /#product opens that track
  const fromHash = () => {
    const h = location.hash.slice(1);
    if (h === 'graphic' || h === 'product') show(h);
  };
  window.addEventListener('hashchange', fromHash);
  fromHash();
  // play the entrance the first time the section comes into view
  const first = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    first.disconnect();
    panels.find((p) => !p.hidden)?.classList.add('is-in');
  }, { threshold: 0.12 });
  first.observe(root);

  // ── featured case study: the live site's hero video plays while the card is on screen
  root.querySelectorAll<HTMLElement>('[data-autoplay-video]').forEach((card) => {
    const v = card.querySelector('video');
    if (!v || reduce) return;
    v.muted = true; // started from script, not `autoplay` (Chrome pauses autoplaying muted video it misjudges as hidden)
    let seen = false;
    const sync = () => (seen && document.visibilityState === 'visible' ? v.play().catch(() => {}) : v.pause());
    new IntersectionObserver(([e]) => { seen = e.isIntersecting; sync(); }, { threshold: 0.2 }).observe(card);
    document.addEventListener('visibilitychange', sync);
  });

  // ── graphic index: a preview follows the cursor and cycles through the group's pieces
  const list = root.querySelector<HTMLElement>('.gindex');
  const preview = root.querySelector<HTMLElement>('[data-preview]');
  const pimg = preview?.querySelector('img');
  if (list && preview && pimg && fine && !reduce) {
    let x = 0, y = 0, px = 0, py = 0, raf = 0, cycle = 0, active: HTMLElement | null = null;
    const loop = () => {
      px += (x - px) * 0.14; py += (y - py) * 0.14;
      preview.style.transform = `translate(${px - preview.offsetWidth / 2}px, ${py - preview.offsetHeight / 2}px) rotate(${(x - px) * 0.04}deg)`;
      raf = requestAnimationFrame(loop);
    };
    const enter = (btn: HTMLElement) => {
      const srcs: string[] = JSON.parse(btn.dataset.previews || '[]');
      if (!srcs.length) return;
      active?.classList.remove('is-active');
      active = btn; btn.classList.add('is-active');
      list.classList.add('is-hovering');
      let k = 0;
      pimg.src = srcs[0];
      window.clearInterval(cycle);
      cycle = window.setInterval(() => { k = (k + 1) % srcs.length; pimg.src = srcs[k]; }, 750);
      preview.classList.add('is-on');
    };
    list.addEventListener('pointermove', (e) => {
      x = e.clientX; y = e.clientY;
      if (!raf) { px = x; py = y; raf = requestAnimationFrame(loop); }
      const btn = (e.target as HTMLElement).closest<HTMLElement>('.grow__btn');
      if (btn && btn !== active && !btn.hasAttribute('disabled')) enter(btn);
    });
    list.addEventListener('pointerleave', () => {
      preview.classList.remove('is-on');
      list.classList.remove('is-hovering');
      active?.classList.remove('is-active'); active = null;
      window.clearInterval(cycle);
      window.setTimeout(() => { if (!active) { cancelAnimationFrame(raf); raf = 0; } }, 400);
    });
    // preload thumbnails so cycling is instant
    list.querySelectorAll<HTMLElement>('[data-previews]').forEach((b) => JSON.parse(b.dataset.previews || '[]').forEach((s: string) => { new Image().src = s; }));
  }

  // ── gallery
  const dlg = root.querySelector<HTMLDialogElement>('[data-gallery]');
  const groups: Group[] = JSON.parse(document.getElementById('work-gallery-data')?.textContent ?? '[]');
  if (dlg) {
    const $ = (s: string) => dlg.querySelector<HTMLElement>(s)!;
    const img = $('[data-g-img]') as HTMLImageElement;
    let g: Group | null = null, i = 0;
    const draw = (dir = 0) => {
      if (!g) return;
      const p = g.pieces[i];
      $('[data-g-client]').textContent = g.client;
      $('[data-g-type]').textContent = g.type;
      $('[data-g-note]').textContent = g.note;
      $('[data-g-title]').textContent = p.title;
      $('[data-g-count]').textContent = `${i + 1} / ${g.pieces.length}`;
      img.alt = `${g.client}: ${p.title}`;
      const multi = g.pieces.length > 1;
      $('[data-g-prev]').hidden = !multi;
      $('[data-g-next]').hidden = !multi;
      if (!dir || reduce) { img.src = p.src; return; }
      img.style.setProperty('--dir', String(dir));
      img.classList.add('is-swapping');
      window.setTimeout(() => {
        img.src = p.src;
        img.style.setProperty('--dir', String(-dir));
        img.onload = () => requestAnimationFrame(() => img.classList.remove('is-swapping'));
      }, 200);
    };
    const step = (d: number) => { if (!g) return; i = (i + d + g.pieces.length) % g.pieces.length; draw(d); };
    const open = (slug: string) => {
      g = groups.find((x) => x.slug === slug) ?? null;
      if (!g || !g.pieces.length) return;
      i = 0; draw();
      dlg.showModal();
      pauseScroll();
      requestAnimationFrame(() => requestAnimationFrame(() => dlg.classList.add('is-in')));
    };
    const close = () => {
      dlg.classList.remove('is-in');
      window.setTimeout(() => dlg.close(), reduce ? 0 : 400);
    };
    root.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>('[data-group]');
      if (b) open(b.dataset.group!);
    });
    $('[data-g-close]').addEventListener('click', close);
    $('[data-g-prev]').addEventListener('click', () => step(-1));
    $('[data-g-next]').addEventListener('click', () => step(1));
    dlg.addEventListener('cancel', (e) => { e.preventDefault(); close(); });
    dlg.addEventListener('close', () => resumeScroll());
    dlg.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    });
    let tx = 0;
    dlg.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; }, { passive: true });
    dlg.addEventListener('touchend', (e) => { const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); });
  }
}
