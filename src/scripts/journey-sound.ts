/**
 * Journey sounds — synthesised with Web Audio (no audio files to download).
 *   takeoff(ms): a jet spooling up, roaring past and fading out
 *   honk():      a danfo's double "poo-poo"
 *   startMusic() / stopMusic(): a quiet lo-fi loop under the journey
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

  duckMusic(true); window.setTimeout(() => duckMusic(false), dur * 1000);
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
  duckMusic(true); window.setTimeout(() => duckMusic(false), 700);
}

/* ── Background music ─────────────────────────────────────────────────────────
 * A slow, warm lo-fi loop composed live: four soft seventh chords (Fmaj7 → Em7 →
 * Dm9 → Cmaj7), a round bass, a brushed beat at 84 bpm, all through a gentle
 * reverb and a warm low-pass. Very quiet; it ducks under the jet and the honk.
 */
let music: { stop: () => void; duck: (on: boolean) => void } | null = null;
const MUSIC_LEVEL = 0.16;

const reverb = (c: AudioContext, seconds = 3.2) => {
  const len = Math.floor(c.sampleRate * seconds);
  const buf = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
  }
  const conv = c.createConvolver();
  conv.buffer = buf;
  return conv;
};
const hz = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

export function startMusic() {
  if (!ctx || !master || music) return;
  const c = ctx;
  const bus = c.createGain();
  bus.gain.value = 0.0001;
  bus.gain.setTargetAtTime(MUSIC_LEVEL, c.currentTime + 0.2, 1.6); // slow fade in
  const tone = c.createBiquadFilter();
  tone.type = 'lowpass';
  tone.frequency.value = 2200;
  const wet = c.createGain(); wet.gain.value = 0.45;
  const rev = reverb(c);
  bus.connect(tone).connect(master);
  tone.connect(rev).connect(wet).connect(master);

  const BPM = 84, beat = 60 / BPM, bar = beat * 4;
  // chords (MIDI notes) and their bass roots
  const chords = [[53, 57, 60, 64], [52, 55, 59, 62], [50, 53, 57, 60, 64], [48, 52, 55, 59]];
  const roots = [41, 40, 38, 36];
  const hat = (() => { const b = c.createBuffer(1, c.sampleRate * 0.2, c.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return b; })();

  const pad = (t: number, notes: number[]) => {
    for (const n of notes) for (const det of [-6, 6]) {
      const o = c.createOscillator(); o.type = 'triangle'; o.frequency.value = hz(n); o.detune.value = det;
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.05, t + 0.9);
      g.gain.setValueAtTime(0.05, t + bar - 0.6);
      g.gain.linearRampToValueAtTime(0.0001, t + bar + 0.4);
      o.connect(g).connect(bus); o.start(t); o.stop(t + bar + 0.5);
    }
  };
  const bass = (t: number, root: number) => {
    for (const [off, len] of [[0, 1.6], [2.5, 1.2]]) {
      const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = hz(root);
      const g = c.createGain(); const s = t + off * beat;
      g.gain.setValueAtTime(0.0001, s); g.gain.linearRampToValueAtTime(0.22, s + 0.04); g.gain.exponentialRampToValueAtTime(0.0001, s + len * beat);
      o.connect(g).connect(bus); o.start(s); o.stop(s + len * beat + 0.05);
    }
  };
  const kick = (t: number) => {
    const o = c.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.18);
    const g = c.createGain(); g.gain.setValueAtTime(0.32, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
    o.connect(g).connect(bus); o.start(t); o.stop(t + 0.4);
  };
  const brush = (t: number, vol: number, len = 0.08) => {
    const s = c.createBufferSource(); s.buffer = hat;
    const f = c.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 6500;
    const g = c.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    s.connect(f).connect(g).connect(bus); s.start(t); s.stop(t + len + 0.02);
  };
  const snare = (t: number) => brush(t, 0.07, 0.22);

  let next = c.currentTime + 0.1, i = 0, timer = 0;
  const schedule = () => {
    while (next < c.currentTime + 1.2) { // look ahead
      const k = i % 4;
      pad(next, chords[k]); bass(next, roots[k]);
      for (let b = 0; b < 4; b++) {
        const t = next + b * beat;
        if (b === 0 || (b === 2 && k % 2 === 1)) kick(t);
        if (b === 1 || b === 3) snare(t);
        brush(t + beat / 2 + 0.02, 0.025); // swung off-beat shaker
      }
      next += bar; i++;
    }
    timer = window.setTimeout(schedule, 300);
  };
  schedule();
  music = {
    stop: () => {
      window.clearTimeout(timer);
      const n = c.currentTime;
      bus.gain.cancelScheduledValues(n); bus.gain.setTargetAtTime(0.0001, n, 0.6);
      window.setTimeout(() => { bus.disconnect(); wet.disconnect(); }, 3000);
    },
    duck: (on: boolean) => bus.gain.setTargetAtTime(on ? MUSIC_LEVEL * 0.3 : MUSIC_LEVEL, c.currentTime, 0.4),
  };
}
export function stopMusic() { music?.stop(); music = null; }
export function duckMusic(on: boolean) { music?.duck(on); }
