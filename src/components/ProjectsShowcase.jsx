"use client";

import React, { useState, useEffect, useRef } from "react";
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
  // Project 1 State: Raindrop Lullaby Lab
  const [activeNote, setActiveNote] = useState(null);
  const [isPlayingMelody, setIsPlayingMelody] = useState(false);
  const [melodyLog, setMelodyLog] = useState(["Dew C", "Sun E", "Breeze G"]);

  // Project 2 State: Bottled Aurora Nightlights + Flashlight Torch Mask
  const [selectedLantern, setSelectedLantern] = useState(
    SHOWCASE_PROJECTS[1].lanterns[0]
  );
  const [torchEnabled, setTorchEnabled] = useState(true);
  const [torchPos, setTorchPos] = useState({ x: 180, y: 110 });
  const nightlightBoxRef = useRef(null);

  // Project 3 State: Paper-Boat Dream Delivery Routes
  const [routeProgress, setRouteProgress] = useState(35);
  const [selectedStop, setSelectedStop] = useState(SHOWCASE_PROJECTS[2].stops[0]);

  // Project 4 State: Cumulus Block & Rattle Toybox
  const [cloudBlocks, setCloudBlocks] = useState([
    { id: 1, label: "Cumulus Base #1", color: "#ffccd8", width: 170 },
    { id: 2, label: "Sunbeam Puff #2", color: "#fde68a", width: 145 },
  ]);
  const [rattleShakes, setRattleShakes] = useState(0);

  // Play a single raindrop puddle note
  const handlePlayPuddle = (note) => {
    soundEngine.playNote(note.freq, 0.45, "sine");
    setActiveNote(note.id);
    setMelodyLog((prev) => [...prev.slice(-5), note.label]);
    setTimeout(() => setActiveNote(null), 320);
  };

  // Auto-play Bitz's signature bedtime lullaby
  const handleWindMusicBox = () => {
    if (isPlayingMelody) return;
    setIsPlayingMelody(true);
    const notes = SHOWCASE_PROJECTS[0].notes;
    const sequence = [0, 2, 3, 4, 3, 2, 0, 5];

    sequence.forEach((noteIndex, step) => {
      setTimeout(() => {
        const note = notes[noteIndex];
        if (note) {
          soundEngine.playNote(note.freq, 0.38, "triangle");
          setActiveNote(note.id);
        }
        if (step === sequence.length - 1) {
          setTimeout(() => {
            setActiveNote(null);
            setIsPlayingMelody(false);
          }, 350);
        }
      }, step * 280);
    });
  };

  // Handle pointer/touch move inside the Nightlight Darkroom (Tier 2 Flashlight Mask)
  const handleNightlightMove = (clientX, clientY) => {
    if (!nightlightBoxRef.current) return;
    const rect = nightlightBoxRef.current.getBoundingClientRect();
    setTorchPos({
      x: Math.max(0, Math.min(rect.width, clientX - rect.left)),
      y: Math.max(0, Math.min(rect.height, clientY - rect.top)),
    });
  };

  // Stack a new fluffy cloud block in Project 4
  const handleStackBlock = () => {
    const palette = ["#ffccd8", "#fde68a", "#a7f3d0", "#bfdbfe", "#e9d5ff"];
    const names = [
      "Marshmallow Cirrus",
      "Starlight Nimbus",
      "Dewdrop Stratus",
      "Berry Twilight Puff",
      "Golden Aurora Block",
    ];
    if (cloudBlocks.length >= 7) {
      // Tower tumbles with a giggle!
      soundEngine.playGiggle();
      setCloudBlocks([
        { id: 1, label: "Cumulus Base #1", color: "#ffccd8", width: 170 },
      ]);
      return;
    }
    const nextNum = cloudBlocks.length + 1;
    soundEngine.playNote(440 + nextNum * 65, 0.25, "sine");
    setCloudBlocks((prev) => [
      ...prev,
      {
        id: Date.now(),
        label: `${names[nextNum % names.length]} #${nextNum}`,
        color: palette[nextNum % palette.length],
        width: Math.max(85, 180 - nextNum * 14),
      },
    ]);
  };

  const handleShakeRattle = () => {
    soundEngine.playNote(880, 0.12, "triangle");
    setTimeout(() => soundEngine.playNote(1046.5, 0.14, "sine"), 90);
    setRattleShakes((c) => c + 1);
  };

  return (
    <section
      id="projects-showcase"
      aria-labelledby="projects-heading"
      className="py-12 sm:py-16 px-4 max-w-6xl mx-auto"
    >
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-[#a34063]/10 text-[#a34063] font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          Section 05.2 & Tier 2 · What Bitz Does (4 Interactive Creations)
        </span>
        <h2
          id="projects-heading"
          className="mt-2 text-3xl sm:text-4xl font-bold text-espresso font-display"
        >
          Inside the Sky-Loft Weather Workshop
        </h2>
        <p className="mt-2 text-sm sm:text-base text-muted">
          Every project below is a live, playable nursery invention. Tap the puddles,
          shine the starlight torch, trace the rooftop flight map, or stack cloud blocks!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* PROJECT 1: THE RAINDROP LULLABY LAB (Web Audio Synthesizer) */}
        <article
          data-testid="project-lullaby-lab"
          className="rounded-3xl border-2 border-[#a34063]/25 bg-card p-6 sm:p-8 shadow-cozy flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono uppercase px-2.5 py-1 rounded-full bg-[#a34063]/10 text-[#a34063] font-bold">
                {SHOWCASE_PROJECTS[0].badge}
              </span>
              <span className="font-mono text-xs text-muted">Project #01</span>
            </div>

            <h3 className="mt-3 text-xl sm:text-2xl font-bold text-espresso font-display flex items-center gap-2">
              <Music className="w-5 h-5 text-[#a34063]" />
              {SHOWCASE_PROJECTS[0].title}
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-muted leading-relaxed">
              {SHOWCASE_PROJECTS[0].description}
            </p>

            {/* Interactive 6-Note Raindrop Puddle Pads */}
            <div className="mt-5 grid grid-cols-3 sm:grid-cols-6 gap-2.5">
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
                    className={`py-3 px-2 rounded-2xl border-2 font-mono text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${
                      isActive
                        ? "border-espresso text-espresso scale-105 shadow-md"
                        : "border-[#a34063]/25 bg-cream hover:border-[#a34063] text-espresso"
                    }`}
                  >
                    <span className="text-sm">{note.id}</span>
                    <span className="text-[10px] opacity-80">{note.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#a34063]/15 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleWindMusicBox}
              disabled={isPlayingMelody}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-[#a34063] text-[#fff8f1] hover:opacity-95 disabled:opacity-60 transition"
            >
              {isPlayingMelody ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  Playing Lullaby...
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Wind Golden Music Box
                </>
              )}
            </button>

            <div className="text-[11px] font-mono text-muted">
              Last notes: <strong className="text-espresso">{melodyLog.join(" · ")}</strong>
            </div>
          </div>
        </article>

        {/* PROJECT 2: BOTTLED AURORA NIGHTLIGHTS (Flashlight / Torch Cursor Mask) */}
        <article
          data-testid="project-nightlight-lanterns"
          className="rounded-3xl border-2 border-[#a34063]/25 bg-card p-6 sm:p-8 shadow-cozy flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono uppercase px-2.5 py-1 rounded-full bg-[#a34063]/10 text-[#a34063] font-bold">
                {SHOWCASE_PROJECTS[1].badge}
              </span>
              <span className="font-mono text-xs text-muted">Project #02</span>
            </div>

            <h3 className="mt-3 text-xl sm:text-2xl font-bold text-espresso font-display flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              {SHOWCASE_PROJECTS[1].title}
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-muted leading-relaxed">
              {SHOWCASE_PROJECTS[1].description}
            </p>

            {/* Interactive Darkroom Canvas with CSS Radial Flashlight Mask */}
            <div
              ref={nightlightBoxRef}
              onMouseMove={(e) => handleNightlightMove(e.clientX, e.clientY)}
              onTouchMove={(e) => {
                if (e.touches && e.touches[0]) {
                  handleNightlightMove(e.touches[0].clientX, e.touches[0].clientY);
                }
              }}
              className="mt-4 relative h-44 rounded-2xl bg-[#110b18] border-2 border-[#a34063]/40 overflow-hidden cursor-crosshair select-none p-4 flex flex-col justify-between"
            >
              {/* Torch Spotlight Layer */}
              <div
                className="pointer-events-none absolute inset-0 transition-opacity duration-200"
                style={{
                  background: torchEnabled
                    ? `radial-gradient(120px circle at ${torchPos.x}px ${torchPos.y}px, ${selectedLantern.glowColor}55, rgba(17,11,24,0.94) 85%)`
                    : "none",
                }}
              />

              <div className="relative z-10 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-300">
                  {selectedLantern.name}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick(1.2);
                    setTorchEnabled((t) => !t);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono bg-white/15 text-white hover:bg-white/25 transition"
                >
                  <Flashlight className="w-3 h-3 text-amber-300" />
                  {torchEnabled ? "Torch ON" : "Full Light"}
                </button>
              </div>

              {/* Hidden Constellation Revealed Under Torch */}
              <div className="relative z-10 my-auto text-center">
                <p className="text-xs font-mono text-pink-200">
                  {selectedLantern.recipe}
                </p>
                <p className="mt-1.5 text-sm font-bold text-amber-300 tracking-wide">
                  {selectedLantern.secretNote}
                </p>
              </div>

              <div className="relative z-10 text-[10px] font-mono text-white/60 text-center">
                Move cursor or drag finger across the dark nursery to shine Bitz&apos;s lantern!
              </div>
            </div>
          </div>

          {/* Lantern Selector Pills */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SHOWCASE_PROJECTS[1].lanterns.map((lantern) => (
              <button
                key={lantern.id}
                type="button"
                onClick={() => {
                  soundEngine.playNote(587.33, 0.2, "sine");
                  setSelectedLantern(lantern);
                }}
                className={`px-2.5 py-2 rounded-xl text-[11px] font-mono font-semibold border transition text-center truncate ${
                  selectedLantern.id === lantern.id
                    ? "border-[#a34063] bg-[#a34063] text-[#fff8f1]"
                    : "border-[#a34063]/20 bg-cream text-espresso hover:border-[#a34063]"
                }`}
              >
                {lantern.name.split("·")[1]}
              </button>
            ))}
          </div>
        </article>

        {/* PROJECT 3: PAPER-BOAT DREAM DELIVERY ROUTES (Interactive SVG Flight Map) */}
        <article
          data-testid="project-dream-routes"
          className="rounded-3xl border-2 border-[#a34063]/25 bg-card p-6 sm:p-8 shadow-cozy flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono uppercase px-2.5 py-1 rounded-full bg-[#a34063]/10 text-[#a34063] font-bold">
                {SHOWCASE_PROJECTS[2].badge}
              </span>
              <span className="font-mono text-xs text-muted">Project #03</span>
            </div>

            <h3 className="mt-3 text-xl sm:text-2xl font-bold text-espresso font-display flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#a34063]" />
              {SHOWCASE_PROJECTS[2].title}
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-muted leading-relaxed">
              {SHOWCASE_PROJECTS[2].description}
            </p>

            {/* Interactive SVG Rooftop Delivery Map */}
            <div className="mt-4 rounded-2xl bg-cream border-2 border-[#a34063]/20 p-3 relative">
              <svg
                viewBox="0 0 400 150"
                className="w-full h-36 sm:h-40 overflow-visible"
                aria-label="Paper-Boat Dream Delivery Rooftop Route Map"
              >
                {/* Background Dashed Flight Curve */}
                <path
                  d="M 40 105 Q 150 20 260 90 T 360 35"
                  fill="none"
                  stroke="#a34063"
                  strokeWidth="2.5"
                  strokeDasharray="6 6"
                  opacity="0.35"
                />
                {/* Animated Active Flight Progress Curve */}
                <path
                  d="M 40 105 Q 150 20 260 90 T 360 35"
                  fill="none"
                  stroke="#a34063"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="400"
                  strokeDashoffset={400 - (routeProgress / 100) * 400}
                />

                {/* Rooftop Stop Nodes */}
                {SHOWCASE_PROJECTS[2].stops.map((stop, idx) => {
                  const cx = (stop.x / 100) * 380 + 10;
                  const cy = (stop.y / 100) * 130 + 10;
                  const isSelected = selectedStop.id === stop.id;
                  return (
                    <g
                      key={stop.id}
                      onClick={() => {
                        soundEngine.playNote(523.25 + idx * 90, 0.25, "triangle");
                        setSelectedStop(stop);
                        setRouteProgress((idx + 1) * 25);
                      }}
                      className="cursor-pointer"
                    >
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isSelected ? 11 : 8}
                        fill={isSelected ? "#a34063" : "#f4b942"}
                        stroke="#5c4033"
                        strokeWidth="2.5"
                      />
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

              {/* Flight Scrub Slider */}
              <div className="mt-2 flex items-center gap-3">
                <Send className="w-3.5 h-3.5 text-[#a34063]" />
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={routeProgress}
                  aria-label="Paper boat flight progress along rooftop route"
                  onChange={(e) => setRouteProgress(Number(e.target.value))}
                  className="w-full accent-[#a34063] cursor-pointer"
                />
                <span className="text-xs font-mono font-bold text-[#a34063]">
                  {routeProgress}%
                </span>
              </div>
            </div>
          </div>

          {/* Selected Rooftop Stop Details */}
          <div className="mt-4 p-3.5 rounded-2xl bg-[#a34063]/5 border border-[#a34063]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs font-mono font-bold text-[#a34063]">
                {selectedStop.time} · {selectedStop.name}
              </div>
              <div className="text-xs text-espresso font-semibold mt-0.5">
                Recipient: {selectedStop.recipient}
              </div>
            </div>
            <div className="text-xs font-mono bg-card px-3 py-1.5 rounded-xl border border-[#a34063]/20 text-espresso">
              📦 {selectedStop.cargo}
            </div>
          </div>
        </article>

        {/* PROJECT 4: CUMULUS BLOCK & RATTLE TOYBOX (Interactive Mini-Game) */}
        <article
          data-testid="project-block-toybox"
          className="rounded-3xl border-2 border-[#a34063]/25 bg-card p-6 sm:p-8 shadow-cozy flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono uppercase px-2.5 py-1 rounded-full bg-[#a34063]/10 text-[#a34063] font-bold">
                {SHOWCASE_PROJECTS[3].badge}
              </span>
              <span className="font-mono text-xs text-muted">Project #04</span>
            </div>

            <h3 className="mt-3 text-xl sm:text-2xl font-bold text-espresso font-display flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#a34063]" />
              {SHOWCASE_PROJECTS[3].title}
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-muted leading-relaxed">
              {SHOWCASE_PROJECTS[3].description}
            </p>

            {/* Visual Cloud Block Stacker Stage */}
            <div className="mt-4 h-44 rounded-2xl bg-cream border-2 border-[#a34063]/20 p-3 flex flex-col-reverse items-center justify-start gap-1.5 overflow-hidden">
              {cloudBlocks.map((block) => (
                <div
                  key={block.id}
                  style={{
                    width: `${block.width}px`,
                    backgroundColor: block.color,
                  }}
                  className="py-1.5 px-3 rounded-xl border-2 border-[#5c4033] text-[#5c4033] text-[11px] font-mono font-bold text-center shadow-sm transition-all"
                >
                  {block.label}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleStackBlock}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-[#a34063] text-[#fff8f1] hover:opacity-95 transition"
              >
                + Stack Cloud Block ({cloudBlocks.length}/7)
              </button>

              <button
                type="button"
                onClick={handleShakeRattle}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border-2 border-[#a34063]/30 bg-cream text-espresso hover:border-[#a34063] transition"
              >
                🔔 Shake Rattle ({rattleShakes})
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick(0.9);
                setCloudBlocks([
                  { id: 1, label: "Cumulus Base #1", color: "#ffccd8", width: 170 },
                ]);
              }}
              aria-label="Reset block tower"
              className="inline-flex items-center gap-1 text-xs font-mono text-muted hover:text-[#a34063]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}
