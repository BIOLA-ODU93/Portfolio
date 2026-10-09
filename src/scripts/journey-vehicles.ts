/**
 * 3D vehicles for the journey map — a danfo, a plane and a car, built from
 * simple shapes in Three.js (no downloaded models, nothing to license).
 *
 * They render inside MapLibre as a custom layer, so they tilt and turn with
 * the camera. Each frame we place the active vehicle at a lng/lat with a
 * heading, and scale it so it stays a readable size on screen at any zoom.
 *
 * Placement works on both the globe and the flat (mercator) map: MapLibre
 * blends between them as you zoom, so we blend the two placements the same way.
 */
import * as THREE from 'three';
import type { CustomLayerInterface, Map as MLMap } from 'maplibre-gl';

export type VehicleKind = 'danfo' | 'plane' | 'car';

const EARTH_R = 6371008.8;
const rad = (d: number) => (d * Math.PI) / 180;

// ── Models (local axes: +X right, +Y forward, +Z up; length ≈ 1 unit along Y)
const mat = (color: number, opts: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.1, side: THREE.DoubleSide, ...opts });

const box = (w: number, l: number, h: number, m: THREE.Material, x = 0, y = 0, z = 0) => {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, l, h), m);
  mesh.position.set(x, y, z);
  return mesh;
};
const wheel = (m: THREE.Material, x: number, y: number, r = 0.075) => {
  const w = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.06, 18), m);
  w.rotation.z = Math.PI / 2; // axle along X
  w.position.set(x, y, r);
  return w;
};
const groundShadow = (w: number, l: number) => {
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(w, l),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35, depthWrite: false, side: THREE.DoubleSide }),
  );
  m.position.z = 0.004;
  return m;
};

function danfo() {
  const g = new THREE.Group();
  const yellow = mat(0xf2c22e), black = mat(0x121212), glass = mat(0x18232d, { roughness: 0.2, metalness: 0.4 }), tyre = mat(0x0b0b0b), chrome = mat(0xb9c0c6, { metalness: 0.6, roughness: 0.3 });
  const W = 0.4, L = 1, H = 0.42, base = 0.07;
  g.add(groundShadow(W * 1.25, L * 1.1));
  g.add(box(W, L, H, yellow, 0, 0, base + H / 2)); // body
  g.add(box(W * 0.94, L * 0.96, 0.03, yellow, 0, -0.01, base + H + 0.015)); // roof
  // the danfo's black stripes, both sides, full length
  for (const s of [-1, 1]) {
    g.add(box(0.012, L * 0.92, 0.035, black, s * (W / 2 + 0.004), 0, base + H * 0.42));
    g.add(box(0.012, L * 0.92, 0.035, black, s * (W / 2 + 0.004), 0, base + H * 0.3));
    // side windows
    g.add(box(0.01, L * 0.62, H * 0.24, glass, s * (W / 2 + 0.002), -0.08, base + H * 0.76));
  }
  g.add(box(W * 0.86, 0.012, H * 0.3, glass, 0, L / 2 + 0.002, base + H * 0.72)); // windscreen
  g.add(box(W * 0.7, 0.012, H * 0.2, glass, 0, -L / 2 - 0.002, base + H * 0.74)); // rear window
  g.add(box(W * 1.02, 0.03, 0.05, chrome, 0, L / 2 + 0.01, base + 0.04)); // front bumper
  g.add(box(W * 1.02, 0.03, 0.05, chrome, 0, -L / 2 - 0.01, base + 0.04)); // rear bumper
  // roof rack
  for (const x of [-0.13, 0.13]) g.add(box(0.012, L * 0.7, 0.012, black, x, -0.05, base + H + 0.05));
  for (const y of [-0.3, -0.05, 0.2]) g.add(box(0.28, 0.012, 0.012, black, 0, y, base + H + 0.05));
  for (const [x, y] of [[-W / 2, 0.32], [W / 2, 0.32], [-W / 2, -0.32], [W / 2, -0.32]]) g.add(wheel(tyre, x, y));
  return g;
}

