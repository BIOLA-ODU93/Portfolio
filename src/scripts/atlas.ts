/**
 * The atlas camera. Scroll position inside the tall #top section is mapped
 * to a progress value p ∈ [0, stops]. Whole numbers are camera keyframes
 * (0 = overview, 1… = locations). Between keyframes the camera eases across
 * the map, pulling back slightly mid-flight. With reduced motion, the camera
 * cuts between locations instead of gliding.
 */

type Cam = { x: number; y: number; s: number; tilt: number; rot: number };

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function initAtlas(reduceMotion: MediaQueryList) {
  const section = document.querySelector<HTMLElement>('[data-atlas]');
  const world = section?.querySelector<HTMLElement>('[data-world]');
  if (!section || !world) return null;

  const cams: Cam[] = JSON.parse(section.dataset.cameras ?? '[]');
  const stops = cams.length - 1;
  const stage = section.querySelector<HTMLElement>('.atlas__stage')!;
  const viewport = section.querySelector<HTMLElement>('.atlas__viewport')!;
  const intro = section.querySelector<HTMLElement>('[data-atlas-intro]');
  const hint = section.querySelector<HTMLElement>('[data-atlas-hint]');
  const road = section.querySelector<SVGPathElement>('[data-road]');
  const bar = section.querySelector<HTMLElement>('[data-atlas-progress]');
  const cards = Array.from(section.querySelectorAll<HTMLElement>('[data-card]'));
  const navBtns = Array.from(section.querySelectorAll<HTMLButtonElement>('[data-goto]'));
  const pins = Array.from(section.querySelectorAll<HTMLElement>('[data-pin]'));
  const districtIds = cards.map((c) => c.id.replace('atlas-', ''));
  const labels = navBtns.map((b) => b.querySelector('.atlas__nav-label')?.textContent ?? '');

  let active = -2;

  /** Scroll offset (document Y) at which keyframe k is reached. */
  const scrollFor = (k: number) => {
    const top = section.getBoundingClientRect().top + window.scrollY;
    const run = section.offsetHeight - window.innerHeight;
    return top + (run * k) / stops;
  };

  // The opening dial's ENTER asks to fly to a stop
  window.addEventListener('atlas:goto', (e) => {
    const k = Number((e as CustomEvent).detail);
    window.scrollTo({ top: scrollFor(k) + 2, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
  });

  navBtns.forEach((btn) =>
    btn.addEventListener('click', () => {
      window.scrollTo({ top: scrollFor(Number(btn.dataset.goto)) + 2, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    }),
  );

  function camera(p: number): Cam {
    const i = Math.min(Math.floor(p), stops - 1);
    const raw = p - i;
    // hold at each keyframe for a moment, then travel
    const t = ease(clamp((raw - 0.18) / 0.64));
    const a = cams[i];
    const b = cams[i + 1];
    const pull = 1 - 0.28 * Math.sin(Math.PI * t); // zoom out mid-flight
    return {
      x: lerp(a.x, b.x, t),
      y: lerp(a.y, b.y, t),
      s: lerp(a.s, b.s, t) * pull,
      tilt: lerp(a.tilt, b.tilt, t),
      rot: lerp(a.rot, b.rot, t),
    };
  }

  /** Returns the label for the header's chapter indicator while in the atlas. */
  return function update(): string | null {
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    if (rect.bottom < 0 || rect.top > vh) return null;

    const run = section.offsetHeight - vh;
    let p = clamp(-rect.top / run) * stops;
    if (reduceMotion.matches) p = Math.round(p);

    // Responsive: anchor point & base scale
    const mobile = vw < 760;
    const ax = mobile ? 0.5 : vw < 1100 ? 0.68 : 0.6;
    // on phones the card covers the lower half, so the camera aims higher once travelling
    const ay = mobile ? lerp(0.48, 0.3, clamp(p)) : 0.5;
    stage.style.setProperty('--ax', `${ax * 100}%`);
    stage.style.setProperty('--ay', `${ay * 100}%`);
    viewport.style.setProperty('--ax', `${ax * 100}%`);
    viewport.style.setProperty('--ay', `${ay * 100}%`);
    const base = mobile ? clamp(vw / 900, 0.36, 0.5) : clamp(Math.min(vw / 1440, vh / 900), 0.62, 1.35);

    const c = camera(p);
    const s = c.s * base;
    world.style.transform = `rotateX(${c.tilt}deg) rotateZ(${c.rot}deg) scale(${s}) translate(${-c.x}px, ${-c.y}px)`;
    world.style.setProperty('--tilt', `${c.tilt}deg`);
    world.style.setProperty('--rot', `${c.rot}deg`);
    world.style.setProperty('--inv', String(1 / s));

    // Overview title fades as the journey starts
    const introOut = clamp(p / 0.35);
    if (intro) {
      intro.style.opacity = String(1 - introOut);
      intro.style.transform = `translateY(${-introOut * 40}px) scale(${1 + introOut * 0.04})`;
    }
    if (hint) hint.style.opacity = String(1 - clamp(p / 0.2));

    road?.style.setProperty('stroke-dashoffset', String(1 - p / stops));
    bar?.style.setProperty('--p', String(p / stops));

    // Active location: only when the camera is resting near a keyframe
    const k = Math.round(p);
    const resting = Math.abs(p - k) < 0.3;
    const next = resting && k > 0 ? k - 1 : -1;
    if (next !== active) {
      active = next;
      cards.forEach((card, i) => card.classList.toggle('is-active', i === active));
      navBtns.forEach((b, i) => b.setAttribute('aria-current', String(i === active)));
      // district pins are for wayfinding: show them in the overview and in flight
      pins.forEach((pin) => (pin.style.opacity = active === -1 ? '1' : '0'));
      section.dataset.activeDistrict = active >= 0 ? districtIds[active] : '';
    }
    return active >= 0 ? labels[active] : 'The map';
  };
}
