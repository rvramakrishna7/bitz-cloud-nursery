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
  const [accessory, setAccessory] = useState("bow"); // "bow" | "crown" | "headphones" | "pacifier"
  const [isBlinking, setIsBlinking] = useState(false);
  const [speechBubble, setSpeechBubble] = useState(
    "Hiya! Move your mouse—my eyes follow you! Try my 4 actions or dress me up with cute accessories below! ✨"
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
      "Wheee! Tickling my belly makes me float up and cheer! 💖☁️",
      "Hehehe! Look at my rosy cheeks and happy heart bubbles! 🌸✨",
      "Boing-puff! That tickles right through my marshmallow fluff! 💕",
    ];
    setSpeechBubble(messages[Math.floor(Math.random() * messages.length)]);
    setTimeout(() => {
      setMoodReaction((curr) => (curr === "giggle" ? "happy" : curr));
    }, 2400);
  };

  // Action 2: Friendly Wave & Moon Lantern Lift (Wink + Starlight Melody)
  const handleWaveMoon = (e) => {
    if (e) e.stopPropagation();
    soundEngine.playMoonWaveMelody();
    setMoodReaction("wave");
    setSpeechBubble(
      "*Winks and waves!* I'm lifting my Golden Crescent Moon & Star-Lantern with a twinkling melody! 🌙😉"
    );
    setTimeout(() => {
      setMoodReaction((curr) => (curr === "wave" ? "happy" : curr));
    }, 2500);
  };

  // Action 3: Cozy Cradle Sway & 1773 Classical Symphony Lullaby (Violin, Piano, Flute & Music Box!)
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
      "🎻🎹 Variation 1: Playing 1773 Classical Lullaby on Expressive Violin & Grand Piano Duet... ☁️✨"
    );
    soundEngine.playCloudLullaby(
      "full",
      (ev) => {
        if (ev.label === "🎹 Piano Bb4") {
          setSpeechBubble(
            "🎹🪈 Variation 2: Grand Piano & Sweet Bansuri Flute playing the lyrical melody... 🌸✨"
          );
        } else if (ev.label === "🔔 Chime Eb5") {
          setSpeechBubble(
            "🔔🪕 Variation 3: Crystal Music Box & Plucked Harp cascading through the clouds... ✨"
          );
        } else if (ev.label === "🎻 Violin G5") {
          setSpeechBubble(
            "🌟🎻 Variation 4: Full Symphony Finale (Violin + Piano + Flute + Chimes)! 🌙🎶"
          );
        }
      },
      () => {
        setMoodReaction((curr) => (curr === "lullaby" ? "happy" : curr));
      }
    );
  };

  // Action 4: Ring Golden Star-Bell (3x Unlocks Overhead Rainbow Bridge!)
  const handleAntennaClick = (e) => {
    if (e) e.stopPropagation();
    const nextCount = antennaClicks + 1;
    setAntennaClicks(nextCount);

    if (nextCount >= 3) {
      soundEngine.playSecretLullaby();
      setMoodReaction("rainbow");
      setSpeechBubble(
        "🎉 SECRET EASTER EGG UNLOCKED! Look at the Pastel Rainbow Bridge shimmering above my head! 🌈✨"
      );
      if (typeof window !== "undefined") {
        try {
          confetti({
            particleCount: 90,
            spread: 85,
            origin: { y: 0.55 },
            colors: ["#f472b6", "#38bdf8", "#fbbf24", "#fbcfe8", "#bae6fd"],
          });
        } catch (err) {}
      }
      onEasterEggTriggered?.();
      setAntennaClicks(0);
    } else {
      soundEngine.playStarBellMelody(nextCount);
      setMoodReaction("bell");
      setSpeechBubble(
        `🔔 *Ting-a-ling!* Golden Star-Bell chimed a sweet melody (${nextCount}/3)... ring ${
          3 - nextCount
        } more time${3 - nextCount === 1 ? "" : "s"} to weave a Rainbow Bridge!`
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

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center select-none py-1"
      data-testid="bitz-character-stage"
    >
      {/* Clean Soft Pastel Speech Pill Above Bitz (Restored from 37ae0b0!) */}
      <div
        aria-live="polite"
        className="mb-2 px-5 py-2.5 rounded-full bg-white dark:bg-slate-800 border-2 border-pink-300 dark:border-sky-400 shadow-sm text-center max-w-md relative"
      >
        <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug">
          {speechBubble}
        </p>
      </div>

      {/* FREE-FLOATING SEAMLESS 3D PLUSHIE CHARACTER STAGE + FLOATING SKY WORLD */}
      <div
        onClick={handlePokeBelly}
        role="button"
        tabIndex={0}
        aria-label="Interact with Bitz the 3D Baby Cloud-Sprite"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handlePokeBelly();
          }
        }}
        style={{
          transform: `perspective(950px) rotateY(${pupilOffset.x * 1.3}deg) rotateX(${-pupilOffset.y * 1.1}deg) rotateZ(${headTilt * 0.45}deg)`,
          transition: "transform 0.16s ease-out",
        }}
        className="relative cursor-pointer focus:outline-none animate-float"
      >
        {/* Choreographed Floating Bubbles (Hearts / Stars / Musical Notes) */}
        {(isGiggling || isWaving || isLullaby) && (
          <div className="pointer-events-none absolute inset-0 z-30 overflow-visible">
            <span className="animate-bubble-1 absolute top-14 left-10 text-2xl">
              {isGiggling ? "💖" : isWaving ? "✨" : "♪"}
            </span>
            <span className="animate-bubble-2 absolute top-8 right-12 text-2xl">
              {isGiggling ? "💕" : isWaving ? "🌟" : "♫"}
            </span>
            <span className="animate-bubble-3 absolute top-24 left-6 text-xl">
              {isGiggling ? "🌸" : isWaving ? "💫" : "☁️"}
            </span>
          </div>
        )}

        <svg
          viewBox="0 0 440 425"
          className="w-[320px] h-[310px] sm:w-[400px] sm:h-[385px] overflow-visible drop-shadow-[0_18px_26px_rgba(56,189,248,0.22)]"
          aria-label="Bitz, a sculpted 3D plushie cloud-sprite wearing a periwinkle knit nightcap with a golden star-bell and holding a crescent moon lantern and music box"
        >
          <defs>
            {/* Strict Eye Socket Clip Path so eyeballs NEVER poke outside the eye socket! */}
            <clipPath id="eyeSocketClip">
              <ellipse cx="0" cy="0" rx="20" ry="23" />
            </clipPath>

            {/* Unified 3D Subsurface Plushie Cloud Body Shader (From 37ae0b0 that user loved!) */}
            <radialGradient id="sculptedCloudBody3D" cx="46%" cy="32%" r="64%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="52%" stopColor="#ffffff" />
              <stop offset="78%" stopColor="#fdf2f8" />
              <stop offset="93%" stopColor="#fce7f3" />
              <stop offset="100%" stopColor="#f9a8d4" />
            </radialGradient>

            {/* 3D Chubby Hand & Foot Shader */}
            <radialGradient id="plushLimb3D" cx="40%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="68%" stopColor="#fdf2f8" />
              <stop offset="100%" stopColor="#fbcfe8" />
            </radialGradient>

            {/* 3D Sky-Blue Cushion Cloud Base Shader */}
            <radialGradient id="skyCushionBase3D" cx="50%" cy="28%" r="68%">
              <stop offset="0%" stopColor="#f0f9ff" />
              <stop offset="48%" stopColor="#e0f2fe" />
              <stop offset="80%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#7dd3fc" />
            </radialGradient>

            {/* 3D Periwinkle / Sky-Blue Knit Nightcap Shader (From 37ae0b0!) */}
            <linearGradient id="knitCapSculpt3D" x1="15%" y1="10%" x2="85%" y2="90%">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="45%" stopColor="#818cf8" />
              <stop offset="82%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>

            {/* Soft Baby-Pink & Sky-Blue Knit Brim Shader */}
            <linearGradient id="knitBrimSculpt3D" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="50%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#93c5fd" />
            </linearGradient>

            {/* 3D Golden Moon Lantern, Sun & Star-Bell Shader */}
            <radialGradient id="goldSculpt3D" cx="35%" cy="28%" r="68%">
              <stop offset="0%" stopColor="#fef9c3" />
              <stop offset="42%" stopColor="#fde047" />
              <stop offset="78%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </radialGradient>

            {/* 3D Pastel Pink Bow Shader */}
            <radialGradient id="pinkBow3D" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fbcfe8" />
              <stop offset="55%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#db2777" />
            </radialGradient>

            {/* 3D Lavender Star Shader */}
            <radialGradient id="lavenderStar3D" cx="38%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#f3e8ff" />
              <stop offset="55%" stopColor="#d8b4fe" />
              <stop offset="100%" stopColor="#a855f7" />
            </radialGradient>

            {/* 3D Kawaii Glossy Eye Iris Shader */}
            <radialGradient id="kawaiiEyeSculpt3D" cx="50%" cy="68%" r="58%">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="35%" stopColor="#451a03" />
              <stop offset="80%" stopColor="#1c0a00" />
              <stop offset="100%" stopColor="#090400" />
            </radialGradient>

            {/* 3D Rosy Baby-Pink Cheek Blush */}
            <radialGradient id="rosyCheekSculpt3D" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f472b6" stopOpacity="0.82" />
              <stop offset="58%" stopColor="#fb7185" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#fb7185" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* MOVING & SHIMMERING OVERHEAD RAINBOW BRIDGE (Reacts to Day/Night & 3-Click Easter Egg!) */}
          <g className="animate-rainbow-sway">
            <path
              d="M 54 195 A 166 166 0 0 1 386 195"
              fill="none"
              stroke={isNight ? "#f472b6" : "#f9a8d4"}
              strokeWidth={isRainbow ? "14" : "11"}
              strokeLinecap="round"
            />
            <path
              d="M 66 195 A 154 154 0 0 1 374 195"
              fill="none"
              stroke="#fde047"
              strokeWidth={isRainbow ? "13" : "10"}
              strokeLinecap="round"
            />
            <path
              d="M 78 195 A 142 142 0 0 1 362 195"
              fill="none"
              stroke={isNight ? "#38bdf8" : "#7dd3fc"}
              strokeWidth={isRainbow ? "13" : "10"}
              strokeLinecap="round"
            />
            <path
              d="M 66 195 A 154 154 0 0 1 374 195"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray="12 24"
              className="animate-rainbow-shimmer"
              opacity="0.8"
            />
          </g>

          {/* FLOATING CELESTIAL SKY BUDDIES IN THE AIR (Cutie Sun in Day / Sleeping Moon in Night + Stars!) */}
          <g
            onClick={(e) => {
              e.stopPropagation();
              soundEngine.playClick(1.2);
              onToggleTheme?.();
            }}
            className="cursor-pointer animate-celestial-a"
          >
            {isNight ? (
              /* NIGHT SKY: Cutie Sleeping 3D Crescent Moon in Top-Right Air */
              <g transform="translate(378, 72)">
                <path
                  d="M -10 -32 C 22 -32, 34 6, 8 28 C -8 40, -28 34, -36 22 C -14 24, 2 8, 0 -12 C -2 -24, -8 -28, -16 -31 Z"
                  fill="url(#goldSculpt3D)"
                  stroke="#d97706"
                  strokeWidth="1.4"
                />
                <path
                  d="M 3 -4 Q 8 1 13 -4"
                  fill="none"
                  stroke="#78350f"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M 0 5 Q 4 9 9 5"
                  fill="none"
                  stroke="#78350f"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <circle cx="13" cy="2" r="4" fill="#f472b6" opacity="0.55" />
              </g>
            ) : (
              /* DAY SKY: Cutie Smiling 3D Sun in Top-Right Air */
              <g transform="translate(382, 74)">
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <rect
                    key={deg}
                    x="-3.5"
                    y="-34"
                    width="7"
                    height="10"
                    rx="3.5"
                    fill="#fbbf24"
                    transform={`rotate(${deg})`}
                  />
                ))}
                <circle
                  cx="0"
                  cy="0"
                  r="21"
                  fill="url(#goldSculpt3D)"
                  stroke="#f59e0b"
                  strokeWidth="1.4"
                />
                <circle cx="-7" cy="-2" r="2.5" fill="#451a03" />
                <circle cx="7" cy="-2" r="2.5" fill="#451a03" />
                <circle cx="-11" cy="3" r="3.5" fill="#f472b6" opacity="0.6" />
                <circle cx="11" cy="3" r="3.5" fill="#f472b6" opacity="0.6" />
                <path
                  d="M -4 4 Q 0 8 4 4"
                  fill="none"
                  stroke="#451a03"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>
            )}
          </g>

          {/* Floating Plump 3D Stars & Mini Cotton Cloud around Bitz */}
          <g className="animate-celestial-b">
            <g transform="translate(52, 215) rotate(-14) scale(0.9)">
              <polygon
                points="0,-16 5,-5 17,-3 8,5 10,17 0,11 -10,17 -8,5 -17,-3 -5,-5"
                fill="url(#goldSculpt3D)"
                stroke="#d97706"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </g>
            <g transform="translate(46, 285) rotate(14) scale(0.72)">
              <polygon
                points="0,-16 5,-5 17,-3 8,5 10,17 0,11 -10,17 -8,5 -17,-3 -5,-5"
                fill="url(#lavenderStar3D)"
                stroke="#9333ea"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </g>
            <g transform="translate(396, 265) rotate(12) scale(0.88)">
              <polygon
                points="0,-16 5,-5 17,-3 8,5 10,17 0,11 -10,17 -8,5 -17,-3 -5,-5"
                fill="url(#goldSculpt3D)"
                stroke="#d97706"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </g>
            <g transform="translate(64, 118)">
              <path
                d="M -20 6 C -28 6, -30 -4, -20 -8 C -16 -16, -2 -16, 4 -9 C 12 -12, 24 -5, 20 5 C 24 10, 14 14, 5 12 C -2 16, -12 14, -20 6 Z"
                fill="#ffffff"
                stroke="#bae6fd"
                strokeWidth="1.5"
              />
              <circle cx="-5" cy="1" r="2" fill="#f472b6" opacity="0.7" />
              <circle cx="7" cy="1" r="2" fill="#38bdf8" opacity="0.7" />
            </g>
          </g>

          {/* LAYER 1: SEAMLESS 3D SKY-BLUE PLUSH CUSHION CLOUD BASE WITH "♥ Bitz ♥" */}
          <g transform={`translate(${pupilOffset.x * -0.3}, 0)`}>
            <ellipse
              cx="220"
              cy="392"
              rx="140"
              ry="18"
              fill="#38bdf8"
              opacity="0.2"
            />
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
              fontSize="17"
              fontWeight="bold"
              fontFamily="var(--font-fredoka), sans-serif"
            >
              ♥ Bitz ♥
            </text>
          </g>

          {/* LAYER 2: BITZ'S CHOREOGRAPHED 3D BODY RIG (Exact Cute Proportions from 37ae0b0!) */}
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

            {/* Warm Baby-Pink Plush Tummy Patch with Cute Embroidered Heart */}
            <ellipse
              cx="220"
              cy="288"
              rx="48"
              ry="30"
              fill="#fff1f2"
              opacity="0.9"
            />
            <path
              d="M 220 294 C 214 288, 208 282, 213 277 C 216 274, 220 277, 220 280 C 220 277, 224 274, 227 277 C 232 282, 226 288, 220 294 Z"
              fill="#fbcfe8"
            />

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

            {/* LAYER 3: SCULPTED 3D PERIWINKLE KNIT SLEEPING CAP + GOLDEN STAR-BELL + LIVE ACCESSORIES */}
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
                d="M 148 130 Q 208 82 296 100"
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

              {/* LIVE DRESS-UP ACCESSORY ON BITZ! */}
              {accessory === "bow" && (
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
                  <ellipse
                    cx="0"
                    cy="2.5"
                    rx="5"
                    ry="6"
                    fill="#f472b6"
                    stroke="#be185d"
                    strokeWidth="1.4"
                  />
                </g>
              )}

              {accessory === "crown" && (
                <g transform="translate(220, 112)">
                  <polygon
                    points="-26,14 -20,-10 -8,4 0,-16 8,4 20,-10 26,14"
                    fill="url(#goldSculpt3D)"
                    stroke="#d97706"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                  <circle cx="0" cy="-16" r="3.5" fill="#f472b6" />
                  <circle cx="-20" cy="-10" r="3" fill="#38bdf8" />
                  <circle cx="20" cy="-10" r="3" fill="#38bdf8" />
                </g>
              )}

              {accessory === "headphones" && (
                <g>
                  <path
                    d="M 104 210 A 116 105 0 0 1 336 210"
                    fill="none"
                    stroke="#f472b6"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <ellipse
                    cx="104"
                    cy="214"
                    rx="14"
                    ry="22"
                    fill="#bae6fd"
                    stroke="#f472b6"
                    strokeWidth="3"
                  />
                  <ellipse
                    cx="336"
                    cy="214"
                    rx="14"
                    ry="22"
                    fill="#bae6fd"
                    stroke="#f472b6"
                    strokeWidth="3"
                  />
                </g>
              )}

              {/* INTERACTIVE GOLDEN STAR-BELL TASSEL */}
              <g
                onClick={handleAntennaClick}
                data-testid="bitz-antenna-trigger"
                role="button"
                tabIndex={0}
                aria-label="Tap Bitz's Golden Star-Bell 3 times for a secret surprise"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleAntennaClick(e);
                  }
                }}
                className={`cursor-pointer ${
                  isBellRinging || isGiggling
                    ? "animate-swing-bell-ring"
                    : "animate-swing-bell"
                }`}
              >
                <circle cx="346" cy="196" r="36" fill="transparent" />

                {(isBellRinging || antennaClicks > 0) && (
                  <circle
                    cx="346"
                    cy="200"
                    r="20"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="2.5"
                    className="animate-bell-ripple"
                  />
                )}

                <path
                  d="M 344 154 Q 348 172 346 184"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <polygon
                  points="346,176 353,191 370,193 357,204 361,220 346,212 331,220 335,204 322,193 339,191"
                  fill="url(#goldSculpt3D)"
                  stroke="#b45309"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <circle cx="346" cy="200" r="3" fill="#92400e" />
              </g>
            </g>

            {/* LAYER 4: CLIPPED CURSOR-TRACKING 3D KAWAII EYES, CHEEKS & MOUTH */}
            <g>
              {/* Rosy Baby-Pink Cheeks */}
              <ellipse
                cx="148"
                cy="242"
                rx={isGiggling ? "25" : "21"}
                ry={isGiggling ? "15" : "12"}
                fill="url(#rosyCheekSculpt3D)"
              />
              <ellipse
                cx="292"
                cy="242"
                rx={isGiggling ? "25" : "21"}
                ry={isGiggling ? "15" : "12"}
                fill="url(#rosyCheekSculpt3D)"
              />

              {/* LEFT EYE SOCKET (Strictly clipped inside eyeSocketClip!) */}
              <g transform="translate(178, 216)">
                <ellipse
                  cx="0"
                  cy="0"
                  rx="20.5"
                  ry="23.5"
                  fill="#1c0a00"
                  stroke="#31102f"
                  strokeWidth="1.5"
                />

                <g clipPath="url(#eyeSocketClip)">
                  <g
                    data-testid="bitz-left-pupil"
                    transform={`translate(${pupilOffset.x}, ${pupilOffset.y})`}
                  >
                    {isGiggling ? (
                      <g>
                        <ellipse cx="0" cy="0" rx="22" ry="25" fill="#fff8fb" />
                        <path
                          d="M -13 4 Q 0 -13 13 4"
                          fill="none"
                          stroke="#31102f"
                          strokeWidth="5"
                          strokeLinecap="round"
                        />
                      </g>
                    ) : isLullaby ? (
                      <g>
                        <ellipse cx="0" cy="0" rx="22" ry="25" fill="#fff8fb" />
                        <path
                          d="M -13 -2 Q 0 12 13 -2"
                          fill="none"
                          stroke="#31102f"
                          strokeWidth="4.5"
                          strokeLinecap="round"
                        />
                      </g>
                    ) : (
                      <>
                        <ellipse
                          cx="0"
                          cy="0"
                          rx="18"
                          ry="21"
                          fill="url(#kawaiiEyeSculpt3D)"
                        />
                        <path
                          d="M -11 7 A 13 13 0 0 0 11 7 A 13 9 0 0 1 -11 7 Z"
                          fill="#f59e0b"
                          opacity="0.7"
                        />
                        <ellipse
                          cx="-5.5"
                          cy="-7.5"
                          rx="5.5"
                          ry="7"
                          transform="rotate(-15 -5.5 -7.5)"
                          fill="#ffffff"
                        />
                        <circle cx="6.5" cy="6.5" r="2.8" fill="#ffffff" />
                        <circle cx="-6.5" cy="5.5" r="1.8" fill="#fde047" />
                      </>
                    )}
                  </g>
                </g>

                {isBlinking && !isGiggling && !isLullaby && (
                  <ellipse cx="0" cy="0" rx="21" ry="24" fill="#fff8fb" />
                )}
              </g>

              {/* RIGHT EYE SOCKET (Strictly clipped inside eyeSocketClip!) */}
              <g transform="translate(262, 216)">
                <ellipse
                  cx="0"
                  cy="0"
                  rx="20.5"
                  ry="23.5"
                  fill="#1c0a00"
                  stroke="#31102f"
                  strokeWidth="1.5"
                />

                <g clipPath="url(#eyeSocketClip)">
                  <g
                    data-testid="bitz-right-pupil"
                    transform={`translate(${pupilOffset.x}, ${pupilOffset.y})`}
                  >
                    {isGiggling ? (
                      <g>
                        <ellipse cx="0" cy="0" rx="22" ry="25" fill="#fff8fb" />
                        <path
                          d="M -13 4 Q 0 -13 13 4"
                          fill="none"
                          stroke="#31102f"
                          strokeWidth="5"
                          strokeLinecap="round"
                        />
                      </g>
                    ) : isWaving ? (
                      <g>
                        <ellipse cx="0" cy="0" rx="22" ry="25" fill="#fff8fb" />
                        <path
                          d="M -13 2 Q 0 -11 13 2"
                          fill="none"
                          stroke="#31102f"
                          strokeWidth="5"
                          strokeLinecap="round"
                        />
                      </g>
                    ) : isLullaby ? (
                      <g>
                        <ellipse cx="0" cy="0" rx="22" ry="25" fill="#fff8fb" />
                        <path
                          d="M -13 -2 Q 0 12 13 -2"
                          fill="none"
                          stroke="#31102f"
                          strokeWidth="4.5"
                          strokeLinecap="round"
                        />
                      </g>
                    ) : (
                      <>
                        <ellipse
                          cx="0"
                          cy="0"
                          rx="18"
                          ry="21"
                          fill="url(#kawaiiEyeSculpt3D)"
                        />
                        <path
                          d="M -11 7 A 13 13 0 0 0 11 7 A 13 9 0 0 1 -11 7 Z"
                          fill="#f59e0b"
                          opacity="0.7"
                        />
                        <ellipse
                          cx="-5.5"
                          cy="-7.5"
                          rx="5.5"
                          ry="7"
                          transform="rotate(-15 -5.5 -7.5)"
                          fill="#ffffff"
                        />
                        <circle cx="6.5" cy="6.5" r="2.8" fill="#ffffff" />
                        <circle cx="-6.5" cy="5.5" r="1.8" fill="#fde047" />
                      </>
                    )}
                  </g>
                </g>

                {isBlinking && !isGiggling && !isWaving && !isLullaby && (
                  <ellipse cx="0" cy="0" rx="21" ry="24" fill="#fff8fb" />
                )}
              </g>

              {/* EXPRESSIVE KAWAII MOUTH OR STARLIGHT PACIFIER */}
              {accessory === "pacifier" ? (
                <g transform="translate(220, 240)">
                  <ellipse
                    cx="0"
                    cy="0"
                    rx="14"
                    ry="10"
                    fill="#f472b6"
                    stroke="#db2777"
                    strokeWidth="1.5"
                  />
                  <circle cx="0" cy="2" r="5" fill="#bae6fd" />
                  <path
                    d="M -7 4 A 7 7 0 0 0 7 4"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </g>
              ) : isGiggling || isWaving ? (
                <g transform="translate(220, 238)">
                  <path
                    d="M -14 -2 Q 0 22 14 -2 Z"
                    fill="#db2777"
                    stroke="#4a044e"
                    strokeWidth="2.2"
                  />
                  <path d="M -8 5 Q 0 15 8 5 Z" fill="#f9a8d4" />
                </g>
              ) : isLullaby ? (
                <circle
                  cx="220"
                  cy="240"
                  r="4.5"
                  fill="#f472b6"
                  stroke="#4a044e"
                  strokeWidth="2"
                />
              ) : (
                <path
                  d="M 208 236 Q 220 247 232 236"
                  fill="none"
                  stroke="#4a044e"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                />
              )}
            </g>

            {/* LAYER 5: LEFT CHUBBY CLOUD ARM HOLDING PLUMP 3D GOLDEN CRESCENT MOON LANTERN */}
            <g
              onClick={handleWaveMoon}
              className={isWaving || isGiggling ? "animate-lift-moon" : ""}
            >
              <path
                d="M 108 188 C 68 194, 58 244, 92 270 C 108 282, 128 278, 138 268 C 112 266, 94 246, 96 220 C 98 202, 110 192, 122 190 C 116 188, 112 187, 108 188 Z"
                fill="url(#goldSculpt3D)"
                stroke="#d97706"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <line
                x1="118"
                y1="190"
                x2="118"
                y2="205"
                stroke="#f59e0b"
                strokeWidth="2"
              />
              <circle
                cx="118"
                cy="209"
                r="4"
                fill="#fde047"
                stroke="#d97706"
                strokeWidth="1"
              />

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

            {/* LAYER 6: RIGHT CHUBBY CLOUD ARM HOLDING CUTE MINI RAINBOW MUSIC BOX */}
            <g
              onClick={handleWaveMoon}
              className={
                isGiggling
                  ? "animate-right-arm-cheer"
                  : isWaving
                  ? "animate-friendly-wave"
                  : ""
              }
            >
              {/* Cute Mini Wind-Up Music Box in Right Hand */}
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

      {/* LIVE BABY DRESS-UP ACCESSORY SWITCHER (Single-line pills, zero wrapping!) */}
      <div className="mt-1 mb-2.5 flex items-center justify-center gap-1.5 bg-white/95 dark:bg-slate-800 px-3.5 py-1.5 rounded-full border-2 border-pink-200 dark:border-sky-700 shadow-sm overflow-x-auto max-w-full">
        <span className="text-xs font-mono font-bold text-pink-600 dark:text-pink-300 px-1.5 whitespace-nowrap">
          ✨ Dress Up:
        </span>
        {[
          { id: "bow", label: "🎀 Pink Bow" },
          { id: "crown", label: "👑 Star Crown" },
          { id: "headphones", label: "🎧 Headphones" },
          { id: "pacifier", label: "🍼 Pacifier" },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              soundEngine.playAccessoryMelody(item.id);
              setAccessory(item.id);
              setSpeechBubble(`Yay! You dressed me up with my cute ${item.label}! 💖✨`);
            }}
            className={`px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap shrink-0 ${
              accessory === item.id
                ? "bg-pink-500 text-white shadow-sm"
                : "bg-pink-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-pink-100"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* CLEAN SINGLE-LINE SOFT PASTEL ACTION BUTTONS (Zero 2-line text wrapping!) */}
      <div className="mt-1 grid grid-cols-2 sm:flex sm:flex-nowrap items-center justify-center gap-2.5 w-full max-w-2xl px-2">
        <button
          type="button"
          onClick={handlePokeBelly}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white border-2 border-pink-600 active:translate-y-0.5 transition shadow-sm whitespace-nowrap shrink-0"
        >
          <Heart className="w-3.5 h-3.5 fill-current text-pink-100 shrink-0" />
          <span>Tickle Belly</span>
        </button>

        <button
          type="button"
          onClick={handleWaveMoon}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold bg-sky-100 hover:bg-sky-200 text-sky-950 border-2 border-sky-300 active:translate-y-0.5 transition shadow-sm whitespace-nowrap shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>Wave Moon Lantern</span>
        </button>

        <button
          type="button"
          onClick={handleSingLullaby}
          className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold border-2 active:translate-y-0.5 transition shadow-sm whitespace-nowrap shrink-0 ${
            isLullaby
              ? "bg-amber-300 border-amber-500 text-slate-950"
              : "bg-pink-100 hover:bg-pink-200 text-pink-950 border-pink-300"
          }`}
        >
          <Music className="w-3.5 h-3.5 text-pink-600 shrink-0" />
          <span>{isLullaby ? "⏸ Playing Lullaby..." : "🎶 Cloud Lullaby"}</span>
        </button>

        <button
          type="button"
          onClick={handleAntennaClick}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold bg-sky-500 hover:bg-sky-600 text-white border-2 border-sky-600 active:translate-y-0.5 transition shadow-sm whitespace-nowrap shrink-0"
        >
          <Zap className="w-3.5 h-3.5 text-amber-200 fill-current shrink-0" />
          <span>Ring Star-Bell ({antennaClicks}/3)</span>
        </button>
      </div>
    </div>
  );
}
