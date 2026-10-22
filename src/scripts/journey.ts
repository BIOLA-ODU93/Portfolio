/**
 * Journey engine — a full-screen map opened from the corner card.
 * Progress p ∈ [0, S]: 0 = overview globe, k = resting at stop k (1-based),
 * k < p < k+1 = travelling into stop k+1 (danfo / plane / car).
 * Moving between stops is time-based (eased), never tied to page scroll, and
 * the camera follows the vehicle through a gentle low-pass filter so motion
 * stays smooth even on twisty roads. Reduced motion: cuts between stops.
 */
import type { Map as MLMap, GeoJSONSource } from 'maplibre-gl';
import routes from '../data/journey-routes.json';
import { journeyStyle } from './journey-style';
import { pauseScroll, resumeScroll } from './smooth';
import { unlockSound, takeoff, stopTakeoff, honk, isMuted, setMuted, startMusic, stopMusic } from './journey-sound';

type LngLat = [number, number];
type Stop = { title: string; slug: string; when: string; pos: LngLat; zoom: number; by?: 'danfo' | 'plane' | 'car'; route?: string; midZoom?: number };
type Leg = { by: 'danfo' | 'plane' | 'car' | null; coords: LngLat[]; cum: number[]; total: number; midZoom: number; dist: (t: number) => number };

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => { t = Math.min(1, Math.max(0, t)); return t * t * (3 - 2 * t); };
const smoother = (t: number) => { t = Math.min(1, Math.max(0, t)); return t * t * t * (t * (t * 6 - 15) + 10); };
const angleDiff = (a: number, b: number) => ((((b - a) % 360) + 540) % 360) - 180;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

const km = ([a, b]: LngLat, [c, d]: LngLat) => {
  const dLat = rad(d - b), dLng = rad(c - a);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(b)) * Math.cos(rad(d)) * Math.sin(dLng / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
};
const bearing = ([a, b]: LngLat, [c, d]: LngLat) => {
  const y = Math.sin(rad(c - a)) * Math.cos(rad(d));
  const x = Math.cos(rad(b)) * Math.sin(rad(d)) - Math.sin(rad(b)) * Math.cos(rad(d)) * Math.cos(rad(c - a));
  return (deg(Math.atan2(y, x)) + 360) % 360;
};
/** Great-circle points between two places (for the flight). */
const greatCircle = (p: LngLat, q: LngLat, n = 160): LngLat[] => {
  const toV = ([lng, lat]: LngLat) => [Math.cos(rad(lat)) * Math.cos(rad(lng)), Math.cos(rad(lat)) * Math.sin(rad(lng)), Math.sin(rad(lat))];
  const A = toV(p), B = toV(q);
  const w = Math.acos(clamp(A[0] * B[0] + A[1] * B[1] + A[2] * B[2], -1, 1));
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n, s1 = Math.sin((1 - t) * w) / Math.sin(w), s2 = Math.sin(t * w) / Math.sin(w);
    const v = [A[0] * s1 + B[0] * s2, A[1] * s1 + B[1] * s2, A[2] * s1 + B[2] * s2];
    return [deg(Math.atan2(v[1], v[0])), deg(Math.asin(v[2]))] as LngLat;
  });
};

/** Round off sharp corners in a road line (Chaikin), keeping both ends in place. */
const smoothLine = (pts: LngLat[], passes = 2): LngLat[] => {
  let out = pts;
  for (let n = 0; n < passes && out.length > 2; n++) {
    const next: LngLat[] = [out[0]];
    for (let i = 0; i < out.length - 1; i++) {
      const [a, b] = [out[i], out[i + 1]];
      next.push([lerp(a[0], b[0], 0.25), lerp(a[1], b[1], 0.25)], [lerp(a[0], b[0], 0.75), lerp(a[1], b[1], 0.75)]);
    }
    next.push(out[out.length - 1]);
    out = next;
  }
  return out;
};