function car() {
  const g = new THREE.Group();
  const paint = mat(0xe8ecee, { metalness: 0.35, roughness: 0.35 }), glass = mat(0x16202a, { roughness: 0.15, metalness: 0.5 }), tyre = mat(0x0b0b0b);
  const W = 0.42, L = 1;
  g.add(groundShadow(W * 1.25, L * 1.05));
  g.add(box(W, L, 0.2, paint, 0, 0, 0.07 + 0.1)); // lower body
  g.add(box(W * 0.86, L * 0.5, 0.15, glass, 0, -0.06, 0.37 + 0.075 - 0.04)); // cabin glass
  g.add(box(W * 0.84, L * 0.42, 0.02, paint, 0, -0.07, 0.48)); // roof
  g.add(box(W * 0.9, 0.02, 0.04, mat(0xffffff, { emissive: 0xffffff, emissiveIntensity: 0.6 }), 0, L / 2 + 0.005, 0.2)); // headlights
  g.add(box(W * 0.9, 0.02, 0.035, mat(0xb3261e, { emissive: 0xb3261e, emissiveIntensity: 0.5 }), 0, -L / 2 - 0.005, 0.21)); // tail lights
  for (const [x, y] of [[-W / 2, 0.3], [W / 2, 0.3], [-W / 2, -0.3], [W / 2, -0.3]]) g.add(wheel(tyre, x, y, 0.08));
  return g;
}

function plane() {
  const g = new THREE.Group();
  const white = mat(0xeef1f3, { metalness: 0.2, roughness: 0.4 }), grey = mat(0x9aa6b0), accent = mat(0x34566e), glass = mat(0x16202a);
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.05, 0.86, 20), white); // fuselage along Y
  g.add(body);
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.055, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), white);
  nose.position.y = 0.43; g.add(nose);
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.16, 20), white);
  tail.rotation.x = Math.PI; tail.position.y = -0.51; g.add(tail);
  g.add(box(0.09, 0.03, 0.025, glass, 0, 0.42, 0.03)); // cockpit windows
  // wings (swept), tailplane and fin
  const wing = (side: number) => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.08); shape.lineTo(side * 0.55, -0.12); shape.lineTo(side * 0.55, -0.2); shape.lineTo(0, -0.1);
    const m = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.015, bevelEnabled: false }), white);
    m.position.z = -0.01; return m;
  };
  g.add(wing(-1), wing(1));
  const tp = (side: number) => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.33); shape.lineTo(side * 0.2, -0.44); shape.lineTo(side * 0.2, -0.48); shape.lineTo(0, -0.43);
    return new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.01, bevelEnabled: false }), white);
  };
  g.add(tp(-1), tp(1));
  g.add(box(0.014, 0.13, 0.16, accent, 0, -0.44, 0.1)); // tail fin
  for (const x of [-0.2, 0.2]) {
    const eng = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.024, 0.13, 16), grey);
    eng.position.set(x, -0.02, -0.045); g.add(eng);
  }
  g.add(box(0.11, 0.6, 0.005, accent, 0, -0.02, 0.054)); // cheatline on top
  return g;
}

/** Target on-screen length (px) of each vehicle, so they read at any zoom. */
const PX: Record<VehicleKind, number> = { danfo: 74, car: 62, plane: 120 };

