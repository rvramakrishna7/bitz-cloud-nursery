"use client";

import React, { useState } from "react";
import { Sparkles, Volume2, Music } from "lucide-react";
import { BITZ_CHARACTER_SHEET } from "@/lib/characterData";
import { soundEngine } from "@/lib/soundEngine";

export default function CharacterSheet() {
  const [activeCharm, setActiveCharm] = useState(null);

  const charms = [
    {
      num: "01",
      label: "1. Name",
      songName: "🎵 Twinkle Little Star",
      value: `${BITZ_CHARACTER_SHEET.name} (${BITZ_CHARACTER_SHEET.title})`,
      emoji: "🎀",
      stringHeight: "h-8 sm:h-12",
      swayClass: "animate-mobile-sway",
      bubbleBg: "bg-pink-100/95 dark:bg-slate-800 border-pink-300",
    },
    {
      num: "02",
      label: "2. What they are",
      songName: "🎵 Brahms' Lullaby",
      value: `${BITZ_CHARACTER_SHEET.species} — ${BITZ_CHARACTER_SHEET.whatTheyAre}`,
      emoji: "☁️",
      stringHeight: "h-14 sm:h-20",
      swayClass: "animate-mobile-sway-alt",
      bubbleBg: "bg-sky-100/95 dark:bg-slate-800 border-sky-300",
    },
    {
      num: "03",
      label: "3. What they do",
      songName: "🎵 Beethoven's Für Elise",
      value: BITZ_CHARACTER_SHEET.whatTheyDo,
      emoji: "🌈",
      stringHeight: "h-6 sm:h-10",
      swayClass: "animate-mobile-sway",
      bubbleBg: "bg-amber-50/95 dark:bg-slate-800 border-amber-300",
    },
    {
      num: "04",
      label: "4. Their story",
      songName: "🎵 1773 Mozart Motif",
      value: BITZ_CHARACTER_SHEET.theirStory,
      emoji: "🌙",
      stringHeight: "h-12 sm:h-16",
      swayClass: "animate-mobile-sway-alt",
      bubbleBg: "bg-sky-100/95 dark:bg-slate-800 border-sky-300",
    },
    {
      num: "05",
      label: "5. Tagline",
      songName: "🎵 Ode to Joy",
      value: BITZ_CHARACTER_SHEET.tagline,
      emoji: "✨",
      stringHeight: "h-8 sm:h-14",
      swayClass: "animate-mobile-sway",
      bubbleBg: "bg-pink-100/95 dark:bg-slate-800 border-pink-300",
      isTagline: true,
    },
  ];

  const handleCharmClick = (idx) => {
    setActiveCharm(idx);
    soundEngine.playCardChord(idx);
    setTimeout(() => {
      setActiveCharm((curr) => (curr === idx ? null : curr));
    }, 1800);
  };

  return (
    <section
      id="character-sheet"
      aria-labelledby="character-sheet-heading"
      className="py-12 sm:py-16 px-3 sm:px-6 max-w-6xl mx-auto relative overflow-hidden"
    >
      {/* Floating Sky Header (No Boxy Container!) */}
      <div className="text-center max-w-2xl mx-auto mb-4">
        <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-pink-100 text-pink-700 dark:bg-pink-950/70 dark:text-pink-200 border-2 border-pink-300 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-pink-500 shrink-0" />
          <span>🎀 Interactive Baby Crib Mobile · Passport #{BITZ_CHARACTER_SHEET.registrationRef}</span>
        </div>

        <h2
          id="character-sheet-heading"
          className="mt-3 text-3xl sm:text-4xl font-bold text-espresso font-display"
        >
          Mochi&apos;s Floating Musical Crib Mobile
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-muted">
          No boring cards! Tap any swaying cloud-charm hanging from Mochi&apos;s crib mobile
          to make it spin and play a famous 8-note nursery melody!
        </p>

        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={() => handleCharmClick((activeCharm !== null ? activeCharm + 1 : 0) % 5)}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white border-2 border-pink-600 shadow-sm transition active:scale-95"
          >
            <Volume2 className="w-4 h-4 shrink-0" />
            <span>🎶 Spin Mobile &amp; Play Next Melody</span>
          </button>
        </div>
      </div>

      {/* GIANT OVERHEAD RAINBOW CRIB MOBILE HANGER BAR */}
      <div className="relative max-w-5xl mx-auto pt-2">
        <svg
          viewBox="0 0 900 70"
          className="w-full h-12 sm:h-16 overflow-visible pointer-events-none"
          aria-hidden="true"
        >
          {/* Pastel Rainbow Arch Hanger */}
          <path
            d="M 40 60 Q 450 -25 860 60"
            fill="none"
            stroke="#f9a8d4"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M 40 66 Q 450 -19 860 66"
            fill="none"
            stroke="#7dd3fc"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <circle cx="450" cy="14" r="14" fill="#facc15" stroke="#ffffff" strokeWidth="3" />
          <text x="450" y="19" textAnchor="middle" fontSize="13" fill="#78350f">
            ★
          </text>
        </svg>

        {/* 5 SWAYING CLOUD-PUFF CHARMS HANGING ON GOLDEN STRINGS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-3 items-start -mt-3">
          {charms.map((item, idx) => {
            const isPlaying = activeCharm === idx;
            return (
              <div
                key={item.num}
                className={`flex flex-col items-center ${item.swayClass}`}
              >
                {/* Golden Hanging String + Star Bead */}
                <div className="hidden lg:flex flex-col items-center pointer-events-none">
                  <div className="w-3 h-3 rounded-full bg-amber-400 border-2 border-white shadow-sm" />
                  <div
                    className={`w-0.5 bg-amber-400 ${item.stringHeight} transition-all duration-500`}
                  />
                  <div className="w-3.5 h-3.5 rounded-full bg-pink-400 border-2 border-white shadow-sm -mb-1.5 z-10" />
                </div>

                {/* Cloud-Puff Shaped Hanging Charm */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => handleCharmClick(idx)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleCharmClick(idx);
                    }
                  }}
                  className={`w-full rounded-[38px] border-2 p-4 sm:p-5 text-center cursor-pointer select-none transition-all duration-300 relative shadow-md ${
                    item.bubbleBg
                  } ${
                    isPlaying
                      ? "scale-105 -rotate-2 ring-4 ring-pink-400/50 shadow-xl"
                      : "hover:scale-105 hover:-translate-y-1.5"
                  }`}
                >
                  {/* Floating Top Emoji Medallion */}
                  <div
                    className={`w-12 h-12 mx-auto -mt-8 mb-2 rounded-full bg-white dark:bg-slate-900 border-2 border-pink-300 shadow-sm flex items-center justify-center text-2xl transition-transform duration-300 ${
                      isPlaying ? "animate-bounce scale-110" : ""
                    }`}
                  >
                    {item.emoji}
                  </div>

                  {/* Mandatory Point Label */}
                  <div className="text-xs font-mono uppercase tracking-wider font-bold text-pink-600 dark:text-pink-300">
                    {item.label}
                  </div>

                  {/* Short, Cute, Punchy Description */}
                  <p
                    className={`mt-2 text-xs sm:text-sm leading-snug ${
                      item.isTagline
                        ? "font-serif italic text-base sm:text-lg text-pink-600 dark:text-pink-300 font-bold"
                        : "text-espresso font-medium"
                    }`}
                  >
                    {item.value}
                  </p>

                  {/* Musical Melody Pill inside each Charm */}
                  <div
                    className={`mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-mono font-bold transition ${
                      isPlaying
                        ? "bg-pink-500 text-white animate-pulse"
                        : "bg-white/90 dark:bg-slate-900 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-slate-700"
                    }`}
                  >
                    <Music className="w-3 h-3 shrink-0" />
                    <span>{isPlaying ? "♪ Playing Melody..." : item.songName}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4 BOUNCING CLOUD-BALLOON TRAIT PILLS */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {BITZ_CHARACTER_SHEET.traits.map((trait, idx) => (
          <button
            key={trait.label}
            type="button"
            onClick={() => handleCharmClick(idx)}
            className={`px-4 py-2.5 rounded-full border-2 shadow-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-2 text-left ${
              idx % 2 === 0
                ? "bg-white/95 dark:bg-slate-800 border-pink-300"
                : "bg-white/95 dark:bg-slate-800 border-sky-300"
            }`}
          >
            <span className="text-xl shrink-0">{trait.emoji}</span>
            <div>
              <span className="block text-[10px] font-mono uppercase font-bold text-pink-600 dark:text-pink-300">
                {trait.label}
              </span>
              <span className="block text-xs font-bold text-espresso">
                {trait.value}
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
