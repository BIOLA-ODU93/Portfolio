/**
 * Journey sounds — synthesised with Web Audio (no audio files to download).
 *   takeoff(ms): a jet spooling up, roaring past and fading out
 *   honk():      a danfo's double "poo-poo"
 * Sound can be switched off; the choice is remembered on this device.
 */
const KEY = 'journey-sound';
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let muted = (() => { try { return localStorage.getItem(KEY) === 'off'; } catch { return false; } })();
let jet: { stop: () => void } | null = null;

/** Create (or wake) the audio context. Call from a click so browsers allow sound. */
export function unlockSound() {
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 1;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
}

export const isMuted = () => muted;
export function setMuted(m: boolean) {
  muted = m;
  try { localStorage.setItem(KEY, m ? 'off' : 'on'); } catch { /* private mode */ }
  if (ctx && master) master.gain.setTargetAtTime(m ? 0 : 1, ctx.currentTime, 0.05);
}

const noise = (c: AudioContext, seconds: number) => {
  const buf = c.createBuffer(1, Math.ceil(c.sampleRate * seconds), c.sampleRate);
  const d = buf.getChannelData(0);
  let b = 0;
  for (let i = 0; i < d.length; i++) { b = 0.97 * b + 0.03 * (Math.random() * 2 - 1); d[i] = b * 6; } // brown-ish
  const src = c.createBufferSource();
  src.buffer = buf;
  return src;
};

/** Jet take-off, shaped to last `ms` (the length of the flight leg). */
export function takeoff(ms: number) {
  if (!ctx || !master || muted) return;
  stopTakeoff();
  const c = ctx, t0 = c.currentTime, dur = Math.max(2.5, ms / 1000);
  const out = c.createGain();
  out.gain.setValueAtTime(0.0001, t0);
  out.gain.exponentialRampToValueAtTime(0.55, t0 + dur * 0.3); // spool up
  out.gain.setValueAtTime(0.55, t0 + dur * 0.45);
  out.gain.exponentialRampToValueAtTime(0.0001, t0 + dur); // climbs away
  out.connect(master);

  // roar: filtered noise whose brightness rises with thrust
  const roar = noise(c, dur + 0.5);
  const bp = c.createBiquadFilter();
  bp.type = 'lowpass';
  bp.frequency.setValueAtTime(250, t0);
  bp.frequency.exponentialRampToValueAtTime(1600, t0 + dur * 0.4);
  bp.frequency.exponentialRampToValueAtTime(400, t0 + dur);
  roar.connect(bp).connect(out);

  // turbine whine
  const whine = c.createOscillator();
  whine.type = 'triangle';
  whine.frequency.setValueAtTime(420, t0);
  whine.frequency.exponentialRampToValueAtTime(1900, t0 + dur * 0.35);
  whine.frequency.exponentialRampToValueAtTime(1500, t0 + dur);
  const wg = c.createGain();
  wg.gain.value = 0.035;
  whine.connect(wg).connect(out);

  roar.start(t0); whine.start(t0);
  roar.stop(t0 + dur + 0.1); whine.stop(t0 + dur + 0.1);
  jet = {
    stop: () => {
      const n = c.currentTime;
      out.gain.cancelScheduledValues(n);
      out.gain.setTargetAtTime(0.0001, n, 0.15);
      roar.stop(n + 0.6); whine.stop(n + 0.6);
    },
  };
}
export function stopTakeoff() { jet?.stop(); jet = null; }

/** Danfo horn: two quick, slightly rough notes. */
export function honk() {
  if (!ctx || !master || muted) return;
  const c = ctx, t0 = c.currentTime;
  const out = c.createGain();
  out.gain.value = 0;
  const lp = c.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 2400;
  const shape = c.createWaveShaper();
  const curve = new Float32Array(256);
  for (let i = 0; i < 256; i++) { const x = (i / 128) - 1; curve[i] = Math.tanh(2.2 * x); }
  shape.curve = curve;
  out.connect(lp).connect(master);
  [[0, 0.16], [0.24, 0.42]].forEach(([a, b]) => {
    out.gain.setValueAtTime(0, t0 + a);
    out.gain.linearRampToValueAtTime(0.22, t0 + a + 0.015);
    out.gain.setValueAtTime(0.22, t0 + b - 0.03);
    out.gain.linearRampToValueAtTime(0, t0 + b);
  });
  for (const f of [392, 494]) { // two horns a third apart, like most car horns
    const o = c.createOscillator();
    o.type = 'sawtooth';
    o.frequency.value = f;
    o.connect(shape);
    o.start(t0); o.stop(t0 + 0.5);
  }
  shape.connect(out);
}
