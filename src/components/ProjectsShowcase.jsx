"use client";

import React, { useState, useRef } from "react";
import {
  Music,
  Play,
  Square,
  Lightbulb,
  Flashlight,
  MapPin,
  Send,
  Layers,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { SHOWCASE_PROJECTS } from "@/lib/characterData";
import { soundEngine } from "@/lib/soundEngine";

export default function ProjectsShowcase() {
  // Toy #01: Cloud-Organ & 4 Distinct 1773 Styles
  const [activeNote, setActiveNote] = useState(null);
  const [isPlayingMelody, setIsPlayingMelody] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState("var1");
  const [padInstrument, setPadInstrument] = useState("violin");
  const [melodyLog, setMelodyLog] = useState(["🎻 Violin G4", "🎹 Piano Chord", "🪈 Bansuri Slide"]);

  // Toy #02: Circular Snow-Globe Aurora Dome
  const [selectedLantern, setSelectedLantern] = useState(
    SHOWCASE_PROJECTS[1].lanterns[0]
  );
  const [torchEnabled, setTorchEnabled] = useState(true);
  const [jarSparkleBurst, setJarSparkleBurst] = useState(false);
  const [torchPos, setTorchPos] = useState({ x: 140, y: 110 });
  const nightlightBoxRef = useRef(null);

  // Toy #03: Animated Sky-River Paper-Boat Race
  const [routeProgress, setRouteProgress] = useState(35);
  const [selectedStop, setSelectedStop] = useState(SHOWCASE_PROJECTS[2].stops[0]);
  const [isSailing, setIsSailing] = useState(false);

  // Toy #04: Squishy Smiling Mochi-Blocks Tower
  const [cloudBlocks, setCloudBlocks] = useState([
    { id: 1, label: "Sky Mochi #1", face: "( ◕‿◕ )", color: "#bae6fd", width: 195 },
    { id: 2, label: "Strawberry Puff #2", face: "( ≧◡≦ )", color: "#fbcfe8", width: 170 },
  ]);
  const [rattleShakes, setRattleShakes] = useState(0);

  // Toy #01 Handlers
  const handlePlayPuddle = (note) => {
    soundEngine.playNote(note.freq, 0.55, padInstrument, 0.16);
    setActiveNote(note.id);
    setMelodyLog((prev) => [...prev.slice(-2), `${padInstrument.toUpperCase()}: ${note.label}`]);
    setTimeout(() => setActiveNote(null), 380);
  };

  const handleWindMusicBox = (variationOverride) => {
    const targetVar =
      typeof variationOverride === "string" ? variationOverride : selectedVariation;
    if (isPlayingMelody && typeof variationOverride !== "string") {
      soundEngine.stopLullaby();
      setIsPlayingMelody(false);
      setActiveNote(null);
      return;
    }
    setSelectedVariation(targetVar);
    setIsPlayingMelody(true);

    soundEngine.playCloudLullaby(
      targetVar,
      (ev) => {
        if (ev.id) setActiveNote(ev.id);
        if (ev.label) {
          setMelodyLog((prev) => [...prev.slice(-2), ev.label]);
        }
      },
      () => {
        setActiveNote(null);
        setIsPlayingMelody(false);
      }
    );
  };

  // Toy #02 Handlers
  const handleNightlightMove = (clientX, clientY) => {
    if (!nightlightBoxRef.current) return;
    const rect = nightlightBoxRef.current.getBoundingClientRect();
    setTorchPos({
      x: Math.max(0, Math.min(rect.width, clientX - rect.left)),
      y: Math.max(0, Math.min(rect.height, clientY - rect.top)),
    });
  };

  const handleShakeAuroraJar = () => {
    setJarSparkleBurst(true);
    soundEngine.playMoonWaveMelody();
    setTimeout(() => setJarSparkleBurst(false), 1200);
  };

  // Toy #03 Handlers
  const handleSailFullRoute = () => {
    if (isSailing) return;
    setIsSailing(true);
    const stops = SHOWCASE_PROJECTS[2].stops;
    const voices = ["violin", "piano", "flute", "celesta"];
    stops.forEach((stop, idx) => {
      setTimeout(() => {
        setSelectedStop(stop);
        setRouteProgress((idx + 1) * 25);
        soundEngine.playNote(523.25 + idx * 85, 0.4, voices[idx % 4], 0.15);
        if (idx === stops.length - 1) {
          setTimeout(() => setIsSailing(false), 500);
        }
      }, idx * 450);
    });
  };

  // Toy #04 Handlers
  const handleStackBlock = () => {
    const palette = ["#bae6fd", "#fbcfe8", "#fde68a", "#c4b5fd", "#f9a8d4"];
    const faces = ["( ^‿^ )", "( ◕ᴗ◕ )", "( ≧◡≦ )", "( ´ ▽ ` )", "( ★‿★ )"];
    const names = [
      "Peach Mochi",
      "Sky Puff",
      "Lemon Star",
      "Berry Cloud",
      "Lavender Bun",
    ];
    if (cloudBlocks.length >= 7) {
      soundEngine.playGiggle();
      setCloudBlocks([
        { id: 1, label: "Sky Mochi #1", face: "( ◕‿◕ )", color: "#bae6fd", width: 195 },
      ]);
      return;
    }
    const nextNum = cloudBlocks.length + 1;
    const voices = ["piano", "violin", "flute", "celesta"];
    soundEngine.playNote(440 + nextNum * 75, 0.35, voices[nextNum % 4], 0.15);
    setCloudBlocks((prev) => [
      ...prev,
      {
        id: Date.now(),
        label: `${names[nextNum % names.length]} #${nextNum}`,
        face: faces[nextNum % faces.length],
        color: palette[nextNum % palette.length],
        width: Math.max(105, 205 - nextNum * 13),
      },
    ]);
  };

  const handleShakeRattle = () => {
    soundEngine.playStarBellMelody((rattleShakes % 2) + 1);
    setRattleShakes((c) => c + 1);
  };

  return (
    <section
      id="projects-showcase"
      aria-labelledby="projects-heading"
      className="py-12 sm:py-16 px-3 sm:px-6 max-w-6xl mx-auto overflow-hidden"
    >
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-200 font-bold border-2 border-sky-300 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-pink-500 shrink-0" />
          <span>🎪 Mochi&apos;s Animated Sky-Carnival · 4 Interactive Toy Islands</span>
        </span>
        <h2
          id="projects-heading"
          className="mt-3 text-3xl sm:text-4xl font-bold text-espresso font-display"
        >
          Inside Mochi&apos;s Magical Toy Carnival
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-muted">
          Each island below transforms, bounces, and plays radically different instruments—try
          the Bowed Violin, Chordal Grand Piano, Sliding Bansuri Flute, and Swirling Snow-Globe!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-9 items-stretch">
        {/* =================================================================
            ISLAND #01: THE 1773 SYMPHONY CLOUD-ORGAN (Bouncing 3D Piano Keys!)
           ================================================================= */}
        <article
          data-testid="project-lullaby-lab"
          className="rounded-[44px] bg-pink-50/90 dark:bg-slate-800/95 border-2 border-pink-300 dark:border-pink-500/40 p-5 sm:p-7 flex flex-col justify-between shadow-lg transition-transform duration-300 hover:-translate-y-1.5 relative"
        >
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono uppercase px-3 py-1 rounded-full bg-white dark:bg-slate-900 text-pink-600 dark:text-pink-300 font-bold border border-pink-300 shadow-sm">
                🎻🎹 {SHOWCASE_PROJECTS[0].badge}
              </span>
              <span className="px-3 py-1 rounded-full bg-pink-500 text-white font-mono text-xs font-bold">
                Island #01
              </span>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-4 items-center text-center sm:text-left">
              <img
                src="/assets/bitz_lullaby_box.jpg"
                alt="3D studio render of Mochi's Celestial Cloud Music Box"
                className={`w-24 h-24 rounded-full object-cover border-4 border-white shadow-md shrink-0 transition-transform duration-500 ${
                  isPlayingMelody ? "animate-spin-slow scale-105" : "hover:rotate-6"
                }`}
              />
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-espresso font-display flex items-center justify-center sm:justify-start gap-2">
                  <Music className="w-5 h-5 text-pink-500 shrink-0" />
                  <span>{SHOWCASE_PROJECTS[0].title}</span>
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-muted leading-snug">
                  {SHOWCASE_PROJECTS[0].description}
                </p>
              </div>
            </div>

            {/* 4 Unmistakably Distinct Instrument Voices for the Keys */}
            <div className="mt-4 bg-white/85 dark:bg-slate-900/80 p-2.5 rounded-3xl border border-pink-200 dark:border-slate-700">
              <div className="text-[11px] font-mono font-bold text-pink-600 dark:text-pink-300 mb-1.5 text-center">
                🎹 Step 1 — Choose Instrument Voice (Hear the Huge Difference!):
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {[
                  { id: "violin", label: "🎻 Bowed Violin" },
                  { id: "piano", label: "🎹 Piano Chord" },
                  { id: "flute", label: "🪈 Bansuri Slide" },
                  { id: "celesta", label: "🔔 High Bells" },
                ].map((inst) => (
                  <button
                    key={inst.id}
                    type="button"
                    onClick={() => {
                      setPadInstrument(inst.id);
                      soundEngine.playNote(587.33, 0.45, inst.id, 0.16);
                    }}
                    className={`px-2.5 py-1.5 rounded-full text-xs font-bold transition ${
                      padInstrument === inst.id
                        ? "bg-pink-500 text-white shadow-sm scale-105"
                        : "bg-pink-50 dark:bg-slate-800 text-espresso hover:bg-pink-100"
                    }`}
                  >
                    {inst.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 6 Bouncing 3D Cloud-Organ Keys with Flying Notes */}
            <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-2">
              {SHOWCASE_PROJECTS[0].notes.map((note) => {
                const isActive = activeNote === note.id;
                return (
                  <button
                    key={note.id}
                    type="button"
                    onClick={() => handlePlayPuddle(note)}
                    style={{
                      backgroundColor: isActive ? note.color : undefined,
                    }}
                    className={`relative py-3 px-2 rounded-3xl border-2 font-mono text-xs font-bold transition-all duration-200 flex flex-col items-center justify-center gap-1 ${
                      isActive
                        ? "border-pink-600 text-slate-950 -translate-y-2 scale-110 shadow-lg"
                        : "border-white bg-white dark:bg-slate-900 dark:border-slate-700 hover:-translate-y-1 hover:border-pink-400 text-espresso shadow-sm"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute -top-5 text-sm text-pink-600 font-bold animate-bounce">
                        ♪
                      </span>
                    )}
                    <span className="text-xs font-bold">{note.id.toUpperCase()}</span>
                    <span className="text-[10px] opacity-80">{note.label}</span>
                  </button>
                );
              })}
            </div>

            {/* 4 Radically Different 1773 Musical Styles */}
            <div className="mt-4 bg-white/85 dark:bg-slate-900/80 p-2.5 rounded-3xl border border-pink-200 dark:border-slate-700">
              <div className="text-[11px] font-mono font-bold text-sky-700 dark:text-sky-300 mb-1.5 text-center">
                🎶 Step 2 — Play 4 Distinct 1773 Musical Styles:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {[
                  { id: "var1", label: "🎻 Violin & Piano" },
                  { id: "var2", label: "🪈 Bansuri & Harp" },
                  { id: "var3", label: "🔔 3/4 Bell Waltz" },
                  { id: "var4", label: "🌟 90s Synth Pop" },
                ].map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => handleWindMusicBox(v.id)}
                    className={`px-2 py-1.5 rounded-full text-[11px] font-bold transition ${
                      selectedVariation === v.id && isPlayingMelody
                        ? "bg-sky-500 text-white shadow-sm scale-105"
                        : "bg-sky-50 dark:bg-slate-800 text-espresso hover:bg-sky-100"
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t-2 border-pink-200/70 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => handleWindMusicBox("full")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white border-2 border-pink-600 transition shadow-sm active:scale-95"
            >
              {isPlayingMelody ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current shrink-0" />
                  <span>Stop Concert</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current shrink-0" />
                  <span>Play All 4 Styles</span>
                </>
              )}
            </button>

            <div className="text-[11px] font-mono text-muted truncate">
              Live: <strong className="text-pink-600 dark:text-pink-300">{melodyLog.join(" · ")}</strong>
            </div>
          </div>
        </article>

        {/* =================================================================
            ISLAND #02: SWIRLING SNOW-GLOBE AURORA DOME (Circular Crystal Globe!)
           ================================================================= */}
        <article
          data-testid="project-nightlight-lanterns"
          className="rounded-[44px] bg-sky-50/90 dark:bg-slate-800/95 border-2 border-sky-300 dark:border-sky-500/40 p-5 sm:p-7 flex flex-col justify-between shadow-lg transition-transform duration-300 hover:-translate-y-1.5 relative"
        >
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono uppercase px-3 py-1 rounded-full bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 font-bold border border-sky-300 shadow-sm">
                🏮 {SHOWCASE_PROJECTS[1].badge}
              </span>
              <span className="px-3 py-1 rounded-full bg-sky-500 text-white font-mono text-xs font-bold">
                Island #02
              </span>
            </div>

            <div className="mt-3 text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-espresso font-display inline-flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500 shrink-0" />
                <span>{SHOWCASE_PROJECTS[1].title}</span>
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-muted">
                {SHOWCASE_PROJECTS[1].description}
              </p>
            </div>

            {/* Interactive Circular Crystal Snow-Globe Dome! */}
            <div className="mt-4 flex flex-col items-center">
              <div
                ref={nightlightBoxRef}
                onMouseMove={(e) => handleNightlightMove(e.clientX, e.clientY)}
                onTouchMove={(e) => {
                  if (e.touches && e.touches[0]) {
                    handleNightlightMove(e.touches[0].clientX, e.touches[0].clientY);
                  }
                }}
                className={`relative w-60 h-60 sm:w-64 sm:h-64 rounded-full bg-slate-900 border-4 border-white shadow-xl overflow-hidden cursor-crosshair select-none flex flex-col items-center justify-center p-5 text-center transition-transform duration-500 ${
                  jarSparkleBurst ? "scale-105 rotate-6" : ""
                }`}
              >
                {/* Torch Spotlight Inside the Crystal Snow-Globe */}
                <div
                  className="pointer-events-none absolute inset-0 transition-opacity duration-200"
                  style={{
                    background: torchEnabled
                      ? `radial-gradient(125px circle at ${torchPos.x}px ${torchPos.y}px, ${selectedLantern.glowColor}88, rgba(15,23,42,0.92) 85%)`
                      : `radial-gradient(circle at 50% 50%, ${selectedLantern.glowColor}66, rgba(15,23,42,0.8))`,
                  }}
                />

                {/* Floating Animated Fireflies Inside Globe */}
                <div className={`relative z-10 space-y-2 ${jarSparkleBurst ? "animate-spin-slow" : ""}`}>
                  <div className="text-2xl animate-bounce">✨🦋✨</div>
                  <div className="text-xs font-mono font-bold text-pink-300">
                    {selectedLantern.name}
                  </div>
                  <p className="text-[11px] font-mono text-sky-100 leading-snug">
                    {selectedLantern.recipe}
                  </p>
                  <p className="text-xs font-bold text-amber-300">
                    {selectedLantern.secretNote}
                  </p>
                </div>

                {/* Glass Reflection Highlight */}
                <div className="pointer-events-none absolute top-3 left-6 w-16 h-6 rounded-full bg-white/20 -rotate-25" />
              </div>

              {/* Pastel Snow-Globe Pedestal Base with Controls */}
              <div className="-mt-3 z-20 bg-pink-500 text-white px-5 py-2 rounded-full border-2 border-white shadow-md flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShakeAuroraJar}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white text-pink-600 hover:bg-pink-50 transition active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>Swirl Snow-Globe</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick(1.2);
                    setTorchEnabled((t) => !t);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-sky-600 text-white hover:bg-sky-700 transition"
                >
                  <Flashlight className="w-3.5 h-3.5 text-amber-200 shrink-0" />
                  <span>{torchEnabled ? "Torch ON" : "Full Glow"}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SHOWCASE_PROJECTS[1].lanterns.map((lantern, idx) => (
              <button
                key={lantern.id}
                type="button"
                onClick={() => {
                  soundEngine.playCardChord(idx);
                  setSelectedLantern(lantern);
                }}
                className={`px-3 py-2 rounded-full text-xs font-bold border-2 transition ${
                  selectedLantern.id === lantern.id
                    ? "border-pink-600 bg-pink-500 text-white shadow-sm scale-105"
                    : "border-white bg-white dark:bg-slate-900 dark:border-slate-700 text-espresso hover:border-pink-400"
                }`}
              >
                {lantern.name.split("·")[1]?.trim() || lantern.name}
              </button>
            ))}
          </div>
        </article>

        {/* =================================================================
            ISLAND #03: ANIMATED SKY-RIVER PAPER-BOAT RACE (Parachute Drops!)
           ================================================================= */}
        <article
          data-testid="project-dream-routes"
          className="rounded-[44px] bg-sky-50/90 dark:bg-slate-800/95 border-2 border-sky-300 dark:border-sky-500/40 p-5 sm:p-7 flex flex-col justify-between shadow-lg transition-transform duration-300 hover:-translate-y-1.5 relative"
        >
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono uppercase px-3 py-1 rounded-full bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 font-bold border border-sky-300 shadow-sm">
                ⛵ {SHOWCASE_PROJECTS[2].badge}
              </span>
              <button
                type="button"
                onClick={handleSailFullRoute}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white transition shadow-sm active:scale-95"
              >
                <span>{isSailing ? "⛵ Sailing Sky-River..." : "⛵ Launch Paper Boat!"}</span>
              </button>
            </div>

            <h3 className="mt-3 text-xl sm:text-2xl font-bold text-espresso font-display flex items-center gap-2">
              <MapPin className="w-5 h-5 text-pink-500 shrink-0" />
              <span>{SHOWCASE_PROJECTS[2].title}</span>
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-muted">
              {SHOWCASE_PROJECTS[2].description}
            </p>

            {/* Animated Rainbow Sky-River Map */}
            <div className="mt-4 rounded-[32px] bg-white/95 dark:bg-slate-900 border-2 border-sky-200 dark:border-slate-700 p-4 relative overflow-hidden">
              <svg
                viewBox="0 0 400 155"
                className="w-full h-36 sm:h-40 overflow-visible"
                aria-label="Paper-Boat Dream Delivery Rooftop Route Map"
              >
                {/* Rainbow Sky River Wave */}
                <path
                  d="M 35 110 Q 150 15 260 95 T 365 35"
                  fill="none"
                  stroke="#fbcfe8"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                <path
                  d="M 35 110 Q 150 15 260 95 T 365 35"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray="400"
                  strokeDashoffset={400 - (routeProgress / 100) * 400}
                />

                {SHOWCASE_PROJECTS[2].stops.map((stop, idx) => {
                  const cx = (stop.x / 100) * 380 + 10;
                  const cy = (stop.y / 100) * 130 + 10;
                  const isSelected = selectedStop.id === stop.id;
                  return (
                    <g
                      key={stop.id}
                      onClick={() => {
                        soundEngine.playCardChord(idx);
                        setSelectedStop(stop);
                        setRouteProgress((idx + 1) * 25);
                      }}
                      className="cursor-pointer"
                    >
                      {/* Mini Cloud Island Base */}
                      <ellipse
                        cx={cx}
                        cy={cy + 6}
                        rx={isSelected ? 22 : 16}
                        ry={isSelected ? 10 : 7}
                        fill={isSelected ? "#fce7f3" : "#e0f2fe"}
                        stroke={isSelected ? "#ec4899" : "#38bdf8"}
                        strokeWidth="2"
                      />
                      {isSelected && (
                        <g className="animate-bounce">
                          <text x={cx} y={cy - 12} textAnchor="middle" fontSize="22">
                            ⛵
                          </text>
                          <text x={cx + 18} y={cy - 22} textAnchor="middle" fontSize="14">
                            💖
                          </text>
                        </g>
                      )}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isSelected ? 8 : 6}
                        fill={isSelected ? "#ec4899" : "#0284c7"}
                      />
                      <text
                        x={cx}
                        y={cy + 24}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="bold"
                        fill="currentColor"
                      >
                        {stop.time}
                      </text>
                    </g>
                  );
                })}
              </svg>

              <div className="mt-2 flex items-center gap-3">
                <Send className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={routeProgress}
                  aria-label="Paper boat flight progress along rooftop route"
                  onChange={(e) => setRouteProgress(Number(e.target.value))}
                  className="w-full accent-pink-500 cursor-pointer"
                />
                <span className="text-xs font-mono font-bold text-pink-600 dark:text-pink-300">
                  {routeProgress}%
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3.5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-pink-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2 shadow-sm">
            <div>
              <div className="text-xs font-mono font-bold text-pink-600 dark:text-pink-300">
                {selectedStop.time} · {selectedStop.name}
              </div>
              <div className="text-xs text-espresso font-bold mt-0.5">
                To: {selectedStop.recipient}
              </div>
            </div>
            <div className="text-xs font-mono bg-pink-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-pink-300 text-pink-700 dark:text-pink-200 font-bold">
              🎁 {selectedStop.cargo}
            </div>
          </div>
        </article>

        {/* =================================================================
            ISLAND #04: SQUISHY SMILING MOCHI-BLOCKS TOWER (Jelly Bounce!)
           ================================================================= */}
        <article
          data-testid="project-block-toybox"
          className="rounded-[44px] bg-pink-50/90 dark:bg-slate-800/95 border-2 border-pink-300 dark:border-pink-500/40 p-5 sm:p-7 flex flex-col justify-between shadow-lg transition-transform duration-300 hover:-translate-y-1.5 relative"
        >
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono uppercase px-3 py-1 rounded-full bg-white dark:bg-slate-900 text-pink-600 dark:text-pink-300 font-bold border border-pink-300 shadow-sm">
                🧸 {SHOWCASE_PROJECTS[3].badge}
              </span>
              <span className="px-3 py-1 rounded-full bg-pink-500 text-white font-mono text-xs font-bold">
                Island #04
              </span>
            </div>

            <h3 className="mt-3 text-xl sm:text-2xl font-bold text-espresso font-display flex items-center gap-2">
              <Layers className="w-5 h-5 text-pink-500 shrink-0" />
              <span>{SHOWCASE_PROJECTS[3].title}</span>
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-muted">
              {SHOWCASE_PROJECTS[3].description}
            </p>

            {/* Squishy Smiling Mochi-Block Tower */}
            <div className="mt-4 h-52 rounded-[32px] bg-white/95 dark:bg-slate-900 border-2 border-pink-200 dark:border-slate-700 p-3 flex flex-col-reverse items-center justify-start gap-1.5 overflow-hidden">
              {cloudBlocks.map((block) => (
                <div
                  key={block.id}
                  onClick={() => soundEngine.playClick(1.2)}
                  style={{
                    width: `${block.width}px`,
                    backgroundColor: block.color,
                  }}
                  className="animate-jelly-bounce py-1.5 px-3 rounded-full border-2 border-white text-slate-900 text-xs font-mono font-bold text-center shadow-sm cursor-pointer hover:scale-105 transition-transform flex items-center justify-between gap-2"
                >
                  <span className="truncate">{block.label}</span>
                  <span className="text-[11px] shrink-0">{block.face || "( ^‿^ )"}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleStackBlock}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white border-2 border-pink-600 transition shadow-sm active:scale-95"
              >
                <span>+ Drop Squishy Mochi ({cloudBlocks.length}/7)</span>
              </button>

              <button
                type="button"
                onClick={handleShakeRattle}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-xs font-bold border-2 border-sky-300 bg-white dark:bg-slate-900 hover:bg-sky-50 text-sky-950 dark:text-sky-200 transition active:scale-95"
              >
                <span>🔔 Star-Rattle ({rattleShakes})</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick(0.9);
                setCloudBlocks([
                  { id: 1, label: "Sky Mochi #1", face: "( ◕‿◕ )", color: "#bae6fd", width: 195 },
                ]);
              }}
              aria-label="Reset block tower"
              className="inline-flex items-center gap-1 text-xs font-mono font-bold text-muted hover:text-pink-500"
            >
              <RotateCcw className="w-3.5 h-3.5 shrink-0" />
              <span>Reset</span>
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}
