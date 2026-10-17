// Procedural Web Audio API Sound Engine for Bitz's Cloud Nursery
// Zero external audio files required — 100% instant, crisp, and accessible

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.initialized = false;
  }

  init() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.initialized = true;
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  setMuted(muteState) {
    this.muted = Boolean(muteState);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("bitz_sound_muted", JSON.stringify(this.muted));
      } catch (e) {
        // Ignore storage errors
      }
    }
    return this.muted;
  }

  loadSavedMuteState() {
    if (typeof window === "undefined") return false;
    try {
      const saved = window.localStorage.getItem("bitz_sound_muted");
      if (saved !== null) {
        this.muted = JSON.parse(saved);
      }
    } catch (e) {
      // Ignore storage errors
    }
    return this.muted;
  }

  // Soft raindrop / wind-chime click (+3 pts Side Quest)
  playClick(pitchMultiplier = 1) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    const baseFreq = 587.33 * pitchMultiplier; // D5
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.35, now + 0.09);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  // Play a specific musical note for The Raindrop Lullaby Lab (Tier 2)
  playNote(freq = 523.25, duration = 0.45, waveType = "sine") {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = waveType;
    subOsc.type = "triangle";

    osc.frequency.setValueAtTime(freq, now);
    subOsc.frequency.setValueAtTime(freq * 2, now); // Shimmering octave harmonic

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.16, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + duration);

    osc.connect(gain);
    subOsc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    subOsc.start(now);
    osc.stop(now + duration + 0.02);
    subOsc.stop(now + duration + 0.02);
  }

  // Cute bubbly giggle / chirp when poking Bitz
  playGiggle() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playNote(freq, 0.16, "sine");
      }, idx * 65);
    });
  }

  // Secret Rainbow Storm Easter Egg melody
  playSecretLullaby() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const melody = [
      { f: 523.25, d: 0.25, t: 0 },
      { f: 659.25, d: 0.25, t: 180 },
      { f: 783.99, d: 0.25, t: 360 },
      { f: 987.77, d: 0.35, t: 540 },
      { f: 1046.5, d: 0.6, t: 760 },
    ];
    melody.forEach((n) => {
      setTimeout(() => {
        this.playNote(n.f, n.d, "triangle");
      }, n.t);
    });
  }
}

export const soundEngine = new SoundEngine();

// Pure mathematical helper for cursor/touch eye tracking (Tier 1)
export function calculatePupilOffset(eyeCenter, pointer, maxRadius = 7) {
  if (!eyeCenter || !pointer) return { x: 0, y: 0 };
  const dx = pointer.x - eyeCenter.x;
  const dy = pointer.y - eyeCenter.y;
  const distance = Math.hypot(dx, dy);
  if (distance === 0) return { x: 0, y: 0 };

  const angle = Math.atan2(dy, dx);
  const clampedDist = Math.min(distance / 18, maxRadius);

  return {
    x: Number((Math.cos(angle) * clampedDist).toFixed(2)),
    y: Number((Math.sin(angle) * clampedDist).toFixed(2)),
  };
}
