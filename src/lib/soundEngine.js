// Studio-Grade Web Audio API Sound & Music Engine for Bitz's Cloud Nursery
// Features the Iconic Titan Watch Theme (Mozart K.183 Sweet Variations) with
// Celesta Music Box, Expressive Vibrato Flute, Plucked Santoor/Harp Arpeggios & Stereo Echo

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.echoBus = null;
    this.muted = false;
    this.initialized = false;
    this.lullabyTimers = [];
    this.isPlayingLullaby = false;
  }

  init() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.initialized = true;
        this.setupEchoBus();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  // Creates a warm stereo-like concert hall echo for sweet, mesmerizing ("mantramugdh") tone
  setupEchoBus() {
    if (!this.ctx || this.echoBus) return;
    try {
      const delay = this.ctx.createDelay(1.0);
      const feedback = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      const wetGain = this.ctx.createGain();

      delay.delayTime.setValueAtTime(0.19, this.ctx.currentTime);
      feedback.gain.setValueAtTime(0.28, this.ctx.currentTime);
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2200, this.ctx.currentTime);
      wetGain.gain.setValueAtTime(0.24, this.ctx.currentTime);

      delay.connect(filter);
      filter.connect(feedback);
      feedback.connect(delay);
      filter.connect(wetGain);
      wetGain.connect(this.ctx.destination);

      this.echoBus = delay;
    } catch (e) {
      this.echoBus = null;
    }
  }

  setMuted(muteState) {
    this.muted = Boolean(muteState);
    if (this.muted) {
      this.stopLullaby();
    }
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

  stopLullaby() {
    this.lullabyTimers.forEach((id) => clearTimeout(id));
    this.lullabyTimers = [];
    this.isPlayingLullaby = false;
  }

  // Soft crystal wind-chime click
  playClick(pitchMultiplier = 1) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    const baseFreq = 659.25 * pitchMultiplier; // E5 sweet chime
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.25, now + 0.08);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.11);
  }

  // Multi-voiced studio note player: supports "celesta" (Music Box), "flute" (Warm Vibrato), "harp" (Santoor/Harp)
  playNote(freq = 523.25, duration = 0.45, voice = "celesta", volume = 0.15) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const mainOsc = this.ctx.createOscillator();
    const overtoneOsc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (voice === "flute") {
      // Warm expressive flute/violin tone with gentle vibrato
      mainOsc.type = "triangle";
      overtoneOsc.type = "sine";
      mainOsc.frequency.setValueAtTime(freq, now);
      overtoneOsc.frequency.setValueAtTime(freq * 2, now);

      try {
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(5.5, now);
        lfoGain.gain.setValueAtTime(3.2, now);
        lfo.connect(lfoGain);
        lfoGain.connect(mainOsc.frequency);
        lfo.start(now);
        lfo.stop(now + duration + 0.05);
      } catch (e) {}

      gain.gain.setValueAtTime(0.005, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.045);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + duration);
    } else if (voice === "harp") {
      // Soft plucked Santoor / Harp accompaniment string
      mainOsc.type = "sine";
      overtoneOsc.type = "triangle";
      mainOsc.frequency.setValueAtTime(freq, now);
      overtoneOsc.frequency.setValueAtTime(freq * 1.5, now);

      gain.gain.setValueAtTime(0.005, now);
      gain.gain.linearRampToValueAtTime(volume * 0.65, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + duration * 1.15);
    } else {
      // Default: "celesta" / Music Box bell chime (also compatible with legacy "sine"/"triangle")
      mainOsc.type = "sine";
      overtoneOsc.type = "triangle";
      mainOsc.frequency.setValueAtTime(freq, now);
      overtoneOsc.frequency.setValueAtTime(freq * 2, now);

      gain.gain.setValueAtTime(0.005, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + duration);
    }

    const overtoneGain = this.ctx.createGain();
    overtoneGain.gain.setValueAtTime(voice === "flute" ? 0.18 : 0.28, now);

    mainOsc.connect(gain);
    overtoneOsc.connect(overtoneGain);
    overtoneGain.connect(gain);

    gain.connect(this.ctx.destination);
    if (this.echoBus) {
      gain.connect(this.echoBus);
    }

    mainOsc.start(now);
    overtoneOsc.start(now);
    mainOsc.stop(now + duration + 0.04);
    overtoneOsc.stop(now + duration + 0.04);
  }

  // Cute harmonic giggle arpeggio
  playGiggle() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [587.33, 739.99, 880.0, 1174.66]; // D5, F#5, A5, D6 bright major sparkle
    notes.forEach((freq, idx) => {
      const id = setTimeout(() => {
        this.playNote(freq, 0.22, "celesta", 0.13);
      }, idx * 70);
      this.lullabyTimers.push(id);
    });
  }

  /**
   * ICONIC TITAN WATCH LAUNCH THEME LULLABY (Mozart Symphony No. 25 Sweet Variations)
   * Includes 3 Mesmerizing Variations:
   *  - "var1": Classic Titan Music Box & Santoor Arpeggio (Signature Motif)
   *  - "var2": Sweet Flute & Celesta ("The Joy of Gifting" Lyrical Cantabile)
   *  - "var3": Starlight Symphony Finale (High Celestial Bells & Warm Chords)
   *  - "full": Plays all 3 variations seamlessly with live note callbacks!
   */
  playTitanLullaby(variation = "full", onStepCallback = null, onComplete = null) {
    if (this.muted) {
      onComplete?.();
      return;
    }
    this.init();
    if (!this.ctx) {
      onComplete?.();
      return;
    }

    this.stopLullaby();
    this.isPlayingLullaby = true;

    // Frequencies in G Minor / Bb Major (Original Titan Watch Theme Key)
    const N = {
      G3: 196.0,
      A3: 220.0,
      Bb3: 233.08,
      C4: 261.63,
      D4: 293.66,
      Eb4: 311.13,
      F4: 349.23,
      Fs4: 369.99,
      G4: 392.0,
      A4: 440.0,
      Bb4: 466.16,
      C5: 523.25,
      D5: 587.33,
      Eb5: 622.25,
      F5: 698.46,
      Fs5: 739.99,
      G5: 783.99,
      A5: 880.0,
      Bb5: 932.33,
    };

    // Variation 1: Classic Titan Signature Music Box + Harp Arpeggios
    const var1Score = [
      // Bar 1: Iconic Titan Rising Call (G4 -> Bb4 -> D5 -> G5)
      { t: 0, f: N.G3, d: 0.6, v: "harp", label: "G3 Harp" },
      { t: 0, f: N.G4, d: 0.38, v: "celesta", id: "c5", label: "Titan G4" },
      { t: 180, f: N.Bb3, d: 0.5, v: "harp" },
      { t: 280, f: N.Bb4, d: 0.24, v: "celesta", id: "d5", label: "Sweet Bb4" },
      { t: 460, f: N.D4, d: 0.6, v: "harp" },
      { t: 460, f: N.D5, d: 0.38, v: "celesta", id: "e5", label: "Chime D5" },
      { t: 740, f: N.G5, d: 0.32, v: "celesta", id: "g5", label: "Star G5" },

      // Bar 2: The Signature Baroque Shimmer Turn (F#5 - G5 - A5 - F#5 - G5 - D5 - Bb4 - G4)
      { t: 980, f: N.D4, d: 0.7, v: "harp" },
      { t: 980, f: N.Fs5, d: 0.22, v: "celesta", id: "a5", label: "Sparkle F#5" },
      { t: 1160, f: N.G5, d: 0.22, v: "celesta", id: "c6", label: "Bell G5" },
      { t: 1340, f: N.A5, d: 0.26, v: "celesta", id: "a5", label: "High A5" },
      { t: 1540, f: N.Fs5, d: 0.22, v: "celesta", id: "g5", label: "Turn F#5" },
      { t: 1720, f: N.G5, d: 0.32, v: "celesta", id: "e5", label: "Glow G5" },
      { t: 2000, f: N.D5, d: 0.26, v: "celesta", id: "d5", label: "Drop D5" },
      { t: 2220, f: N.Bb4, d: 0.26, v: "celesta", id: "c5", label: "Warm Bb4" },
      { t: 2440, f: N.G4, d: 0.38, v: "celesta", id: "c5", label: "Home G4" },

      // Bar 3: The Beloved Cascading Sequence (Eb5 - D5 - C5 - Bb4 - A4 - G4 - F#4 - G4)
      { t: 2780, f: N.C4, d: 0.7, v: "harp" },
      { t: 2780, f: N.Eb5, d: 0.28, v: "celesta", id: "a5", label: "Dream Eb5" },
      { t: 3000, f: N.D5, d: 0.24, v: "celesta", id: "g5", label: "Cascade D5" },
      { t: 3200, f: N.C5, d: 0.24, v: "celesta", id: "e5", label: "Cascade C5" },
      { t: 3400, f: N.Bb4, d: 0.24, v: "celesta", id: "d5", label: "Soft Bb4" },
      { t: 3600, f: N.A4, d: 0.24, v: "celesta", id: "c5", label: "Gentle A4" },
      { t: 3800, f: N.G4, d: 0.24, v: "celesta", id: "d5", label: "Breeze G4" },
      { t: 4000, f: N.Fs4, d: 0.24, v: "celesta", id: "e5", label: "Golden F#4" },
      { t: 4220, f: N.G4, d: 0.55, v: "celesta", id: "g5", label: "Rest G4" },
    ];

    // Variation 2: Sweet Flute & Santoor ("The Joy of Gifting" Lyrical Melody)
    const var2Score = [
      { t: 0, f: N.Bb3, d: 0.8, v: "harp" },
      { t: 140, f: N.D4, d: 0.7, v: "harp" },
      { t: 0, f: N.Bb4, d: 0.36, v: "flute", id: "d5", label: "Flute Bb4" },
      { t: 280, f: N.A4, d: 0.22, v: "flute", id: "c5", label: "Flute A4" },
      { t: 480, f: N.Bb4, d: 0.28, v: "flute", id: "d5", label: "Flute Bb4" },
      { t: 720, f: N.C5, d: 0.3, v: "flute", id: "e5", label: "Flute C5" },
      { t: 980, f: N.D5, d: 0.48, v: "flute", id: "g5", label: "Sweet D5" },
      { t: 980, f: N.F4, d: 0.7, v: "harp" },

      { t: 1380, f: N.Eb5, d: 0.34, v: "flute", id: "a5", label: "Silk Eb5" },
      { t: 1380, f: N.G4, d: 0.6, v: "harp" },
      { t: 1660, f: N.D5, d: 0.28, v: "flute", id: "g5", label: "Warm D5" },
      { t: 1900, f: N.C5, d: 0.28, v: "flute", id: "e5", label: "Pure C5" },
      { t: 2140, f: N.Bb4, d: 0.32, v: "flute", id: "d5", label: "Velvet Bb4" },
      { t: 2420, f: N.A4, d: 0.28, v: "flute", id: "c5", label: "Tender A4" },
      { t: 2660, f: N.C5, d: 0.28, v: "celesta", id: "e5", label: "Chime C5" },
      { t: 2900, f: N.Bb4, d: 0.28, v: "flute", id: "d5", label: "Sigh Bb4" },
      { t: 3140, f: N.A4, d: 0.28, v: "flute", id: "c5", label: "Soft A4" },
      { t: 3400, f: N.G4, d: 0.65, v: "flute", id: "g5", label: "Peace G4" },
      { t: 3400, f: N.Bb4, d: 0.65, v: "celesta" },
    ];

    // Variation 3: Starlight Symphony Finale (High Celestial Bells + Lush Harmonic Resolution)
    const var3Score = [
      { t: 0, f: N.G4, d: 0.7, v: "harp" },
      { t: 0, f: N.G5, d: 0.3, v: "celesta", id: "c6", label: "Star G5" },
      { t: 220, f: N.Fs5, d: 0.22, v: "celesta", id: "a5", label: "Twinkle F#5" },
      { t: 420, f: N.G5, d: 0.26, v: "celesta", id: "c6", label: "Crown G5" },
      { t: 640, f: N.A5, d: 0.28, v: "celesta", id: "a5", label: "Halo A5" },
      { t: 880, f: N.Bb5, d: 0.45, v: "celesta", id: "c6", label: "Apex Bb5" },
      { t: 880, f: N.D5, d: 0.5, v: "flute" },

      { t: 1260, f: N.A5, d: 0.26, v: "celesta", id: "a5", label: "Glide A5" },
      { t: 1480, f: N.G5, d: 0.26, v: "celesta", id: "g5", label: "Float G5" },
      { t: 1700, f: N.F5, d: 0.26, v: "celesta", id: "e5", label: "Mist F5" },
      { t: 1920, f: N.Eb5, d: 0.26, v: "celesta", id: "d5", label: "Dew Eb5" },
      { t: 2140, f: N.D5, d: 0.35, v: "flute", id: "c5", label: "Lullaby D5" },

      { t: 2460, f: N.Eb5, d: 0.26, v: "celesta", id: "e5", label: "Feather Eb5" },
      { t: 2680, f: N.D5, d: 0.26, v: "celesta", id: "d5", label: "Pillow D5" },
      { t: 2900, f: N.C5, d: 0.26, v: "celesta", id: "c5", label: "Cloud C5" },
      { t: 3120, f: N.Bb4, d: 0.28, v: "flute", id: "d5", label: "Moon Bb4" },
      { t: 3360, f: N.A4, d: 0.3, v: "celesta", id: "e5", label: "Star A4" },
      // Final Dreamy Chord (G4 + Bb4 + D5 + G5)
      { t: 3660, f: N.G3, d: 1.2, v: "harp" },
      { t: 3720, f: N.D4, d: 1.1, v: "harp" },
      { t: 3780, f: N.Bb4, d: 1.0, v: "flute" },
      { t: 3820, f: N.D5, d: 1.0, v: "celesta" },
      { t: 3860, f: N.G5, d: 1.2, v: "celesta", id: "c6", label: "Titan Finale ✨" },
    ];

    let fullEvents = [];
    if (variation === "var1") {
      fullEvents = var1Score;
    } else if (variation === "var2") {
      fullEvents = var2Score;
    } else if (variation === "var3") {
      fullEvents = var3Score;
    } else {
      // "full" suite: combines Var 1 + Var 2 + Var 3 seamlessly!
      const offset2 = 4750;
      const offset3 = 8800;
      fullEvents = [
        ...var1Score,
        ...var2Score.map((ev) => ({ ...ev, t: ev.t + offset2 })),
        ...var3Score.map((ev) => ({ ...ev, t: ev.t + offset3 })),
      ];
    }

    let maxTime = 0;
    fullEvents.forEach((ev) => {
      if (ev.t > maxTime) maxTime = ev.t;
      const timerId = setTimeout(() => {
        if (this.muted || !this.isPlayingLullaby) return;
        this.playNote(ev.f, ev.d, ev.v || "celesta", ev.v === "harp" ? 0.11 : 0.15);
        if (ev.id && onStepCallback) {
          onStepCallback(ev);
        }
      }, ev.t);
      this.lullabyTimers.push(timerId);
    });

    const endTimer = setTimeout(() => {
      this.isPlayingLullaby = false;
      onComplete?.();
    }, maxTime + 900);
    this.lullabyTimers.push(endTimer);
  }

  // Secret Rainbow Storm Easter Egg melody (Uses Variation 3 Celestial Finale)
  playSecretLullaby() {
    this.playTitanLullaby("var3");
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
