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

type LngLat = [number, number];
type Stop = { title: string; pos: LngLat; zoom: number; by?: 'danfo' | 'plane' | 'car'; route?: string; midZoom?: number };
type Leg = { by: 'danfo' | 'plane' | 'car' | null; coords: LngLat[]; cum: number[]; total: number; midZoom: number };

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
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
    const coords: LngLat[] = s.by === 'plane' ? greatCircle(prev, s.pos) : s.route && R[s.route] ? R[s.route].coords : [prev, s.pos];
    const cum = [0];
    for (let j = 1; j < coords.length; j++) cum.push(cum[j - 1] + km(coords[j - 1], coords[j]));
    return { by: s.by ?? null, coords, cum, total: cum[cum.length - 1] || 1e-6, midZoom: s.midZoom ?? Math.min(stops[i - 1].zoom, s.zoom) };
  });
  const at = (leg: Leg, t: number): { p: LngLat; b: number } => {
    const d = t * leg.total;
    let j = 1;
    while (j < leg.cum.length - 1 && leg.cum[j] < d) j++;
    const a = leg.coords[j - 1], b = leg.coords[j];
    const f = clamp((d - leg.cum[j - 1]) / ((leg.cum[j] - leg.cum[j - 1]) || 1e-6));
    return { p: [lerp(a[0], b[0], f), lerp(a[1], b[1], f)], b: bearing(a, b) };
  };
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

  // ── Motion state
  const OVERVIEW = { center: [-1.5, 28] as LngLat, zoom: 2.25 };
  const pitchAt = (k: number) => (k < 1 ? 0 : stops[k - 1].zoom > 13.5 ? 55 : 45);
  let p = 0; // where we are
  let target = 0; // where we're heading (integer stop)
  let tween: { from: number; to: number; start: number; dur: number } | null = null;
  let playing = false;
  let playTimer = 0;
  const cam = { lng: OVERVIEW.center[0], lat: OVERVIEW.center[1], zoom: OVERVIEW.zoom, pitch: 0, heading: 0 };
  let primed = false; // first frame snaps the camera instead of easing in

  const legDuration = (i: number) => {
    // time to travel into stop i+1 (1-based i), or from the overview into stop 1 (i = 0)
    if (i === 0) return 2600;
    const leg = legs[i];
    if (!leg || leg.total < 0.05) return 1400;
    if (leg.by === 'plane') return 4600;
    return clamp(1700 + leg.total * 14, 1900, 3600);
  };
  const durationFor = (from: number, to: number) => {
    const [a, b] = from < to ? [from, to] : [to, from];
    let sum = 0;
    for (let i = Math.floor(a); i < Math.ceil(b); i++) sum += legDuration(i);
    return Math.min(sum, 7000);
  };

  const goTo = (k: number) => {
    k = Math.round(clamp(k, 0, S));
    if (k === target && !tween) return;
    target = k;
    tween = reduce.matches ? null : { from: p, to: k, start: performance.now(), dur: durationFor(p, k) };
    if (reduce.matches) p = k;
    syncUI();
  };

  const syncUI = () => {
    const settled = !tween;
    const here = settled ? Math.round(p) : -1;
    cards.forEach((el, i) => el.classList.toggle('is-active', i === here - 1));
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
    let center: LngLat, zoom: number, pitch: number, vpos: LngLat, vbear = 0, kind = 'danfo', alt = 0;
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
        const v = at(leg, f);
        vpos = v.p; vbear = v.b; kind = leg.by ?? 'car';
        center = vpos;
        const zc = 2 * leg.midZoom - (a.zoom + b.zoom) / 2;
        zoom = (1 - f) ** 2 * a.zoom + 2 * f * (1 - f) * zc + f ** 2 * b.zoom;
        const dip = Math.sin(Math.PI * f);
        pitch = lerp(pitchAt(i), pitchAt(i + 1), f) * (1 - (leg.by === 'plane' ? 0.9 : 0.3) * dip);
        if (leg.by === 'plane') alt = 0.25 + 1.2 * dip;
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
    return { center, zoom, pitch, vpos, vbear, kind, alt };
  };

  // ── Render loop (runs only while the map is open)
  let map: MLMap | null = null;
  let vehicles: { set: (v: Record<string, unknown>) => void } | null = null;
  let ready = false;
  let loop = 0;
  let last = 0;
  const angleLerp = (a: number, b: number, t: number) => a + ((((b - a) % 360) + 540) % 360 - 180) * t;

  const frame = (now: number) => {
    loop = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - (last || now)) / 1000);
    last = now;
    if (tween) {
      const t = clamp((now - tween.start) / tween.dur);
      p = tween.from + (tween.to - tween.from) * easeInOut(t);
      if (t >= 1) { p = tween.to; tween = null; syncUI(); schedulePlay(); }
    }
    if (intro) { const o = clamp(1 - p * 2.2); intro.style.opacity = String(o); intro.style.transform = `translateY(${(o - 1) * 24}px)`; }
    if (!ready || !map || !vehicles) return;

    const v = view(p);
    // camera follows through a low-pass filter: smooth on twisty roads, exact when settled
    const k = primed ? 1 - Math.exp(-dt / 0.16) : 1;
    primed = true;
    cam.lng = lerp(cam.lng, v.center[0], k);
    cam.lat = lerp(cam.lat, v.center[1], k);
    cam.zoom = lerp(cam.zoom, v.zoom, k);
    cam.pitch = lerp(cam.pitch, v.pitch, k);
    cam.heading = angleLerp(cam.heading, v.vbear, primed ? 1 - Math.exp(-dt / 0.1) : 1);
    map.jumpTo({ center: [cam.lng, cam.lat], zoom: cam.zoom, pitch: cam.pitch, bearing: 0 });
    // the vehicle appears once the journey starts (keeps the opening globe clean)
    vehicles.set({ lng: v.vpos[0], lat: v.vpos[1], heading: cam.heading, kind: v.kind, alt: v.alt, visible: p > 0.45 });

    const src = map.getSource('route-done') as GeoJSONSource | undefined;
    if (src) {
      const kLeg = p < 1 ? 0 : p >= S ? S : Math.floor(p);
      const tLeg = p < 1 || p >= S ? 0 : p - Math.floor(p);
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
    const next = ['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key);
    const prev = ['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key);
    if (!next && !prev && e.key !== 'Home' && e.key !== 'End') return;
    if ((e.target as HTMLElement).closest('a, button') && e.key === ' ') return;
    e.preventDefault();
    stopPlay();
    if (e.key === 'Home') goTo(0); else if (e.key === 'End') goTo(S); else goTo(target + (next ? 1 : -1));
  });
  // one scroll gesture = one stop (ignores the long tail of trackpad momentum)
  let wheelLock = 0;
  dialog.addEventListener('wheel', (e) => {
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
    const dy = touchY - e.changedTouches[0].clientY;
    if (Math.abs(dy) > 40) { stopPlay(); goTo(target + Math.sign(dy)); }
  });

  // ── Map (created the first time the dialog opens)
  let starting: Promise<void> | null = null;
  const ensureMap = () => (starting ??= (async () => {
    try {
      const ml = await import('maplibre-gl');
      ml.setWorkerUrl('/vendor/maplibre/maplibre-gl-worker.mjs'); // self-hosted (see scripts/copy-maplibre-worker.mjs)
      map = new ml.Map({ container: mapEl, style: journeyStyle, center: OVERVIEW.center, zoom: OVERVIEW.zoom, interactive: false, attributionControl: { compact: true }, fadeDuration: 0 });
      map.on('error', (e) => console.warn('[journey map]', e?.error?.message ?? e));
      if (import.meta.env.DEV) (window as any).__jmap = map; // dev-only handle for debugging
      await new Promise<void>((res) => map!.once('load', () => res()));
      map.addSource('route-all', { type: 'geojson', data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: fullLine } } });
      map.addSource('route-done', { type: 'geojson', data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [stops[0].pos] } } });
      map.addLayer({ id: 'route-all', type: 'line', source: 'route-all', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': 'rgba(232,236,238,0.28)', 'line-width': 2, 'line-dasharray': [1.5, 2] } });
      map.addLayer({ id: 'route-done', type: 'line', source: 'route-done', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#f2c22e', 'line-width': ['interpolate', ['linear'], ['zoom'], 3, 2, 12, 4, 16, 7], 'line-opacity': 0.95 } });
      stops.forEach((s) => {
        const el = document.createElement('div');
        el.className = 'jstop';
        el.innerHTML = '<span class="jstop__dot"></span><span class="jstop__label"></span>';
        el.querySelector('.jstop__label')!.textContent = s.title;
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

  // ── Open / close
  const open = () => {
    if (dialog.open) return;
    dialog.showModal();
    pauseScroll();
    nextBtn?.focus({ preventScroll: true });
    ensureMap().then(() => map?.resize());
    last = 0;
    primed = false;
    cancelAnimationFrame(loop);
    loop = requestAnimationFrame(frame);
    syncUI();
  };
  dialog.addEventListener('close', () => {
    stopPlay();
    cancelAnimationFrame(loop);
    resumeScroll();
  });
  dialog.querySelector('[data-journey-close]')?.addEventListener('click', () => dialog.close());
  document.querySelectorAll('[data-journey-open]').forEach((b) => {
    b.addEventListener('click', (e) => { e.preventDefault(); open(); });
    b.addEventListener('pointerenter', () => { import('maplibre-gl'); }, { once: true }); // warm up on hover
  });
  if (location.hash === '#journey') open();
  syncUI();
}