export function initJourney() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-journey]');
  const mapEl = dialog?.querySelector<HTMLElement>('[data-jmap]');
  if (!dialog || !mapEl) return;
  const stops: Stop[] = JSON.parse(document.getElementById('journey-data')?.textContent ?? '[]');
  const S = stops.length;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  // ── Legs: legs[i] runs from stop i to stop i+1 (1-based), i.e. stops[i-1] → stops[i]
  const R = routes as unknown as Record<string, { coords: LngLat[] }>;
  const legs: (Leg | null)[] = stops.map((s, i) => {
    if (i === 0) return null;
    const prev = stops[i - 1].pos;
    const coords: LngLat[] = s.by === 'plane' ? greatCircle(prev, s.pos) : s.route && R[s.route] ? smoothLine(R[s.route].coords) : [prev, s.pos];
    const cum = [0];
    for (let j = 1; j < coords.length; j++) cum.push(cum[j - 1] + km(coords[j - 1], coords[j]));
    const leg: Leg = { by: s.by ?? null, coords, cum, total: cum[cum.length - 1] || 1e-6, midZoom: s.midZoom ?? Math.min(stops[i - 1].zoom, s.zoom), dist: (t) => t };
    leg.dist = leg.by === 'plane' ? flightDist : roadProfile(leg);
    return leg;
  });
  /**
   * Flight: a slow take-off roll down the runway, a long climb-cruise-descent, and a
   * landing roll — time fraction in, distance fraction out (very flat at both ends).
   */
  function flightDist(t: number) { return smoother(smooth(t)); }
  /**
   * Roads: the vehicle brakes into bends and speeds up on straights. Samples the
   * route's curvature, turns it into a speed (looking ahead so braking starts before
   * the bend), integrates time, and inverts it: time fraction → distance fraction.
   */
  function roadProfile(leg: Leg) {
    const N = 240, ds = leg.total / N;
    if (leg.total < 0.05) return (t: number) => t;
    const head: number[] = [];
    for (let k = 0; k <= N; k++) head.push(steerAt(leg, k / N));
    const v: number[] = [];
    for (let k = 0; k <= N; k++) {
      const a = head[Math.max(0, k - 1)], b = head[Math.min(N, k + 1)];
      const curv = Math.abs(angleDiff(a, b)) / (2 * ds); // degrees per km
      v.push(1 / (1 + curv / 55));
    }
    const look = Math.max(1, Math.round(0.35 / ds)); // brake ~350 m before a bend
    const vs = v.map((_, k) => Math.max(0.32, Math.min(...v.slice(k, k + look + 1))));
    const T = [0];
    for (let k = 1; k <= N; k++) T.push(T[k - 1] + ds / ((vs[k - 1] + vs[k]) / 2));
    const total = T[N];
    for (let k = 0; k <= N; k++) T[k] /= total;
    return (t: number) => {
      if (t <= 0) return 0;
      if (t >= 1) return 1;
      let lo = 0, hi = N;
      while (hi - lo > 1) { const m = (lo + hi) >> 1; if (T[m] <= t) lo = m; else hi = m; }
      return (lo + (t - T[lo]) / ((T[hi] - T[lo]) || 1e-9)) / N;
    };
  }
  function steerAt(leg: Leg, t: number) {
    const w = Math.min(0.12, leg.total * 0.02) / leg.total;
    const a = at(leg, clamp(t - w)).p, b = at(leg, clamp(t + w)).p;
    return a[0] === b[0] && a[1] === b[1] ? at(leg, t).b : bearing(a, b);
  }
  function at(leg: Leg, t: number): { p: LngLat; b: number } {
    const d = t * leg.total;
    let j = 1;
    while (j < leg.cum.length - 1 && leg.cum[j] < d) j++;
    const a = leg.coords[j - 1], b = leg.coords[j];
    const f = clamp((d - leg.cum[j - 1]) / ((leg.cum[j] - leg.cum[j - 1]) || 1e-6));
    return { p: [lerp(a[0], b[0], f), lerp(a[1], b[1], f)], b: bearing(a, b) };
  }
  /** Heading that looks a little ahead on the road, so the vehicle steers through bends. */
  const steer = steerAt;
  const doneLine = (k: number, t: number): LngLat[] => {
    const out: LngLat[] = [stops[0].pos];
    for (let i = 1; i < legs.length; i++) {
      const leg = legs[i]!;
      if (i < k) out.push(...leg.coords);
      else if (i === k && t > 0) {
        const d = t * leg.total;
        for (let j = 0; j < leg.coords.length && leg.cum[j] <= d; j++) out.push(leg.coords[j]);
        out.push(at(leg, t).p);
      }
    }
    return out;
  };
  const fullLine = legs.flatMap((l) => (l ? l.coords : [stops[0].pos]));

  // ── UI
  const $ = <T extends HTMLElement>(sel: string) => dialog.querySelector<T>(sel);
  const intro = $('[data-jintro]');
  const hint = $('[data-jhint]');
  const count = $('[data-jcount]');
  const prevBtn = $<HTMLButtonElement>('[data-jprev]');
  const nextBtn = $<HTMLButtonElement>('[data-jnext]');
  const playBtn = $<HTMLButtonElement>('[data-jplay]');
  const cards = Array.from(dialog.querySelectorAll<HTMLElement>('[data-jcard]'));
  const navBtns = Array.from(dialog.querySelectorAll<HTMLButtonElement>('[data-jgoto]'));
  const pins: HTMLElement[] = [];
  let openIdx = -1; // stop whose panel is open
  let pendingOpen = -1; // stop whose panel opens on arrival

  // ── Motion state
  const OVERVIEW = { center: [-1.5, 28] as LngLat, zoom: 2.25 };
  // Sobha-style camera: a steep tilt and a diagonal heading (flatter on phones, which load less)
  const small = window.matchMedia('(max-width: 640px)').matches;
  const pitchAt = (k: number) => (k < 1 ? 0 : Math.min(small ? 52 : 90, stops[k - 1].zoom > 13.5 ? 64 : 58));
  const CAM_BEARING = -30; // degrees; the map turns as the journey begins
  let p = 0; // where we are
  let target = 0; // where we're heading (integer stop)
  let tween: { from: number; to: number; start: number; dur: number } | null = null;
  let playing = false;
  let playTimer = 0;
  const cam = { lng: OVERVIEW.center[0], lat: OVERVIEW.center[1], zoom: OVERVIEW.zoom, pitch: 0, heading: 0, bearing: 0, ox: 0, oy: 0 };
  let primed = false; // first frame snaps the camera instead of easing in
  // the camera leans gently towards the mouse (fine pointers only)
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
  let lastV: { lng: number; lat: number; kind: string; visible: boolean } | null = null;
  let hopStart = -1;

  const legDuration = (i: number) => {
    // time to travel into stop i+1 (1-based i), or from the overview into stop 1 (i = 0)
    if (i === 0) return 2600;
    const leg = legs[i];
    if (!leg || leg.total < 0.05) return 1400;
    if (leg.by === 'plane') return 7000;
    return clamp(1700 + leg.total * 14, 1900, 3600);
  };
  const durationFor = (from: number, to: number) => {
    const [a, b] = from < to ? [from, to] : [to, from];
    let sum = 0;
    for (let i = Math.floor(a); i < Math.ceil(b); i++) sum += legDuration(i);
    return Math.min(sum, 8000);
  };

  const goTo = (k: number) => {
    k = Math.round(clamp(k, 0, S));
    if (openIdx >= 0 && k !== openIdx + 1) closePanel();
    if (k === target && !tween) return;
    target = k;
    tween = reduce.matches ? null : { from: p, to: k, start: performance.now(), dur: durationFor(p, k) };
    if (reduce.matches) p = k;
    syncUI();
  };

  const syncUI = () => {
    const settled = !tween;
    const here = settled ? Math.round(p) : -1;
    pins.forEach((el, i) => el.classList.toggle('is-active', i === target - 1));
    navBtns.forEach((b, i) => b.setAttribute('aria-current', String(i === target - 1)));
    if (count) count.textContent = String(target).padStart(2, '0');
    if (prevBtn) prevBtn.disabled = target <= 0;
    if (nextBtn) nextBtn.disabled = target >= S;
    if (hint) hint.style.opacity = target === 0 && settled ? '1' : '0';
    if (playBtn) { playBtn.setAttribute('aria-pressed', String(playing)); playBtn.textContent = playing ? 'Pause' : target >= S ? 'Replay' : 'Play'; }
  };

  // ── Where the camera and vehicle want to be at progress p
  const view = (q: number) => {
    let center: LngLat, zoom: number, pitch: number, vpos: LngLat, vbear = 0, kind = 'danfo', alt = 0, tilt = 0, chase = 0;
    const i = Math.min(Math.floor(q), S - 1);
    const f = q - i;
    if (q <= 1 && i === 0) {
      const t = f;
      const s1 = stops[0];
      center = [lerp(OVERVIEW.center[0], s1.pos[0], t), lerp(OVERVIEW.center[1], s1.pos[1], t)];
      zoom = lerp(OVERVIEW.zoom, s1.zoom, t);
      pitch = lerp(0, pitchAt(1), t);
      vpos = s1.pos;
      kind = legs[1]?.by ?? 'danfo';
      vbear = legs[1] ? bearing(legs[1]!.coords[0], legs[1]!.coords[1]) : 0;
    } else {
      const leg = legs[i];
      const a = stops[i - 1], b = stops[i] ?? a;
      if (leg && leg.total > 0.05 && f > 0 && q < S) {
        const plane = leg.by === 'plane';
        const d = leg.dist(f); // distance along the route for this moment in time
        const v = at(leg, d);
        vpos = v.p; vbear = plane ? v.b : steer(leg, d); kind = leg.by ?? 'car';
        center = vpos;
        // flights hold the camera low during the take-off and landing rolls, then pull out
        const fz = plane ? smooth((f - 0.07) / 0.86) : f;
        const zc = 2 * leg.midZoom - (a.zoom + b.zoom) / 2;
        zoom = (1 - fz) ** 2 * a.zoom + 2 * fz * (1 - fz) * zc + fz ** 2 * b.zoom;
        const dip = Math.sin(Math.PI * fz);
        pitch = lerp(pitchAt(i), pitchAt(i + 1), fz) * (1 - (plane ? 0.9 : 0.3) * dip);
        if (plane) {
          // wheels on the runway → climb → cruise → descend → touch down
          const up = smooth((f - 0.06) / 0.16), down = smooth((f - 0.78) / 0.15);
          alt = 1.45 * up * (1 - down);
          tilt = 9 * Math.sin(Math.PI * clamp((f - 0.06) / 0.16)) - 5 * Math.sin(Math.PI * clamp((f - 0.78) / 0.15));
        } else {
          // chase camera: swing in behind the vehicle mid-leg, and look a little ahead of it
          chase = Math.sin(Math.PI * f) ** 0.6;
          const mpp = (78271.5 * Math.cos(rad(vpos[1]))) / 2 ** zoom;
          const lead = Math.min(110, window.innerWidth * 0.08) * mpp * chase; // metres ahead; less on narrow screens
          center = [vpos[0] + (lead * Math.sin(rad(vbear))) / (111320 * Math.cos(rad(vpos[1]))), vpos[1] + (lead * Math.cos(rad(vbear))) / 111320];
        }
      } else {
        const s = q >= S ? stops[S - 1] : f < 0.5 ? a : b;
        const k = stops.indexOf(s) + 1;
        center = s.pos; zoom = s.zoom; pitch = pitchAt(k);
        vpos = s.pos;
        const nextLeg = legs[k], prevLeg = legs[k - 1];
        kind = (nextLeg?.by ?? prevLeg?.by ?? 'car') as string;
        vbear = nextLeg ? bearing(nextLeg.coords[0], nextLeg.coords[Math.min(1, nextLeg.coords.length - 1)]) : prevLeg ? at(prevLeg, 1).b : 0;
      }
    }
    // at the stops the map rests at the Sobha angle; on the road it turns to follow the vehicle
    const base = CAM_BEARING * clamp(q);
    const camBearing = base + angleDiff(base, vbear) * 0.8 * chase;
    return { center, zoom, pitch, vpos, vbear, kind, alt, tilt, camBearing };
  };

  // ── Render loop (runs only while the map is open)
  let map: MLMap | null = null;
  let vehicles: { set: (v: Record<string, unknown>) => void } | null = null;
  let ready = false;
  let loop = 0;
  let last = 0;
  let roll = 0, tiltNow = 0;
  let planeLeg = -1;
  const angleLerp = (a: number, b: number, t: number) => a + ((((b - a) % 360) + 540) % 360 - 180) * t;

  const frame = (now: number) => {
    loop = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - (last || now)) / 1000);
    last = now;
    if (tween) {
      const t = clamp((now - tween.start) / tween.dur);
      p = tween.from + (tween.to - tween.from) * easeInOut(t);
      if (t >= 1) { p = tween.to; tween = null; syncUI(); if (pendingOpen === target - 1) { const i = pendingOpen; pendingOpen = -1; openPanel(i); } else schedulePlay(); }
    }
    if (intro) { const o = clamp(1 - p * 2.2); intro.style.opacity = String(o); intro.style.transform = `translateY(${(o - 1) * 24}px)`; }
    if (!ready || !map || !vehicles) return;
    // reveal the map once its tiles are drawn, so it never pops in half-finished
    if (!mapEl.classList.contains('is-ready') && map.areTilesLoaded()) mapEl.classList.add('is-ready');

    const v = view(p);
    // camera follows through a low-pass filter: smooth on twisty roads, exact when settled
    const k = primed ? 1 - Math.exp(-dt / 0.16) : 1;
    primed = true;
    // the vehicle stays pinned; only the framing around it (look-ahead, stop view) is smoothed
    cam.ox = lerp(cam.ox, v.center[0] - v.vpos[0], k);
    cam.oy = lerp(cam.oy, v.center[1] - v.vpos[1], k);
    cam.lng = v.vpos[0] + cam.ox;
    cam.lat = v.vpos[1] + cam.oy;
    cam.zoom = lerp(cam.zoom, v.zoom, k);
    cam.pitch = lerp(cam.pitch, v.pitch, k);
    cam.bearing = angleLerp(cam.bearing, v.camBearing, primed ? 1 - Math.exp(-dt / 0.9) : 1); // turns slowly, like a crane
    const prevHeading = cam.heading;
    cam.heading = angleLerp(cam.heading, v.vbear, primed ? 1 - Math.exp(-dt / 0.22) : 1);
    // body roll: lean out of turns on the road, bank into them in the air
    const yaw = dt > 0 ? angleDiff(prevHeading, cam.heading) / dt : 0; // degrees per second
    const rollTarget = v.kind === 'plane' ? clamp(yaw * 0.5, -18, 18) : clamp(-yaw * 0.06, -5, 5);
    roll = lerp(roll, rollTarget, 1 - Math.exp(-dt / 0.25));
    tiltNow = lerp(tiltNow, v.tilt, 1 - Math.exp(-dt / 0.3));
    const km2 = 1 - Math.exp(-dt / 0.45); // the lean follows the mouse slowly, like a floating camera
    mouse.sx = lerp(mouse.sx, mouse.x, km2);
    mouse.sy = lerp(mouse.sy, mouse.y, km2);
    const lean = clamp(p); // no lean on the flat opening globe
    map.jumpTo({
      center: [cam.lng, cam.lat],
      zoom: cam.zoom,
      pitch: clamp(cam.pitch - mouse.sy * 6 * lean, 0, 70),
      bearing: cam.bearing + mouse.sx * 10 * lean,
    });
    // takeoff: start the jet sound as the plane leg begins
    const leg = Math.floor(p);
    if (tween && tween.to > tween.from && legs[leg]?.by === 'plane' && p - leg > 0.01 && planeLeg !== leg) {
      planeLeg = leg;
      takeoff(Math.max(0, tween.dur * (1 - clamp((now - tween.start) / tween.dur))));
    }
    if (legs[leg]?.by !== 'plane' || p - leg <= 0.01) { if (planeLeg !== -1) stopTakeoff(); planeLeg = -1; }
    const hop = hopStart < 0 ? 0 : Math.sin(Math.PI * clamp((now - hopStart) / 380)) * 0.35;
    if (hopStart >= 0 && now - hopStart > 380) hopStart = -1;
    // the vehicle appears once the journey starts (keeps the opening globe clean)
    vehicles.set({ lng: v.vpos[0], lat: v.vpos[1], heading: cam.heading, kind: v.kind, alt: v.alt + hop, bank: roll, tilt: tiltNow, visible: p > 0.45 });
    lastV = { lng: v.vpos[0], lat: v.vpos[1], kind: v.kind, visible: p > 0.45 };

    const src = map.getSource('route-done') as GeoJSONSource | undefined;
    if (src) {
      const kLeg = p < 1 ? 0 : p >= S ? S : Math.floor(p);
      const tLeg = p < 1 || p >= S ? 0 : (legs[kLeg]?.dist(p - Math.floor(p)) ?? 0);
      src.setData({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: doneLine(kLeg, tLeg) } });
    }
  };

  // ── Play: glide through the stops, pausing at each one
  const schedulePlay = () => {
    clearTimeout(playTimer);
    if (!playing) return;
    if (target >= S) { playing = false; syncUI(); return; }
    playTimer = window.setTimeout(() => playing && goTo(target + 1), target === 0 ? 300 : 2600);
  };
  const stopPlay = () => { if (playing) { playing = false; clearTimeout(playTimer); syncUI(); } };

  // ── Stop panels (Sobha-style): the + on a stop fades its panel in; the journey pauses while it's open
  function openPanel(i: number) {
    stopPlay();
    openIdx = i;
    cards.forEach((el, k) => { el.classList.toggle('is-open', k === i); el.setAttribute('aria-hidden', String(k !== i)); });
    pins.forEach((el, k) => el.classList.toggle('is-open', k === i));
    dialog.classList.add('has-panel');
    history.replaceState(null, '', `#${stops[i].slug}`);
    window.setTimeout(() => cards[i]?.querySelector<HTMLElement>('[data-jpanel-close]')?.focus({ preventScroll: true }), 50);
  }
  function closePanel() {
    if (openIdx < 0) return;
    const i = openIdx;
    openIdx = -1;
    cards.forEach((el) => { el.classList.remove('is-open'); el.setAttribute('aria-hidden', 'true'); });
    pins.forEach((el) => el.classList.remove('is-open'));
    dialog.classList.remove('has-panel');
    history.replaceState(null, '', location.pathname + location.search);
    if (dialog.contains(document.activeElement)) pins[i]?.querySelector<HTMLElement>('.jstop__dot')?.focus({ preventScroll: true });
  }
  const openStop = (i: number) => {
    if (openIdx === i) return closePanel();
    if (!tween && target === i + 1) return openPanel(i);
    closePanel();
    stopPlay();
    pendingOpen = i;
    goTo(i + 1);
  };
  dialog.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    if (t.closest('[data-jpanel-close]')) closePanel();
    else if (t.closest('[data-jpanel-next]')) { closePanel(); goTo(target + 1); }
  });

  // ── Controls
  nextBtn?.addEventListener('click', () => { stopPlay(); goTo(target + 1); });
  prevBtn?.addEventListener('click', () => { stopPlay(); goTo(target - 1); });
  navBtns.forEach((b) => b.addEventListener('click', () => { stopPlay(); goTo(Number(b.dataset.jgoto)); }));
  playBtn?.addEventListener('click', () => {
    if (playing) return stopPlay();
    playing = true;
    if (target >= S) { target = -1; goTo(0); } else schedulePlay();
    syncUI();
  });
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && openIdx >= 0) { e.preventDefault(); e.stopPropagation(); closePanel(); return; }
    const next = ['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key);
    const prev = ['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key);
    if (!next && !prev && e.key !== 'Home' && e.key !== 'End') return;
    if ((e.target as HTMLElement).closest('a, button, .jcard') && e.key === ' ') return;
    e.preventDefault();
    stopPlay();
    if (e.key === 'Home') goTo(0); else if (e.key === 'End') goTo(S); else goTo(target + (next ? 1 : -1));
  });
  // one scroll gesture = one stop (ignores the long tail of trackpad momentum)
  let wheelLock = 0;
  dialog.addEventListener('wheel', (e) => {
    if ((e.target as HTMLElement).closest('.jcard')) return; // let a long panel scroll
    e.preventDefault();
    const now = performance.now();
    if (Math.abs(e.deltaY) < 6 || now < wheelLock) { wheelLock = Math.max(wheelLock, now + 120); return; }
    wheelLock = now + 900;
    stopPlay();
    goTo(target + Math.sign(e.deltaY));
  }, { passive: false });
  let touchY = 0;
  dialog.addEventListener('touchstart', (e) => { touchY = e.touches[0].clientY; }, { passive: true });
  dialog.addEventListener('touchend', (e) => {
    if ((e.target as HTMLElement).closest('.jcard')) return;
    const dy = touchY - e.changedTouches[0].clientY;
    if (Math.abs(dy) > 40) { stopPlay(); goTo(target + Math.sign(dy)); }
  });

  // ── Mouse: lean the camera; click the danfo to honk
  const stage = mapEl.parentElement!;
  const nearVehicle = (e: MouseEvent) => {
    if (!map || !lastV?.visible) return false;
    const pt = map.project([lastV.lng, lastV.lat]);
    const r = mapEl.getBoundingClientRect();
    return Math.hypot(e.clientX - r.left - pt.x, e.clientY - r.top - pt.y) < 46;
  };
  const onControl = (e: Event) => !!(e.target as HTMLElement).closest('a, button, [data-jcard], .jnav, .jctrl, .jstop');
  stage.addEventListener('pointermove', (e) => {
    if (finePointer && !reduce.matches) {
      mouse.x = clamp((e.clientX / window.innerWidth) * 2 - 1, -1, 1);
      mouse.y = clamp((e.clientY / window.innerHeight) * 2 - 1, -1, 1);
    }
    stage.style.cursor = !onControl(e) && lastV?.kind === 'danfo' && nearVehicle(e) ? 'pointer' : '';
  });
  stage.addEventListener('pointerleave', () => { mouse.x = 0; mouse.y = 0; });
  stage.addEventListener('click', (e) => {
    // a click on the open map (not the panel or a control) closes the panel
    if (openIdx >= 0 && !onControl(e)) { closePanel(); return; }
    if (onControl(e) || lastV?.kind !== 'danfo' || !nearVehicle(e)) return;
    unlockSound();
    honk();
    if (!reduce.matches) hopStart = performance.now();
  });
  const soundBtn = $<HTMLButtonElement>('[data-jsound]');
  const syncSound = () => {
    if (!soundBtn) return;
    soundBtn.setAttribute('aria-pressed', String(!isMuted()));
    soundBtn.querySelector('[data-jsound-label]')!.textContent = isMuted() ? 'Sound off' : 'Sound on';
  };
  soundBtn?.addEventListener('click', () => { unlockSound(); setMuted(!isMuted()); if (isMuted()) stopTakeoff(); syncSound(); });
  syncSound();

  // ── Map (created the first time the dialog opens)
  let starting: Promise<void> | null = null;
  const ensureMap = () => (starting ??= (async () => {
    try {
      const ml = await import('maplibre-gl');
      ml.setWorkerUrl('/vendor/maplibre/maplibre-gl-worker.mjs'); // self-hosted (see scripts/copy-maplibre-worker.mjs)
      map = new ml.Map({ container: mapEl, style: journeyStyle, center: OVERVIEW.center, zoom: OVERVIEW.zoom, interactive: false, maxPitch: 70, attributionControl: { compact: true }, fadeDuration: 0 });
      map.on('error', (e) => console.warn('[journey map]', e?.error?.message ?? e));
      if (import.meta.env.DEV) (window as any).__jmap = map; // dev-only handle for debugging
      await new Promise<void>((res) => map!.once('load', () => res()));
      map.addSource('route-all', { type: 'geojson', data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: fullLine } } });
      map.addSource('route-done', { type: 'geojson', data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [stops[0].pos] } } });
      map.addLayer({ id: 'route-all', type: 'line', source: 'route-all', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': 'rgba(232,236,238,0.28)', 'line-width': 2, 'line-dasharray': [1.5, 2] } });
      map.addLayer({ id: 'route-glow', type: 'line', source: 'route-done', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#f2c22e', 'line-width': ['interpolate', ['linear'], ['zoom'], 3, 8, 12, 14, 16, 24], 'line-blur': ['interpolate', ['linear'], ['zoom'], 3, 6, 16, 18], 'line-opacity': 0.28 } });
      map.addLayer({ id: 'route-done', type: 'line', source: 'route-done', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#f2c22e', 'line-width': ['interpolate', ['linear'], ['zoom'], 3, 2, 12, 4, 16, 7], 'line-opacity': 0.95 } });
      stops.forEach((s) => {
        const el = document.createElement('div');
        el.className = 'jstop';
        el.innerHTML = '<button type="button" class="jstop__dot">+</button><span class="jstop__label"><span></span><small></small></span>';
        const btn = el.querySelector<HTMLButtonElement>('.jstop__dot')!;
        btn.setAttribute('aria-label', `${s.title}: open the story`);
        el.querySelector('.jstop__label > span')!.textContent = s.title;
        el.querySelector('.jstop__label small')!.textContent = s.when;
        const idx = pins.length;
        btn.addEventListener('click', (ev) => { ev.stopPropagation(); unlockSound(); openStop(idx); });
        new ml.Marker({ element: el }).setLngLat(s.pos).addTo(map!);
        pins.push(el);
      });
      const { createVehicleLayer } = await import('./journey-vehicles');
      const v = createVehicleLayer(map);
      map.addLayer(v.layer);
      vehicles = v;
      ready = true;
      primed = false;
      syncUI();
    } catch (err) {
      console.warn('[journey] map unavailable, showing list', err);
      dialog.classList.add('is-static');
    }
  })());

  // ── Rewind to the opening globe, so every visit starts with the full journey
  const rewind = () => {
    closePanel();
    pendingOpen = -1;
    stopPlay();
    stopTakeoff();
    planeLeg = -1;
    mouse.x = mouse.y = mouse.sx = mouse.sy = 0;
    tween = null;
    p = 0;
    target = 0;
    primed = false; // next frame snaps the camera back to the overview
    mapEl.classList.remove('is-ready'); // and the map fades in again
    const src = map?.getSource('route-done') as GeoJSONSource | undefined;
    src?.setData({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [stops[0].pos] } });
    syncUI();
  };

  // ── Open / close — a smooth fade both ways
  const FADE = reduce.matches ? 0 : 700;
  const open = () => {
    if (dialog.open) return;
    unlockSound(); // opening is a click, so browsers allow sound from here on
    if (!reduce.matches) startMusic();
    dialog.showModal();
    document.documentElement.classList.add('journey-open');
    pauseScroll();
    requestAnimationFrame(() => requestAnimationFrame(() => dialog.classList.add('is-in')));
    nextBtn?.focus({ preventScroll: true });
    ensureMap().then(() => {
      map?.resize();
      // safety net: reveal the map even if some tiles are slow
      window.setTimeout(() => mapEl.classList.add('is-ready'), 3500);
    });
    last = 0;
    primed = false;
    cancelAnimationFrame(loop);
    loop = requestAnimationFrame(frame);
    syncUI();
  };
  let closing = 0;
  const close = () => {
    if (!dialog.open || closing) return;
    dialog.classList.remove('is-in');
    document.documentElement.classList.remove('journey-open');
    closing = window.setTimeout(() => { closing = 0; dialog.close(); }, FADE);
  };
  dialog.addEventListener('cancel', (e) => { e.preventDefault(); if (openIdx >= 0) closePanel(); else close(); }); // Esc: panel first, then the map
  dialog.addEventListener('close', () => {
    stopMusic();
    cancelAnimationFrame(loop);
    rewind();
    dialog.classList.remove('is-in');
    document.documentElement.classList.remove('journey-open');
    resumeScroll();
  });
  dialog.querySelector('[data-journey-close]')?.addEventListener('click', close);
  document.querySelectorAll('[data-journey-open]').forEach((b) => {
    b.addEventListener('click', (e) => { e.preventDefault(); open(); });
    b.addEventListener('pointerenter', () => { import('maplibre-gl'); }, { once: true }); // warm up on hover
  });
  // coming back via the browser's back button restores the page as it was; start over instead
  window.addEventListener('pageshow', (e) => { if (e.persisted) rewind(); });
  const linked = stops.findIndex((s) => `#${s.slug}` === location.hash);
  if (location.hash === '#journey') open();
  else if (linked >= 0) { open(); pendingOpen = linked; goTo(linked + 1); } // a shared link to one stop
  syncUI();
}
