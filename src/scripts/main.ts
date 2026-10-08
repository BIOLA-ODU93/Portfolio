/**
 * Site behaviour — progressive enhancement only.
 * Everything works without JS; this adds the menu dialog, header state,
 * scroll reveals and the journey route progress.
 */

import { initAtlas } from './atlas';
import { initDial } from './dial';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const updateAtlas = initAtlas(reduceMotion);
initDial(reduceMotion);
const pad = (n: number) => String(n).padStart(2, '0');

/* ── Scroll reveals ───────────────────────────────────────── */
const revealEls = document.querySelectorAll<HTMLElement>('[data-reveal]');
if ('IntersectionObserver' in window && !reduceMotion.matches) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-in'));
}

/* ── Menu dialog ──────────────────────────────────────────── */
const menu = document.querySelector<HTMLDialogElement>('[data-menu]');
const openBtn = document.querySelector<HTMLButtonElement>('[data-menu-open]');
const closeBtn = document.querySelector<HTMLButtonElement>('[data-menu-close]');

if (menu && openBtn) {
  openBtn.addEventListener('click', () => {
    menu.showModal();
    openBtn.setAttribute('aria-expanded', 'true');
    document.documentElement.style.overflow = 'hidden';
  });
  closeBtn?.addEventListener('click', () => menu.close());
  menu.addEventListener('close', () => {
    openBtn.setAttribute('aria-expanded', 'false');
    document.documentElement.style.overflow = '';
  });

  menu.querySelectorAll<HTMLAnchorElement>('[data-menu-link], .menu__foot a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (ev) => {
      const id = link.getAttribute('href')?.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      ev.preventDefault();
      menu.close();
      goTo(target);
    });
  });
}

/** Scroll to a section and move keyboard focus there. */
function goTo(target: HTMLElement) {
  target.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth' });
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
  history.pushState(null, '', `#${target.id}`);
}

/* ── Header theme + current chapter ───────────────────────── */
const header = document.querySelector<HTMLElement>('[data-header]');
const sections = Array.from(document.querySelectorAll<HTMLElement>('main > section[data-theme]'));
const currentN = document.querySelector('[data-current-n]');
const currentLabel = document.querySelector('[data-current-label]');
const menuLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-menu-link]'));

/* ── Journey route ────────────────────────────────────────── */
const route = document.querySelector<HTMLElement>('[data-route]');
const stops = Array.from(document.querySelectorAll<HTMLElement>('[data-stop]'));
const stageN = document.querySelector('[data-stage-n]');
const stageLabel = document.querySelector('[data-stage-label]');

let lastChapter = '';
let lastLabel = '';
let lastStop = -1;
let ticking = false;

function update() {
  ticking = false;
  const vh = window.innerHeight;

  // Header adopts the theme of whatever section is beneath it.
  const probe = 32;
  const under = sections.find((s) => {
    const r = s.getBoundingClientRect();
    return r.top <= probe && r.bottom > probe;
  });
  if (header && under) header.dataset.theme = under.dataset.theme;

  // Current chapter = the section crossing 40% of the viewport.
  const line = vh * 0.4;
  const current = sections.find((s) => {
    const r = s.getBoundingClientRect();
    return r.top <= line && r.bottom > line;
  });
  if (current && current.id !== lastChapter) {
    lastChapter = current.id;
    if (currentN) currentN.textContent = pad(Number(current.dataset.chapter));
    menuLinks.forEach((a) => a.setAttribute('aria-current', String(a.hash === `#${current.id}`)));
  }

  // The atlas camera; while inside it, the header shows the current location.
  const atlasLabel = updateAtlas?.() ?? null;
  const label = current?.id === 'atlas' && atlasLabel ? atlasLabel : current?.dataset.chapterLabel ?? '';
  if (label !== lastLabel && currentLabel) {
    lastLabel = label;
    currentLabel.textContent = label;
  }

  // Journey: fill the route line and mark the active stop.
  if (route && stops.length) {
    const r = route.getBoundingClientRect();
    const mid = vh * 0.55;
    const progress = Math.min(1, Math.max(0, (mid - r.top) / r.height));
    route.style.setProperty('--progress', progress.toFixed(4));

    let active = 0;
    stops.forEach((s, i) => {
      if (s.getBoundingClientRect().top < mid) active = i;
    });
    if (active !== lastStop) {
      lastStop = active;
      stops.forEach((s, i) => {
        s.classList.toggle('is-active', i === active);
        s.classList.toggle('is-passed', i < active);
      });
      if (stageN) stageN.textContent = pad(active + 1);
      if (stageLabel) stageLabel.textContent = stops[active].dataset.label ?? '';
    }
  }
}

function onScroll() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(update);
  }
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);
update();

/* ── Copy email ───────────────────────────────────────────── */
document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((btn) => {
  const label = btn.querySelector('[data-copy-label]');
  const status = btn.parentElement?.querySelector('[data-copy-status]');
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy ?? '');
      if (label) label.textContent = 'Copied ✓';
      if (status) status.textContent = 'Email address copied to clipboard';
    } catch {
      if (label) label.textContent = 'Press ⌘C / Ctrl+C';
    }
    setTimeout(() => {
      if (label) label.textContent = 'Copy email';
    }, 2200);
  });
});
