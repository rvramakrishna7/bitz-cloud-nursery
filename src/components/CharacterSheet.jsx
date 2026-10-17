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
    },
    {
      num: "02",
      label: "2. What they are",
      value: `${BITZ_CHARACTER_SHEET.species} — ${BITZ_CHARACTER_SHEET.whatTheyAre}`,
      icon: Feather,
    },
    {
      num: "03",
      label: "3. What they do",
      value: BITZ_CHARACTER_SHEET.whatTheyDo,
      icon: Compass,
    },
    {
      num: "04",
      label: "4. Their story",
      value: BITZ_CHARACTER_SHEET.theirStory,
      icon: BookOpen,
    },
    {
      num: "05",
      label: "5. Tagline",
      value: BITZ_CHARACTER_SHEET.tagline,
      icon: Quote,
      isTagline: true,
    },
  ];

  return (
    <section
      id="character-sheet"
      aria-labelledby="character-sheet-heading"
      className="py-12 sm:py-16 px-4 max-w-6xl mx-auto"
    >
      <div className="rounded-3xl border-2 border-[#a34063]/25 bg-card p-6 sm:p-10 shadow-cozy relative overflow-hidden">
        {/* Top Passport Stamp Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#a34063]/15">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-[#a34063]/10 text-[#a34063] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Section 04 · Official Track 2 Character Sheet
            </span>
            <h2
              id="character-sheet-heading"
              className="mt-2 text-2xl sm:text-3xl font-bold text-espresso font-display"
            >
              Sky-Loft Nursery Identity Passport
            </h2>
          </div>

          <div className="text-left sm:text-right font-mono text-xs bg-[#a34063]/5 border border-[#a34063]/20 px-4 py-2.5 rounded-2xl">
            <div className="text-muted">OFFICIAL BUILDER PASSPORT</div>
            <div className="font-bold text-[#a34063] mt-0.5">
              {BITZ_CHARACTER_SHEET.registrationRef}
            </div>
            <div className="text-[11px] text-muted">100% Original Track 2 Creation</div>
          </div>
        </div>

        {/* 5-Point Mandatory Character Sheet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mt-6">
          {points.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.num}
                onClick={() => soundEngine.playClick(1.05)}
                className={`p-5 rounded-2xl border border-[#a34063]/20 bg-cream/60 hover:border-[#a34063] transition cursor-pointer ${
                  item.isTagline ? "md:col-span-2 bg-[#a34063]/5" : ""
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#a34063] font-bold">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                <p
                  className={`mt-2 text-sm sm:text-base leading-relaxed ${
                    item.isTagline
                      ? "font-serif italic text-lg sm:text-xl text-[#a34063] font-semibold"
                      : "text-espresso"
                  }`}
                >
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Fun Nursery Vital Stats Strip */}
        <div className="mt-6 pt-6 border-t border-[#a34063]/15 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {BITZ_CHARACTER_SHEET.traits.map((trait) => (
            <div
              key={trait.label}
              className="px-4 py-3 rounded-xl bg-cream border border-[#a34063]/15"
            >
              <dt className="text-[11px] font-mono uppercase text-muted">
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
