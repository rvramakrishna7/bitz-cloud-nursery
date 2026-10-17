"use client";

import React from "react";
import { BadgeCheck, Feather, Compass, BookOpen, Quote, Sparkles } from "lucide-react";
import { BITZ_CHARACTER_SHEET } from "@/lib/characterData";
import { soundEngine } from "@/lib/soundEngine";

export default function CharacterSheet() {
  const points = [
    {
      num: "01",
      label: "1. Name",
      value: `${BITZ_CHARACTER_SHEET.name} (${BITZ_CHARACTER_SHEET.title})`,
      icon: BadgeCheck,
      bg: "bg-pink-100 dark:bg-slate-800",
      shadow: "shadow-[4px_4px_0px_#f472b6]",
    },
    {
      num: "02",
      label: "2. What they are",
      value: `${BITZ_CHARACTER_SHEET.species} — ${BITZ_CHARACTER_SHEET.whatTheyAre}`,
      icon: Feather,
      bg: "bg-sky-100 dark:bg-slate-800",
      shadow: "shadow-[4px_4px_0px_#38bdf8]",
    },
    {
      num: "03",
      label: "3. What they do",
      value: BITZ_CHARACTER_SHEET.whatTheyDo,
      icon: Compass,
      bg: "bg-pink-100 dark:bg-slate-800",
      shadow: "shadow-[4px_4px_0px_#f472b6]",
    },
    {
      num: "04",
      label: "4. Their story",
      value: BITZ_CHARACTER_SHEET.theirStory,
      icon: BookOpen,
      bg: "bg-sky-100 dark:bg-slate-800",
      shadow: "shadow-[4px_4px_0px_#38bdf8]",
    },
    {
      num: "05",
      label: "5. Tagline",
      value: BITZ_CHARACTER_SHEET.tagline,
      icon: Quote,
      isTagline: true,
      bg: "bg-amber-100 dark:bg-slate-800",
      shadow: "shadow-[4px_4px_0px_#f59e0b]",
    },
  ];

  return (
    <section
      id="character-sheet"
      aria-labelledby="character-sheet-heading"
      className="py-10 sm:py-14 px-4 max-w-6xl mx-auto"
    >
      {/* 90s Pastel Cloud-OS Window Frame */}
      <div className="retro-window overflow-hidden">
        {/* 90s OS Title Bar */}
        <div className="bg-pink-300 dark:bg-pink-900 border-b-2 border-slate-900 dark:border-sky-300 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-900 inline-block" />
            <span className="w-3.5 h-3.5 rounded-full bg-sky-300 border-2 border-slate-900 inline-block" />
            <span className="w-3.5 h-3.5 rounded-full bg-amber-300 border-2 border-slate-900 inline-block" />
            <span className="ml-2 font-mono text-xs font-extrabold text-slate-900 dark:text-white tracking-wide">
              ☁️ BITZ_COLLECTOR_DOSSIER.EXE
            </span>
          </div>

          <div className="font-mono text-xs font-bold bg-white dark:bg-slate-900 text-slate-900 dark:text-sky-300 px-3 py-0.5 rounded-md border-2 border-slate-900 dark:border-sky-400">
            PASSPORT ID: {BITZ_CHARACTER_SHEET.registrationRef}
          </div>
        </div>

        {/* Window Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Top Collector Header + Tamagotchi Live Stat Bars */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-6 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-200 text-slate-900 border-2 border-slate-900 font-mono text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-pink-600" />
                90s Collector Trading Card #001
              </div>
              <h2
                id="character-sheet-heading"
                className="text-2xl sm:text-3xl font-bold text-espresso font-display"
              >
                Cloud-Sprite Collector Dossier
              </h2>
              <p className="text-xs sm:text-sm text-muted">
                Click any collector sticker below to hear Bitz&apos;s toybox chime!
              </p>
            </div>

            {/* 90s Tamagotchi Status Meter Bars */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-3 p-4 rounded-2xl bg-sky-50 dark:bg-slate-800/90 border-2 border-slate-900 dark:border-sky-400">
              {BITZ_CHARACTER_SHEET.traits.map((trait, idx) => (
                <div
                  key={trait.label}
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-700"
                >
                  <div className="text-[10px] font-mono uppercase font-extrabold text-pink-600 dark:text-pink-300">
                    {trait.label}
                  </div>
                  <div className="text-xs font-bold text-espresso mt-0.5">
                    {trait.value}
                  </div>
                  {/* Retro 90s Pixel Progress Bar */}
                  <div className="mt-1.5 h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-sm overflow-hidden border border-slate-900">
                    <div
                      className={`h-full ${
                        idx % 2 === 0 ? "bg-pink-400" : "bg-sky-400"
                      }`}
                      style={{ width: idx === 0 ? "96%" : idx === 1 ? "100%" : "92%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5 Collector Sticker Cards (3-Column + Full Ticket Layout — Zero hax.baby stacked list!) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {points.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.num}
                  onClick={() => soundEngine.playClick(1.08)}
                  className={`p-5 rounded-2xl border-2 border-slate-900 dark:border-sky-300 ${
                    item.bg
                  } ${
                    item.shadow
                  } hover:-translate-y-1 transition cursor-pointer flex flex-col justify-between ${
                    item.isTagline ? "md:col-span-2" : ""
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b-2 border-slate-900/15 dark:border-white/15">
                      <span className="inline-flex items-center gap-1.5 font-mono text-xs font-extrabold text-slate-900 dark:text-white">
                        <Icon className="w-4 h-4 text-pink-600 dark:text-pink-300" />
                        {item.label}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-900 font-mono text-[10px] font-bold text-slate-900 dark:text-sky-300">
                        #{item.num}
                      </span>
                    </div>
                    <p
                      className={`text-sm sm:text-base leading-relaxed ${
                        item.isTagline
                          ? "font-serif italic text-lg sm:text-xl text-pink-700 dark:text-pink-300 font-bold"
                          : "text-slate-900 dark:text-slate-100 font-medium"
                      }`}
                    >
                      {item.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
