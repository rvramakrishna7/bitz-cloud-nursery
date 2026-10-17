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
  // Toy #01 State: Lullaby Lab + Live Instrument Voice Switcher
  const [activeNote, setActiveNote] = useState(null);
  const [isPlayingMelody, setIsPlayingMelody] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState("full");
  const [padInstrument, setPadInstrument] = useState("violin"); // "violin" | "piano" | "celesta" | "flute"
  const [melodyLog, setMelodyLog] = useState(["🎻 Violin G4", "🎹 Piano Bb4", "🎻 Violin D5"]);

  // Toy #02 State: Bottled Aurora Nightlights
  const [selectedLantern, setSelectedLantern] = useState(
    SHOWCASE_PROJECTS[1].lanterns[0]
  );
  const [torchEnabled, setTorchEnabled] = useState(true);
  const [jarSparkleBurst, setJarSparkleBurst] = useState(false);
  const [torchPos, setTorchPos] = useState({ x: 180, y: 110 });
  const nightlightBoxRef = useRef(null);

  // Toy #03 State: Paper-Boat Dream Delivery Routes
  const [routeProgress, setRouteProgress] = useState(35);
  const [selectedStop, setSelectedStop] = useState(SHOWCASE_PROJECTS[2].stops[0]);
  const [isSailing, setIsSailing] = useState(false);

  // Toy #04 State: Cumulus Block & Rattle Toybox
  const [cloudBlocks, setCloudBlocks] = useState([
    { id: 1, label: "Sky Cushion #1", color: "#bae6fd", width: 185 },
    { id: 2, label: "Baby Pink Puff #2", color: "#fbcfe8", width: 162 },
  ]);
  const [rattleShakes, setRattleShakes] = useState(0);

  // Toy #01 Handlers
  const handlePlayPuddle = (note) => {
    soundEngine.playNote(note.freq, 0.5, padInstrument, 0.15);
    setActiveNote(note.id);
    setMelodyLog((prev) => [...prev.slice(-3), `${note.label}`]);
    setTimeout(() => setActiveNote(null), 340);
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
    const notes = [523.25, 659.25, 783.99, 987.77, 1174.66];
    notes.forEach((f, idx) => {
      setTimeout(() => {
        soundEngine.playNote(f, 0.3, idx % 2 === 0 ? "harp" : "celesta", 0.13);
      }, idx * 75);
    });
    setTimeout(() => setJarSparkleBurst(false), 900);
  };

  // Toy #03 Handlers
  const handleSailFullRoute = () => {
    if (isSailing) return;
    setIsSailing(true);
    const stops = SHOWCASE_PROJECTS[2].stops;
    stops.forEach((stop, idx) => {
      setTimeout(() => {
        setSelectedStop(stop);
        setRouteProgress((idx + 1) * 25);
        soundEngine.playNote(523.25 + idx * 85, 0.34, idx % 2 === 0 ? "piano" : "flute", 0.14);
        if (idx === stops.length - 1) {
          setTimeout(() => setIsSailing(false), 450);
        }
      }, idx * 420);
    });
  };

  // Toy #04 Handlers
  const handleStackBlock = () => {
    const palette = ["#bae6fd", "#fbcfe8", "#fde68a", "#e0f2fe", "#f9a8d4"];
    const names = [
      "Baby Pink Cirrus",
      "Sky Blue Nimbus",
      "Starlight Puff",
      "Rosebud Cumulus",
      "Golden Sunbeam Block",
    ];
    if (cloudBlocks.length >= 7) {
      soundEngine.playGiggle();
      setCloudBlocks([
        { id: 1, label: "Sky Cushion #1", color: "#bae6fd", width: 185 },
      ]);
      return;
    }
    const nextNum = cloudBlocks.length + 1;
    soundEngine.playNote(440 + nextNum * 65, 0.3, nextNum % 2 === 0 ? "violin" : "piano", 0.15);
    setCloudBlocks((prev) => [
      ...prev,
      {
        id: Date.now(),
        label: `${names[nextNum % names.length]} #${nextNum}`,
        color: palette[nextNum % palette.length],
        width: Math.max(95, 195 - nextNum * 13),
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
      className="py-10 sm:py-14 px-4 max-w-6xl mx-auto"
    >
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-200 font-bold border border-sky-300 whitespace-nowrap">
          <Sparkles className="w-3.5 h-3.5 text-pink-500 shrink-0" />
          <span>🎹 Step 4 · Interactive Weather Playroom (4 Live Toys)</span>
        </span>
        <h2
          id="projects-heading"
          className="mt-3 text-3xl sm:text-4xl font-bold text-espresso font-display"
        >
          Inside Bitz&apos;s Celestial Weather Playroom
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-muted">
          Play the 1773 Classical Symphony on Violin, Grand Piano, Flute &amp; Music Box,
          shine the starlight torch over bottled auroras, sail paper dream boats, or stack pastel clouds!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-7">
        {/* TOY #01: THE RAINDROP LULLABY LAB (1773 Violin, Piano, Flute & Music Box Suite!) */}
        <article
          data-testid="project-lullaby-lab"
          className="rounded-3xl glass-panel border-2 border-pink-200 dark:border-slate-700 p-6 sm:p-7 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono uppercase px-3 py-1 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-200 font-bold border border-pink-300 whitespace-nowrap">
                🎻🎹 {SHOWCASE_PROJECTS[0].badge}
              </span>
              <span className="font-mono text-xs text-pink-500 font-bold whitespace-nowrap">
                Toy #01
              </span>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-4 items-center">
              <img
                src="/assets/bitz_lullaby_box.jpg"
                alt="3D studio render of Bitz's Celestial Cloud Music Box with golden clockwork gears and hanging crystal raindrop chimes"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-pink-200 shadow-md shrink-0"
              />
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-espresso font-display flex items-center gap-2">
                  <Music className="w-5 h-5 text-pink-500 shrink-0" />
                  <span>{SHOWCASE_PROJECTS[0].title}</span>
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-muted leading-relaxed">
                  {SHOWCASE_PROJECTS[0].description}
                </p>
              </div>
            </div>

            {/* Live Instrument Selector for Manual Note Pads */}
            <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-[11px] font-mono font-bold text-sky-800 dark:text-sky-300 whitespace-nowrap mr-1">
                🎹 Pad Sound:
              </span>
              {[
                { id: "violin", label: "🎻 Violin" },
                { id: "piano", label: "🎹 Grand Piano" },
                { id: "flute", label: "🪈 Sweet Flute" },
                { id: "celesta", label: "🔔 Music Box" },
              ].map((inst) => (
                <button
                  key={inst.id}
                  type="button"
                  onClick={() => {
                    setPadInstrument(inst.id);
                    soundEngine.playNote(659.25, 0.3, inst.id, 0.14);
                  }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition whitespace-nowrap shrink-0 ${
                    padInstrument === inst.id
                      ? "bg-sky-500 text-white shadow-sm"
                      : "bg-sky-50 dark:bg-slate-800 text-espresso hover:bg-sky-100 border border-sky-200 dark:border-slate-700"
                  }`}
                >
                  {inst.label}
                </button>
              ))}
            </div>

            {/* 6 Interactive Chime Pads */}
            <div className="mt-3 grid grid-cols-3 sm:grid-cols-6 gap-2">
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
                    className={`py-2.5 px-2 rounded-2xl border-2 font-mono text-xs font-bold transition flex flex-col items-center justify-center gap-0.5 whitespace-nowrap ${
                      isActive
                        ? "border-pink-500 text-slate-950 scale-105 shadow-md"
                        : "border-sky-200 bg-sky-50/70 dark:bg-slate-800 dark:border-slate-700 hover:border-pink-400 text-espresso"
                    }`}
                  >
                    <span className="text-xs font-bold">{note.id.toUpperCase()}</span>
                    <span className="text-[10px] opacity-80">{note.label}</span>
                  </button>
                );
              })}
            </div>

            {/* 1773 Symphony Lullaby Variations (Violin, Piano, Flute, Music Box) */}
            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-mono font-bold text-pink-600 dark:text-pink-300 mr-1 whitespace-nowrap">
                🎶 1773 Variations:
              </span>
              {[
                { id: "full", label: "✨ Full Suite" },
                { id: "var1", label: "🎻 Violin & Piano" },
                { id: "var2", label: "🎹 Piano & Flute" },
                { id: "var3", label: "🔔 Music Box" },
                { id: "var4", label: "🌟 Orchestra Finale" },
              ].map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => handleWindMusicBox(v.id)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition whitespace-nowrap shrink-0 ${
                    selectedVariation === v.id
                      ? "bg-pink-500 text-white shadow-sm"
                      : "bg-pink-50 dark:bg-slate-800 text-espresso hover:bg-pink-100 border border-pink-200 dark:border-slate-700"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t-2 border-pink-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => handleWindMusicBox()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white border-2 border-pink-600 transition shadow-sm whitespace-nowrap"
            >
              {isPlayingMelody ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current shrink-0" />
                  <span>Stop Cloud Lullaby</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current shrink-0" />
                  <span>Play Violin &amp; Piano Lullaby</span>
                </>
              )}
            </button>

            <div className="text-[11px] font-mono text-muted truncate">
              Notes: <strong className="text-espresso">{melodyLog.join(" · ")}</strong>
            </div>
          </div>
        </article>

        {/* TOY #02: BOTTLED AURORA NIGHTLIGHTS */}
        <article
          data-testid="project-nightlight-lanterns"
          className="rounded-3xl glass-panel border-2 border-sky-200 dark:border-slate-700 p-6 sm:p-7 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono uppercase px-3 py-1 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200 font-bold border border-sky-300 whitespace-nowrap">
                🏮 {SHOWCASE_PROJECTS[1].badge}
              </span>
              <span className="font-mono text-xs text-sky-600 font-bold whitespace-nowrap">
                Toy #02
              </span>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-4 items-center">
              <img
                src="/assets/bitz_aurora_jar.jpg"
                alt="3D studio render of Bitz's Bottled Aurora Nightlight Jar filled with swirling northern lights and floating golden stars"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-sky-200 shadow-md shrink-0"
              />
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-espresso font-display flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500 shrink-0" />
                  <span>{SHOWCASE_PROJECTS[1].title}</span>
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-muted leading-relaxed">
                  {SHOWCASE_PROJECTS[1].description}
                </p>
              </div>
            </div>

            <div
              ref={nightlightBoxRef}
              onMouseMove={(e) => handleNightlightMove(e.clientX, e.clientY)}
              onTouchMove={(e) => {
                if (e.touches && e.touches[0]) {
                  handleNightlightMove(e.touches[0].clientX, e.touches[0].clientY);
                }
              }}
              className="mt-4 relative h-40 rounded-2xl bg-slate-900 border-2 border-sky-300 overflow-hidden cursor-crosshair select-none p-4 flex flex-col justify-between"
            >
              <div
                className="pointer-events-none absolute inset-0 transition-opacity duration-200"
                style={{
                  background: torchEnabled
                    ? `radial-gradient(145px circle at ${torchPos.x}px ${torchPos.y}px, ${selectedLantern.glowColor}66, rgba(15,23,42,0.92) 85%)`
                    : `radial-gradient(circle at 50% 50%, ${selectedLantern.glowColor}44, rgba(15,23,42,0.85))`,
                }}
              />

              <div className="relative z-10 flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-pink-300 truncate">
                  {selectedLantern.name}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={handleShakeAuroraJar}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono bg-pink-500 text-white font-bold hover:bg-pink-600 transition whitespace-nowrap"
                  >
                    <Sparkles className="w-3 h-3 text-amber-200 shrink-0" />
                    <span>Shake Jar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick(1.2);
                      setTorchEnabled((t) => !t);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono bg-sky-500 text-white font-bold hover:bg-sky-600 transition whitespace-nowrap"
                  >
                    <Flashlight className="w-3 h-3 text-amber-200 shrink-0" />
                    <span>{torchEnabled ? "Torch ON" : "Full Glow"}</span>
                  </button>
                </div>
              </div>

              <div className="relative z-10 my-auto text-center">
                <p className="text-xs font-mono text-sky-200">
                  {selectedLantern.recipe}
                </p>
                <p
                  className={`mt-1 text-sm font-bold text-amber-300 tracking-wide transition-transform ${
                    jarSparkleBurst ? "scale-110 text-pink-200" : ""
                  }`}
                >
                  {jarSparkleBurst ? "✨ Swirling Starlight Aurora Ribbons! ✨" : selectedLantern.secretNote}
                </p>
              </div>

              <div className="relative z-10 text-[10px] font-mono text-slate-300 text-center">
                Move cursor across the jar to shine Bitz&apos;s Starlight Torch!
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
                className={`px-3 py-2 rounded-full text-xs font-mono font-bold border-2 transition text-center whitespace-nowrap truncate ${
                  selectedLantern.id === lantern.id
                    ? "border-pink-600 bg-pink-500 text-white shadow-sm"
                    : "border-sky-200 bg-sky-50 dark:bg-slate-800 dark:border-slate-700 text-espresso hover:border-pink-400"
                }`}
              >
                {lantern.name.split("·")[1]?.trim() || lantern.name}
              </button>
            ))}
          </div>
        </article>

        {/* TOY #03: PAPER-BOAT DREAM DELIVERY ROUTES */}
        <article
          data-testid="project-dream-routes"
          className="rounded-3xl glass-panel border-2 border-pink-200 dark:border-slate-700 p-6 sm:p-7 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono uppercase px-3 py-1 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-200 font-bold border border-pink-300 whitespace-nowrap">
                ⛵ {SHOWCASE_PROJECTS[2].badge}
              </span>
              <button
                type="button"
                onClick={handleSailFullRoute}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-bold bg-pink-500 hover:bg-pink-600 text-white transition whitespace-nowrap shadow-sm"
              >
                <span>{isSailing ? "⛵ Sailing Route..." : "⛵ Sail Full Route"}</span>
              </button>
            </div>

            <h3 className="mt-3 text-xl sm:text-2xl font-bold text-espresso font-display flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sky-600 shrink-0" />
              <span>{SHOWCASE_PROJECTS[2].title}</span>
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-muted leading-relaxed">
              {SHOWCASE_PROJECTS[2].description}
            </p>

            <div className="mt-4 rounded-2xl bg-sky-50/80 dark:bg-slate-800 border-2 border-sky-200 dark:border-slate-700 p-3 relative">
              <svg
                viewBox="0 0 400 150"
                className="w-full h-36 sm:h-40 overflow-visible"
                aria-label="Paper-Boat Dream Delivery Rooftop Route Map"
              >
                <path
                  d="M 40 105 Q 150 20 260 90 T 360 35"
                  fill="none"
                  stroke="#f472b6"
                  strokeWidth="2.5"
                  strokeDasharray="6 6"
                  opacity="0.55"
                />
                <path
                  d="M 40 105 Q 150 20 260 90 T 360 35"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="4.5"
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
                        soundEngine.playNote(
                          523.25 + idx * 90,
                          0.3,
                          idx % 2 === 0 ? "piano" : "violin"
                        );
                        setSelectedStop(stop);
                        setRouteProgress((idx + 1) * 25);
                      }}
                      className="cursor-pointer"
                    >
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isSelected ? 12 : 8}
                        fill={isSelected ? "#ec4899" : "#38bdf8"}
                        stroke="#ffffff"
                        strokeWidth="2.5"
                      />
                      {isSelected && (
                        <text x={cx} y={cy - 16} textAnchor="middle" fontSize="14">
                          ⛵
                        </text>
                      )}
                      <text
                        x={cx}
                        y={cy + 22}
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
                <span className="text-xs font-mono font-bold text-pink-600 dark:text-pink-300 whitespace-nowrap">
                  {routeProgress}%
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3.5 rounded-2xl bg-pink-50 dark:bg-slate-800 border-2 border-pink-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs font-mono font-bold text-pink-600 dark:text-pink-300">
                {selectedStop.time} · {selectedStop.name}
              </div>
              <div className="text-xs text-espresso font-semibold mt-0.5">
                Recipient: {selectedStop.recipient}
              </div>
            </div>
            <div className="text-xs font-mono bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full border border-sky-300 text-espresso font-bold whitespace-nowrap">
              ⛵ {selectedStop.cargo}
            </div>
          </div>
        </article>

        {/* TOY #04: CUMULUS BLOCK & RATTLE TOYBOX */}
        <article
          data-testid="project-block-toybox"
          className="rounded-3xl glass-panel border-2 border-sky-200 dark:border-slate-700 p-6 sm:p-7 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono uppercase px-3 py-1 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200 font-bold border border-sky-300 whitespace-nowrap">
                🧸 {SHOWCASE_PROJECTS[3].badge}
              </span>
              <span className="font-mono text-xs text-sky-600 font-bold whitespace-nowrap">
                Toy #04
              </span>
            </div>

            <h3 className="mt-3 text-xl sm:text-2xl font-bold text-espresso font-display flex items-center gap-2">
              <Layers className="w-5 h-5 text-pink-500 shrink-0" />
              <span>{SHOWCASE_PROJECTS[3].title}</span>
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-muted leading-relaxed">
              {SHOWCASE_PROJECTS[3].description}
            </p>

            <div className="mt-4 h-44 rounded-2xl bg-sky-50/80 dark:bg-slate-800 border-2 border-sky-200 dark:border-slate-700 p-3 flex flex-col-reverse items-center justify-start gap-1.5 overflow-hidden">
              {cloudBlocks.map((block) => (
                <div
                  key={block.id}
                  style={{
                    width: `${block.width}px`,
                    backgroundColor: block.color,
                  }}
                  className="py-1.5 px-3 rounded-full border-2 border-white text-slate-900 text-[11px] font-mono font-bold text-center shadow-sm transition-all whitespace-nowrap truncate"
                >
                  {block.label}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleStackBlock}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white border-2 border-pink-600 transition shadow-sm whitespace-nowrap"
              >
                <span>+ Stack Cloud Block ({cloudBlocks.length}/7)</span>
              </button>

              <button
                type="button"
                onClick={handleShakeRattle}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-xs font-bold border-2 border-sky-300 bg-sky-100 hover:bg-sky-200 text-sky-950 transition whitespace-nowrap"
              >
                <span>🔔 Ring Star-Rattle ({rattleShakes})</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick(0.9);
                setCloudBlocks([
                  { id: 1, label: "Sky Cushion #1", color: "#bae6fd", width: 185 },
                ]);
              }}
              aria-label="Reset block tower"
              className="inline-flex items-center gap-1 text-xs font-mono font-bold text-muted hover:text-pink-500 whitespace-nowrap"
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
