/**
 * Journey engine. Scroll inside #journey maps to p ∈ [0, S]:
 *   p = 0 → overview (both countries on the globe)
 *   p = k → resting at stop k (1-based); its card shows
 *   k < p < k+1 → travelling the leg into stop k+1 (danfo / plane / car)
 * The camera follows the vehicle and pulls back on long legs; the travelled
 * route draws in behind it. Reduced motion: jumps between stops.
 */
import type { Map as MLMap, GeoJSONSource } from 'maplibre-gl';
import routes from '../data/journey-routes.json';
import { journeyStyle } from './journey-style';

type LngLat = [number, number];
type Stop = { title: string; pos: LngLat; zoom: number; by?: 'danfo' | 'plane' | 'car'; route?: string; midZoom?: number };
type Leg = { by: 'danfo' | 'plane' | 'car' | null; coords: LngLat[]; cum: number[]; total: number; midZoom: number };

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
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
  const section = document.querySelector<HTMLElement>('[data-journey]');
  const mapEl = section?.querySelector<HTMLElement>('[data-jmap]');
  if (!section || !mapEl) return;
  const stops: Stop[] = JSON.parse(document.getElementById('journey-data')?.textContent ?? '[]');
  const S = stops.length;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  // ── legs: leg[k] goes from stop k-1 to stop k (1-based stop k ↔ index k in stops is k-1)
  const R = routes as unknown as Record<string, { coords: LngLat[] }>;
  const legs: (Leg | null)[] = stops.map((s, i) => {
    if (i === 0) return null;
    const prev = stops[i - 1].pos;
    let coords: LngLat[];
    if (s.by === 'plane') coords = greatCircle(prev, s.pos);
    else if (s.route && R[s.route]) coords = R[s.route].coords;
    else coords = [prev, s.pos];
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
    // everything travelled so far: legs 1..k-1 complete, leg k partly
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

  // ── UI bits
  const intro = section.querySelector<HTMLElement>('[data-jintro]');
  const hint = section.querySelector<HTMLElement>('[data-jhint]');
  const cards = Array.from(section.querySelectorAll<HTMLElement>('[data-jcard]'));
  const navBtns = Array.from(section.querySelectorAll<HTMLButtonElement>('[data-jgoto]'));
  const scrollFor = (k: number) => section.getBoundingClientRect().top + window.scrollY + ((section.offsetHeight - window.innerHeight) * k) / S;
  navBtns.forEach((b) => b.addEventListener('click', () => window.scrollTo({ top: scrollFor(Number(b.dataset.jgoto)) + 2, behavior: reduce.matches ? 'auto' : 'smooth' })));

  let map: MLMap | null = null;
  let vehicles: { set: (v: Record<string, unknown>) => void } | null = null;
  const pins: HTMLElement[] = [];
  let ready = false;
  let active = -2;

  const OVERVIEW = { center: [-1.5, 28] as LngLat, zoom: 2.25, pitch: 0, bearing: 0 };
  const pitchAt = (k: number) => (stops[k - 1].zoom > 13.5 ? 55 : 45);

  const update = () => {
    const r = section.getBoundingClientRect();
    const vh = window.innerHeight;
    if (r.bottom < -vh || r.top > vh * 2) return;
    let p = clamp(-r.top / (section.offsetHeight - vh)) * S;
    if (reduce.matches) p = Math.round(p);

    const out = clamp(p / 0.35);
    if (intro) { intro.style.opacity = String(1 - out); intro.style.transform = `translateY(${-out * 30}px)`; }
    if (hint) hint.style.opacity = String(1 - clamp(p / 0.2));

    const k = Math.round(p);
    const next = Math.abs(p - k) < 0.28 && k >= 1 ? k - 1 : -1;
    if (next !== active) {
      active = next;
      cards.forEach((el, i) => el.classList.toggle('is-active', i === active));
      pins.forEach((el, i) => el.classList.toggle('is-active', i === active));
      navBtns.forEach((b, i) => b.setAttribute('aria-current', String(i === active)));
    }
    if (!ready || !map || !vehicles) return;

    let center: LngLat, zoom: number, pitch: number, bear = 0, vpos: LngLat, vbear = 0, vtype: string = 'danfo', alt = 0;
    if (p < 1) {
      // overview → first stop
      const t = ease(clamp((p - 0.25) / 0.75));
      const s1 = stops[0];
      center = [lerp(OVERVIEW.center[0], s1.pos[0], t), lerp(OVERVIEW.center[1], s1.pos[1], t)];
      zoom = lerp(OVERVIEW.zoom, s1.zoom, t);
      pitch = lerp(0, pitchAt(1), t);
      vpos = s1.pos;
      vtype = legs[1]?.by ?? 'danfo';
      vbear = legs[1] ? bearing(legs[1]!.coords[0], legs[1]!.coords[1]) : 0;
    } else {
      const i = Math.min(Math.floor(p), S - 1); // resting at / leaving stop i (1-based)
      const leg = legs[i]; // leg from stop i to stop i+1
      const tRaw = clamp((p - i - 0.22) / 0.56);
      const t = ease(tRaw);
      const a = stops[i - 1], b = stops[i] ?? a;
      if (leg && leg.total > 0.05 && p < S) {
        const v = at(leg, t);
        vpos = v.p; vbear = v.b; vtype = leg.by ?? 'car';
        center = vpos;
        const zc = 2 * leg.midZoom - (a.zoom + b.zoom) / 2; // quadratic through the mid zoom
        zoom = (1 - t) ** 2 * a.zoom + 2 * t * (1 - t) * zc + t ** 2 * b.zoom;
        const dip = Math.sin(Math.PI * t);
        pitch = lerp(pitchAt(i), pitchAt(i + 1), t) * (1 - (leg.by === 'plane' ? 0.9 : 0.35) * dip);
        if (leg.by === 'plane') alt = 0.25 + 1.2 * dip; // climbs, cruises, descends (in vehicle lengths)
      } else {
        // resting (or a same-place hop): sit at the stop
        const s = p >= S ? stops[S - 1] : tRaw < 0.5 ? a : b;
        center = s.pos; zoom = s.zoom; pitch = pitchAt(stops.indexOf(s) + 1);
        vpos = s.pos;
        const nextLeg = legs[stops.indexOf(s) + 1];
        const prevLeg = legs[stops.indexOf(s)];
        vtype = (nextLeg?.by ?? prevLeg?.by ?? 'car') as string;
        vbear = nextLeg ? bearing(nextLeg.coords[0], nextLeg.coords[Math.min(1, nextLeg.coords.length - 1)]) : prevLeg ? at(prevLeg, 1).b : 0;
      }
      bear = Math.sin(p * 0.9) * 12; // a slow, gentle sway of the camera
    }

    map.jumpTo({ center, zoom, pitch, bearing: bear });
    vehicles.set({ lng: vpos[0], lat: vpos[1], heading: vbear, kind: vtype, alt, visible: true });
    const src = map.getSource('route-done') as GeoJSONSource | undefined;
    if (src) {
      // legs[i] runs from stop i to stop i+1 (1-based); at p ∈ [i, i+1) we're on legs[i]
      const kLeg = p < 1 ? 0 : p >= S ? S : Math.floor(p);
      const tLeg = p < 1 || p >= S ? 0 : ease(clamp((p - Math.floor(p) - 0.22) / 0.56));
      src.setData({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: doneLine(kLeg, tLeg) } });
    }
  };

  let ticking = false;
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; update(); }); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();

  // ── Lazy-load the map when the section approaches
  const start = async () => {
    try {
      const ml = await import('maplibre-gl');
      ml.setWorkerUrl('/vendor/maplibre/maplibre-gl-worker.mjs'); // self-hosted (see scripts/copy-maplibre-worker.mjs)
      map = new ml.Map({
        container: mapEl,
        style: journeyStyle,
        center: OVERVIEW.center,
        zoom: OVERVIEW.zoom,
        interactive: false,
        attributionControl: { compact: true },
        fadeDuration: 0,
      });
      map.on('error', (e) => console.warn('[journey map]', e?.error?.message ?? e));
      if (import.meta.env.DEV) (window as any).__jmap = map; // dev-only handle for debugging
      map.on('load', async () => {
        map!.addSource('route-all', { type: 'geojson', data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: fullLine } } });
        map!.addSource('route-done', { type: 'geojson', data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [stops[0].pos] } } });
        map!.addLayer({ id: 'route-all', type: 'line', source: 'route-all', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': 'rgba(232,236,238,0.28)', 'line-width': 2, 'line-dasharray': [1.5, 2] } });
        map!.addLayer({ id: 'route-done', type: 'line', source: 'route-done', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#f2c22e', 'line-width': ['interpolate', ['linear'], ['zoom'], 3, 2, 12, 4, 16, 7], 'line-opacity': 0.95 } });

        stops.forEach((s) => {
          const el = document.createElement('div');
          el.className = 'jstop';
          el.innerHTML = `<span class="jstop__dot"></span><span class="jstop__label"></span>`;
          el.querySelector('.jstop__label')!.textContent = s.title;
          new ml.Marker({ element: el }).setLngLat(s.pos).addTo(map!);
          pins.push(el);
        });
        const { createVehicleLayer } = await import('./journey-vehicles');
        const v = createVehicleLayer(map!);
        map!.addLayer(v.layer);
        vehicles = v;
        ready = true;
        active = -2;
        update();
      });
    } catch (err) {
      console.warn('[journey] map unavailable, showing list', err);
      section.classList.add('is-static');
    }
  };
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) { io.disconnect(); start(); }
  }, { rootMargin: '600px 0px' });
  io.observe(section);
}
