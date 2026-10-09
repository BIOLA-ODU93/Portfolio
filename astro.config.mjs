// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Set this to your real domain once the site is live (used for canonical URLs).
  site: 'https://example.com',
  vite: {
    // Pre-bundle the map + 3D libraries at startup so the lazy-loaded journey
    // doesn't trigger a dependency re-optimisation mid-session in dev.
    optimizeDeps: { include: ['maplibre-gl', 'three'] },
  },
});
