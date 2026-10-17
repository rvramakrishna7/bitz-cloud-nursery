"use client";

import React, { useState, useEffect, useRef } from "react";
import { Zap, Heart, Music, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { calculatePupilOffset, soundEngine } from "@/lib/soundEngine";

export default function BitzCharacter({
  theme = "day",
  onToggleTheme,
  onEasterEggTriggered,
  easterEggUnlocked = false,
}) {
  const containerRef = useRef(null);
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [headTilt, setHeadTilt] = useState(0);
  const [antennaClicks, setAntennaClicks] = useState(0);
  // Mood states: "happy" | "giggle" | "wave" | "lullaby" | "bell" | "rainbow"
  const [moodReaction, setMoodReaction] = useState("happy");
  // Full Baby Outfits (Kapde + Headgear!): "onesie" | "hoodie" | "royal" | "sailor" | "dj"
  const [outfit, setOutfit] = useState("onesie");
  const [isBlinking, setIsBlinking] = useState(false);
  const [speechBubble, setSpeechBubble] = useState(
    "Hiya! I'm Mochi! Move your mouse—my eyes follow you! Dress me up in cute baby clothes or tap my buttons below! ✨"
  );

  // Real-time cursor & touch tracking (maxOffset = 5.2px so eyeballs stay 100% inside sockets)
  useEffect(() => {
    const handlePointerMove = (clientX, clientY) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      const offset = calculatePupilOffset(center, { x: clientX, y: clientY }, 5.2);
      setPupilOffset(offset);
      const tilt = Math.max(-7, Math.min(7, (clientX - center.x) / 36));
      setHeadTilt(Number(tilt.toFixed(2)));
    };

    const onMouseMove = (e) => handlePointerMove(e.clientX, e.clientY);
    const onTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  // Natural blinking loop every 3.6 seconds
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3600);
    return () => clearInterval(blinkInterval);
  }, []);

  // Action 1: Joyful Jump, Cheer & Heart-Bubble Laugh (Belly Tickle)
  const handlePokeBelly = () => {
    soundEngine.playGiggle();
    setMoodReaction("giggle");
    const messages = [
      "Wheee! Tickling my belly makes me bounce and giggle a shower of hearts! 💖☁️",
      "Hehehe! My strawberry onesie is extra ticklish right on my tummy! 🍓✨",
      "Boing-puff! That tickles right through my marshmallow fluff! 💕",
    ];
    setSpeechBubble(messages[Math.floor(Math.random() * messages.length)]);
    setTimeout(() => {
      setMoodReaction((curr) => (curr === "giggle" ? "happy" : curr));
    }, 2400);
  };

  // Action 2: Friendly Wave & Spinning Rainbow Candy Wand!
  const handleWaveWand = (e) => {
    if (e) e.stopPropagation();
    soundEngine.playMoonWaveMelody();
    setMoodReaction("wave");
    setSpeechBubble(
      "*Winks and waves!* Look at my Swirling Rainbow Candy Wand spinning sugar-sparks across the sky! 🍭😉✨"
    );
    setTimeout(() => {
      setMoodReaction((curr) => (curr === "wave" ? "happy" : curr));
    }, 2500);
  };

  // Action 3: Cozy Cradle Sway & 1773 Classical Symphony Lullaby
  const handleSingLullaby = (e) => {
    if (e) e.stopPropagation();
    if (moodReaction === "lullaby" && soundEngine.isPlayingLullaby) {
      soundEngine.stopLullaby();
      setMoodReaction("happy");
      setSpeechBubble("✨ Lullaby paused! Tap anytime to hear my 1773 Violin & Grand Piano Lullaby again!");
      return;
    }
    setMoodReaction("lullaby");
    setSpeechBubble(
      "🎻🎹 Variation 1: Playing 1773 Classical Lullaby on Bowed Violin & Grand Piano Chords... ☁️✨"
    );
    soundEngine.playCloudLullaby(
      "full",
      (ev) => {
        if (ev.label && ev.label.includes("Bansuri")) {
          setSpeechBubble(
            "🪈🪕 Variation 2: Sliding Indian Bansuri Flute & Rapid Santoor Harp Glissandos... 🌸✨"
          );
        } else if (ev.label && ev.label.includes("Crystal Bell")) {
          setSpeechBubble(
            "🔔✨ Variation 3: High-Octave Baby Music-Box Waltz twinkling in the sky... 🎶"
          );
        } else if (ev.label && ev.label.includes("Upbeat")) {
          setSpeechBubble(
            "🌟🎻 Variation 4: Upbeat 90s Arcade & Full Orchestra Celebration Finale! 🌈🎶"
          );
        }
      },
      () => {
        setMoodReaction((curr) => (curr === "lullaby" ? "happy" : curr));
      }
    );
  };

  // Action 4: Ring Golden Star-Bell (3x Triggers Massive Sky-Wide Confetti Shower!)
  const handleAntennaClick = (e) => {
    if (e) e.stopPropagation();
    const nextCount = antennaClicks + 1;
    setAntennaClicks(nextCount);

    if (nextCount >= 3) {
      soundEngine.playSecretLullaby();
      setMoodReaction("rainbow");
      setSpeechBubble(
        "🎉 SECRET EASTER EGG UNLOCKED! Enjoy the Grand Sky-Wide Confetti Shower & Golden Starlight Crown! 🌈✨"
      );
      if (typeof window !== "undefined") {
        try {
          const colors = ["#f472b6", "#38bdf8", "#fbbf24", "#c084fc", "#4ade80", "#fb7185"];
          // 6-Wave Massive Top-Down Confetti Rain Shower!
          [0, 260, 520, 800, 1100, 1450].forEach((delay, idx) => {
            setTimeout(() => {
              try {
                confetti({
                  particleCount: 85,
                  angle: idx % 2 === 0 ? 65 : 115,
                  spread: 95,
                  startVelocity: 42,
                  gravity: 0.75,
                  ticks: 260,
                  scalar: 1.15,
                  origin: { x: 0.15 + (idx * 0.14) % 0.75, y: 0.06 },
                  colors,
                });
              } catch (err) {}
            }, delay);
          });
        } catch (err) {}
      }
      onEasterEggTriggered?.();
      setAntennaClicks(0);
    } else {
      soundEngine.playStarBellMelody(nextCount);
      setMoodReaction("bell");
      setSpeechBubble(
        `🔔 *Ting-a-ling!* Golden Star-Bell chimed (${nextCount}/3)... ring ${
          3 - nextCount
        } more time${3 - nextCount === 1 ? "" : "s"} for a Massive Sky Confetti Shower!`
      );
      setTimeout(() => {
        setMoodReaction((curr) => (curr === "bell" ? "happy" : curr));
      }, 1500);
    }
  };

  const isNight = theme === "night";
  const isGiggling = moodReaction === "giggle";
  const isWaving = moodReaction === "wave";
  const isLullaby = moodReaction === "lullaby";
  const isBellRinging = moodReaction === "bell";
  const isRainbow = moodReaction === "rainbow" || easterEggUnlocked;

  const bodyChoreographyClass = isGiggling
    ? "animate-joyful-jump"
    : isLullaby
    ? "animate-cradle-sway"
    : "";

  const outfitsList = [
    { id: "onesie", label: "🍓 Berry Onesie" },
    { id: "hoodie", label: "🧥 Bunny Hoodie" },
    { id: "royal", label: "👑 Royal Cape" },
    { id: "sailor", label: "⚓ Sailor Suit" },
    { id: "dj", label: "🎧 DJ Jacket" },
  ];

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center select-none py-1 w-full max-w-full overflow-hidden"
      data-testid="bitz-character-stage"
    >
      {/* Responsive Pastel Speech Bubble Above Mochi */}
      <div
        aria-live="polite"
        className="mb-2 px-4 py-2 rounded-3xl bg-white/95 dark:bg-slate-800 border-2 border-pink-300 dark:border-sky-400 shadow-sm text-center w-full max-w-md mx-auto"
      >
        <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug break-words">
          {speechBubble}
        </p>
      </div>

      {/* FREE-FLOATING SEAMLESS 3D PLUSHIE CHARACTER STAGE */}
      <div
        onClick={handlePokeBelly}
        role="button"
        tabIndex={0}
        aria-label="Mochi the 3D Baby Cloud-Sprite. Click to tickle Mochi and see joyful animations!"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handlePokeBelly();
          }
        }}
        className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[360px] lg:h-[350px] flex items-center justify-center cursor-pointer group focus:outline-none"
      >
        {/* Soft Ambient Sky Glow Behind Mochi */}
        <div
          className={`absolute inset-8 rounded-full blur-2xl opacity-55 transition-all duration-700 pointer-events-none ${
            isNight ? "bg-sky-500/35" : "bg-pink-200/70"
          }`}
        />

        {/* MASTER 3D PLUSHIE SVG RIG WITH REAL BABY OUTFITS (KAPDE) & CANDY WAND */}
        <svg
          viewBox="0 0 440 420"
          className="w-full h-full overflow-visible animate-float"
        >
          <defs>
            {/* STRICT EYE-SOCKET CLIP PATHS (Guarantees eyeballs NEVER leave the eyes!) */}
            <clipPath id="eyeSocketClipLeft">
              <ellipse cx="182" cy="230" rx="22" ry="24" />
            </clipPath>
            <clipPath id="eyeSocketClipRight">
              <ellipse cx="258" cy="230" rx="22" ry="24" />
            </clipPath>

            <radialGradient id="sculptedCloudBody3D" cx="38%" cy="28%" r="70%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="58%" stopColor="#fff7fb" />
              <stop offset="86%" stopColor="#fce7f3" />
              <stop offset="100%" stopColor="#f9a8d4" />
            </radialGradient>

            <radialGradient id="plushLimb3D" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="65%" stopColor="#fce7f3" />
              <stop offset="100%" stopColor="#f472b6" />
            </radialGradient>

            <linearGradient id="skyCushionBase3D" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="48%" stopColor="#e0f2fe" />
              <stop offset="100%" stopColor="#7dd3fc" />
            </linearGradient>

            <radialGradient id="knitCapSculpt3D" cx="35%" cy="25%" r="75%">
              <stop offset="0%" stopColor="#a5b4fc" />
              <stop offset="55%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#4338ca" />
            </radialGradient>

            <linearGradient id="knitBrimSculpt3D" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="55%" stopColor="#e0f2fe" />
              <stop offset="100%" stopColor="#93c5fd" />
            </linearGradient>

            <radialGradient id="goldSculpt3D" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fef9c3" />
              <stop offset="45%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#d97706" />
            </radialGradient>

            <radialGradient id="cutieSun3D" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="65%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#f59e0b" />
            </radialGradient>

            <radialGradient id="rosyCheek3D" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.65" />
              <stop offset="60%" stopColor="#fb7185" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#fb7185" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="kawaiiIris3D" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#451a03" />
              <stop offset="65%" stopColor="#1e1b4b" />
              <stop offset="100%" stopColor="#090d16" />
            </radialGradient>

            <linearGradient id="pinkBow3D" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbcfe8" />
              <stop offset="50%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#db2777" />
            </linearGradient>

            <linearGradient id="lollipopSwirl" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="35%" stopColor="#fde047" />
              <stop offset="70%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
          </defs>

          {/* LAYER 0: MOVING & SHIMMERING RAINBOW BRIDGE IN THE SKY */}
          <g
            className="animate-rainbow-sway"
            opacity={isRainbow ? "1" : isNight ? "0.78" : "0.92"}
          >
            <path
              d="M 52 215 A 168 168 0 0 1 388 215"
              fill="none"
              stroke={isNight ? "#ec4899" : "#f9a8d4"}
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              d="M 64 215 A 156 156 0 0 1 376 215"
              fill="none"
              stroke={isNight ? "#facc15" : "#fde047"}
              strokeWidth="11"
              strokeLinecap="round"
            />
            <path
              d="M 76 215 A 144 144 0 0 1 364 215"
              fill="none"
              stroke={isNight ? "#38bdf8" : "#7dd3fc"}
              strokeWidth="11"
              strokeLinecap="round"
            />
            <path
              d="M 88 215 A 132 132 0 0 1 352 215"
              fill="none"
              stroke={isNight ? "#a855f7" : "#d8b4fe"}
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M 64 215 A 156 156 0 0 1 376 215"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="12 18"
              className="animate-rainbow-shimmer"
              opacity="0.85"
            />
          </g>

          {/* LAYER 0.5: DAY vs. NIGHT FLOATING SKY BUDDIES IN THE AIR */}
          <g
            onClick={(e) => {
              e.stopPropagation();
              soundEngine.playClick(1.2);
              onToggleTheme?.();
            }}
            className="cursor-pointer"
          >
            {!isNight ? (
              /* DAY SKY: Cutie Smiling 3D Sun Buddy */
              <g className="animate-celestial-a" style={{ transformOrigin: "372px 86px" }}>
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <line
                    key={deg}
                    x1="372"
                    y1="86"
                    x2={372 + Math.cos((deg * Math.PI) / 180) * 34}
                    y2={86 + Math.sin((deg * Math.PI) / 180) * 34}
                    stroke="#fbbf24"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                ))}
                <circle
                  cx="372"
                  cy="86"
                  r="23"
                  fill="url(#cutieSun3D)"
                  stroke="#fef08a"
                  strokeWidth="2"
                />
                <circle cx="364" cy="83" r="2.6" fill="#451a03" />
                <circle cx="380" cy="83" r="2.6" fill="#451a03" />
                <circle cx="359" cy="88" r="3.5" fill="#f43f5e" opacity="0.55" />
                <circle cx="385" cy="88" r="3.5" fill="#f43f5e" opacity="0.55" />
                <path
                  d="M 367 90 Q 372 95 377 90"
                  fill="none"
                  stroke="#451a03"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>
            ) : (
              /* NIGHT SKY: Sleeping 3D Crescent Moon Buddy + Zzz */
              <g className="animate-celestial-a" style={{ transformOrigin: "372px 86px" }}>
                <circle cx="372" cy="86" r="28" fill="#38bdf8" opacity="0.22" />
                <path
                  d="M 382 60 A 24 24 0 1 0 396 104 A 19 19 0 1 1 382 60 Z"
                  fill="url(#goldSculpt3D)"
                  stroke="#fef08a"
                  strokeWidth="1.5"
                />
                <path
                  d="M 366 84 Q 370 87 374 84"
                  fill="none"
                  stroke="#78350f"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <circle cx="364" cy="89" r="3.2" fill="#f472b6" opacity="0.65" />
                <text x="395" y="66" fill="#bae6fd" fontSize="12" fontWeight="bold">
                  Zzz
                </text>
              </g>
            )}

            {/* Floating Mini Cloud Buddy & 3D Stars */}
            <g className="animate-celestial-b" style={{ transformOrigin: "64px 96px" }}>
              <path
                d="M 42 104 C 32 104, 30 90, 42 88 C 46 78, 62 78, 68 86 C 78 84, 86 94, 78 104 Z"
                fill="#ffffff"
                stroke="#fbcfe8"
                strokeWidth="2"
              />
              <circle cx="52" cy="95" r="1.8" fill="#f472b6" />
              <circle cx="64" cy="95" r="1.8" fill="#38bdf8" />
            </g>

            <g className="animate-celestial-b" style={{ transformOrigin: "44px 235px" }}>
              <polygon
                points="44,218 49,228 60,229 52,237 54,248 44,242 34,248 36,237 28,229 39,228"
                fill="url(#goldSculpt3D)"
              />
            </g>

            <g className="animate-celestial-a" style={{ transformOrigin: "396px 265px" }}>
              <polygon
                points="396,248 401,258 412,259 404,267 406,278 396,272 386,278 388,267 380,259 391,258"
                fill="url(#goldSculpt3D)"
              />
            </g>
          </g>

          {/* LAYER 1: SKY-BLUE 3D CLOUD CUSHION WITH ♥ Mochi ♥ EMBROIDERY */}
          <g className={isLullaby ? "animate-cradle-sway" : ""}>
            <ellipse cx="220" cy="392" rx="140" ry="18" fill="#38bdf8" opacity="0.2" />
            <path
              d="M 88 344 C 66 344, 58 368, 80 380 C 102 394, 148 398, 180 392 C 206 402, 234 402, 260 392 C 292 398, 338 394, 360 380 C 382 368, 374 344, 352 344 C 342 320, 306 314, 284 326 C 258 308, 182 308, 156 326 C 134 314, 98 320, 88 344 Z"
              fill="url(#skyCushionBase3D)"
              stroke="#bae6fd"
              strokeWidth="2"
            />
            <path
              d="M 135 338 Q 220 322 305 338"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.7"
            />
            <circle cx="128" cy="364" r="3.5" fill="#f472b6" opacity="0.85" />
            <circle cx="312" cy="364" r="3.5" fill="#fbbf24" opacity="0.9" />
            <text
              x="220"
              y="382"
              textAnchor="middle"
              fill="#db2777"
              fontSize="16"
              fontWeight="bold"
              fontFamily="var(--font-fredoka), sans-serif"
            >
              ♥ Mochi ♥
            </text>
          </g>

          {/* LAYER 2: MOCHI'S CHOREOGRAPHED 3D BODY RIG + REAL BABY CLOTHES (KAPDE)! */}
          <g className={bodyChoreographyClass}>
            {/* SEAMLESS SCULPTED 3D PLUSHIE CLOUD BODY */}
            <path
              d="M 136 168 C 148 122, 188 106, 220 116 C 252 106, 292 122, 304 168 C 344 176, 360 220, 338 256 C 354 292, 326 332, 286 330 C 266 346, 238 346, 220 338 C 202 346, 174 346, 154 330 C 114 332, 86 292, 102 256 C 80 220, 96 176, 136 168 Z"
              fill="url(#sculptedCloudBody3D)"
              stroke="#fce7f3"
              strokeWidth="2"
              strokeLinejoin="round"
            />

            <path
              d="M 110 245 C 94 218, 106 184, 140 174"
              fill="none"
              stroke="#ffffff"
              strokeWidth="4.5"
              strokeLinecap="round"
              opacity="0.85"
            />

            {/* ==============================================================
                LAYER 2.5: REAL INTERACTIVE BABY CLOTHES (KAPDE) ON MOCHI'S BODY!
               ============================================================== */}
            {outfit === "onesie" && (
              /* 🍓 OUTFIT 1: Cute Pink Strawberry Baby Romper / Overalls */
              <g>
                {/* Overall Straps */}
                <path
                  d="M 176 254 L 166 292 M 264 254 L 274 292"
                  stroke="#f472b6"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                {/* Romper Bib & Pants */}
                <path
                  d="M 152 276 Q 220 264 288 276 C 304 306, 288 336, 256 338 Q 220 344 184 338 C 152 336, 136 306, 152 276 Z"
                  fill="#fbcfe8"
                  stroke="#f472b6"
                  strokeWidth="2.2"
                />
                {/* White Lace Scallop Trim */}
                <path
                  d="M 156 278 Q 172 286 188 278 Q 204 286 220 278 Q 236 286 252 278 Q 268 286 284 278"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                {/* Golden Overall Buttons */}
                <circle cx="174" cy="276" r="4.5" fill="#facc15" stroke="#d97706" strokeWidth="1.2" />
                <circle cx="266" cy="276" r="4.5" fill="#facc15" stroke="#d97706" strokeWidth="1.2" />
                {/* Cute Strawberry Pocket on Tummy */}
                <path
                  d="M 220 318 C 208 316, 206 296, 220 296 C 234 296, 232 316, 220 318 Z"
                  fill="#f43f5e"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                <path d="M 215 295 L 220 299 L 225 295" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
              </g>
            )}

            {outfit === "hoodie" && (
              /* 🧥 OUTFIT 2: Cozy Sky-Blue Baby Hoodie with Kangaroo Pocket & Star Zipper */
              <g>
                <path
                  d="M 138 266 Q 220 256 302 266 C 316 302, 296 336, 260 338 Q 220 344 180 338 C 144 336, 124 302, 138 266 Z"
                  fill="#bae6fd"
                  stroke="#38bdf8"
                  strokeWidth="2.4"
                />
                {/* Center Zipper Line & Star Pull */}
                <line x1="220" y1="264" x2="220" y2="338" stroke="#ffffff" strokeWidth="3" />
                {/* Kangaroo Front Pouch */}
                <path
                  d="M 180 302 L 190 290 L 250 290 L 260 302 L 254 324 L 186 324 Z"
                  fill="#e0f2fe"
                  stroke="#38bdf8"
                  strokeWidth="1.8"
                />
                {/* White Drawstrings */}
                <path d="M 204 266 Q 200 284 205 292 M 236 266 Q 240 284 235 292" fill="none" stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round" />
                <circle cx="205" cy="293" r="3" fill="#f472b6" />
                <circle cx="235" cy="293" r="3" fill="#f472b6" />
              </g>
            )}

            {outfit === "royal" && (
              /* 👑 OUTFIT 3: Royal Velvet Baby Cape with Fluffy Fur Collar & Gem Clasp */
              <g>
                {/* Flowing Royal Cape around Shoulders & Body */}
                <path
                  d="M 122 256 Q 220 248 318 256 L 334 328 Q 220 348 106 328 Z"
                  fill="#c084fc"
                  stroke="#9333ea"
                  strokeWidth="2.2"
                />
                {/* Inner Satin Lining */}
                <path
                  d="M 178 262 L 220 334 L 262 262 Z"
                  fill="#fce7f3"
                />
                {/* Fluffy White Fur Ermine Collar */}
                <path
                  d="M 140 260 Q 160 274 180 262 Q 200 274 220 262 Q 240 274 260 262 Q 280 274 300 260"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="9"
                  strokeLinecap="round"
                />
                {/* Golden Royal Brooch Clasp */}
                <circle cx="220" cy="268" r="8" fill="url(#goldSculpt3D)" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="220" cy="268" r="4" fill="#ec4899" />
              </g>
            )}

            {outfit === "sailor" && (
              /* ⚓ OUTFIT 4: Cute Baby Sailor Shirt with Striped Collar & Red Bow-Tie */
              <g>
                <path
                  d="M 144 268 Q 220 260 296 268 C 308 302, 290 334, 256 336 Q 220 342 184 336 C 150 334, 132 302, 144 268 Z"
                  fill="#ffffff"
                  stroke="#38bdf8"
                  strokeWidth="2.2"
                />
                {/* Navy-Sky Sailor V-Collar */}
                <path
                  d="M 156 264 L 220 306 L 284 264 L 264 260 L 220 288 L 176 260 Z"
                  fill="#0284c7"
                  stroke="#ffffff"
                  strokeWidth="1.8"
                />
                {/* Cute Red Sailor Bow-Tie */}
                <polygon points="220,294 202,284 202,304" fill="#f43f5e" />
                <polygon points="220,294 238,284 238,304" fill="#f43f5e" />
                <circle cx="220" cy="294" r="4.5" fill="#fbbf24" />
              </g>
            )}

            {outfit === "dj" && (
              /* 🎧 OUTFIT 5: Pastel Pink & Sky Baby Varsity Jacket with "M" Emblem */
              <g>
                <path
                  d="M 140 266 Q 220 258 300 266 C 314 302, 294 336, 258 338 Q 220 344 182 338 C 146 336, 126 302, 140 266 Z"
                  fill="#f472b6"
                  stroke="#db2777"
                  strokeWidth="2.2"
                />
                {/* White Snap Buttons Down Center */}
                <line x1="220" y1="264" x2="220" y2="338" stroke="#ffffff" strokeWidth="3" />
                <circle cx="220" cy="280" r="3" fill="#fde047" />
                <circle cx="220" cy="298" r="3" fill="#fde047" />
                <circle cx="220" cy="316" r="3" fill="#fde047" />
                {/* Varsity "M" Patch for Mochi */}
                <rect x="242" y="280" width="24" height="24" rx="6" fill="#ffffff" stroke="#38bdf8" strokeWidth="1.8" />
                <text x="254" y="297" textAnchor="middle" fill="#db2777" fontSize="14" fontWeight="bold">
                  M
                </text>
              </g>
            )}

            {/* Chubby Seated Plushie Feet with Rosy Toe Pads */}
            <g transform={isGiggling ? "translate(0, -8)" : "translate(0, 0)"}>
              <ellipse
                cx="172"
                cy="334"
                rx="26"
                ry="18"
                transform="rotate(-8 172 334)"
                fill="url(#plushLimb3D)"
                stroke="#fbcfe8"
                strokeWidth="1.5"
              />
              <ellipse cx="172" cy="337" rx="11" ry="6.5" fill="#f9a8d4" />

              <ellipse
                cx="268"
                cy="334"
                rx="26"
                ry="18"
                transform="rotate(8 268 334)"
                fill="url(#plushLimb3D)"
                stroke="#fbcfe8"
                strokeWidth="1.5"
              />
              <ellipse cx="268" cy="337" rx="11" ry="6.5" fill="#f9a8d4" />
            </g>

            {/* LAYER 3: SCULPTED 3D PERIWINKLE KNIT SLEEPING CAP + OUTFIT HEADGEAR */}
            <g transform={`rotate(${headTilt * 0.4} 220 135)`}>
              <path
                d="M 124 144 C 136 52, 240 28, 316 84 C 344 104, 356 134, 344 158 C 326 140, 298 128, 270 134 Z"
                fill="url(#knitCapSculpt3D)"
              />
              <path
                d="M 164 116 Q 212 66 278 82"
                fill="none"
                stroke="#e0f2fe"
                strokeWidth="2.2"
                strokeDasharray="6 6"
                opacity="0.5"
              />
              <path
                d="M 116 148 Q 220 104 320 146 Q 330 166 308 172 Q 220 134 128 172 Q 106 166 116 148 Z"
                fill="url(#knitBrimSculpt3D)"
                stroke="#93c5fd"
                strokeWidth="1.5"
              />
              {[140, 160, 180, 200, 220, 240, 260, 280, 300].map((rx, idx) => (
                <line
                  key={idx}
                  x1={rx}
                  y1={135 - Math.sin((idx / 8) * Math.PI) * 15}
                  x2={rx}
                  y2={155 - Math.sin((idx / 8) * Math.PI) * 15}
                  stroke="#ffffff"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  opacity="0.65"
                />
              ))}

              {/* OUTFIT HEADGEAR ADD-ONS */}
              {outfit === "onesie" && (
                <g transform="translate(154, 140) rotate(-16)">
                  <path
                    d="M 0 0 C -17 -13, -24 6, -11 13 C -4 15, -2 6, 0 0 Z"
                    fill="url(#pinkBow3D)"
                    stroke="#db2777"
                    strokeWidth="1.4"
                  />
                  <path
                    d="M 0 0 C 17 -13, 24 6, 11 13 C 4 15, 2 6, 0 0 Z"
                    fill="url(#pinkBow3D)"
                    stroke="#db2777"
                    strokeWidth="1.4"
                  />
                  <ellipse cx="0" cy="2.5" rx="5" ry="6" fill="#f472b6" stroke="#be185d" strokeWidth="1.4" />
                </g>
              )}

              {outfit === "hoodie" && (
                /* Cute Floppy Bunny Ears on Cap */
                <g>
                  <ellipse cx="165" cy="68" rx="14" ry="32" transform="rotate(-18 165 68)" fill="#bae6fd" stroke="#38bdf8" strokeWidth="2" />
                  <ellipse cx="165" cy="70" rx="7" ry="20" transform="rotate(-18 165 70)" fill="#fbcfe8" />
                  <ellipse cx="255" cy="64" rx="14" ry="32" transform="rotate(16 255 64)" fill="#bae6fd" stroke="#38bdf8" strokeWidth="2" />
                  <ellipse cx="255" cy="66" rx="7" ry="20" transform="rotate(16 255 66)" fill="#fbcfe8" />
                </g>
              )}

              {outfit === "royal" && (
                <g transform="translate(220, 108)">
                  <polygon
                    points="-28,14 -22,-12 -8,4 0,-18 8,4 22,-12 28,14"
                    fill="url(#goldSculpt3D)"
                    stroke="#d97706"
                    strokeWidth="1.5"
                  />
                  <circle cx="0" cy="-18" r="3.5" fill="#ec4899" />
                  <circle cx="-22" cy="-12" r="3" fill="#38bdf8" />
                  <circle cx="22" cy="-12" r="3" fill="#38bdf8" />
                </g>
              )}

              {outfit === "sailor" && (
                <g transform="translate(220, 126)">
                  <circle cx="0" cy="0" r="13" fill="#0284c7" stroke="#fde047" strokeWidth="2" />
                  <text x="0" y="5" textAnchor="middle" fontSize="14" fill="#fde047">
                    ⚓
                  </text>
                </g>
              )}

              {outfit === "dj" && (
                <g>
                  <path
                    d="M 102 215 A 118 115 0 0 1 338 215"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <ellipse cx="102" cy="222" rx="13" ry="22" fill="url(#pinkBow3D)" stroke="#ffffff" strokeWidth="2" />
                  <ellipse cx="338" cy="222" rx="13" ry="22" fill="url(#pinkBow3D)" stroke="#ffffff" strokeWidth="2" />
                </g>
              )}

              {/* Interactive Golden Star-Bell Pom-Pom (Easter Egg Trigger!) */}
              <g
                data-testid="bitz-antenna-trigger"
                onClick={handleAntennaClick}
                className={
                  isBellRinging || isGiggling
                    ? "animate-swing-bell-ring cursor-pointer"
                    : "animate-swing-bell cursor-pointer"
                }
              >
                <title>Tap Mochi&apos;s Golden Star-Bell 3 times for a Sky Confetti Shower!</title>
                <path
                  d="M 343 154 Q 348 175 344 192"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                {(isBellRinging || isRainbow) && (
                  <circle
                    cx="344"
                    cy="208"
                    r="20"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="2.5"
                    className="animate-bell-ripple"
                  />
                )}
                <polygon
                  points="344,185 350,198 364,200 353,209 356,223 344,216 332,223 335,209 324,200 338,198"
                  fill="url(#goldSculpt3D)"
                  stroke="#b45309"
                  strokeWidth="1.5"
                />
                <circle cx="344" cy="206" r="3" fill="#78350f" />
              </g>
            </g>

            {/* Secret Easter Egg Crown Halo */}
            {isRainbow && (
              <g transform="translate(220, 46)">
                <ellipse
                  cx="0"
                  cy="0"
                  rx="48"
                  ry="11"
                  fill="none"
                  stroke="#facc15"
                  strokeWidth="4"
                  strokeDasharray="8 5"
                />
                <text x="0" y="-12" textAnchor="middle" fill="#f59e0b" fontSize="16" fontWeight="bold">
                  ★
                </text>
              </g>
            )}

            {/* LAYER 4: KAWAII 3D PLUSHIE FACE WITH STRICTLY CLIPPED EYE SOCKETS */}
            <g transform={`rotate(${headTilt * 0.65} 220 232)`}>
              <ellipse
                cx="142"
                cy="246"
                rx={isGiggling ? "24" : "20"}
                ry={isGiggling ? "14" : "12"}
                fill="url(#rosyCheek3D)"
              />
              <ellipse
                cx="298"
                cy="246"
                rx={isGiggling ? "24" : "20"}
                ry={isGiggling ? "14" : "12"}
                fill="url(#rosyCheek3D)"
              />

              {/* LEFT EYE */}
              <g>
                {isBlinking || isLullaby ? (
                  <path
                    d="M 164 232 Q 182 244 200 232"
                    fill="none"
                    stroke="#1e1b4b"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />
                ) : isGiggling ? (
                  <path
                    d="M 164 234 Q 182 214 200 234"
                    fill="none"
                    stroke="#1e1b4b"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                ) : (
                  <g>
                    <ellipse
                      cx="182"
                      cy="230"
                      rx="22"
                      ry="24"
                      fill="#ffffff"
                      stroke="#fce7f3"
                      strokeWidth="1.5"
                    />
                    <g clipPath="url(#eyeSocketClipLeft)">
                      <g transform={`translate(${pupilOffset.x}, ${pupilOffset.y})`}>
                        <ellipse cx="182" cy="230" rx="16.5" ry="18.5" fill="url(#kawaiiIris3D)" />
                        <path
                          d="M 171 236 A 12 12 0 0 0 193 236"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="3.2"
                          strokeLinecap="round"
                          opacity="0.85"
                        />
                        <circle cx="175" cy="221" r="6" fill="#ffffff" />
                        <circle cx="190" cy="237" r="2.8" fill="#ffffff" />
                      </g>
                    </g>
                  </g>
                )}
              </g>

              {/* RIGHT EYE */}
              <g>
                {isBlinking || isLullaby ? (
                  <path
                    d="M 240 232 Q 258 244 276 232"
                    fill="none"
                    stroke="#1e1b4b"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />
                ) : isGiggling || isWaving ? (
                  <path
                    d="M 240 234 Q 258 214 276 234"
                    fill="none"
                    stroke="#1e1b4b"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                ) : (
                  <g>
                    <ellipse
                      cx="258"
                      cy="230"
                      rx="22"
                      ry="24"
                      fill="#ffffff"
                      stroke="#fce7f3"
                      strokeWidth="1.5"
                    />
                    <g clipPath="url(#eyeSocketClipRight)">
                      <g transform={`translate(${pupilOffset.x}, ${pupilOffset.y})`}>
                        <ellipse cx="258" cy="230" rx="16.5" ry="18.5" fill="url(#kawaiiIris3D)" />
                        <path
                          d="M 247 236 A 12 12 0 0 0 269 236"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="3.2"
                          strokeLinecap="round"
                          opacity="0.85"
                        />
                        <circle cx="251" cy="221" r="6" fill="#ffffff" />
                        <circle cx="266" cy="237" r="2.8" fill="#ffffff" />
                      </g>
                    </g>
                  </g>
                )}
              </g>

              {/* Cute Baby Mouth */}
              {isGiggling ? (
                <path
                  d="M 206 244 Q 220 264 234 244 Z"
                  fill="#fb7185"
                  stroke="#1e1b4b"
                  strokeWidth="2.8"
                  strokeLinejoin="round"
                />
              ) : isLullaby ? (
                <ellipse
                  cx="220"
                  cy="249"
                  rx="6.5"
                  ry="7.5"
                  fill="#fb7185"
                  stroke="#1e1b4b"
                  strokeWidth="2.5"
                />
              ) : (
                <path
                  d="M 209 245 Q 220 255 231 245"
                  fill="none"
                  stroke="#1e1b4b"
                  strokeWidth="3.4"
                  strokeLinecap="round"
                />
              )}
            </g>

            {/* Animated Floating Hearts & Musical Notes */}
            {isGiggling && (
              <g>
                <text x="145" y="155" fontSize="22" fill="#ec4899" className="animate-bubble-1">
                  ♥
                </text>
                <text x="285" y="145" fontSize="24" fill="#f43f5e" className="animate-bubble-2">
                  💖
                </text>
                <text x="215" y="125" fontSize="20" fill="#fbbf24" className="animate-bubble-3">
                  ✨
                </text>
              </g>
            )}

            {isLullaby && (
              <g>
                <text x="135" y="160" fontSize="22" fill="#0284c7" className="animate-bubble-1">
                  ♪
                </text>
                <text x="288" y="150" fontSize="24" fill="#ec4899" className="animate-bubble-2">
                  ♫
                </text>
                <text x="210" y="130" fontSize="20" fill="#f59e0b" className="animate-bubble-3">
                  ♬
                </text>
              </g>
            )}

            {/* LAYER 5: LEFT CHUBBY CLOUD ARM HOLDING SPINNING RAINBOW LOLLIPOP CANDY WAND! */}
            <g className={isWaving || isGiggling ? "animate-lift-moon" : ""}>
              {/* White Candy Wand Stick + Pink Ribbon Bow */}
              <line
                x1="115"
                y1="268"
                x2="92"
                y2="195"
                stroke="#ffffff"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <line
                x1="115"
                y1="268"
                x2="92"
                y2="195"
                stroke="#f472b6"
                strokeWidth="2.5"
                strokeDasharray="5 5"
                strokeLinecap="round"
              />
              {/* Spinning Rainbow Swirl Lollipop Head */}
              <g style={{ transformOrigin: "90px 188px" }} className="animate-spin-slow">
                <circle
                  cx="90"
                  cy="188"
                  r="24"
                  fill="url(#lollipopSwirl)"
                  stroke="#ffffff"
                  strokeWidth="3"
                />
                <path
                  d="M 90 188 Q 98 178 104 188 Q 98 202 82 196 Q 72 184 86 172 Q 106 168 110 190"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
                <polygon
                  points="90,178 93,184 100,185 95,190 96,197 90,193 84,197 85,190 80,185 87,184"
                  fill="#fef08a"
                />
              </g>
              {/* Cute Ribbon Bow on Wand Stick */}
              <path
                d="M 103 228 L 91 222 L 94 235 Z M 103 228 L 115 222 L 112 235 Z"
                fill="#ec4899"
              />
              <circle cx="103" cy="228" r="3.5" fill="#fde047" />

              {/* Left Plush Hand */}
              <ellipse
                cx="120"
                cy="252"
                rx="23"
                ry="18"
                transform="rotate(16 120 252)"
                fill="url(#plushLimb3D)"
                stroke="#fbcfe8"
                strokeWidth="1.8"
              />
            </g>

            {/* LAYER 6: RIGHT CHUBBY CLOUD ARM HOLDING MINI RAINBOW MUSIC BOX */}
            <g
              onClick={handleWaveWand}
              className={
                isGiggling
                  ? "animate-right-arm-cheer"
                  : isWaving
                  ? "animate-friendly-wave"
                  : ""
              }
            >
              <g transform="translate(332, 265) rotate(12)">
                <path
                  d="M -11 -10 A 11 11 0 0 1 11 -10"
                  fill="none"
                  stroke="#f472b6"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <rect
                  x="-15"
                  y="-10"
                  width="30"
                  height="20"
                  rx="6"
                  fill="#bae6fd"
                  stroke="#38bdf8"
                  strokeWidth="1.6"
                />
                <rect x="-14" y="-2" width="28" height="5" fill="#f9a8d4" />
              </g>

              <ellipse
                cx="320"
                cy="242"
                rx="24"
                ry="18"
                transform="rotate(-24 320 242)"
                fill="url(#plushLimb3D)"
                stroke="#fbcfe8"
                strokeWidth="1.8"
              />
              <circle cx="325" cy="238" r="6.5" fill="#f9a8d4" opacity="0.85" />
            </g>
          </g>
        </svg>
      </div>

      {/* 100% RESPONSIVE BABY CLOTHES (KAPDE) WARDROBE BAR */}
      <div className="mt-1 mb-2.5 flex flex-wrap items-center justify-center gap-1.5 bg-white/95 dark:bg-slate-800 px-3 py-2 rounded-3xl border-2 border-pink-200 dark:border-sky-700 shadow-sm w-full max-w-xl">
        <span className="text-xs font-mono font-bold text-pink-600 dark:text-pink-300 px-1">
          👗 Wardrobe:
        </span>
        {outfitsList.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              soundEngine.playAccessoryMelody(item.id);
              setOutfit(item.id);
              setSpeechBubble(
                `Yay! I'm wearing my super cute ${item.label} outfit! Look at my new clothes! 💖✨`
              );
            }}
            className={`px-3 py-1 rounded-full text-xs font-bold transition ${
              outfit === item.id
                ? "bg-pink-500 text-white shadow-sm scale-105"
                : "bg-pink-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-pink-100"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* 100% RESPONSIVE ACTION BUTTONS (Never clips on mobile or desktop!) */}
      <div className="mt-1 grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-2 w-full max-w-2xl px-1">
        <button
          type="button"
          onClick={handlePokeBelly}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-full text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white border-2 border-pink-600 active:translate-y-0.5 transition shadow-sm"
        >
          <Heart className="w-3.5 h-3.5 fill-current text-pink-100 shrink-0" />
          <span>Tickle Belly</span>
        </button>

        <button
          type="button"
          onClick={handleWaveWand}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-full text-xs font-bold bg-sky-100 hover:bg-sky-200 text-sky-950 border-2 border-sky-300 active:translate-y-0.5 transition shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>🍭 Candy Wand</span>
        </button>

        <button
          type="button"
          onClick={handleSingLullaby}
          className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-full text-xs font-bold border-2 active:translate-y-0.5 transition shadow-sm ${
            isLullaby
              ? "bg-amber-300 border-amber-500 text-slate-950"
              : "bg-pink-100 hover:bg-pink-200 text-pink-950 border-pink-300"
          }`}
        >
          <Music className="w-3.5 h-3.5 text-pink-600 shrink-0" />
          <span>{isLullaby ? "⏸ Pause Lullaby" : "🎶 Cloud Lullaby"}</span>
        </button>

        <button
          type="button"
          onClick={handleAntennaClick}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-full text-xs font-bold bg-sky-500 hover:bg-sky-600 text-white border-2 border-sky-600 active:translate-y-0.5 transition shadow-sm"
        >
          <Zap className="w-3.5 h-3.5 text-amber-200 fill-current shrink-0" />
          <span>🔔 Star-Bell ({antennaClicks}/3)</span>
        </button>
      </div>
    </div>
  );
}
