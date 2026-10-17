"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Sun, Moon, Zap, Heart, Music } from "lucide-react";
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
  const [moodReaction, setMoodReaction] = useState("happy"); // happy | giggle | sleepy | rainbow
  const [speechBubble, setSpeechBubble] = useState(
    "Hiya! Move your cursor or tap around—my eyes follow you! ✨"
  );

  useEffect(() => {
    const handlePointerMove = (clientX, clientY) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      const offset = calculatePupilOffset(center, { x: clientX, y: clientY }, 8);
      setPupilOffset(offset);
      const tilt = Math.max(-8, Math.min(8, (clientX - center.x) / 35));
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

  const handlePokeBelly = () => {
    soundEngine.playGiggle();
    setMoodReaction("giggle");
    const messages = [
      "Hehe! That tickles my cumulus fluff! ☁️💛",
      "*Puff!* You just shook loose two drops of golden sun-dew!",
      "Wheee! My marshmallow cheeks are blushing!",
      "Bzzzt! Careful, I'm full of cozy bedtime static!",
    ];
    setSpeechBubble(messages[Math.floor(Math.random() * messages.length)]);
    setTimeout(() => setMoodReaction("happy"), 1200);
  };

  const handleAntennaClick = (e) => {
    e.stopPropagation();
    const nextCount = antennaClicks + 1;
    setAntennaClicks(nextCount);

    if (nextCount >= 3) {
      soundEngine.playSecretLullaby();
      setMoodReaction("rainbow");
      setSpeechBubble(
        "🎉 SECRET EASTER EGG UNLOCKED! Rainbow Storm Overdrive! Every cloud is singing!"
      );
      if (typeof window !== "undefined") {
        try {
          confetti({
            particleCount: 85,
            spread: 80,
            origin: { y: 0.55 },
            colors: ["#a34063", "#ffccd8", "#f4b942", "#7bd3ae", "#82b1ff"],
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
        `⚡ *Ting!* Antenna charged (${nextCount}/3)... tap ${3 - nextCount} more time${
          3 - nextCount === 1 ? "" : "s"
        } for a secret surprise!`
      );
    }
  };

  const isNight = theme === "night";

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center select-none p-4"
      data-testid="bitz-character-stage"
    >
      {/* Interactive Speech Bubble */}
      <div
        aria-live="polite"
        className="mb-4 px-4 py-2.5 rounded-2xl border-2 border-[#a34063]/30 bg-card shadow-cozy text-center max-w-xs sm:max-w-sm transition-all duration-300"
      >
        <p className="text-xs sm:text-sm font-medium text-espresso leading-snug">
          {speechBubble}
        </p>
      </div>

      {/* Main SVG Character Illustration */}
      <div
        onClick={handlePokeBelly}
        role="button"
        tabIndex={0}
        aria-label="Poke Bitz the Baby Cloud-Sprite to make them giggle"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handlePokeBelly();
          }
        }}
        style={{
          transform: `rotate(${headTilt}deg)`,
          transition: "transform 0.15s ease-out",
        }}
        className="relative cursor-pointer group focus:outline-none"
      >
        {/* Ambient Aura Glow */}
        <div
          className={`absolute -inset-4 rounded-full blur-2xl transition-opacity duration-700 pointer-events-none ${
            moodReaction === "rainbow"
              ? "bg-gradient-to-r from-pink-400 via-amber-300 to-sky-400 opacity-60 animate-pulse"
              : isNight
              ? "bg-amber-400/25 opacity-80"
              : "bg-[#ffccd8]/60 opacity-75"
          }`}
        />

        <svg
          width="300"
          height="280"
          viewBox="0 0 300 280"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 w-[250px] h-[235px] sm:w-[300px] sm:h-[280px] drop-shadow-xl"
        >
          <defs>
            <radialGradient id="cloudBodyGrad" cx="50%" cy="42%" r="55%">
              <stop offset="0%" stopColor={isNight ? "#fffdf9" : "#ffffff"} />
              <stop offset="75%" stopColor={isNight ? "#f3e8ff" : "#fff5eb"} />
              <stop offset="100%" stopColor={isNight ? "#d8b4fe" : "#ffccd8"} />
            </radialGradient>
            <linearGradient id="rainbowArc" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff7aa2" />
              <stop offset="35%" stopColor="#f4b942" />
              <stop offset="70%" stopColor="#7bd3ae" />
              <stop offset="100%" stopColor="#82b1ff" />
            </linearGradient>
          </defs>

          {/* Secret Rainbow Halo when Easter Egg is unlocked */}
          {(easterEggUnlocked || moodReaction === "rainbow") && (
            <path
              d="M 55 150 A 95 95 0 0 1 245 150"
              stroke="url(#rainbowArc)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray="6 2"
              opacity="0.85"
            />
          )}

          {/* Floating Star Doodles around Bitz */}
          <circle cx="42" cy="82" r="4" fill="#f4b942" className="animate-ping" />
          <circle cx="262" cy="95" r="5" fill="#ff7aa2" />
          <circle cx="248" cy="52" r="3.5" fill="#7bd3ae" />

          {/* Interactive Brass Lightning-Rod Antenna (Easter Egg Trigger!) */}
          <g
            onClick={handleAntennaClick}
            data-testid="bitz-antenna-trigger"
            className="cursor-pointer hover:scale-110 transition-transform origin-bottom"
          >
            <title>Secret: Click Bitz&apos;s Brass Antenna 3 times!</title>
            {/* Invisible larger hit target for mobile touch accessibility */}
            <circle cx="150" cy="45" r="28" fill="transparent" />
            <path
              d="M150 92 L144 62 L156 58 L150 32"
              stroke="#d97706"
              strokeWidth="5.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Glowing Orb Tip */}
            <circle
              cx="150"
              cy="28"
              r="11"
              fill={moodReaction === "rainbow" ? "#ff7aa2" : "#f4b942"}
              stroke="#78350f"
              strokeWidth="2.5"
            />
            <circle cx="146" cy="24" r="3.5" fill="#ffffff" />
          </g>

          {/* Cozy Bedtime Nightcap / Cloud Beret Bow */}
          <g transform="translate(185, 68) rotate(14)">
            <ellipse cx="0" cy="0" rx="14" ry="9" fill="#a34063" />
            <ellipse cx="18" cy="2" rx="14" ry="9" fill="#a34063" />
            <circle cx="9" cy="1" r="5.5" fill="#f4b942" />
          </g>

          {/* Fluffy Cumulus Baby Body */}
          <path
            d="M78 198 C48 198 32 174 40 146 C32 122 52 96 78 96 C92 70 122 58 152 60 C184 58 214 74 224 100 C250 102 268 126 260 152 C268 178 248 200 220 198 Z"
            fill="url(#cloudBodyGrad)"
            stroke="#5c4033"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Cute Bottom Cloud Scallops & Tiny Feet */}
          <ellipse cx="112" cy="206" rx="16" ry="11" fill="#f4b942" stroke="#5c4033" strokeWidth="3.5" />
          <ellipse cx="188" cy="206" rx="16" ry="11" fill="#f4b942" stroke="#5c4033" strokeWidth="3.5" />

          {/* Rosy Rainbow-Blush Cheeks */}
          <ellipse
            cx="88"
            cy="152"
            rx="16"
            ry="9.5"
            fill={moodReaction === "giggle" ? "#ff4d88" : "#ff9ebb"}
            opacity="0.75"
          />
          <ellipse
            cx="212"
            cy="152"
            rx="16"
            ry="9.5"
            fill={moodReaction === "giggle" ? "#ff4d88" : "#ff9ebb"}
            opacity="0.75"
          />

          {/* Left Eye Socket */}
          <g transform="translate(112, 134)">
            <circle cx="0" cy="0" r="17" fill="#2d1b24" />
            {/* Moving Pupil + Amber Starlight Pinprick */}
            <g
              data-testid="bitz-left-pupil"
              transform={`translate(${pupilOffset.x}, ${pupilOffset.y})`}
            >
              <circle cx="0" cy="0" r="9.5" fill="#f4b942" />
              <circle cx="-3.5" cy="-4" r="4" fill="#ffffff" />
              <circle cx="4" cy="3.5" r="2" fill="#fff8f1" />
            </g>
          </g>

          {/* Right Eye Socket */}
          <g transform="translate(188, 134)">
            <circle cx="0" cy="0" r="17" fill="#2d1b24" />
            {/* Moving Pupil + Amber Starlight Pinprick */}
            <g
              data-testid="bitz-right-pupil"
              transform={`translate(${pupilOffset.x}, ${pupilOffset.y})`}
            >
              <circle cx="0" cy="0" r="9.5" fill="#f4b942" />
              <circle cx="-3.5" cy="-4" r="4" fill="#ffffff" />
              <circle cx="4" cy="3.5" r="2" fill="#fff8f1" />
            </g>
          </g>

          {/* Expressive Baby Mouth */}
          {moodReaction === "giggle" || moodReaction === "rainbow" ? (
            <path
              d="M 136 150 Q 150 168 164 150 Z"
              fill="#a34063"
              stroke="#5c4033"
              strokeWidth="3"
            />
          ) : isNight ? (
            // Sleepy cozy 'o' mouth or gentle smile at night
            <path
              d="M 138 152 Q 150 160 162 152"
              stroke="#5c4033"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M 136 149 Q 150 162 164 148"
              stroke="#5c4033"
              strokeWidth="3.8"
              strokeLinecap="round"
            />
          )}

          {/* Tiny Waving Cloud Hands + Miniature Weather Lantern */}
          <circle
            cx="54"
            cy="158"
            r="13"
            fill="#ffffff"
            stroke="#5c4033"
            strokeWidth="3.5"
          />
          <circle
            cx="246"
            cy="158"
            r="13"
            fill="#ffffff"
            stroke="#5c4033"
            strokeWidth="3.5"
          />

          {/* Mini Nursery Apron Badge on Belly */}
          <rect
            x="126"
            y="172"
            width="48"
            height="22"
            rx="11"
            fill="#a34063"
            stroke="#5c4063"
            strokeWidth="2"
          />
          <text
            x="150"
            y="187"
            textAnchor="middle"
            fill="#fff8f1"
            fontSize="11"
            fontWeight="bold"
            fontFamily="monospace"
          >
            BITZ ♡
          </text>
        </svg>
      </div>

      {/* Interactive Micro-Controls Under Bitz */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-2.5">
        <button
          type="button"
          onClick={handlePokeBelly}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-[#a34063] text-[#fff8f1] hover:opacity-95 active:translate-y-0.5 transition shadow-sm"
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
          Tickle Cloud Belly
        </button>

        <button
          type="button"
          onClick={handleAntennaClick}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border-2 border-[#a34063]/30 bg-card text-espresso hover:border-[#a34063] active:translate-y-0.5 transition"
        >
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          Tap Brass Antenna ({antennaClicks}/3)
        </button>

        <button
          type="button"
          onClick={() => {
            soundEngine.playClick(1.2);
            onToggleTheme?.();
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border-2 border-[#a34063]/30 bg-card text-espresso hover:border-[#a34063] transition"
        >
          {isNight ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              Switch to Sunbeam Day
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-[#a34063]" />
              Switch to Starlight Night
            </>
          )}
        </button>
      </div>
    </div>
  );
}
