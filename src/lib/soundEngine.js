// Studio-Grade Web Audio API Sound & Orchestra Engine for Bitz's Cloud Nursery
// Features the 1773 Mozart Symphony No. 25 (K. 183) Lullaby Suite with
// Expressive Bowed Violin, Concert Grand Piano, Sweet Flute, Celesta Music Box & Harp

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.echoBus = null;
    this.muted = false;
    this.initialized = false;
    this.lullabyTimers = [];
    this.effectTimers = [];
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

  // Warm concert-hall stereo echo bus for sweet, mesmerizing ("mantramugdh") acoustics
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
      wetGain.gain.setValueAtTime(0.25, this.ctx.currentTime);

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
    const baseFreq = 659.25 * pitchMultiplier;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.25, now + 0.08);

    gain.gain.setValueAtTime(0.075, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.11);
  }

  /**
   * Multi-Instrument Studio Synthesizer:
   * Supports "violin", "piano", "flute", "celesta", and "harp"
   */
  playNote(freq = 523.25, duration = 0.45, voice = "celesta", volume = 0.15) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const mainOsc = this.ctx.createOscillator();
    const overtoneOsc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const overtoneGain = this.ctx.createGain();

    if (voice === "violin") {
      // Expressive Bowed Solo Violin: sawtooth + triangle through wooden body formant filter + vibrato
      mainOsc.type = "sawtooth";
      overtoneOsc.type = "triangle";
      mainOsc.frequency.setValueAtTime(freq, now);
      overtoneOsc.frequency.setValueAtTime(freq, now);
      overtoneGain.gain.setValueAtTime(0.55, now);

      try {
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(5.8, now);
        lfoGain.gain.setValueAtTime(3.6, now);
        lfo.connect(lfoGain);
        lfoGain.connect(mainOsc.frequency);
        lfoGain.connect(overtoneOsc.frequency);
        lfo.start(now);
        lfo.stop(now + duration + 0.06);
      } catch (e) {}

      let targetNode = gain;
      try {
        const bodyFilter = this.ctx.createBiquadFilter();
        bodyFilter.type = "lowpass";
        bodyFilter.frequency.setValueAtTime(1850, now);
        bodyFilter.Q.setValueAtTime(1.4, now);
        mainOsc.connect(bodyFilter);
        overtoneOsc.connect(overtoneGain);
        overtoneGain.connect(bodyFilter);
        bodyFilter.connect(gain);
        targetNode = null;
      } catch (e) {}

      if (targetNode) {
        mainOsc.connect(gain);
        overtoneOsc.connect(overtoneGain);
        overtoneGain.connect(gain);
      }

      // Smooth bowed attack & warm sustain
      gain.gain.setValueAtTime(0.004, now);
      gain.gain.linearRampToValueAtTime(volume * 0.9, now + Math.min(0.065, duration * 0.3));
      gain.gain.exponentialRampToValueAtTime(0.0008, now + duration + 0.03);
    } else if (voice === "piano") {
      // Concert Grand Piano: crisp hammer strike + warm 2x harmonic + dynamic filter decay
      mainOsc.type = "triangle";
      overtoneOsc.type = "sine";
      mainOsc.frequency.setValueAtTime(freq, now);
      overtoneOsc.frequency.setValueAtTime(freq * 2, now);
      overtoneGain.gain.setValueAtTime(0.32, now);

      let targetNode = gain;
      try {
        const pianoFilter = this.ctx.createBiquadFilter();
        pianoFilter.type = "lowpass";
        pianoFilter.frequency.setValueAtTime(2800, now);
        pianoFilter.frequency.exponentialRampToValueAtTime(1050, now + duration);
        mainOsc.connect(pianoFilter);
        overtoneOsc.connect(overtoneGain);
        overtoneGain.connect(pianoFilter);
        pianoFilter.connect(gain);
        targetNode = null;
      } catch (e) {}

      if (targetNode) {
        mainOsc.connect(gain);
        overtoneOsc.connect(overtoneGain);
        overtoneGain.connect(gain);
      }

      gain.gain.setValueAtTime(0.005, now);
      gain.gain.linearRampToValueAtTime(volume * 1.05, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + duration);
    } else if (voice === "flute") {
      // Sweet Bansuri / Concert Flute with soft breathy vibrato
      mainOsc.type = "triangle";
      overtoneOsc.type = "sine";
      mainOsc.frequency.setValueAtTime(freq, now);
      overtoneOsc.frequency.setValueAtTime(freq * 2, now);
      overtoneGain.gain.setValueAtTime(0.18, now);

      try {
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(5.4, now);
        lfoGain.gain.setValueAtTime(3.0, now);
        lfo.connect(lfoGain);
        lfoGain.connect(mainOsc.frequency);
        lfo.start(now);
        lfo.stop(now + duration + 0.05);
      } catch (e) {}

      mainOsc.connect(gain);
      overtoneOsc.connect(overtoneGain);
      overtoneGain.connect(gain);

      gain.gain.setValueAtTime(0.005, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.045);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + duration);
    } else if (voice === "harp") {
      // Plucked Harp / Santoor string
      mainOsc.type = "sine";
      overtoneOsc.type = "triangle";
      mainOsc.frequency.setValueAtTime(freq, now);
      overtoneOsc.frequency.setValueAtTime(freq * 1.5, now);
      overtoneGain.gain.setValueAtTime(0.24, now);

      mainOsc.connect(gain);
      overtoneOsc.connect(overtoneGain);
      overtoneGain.connect(gain);

      gain.gain.setValueAtTime(0.005, now);
      gain.gain.linearRampToValueAtTime(volume * 0.68, now + 0.014);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + duration * 1.15);
    } else {
      // Crystal Celesta / Music Box Chime
      mainOsc.type = "sine";
      overtoneOsc.type = "triangle";
      mainOsc.frequency.setValueAtTime(freq, now);
      overtoneOsc.frequency.setValueAtTime(freq * 2, now);
      overtoneGain.gain.setValueAtTime(0.28, now);

      mainOsc.connect(gain);
      overtoneOsc.connect(overtoneGain);
      overtoneGain.connect(gain);

      gain.gain.setValueAtTime(0.005, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + duration);
    }

    gain.connect(this.ctx.destination);
    if (this.echoBus) {
      gain.connect(this.echoBus);
    }

    mainOsc.start(now);
    overtoneOsc.start(now);
    mainOsc.stop(now + duration + 0.05);
    overtoneOsc.stop(now + duration + 0.05);
  }

  // 1. TUMMY TICKLE MELODY: Joyful 10-Note Piano, Violin & Music-Box Rondo!
  playGiggle() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const rondo = [
      { t: 0, f: 523.25, d: 0.22, v: "piano" },      // C5 Piano
      { t: 0, f: 261.63, d: 0.45, v: "harp" },       // C4 Harp
      { t: 110, f: 659.25, d: 0.22, v: "piano" },    // E5 Piano
      { t: 220, f: 783.99, d: 0.24, v: "violin" },   // G5 Violin
      { t: 340, f: 1046.5, d: 0.3, v: "celesta" },   // C6 Chime
      { t: 340, f: 523.25, d: 0.4, v: "violin" },    // C5 Violin warmth
      { t: 500, f: 880.0, d: 0.22, v: "piano" },     // A5 Piano
      { t: 620, f: 1046.5, d: 0.22, v: "violin" },   // C6 Violin
      { t: 740, f: 1174.66, d: 0.25, v: "celesta" }, // D6 Chime
      { t: 880, f: 1318.51, d: 0.5, v: "violin" },   // E6 Violin & Piano finish
      { t: 880, f: 659.25, d: 0.5, v: "piano" },
    ];
    rondo.forEach((n) => {
      const id = setTimeout(() => {
        this.playNote(n.f, n.d, n.v, 0.14);
      }, n.t);
      this.effectTimers.push(id);
    });
  }

  // 2. WAVE MOON LANTERN MELODY: Dreamy 8-Note Violin, Piano & Flute Arpeggio
  playMoonWaveMelody() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const phrase = [
      { t: 0, f: 392.0, d: 0.5, v: "piano" },        // G4 Piano
      { t: 0, f: 587.33, d: 0.32, v: "violin" },     // D5 Violin
      { t: 160, f: 739.99, d: 0.28, v: "piano" },    // F#5 Piano
      { t: 320, f: 880.0, d: 0.32, v: "violin" },    // A5 Violin
      { t: 480, f: 1174.66, d: 0.38, v: "celesta" }, // D6 Chime
      { t: 480, f: 587.33, d: 0.55, v: "piano" },    // D5 Piano
      { t: 700, f: 1046.5, d: 0.28, v: "flute" },    // C6 Flute
      { t: 880, f: 880.0, d: 0.3, v: "violin" },     // A5 Violin
      { t: 1060, f: 1174.66, d: 0.6, v: "violin" },  // D6 Violin
      { t: 1060, f: 739.99, d: 0.6, v: "piano" },    // F#5 Piano harmony
    ];
    phrase.forEach((n) => {
      const id = setTimeout(() => {
        this.playNote(n.f, n.d, n.v, 0.14);
      }, n.t);
      this.effectTimers.push(id);
    });
  }

  // 3. GOLDEN STAR-BELL MELODY: Escalating Chime, Piano & Violin Cascades
  playStarBellMelody(clickStep = 1) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    if (clickStep === 1) {
      const bell1 = [
        { t: 0, f: 587.33, d: 0.4, v: "piano" },
        { t: 0, f: 880.0, d: 0.26, v: "celesta" },
        { t: 130, f: 1174.66, d: 0.26, v: "violin" },
        { t: 260, f: 1479.98, d: 0.3, v: "celesta" },
        { t: 400, f: 1174.66, d: 0.28, v: "piano" },
        { t: 540, f: 1567.98, d: 0.55, v: "violin" },
      ];
      bell1.forEach((n) => {
        const id = setTimeout(() => this.playNote(n.f, n.d, n.v, 0.14), n.t);
        this.effectTimers.push(id);
      });
    } else {
      const bell2 = [
        { t: 0, f: 392.0, d: 0.6, v: "piano" },
        { t: 0, f: 783.99, d: 0.24, v: "violin" },
        { t: 120, f: 987.77, d: 0.24, v: "piano" },
        { t: 240, f: 1174.66, d: 0.24, v: "violin" },
        { t: 360, f: 1567.98, d: 0.28, v: "celesta" },
        { t: 500, f: 1479.98, d: 0.26, v: "violin" },
        { t: 640, f: 1567.98, d: 0.26, v: "piano" },
        { t: 780, f: 1760.0, d: 0.6, v: "celesta" },
        { t: 780, f: 880.0, d: 0.6, v: "violin" },
      ];
      bell2.forEach((n) => {
        const id = setTimeout(() => this.playNote(n.f, n.d, n.v, 0.14), n.t);
        this.effectTimers.push(id);
      });
    }
  }

  // 4. DRESS-UP ACCESSORY JINGLE
  playAccessoryMelody(accessoryId = "bow") {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const melodies = {
      bow: [523.25, 659.25, 783.99, 1046.5],
      crown: [587.33, 739.99, 880.0, 1174.66],
      headphones: [440.0, 523.25, 659.25, 880.0],
      pacifier: [659.25, 587.33, 523.25, 783.99],
    };
    const notes = melodies[accessoryId] || melodies.bow;
    notes.forEach((freq, idx) => {
      const id = setTimeout(() => {
        this.playNote(freq, 0.28, idx % 2 === 0 ? "piano" : "violin", 0.14);
      }, idx * 95);
      this.effectTimers.push(id);
    });
  }

  // 5. COLLECTOR CARD HARMONIC CHORD (Piano + Violin + Celesta Triad)
  playCardChord(cardIndex = 0) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const chords = [
      [523.25, 659.25, 783.99],
      [587.33, 739.99, 880.0],
      [659.25, 783.99, 987.77],
      [698.46, 880.0, 1046.5],
      [783.99, 987.77, 1174.66],
    ];
    const voices = ["piano", "celesta", "violin"];
    const triad = chords[cardIndex % chords.length];
    triad.forEach((freq, idx) => {
      const id = setTimeout(() => {
        this.playNote(freq, 0.38, voices[idx], 0.13);
      }, idx * 75);
      this.effectTimers.push(id);
    });
  }

  /**
   * 1773 MOZART SYMPHONY NO. 25 (K. 183) ORCHESTRAL LULLABY SUITE
   * 100% Public Domain Classical Masterpiece with 4 Multi-Instrument Variations:
   *  - "var1": 🎻 Solo Violin & 🎹 Grand Piano Duet (Signature 1773 Motif)
   *  - "var2": 🎹 Grand Piano & 🪈 Sweet Flute (Lyrical Cantabile Variation)
   *  - "var3": 🔔 Crystal Music Box & 🪕 Harp (Dreamy Cascading Variation)
   *  - "var4": 🌟 Full Orchestra Finale (Violin + Piano + Flute + Celesta Bells)
   *  - "full": Plays all 4 orchestral variations seamlessly!
   */
  playCloudLullaby(variation = "full", onStepCallback = null, onComplete = null) {
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

    // VARIATION 1: 🎻 Expressive Violin & 🎹 Grand Piano Duet (1773 Signature Opening)
    const var1Score = [
      // Bar 1: Violin plays the iconic rising call while Grand Piano plays Alberti bass chords
      { t: 0, f: N.G3, d: 0.45, v: "piano" },
      { t: 0, f: N.G4, d: 0.4, v: "violin", id: "c5", label: "🎻 Violin G4" },
      { t: 180, f: N.Bb3, d: 0.35, v: "piano" },
      { t: 280, f: N.Bb4, d: 0.26, v: "violin", id: "d5", label: "🎻 Violin Bb4" },
      { t: 460, f: N.D4, d: 0.45, v: "piano" },
      { t: 460, f: N.D5, d: 0.4, v: "violin", id: "e5", label: "🎻 Violin D5" },
      { t: 640, f: N.G4, d: 0.35, v: "piano" },
      { t: 740, f: N.G5, d: 0.34, v: "violin", id: "g5", label: "🎻 Violin G5" },

      // Bar 2: Signature 1773 Baroque Turn (Violin + Grand Piano Harmony)
      { t: 980, f: N.D4, d: 0.65, v: "piano" },
      { t: 980, f: N.A4, d: 0.55, v: "piano" },
      { t: 980, f: N.Fs5, d: 0.24, v: "violin", id: "a5", label: "🎻 Violin F#5" },
      { t: 1160, f: N.G5, d: 0.24, v: "violin", id: "c6", label: "🎻 Violin G5" },
      { t: 1340, f: N.A5, d: 0.28, v: "violin", id: "a5", label: "🎻 Violin A5" },
      { t: 1540, f: N.Fs5, d: 0.24, v: "violin", id: "g5", label: "🎻 Violin F#5" },
      { t: 1720, f: N.G5, d: 0.34, v: "violin", id: "e5", label: "🎻 Violin G5" },
      { t: 1720, f: N.Bb4, d: 0.45, v: "piano" },
      { t: 2000, f: N.D5, d: 0.28, v: "piano", id: "d5", label: "🎹 Piano D5" },
      { t: 2220, f: N.Bb4, d: 0.28, v: "piano", id: "c5", label: "🎹 Piano Bb4" },
      { t: 2440, f: N.G4, d: 0.4, v: "violin", id: "c5", label: "🎻 Violin G4" },

      // Bar 3: Grand Piano & Violin Cascading Sequence (Eb5 - D5 - C5 - Bb4 - A4 - G4 - F#4 - G4)
      { t: 2780, f: N.C4, d: 0.65, v: "piano" },
      { t: 2780, f: N.G4, d: 0.55, v: "piano" },
      { t: 2780, f: N.Eb5, d: 0.3, v: "violin", id: "a5", label: "🎻 Violin Eb5" },
      { t: 3000, f: N.D5, d: 0.26, v: "piano", id: "g5", label: "🎹 Piano D5" },
      { t: 3200, f: N.C5, d: 0.26, v: "violin", id: "e5", label: "🎻 Violin C5" },
      { t: 3400, f: N.Bb4, d: 0.26, v: "piano", id: "d5", label: "🎹 Piano Bb4" },
      { t: 3600, f: N.A4, d: 0.26, v: "violin", id: "c5", label: "🎻 Violin A4" },
      { t: 3800, f: N.G4, d: 0.26, v: "piano", id: "d5", label: "🎹 Piano G4" },
      { t: 4000, f: N.Fs4, d: 0.26, v: "violin", id: "e5", label: "🎻 Violin F#4" },
      { t: 4220, f: N.G4, d: 0.58, v: "violin", id: "g5", label: "🎻🎹 Duet G4" },
      { t: 4220, f: N.Bb4, d: 0.58, v: "piano" },
    ];

    // VARIATION 2: 🎹 Grand Piano & 🪈 Sweet Flute (Lyrical Cantabile Melody)
    const var2Score = [
      { t: 0, f: N.Bb3, d: 0.7, v: "piano" },
      { t: 140, f: N.F4, d: 0.6, v: "piano" },
      { t: 0, f: N.Bb4, d: 0.36, v: "piano", id: "d5", label: "🎹 Piano Bb4" },
      { t: 280, f: N.A4, d: 0.24, v: "flute", id: "c5", label: "🪈 Flute A4" },
      { t: 480, f: N.Bb4, d: 0.28, v: "piano", id: "d5", label: "🎹 Piano Bb4" },
      { t: 720, f: N.C5, d: 0.3, v: "flute", id: "e5", label: "🪈 Flute C5" },
      { t: 980, f: N.D5, d: 0.48, v: "violin", id: "g5", label: "🎻 Violin D5" },
      { t: 980, f: N.Bb3, d: 0.65, v: "piano" },

      { t: 1380, f: N.Eb5, d: 0.34, v: "flute", id: "a5", label: "🪈 Flute Eb5" },
      { t: 1380, f: N.Eb4, d: 0.6, v: "piano" },
      { t: 1660, f: N.D5, d: 0.28, v: "piano", id: "g5", label: "🎹 Piano D5" },
      { t: 1900, f: N.C5, d: 0.28, v: "flute", id: "e5", label: "🪈 Flute C5" },
      { t: 2140, f: N.Bb4, d: 0.32, v: "piano", id: "d5", label: "🎹 Piano Bb4" },
      { t: 2420, f: N.A4, d: 0.28, v: "violin", id: "c5", label: "🎻 Violin A4" },
      { t: 2660, f: N.C5, d: 0.28, v: "piano", id: "e5", label: "🎹 Piano C5" },
      { t: 2900, f: N.Bb4, d: 0.28, v: "flute", id: "d5", label: "🪈 Flute Bb4" },
      { t: 3140, f: N.A4, d: 0.28, v: "piano", id: "c5", label: "🎹 Piano A4" },
      { t: 3400, f: N.G4, d: 0.65, v: "violin", id: "g5", label: "🎻🎹 Harmony G4" },
      { t: 3400, f: N.D4, d: 0.65, v: "piano" },
    ];

    // VARIATION 3: 🔔 Crystal Music Box & 🪕 Harp (Dreamy Nursery Cascade)
    const var3Score = [
      { t: 0, f: N.C4, d: 0.65, v: "harp" },
      { t: 0, f: N.Eb5, d: 0.28, v: "celesta", id: "a5", label: "🔔 Chime Eb5" },
      { t: 220, f: N.D5, d: 0.24, v: "celesta", id: "g5", label: "🔔 Chime D5" },
      { t: 440, f: N.C5, d: 0.24, v: "celesta", id: "e5", label: "🔔 Chime C5" },
      { t: 660, f: N.Bb4, d: 0.26, v: "celesta", id: "d5", label: "🔔 Chime Bb4" },
      { t: 880, f: N.A4, d: 0.28, v: "flute", id: "c5", label: "🪈 Flute A4" },
      { t: 880, f: N.D4, d: 0.6, v: "harp" },

      { t: 1160, f: N.C5, d: 0.28, v: "celesta", id: "e5", label: "🔔 Chime C5" },
      { t: 1380, f: N.Bb4, d: 0.24, v: "celesta", id: "d5", label: "🔔 Chime Bb4" },
      { t: 1600, f: N.A4, d: 0.24, v: "celesta", id: "c5", label: "🔔 Chime A4" },
      { t: 1820, f: N.G4, d: 0.26, v: "piano", id: "d5", label: "🎹 Piano G4" },
      { t: 2040, f: N.Fs4, d: 0.26, v: "violin", id: "e5", label: "🎻 Violin F#4" },
      { t: 2260, f: N.G4, d: 0.3, v: "celesta", id: "g5", label: "🔔 Chime G4" },
      { t: 2500, f: N.A4, d: 0.3, v: "piano", id: "a5", label: "🎹 Piano A4" },
      { t: 2740, f: N.D4, d: 0.6, v: "violin", id: "c5", label: "🎻 Violin D4" },
      { t: 2740, f: N.A4, d: 0.6, v: "harp" },
    ];

    // VARIATION 4: 🌟 Full Symphony Orchestra Finale (Violin + Grand Piano + Flute + Celesta)
    const var4Score = [
      { t: 0, f: N.G3, d: 0.75, v: "piano" },
      { t: 0, f: N.D4, d: 0.75, v: "harp" },
      { t: 0, f: N.G5, d: 0.32, v: "violin", id: "c6", label: "🎻 Violin G5" },
      { t: 220, f: N.Fs5, d: 0.24, v: "piano", id: "a5", label: "🎹 Piano F#5" },
      { t: 420, f: N.G5, d: 0.26, v: "violin", id: "c6", label: "🎻 Violin G5" },
      { t: 640, f: N.A5, d: 0.28, v: "celesta", id: "a5", label: "🔔 Bell A5" },
      { t: 880, f: N.Bb5, d: 0.45, v: "violin", id: "c6", label: "🎻 Violin Bb5" },
      { t: 880, f: N.D5, d: 0.5, v: "piano" },
      { t: 880, f: N.G4, d: 0.5, v: "flute" },

      { t: 1260, f: N.A5, d: 0.26, v: "piano", id: "a5", label: "🎹 Piano A5" },
      { t: 1480, f: N.G5, d: 0.26, v: "violin", id: "g5", label: "🎻 Violin G5" },
      { t: 1700, f: N.F5, d: 0.26, v: "flute", id: "e5", label: "🪈 Flute F5" },
      { t: 1920, f: N.Eb5, d: 0.26, v: "piano", id: "d5", label: "🎹 Piano Eb5" },
      { t: 2140, f: N.D5, d: 0.35, v: "violin", id: "c5", label: "🎻 Violin D5" },

      { t: 2460, f: N.Eb5, d: 0.26, v: "celesta", id: "e5", label: "🔔 Bell Eb5" },
      { t: 2680, f: N.D5, d: 0.26, v: "violin", id: "d5", label: "🎻 Violin D5" },
      { t: 2900, f: N.C5, d: 0.26, v: "piano", id: "c5", label: "🎹 Piano C5" },
      { t: 3120, f: N.Bb4, d: 0.28, v: "flute", id: "d5", label: "🪈 Flute Bb4" },
      { t: 3360, f: N.A4, d: 0.3, v: "violin", id: "e5", label: "🎻 Violin A4" },
      // Grand Orchestral Finale Chord (Piano + Violin + Flute + Celesta + Harp)
      { t: 3660, f: N.G3, d: 1.25, v: "piano" },
      { t: 3700, f: N.D4, d: 1.2, v: "harp" },
      { t: 3740, f: N.G4, d: 1.15, v: "piano" },
      { t: 3780, f: N.Bb4, d: 1.1, v: "flute" },
      { t: 3820, f: N.D5, d: 1.1, v: "violin" },
      { t: 3860, f: N.G5, d: 1.25, v: "celesta", id: "c6", label: "🌟 Orchestra Finale ✨" },
    ];

    let fullEvents = [];
    if (variation === "var1") {
      fullEvents = var1Score;
    } else if (variation === "var2") {
      fullEvents = var2Score;
    } else if (variation === "var3") {
      fullEvents = var3Score;
    } else if (variation === "var4") {
      fullEvents = var4Score;
    } else {
      // "full" suite: combines all 4 Orchestral Variations seamlessly!
      const offset2 = 4850;
      const offset3 = 8950;
      const offset4 = 12350;
      fullEvents = [
        ...var1Score,
        ...var2Score.map((ev) => ({ ...ev, t: ev.t + offset2 })),
        ...var3Score.map((ev) => ({ ...ev, t: ev.t + offset3 })),
        ...var4Score.map((ev) => ({ ...ev, t: ev.t + offset4 })),
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
    }, maxTime + 950);
    this.lullabyTimers.push(endTimer);
  }

  // Alias for backward compatibility
  playTitanLullaby(variation = "full", onStepCallback = null, onComplete = null) {
    return this.playCloudLullaby(variation, onStepCallback, onComplete);
  }

  // Secret Rainbow Storm Easter Egg melody
  playSecretLullaby() {
    this.playCloudLullaby("var4");
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
