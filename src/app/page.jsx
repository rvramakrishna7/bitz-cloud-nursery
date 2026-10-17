"use client";

import React, { useState, useEffect } from "react";
import { Compass, BookOpen, Sparkles } from "lucide-react";
import TopNavBar from "@/components/TopNavBar";
import BitzCharacter from "@/components/BitzCharacter";
import CharacterSheet from "@/components/CharacterSheet";
import ProjectsShowcase from "@/components/ProjectsShowcase";
import OriginStoryScroll from "@/components/OriginStoryScroll";
import NurserySideQuests from "@/components/NurserySideQuests";
import SparkleTrail from "@/components/SparkleTrail";
import CreditsFooter from "@/components/CreditsFooter";
import { BITZ_CHARACTER_SHEET } from "@/lib/characterData";
import { soundEngine } from "@/lib/soundEngine";

export default function HomePage() {
  const [muted, setMuted] = useState(false);
  const [theme, setTheme] = useState("day"); // day | night
  const [chaosMode, setChaosMode] = useState(false);
  const [sparkleEnabled, setSparkleEnabled] = useState(true);
  const [easterEggUnlocked, setEasterEggUnlocked] = useState(false);
  const [visitCount, setVisitCount] = useState(1);

  useEffect(() => {
    const initialMuted = soundEngine.loadSavedMuteState();
    setMuted(initialMuted);

    try {
      const prevVisits = Number(window.localStorage.getItem("bitz_visit_count") || "0");
      const nextVisits = prevVisits + 1;
      window.localStorage.setItem("bitz_visit_count", String(nextVisits));
      setVisitCount(nextVisits);

      const savedEgg = window.localStorage.getItem("bitz_easter_egg") === "true";
      if (savedEgg) setEasterEggUnlocked(true);
    } catch (e) {}

    const handleGlobalClick = (e) => {
      const target = e.target;
      if (target && target.closest && target.closest("button, a, input, select")) {
        soundEngine.playClick(1);
      }
    };

    window.addEventListener("click", handleGlobalClick, { passive: true });
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
      if (theme === "night") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      document.body.setAttribute("data-chaos", String(chaosMode));
    }
  }, [theme, chaosMode]);

  const handleToggleMute = () => {
    const nextMuted = soundEngine.setMuted(!muted);
    setMuted(nextMuted);
    if (!nextMuted) {
      soundEngine.playClick(1.25);
    }
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "day" ? "night" : "day"));
  };

  const handleEasterEggUnlocked = () => {
    setEasterEggUnlocked(true);
    try {
      window.localStorage.setItem("bitz_easter_egg", "true");
    } catch (e) {}
  };

  return (
    <div id="top" className="min-h-screen flex flex-col relative">
      {/* Side Quest (+2 pts): Retro Sparkle Cursor Trail */}
      <SparkleTrail enabled={sparkleEnabled} />

      {/* Sticky Accessible Top Bar */}
      <TopNavBar
        muted={muted}
        onToggleMute={handleToggleMute}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        chaosMode={chaosMode}
        onToggleChaosMode={() => setChaosMode((c) => !c)}
        visitCount={visitCount}
      />

      <main className="flex-1">
        {/* SECTION 01 & 05.1: HERO INTRO ("MEET THE BABY") */}
        <section
          aria-labelledby="hero-title"
          className="pt-8 pb-12 sm:py-16 px-4 max-w-6xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Editorial Intro & Pillars */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <span className="px-3.5 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-gradient-to-r from-indigo-600 to-sky-500 text-white font-bold shadow-sm">
                  Track 2 · Your Own Baby
                </span>
                <span className="px-3.5 py-1 rounded-full text-xs font-mono bg-indigo-500/10 text-indigo-700 dark:text-sky-300 border border-indigo-500/20 font-semibold">
                  <Sparkles className="w-3 h-3 inline mr-1 text-amber-500" />
                  3D Plushie + Live WebGL Stage
                </span>
              </div>

              <h1
                id="hero-title"
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-espresso font-display leading-[1.08] tracking-tight"
              >
                Meet{" "}
                <span className="bg-gradient-to-r from-indigo-600 via-sky-500 to-amber-500 bg-clip-text text-transparent">
                  Bitz
                </span>
                , The Baby Cloud-Sprite.
              </h1>

              <p className="font-serif italic text-lg sm:text-xl text-indigo-600 dark:text-sky-300 font-semibold">
                {BITZ_CHARACTER_SHEET.tagline}
              </p>

              <p className="text-sm sm:text-base text-espresso/85 leading-relaxed max-w-xl mx-auto lg:mx-0">
                {BITZ_CHARACTER_SHEET.whatTheyAre} Working as{" "}
                <strong>{BITZ_CHARACTER_SHEET.title}</strong>, Bitz turns noisy
                nighttime thunder into soothing raindrop lullabies, glowing aurora jars,
                and origami dream boats.
              </p>

              {/* Quick Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <a
                  href="#projects-showcase"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold bg-gradient-to-r from-indigo-600 to-sky-500 text-white shadow-lg hover:opacity-95 transition"
                >
                  <Compass className="w-4 h-4" />
                  Play With Bitz&apos;s 4 Creations
                </a>

                <a
                  href="#origin-story"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold border border-indigo-500/30 glass-panel text-espresso hover:border-indigo-500 transition"
                >
                  <BookOpen className="w-4 h-4 text-indigo-500" />
                  Read Bedtime Origin Story
                </a>
              </div>

              {/* 3 Core Challenge Pillars Summary Bar */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                <div className="p-4 rounded-2xl glass-panel">
                  <div className="text-[11px] font-mono uppercase text-indigo-600 dark:text-sky-300 font-bold">
                    01 · What Bitz Is
                  </div>
                  <div className="text-xs font-semibold text-espresso mt-1">
                    0.4-Marshmallow Cumulus Sprite with Star-Bell Cap
                  </div>
                </div>
                <div className="p-4 rounded-2xl glass-panel">
                  <div className="text-[11px] font-mono uppercase text-indigo-600 dark:text-sky-300 font-bold">
                    02 · What Bitz Does
                  </div>
                  <div className="text-xs font-semibold text-espresso mt-1">
                    Weaves Raindrop Lullabies & Bottled Auroras
                  </div>
                </div>
                <div className="p-4 rounded-2xl glass-panel">
                  <div className="text-[11px] font-mono uppercase text-indigo-600 dark:text-sky-300 font-bold">
                    03 · Bitz&apos;s Story
                  </div>
                  <div className="text-xs font-semibold text-espresso mt-1">
                    Born in a Copper Weathervane at 04:17 AM
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Living 3D Plushie + WebGL Character Stage */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl glass-panel p-4 sm:p-6">
                <BitzCharacter
                  theme={theme}
                  onToggleTheme={handleToggleTheme}
                  onEasterEggTriggered={handleEasterEggUnlocked}
                  easterEggUnlocked={easterEggUnlocked}
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 04: MANDATORY 5-POINT TRACK 2 CHARACTER SHEET */}
        <CharacterSheet />

        {/* SECTION 05.2 & TIER 2: 4 INTERACTIVE SHOWCASE CREATIONS */}
        <ProjectsShowcase />

        {/* SECTION 05.3: INTERACTIVE SCROLL & FLIPBOOK ORIGIN STORY (<60 WORDS/SCENE) */}
        <OriginStoryScroll />

        {/* SECTION 07 & TIER 3: BONUS SIDE QUESTS (+13 PTS) & CHARACTER CHAT */}
        <NurserySideQuests />
      </main>

      {/* SECTION 09 & 10: MANDATORY VISIBLE CREDITS & ATTRIBUTIONS FOOTER */}
      <CreditsFooter
        sparkleEnabled={sparkleEnabled}
        onToggleSparkle={() => setSparkleEnabled((s) => !s)}
        easterEggUnlocked={easterEggUnlocked}
      />
    </div>
  );
}
