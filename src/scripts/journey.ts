/**
 * Journey camera. Scroll inside #journey maps to p ∈ [0, stops]:
 * 0 = overview, k = stop k. Between stops the camera eases across the map and
 * pulls back mid-flight (further for long flights, e.g. Nigeria → Ireland).
 * With reduced motion it cuts between stops instead of gliding.
 */
type Cam = { x: number; y: number; s: number; tilt: number; rot: number };

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function initJourney() {
  const section = document.querySelector<HTMLElement>('[data-journey]');
  const world = section?.querySelector<HTMLElement>('[data-jworld]');
  if (!section || !world) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const cams: Cam[] = JSON.parse(section.dataset.cameras ?? '[]');
  const N = cams.length - 1;
  const stage = section.querySelector<HTMLElement>('.journey__stage')!;
  const viewport = section.querySelector<HTMLElement>('.journey__viewport')!;
  const intro = section.querySelector<HTMLElement>('[data-jintro]');
  const hint = section.querySelector<HTMLElement>('[data-jhint]');
  const route = section.querySelector<SVGPathElement>('[data-jroute]');
  const cards = Array.from(section.querySelectorAll<HTMLElement>('[data-jcard]'));
  const stops = Array.from(section.querySelectorAll<HTMLElement>('[data-jstop]'));
  const navBtns = Array.from(section.querySelectorAll<HTMLButtonElement>('[data-jgoto]'));

  const scrollFor = (k: number) => {
    const top = section.getBoundingClientRect().top + window.scrollY;
    return top + ((section.offsetHeight - window.innerHeight) * k) / N;
  };
  navBtns.forEach((b) =>
    b.addEventListener('click', () =>
      window.scrollTo({ top: scrollFor(Number(b.dataset.jgoto)) + 2, behavior: reduce.matches ? 'auto' : 'smooth' }),
    ),
  );

  const camera = (p: number): Cam => {
    const i = Math.min(Math.floor(p), N - 1);
    const t = ease(clamp((p - i - 0.2) / 0.6));
    const a = cams[i], b = cams[i + 1];
    const dist = Math.hypot(b.x - a.x, b.y - a.y);
    const pull = 1 - Math.min(0.62, 0.18 + dist / 2600) * Math.sin(Math.PI * t);
    return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), s: lerp(a.s, b.s, t) * pull, tilt: lerp(a.tilt, b.tilt, t), rot: lerp(a.rot, b.rot, t) };
  };

  let active = -2;
  let ticking = false;
  const update = () => {
    ticking = false;
    const r = section.getBoundingClientRect();
    const vh = window.innerHeight, vw = window.innerWidth;
    if (r.bottom < 0 || r.top > vh) return;
    let p = clamp(-r.top / (section.offsetHeight - vh)) * N;
    if (reduce.matches) p = Math.round(p);

    const mobile = vw < 760;
    const ax = mobile ? 50 : 60, ay = mobile ? 34 : 48;
    for (const el of [stage, viewport]) { el.style.setProperty('--ax', `${ax}%`); el.style.setProperty('--ay', `${ay}%`); }
    const base = mobile ? clamp(vw / 900, 0.36, 0.5) : clamp(Math.min(vw / 1440, vh / 900), 0.6, 1.3);

    const c = camera(p);
    const s = c.s * base;
    world.style.transform = `rotateX(${c.tilt}deg) rotateZ(${c.rot}deg) scale(${s}) translate(${-c.x}px, ${-c.y}px)`;
    world.style.setProperty('--tilt', `${c.tilt}deg`);
    world.style.setProperty('--rot', `${c.rot}deg`);
    world.style.setProperty('--inv', String(1 / s));

    const out = clamp(p / 0.35);
    if (intro) { intro.style.opacity = String(1 - out); intro.style.transform = `translateY(${-out * 30}px)`; }
    if (hint) hint.style.opacity = String(1 - clamp(p / 0.2));
    route?.style.setProperty('stroke-dashoffset', String(1 - clamp((p - 1) / (N - 1))));

    const k = Math.round(p);
    const next = Math.abs(p - k) < 0.32 && k > 0 ? k - 1 : -1;
    if (next !== active) {
      active = next;
      cards.forEach((el, i) => el.classList.toggle('is-active', i === active));
      stops.forEach((el, i) => el.classList.toggle('is-active', i === active));
      navBtns.forEach((b, i) => b.setAttribute('aria-current', String(i === active)));
    }
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
}
