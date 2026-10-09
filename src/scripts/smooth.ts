/**
 * Site-wide smooth scrolling (Lenis). Off when the visitor prefers reduced motion.
 * Exposes stop()/start() so overlays (like the journey map) can freeze the page.
 */
import Lenis from 'lenis';

let lenis: Lenis | null = null;

export function initSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  lenis = new Lenis({ duration: 1.15, smoothWheel: true, anchors: true });
  const raf = (time: number) => { lenis?.raf(time); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
}
export const pauseScroll = () => lenis?.stop();
export const resumeScroll = () => lenis?.start();
