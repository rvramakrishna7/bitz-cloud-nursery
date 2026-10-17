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
  const [isBlinking, setIsBlinking] = useState(false);
  const [speechBubble, setSpeechBubble] = useState(
    "Hiya! Move your mouse to see my eyes follow you, or try my 4 interactive actions below! ✨"
  );

  // Real-time cursor & touch tracking for smooth eye movement and 3D perspective tilt
  useEffect(() => {
    const handlePointerMove = (clientX, clientY) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      const offset = calculatePupilOffset(center, { x: clientX, y: clientY }, 5.5);
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

  // Action 2: Friendly Wave & Moon Lantern Lift (Wink + Starlight)
  const handleWaveMoon = (e) => {
    if (e) e.stopPropagation();
    soundEngine.playNote(587.33, 0.25, "sine");
    setTimeout(() => soundEngine.playNote(880, 0.3, "triangle"), 140);
    setMoodReaction("wave");
    setSpeechBubble(
      "*Winks and waves!* I'm lifting my Golden Crescent Moon Lantern to light up your sky! 🌙😉"
    );
    setTimeout(() => {
      setMoodReaction((curr) => (curr === "wave" ? "happy" : curr));
    }, 2500);
  };

  // Action 3: Cozy Cradle Sway & Cloud Lullaby
  const handleSingLullaby = (e) => {
    if (e) e.stopPropagation();
    soundEngine.playNote(523.25, 0.3, "sine");
    setTimeout(() => soundEngine.playNote(659.25, 0.3, "sine"), 220);
    setTimeout(() => soundEngine.playNote(783.99, 0.45, "triangle"), 440);
    setMoodReaction("lullaby");
    setSpeechBubble(
      "♪ Hush little raincloud, sway in the sky... rocking gently on my sky-blue cushion! 🎶☁️"
    );
    setTimeout(() => {
      setMoodReaction((curr) => (curr === "lullaby" ? "happy" : curr));
    }, 2800);
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
        "🎉 SECRET EASTER EGG UNLOCKED! Look at the Pastel Rainbow Bridge arching above my head! 🌈✨"
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
      soundEngine.playNote(659.25 + nextCount * 120, 0.28, "triangle");
      setMoodReaction("bell");
      setSpeechBubble(
        `🔔 *Ting-a-ling!* Golden Star-Bell chimed (${nextCount}/3)... ring ${
          3 - nextCount
        } more time${3 - nextCount === 1 ? "" : "s"} to weave a Rainbow Bridge!`
      );
      setTimeout(() => {
        setMoodReaction((curr) => (curr === "bell" ? "happy" : curr));
      }, 1500);
    }
  };

  const isGiggling = moodReaction === "giggle";
  const isWaving = moodReaction === "wave";
  const isLullaby = moodReaction === "lullaby";
  const isBellRinging = moodReaction === "bell";
  const isRainbow = moodReaction === "rainbow" || easterEggUnlocked;

  // Select body choreography class based on active reaction
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
      {/* Floating Speech Pill Above Bitz */}
      <div
        aria-live="polite"
        className="mb-2 px-5 py-2.5 rounded-full bg-white dark:bg-slate-800 border-2 border-pink-300 dark:border-sky-400 shadow-sm text-center max-w-md relative"
      >
        <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug">
          {speechBubble}
        </p>
      </div>

      {/* FREE-FLOATING SEAMLESS 3D PLUSHIE CHARACTER STAGE */}
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
          viewBox="0 0 440 420"
          className="w-[310px] h-[300px] sm:w-[390px] sm:h-[375px] overflow-visible drop-shadow-[0_18px_26px_rgba(56,189,248,0.22)]"
          aria-label="Bitz, a sculpted 3D plushie cloud-sprite wearing a periwinkle knit nightcap with a golden star-bell and holding a crescent moon lantern"
        >
          <defs>
            {/* Strict Eye Socket Clip Path so eyeballs NEVER poke outside the eye socket! */}
            <clipPath id="eyeSocketClip">
              <ellipse cx="0" cy="0" rx="20" ry="23" />
            </clipPath>

            {/* Unified 3D Subsurface Plushie Cloud Body Shader (Zero internal circle seams!) */}
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

            {/* 3D Periwinkle / Sky-Blue Knit Nightcap Shader */}
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

            {/* 3D Golden Moon Lantern & Star-Bell Shader */}
            <radialGradient id="goldSculpt3D" cx="35%" cy="28%" r="68%">
              <stop offset="0%" stopColor="#fef9c3" />
              <stop offset="42%" stopColor="#fde047" />
              <stop offset="78%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
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

          {/* OVERHEAD RAINBOW BRIDGE (Arches high ABOVE Bitz when Easter Egg is active!) */}
          {isRainbow && (
            <g>
              <path
                d="M 54 195 A 166 166 0 0 1 386 195"
                fill="none"
                stroke="#f9a8d4"
                strokeWidth="12"
                strokeLinecap="round"
              />
              <path
                d="M 66 195 A 154 154 0 0 1 374 195"
                fill="none"
                stroke="#fde047"
                strokeWidth="11"
                strokeLinecap="round"
              />
              <path
                d="M 78 195 A 142 142 0 0 1 362 195"
                fill="none"
                stroke="#7dd3fc"
                strokeWidth="11"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* LAYER 1: SEAMLESS 3D SKY-BLUE PLUSH CUSHION CLOUD BASE */}
          <g transform={`translate(${pupilOffset.x * -0.3}, 0)`}>
            <ellipse
              cx="220"
              cy="386"
              rx="140"
              ry="18"
              fill="#38bdf8"
              opacity="0.2"
            />
            <path
              d="M 88 344 C 66 344, 58 368, 80 380 C 102 392, 148 394, 180 388 C 206 396, 234 396, 260 388 C 292 394, 338 392, 360 380 C 382 368, 374 344, 352 344 C 342 320, 306 314, 284 326 C 258 308, 182 308, 156 326 C 134 314, 98 320, 88 344 Z"
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
            <circle cx="128" cy="362" r="3.5" fill="#f472b6" opacity="0.85" />
            <circle cx="312" cy="360" r="3.5" fill="#fbbf24" opacity="0.9" />
            <circle cx="220" cy="374" r="3" fill="#f472b6" opacity="0.75" />
          </g>

          {/* LAYER 2: BITZ'S CHOREOGRAPHED 3D BODY RIG */}
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

            {/* Warm Baby-Pink Plush Tummy Patch */}
            <ellipse
              cx="220"
              cy="288"
              rx="48"
              ry="30"
              fill="#fff1f2"
              opacity="0.85"
            />

            {/* Chubby Plushie Feet with Rosy Toe Pads */}
            <g transform={isGiggling ? "translate(0, -6)" : "translate(0, 0)"}>
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

            {/* LAYER 3: SCULPTED 3D PERIWINKLE KNIT SLEEPING CAP + GOLDEN STAR-BELL */}
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
                {/* Dark Plushie Eye Socket Base */}
                <ellipse
                  cx="0"
                  cy="0"
                  rx="20.5"
                  ry="23.5"
                  fill="#1c0a00"
                  stroke="#31102f"
                  strokeWidth="1.5"
                />

                {/* Clipped Interior so moving iris/pupil NEVER leaves the eye socket */}
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

              {/* EXPRESSIVE KAWAII MOUTH */}
              {isGiggling || isWaving ? (
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
              {/* Plump, Solid 3D Golden Crescent Moon */}
              <path
                d="M 108 188 C 68 194, 58 244, 92 270 C 108 282, 128 278, 138 268 C 112 266, 94 246, 96 220 C 98 202, 110 192, 122 190 C 116 188, 112 187, 108 188 Z"
                fill="url(#goldSculpt3D)"
                stroke="#d97706"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              {/* Little hanging star charm from the top tip of the crescent moon */}
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

              {/* Bitz's Chubby Left Cloud Hand Hugging the Moon */}
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

            {/* LAYER 6: RIGHT CHUBBY CLOUD ARM (Smooth Cheer / Friendly Wave) */}
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

      {/* 4 MEANINGFUL INTERACTIVE CHOREOGRAPHY CONTROLS (SOLID BABY PINK & SKY BLUE) */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={handlePokeBelly}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white border-2 border-pink-600 active:translate-y-0.5 transition shadow-sm"
        >
          <Heart className="w-3.5 h-3.5 fill-current text-pink-100" />
          Tickle Belly (Jump & Cheer)
        </button>

        <button
          type="button"
          onClick={handleWaveMoon}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-sky-100 hover:bg-sky-200 text-sky-950 border-2 border-sky-300 active:translate-y-0.5 transition shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Wave Moon Lantern
        </button>

        <button
          type="button"
          onClick={handleSingLullaby}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-pink-100 hover:bg-pink-200 text-pink-950 border-2 border-pink-300 active:translate-y-0.5 transition shadow-sm"
        >
          <Music className="w-3.5 h-3.5 text-pink-600" />
          Sing Cloud Lullaby
        </button>

        <button
          type="button"
          onClick={handleAntennaClick}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-sky-500 hover:bg-sky-600 text-white border-2 border-sky-600 active:translate-y-0.5 transition shadow-sm"
        >
          <Zap className="w-3.5 h-3.5 text-amber-200 fill-current" />
          Ring Star-Bell ({antennaClicks}/3)
        </button>
      </div>
    </div>
  );
}
