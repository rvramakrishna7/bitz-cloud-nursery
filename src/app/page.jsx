"use client";

import React, { useState, useEffect } from "react";
import { Compass, BookOpen, Sparkles, CloudRain, Heart } from "lucide-react";
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
    <div id="top" className="min-h-screen flex flex-col relative overflow-x-hidden pb-20">
      <SparkleTrail enabled={sparkleEnabled} />

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
        {/* UNCLUTTERED, 100% CHARACTER-FOCUSED HERO SANCTUARY STAGE */}
        <section
          aria-labelledby="hero-title"
          className="pt-2 pb-10 sm:pb-14 px-4 max-w-5xl mx-auto relative flex flex-col items-center"
        >
          {/* Compact, Airy Header Badge & Title */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-200 border-2 border-pink-300 shadow-sm whitespace-nowrap">
              <Sparkles className="w-3.5 h-3.5 text-pink-500 shrink-0" />
              <span>☁️ Cloud-Loft Nursery · 0.4-Marshmallow Cumulus Hatchling</span>
            </div>

            <h1
              id="hero-title"
              className="text-3xl sm:text-5xl font-bold text-espresso font-display leading-tight tracking-tight"
            >
              Meet{" "}
              <span className="text-pink-500 underline decoration-sky-400 decoration-wavy underline-offset-8">
                Bitz
              </span>
              , The Baby Cloud-Sprite.
            </h1>

            <p className="font-serif italic text-base sm:text-lg text-sky-700 dark:text-sky-300 font-semibold">
              {BITZ_CHARACTER_SHEET.tagline}
            </p>
          </div>

          {/* 100% Full-Spotlight Centerpiece: Bitz + Sky Buddies + Single-Line Controls */}
          <div className="w-full mt-2 flex items-center justify-center">
            <BitzCharacter
              theme={theme}
              onToggleTheme={handleToggleTheme}
              onEasterEggTriggered={handleEasterEggUnlocked}
              easterEggUnlocked={easterEggUnlocked}
            />
          </div>

          {/* Clean Single-Row Quick Jump Pills Beneath Bitz */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#projects-showcase"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-white/90 hover:bg-pink-50 dark:bg-slate-800 text-pink-700 dark:text-pink-200 border-2 border-pink-200 dark:border-slate-700 shadow-sm transition whitespace-nowrap"
            >
              <Compass className="w-3.5 h-3.5 text-pink-500 shrink-0" />
              <span>Explore 4 Interactive Weather Toys ↓</span>
            </a>

            <a
              href="#origin-story"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-white/90 hover:bg-sky-50 dark:bg-slate-800 text-sky-900 dark:text-sky-200 border-2 border-sky-200 dark:border-slate-700 shadow-sm transition whitespace-nowrap"
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>Read Bedtime Origin Story ↓</span>
            </a>
          </div>
        </section>

        <CharacterSheet />
        <ProjectsShowcase />
        <OriginStoryScroll />
        <NurserySideQuests />
      </main>

      <CreditsFooter
        sparkleEnabled={sparkleEnabled}
        onToggleSparkle={() => setSparkleEnabled((s) => !s)}
        easterEggUnlocked={easterEggUnlocked}
      />
    </div>
  );
}