export function createVehicleLayer(map: MLMap) {
  const scene = new THREE.Scene();
  const camera = new THREE.Camera();
  const rig = new THREE.Group(); // holds the active vehicle + its lights (lights move with it)
  scene.add(rig);
  const models: Record<VehicleKind, THREE.Group> = { danfo: danfo(), plane: plane(), car: car() };
  for (const m of Object.values(models)) {
    m.visible = false;
    m.traverse((o) => (o.frustumCulled = false)); // our camera matrix is custom; Three's culling would misjudge it
    rig.add(m);
  }
  rig.add(new THREE.HemisphereLight(0xdfe8ee, 0x1a2129, 1.6));
  const sun = new THREE.DirectionalLight(0xffffff, 2.2);
  sun.position.set(-0.6, -0.4, 1.4);
  rig.add(sun, sun.target);
  rig.matrixAutoUpdate = false;

  const state = { lng: 0, lat: 0, heading: 0, kind: 'danfo' as VehicleKind, alt: 0, bank: 0, visible: false };
  let renderer: THREE.WebGLRenderer | null = null;

  const layer: CustomLayerInterface = {
    id: 'journey-vehicles',
    type: 'custom',
    renderingMode: '3d',
    onAdd(_m, gl) {
      renderer = new THREE.WebGLRenderer({ canvas: map.getCanvas(), context: gl as WebGL2RenderingContext, antialias: true });
      renderer.autoClear = false;
    },
    render(_gl, args) {
      if (!renderer || !state.visible) return;
      const pd = args.defaultProjectionData;
      const t = pd.projectionTransition ?? 0; // 1 = globe, 0 = flat
      const zoom = map.getZoom();
      // metres per pixel at this zoom/latitude (512px tiles)
      const mpp = (2 * Math.PI * EARTH_R * Math.cos(rad(state.lat))) / (512 * 2 ** zoom);
      const lengthM = PX[state.kind] * mpp;
      const altM = state.alt * lengthM;

      // local model transform: heading (clockwise from north) + banking for the plane
      const local = new THREE.Matrix4()
        .makeRotationZ(-rad(state.heading))
        .multiply(new THREE.Matrix4().makeRotationY(rad(state.bank)));

      // flat (mercator): x east, y south, z up in mercator units
      const mx = (state.lng + 180) / 360;
      const my = (1 - Math.log(Math.tan(Math.PI / 4 + rad(state.lat) / 2)) / Math.PI) / 2;
      const metre = 1 / (2 * Math.PI * EARTH_R * Math.cos(rad(state.lat))); // mercator units per metre here
      const sM = lengthM * metre;
      const flat = new THREE.Matrix4()
        .makeTranslation(mx, my, altM * metre)
        .multiply(new THREE.Matrix4().makeScale(sM, -sM, sM))
        .multiply(local);

      // globe: unit sphere, x = sin(lng)cos(lat), y = sin(lat), z = cos(lng)cos(lat)
      const sG = lengthM / EARTH_R;
      const globe = new THREE.Matrix4()
        .makeRotationY(rad(state.lng))
        .multiply(new THREE.Matrix4().makeRotationX(-rad(state.lat)))
        .multiply(new THREE.Matrix4().makeTranslation(0, 0, 1 + altM / EARTH_R))
        // surface frame: local +X east, +Y north, +Z up (out of the sphere)
        .multiply(new THREE.Matrix4().makeScale(sG, sG, sG))
        .multiply(local);

      const fb = new THREE.Matrix4().fromArray(pd.fallbackMatrix as unknown as number[]).multiply(flat);
      const mn = new THREE.Matrix4().fromArray(pd.mainMatrix as unknown as number[]).multiply(t > 0 ? globe : flat);
      // MapLibre blends flat → globe positions by t; blending the two full matrices does the same for our mesh
      const e = camera.projectionMatrix.elements;
      for (let i = 0; i < 16; i++) e[i] = t > 0 ? fb.elements[i] * (1 - t) + mn.elements[i] * t : mn.elements[i];
      camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();

      for (const [k, m] of Object.entries(models)) m.visible = k === state.kind;
      renderer.resetState();
      renderer.render(scene, camera);
    },
  };

  return {
    layer,
    set(next: Partial<typeof state>) {
      Object.assign(state, next);
      map.triggerRepaint();
    },
  };
}
