// Studio-Grade Multi-Instrument Web Audio API Engine for Mochi's Cloud Sanctuary
// Features 4 Unmistakably Distinct Instrument Engines (Bowed Violin Section,
// Chordal Grand Piano, Pitch-Gliding Bansuri Flute, High-Octave Crystal Music Box),
// 5 Famous Classical Melodies for Profile Charms, and 4 Distinct 1773 Variations!

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

  setupEchoBus() {
    if (!this.ctx || this.echoBus) return;
    try {
      const delay = this.ctx.createDelay(1.0);
      const feedback = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      const wetGain = this.ctx.createGain();

      delay.delayTime.setValueAtTime(0.21, this.ctx.currentTime);
      feedback.gain.setValueAtTime(0.3, this.ctx.currentTime);
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2400, this.ctx.currentTime);
      wetGain.gain.setValueAtTime(0.26, this.ctx.currentTime);

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
      this.stopEffects();
    }
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("bitz_sound_muted", JSON.stringify(this.muted));
      } catch (e) {}
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
    } catch (e) {}
    return this.muted;
  }

  stopLullaby() {
    this.lullabyTimers.forEach((id) => clearTimeout(id));
    this.lullabyTimers = [];
    this.isPlayingLullaby = false;
  }

  stopEffects() {
    this.effectTimers.forEach((id) => clearTimeout(id));
    this.effectTimers = [];
  }

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
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.25, now + 0.07);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Raw single-tone helper for internal layering
  _spawnTone(freq, duration, waveType, volume, attack = 0.02, glideFrom = null, vibratoHz = 0, vibratoDepth = 0, filterCutoff = 0) {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = waveType;
    if (glideFrom) {
      osc.frequency.setValueAtTime(glideFrom, now);
      osc.frequency.exponentialRampToValueAtTime(freq, now + Math.min(0.11, duration * 0.45));
    } else {
      osc.frequency.setValueAtTime(freq, now);
    }

    if (vibratoHz > 0 && vibratoDepth > 0) {
      try {
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(vibratoHz, now);
        lfoGain.gain.setValueAtTime(vibratoDepth, now);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start(now);
        lfo.stop(now + duration + 0.05);
      } catch (e) {}
    }

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + attack);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + duration);

    if (filterCutoff > 0) {
      try {
        const filter = this.ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(filterCutoff, now);
        filter.Q.setValueAtTime(1.5, now);
        osc.connect(filter);
        filter.connect(gain);
      } catch (e) {
        osc.connect(gain);
      }
    } else {
      osc.connect(gain);
    }

    gain.connect(this.ctx.destination);
    if (this.echoBus) {
      gain.connect(this.echoBus);
    }

    osc.start(now);
    osc.stop(now + duration + 0.04);
  }

  /**
   * 4 DRAMATICALLY DISTINCT INSTRUMENT ENGINES:
   * - "violin": Rich Bowed String Ensemble (Detuned Sawtooths + Cello Octave + Slow Bow Swell + Deep Vibrato)
   * - "piano": Percussive Grand Piano Chord Strike (Bass Octave + Major/Minor Triad + Crisp Hammer Attack)
   * - "flute": Sliding Indian Bansuri Flute (Grace-Note Pitch Glide + Breathy Harmonic + Flutter Trill)
   * - "celesta": High-Octave Sparkling Music Box (2x & 3x Metallic Bell Overtones + Double-Chime Echo)
   */
  playNote(freq = 523.25, duration = 0.45, voice = "celesta", volume = 0.15) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    if (voice === "violin") {
      // Unmistakable Bowed Violin Ensemble: long singing sustain, slow bow swell, lush string chorus + cello bass
      const bowDur = Math.max(duration * 1.45, 0.55);
      this._spawnTone(freq, bowDur, "sawtooth", volume * 0.55, 0.11, null, 6.2, 5.2, 1750);
      this._spawnTone(freq * 1.005, bowDur, "sawtooth", volume * 0.45, 0.13, null, 5.8, 4.5, 1650);
      this._spawnTone(freq * 0.5, bowDur, "triangle", volume * 0.5, 0.1, null, 5.5, 2.2, 1200);
    } else if (voice === "piano") {
      // Unmistakable Grand Piano: crisp 0.005s hammer attack playing a rich Piano Chord + Bass Note!
      const pDur = Math.max(duration * 1.1, 0.42);
      this._spawnTone(freq * 0.5, pDur * 1.2, "triangle", volume * 0.65, 0.006, null, 0, 0, 1800);
      this._spawnTone(freq, pDur, "triangle", volume * 0.85, 0.005, null, 0, 0, 2600);
      this._spawnTone(freq * 1.25, pDur * 0.85, "sine", volume * 0.45, 0.006, null, 0, 0, 2200);
      this._spawnTone(freq * 1.5, pDur * 0.8, "sine", volume * 0.4, 0.006, null, 0, 0, 2200);
    } else if (voice === "flute") {
      // Unmistakable Sliding Bansuri Flute: slides smoothly from a lower grace note + airy flute vibrato!
      const fDur = Math.max(duration * 1.3, 0.5);
      this._spawnTone(freq, fDur, "sine", volume * 0.95, 0.05, freq * 0.89, 6.8, 6.5, 0);
      this._spawnTone(freq * 2, fDur * 0.8, "triangle", volume * 0.25, 0.06, freq * 1.78, 6.8, 12.0, 2400);
    } else if (voice === "harp") {
      // Sparkling Plucked Santoor / Harp String
      this._spawnTone(freq, duration * 1.2, "triangle", volume * 0.7, 0.008, null, 0, 0, 3000);
      this._spawnTone(freq * 2, duration * 0.7, "sine", volume * 0.3, 0.008, null, 0, 0, 0);
    } else {
      // Unmistakable High-Octave Crystal Music Box: plays 2x & 3x metallic bell chimes + twinkling double-strike!
      this._spawnTone(freq * 2, duration * 0.95, "sine", volume * 0.75, 0.004, null, 0, 0, 0);
      this._spawnTone(freq * 4, duration * 0.45, "sine", volume * 0.3, 0.004, null, 0, 0, 0);
      const id = setTimeout(() => {
        if (!this.muted) {
          this._spawnTone(freq * 3, duration * 0.5, "sine", volume * 0.25, 0.004, null, 0, 0, 0);
        }
      }, 65);
      this.effectTimers.push(id);
    }
  }

  // 1. TUMMY TICKLE MELODY: Bouncy 10-Note Toybox Laugh Melody!
  playGiggle() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const rondo = [
      { t: 0, f: 523.25, d: 0.22, v: "piano" },
      { t: 100, f: 659.25, d: 0.2, v: "celesta" },
      { t: 200, f: 783.99, d: 0.2, v: "flute" },
      { t: 310, f: 1046.5, d: 0.3, v: "violin" },
      { t: 460, f: 880.0, d: 0.2, v: "celesta" },
      { t: 570, f: 1046.5, d: 0.2, v: "piano" },
      { t: 680, f: 1174.66, d: 0.22, v: "flute" },
      { t: 800, f: 1318.51, d: 0.48, v: "celesta" },
    ];
    rondo.forEach((n) => {
      const id = setTimeout(() => this.playNote(n.f, n.d, n.v, 0.14), n.t);
      this.effectTimers.push(id);
    });
  }

  // 2. RAINBOW CANDY WAND MELODY: Magical Swirling Fairy-Dust Glissando!
  playMoonWaveMelody() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const wandNotes = [
      { t: 0, f: 523.25, d: 0.25, v: "harp" },
      { t: 75, f: 587.33, d: 0.25, v: "harp" },
      { t: 150, f: 659.25, d: 0.25, v: "harp" },
      { t: 225, f: 783.99, d: 0.25, v: "celesta" },
      { t: 300, f: 880.0, d: 0.28, v: "celesta" },
      { t: 380, f: 1046.5, d: 0.35, v: "flute" },
      { t: 540, f: 1318.51, d: 0.4, v: "violin" },
      { t: 740, f: 1567.98, d: 0.55, v: "celesta" },
    ];
    wandNotes.forEach((n) => {
      const id = setTimeout(() => this.playNote(n.f, n.d, n.v, 0.14), n.t);
      this.effectTimers.push(id);
    });
  }

  // 3. GOLDEN STAR-BELL MELODY
  playStarBellMelody(clickStep = 1) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    if (clickStep === 1) {
      const bell1 = [
        { t: 0, f: 587.33, d: 0.35, v: "piano" },
        { t: 120, f: 880.0, d: 0.28, v: "celesta" },
        { t: 240, f: 1174.66, d: 0.28, v: "violin" },
        { t: 370, f: 1479.98, d: 0.45, v: "celesta" },
      ];
      bell1.forEach((n) => {
        const id = setTimeout(() => this.playNote(n.f, n.d, n.v, 0.14), n.t);
        this.effectTimers.push(id);
      });
    } else {
      const bell2 = [
        { t: 0, f: 783.99, d: 0.25, v: "piano" },
        { t: 110, f: 987.77, d: 0.25, v: "flute" },
        { t: 220, f: 1174.66, d: 0.25, v: "violin" },
        { t: 330, f: 1567.98, d: 0.35, v: "celesta" },
        { t: 470, f: 1760.0, d: 0.55, v: "celesta" },
      ];
      bell2.forEach((n) => {
        const id = setTimeout(() => this.playNote(n.f, n.d, n.v, 0.14), n.t);
        this.effectTimers.push(id);
      });
    }
  }

  // 4. DRESS-UP OUTFIT JINGLE (Distinct tune for each baby outfit!)
  playAccessoryMelody(outfitId = "onesie") {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const tunes = {
      onesie: [
        { t: 0, f: 523.25, v: "piano" },
        { t: 110, f: 659.25, v: "celesta" },
        { t: 220, f: 783.99, v: "flute" },
        { t: 340, f: 1046.5, v: "celesta" },
      ],
      hoodie: [
        { t: 0, f: 440.0, v: "flute" },
        { t: 120, f: 554.37, v: "flute" },
        { t: 240, f: 659.25, v: "violin" },
        { t: 360, f: 880.0, v: "piano" },
      ],
      royal: [
        { t: 0, f: 587.33, v: "violin" },
        { t: 130, f: 739.99, v: "violin" },
        { t: 260, f: 880.0, v: "piano" },
        { t: 390, f: 1174.66, v: "violin" },
      ],
      sailor: [
        { t: 0, f: 392.0, v: "piano" },
        { t: 110, f: 493.88, v: "flute" },
        { t: 220, f: 587.33, v: "piano" },
        { t: 330, f: 783.99, v: "flute" },
      ],
      dj: [
        { t: 0, f: 523.25, v: "piano" },
        { t: 90, f: 622.25, v: "celesta" },
        { t: 180, f: 783.99, v: "piano" },
        { t: 280, f: 1046.5, v: "violin" },
      ],
    };
    const seq = tunes[outfitId] || tunes.onesie;
    seq.forEach((n) => {
      const id = setTimeout(() => this.playNote(n.f, 0.28, n.v, 0.14), n.t);
      this.effectTimers.push(id);
    });
  }

  /**
   * 5 FAMOUS RECOGNIZABLE MELODIES FOR THE 5 PROFILE CHARMS (Test 1 Upgrade!):
   * - Charm 0 (1. Name): "Twinkle Twinkle Little Star" (Music Box & Piano)
   * - Charm 1 (2. What they are): "Brahms' Baby Lullaby" (Warm Violin & Harp)
   * - Charm 2 (3. What they do): "Beethoven's Für Elise" (Grand Piano)
   * - Charm 3 (4. Their story): "1773 Mozart Symphony No. 25" (Violin & Flute)
   * - Charm 4 (5. Tagline): "Beethoven's Ode to Joy" (Full Joyful Ensemble)
   */
  playCardChord(cardIndex = 0) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    this.stopEffects();

    const N = {
      G4: 392.0, A4: 440.0, Bb4: 466.16, B4: 493.88,
      C5: 523.25, D5: 587.33, Ds5: 622.25, E5: 659.25,
      F5: 698.46, Fs5: 739.99, G5: 783.99, A5: 880.0,
      Bb5: 932.33, B5: 987.77, C6: 1046.5,
    };

    const famousMelodies = [
      // 0: Twinkle Twinkle Little Star
      [
        { t: 0, f: N.C5, d: 0.24, v: "celesta" },
        { t: 220, f: N.C5, d: 0.24, v: "celesta" },
        { t: 440, f: N.G5, d: 0.24, v: "piano" },
        { t: 660, f: N.G5, d: 0.24, v: "piano" },
        { t: 880, f: N.A5, d: 0.24, v: "flute" },
        { t: 1100, f: N.A5, d: 0.24, v: "flute" },
        { t: 1320, f: N.G5, d: 0.5, v: "violin" },
      ],
      // 1: Brahms' Baby Lullaby ("Lullaby and goodnight...")
      [
        { t: 0, f: N.E5, d: 0.24, v: "violin" },
        { t: 220, f: N.E5, d: 0.24, v: "violin" },
        { t: 440, f: N.G5, d: 0.45, v: "violin" },
        { t: 820, f: N.E5, d: 0.24, v: "flute" },
        { t: 1040, f: N.E5, d: 0.24, v: "flute" },
        { t: 1260, f: N.G5, d: 0.45, v: "piano" },
      ],
      // 2: Beethoven's Für Elise
      [
        { t: 0, f: N.E5, d: 0.2, v: "piano" },
        { t: 180, f: N.Ds5, d: 0.2, v: "piano" },
        { t: 360, f: N.E5, d: 0.2, v: "piano" },
        { t: 540, f: N.Ds5, d: 0.2, v: "piano" },
        { t: 720, f: N.E5, d: 0.2, v: "piano" },
        { t: 900, f: N.B4, d: 0.22, v: "violin" },
        { t: 1080, f: N.D5, d: 0.22, v: "violin" },
        { t: 1260, f: N.C5, d: 0.24, v: "flute" },
        { t: 1460, f: N.A4, d: 0.5, v: "piano" },
      ],
      // 3: 1773 Mozart Symphony No. 25 Signature Motif
      [
        { t: 0, f: N.G4, d: 0.28, v: "violin" },
        { t: 220, f: N.Bb4, d: 0.22, v: "violin" },
        { t: 420, f: N.D5, d: 0.28, v: "piano" },
        { t: 640, f: N.G5, d: 0.28, v: "violin" },
        { t: 860, f: N.Fs5, d: 0.2, v: "flute" },
        { t: 1040, f: N.G5, d: 0.2, v: "flute" },
        { t: 1220, f: N.A5, d: 0.24, v: "celesta" },
        { t: 1440, f: N.G5, d: 0.5, v: "violin" },
      ],
      // 4: Beethoven's Ode to Joy
      [
        { t: 0, f: N.E5, d: 0.22, v: "piano" },
        { t: 210, f: N.E5, d: 0.22, v: "violin" },
        { t: 420, f: N.F5, d: 0.22, v: "flute" },
        { t: 630, f: N.G5, d: 0.24, v: "violin" },
        { t: 840, f: N.G5, d: 0.24, v: "piano" },
        { t: 1050, f: N.F5, d: 0.22, v: "flute" },
        { t: 1260, f: N.E5, d: 0.22, v: "violin" },
        { t: 1470, f: N.D5, d: 0.45, v: "celesta" },
      ],
    ];

    const selected = famousMelodies[cardIndex % famousMelodies.length];
    selected.forEach((n) => {
      const id = setTimeout(() => {
        this.playNote(n.f, n.d, n.v, 0.14);
      }, n.t);
      this.effectTimers.push(id);
    });
  }

  /**
   * 4 DRAMATICALLY DIFFERENT 1773 SYMPHONY VARIATIONS (Test 5 Upgrade!):
   * - "var1": 🎻 Dramatic Bowed Violin Solo + Driving Classical Grand Piano Chords
   * - "var2": 🪈 Dreamy Sliding Indian Bansuri Flute + Rapid Sparkling Santoor Glissandos
   * - "var3": 🔔 High-Octave Baby Music-Box Waltz (3/4 Dance Rhythm at 2x Octave!)
   * - "var4": 🌟 Upbeat 90s Synth-Arcade & Full Orchestra Celebration Remix!
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
      G3: 196.0, A3: 220.0, Bb3: 233.08, C4: 261.63, D4: 293.66, Eb4: 311.13,
      F4: 349.23, Fs4: 369.99, G4: 392.0, A4: 440.0, Bb4: 466.16, C5: 523.25,
      D5: 587.33, Eb5: 622.25, E5: 659.25, F5: 698.46, Fs5: 739.99, G5: 783.99,
      A5: 880.0, Bb5: 932.33, C6: 1046.5, D6: 1174.66,
    };

    // VARIATION 1: 🎻 Royal Bowed Violin & 🎹 Grand Piano Duet (Rich, Dramatic, Classical)
    const var1Score = [
      { t: 0, f: N.G4, d: 0.48, v: "violin", id: "c5", label: "🎻 Violin G4" },
      { t: 0, f: N.G3, d: 0.45, v: "piano" },
      { t: 320, f: N.Bb4, d: 0.32, v: "violin", id: "d5", label: "🎻 Violin Bb4" },
      { t: 540, f: N.D5, d: 0.48, v: "violin", id: "e5", label: "🎻 Violin D5" },
      { t: 540, f: N.D4, d: 0.45, v: "piano" },
      { t: 860, f: N.G5, d: 0.42, v: "violin", id: "g5", label: "🎻 Violin G5" },

      { t: 1180, f: N.Fs5, d: 0.26, v: "violin", id: "a5", label: "🎻 Violin F#5" },
      { t: 1180, f: N.D4, d: 0.6, v: "piano" },
      { t: 1380, f: N.G5, d: 0.26, v: "violin", id: "c6", label: "🎻 Violin G5" },
      { t: 1580, f: N.A5, d: 0.32, v: "violin", id: "a5", label: "🎻 Violin A5" },
      { t: 1820, f: N.Fs5, d: 0.26, v: "violin", id: "g5", label: "🎻 Violin F#5" },
      { t: 2020, f: N.G5, d: 0.45, v: "piano", id: "e5", label: "🎹 Piano Chord G5" },
      { t: 2380, f: N.D5, d: 0.32, v: "piano", id: "d5", label: "🎹 Piano Chord D5" },
      { t: 2660, f: N.Bb4, d: 0.32, v: "piano", id: "c5", label: "🎹 Piano Chord Bb4" },
      { t: 2940, f: N.G4, d: 0.65, v: "violin", id: "c5", label: "🎻🎹 Grand Duet G4" },
    ];

    // VARIATION 2: 🪈 Sliding Indian Bansuri Flute & Rapid Santoor Harp Rolls (Slow, Ethereal, Mantramugdh!)
    const var2Score = [
      // Rapid Santoor harp glissando roll + sliding Bansuri Flute
      { t: 0, f: N.Bb3, d: 0.3, v: "harp" },
      { t: 60, f: N.D4, d: 0.3, v: "harp" },
      { t: 120, f: N.F4, d: 0.4, v: "harp" },
      { t: 120, f: N.Bb4, d: 0.55, v: "flute", id: "d5", label: "🪈 Bansuri Slide Bb4" },
      { t: 550, f: N.C5, d: 0.45, v: "flute", id: "e5", label: "🪈 Bansuri Slide C5" },
      { t: 920, f: N.D5, d: 0.65, v: "flute", id: "g5", label: "🪈 Bansuri Slide D5" },
      { t: 920, f: N.F4, d: 0.3, v: "harp" },
      { t: 980, f: N.Bb4, d: 0.4, v: "harp" },

      { t: 1480, f: N.Eb5, d: 0.48, v: "flute", id: "a5", label: "🪈 Bansuri Silk Eb5" },
      { t: 1880, f: N.D5, d: 0.42, v: "flute", id: "g5", label: "🪈 Bansuri D5" },
      { t: 2240, f: N.C5, d: 0.42, v: "flute", id: "e5", label: "🪈 Bansuri C5" },
      { t: 2600, f: N.Bb4, d: 0.48, v: "flute", id: "d5", label: "🪈 Bansuri Bb4" },
      { t: 3000, f: N.A4, d: 0.42, v: "flute", id: "c5", label: "🪈 Bansuri A4" },
      { t: 3380, f: N.G4, d: 0.85, v: "flute", id: "g5", label: "🪈 Bansuri Peace G4" },
      { t: 3380, f: N.D4, d: 0.5, v: "harp" },
      { t: 3450, f: N.G4, d: 0.6, v: "harp" },
    ];

    // VARIATION 3: 🔔 High-Octave Baby Music-Box Waltz (Sparkling 2x Octave Crystal Bells in 3/4 Rhythm!)
    const var3Score = [
      { t: 0, f: N.Eb5, d: 0.25, v: "celesta", id: "c6", label: "🔔 Crystal Bell Eb6" },
      { t: 180, f: N.G4, d: 0.18, v: "harp" },
      { t: 340, f: N.D5, d: 0.25, v: "celesta", id: "a5", label: "🔔 Crystal Bell D6" },
      { t: 520, f: N.G4, d: 0.18, v: "harp" },
      { t: 680, f: N.C5, d: 0.25, v: "celesta", id: "g5", label: "🔔 Crystal Bell C6" },
      { t: 860, f: N.Eb4, d: 0.18, v: "harp" },
      { t: 1020, f: N.Bb4, d: 0.25, v: "celesta", id: "e5", label: "🔔 Crystal Bell Bb5" },
      { t: 1200, f: N.D5, d: 0.25, v: "celesta", id: "d5", label: "🔔 Crystal Bell D6" },
      { t: 1380, f: N.G5, d: 0.35, v: "celesta", id: "c6", label: "🔔 Crystal Bell G6" },
      { t: 1680, f: N.Fs5, d: 0.25, v: "celesta", id: "a5", label: "🔔 Crystal Bell F#6" },
      { t: 1880, f: N.G5, d: 0.6, v: "celesta", id: "c6", label: "🔔 Music-Box Sparkle!" },
    ];

    // VARIATION 4: 🌟 Upbeat 90s Synth-Arcade & Full Orchestra Celebration Remix (Fast, Bouncy & Energetic!)
    const var4Score = [
      { t: 0, f: N.G4, d: 0.18, v: "piano", id: "c5", label: "🌟 Upbeat G4" },
      { t: 130, f: N.Bb4, d: 0.18, v: "celesta", id: "d5", label: "🌟 Synth Bb4" },
      { t: 260, f: N.D5, d: 0.18, v: "piano", id: "e5", label: "🌟 Arcade D5" },
      { t: 390, f: N.G5, d: 0.25, v: "violin", id: "g5", label: "🌟 Strings G5" },
      { t: 560, f: N.A5, d: 0.18, v: "flute", id: "a5", label: "🌟 Flute A5" },
      { t: 690, f: N.Bb5, d: 0.3, v: "violin", id: "c6", label: "🌟 Apex Bb5" },
      { t: 920, f: N.A5, d: 0.18, v: "piano", id: "a5", label: "🌟 Bounce A5" },
      { t: 1050, f: N.G5, d: 0.18, v: "celesta", id: "g5", label: "🌟 Bell G5" },
      { t: 1180, f: N.Fs5, d: 0.18, v: "flute", id: "e5", label: "🌟 Trill F#5" },
      { t: 1310, f: N.G5, d: 0.25, v: "piano", id: "g5", label: "🌟 Chord G5" },
      { t: 1520, f: N.D5, d: 0.2, v: "violin", id: "d5", label: "🌟 Strings D5" },
      { t: 1700, f: N.G5, d: 0.7, v: "piano", id: "c6", label: "🌟 Grand Finale ✨" },
      { t: 1700, f: N.Bb5, d: 0.7, v: "violin" },
      { t: 1700, f: N.D6, d: 0.7, v: "celesta" },
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
      const offset2 = 3650;
      const offset3 = 7950;
      const offset4 = 10400;
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
        this.playNote(ev.f, ev.d, ev.v || "celesta", 0.15);
        if (ev.id && onStepCallback) {
          onStepCallback(ev);
        }
      }, ev.t);
      this.lullabyTimers.push(timerId);
    });

    const endTimer = setTimeout(() => {
      this.isPlayingLullaby = false;
      onComplete?.();
    }, maxTime + 800);
    this.lullabyTimers.push(endTimer);
  }

  playTitanLullaby(variation = "full", onStepCallback = null, onComplete = null) {
    return this.playCloudLullaby(variation, onStepCallback, onComplete);
  }

  playSecretLullaby() {
    this.playCloudLullaby("var4");
  }
}

export const soundEngine = new SoundEngine();

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
