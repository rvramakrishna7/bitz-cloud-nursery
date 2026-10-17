"use client";

import React, { useState, useEffect, useRef } from "react";
import { Zap, Heart, Music, Sparkles, Sun, Moon } from "lucide-react";
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
    "Hiya! Move your mouse—my eyes follow you! Toggle Day/Night Sky to see my floating Sun, Moon & Rainbow change! ✨"
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
      const tilt = Math.max(-6, Math.min(6, (clientX - center.x) / 38));
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

  // Action 1: Tickle Pajama Belly (Joyful Jump, Feet Kick & Heart Bubbles)
  const handlePokeBelly = () => {
    soundEngine.playGiggle();
    setMoodReaction("giggle");
    const messages = [
      "Hehehe! Tickling my cloud-onesie makes my little booties kick with joy! 💖☁️",
      "Wheee! Look at my Star-Lantern and Music Box bounce! 🌸✨",
      "Giggle-puff! You shook loose floating baby-pink hearts! 💕",
    ];
    setSpeechBubble(messages[Math.floor(Math.random() * messages.length)]);
    setTimeout(() => {
      setMoodReaction((curr) => (curr === "giggle" ? "happy" : curr));
    }, 2400);
  };

  // Action 2: Shine Star-Lantern & Wave Music Box (Wink + Starlight)
  const handleWaveMoon = (e) => {
    if (e) e.stopPropagation();
    soundEngine.playNote(587.33, 0.25, "sine");
    setTimeout(() => soundEngine.playNote(880, 0.3, "triangle"), 140);
    setMoodReaction("wave");
    setSpeechBubble(
      "*Winks & lifts Star-Lantern!* Look at my golden lantern and rainbow music box glow! 🏮🎶"
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
      "♪ Rock-a-bye Bitz on the cloud top... winding my little rainbow music box! 🎶☁️"
    );
    setTimeout(() => {
      setMoodReaction((curr) => (curr === "lullaby" ? "happy" : curr));
    }, 2800);
  };

  // Action 4: Ring Golden Star-Bell on Cap Tip (3x Unlocks Rainbow Overdrive!)
  const handleAntennaClick = (e) => {
    if (e) e.stopPropagation();
    const nextCount = antennaClicks + 1;
    setAntennaClicks(nextCount);

    if (nextCount >= 3) {
      soundEngine.playSecretLullaby();
      setMoodReaction("rainbow");
      setSpeechBubble(
        "🎉 SECRET EASTER EGG UNLOCKED! Rainbow Aurora Overdrive! Look at the moving rainbow shimmer! 🌈✨"
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
        `🔔 *Ting-a-ling!* Nightcap Star-Bell chimed (${nextCount}/3)... ring ${
          3 - nextCount
        } more time${3 - nextCount === 1 ? "" : "s"} for a secret surprise!`
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
      {/* 90s Toy-Bubble Speech Box Above Bitz */}
      <div
        aria-live="polite"
        className="mb-2 px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-900 dark:border-sky-300 shadow-[4px_4px_0px_#f472b6] text-center max-w-md relative"
      >
        <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">
          {speechBubble}
        </p>
      </div>

      {/* FREE-FLOATING 3D PLUSHIE BABY CHARACTER + FLOATING DAY/NIGHT CELESTIAL WORLD */}
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
          transform: `perspective(950px) rotateY(${pupilOffset.x * 1.25}deg) rotateX(${-pupilOffset.y * 1.05}deg) rotateZ(${headTilt * 0.4}deg)`,
          transition: "transform 0.16s ease-out",
        }}
        className="relative cursor-pointer focus:outline-none animate-float"
      >
        {/* Choreographed Floating Reaction Bubbles (Hearts / Stars / Musical Notes) */}
        {(isGiggling || isWaving || isLullaby) && (
          <div className="pointer-events-none absolute inset-0 z-30 overflow-visible">
            <span className="animate-bubble-1 absolute top-14 left-12 text-2xl">
              {isGiggling ? "💖" : isWaving ? "✨" : "♪"}
            </span>
            <span className="animate-bubble-2 absolute top-8 right-14 text-2xl">
              {isGiggling ? "💕" : isWaving ? "🌟" : "♫"}
            </span>
            <span className="animate-bubble-3 absolute top-28 left-8 text-xl">
              {isGiggling ? "🌸" : isWaving ? "💫" : "☁️"}
            </span>
          </div>
        )}

        <svg
          viewBox="0 0 480 450"
          className="w-[330px] h-[315px] sm:w-[430px] sm:h-[405px] overflow-visible drop-shadow-[0_16px_24px_rgba(56,189,248,0.22)]"
          aria-label="Bitz, an adorable 3D plushie baby cloud-sprite with pajama onesie, chubby arms holding a star lantern and music box, chubby seated legs, and floating sun, moon, stars, and moving rainbow"
        >
          <defs>
            {/* Strict Eye Socket Clip Path so eyeballs NEVER poke outside the eye socket */}
            <clipPath id="eyeSocketClip">
              <ellipse cx="0" cy="0" rx="20" ry="22" />
            </clipPath>

            {/* 3D Baby Cloud Head & Face Shader (Warm Marshmallow Cream with Soft Baby-Pink Rim) */}
            <radialGradient id="babyHead3D" cx="46%" cy="35%" r="62%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="58%" stopColor="#fffaf5" />
              <stop offset="85%" stopColor="#fce7f3" />
              <stop offset="100%" stopColor="#fbcfe8" />
            </radialGradient>

            {/* 3D Cozy Baby Onesie / Pajama Shader (Pastel Baby Pink & Cream) */}
            <radialGradient id="babyOnesie3D" cx="45%" cy="30%" r="68%">
              <stop offset="0%" stopColor="#fff1f2" />
              <stop offset="55%" stopColor="#ffe4e6" />
              <stop offset="88%" stopColor="#fbcfe8" />
              <stop offset="100%" stopColor="#f9a8d4" />
            </radialGradient>

            {/* 3D Bootie / Shoe Sole Shader (Soft Periwinkle / Sky Blue) */}
            <radialGradient id="babyBootie3D" cx="45%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="60%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#7dd3fc" />
            </radialGradient>

            {/* 3D Fluffy Cushion Cloud Base Shader */}
            <radialGradient id="cloudCushion3D" cx="50%" cy="30%" r="68%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="52%" stopColor="#f0f9ff" />
              <stop offset="82%" stopColor="#e0f2fe" />
              <stop offset="100%" stopColor="#bae6fd" />
            </radialGradient>

            {/* 3D Star-Patterned Sleeping Cap Shader (Sky Blue & Periwinkle) */}
            <linearGradient id="nightCap3D" x1="10%" y1="10%" x2="90%" y2="90%">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="45%" stopColor="#bae6fd" />
              <stop offset="82%" stopColor="#7dd3fc" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>

            {/* 3D Cute Pink Ribbon Bow Shader */}
            <radialGradient id="pinkBow3D" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fbcfe8" />
              <stop offset="55%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#db2777" />
            </radialGradient>

            {/* 3D Golden Sun, Moon, Stars & Lantern Shader */}
            <radialGradient id="gold3D" cx="35%" cy="30%" r="68%">
              <stop offset="0%" stopColor="#fef9c3" />
              <stop offset="45%" stopColor="#fde047" />
              <stop offset="80%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </radialGradient>

            {/* 3D Pastel Lavender Star Shader */}
            <radialGradient id="lavenderStar3D" cx="38%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#f3e8ff" />
              <stop offset="55%" stopColor="#d8b4fe" />
              <stop offset="100%" stopColor="#a855f7" />
            </radialGradient>

            {/* 3D Kawaii Glossy Eye Iris Shader */}
            <radialGradient id="kawaiiEye3D" cx="50%" cy="68%" r="58%">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="35%" stopColor="#451a03" />
              <stop offset="80%" stopColor="#1c0a00" />
              <stop offset="100%" stopColor="#090400" />
            </radialGradient>

            {/* 3D Rosy Baby-Pink Cheek Blush */}
            <radialGradient id="rosyCheek3D" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f472b6" stopOpacity="0.85" />
              <stop offset="58%" stopColor="#fb7185" stopOpacity="0.42" />
              <stop offset="100%" stopColor="#fb7185" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* ===================================================================== */}
          {/* LAYER 0: MOVING & SHIMMERING RAINBOW ARCH (Reacts to Day vs Night!)   */}
          {/* ===================================================================== */}
          <g className="animate-rainbow-sway">
            {/* Outer Baby-Pink Band */}
            <path
              d="M 68 230 A 172 172 0 0 1 412 230"
              fill="none"
              stroke={isNight ? "#ec4899" : "#f9a8d4"}
              strokeWidth={isRainbow ? "16" : "12"}
              strokeLinecap="round"
              opacity={isRainbow ? "1" : "0.85"}
            />
            {/* Middle Golden / Lavender Band */}
            <path
              d="M 80 230 A 160 160 0 0 1 400 230"
              fill="none"
              stroke={isNight ? "#fbbf24" : "#fde047"}
              strokeWidth={isRainbow ? "14" : "11"}
              strokeLinecap="round"
              opacity={isRainbow ? "1" : "0.85"}
            />
            {/* Inner Sky-Blue Band */}
            <path
              d="M 92 230 A 148 148 0 0 1 388 230"
              fill="none"
              stroke={isNight ? "#38bdf8" : "#7dd3fc"}
              strokeWidth={isRainbow ? "14" : "11"}
              strokeLinecap="round"
              opacity={isRainbow ? "1" : "0.85"}
            />
            {/* Animated Moving Starlight/Sunbeam Shimmer Along the Rainbow */}
            <path
              d="M 80 230 A 160 160 0 0 1 400 230"
              fill="none"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="14 26"
              className="animate-rainbow-shimmer"
              opacity="0.85"
            />
          </g>

          {/* ===================================================================== */}
          {/* LAYER 1: FLOATING CELESTIAL SKY OBJECTS IN THE AIR (DAY VS NIGHT!)    */}
          {/* ===================================================================== */}
          {/* Top-Right Main Celestial Buddy: Cutie Smiling Sun (Day) OR Sleeping Crescent Moon (Night)! */}
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
              <g transform="translate(385, 78)">
                <path
                  d="M -12 -36 C 24 -36, 38 6, 10 30 C -8 44, -32 38, -40 24 C -16 26, 2 8, 0 -14 C -2 -26, -10 -32, -18 -35 C -16 -36, -14 -36, -12 -36 Z"
                  fill="url(#gold3D)"
                  stroke="#d97706"
                  strokeWidth="1.5"
                />
                {/* Cute sleeping eye & smile on the Moon */}
                <path
                  d="M 4 -4 Q 9 1 14 -4"
                  fill="none"
                  stroke="#78350f"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <path
                  d="M 0 6 Q 5 10 10 6"
                  fill="none"
                  stroke="#78350f"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="15" cy="3" r="4.5" fill="#f472b6" opacity="0.55" />
                {/* Little floating star next to the moon */}
                <circle cx="-26" cy="-8" r="3" fill="#fde047" />
              </g>
            ) : (
              /* DAY SKY: Cutie Smiling 3D Sun in Top-Right Air */
              <g transform="translate(392, 82)">
                {/* Cute Rounded Sunbeams */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <rect
                    key={deg}
                    x="-4"
                    y="-38"
                    width="8"
                    height="12"
                    rx="4"
                    fill="#fbbf24"
                    transform={`rotate(${deg})`}
                  />
                ))}
                <circle
                  cx="0"
                  cy="0"
                  r="24"
                  fill="url(#gold3D)"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                />
                {/* Cute Kawaii Sun Face */}
                <circle cx="-8" cy="-2" r="2.8" fill="#451a03" />
                <circle cx="8" cy="-2" r="2.8" fill="#451a03" />
                <circle cx="-12" cy="3" r="4" fill="#f472b6" opacity="0.6" />
                <circle cx="12" cy="3" r="4" fill="#f472b6" opacity="0.6" />
                <path
                  d="M -5 4 Q 0 9 5 4"
                  fill="none"
                  stroke="#451a03"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </g>
            )}
          </g>

          {/* Left & Right Floating Plump 3D Stars & Mini Clouds in the Air */}
          <g className="animate-celestial-b">
            {/* Left Floating Golden Plump Star */}
            <g transform="translate(64, 240) rotate(-12)">
              <polygon
                points="0,-16 5,-5 17,-3 8,5 10,17 0,11 -10,17 -8,5 -17,-3 -5,-5"
                fill="url(#gold3D)"
                stroke="#d97706"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </g>

            {/* Lower-Left Floating Lavender Star */}
            <g transform="translate(52, 305) rotate(15) scale(0.78)">
              <polygon
                points="0,-16 5,-5 17,-3 8,5 10,17 0,11 -10,17 -8,5 -17,-3 -5,-5"
                fill="url(#lavenderStar3D)"
                stroke="#9333ea"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </g>

            {/* Right Floating Golden Plump Star */}
            <g transform="translate(418, 252) rotate(14)">
              <polygon
                points="0,-16 5,-5 17,-3 8,5 10,17 0,11 -10,17 -8,5 -17,-3 -5,-5"
                fill="url(#gold3D)"
                stroke="#d97706"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </g>

            {/* Upper-Right Floating Lavender Star */}
            <g transform="translate(405, 168) rotate(-18) scale(0.75)">
              <polygon
                points="0,-16 5,-5 17,-3 8,5 10,17 0,11 -10,17 -8,5 -17,-3 -5,-5"
                fill="url(#lavenderStar3D)"
                stroke="#9333ea"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </g>

            {/* Day-Mode Extra Mini Cotton-Candy Cloud Puff on Top-Left */}
            {!isNight && (
              <g transform="translate(76, 118)">
                <path
                  d="M -22 8 C -30 8, -32 -4, -22 -8 C -18 -18, -2 -18, 4 -10 C 14 -14, 26 -6, 22 6 C 26 12, 16 16, 6 14 C -2 18, -14 16, -22 8 Z"
                  fill="#ffffff"
                  stroke="#bae6fd"
                  strokeWidth="1.5"
                />
                <circle cx="-6" cy="2" r="2" fill="#f472b6" opacity="0.7" />
                <circle cx="8" cy="2" r="2" fill="#38bdf8" opacity="0.7" />
              </g>
            )}

            {/* Twinkling 4-Point Sparkles Floating in the Air */}
            <circle cx="88" cy="195" r="3" fill="#fbbf24" />
            <circle cx="390" cy="215" r="3" fill="#f472b6" />
            <circle cx="75" cy="276" r="2.5" fill="#38bdf8" />
            <circle cx="400" cy="295" r="2.5" fill="#fbbf24" />
          </g>

          {/* ===================================================================== */}
          {/* LAYER 2: 3D FLUFFY CUSHION CLOUD BASE WITH "♥ Bitz ♥" EMBROIDERY     */}
          {/* ===================================================================== */}
          <g transform={`translate(${pupilOffset.x * -0.25}, 0)`}>
            {/* Soft Sky Shadow Underneath Cloud */}
            <ellipse
              cx="240"
              cy="416"
              rx="145"
              ry="18"
              fill="#38bdf8"
              opacity="0.22"
            />
            {/* Multi-Puff 3D Plush Cushion Cloud */}
            <path
              d="M 92 346 C 64 346, 56 376, 82 390 C 98 408, 138 412, 172 402 C 198 422, 282 422, 308 402 C 342 412, 382 408, 398 390 C 424 376, 416 346, 388 346 C 392 320, 362 304, 336 314 C 312 296, 168 296, 144 314 C 118 304, 88 320, 92 346 Z"
              fill="url(#cloudCushion3D)"
              stroke="#bae6fd"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            {/* Soft 3D Inner Cloud Puff Contours */}
            <path
              d="M 135 372 Q 170 390 205 376"
              fill="none"
              stroke="#bae6fd"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M 275 376 Q 310 390 345 372"
              fill="none"
              stroke="#bae6fd"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            {/* Embroidered "♥ Bitz ♥" Front Label on the Cloud Cushion */}
            <text
              x="240"
              y="394"
              textAnchor="middle"
              fill="#db2777"
              fontSize="20"
              fontWeight="bold"
              fontFamily="var(--font-fredoka), sans-serif"
            >
              ♥ Bitz ♥
            </text>
          </g>

          {/* ===================================================================== */}
          {/* LAYER 3: BITZ'S FULL BABY CHARACTER BODY (PAJAMA TORSO + LEGS + ARMS) */}
          {/* ===================================================================== */}
          <g className={bodyChoreographyClass}>
            {/* 3A: BABY ONESIE / PAJAMA TORSO (With cute pastel hearts & stars pattern!) */}
            <g>
              <path
                d="M 176 238 C 162 256, 158 296, 168 324 C 184 342, 296 342, 312 324 C 322 296, 318 256, 304 238 Z"
                fill="url(#babyOnesie3D)"
                stroke="#f9a8d4"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              {/* Cute Pastel Sky-Blue Scalloped Onesie Collar */}
              <path
                d="M 192 242 Q 216 256 240 246 Q 264 256 288 242"
                fill="none"
                stroke="#7dd3fc"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Cute Pattern Details on the Baby Onesie (Tiny Hearts & Stars) */}
              <circle cx="222" cy="274" r="3" fill="#f472b6" opacity="0.65" />
              <circle cx="258" cy="278" r="3" fill="#38bdf8" opacity="0.65" />
              <circle cx="240" cy="296" r="3.5" fill="#fbbf24" opacity="0.75" />
              <circle cx="212" cy="304" r="2.8" fill="#38bdf8" opacity="0.65" />
              <circle cx="268" cy="302" r="2.8" fill="#f472b6" opacity="0.65" />
            </g>

            {/* 3B: CHUBBY SEATED BABY LEGS & PASTEL BOOTIES (Kick happily when tickled!) */}
            <g className={isGiggling ? "animate-feet-kick" : ""}>
              {/* Left Seated Baby Leg & Bootie */}
              <g transform="translate(194, 326)">
                <ellipse
                  cx="0"
                  cy="0"
                  rx="28"
                  ry="22"
                  transform="rotate(-12)"
                  fill="url(#babyOnesie3D)"
                  stroke="#f9a8d4"
                  strokeWidth="2"
                />
                {/* Cute Periwinkle/Sky-Blue Bootie Sole */}
                <ellipse
                  cx="-2"
                  cy="4"
                  rx="20"
                  ry="15"
                  transform="rotate(-10)"
                  fill="url(#babyBootie3D)"
                  stroke="#7dd3fc"
                  strokeWidth="1.5"
                />
                {/* Cute Baby-Pink Toe Heart */}
                <circle cx="-2" cy="4" r="5" fill="#f472b6" opacity="0.55" />
              </g>

              {/* Right Seated Baby Leg & Bootie */}
              <g transform="translate(286, 326)">
                <ellipse
                  cx="0"
                  cy="0"
                  rx="28"
                  ry="22"
                  transform="rotate(12)"
                  fill="url(#babyOnesie3D)"
                  stroke="#f9a8d4"
                  strokeWidth="2"
                />
                {/* Cute Periwinkle/Sky-Blue Bootie Sole */}
                <ellipse
                  cx="2"
                  cy="4"
                  rx="20"
                  ry="15"
                  transform="rotate(10)"
                  fill="url(#babyBootie3D)"
                  stroke="#7dd3fc"
                  strokeWidth="1.5"
                />
                <circle cx="2" cy="4" r="5" fill="#f472b6" opacity="0.55" />
              </g>
            </g>

            {/* 3C: BIG ADORABLE 3D PLUSHIE BABY CLOUD HEAD (100% Cute, Zero Scary!) */}
            <g transform={`rotate(${headTilt * 0.35} 240 175)`}>
              {/* Sculpted Chubby Baby Cloud Head Silhouette */}
              <path
                d="M 136 172 C 132 108, 180 78, 240 78 C 300 78, 348 108, 344 172 C 356 208, 332 248, 286 250 C 264 254, 216 254, 194 250 C 148 248, 124 208, 136 172 Z"
                fill="url(#babyHead3D)"
                stroke="#fbcfe8"
                strokeWidth="2"
                strokeLinejoin="round"
              />

              {/* STAR-PATTERNED SLEEPING CAP + CUTE PINK BOW + GOLDEN STAR-BELL */}
              <g>
                {/* Drooping Baby Nightcap Cone (Curves down on the left + Star-Bell on the right!) */}
                <path
                  d="M 132 154 C 126 76, 198 44, 266 56 C 324 66, 354 106, 348 154 C 318 128, 274 118, 238 118 C 194 118, 158 130, 132 154 Z"
                  fill="url(#nightCap3D)"
                  stroke="#7dd3fc"
                  strokeWidth="2"
                />
                {/* Left Drooping Nightcap Tail & Fluffy Pom-Pom */}
                <path
                  d="M 134 128 C 102 138, 88 168, 96 196 C 112 188, 124 168, 134 152 Z"
                  fill="url(#nightCap3D)"
                  stroke="#7dd3fc"
                  strokeWidth="1.8"
                />
                <circle
                  cx="94"
                  cy="202"
                  r="18"
                  fill="url(#babyHead3D)"
                  stroke="#fbcfe8"
                  strokeWidth="1.8"
                />

                {/* Cute Golden Star Pattern Printed on the Nightcap */}
                <circle cx="205" cy="84" r="3.5" fill="#fde047" />
                <circle cx="248" cy="78" r="4" fill="#fde047" />
                <circle cx="288" cy="92" r="3.5" fill="#fde047" />
                <circle cx="172" cy="102" r="3" fill="#f472b6" opacity="0.7" />
                <circle cx="268" cy="102" r="3" fill="#f472b6" opacity="0.7" />

                {/* Cozy Rolled Nightcap Brim */}
                <path
                  d="M 128 152 Q 240 110 352 152 Q 358 168 340 172 Q 240 132 140 172 Q 122 168 128 152 Z"
                  fill="#fff8fb"
                  stroke="#fbcfe8"
                  strokeWidth="2"
                />

                {/* CUTE 3D BABY-PINK RIBBON BOW ON CAP BRIM (Like the cute bow in reference!) */}
                <g transform="translate(166, 134) rotate(-18)">
                  {/* Left Bow Loop */}
                  <path
                    d="M 0 0 C -18 -14, -26 6, -12 14 C -4 16, -2 6, 0 0 Z"
                    fill="url(#pinkBow3D)"
                    stroke="#db2777"
                    strokeWidth="1.4"
                  />
                  {/* Right Bow Loop */}
                  <path
                    d="M 0 0 C 18 -14, 26 6, 12 14 C 4 16, 2 6, 0 0 Z"
                    fill="url(#pinkBow3D)"
                    stroke="#db2777"
                    strokeWidth="1.4"
                  />
                  {/* Center Bow Knot */}
                  <ellipse
                    cx="0"
                    cy="3"
                    rx="5.5"
                    ry="6.5"
                    fill="#f472b6"
                    stroke="#be185d"
                    strokeWidth="1.4"
                  />
                </g>

                {/* INTERACTIVE GOLDEN STAR-BELL TASSEL ON RIGHT SIDE OF CAP (3 Clicks Easter Egg!) */}
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
                  className="cursor-pointer"
                >
                  <circle cx="364" cy="186" r="32" fill="transparent" />
                  {(isBellRinging || antennaClicks > 0) && (
                    <circle
                      cx="364"
                      cy="190"
                      r="18"
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="2.5"
                      className="animate-bell-ripple"
                    />
                  )}
                  <path
                    d="M 350 156 Q 362 168 364 178"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />
                  <polygon
                    points="364,168 370,181 384,183 373,192 376,206 364,199 352,206 355,192 344,183 358,181"
                    fill="url(#gold3D)"
                    stroke="#b45309"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <circle cx="364" cy="189" r="2.8" fill="#92400e" />
                </g>
              </g>

              {/* BABY FACE: ROSY CHEEKS + CLIPPED CURSOR-TRACKING KAWAII EYES + CUTE NOSE & SMILE */}
              <g>
                {/* Rosy Baby-Pink Cheeks */}
                <ellipse
                  cx="164"
                  cy="218"
                  rx={isGiggling ? "24" : "20"}
                  ry={isGiggling ? "14" : "11"}
                  fill="url(#rosyCheek3D)"
                />
                <ellipse
                  cx="316"
                  cy="218"
                  rx={isGiggling ? "24" : "20"}
                  ry={isGiggling ? "14" : "11"}
                  fill="url(#rosyCheek3D)"
                />

                {/* LEFT EYE SOCKET (Strictly clipped so eyeballs NEVER leave the socket!) */}
                <g transform="translate(196, 194)">
                  <ellipse
                    cx="0"
                    cy="0"
                    rx="20.5"
                    ry="22.5"
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
                          <ellipse cx="0" cy="0" rx="22" ry="24" fill="#fff8fb" />
                          <path
                            d="M -12 4 Q 0 -12 12 4"
                            fill="none"
                            stroke="#31102f"
                            strokeWidth="4.8"
                            strokeLinecap="round"
                          />
                        </g>
                      ) : isLullaby ? (
                        <g>
                          <ellipse cx="0" cy="0" rx="22" ry="24" fill="#fff8fb" />
                          <path
                            d="M -12 -2 Q 0 11 12 -2"
                            fill="none"
                            stroke="#31102f"
                            strokeWidth="4.2"
                            strokeLinecap="round"
                          />
                        </g>
                      ) : (
                        <>
                          <ellipse
                            cx="0"
                            cy="0"
                            rx="18"
                            ry="20"
                            fill="url(#kawaiiEye3D)"
                          />
                          <path
                            d="M -11 7 A 13 13 0 0 0 11 7 A 13 9 0 0 1 -11 7 Z"
                            fill="#f59e0b"
                            opacity="0.72"
                          />
                          <ellipse
                            cx="-5.5"
                            cy="-7"
                            rx="5.5"
                            ry="6.8"
                            transform="rotate(-15 -5.5 -7)"
                            fill="#ffffff"
                          />
                          <circle cx="6" cy="6" r="2.6" fill="#ffffff" />
                          <circle cx="-6" cy="5" r="1.8" fill="#fde047" />
                        </>
                      )}
                    </g>
                  </g>
                  {isBlinking && !isGiggling && !isLullaby && (
                    <ellipse cx="0" cy="0" rx="21" ry="23" fill="#fff8fb" />
                  )}
                </g>

                {/* RIGHT EYE SOCKET (Strictly clipped so eyeballs NEVER leave the socket!) */}
                <g transform="translate(284, 194)">
                  <ellipse
                    cx="0"
                    cy="0"
                    rx="20.5"
                    ry="22.5"
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
                          <ellipse cx="0" cy="0" rx="22" ry="24" fill="#fff8fb" />
                          <path
                            d="M -12 4 Q 0 -12 12 4"
                            fill="none"
                            stroke="#31102f"
                            strokeWidth="4.8"
                            strokeLinecap="round"
                          />
                        </g>
                      ) : isWaving ? (
                        <g>
                          <ellipse cx="0" cy="0" rx="22" ry="24" fill="#fff8fb" />
                          <path
                            d="M -12 2 Q 0 -11 12 2"
                            fill="none"
                            stroke="#31102f"
                            strokeWidth="4.8"
                            strokeLinecap="round"
                          />
                        </g>
                      ) : isLullaby ? (
                        <g>
                          <ellipse cx="0" cy="0" rx="22" ry="24" fill="#fff8fb" />
                          <path
                            d="M -12 -2 Q 0 11 12 -2"
                            fill="none"
                            stroke="#31102f"
                            strokeWidth="4.2"
                            strokeLinecap="round"
                          />
                        </g>
                      ) : (
                        <>
                          <ellipse
                            cx="0"
                            cy="0"
                            rx="18"
                            ry="20"
                            fill="url(#kawaiiEye3D)"
                          />
                          <path
                            d="M -11 7 A 13 13 0 0 0 11 7 A 13 9 0 0 1 -11 7 Z"
                            fill="#f59e0b"
                            opacity="0.72"
                          />
                          <ellipse
                            cx="-5.5"
                            cy="-7"
                            rx="5.5"
                            ry="6.8"
                            transform="rotate(-15 -5.5 -7)"
                            fill="#ffffff"
                          />
                          <circle cx="6" cy="6" r="2.6" fill="#ffffff" />
                          <circle cx="-6" cy="5" r="1.8" fill="#fde047" />
                        </>
                      )}
                    </g>
                  </g>
                  {isBlinking && !isGiggling && !isWaving && !isLullaby && (
                    <ellipse cx="0" cy="0" rx="21" ry="23" fill="#fff8fb" />
                  )}
                </g>

                {/* Cute Tiny Baby Button Nose (Soft Pink Oval — NOT a scary skull nose!) */}
                <ellipse cx="240" cy="205" rx="4" ry="2.8" fill="#f472b6" />

                {/* Cute Baby Smile */}
                {isGiggling || isWaving ? (
                  <g transform="translate(240, 216)">
                    <path
                      d="M -13 -2 Q 0 20 13 -2 Z"
                      fill="#db2777"
                      stroke="#4a044e"
                      strokeWidth="2"
                    />
                    <path d="M -7 4 Q 0 13 7 4 Z" fill="#f9a8d4" />
                  </g>
                ) : isLullaby ? (
                  <circle
                    cx="240"
                    cy="218"
                    r="4"
                    fill="#f472b6"
                    stroke="#4a044e"
                    strokeWidth="1.8"
                  />
                ) : (
                  <path
                    d="M 229 214 Q 240 224 251 214"
                    fill="none"
                    stroke="#4a044e"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />
                )}
              </g>
            </g>

            {/* 3D: LEFT SIDE SLEEVED BABY ARM HOLDING GLOWING STARLIGHT LANTERN */}
            <g
              onClick={handleWaveMoon}
              className={isWaving || isGiggling ? "animate-lift-lantern" : ""}
            >
              {/* 3D Glowing Starlight Lantern (Like the cute lantern held in hand!) */}
              <g transform="translate(158, 282)">
                {/* Lantern Handle */}
                <path
                  d="M -12 -32 A 12 12 0 0 1 12 -32"
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="3"
                />
                {/* Lantern Top Cap */}
                <path
                  d="M -18 -22 L 18 -22 L 12 -32 L -12 -32 Z"
                  fill="url(#gold3D)"
                  stroke="#b45309"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                {/* Lantern Glowing Glass Chamber */}
                <rect
                  x="-17"
                  y="-22"
                  width="34"
                  height="38"
                  rx="8"
                  fill="#fef08a"
                  stroke="#d97706"
                  strokeWidth="2"
                />
                {/* Glowing Star Flame Inside Lantern */}
                <polygon
                  points="0,-15 4,-6 13,-4 6,2 8,11 0,6 -8,11 -6,2 -13,-4 -4,-6"
                  fill="#f59e0b"
                />
                <circle cx="0" cy="-2" r="4" fill="#ffffff" />
                {/* Lantern Base */}
                <rect
                  x="-20"
                  y="14"
                  width="40"
                  height="8"
                  rx="4"
                  fill="url(#gold3D)"
                  stroke="#b45309"
                  strokeWidth="1.5"
                />
              </g>

              {/* Chubby Sleeved Baby Arm & Hand Holding the Lantern */}
              <path
                d="M 166 246 C 142 252, 132 272, 146 286 C 156 294, 174 286, 178 272 Z"
                fill="url(#babyOnesie3D)"
                stroke="#f9a8d4"
                strokeWidth="1.8"
              />
              {/* Cute Baby Hand */}
              <ellipse
                cx="162"
                cy="264"
                rx="13"
                ry="11"
                fill="url(#babyHead3D)"
                stroke="#fbcfe8"
                strokeWidth="1.5"
              />
            </g>

            {/* 3E: RIGHT SIDE SLEEVED BABY ARM HOLDING CUTE WIND-UP CLOUD MUSIC BOX */}
            <g
              onClick={handleSingLullaby}
              className={
                isWaving || isGiggling || isLullaby ? "animate-wave-musicbox" : ""
              }
            >
              {/* Cute Wind-Up Cloud Music Box with Mini Rainbow & Star Charm on Top! */}
              <g transform="translate(314, 282)">
                {/* Mini Rainbow & Star Figurine on top of Music Box */}
                <path
                  d="M -14 -14 A 14 14 0 0 1 14 -14"
                  fill="none"
                  stroke="#f472b6"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M -10 -14 A 10 10 0 0 1 10 -14"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <polygon
                  points="0,-32 3,-24 11,-23 5,-18 7,-10 0,-14 -7,-10 -5,-18 -11,-23 -3,-24"
                  fill="url(#gold3D)"
                  stroke="#d97706"
                  strokeWidth="1"
                />
                {/* Cylindrical Pastel Drum Base of Music Box */}
                <rect
                  x="-20"
                  y="-14"
                  width="40"
                  height="26"
                  rx="8"
                  fill="#bae6fd"
                  stroke="#0284c7"
                  strokeWidth="1.8"
                />
                {/* Pink Decorative Stripe on Music Box */}
                <rect
                  x="-19"
                  y="-4"
                  width="38"
                  height="7"
                  fill="#f472b6"
                />
                {/* Golden Wind-Up Key on Side */}
                <line
                  x1="20"
                  y1="0"
                  x2="28"
                  y2="0"
                  stroke="#d97706"
                  strokeWidth="2.5"
                />
                <circle
                  cx="30"
                  cy="0"
                  r="4"
                  fill="#fde047"
                  stroke="#d97706"
                  strokeWidth="1.5"
                />
              </g>

              {/* Chubby Sleeved Baby Arm & Hand Hugging the Music Box */}
              <path
                d="M 314 246 C 338 252, 348 272, 334 286 C 324 294, 306 286, 302 272 Z"
                fill="url(#babyOnesie3D)"
                stroke="#f9a8d4"
                strokeWidth="1.8"
              />
              {/* Cute Baby Hand */}
              <ellipse
                cx="318"
                cy="268"
                rx="13"
                ry="11"
                fill="url(#babyHead3D)"
                stroke="#fbcfe8"
                strokeWidth="1.5"
              />
            </g>
          </g>
        </svg>
      </div>

      {/* TACTILE 3D 90S TOY PUSH-BUTTONS (Not hax.baby's flat rounded pills!) */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-2.5">
        <button
          type="button"
          onClick={handlePokeBelly}
          className="retro-btn-pink inline-flex items-center gap-1.5 px-4 py-2 text-xs"
        >
          <Heart className="w-3.5 h-3.5 fill-current text-white" />
          Tickle Belly (Jump & Kick)
        </button>

        <button
          type="button"
          onClick={handleWaveMoon}
          className="retro-btn-sky inline-flex items-center gap-1.5 px-4 py-2 text-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          Shine Star-Lantern
        </button>

        <button
          type="button"
          onClick={handleSingLullaby}
          className="retro-btn-cream inline-flex items-center gap-1.5 px-4 py-2 text-xs"
        >
          <Music className="w-3.5 h-3.5 text-pink-600" />
          Wind Music Box
        </button>

        <button
          type="button"
          onClick={handleAntennaClick}
          className="retro-btn-sky inline-flex items-center gap-1.5 px-4 py-2 text-xs"
        >
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-current" />
          Ring Star-Bell ({antennaClicks}/3)
        </button>
      </div>
    </div>
  );
}
