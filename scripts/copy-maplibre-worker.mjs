// Copies MapLibre's web-worker files into /public so the map can load them
// from our own site (no CDN). Runs automatically before `dev` and `build`.
import { copyFileSync, mkdirSync } from 'node:fs';
const from = 'node_modules/maplibre-gl/dist/';
const to = 'public/vendor/maplibre/';
mkdirSync(to, { recursive: true });
for (const f of ['maplibre-gl-worker.mjs', 'maplibre-gl-shared.mjs']) copyFileSync(from + f, to + f);
console.log('[maplibre] worker files copied to', to);
