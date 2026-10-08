/**
 * Desk hero behaviour:
 *  - sizes the scene to cover the viewport while keeping the focus point visible
 *  - warps the project screen onto the photo's four screen corners (matrix3d)
 *  - switches projects with buttons or ← → keys
 */
type Pt = [number, number];
type Project = { name: string; type: string; image: string; href: string };

const SW = 1600; // the screen element's own size before warping
const SH = 1000;

/** CSS matrix3d that maps a w×h box onto the quad p0 (top-left) … p3 (bottom-left). */
function quadMatrix(w: number, h: number, [p0, p1, p2, p3]: Pt[]) {
  const [x0, y0] = p0, [x1, y1] = p1, [x2, y2] = p2, [x3, y3] = p3;
  const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
  let a, b, c, d, e, f, g, k;
  if (Math.abs(dx3) < 1e-9 && Math.abs(dy3) < 1e-9) {
    a = x1 - x0; b = x3 - x0; c = x0; d = y1 - y0; e = y3 - y0; f = y0; g = 0; k = 0;
  } else {
    const den = dx1 * dy2 - dx2 * dy1;
    g = (dx3 * dy2 - dx2 * dy3) / den;
    k = (dx1 * dy3 - dx3 * dy1) / den;
    a = x1 - x0 + g * x1; b = x3 - x0 + k * x3; c = x0;
    d = y1 - y0 + g * y1; e = y3 - y0 + k * y3; f = y0;
  }
  return `matrix3d(${[a / w, d / w, 0, g / w, b / h, e / h, 0, k / h, 0, 0, 1, 0, c, f, 0, 1].join(',')})`;
}

export function initDesk() {
  const root = document.querySelector<HTMLElement>('[data-desk]');
  if (!root) return;
  const scene = root.querySelector<HTMLElement>('[data-scene]')!;
  const screen = root.querySelector<HTMLElement>('[data-screen-el]')!;
  const shots = Array.from(root.querySelectorAll<HTMLElement>('[data-shot]'));
  const projects: Project[] = JSON.parse(document.getElementById('desk-projects')?.textContent ?? '[]');
  const ratio = Number(root.dataset.ratio) || 1.5;
  const corners: Pt[] = JSON.parse(root.dataset.screen ?? '[]');
  const focus: Pt = JSON.parse(root.dataset.focus ?? '[50,50]');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  const layout = () => {
    const vw = root.clientWidth;
    const vh = root.clientHeight;
    // cover the viewport
    let w = vw, h = vw / ratio;
    if (h < vh) { h = vh; w = vh * ratio; }
    // keep the focus point centred where possible, never showing an edge
    const fx = (focus[0] / 100) * w, fy = (focus[1] / 100) * h;
    const left = Math.min(0, Math.max(vw - w, vw / 2 - fx));
    const top = Math.min(0, Math.max(vh - h, vh / 2 - fy));
    Object.assign(scene.style, { width: `${w}px`, height: `${h}px`, left: `${left}px`, top: `${top}px`, translate: 'none', aspectRatio: 'auto' });
    // warp the screen onto the photo's corners
    const pts = corners.map(([x, y]) => [(x / 100) * w, (y / 100) * h] as Pt);
    Object.assign(screen.style, { left: '0', top: '0', width: `${SW}px`, height: `${SH}px`, transform: quadMatrix(SW, SH, pts) });
  };
  layout();
  new ResizeObserver(layout).observe(root);

  // ── project switching
  let i = 0;
  const $ = (s: string) => root.querySelector<HTMLElement>(s);
  const show = (n: number) => {
    i = (n + projects.length) % projects.length;
    shots.forEach((s, k) => s.classList.toggle('is-on', k === i));
    const p = projects[i];
    $('[data-count]')!.textContent = String(i + 1).padStart(2, '0');
    $('[data-name]')!.textContent = p.name;
    $('[data-type]')!.textContent = p.type;
    const view = $('[data-view]') as HTMLAnchorElement | null;
    if (view) { view.hidden = !p.href; if (p.href) view.href = p.href; }
  };
  $('[data-next]')?.addEventListener('click', () => show(i + 1));
  $('[data-prev]')?.addEventListener('click', () => show(i - 1));
  document.addEventListener('keydown', (e) => {
    if (projects.length < 2) return;
    const t = e.target as HTMLElement;
    if (t.closest('input, textarea, select, [contenteditable]')) return;
    if (root.getBoundingClientRect().bottom < 0) return;
    if (e.key === 'ArrowRight') show(i + 1);
    if (e.key === 'ArrowLeft') show(i - 1);
  });
  if (reduce.matches) shots.forEach((s) => (s.style.transition = 'none'));
}
