/**
 * The adire dial. Rotation is in degrees; wedge i sits on top when
 * rotation = -i * step. Drag horizontally (mouse or touch) to turn — a
 * horizontal drag along the top of the dial maps to an arc of the same
 * length — tap a wedge to bring it to the top, or use the arrow keys.
 */
import { dial as content } from '../content/site';

const clampMod = (n: number, m: number) => ((n % m) + m) % m;
const pad = (n: number) => String(n).padStart(2, '0');

export function initDial(reduceMotion: MediaQueryList) {
  const root = document.querySelector<HTMLElement>('[data-dial]');
  const svg = root?.querySelector<SVGSVGElement>('[data-dial-svg]');
  const rotor = root?.querySelector<SVGGElement>('[data-dial-rotor]');
  if (!root || !svg || !rotor) return;

  const wedges = Array.from(rotor.querySelectorAll<SVGGElement>('[data-wedge]'));
  const N = wedges.length;
  const S = content.sections.length;
  const step = 360 / N;
  const R_UNITS = 470; // wedge radius in viewBox units (viewBox is 1440 wide)

  const $ = (sel: string) => document.querySelector<HTMLElement>(sel);
  const nEl = $('[data-dial-n]');
  const labelEl = $('[data-dial-label]');
  const blurbEl = $('[data-dial-blurb]');
  const countEl = $('[data-dial-count]');
  const enterLabel = $('[data-dial-enter-label]');
  const enterBtn = root.querySelector<HTMLButtonElement>('[data-dial-enter]');

  let rot = 0;
  let active = -1;
  let anim = 0;

  const render = () => {
    rotor.setAttribute('transform', `rotate(${rot.toFixed(2)})`);
    const w = clampMod(Math.round(-rot / step), N);
    if (w !== active) {
      active = w;
      wedges.forEach((g, i) => g.classList.toggle('is-active', i === w));
      const s = content.sections[w % S];
      const n = (w % S) + 1;
      if (nEl) nEl.textContent = pad(n);
      if (labelEl) labelEl.textContent = s.label;
      if (blurbEl) blurbEl.textContent = s.blurb;
      if (countEl) countEl.textContent = pad(n);
      if (enterLabel) enterLabel.textContent = s.label;
      svg.setAttribute('aria-valuenow', String(n));
      svg.setAttribute('aria-valuetext', s.label);
    }
  };

  /** Animate to a rotation (or jump, with reduced motion). */
  const tweenTo = (target: number, ms = 520) => {
    cancelAnimationFrame(anim);
    if (reduceMotion.matches) { rot = target; render(); return; }
    const from = rot;
    const t0 = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / ms);
      rot = from + (target - from) * ease(t);
      render();
      if (t < 1) anim = requestAnimationFrame(tick);
    };
    anim = requestAnimationFrame(tick);
  };
  const snap = () => tweenTo(Math.round(rot / step) * step);
  const turn = (dir: 1 | -1) => tweenTo(Math.round(rot / step) * step - dir * step);
  /** Bring wedge i to the top by the shortest way round. */
  const bringToTop = (i: number) => {
    let target = -i * step;
    while (target - rot > 180) target -= 360;
    while (target - rot < -180) target += 360;
    tweenTo(target);
  };

  const go = () => {
    const s = content.sections[active % S];
    if (typeof s.go === 'number') {
      window.dispatchEvent(new CustomEvent('atlas:goto', { detail: s.go }));
    } else {
      const el = document.querySelector<HTMLElement>(s.go);
      if (el) {
        el.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth' });
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
        el.focus({ preventScroll: true });
      }
    }
  };

  // ── Pointer: drag to turn, tap to select
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let startRot = 0;
  let moved = 0;
  svg.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    cancelAnimationFrame(anim);
    dragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startRot = rot;
    moved = 0;
    try { svg.setPointerCapture(e.pointerId); } catch { /* synthetic or already-released pointer */ }
  });
  svg.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    moved = Math.max(moved, Math.hypot(dx, e.clientY - startY));
    const rPx = (R_UNITS / 1440) * svg.getBoundingClientRect().width;
    rot = startRot + (dx / rPx) * (180 / Math.PI);
    render();
  });
  const end = (e: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    if (moved < 6 && e.type === 'pointerup') {
      // a tap: which wedge was under the pointer?
      const b = svg.getBoundingClientRect();
      const a = (Math.atan2(e.clientY - (b.top + b.height / 2), e.clientX - (b.left + b.width / 2)) * 180) / Math.PI;
      const local = a - rot;
      const i = clampMod(Math.round((local + 90) / step), N);
      if (i === active) go();
      else bringToTop(i);
      return;
    }
    snap();
  };
  svg.addEventListener('pointerup', end);
  svg.addEventListener('pointercancel', end);

  // ── Keyboard (slider semantics)
  svg.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); turn(1); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); turn(-1); }
    else if (e.key === 'Home') { e.preventDefault(); bringToTop(0); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
  });
  document.querySelector('[data-dial-next]')?.addEventListener('click', () => turn(1));
  document.querySelector('[data-dial-prev]')?.addEventListener('click', () => turn(-1));
  enterBtn?.addEventListener('click', go);

  render();

  // A small nudge on load so people see it turns
  if (!reduceMotion.matches) {
    setTimeout(() => {
      if (dragging || Math.abs(rot) > 0.1) return;
      tweenTo(-14, 700);
      setTimeout(() => !dragging && tweenTo(0, 900), 760);
    }, 1400);
  }
}
