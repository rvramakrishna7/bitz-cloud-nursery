"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sun, Moon, Zap, Heart } from "lucide-react";
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
  const [moodReaction, setMoodReaction] = useState("happy"); // happy | giggle | rainbow
  const [isBlinking, setIsBlinking] = useState(false);
  const [tickleBurstId, setTickleBurstId] = useState(0);
  const [speechBubble, setSpeechBubble] = useState(
    "Hiya! Move your cursor—my eyes follow you! Click my fluffy belly to tickle me, or tap my golden star-bell 3 times! ✨"
  );

  // Cursor / Touch tracking for real-time eye movement and 3D plushie tilt
  useEffect(() => {
    const handlePointerMove = (clientX, clientY) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      const offset = calculatePupilOffset(center, { x: clientX, y: clientY }, 10);
      setPupilOffset(offset);
      const tilt = Math.max(-8, Math.min(8, (clientX - center.x) / 32));
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

  // Natural blinking loop every 3.5 seconds
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3600);
    return () => clearInterval(blinkInterval);
  }, []);

  const handlePokeBelly = () => {
    soundEngine.playGiggle();
    setMoodReaction("giggle");
    setTickleBurstId((prev) => prev + 1);
    const messages = [
      "Hehehe! That tickles my fluffy marshmallow belly! ☁️💖",
      "*Squish-boing!* You made my rosy cheeks puff up and sparkle! ✨",
      "Wheee! Look at my arms and moon lantern bounce! 🌙💕",
      "Giggle-puff! Tickling me shakes out baby-pink cloud wishes! 🌸",
    ];
    setSpeechBubble(messages[Math.floor(Math.random() * messages.length)]);
    setTimeout(() => {
      setMoodReaction((curr) => (curr === "giggle" ? "happy" : curr));
    }, 1400);
  };

  const handleAntennaClick = (e) => {
    if (e) e.stopPropagation();
    const nextCount = antennaClicks + 1;
    setAntennaClicks(nextCount);

    if (nextCount >= 3) {
      soundEngine.playSecretLullaby();
      setMoodReaction("rainbow");
      setSpeechBubble(
        "🎉 SECRET EASTER EGG UNLOCKED! Baby-Pink & Sky-Blue Star-Bell Overdrive! ✨🌈"
      );
      if (typeof window !== "undefined") {
        try {
          confetti({
            particleCount: 95,
            spread: 85,
            origin: { y: 0.55 },
            colors: ["#f472b6", "#38bdf8", "#fbbf24", "#fbcfe8", "#bae6fd"],
          });
        } catch (err) {
          // Ignore canvas error in headless test environments
        }
      }
      onEasterEggTriggered?.();
      setAntennaClicks(0);
    } else {
      soundEngine.playNote(659.25 + nextCount * 120, 0.25, "triangle");
      setSpeechBubble(
        `⭐ *Ting-a-ling!* Golden Star-Bell rung (${nextCount}/3)... tap ${
          3 - nextCount
        } more time${3 - nextCount === 1 ? "" : "s"} for a secret surprise!`
      );
    }
  };

  const isNight = theme === "night";
  const isGiggling = moodReaction === "giggle";
  const isRainbow = moodReaction === "rainbow" || easterEggUnlocked;

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center select-none py-2"
      data-testid="bitz-character-stage"
    >
      {/* Floating Speech Bubble Pill (Clean Solid Baby-Pink & Sky-Blue Border, No Card Box Around Character!) */}
      <div
        aria-live="polite"
        className="mb-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-pink-300 dark:border-sky-400 shadow-sm text-center max-w-sm relative"
      >
        <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug">
          {speechBubble}
        </p>
        {/* Little speech pointer triangle */}
        <div className="w-3.5 h-3.5 bg-white dark:bg-slate-800 border-r-2 border-b-2 border-pink-300 dark:border-sky-400 rotate-45 mx-auto -mb-4 mt-1" />
      </div>

      {/* FREE-FLOATING 3D PLUSHIE CHARACTER RIG (NO CARD FRAME, NO BOX!) */}
      <div
        onClick={handlePokeBelly}
        role="button"
        tabIndex={0}
        aria-label="Tickle Bitz the 3D Baby Cloud-Sprite to make them squish, wave, and giggle"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handlePokeBelly();
          }
        }}
        style={{
          transform: `perspective(900px) rotateY(${pupilOffset.x * 1.3}deg) rotateX(${-pupilOffset.y * 1.1}deg) rotateZ(${headTilt * 0.6}deg)`,
          transition: "transform 0.14s ease-out",
        }}
        className="relative cursor-pointer focus:outline-none animate-float"
      >
        {/* Floating Hearts & Sparkles Burst when Belly is Tickled */}
        {isGiggling && (
          <div
            key={tickleBurstId}
            className="pointer-events-none absolute inset-0 z-30 overflow-visible"
          >
            <span className="animate-heart-pop absolute top-12 left-10 text-2xl">
              💖
            </span>
            <span className="animate-heart-pop absolute top-8 right-12 text-2xl">
              💕
            </span>
            <span className="animate-heart-pop absolute top-28 left-4 text-xl">
              ✨
            </span>
            <span className="animate-heart-pop absolute top-24 right-6 text-2xl">
              🌸
            </span>
          </div>
        )}

        {/* Multi-Part 3D-Shaded Plushie Rig SVG (Matches the Cute 3D Plushie Portrait 1:1!) */}
        <svg
          viewBox="0 0 440 420"
          className="w-[310px] h-[300px] sm:w-[390px] sm:h-[375px] overflow-visible drop-shadow-[0_22px_28px_rgba(56,189,248,0.28)]"
          aria-label="Bitz, a 3D plushie cloud-sprite wearing a periwinkle knit nightcap with a golden star-bell and holding a crescent moon"
        >
          <defs>
            {/* 3D Subsurface Plushie Cloud Body Shading (Warm Cream Top -> Soft Baby Pink & Sky Blue Rim Shadow) */}
            <radialGradient id="plushCloudBody" cx="44%" cy="34%" r="62%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="58%" stopColor="#fff9fc" />
              <stop offset="82%" stopColor="#fce7f3" />
              <stop offset="100%" stopColor="#dbeafe" />
            </radialGradient>

            {/* 3D Individual Cloud Puff Highlight */}
            <radialGradient id="plushPuff3D" cx="38%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="68%" stopColor="#fdf2f8" />
              <stop offset="100%" stopColor="#e0f2fe" />
            </radialGradient>

            {/* 3D Cushion Cloud Base (Sky Blue Plush Cushion) */}
            <radialGradient id="skyCushion3D" cx="48%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#f0f9ff" />
              <stop offset="55%" stopColor="#bae6fd" />
              <stop offset="88%" stopColor="#7dd3fc" />
              <stop offset="100%" stopColor="#38bdf8" />
            </radialGradient>

            {/* 3D Periwinkle / Sky-Blue Knit Nightcap Shading */}
            <linearGradient id="knitCap3D" x1="15%" y1="10%" x2="85%" y2="90%">
              <stop offset="0%" stopColor="#a5b4fc" />
              <stop offset="48%" stopColor="#818cf8" />
              <stop offset="82%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>

            {/* 3D Ribbed Cuff of the Knit Cap */}
            <linearGradient id="knitBrim3D" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c7d2fe" />
              <stop offset="50%" stopColor="#93c5fd" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>

            {/* 3D Glowing Golden Crescent Moon & Star-Bell Shading */}
            <radialGradient id="gold3D" cx="35%" cy="30%" r="68%">
              <stop offset="0%" stopColor="#fef9c3" />
              <stop offset="40%" stopColor="#fde047" />
              <stop offset="78%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </radialGradient>

            {/* 3D Kawaii Glossy Eye Iris Shading */}
            <radialGradient id="kawaiiEye3D" cx="50%" cy="68%" r="58%">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="35%" stopColor="#451a03" />
              <stop offset="80%" stopColor="#1c0a00" />
              <stop offset="100%" stopColor="#090400" />
            </radialGradient>

            {/* 3D Rosy Baby-Pink Blush Gradient */}
            <radialGradient id="rosyCheek3D" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f472b6" stopOpacity="0.85" />
              <stop offset="55%" stopColor="#fb7185" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#fb7185" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Optional Rainbow Halo when 3-Click Easter Egg is Unlocked */}
          {isRainbow && (
            <g className="opacity-90">
              <path
                d="M 65 280 A 155 155 0 0 1 375 280"
                fill="none"
                stroke="#f472b6"
                strokeWidth="16"
                strokeLinecap="round"
              />
              <path
                d="M 80 280 A 140 140 0 0 1 360 280"
                fill="none"
                stroke="#fde047"
                strokeWidth="14"
                strokeLinecap="round"
              />
              <path
                d="M 95 280 A 125 125 0 0 1 345 280"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="14"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* LAYER 1: 3D SKY-BLUE PLUSH CUSHION CLOUD BASE (Rides underneath Bitz) */}
          <g transform={`translate(${pupilOffset.x * -0.35}, 0)`}>
            {/* Soft contact shadow on the cloud cushion */}
            <ellipse
              cx="220"
              cy="376"
              rx="145"
              ry="24"
              fill="#38bdf8"
              opacity="0.22"
            />
            <circle cx="115" cy="340" r="38" fill="url(#skyCushion3D)" />
            <circle cx="325" cy="340" r="38" fill="url(#skyCushion3D)" />
            <circle cx="155" cy="352" r="44" fill="url(#skyCushion3D)" />
            <circle cx="285" cy="352" r="44" fill="url(#skyCushion3D)" />
            <ellipse
              cx="220"
              cy="356"
              rx="135"
              ry="34"
              fill="url(#skyCushion3D)"
            />
            <circle cx="220" cy="346" r="48" fill="url(#skyCushion3D)" />
            {/* Cute baby-pink & golden star sprinkles on the cushion cloud */}
            <circle cx="135" cy="356" r="3.5" fill="#f472b6" opacity="0.8" />
            <circle cx="305" cy="354" r="3.5" fill="#fbbf24" opacity="0.9" />
            <circle cx="265" cy="368" r="3" fill="#f472b6" opacity="0.75" />
          </g>

          {/* LAYER 2: BITZ'S ANIMATED 3D CLOUD BODY + ARMS + FACE + KNIT CAP */}
          <g className={isGiggling ? "animate-belly-tickle" : ""}>
            {/* Back Cloud Scallop Puffs for 3D Fluffy Silhouette */}
            <circle cx="122" cy="215" r="46" fill="url(#plushPuff3D)" />
            <circle cx="310" cy="215" r="46" fill="url(#plushPuff3D)" />
            <circle cx="108" cy="265" r="44" fill="url(#plushPuff3D)" />
            <circle cx="322" cy="265" r="44" fill="url(#plushPuff3D)" />
            <circle cx="138" cy="308" r="46" fill="url(#plushPuff3D)" />
            <circle cx="292" cy="308" r="46" fill="url(#plushPuff3D)" />

            {/* Cute Chubby Cloud Feet resting on the Cushion Cloud */}
            <ellipse
              cx="172"
              cy="332"
              rx="28"
              ry="20"
              transform="rotate(-10 172 332)"
              fill="url(#plushPuff3D)"
            />
            <ellipse
              cx="260"
              cy="332"
              rx="28"
              ry="20"
              transform="rotate(10 260 332)"
              fill="url(#plushPuff3D)"
            />
            {/* Rosy Baby-Pink Toe Beans */}
            <ellipse cx="172" cy="336" rx="12" ry="7" fill="#fbcfe8" />
            <ellipse cx="260" cy="336" rx="12" ry="7" fill="#fbcfe8" />

            {/* Main Chubby 3D Plushie Cloud Belly & Head */}
            <ellipse
              cx="216"
              cy="242"
              rx="108"
              ry="96"
              fill="url(#plushCloudBody)"
            />
            <circle cx="170" cy="166" r="46" fill="url(#plushPuff3D)" />
            <circle cx="262" cy="166" r="46" fill="url(#plushPuff3D)" />
            <circle cx="216" cy="158" r="52" fill="url(#plushCloudBody)" />

            {/* Soft Belly Tummy Patch (Interactive Tickle Zone Highlight) */}
            <ellipse
              cx="216"
              cy="286"
              rx="52"
              ry="34"
              fill="#fff1f2"
              opacity={isGiggling ? "0.95" : "0.55"}
            />

            {/* LAYER 3: 3D PERIWINKLE KNIT SLEEPING CAP + SWINGING GOLDEN STAR-BELL */}
            <g transform={`rotate(${headTilt * 0.45} 216 135)`}>
              {/* Cap Cone curving to the right */}
              <path
                d="M 122 142 C 135 52, 238 28, 315 86 C 344 108, 355 138, 344 162 C 325 142, 296 128, 268 134 Z"
                fill="url(#knitCap3D)"
              />
              {/* Knit Ribbing Texture Lines on the Cap */}
              <path
                d="M 162 118 Q 210 65 275 82"
                fill="none"
                stroke="#e0e7ff"
                strokeWidth="2.5"
                strokeDasharray="5 5"
                opacity="0.45"
              />
              <path
                d="M 145 132 Q 205 82 295 102"
                fill="none"
                stroke="#e0e7ff"
                strokeWidth="2.5"
                strokeDasharray="5 5"
                opacity="0.45"
              />

              {/* Fluffy Ribbed Knit Brim sitting snugly on Bitz's forehead */}
              <path
                d="M 114 148 Q 216 104 316 146 Q 326 168 304 174 Q 216 134 126 174 Q 104 168 114 148 Z"
                fill="url(#knitBrim3D)"
              />
              {/* Vertical rib stitches on the cap brim */}
              {[138, 158, 178, 198, 218, 238, 258, 278, 298].map((rx, idx) => (
                <line
                  key={idx}
                  x1={rx}
                  y1={134 - Math.sin((idx / 8) * Math.PI) * 16}
                  x2={rx}
                  y2={156 - Math.sin((idx / 8) * Math.PI) * 16}
                  stroke="#e0e7ff"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  opacity="0.55"
                />
              ))}

              {/* INTERACTIVE GOLDEN 3D STAR-BELL TASSEL (Click 3x for Easter Egg!) */}
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
                  isGiggling ? "animate-swing-bell-fast" : "animate-swing-bell"
                }`}
              >
                {/* Invisible oversized hit target for easy clicking */}
                <circle cx="348" cy="195" r="36" fill="transparent" />
                {/* Golden Cord */}
                <path
                  d="M 342 156 Q 348 174 346 186"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                {/* Soft Golden Halo behind Star-Bell */}
                <circle
                  cx="346"
                  cy="202"
                  r={antennaClicks > 0 ? "30" : "24"}
                  fill="#fde047"
                  opacity={antennaClicks > 0 ? "0.55" : "0.3"}
                />
                {/* 3D Golden Star-Bell */}
                <polygon
                  points="346,178 353,193 370,195 357,206 361,222 346,214 331,222 335,206 322,195 339,193"
                  fill="url(#gold3D)"
                  stroke="#b45309"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                {/* Cute bell clapper bead */}
                <circle cx="346" cy="202" r="3.5" fill="#92400e" />
              </g>
            </g>

            {/* LAYER 4: BIG GLOSSY 3D KAWAII EYES THAT FOLLOW THE CURSOR + ROSY CHEEKS + MOUTH */}
            <g>
              {/* Rosy Baby-Pink Plushie Cheeks (Glow brighter when tickled!) */}
              <ellipse
                cx="144"
                cy="242"
                rx={isGiggling ? "26" : "22"}
                ry={isGiggling ? "16" : "13"}
                fill="url(#rosyCheek3D)"
              />
              <ellipse
                cx="288"
                cy="242"
                rx={isGiggling ? "26" : "22"}
                ry={isGiggling ? "16" : "13"}
                fill="url(#rosyCheek3D)"
              />

              {/* LEFT EYE SOCKET */}
              <g transform="translate(174, 216)">
                {/* Outer Eye Socket Shadow */}
                <ellipse cx="0" cy="0" rx="22" ry="25" fill="#1e1b4b" />

                {/* Moving Iris + Pupil + Starlight Reflections (Follows Cursor!) */}
                <g
                  data-testid="bitz-left-pupil"
                  transform={`translate(${pupilOffset.x}, ${pupilOffset.y})`}
                >
                  {isGiggling ? (
                    /* Happy Laughing Kawaii Eye Arc (^ ^) during Belly Tickle */
                    <g>
                      <ellipse cx="0" cy="0" rx="22" ry="25" fill="#fff9fc" />
                      <path
                        d="M -14 4 Q 0 -14 14 4"
                        fill="none"
                        stroke="#31102f"
                        strokeWidth="5.5"
                        strokeLinecap="round"
                      />
                    </g>
                  ) : (
                    <>
                      <ellipse
                        cx="0"
                        cy="0"
                        rx="19"
                        ry="22"
                        fill="url(#kawaiiEye3D)"
                      />
                      {/* Warm Amber Lower Iris Crescent */}
                      <path
                        d="M -12 8 A 14 14 0 0 0 12 8 A 14 10 0 0 1 -12 8 Z"
                        fill="#f59e0b"
                        opacity="0.65"
                      />
                      {/* Big Glossy Top-Left Highlight */}
                      <ellipse
                        cx="-6"
                        cy="-8"
                        rx="6.5"
                        ry="8"
                        transform="rotate(-15 -6 -8)"
                        fill="#ffffff"
                      />
                      {/* Small Bottom-Right Catchlight */}
                      <circle cx="7" cy="7" r="3.2" fill="#ffffff" />
                      {/* Tiny Golden Star Sparkle Inside Eye */}
                      <circle cx="-8" cy="6" r="2" fill="#fde047" />
                    </>
                  )}
                </g>

                {/* Blinking Eyelid Overlay */}
                {isBlinking && !isGiggling && (
                  <ellipse cx="0" cy="0" rx="23" ry="26" fill="#fff5f9" />
                )}
              </g>

              {/* RIGHT EYE SOCKET */}
              <g transform="translate(258, 216)">
                <ellipse cx="0" cy="0" rx="22" ry="25" fill="#1e1b4b" />

                {/* Moving Iris + Pupil + Starlight Reflections (Follows Cursor!) */}
                <g
                  data-testid="bitz-right-pupil"
                  transform={`translate(${pupilOffset.x}, ${pupilOffset.y})`}
                >
                  {isGiggling ? (
                    /* Happy Laughing Kawaii Eye Arc (^ ^) during Belly Tickle */
                    <g>
                      <ellipse cx="0" cy="0" rx="22" ry="25" fill="#fff9fc" />
                      <path
                        d="M -14 4 Q 0 -14 14 4"
                        fill="none"
                        stroke="#31102f"
                        strokeWidth="5.5"
                        strokeLinecap="round"
                      />
                    </g>
                  ) : (
                    <>
                      <ellipse
                        cx="0"
                        cy="0"
                        rx="19"
                        ry="22"
                        fill="url(#kawaiiEye3D)"
                      />
                      <path
                        d="M -12 8 A 14 14 0 0 0 12 8 A 14 10 0 0 1 -12 8 Z"
                        fill="#f59e0b"
                        opacity="0.65"
                      />
                      <ellipse
                        cx="-6"
                        cy="-8"
                        rx="6.5"
                        ry="8"
                        transform="rotate(-15 -6 -8)"
                        fill="#ffffff"
                      />
                      <circle cx="7" cy="7" r="3.2" fill="#ffffff" />
                      <circle cx="-8" cy="6" r="2" fill="#fde047" />
                    </>
                  )}
                </g>

                {isBlinking && !isGiggling && (
                  <ellipse cx="0" cy="0" rx="23" ry="26" fill="#fff5f9" />
                )}
              </g>

              {/* CUTE KAWAII MOUTH (Transforms into wide laughing smile when tickled!) */}
              {isGiggling ? (
                <g transform="translate(216, 238)">
                  <path
                    d="M -16 -2 Q 0 24 16 -2 Z"
                    fill="#be185d"
                    stroke="#4a044e"
                    strokeWidth="2.5"
                  />
                  {/* Cute baby-pink tongue */}
                  <path d="M -9 6 Q 0 17 9 6 Z" fill="#f472b6" />
                </g>
              ) : (
                <path
                  d="M 204 236 Q 216 248 228 236"
                  fill="none"
                  stroke="#4a044e"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              )}
            </g>

            {/* LAYER 5: LEFT CHUBBY CLOUD ARM HOLDING THE GLOWING 3D CRESCENT MOON */}
            <g
              transform={
                isGiggling
                  ? "translate(0, -10) rotate(-12 125 255)"
                  : `translate(${pupilOffset.x * 0.25}, ${pupilOffset.y * 0.25})`
              }
              style={{ transition: "transform 0.2s ease-out" }}
            >
              {/* Soft Amber Glow from the Crescent Moon */}
              <circle
                cx="95"
                cy="246"
                r="42"
                fill="#fde047"
                opacity={isNight || isGiggling ? "0.42" : "0.25"}
              />
              {/* 3D Golden Crescent Moon */}
              <path
                d="M 98 202 A 38 38 0 1 0 124 274 A 28 28 0 1 1 98 202 Z"
                fill="url(#gold3D)"
                stroke="#d97706"
                strokeWidth="1.5"
              />
              {/* Bitz's Left Chubby Cloud Hand Hugging the Moon */}
              <ellipse
                cx="124"
                cy="256"
                rx="24"
                ry="20"
                transform="rotate(18 124 256)"
                fill="url(#plushPuff3D)"
                stroke="#fce7f3"
                strokeWidth="1.5"
              />
            </g>

            {/* LAYER 6: RIGHT WAVING CHUBBY CLOUD ARM (Waves happily, waves super fast when tickled!) */}
            <g
              className={
                isGiggling ? "animate-wave-arm-fast" : "animate-wave-arm"
              }
            >
              <ellipse
                cx="316"
                cy="242"
                rx="26"
                ry="20"
                transform="rotate(-28 316 242)"
                fill="url(#plushPuff3D)"
                stroke="#fce7f3"
                strokeWidth="1.5"
              />
              {/* Cute Rosy Palm Pad */}
              <circle cx="322" cy="238" r="7" fill="#fbcfe8" opacity="0.85" />
            </g>
          </g>
        </svg>
      </div>

      {/* SOLID HIGH-CONTRAST BABY-PINK & SKY-BLUE ACTION BUTTONS (ZERO GRADIENTS!) */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-2.5">
        <button
          type="button"
          onClick={handlePokeBelly}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white border-2 border-pink-600 active:translate-y-0.5 transition shadow-sm"
        >
          <Heart className="w-3.5 h-3.5 fill-current text-pink-100" />
          Tickle Fluffy Belly
        </button>

        <button
          type="button"
          onClick={handleAntennaClick}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold bg-sky-100 hover:bg-sky-200 text-sky-950 border-2 border-sky-300 active:translate-y-0.5 transition shadow-sm"
        >
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-current" />
          Ring Star-Bell ({antennaClicks}/3)
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playClick(1.2);
            onToggleTheme?.();
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-2 border-pink-300 dark:border-sky-400 hover:bg-pink-50 transition shadow-sm"
        >
          {isNight ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              Day Sky Mode
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-sky-600" />
              Night Sky Mode
            </>
          )}
        </button>
      </div>
    </div>
  );
}
