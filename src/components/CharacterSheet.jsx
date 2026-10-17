"use client";

import React from "react";
import { Sparkles, BadgeCheck, Feather, Compass, BookOpen, Quote } from "lucide-react";
import { BITZ_CHARACTER_SHEET } from "@/lib/characterData";
import { soundEngine } from "@/lib/soundEngine";

export default function CharacterSheet() {
  const points = [
    {
      num: "01",
      label: "1. Name",
      value: `${BITZ_CHARACTER_SHEET.name} (${BITZ_CHARACTER_SHEET.title})`,
      icon: BadgeCheck,
      emoji: "🎀",
    },
    {
      num: "02",
      label: "2. What they are",
      value: `${BITZ_CHARACTER_SHEET.species} — ${BITZ_CHARACTER_SHEET.whatTheyAre}`,
      icon: Feather,
      emoji: "☁️",
    },
    {
      num: "03",
      label: "3. What they do",
      value: BITZ_CHARACTER_SHEET.whatTheyDo,
      icon: Compass,
      emoji: "🌈",
    },
    {
      num: "04",
      label: "4. Their story",
      value: BITZ_CHARACTER_SHEET.theirStory,
      icon: BookOpen,
      emoji: "🌙",
    },
    {
      num: "05",
      label: "5. Tagline",
      value: BITZ_CHARACTER_SHEET.tagline,
      icon: Quote,
      emoji: "✨",
      isTagline: true,
    },
  ];

  return (
    <section
      id="character-sheet"
      aria-labelledby="character-sheet-heading"
      className="py-12 sm:py-16 px-4 max-w-6xl mx-auto"
    >
      <div className="rounded-3xl glass-panel border-2 border-pink-200 dark:border-slate-700 p-6 sm:p-10 relative">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b-2 border-pink-100 dark:border-slate-700">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300 font-bold border border-pink-300">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              🎀 Cloud-Loft Nursery · Baby Collector Passport
            </span>
            <h2
              id="character-sheet-heading"
              className="mt-2.5 text-2xl sm:text-3xl font-bold text-espresso font-display"
            >
              Meet Bitz — Baby Cloud-Sprite Passport
            </h2>
          </div>

          <div className="text-left sm:text-right font-mono text-xs bg-sky-100 dark:bg-slate-800 border-2 border-sky-300 dark:border-sky-600 px-4 py-2.5 rounded-2xl">
            <div className="text-sky-900 dark:text-sky-200 font-semibold">NURSERY BIRTH PASSPORT</div>
            <div className="font-bold text-pink-600 dark:text-pink-300 mt-0.5">
              {BITZ_CHARACTER_SHEET.registrationRef}
            </div>
            <div className="text-[11px] text-sky-800 dark:text-slate-300">100% Original Baby Character</div>
          </div>
        </div>

        {/* 3-Column Cute Pastel Collector Cards (Distinct from hax.baby's stacked list!) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mt-6">
          {points.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.num}
                onClick={() => soundEngine.playClick(1.05)}
                className={`p-5 rounded-3xl border-2 transition cursor-pointer hover:-translate-y-1 ${
                  item.isTagline
                    ? "md:col-span-2 bg-pink-50 dark:bg-slate-800/90 border-pink-300 dark:border-pink-500/40"
                    : idx % 2 === 0
                    ? "bg-pink-50/65 dark:bg-slate-800/70 border-pink-200 dark:border-slate-700 hover:border-pink-400"
                    : "bg-sky-50/75 dark:bg-slate-800/70 border-sky-200 dark:border-slate-700 hover:border-sky-400"
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-xs font-mono uppercase tracking-wider text-pink-600 dark:text-pink-300 font-bold">
                  <span className="inline-flex items-center gap-1.5">
                    <Icon className="w-4 h-4 text-sky-600 dark:text-sky-300" />
                    {item.label}
                  </span>
                  <span className="text-base">{item.emoji}</span>
                </div>
                <p
                  className={`mt-2.5 text-sm sm:text-base leading-relaxed ${
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

        {/* Cute Baby Traits Badges */}
        <div className="mt-6 pt-6 border-t-2 border-pink-100 dark:border-slate-700 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {BITZ_CHARACTER_SHEET.traits.map((trait, idx) => (
            <div
              key={trait.label}
              className={`px-4 py-3 rounded-2xl border-2 ${
                idx % 2 === 0
                  ? "bg-pink-50/70 border-pink-200 dark:bg-slate-800 dark:border-slate-700"
                  : "bg-sky-50/70 border-sky-200 dark:bg-slate-800 dark:border-slate-700"
              }`}
            >
              <dt className="text-[11px] font-mono uppercase text-pink-600 dark:text-pink-300 font-bold">
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
