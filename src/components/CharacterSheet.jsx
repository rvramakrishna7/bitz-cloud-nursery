"use client";

import React, { useState } from "react";
import { Sparkles, BadgeCheck, Feather, Compass, BookOpen, Quote, Volume2 } from "lucide-react";
import { BITZ_CHARACTER_SHEET } from "@/lib/characterData";
import { soundEngine } from "@/lib/soundEngine";

export default function CharacterSheet() {
  const [activeCard, setActiveCard] = useState(null);

  const points = [
    {
      num: "01",
      label: "1. Name",
      stamp: "Identity #01",
      value: `${BITZ_CHARACTER_SHEET.name} (${BITZ_CHARACTER_SHEET.title})`,
      icon: BadgeCheck,
      emoji: "🎀",
    },
    {
      num: "02",
      label: "2. What they are",
      stamp: "Species #02",
      value: `${BITZ_CHARACTER_SHEET.species} — ${BITZ_CHARACTER_SHEET.whatTheyAre}`,
      icon: Feather,
      emoji: "☁️",
    },
    {
      num: "03",
      label: "3. What they do",
      stamp: "Craft #03",
      value: BITZ_CHARACTER_SHEET.whatTheyDo,
      icon: Compass,
      emoji: "🌈",
    },
    {
      num: "04",
      label: "4. Their story",
      stamp: "Origin #04",
      value: BITZ_CHARACTER_SHEET.theirStory,
      icon: BookOpen,
      emoji: "🌙",
    },
    {
      num: "05",
      label: "5. Tagline",
      stamp: "Catchphrase #05",
      value: BITZ_CHARACTER_SHEET.tagline,
      icon: Quote,
      emoji: "✨",
      isTagline: true,
    },
  ];

  const handleCardTap = (idx) => {
    setActiveCard(idx);
    soundEngine.playCardChord(idx);
    setTimeout(() => {
      setActiveCard((curr) => (curr === idx ? null : curr));
    }, 900);
  };

  const handlePlayAllCards = () => {
    points.forEach((_, idx) => {
      setTimeout(() => {
        setActiveCard(idx);
        soundEngine.playCardChord(idx);
        if (idx === points.length - 1) {
          setTimeout(() => setActiveCard(null), 900);
        }
      }, idx * 340);
    });
  };

  return (
    <section
      id="character-sheet"
      aria-labelledby="character-sheet-heading"
      className="py-10 sm:py-14 px-4 max-w-6xl mx-auto"
    >
      <div className="rounded-3xl glass-panel border-2 border-pink-200 dark:border-slate-700 p-6 sm:p-9 relative">
        {/* Clean Header Row with Musical Chime Trigger */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b-2 border-pink-100 dark:border-slate-700">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300 font-bold border border-pink-300 whitespace-nowrap">
              <Sparkles className="w-3.5 h-3.5 text-pink-500 shrink-0" />
              <span>🎀 Step 3 · Official 5-Point Baby Collector Passport</span>
            </span>
            <h2
              id="character-sheet-heading"
              className="mt-2.5 text-2xl sm:text-3xl font-bold text-espresso font-display"
            >
              Meet Bitz — Baby Cloud-Sprite Passport
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-muted">
              Tap any collector card below to hear its unique harmonic cloud chord!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handlePlayAllCards}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white border-2 border-pink-600 shadow-sm transition whitespace-nowrap"
            >
              <Volume2 className="w-3.5 h-3.5 shrink-0" />
              <span>🎶 Play All 5 Card Chimes</span>
            </button>

            <div className="text-left sm:text-right font-mono text-xs bg-sky-100 dark:bg-slate-800 border-2 border-sky-300 dark:border-sky-600 px-4 py-2 rounded-2xl whitespace-nowrap">
              <div className="text-sky-900 dark:text-sky-200 font-semibold text-[10px]">
                NURSERY BIRTH PASSPORT
              </div>
              <div className="font-bold text-pink-600 dark:text-pink-300">
                {BITZ_CHARACTER_SHEET.registrationRef}
              </div>
            </div>
          </div>
        </div>

        {/* 5 Interactive Musical Collector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mt-6">
          {points.map((item, idx) => {
            const Icon = item.icon;
            const isSelected = activeCard === idx;
            return (
              <div
                key={item.num}
                role="button"
                tabIndex={0}
                onClick={() => handleCardTap(idx)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCardTap(idx);
                  }
                }}
                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer select-none ${
                  isSelected
                    ? "scale-[1.02] border-pink-500 bg-pink-100/90 dark:bg-slate-800 shadow-md"
                    : item.isTagline
                    ? "md:col-span-2 bg-pink-50 dark:bg-slate-800/90 border-pink-300 dark:border-pink-500/40 hover:-translate-y-1"
                    : idx % 2 === 0
                    ? "bg-pink-50/65 dark:bg-slate-800/70 border-pink-200 dark:border-slate-700 hover:border-pink-400 hover:-translate-y-1"
                    : "bg-sky-50/75 dark:bg-slate-800/70 border-sky-200 dark:border-slate-700 hover:border-sky-400 hover:-translate-y-1"
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-xs font-mono uppercase tracking-wider text-pink-600 dark:text-pink-300 font-bold">
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                    <Icon className="w-4 h-4 text-sky-600 dark:text-sky-300 shrink-0" />
                    <span>{item.label}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] bg-white/90 dark:bg-slate-900 border border-pink-200 dark:border-slate-600 text-espresso whitespace-nowrap">
                    <span>{item.emoji}</span>
                    <span>{isSelected ? "♪ Chime!" : item.stamp}</span>
                  </span>
                </div>
                <p
                  className={`mt-3 text-sm sm:text-base leading-relaxed ${
                    item.isTagline
                      ? "font-serif italic text-lg sm:text-xl text-pink-600 dark:text-pink-300 font-semibold"
                      : "text-espresso"
                  }`}
                >
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* 4 Cute Baby Traits Badges (Single-Line Labels) */}
        <div className="mt-6 pt-6 border-t-2 border-pink-100 dark:border-slate-700 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {BITZ_CHARACTER_SHEET.traits.map((trait, idx) => (
            <div
              key={trait.label}
              onClick={() => soundEngine.playCardChord(idx)}
              className={`px-4 py-3 rounded-2xl border-2 cursor-pointer transition hover:-translate-y-0.5 ${
                idx % 2 === 0
                  ? "bg-pink-50/70 border-pink-200 dark:bg-slate-800 dark:border-slate-700"
                  : "bg-sky-50/70 border-sky-200 dark:bg-slate-800 dark:border-slate-700"
              }`}
            >
              <dt className="text-[11px] font-mono uppercase text-pink-600 dark:text-pink-300 font-bold whitespace-nowrap">
                {trait.label}
              </dt>
              <dd className="text-xs sm:text-sm font-semibold text-espresso mt-1">
                {trait.value}
              </dd>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
