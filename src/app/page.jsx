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

  const isNight = theme === "night";

  return (
    <div id="top" className="min-h-screen flex flex-col relative overflow-x-hidden pb-24">
      <SparkleTrail enabled={sparkleEnabled} />

      {/* LIVING DAY SKY vs. NIGHT SKY ATMOSPHERIC WORLD BACKDROP */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      >
        {!isNight ? (
          /* DAY SKY LIVING WORLD: Rotating Sunbeam Halo, Drifting Fluffy Clouds & Rainbow Bubbles */
          <>
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-gradient-to-br from-amber-200/45 via-pink-200/30 to-transparent blur-2xl animate-pulse" />
            <div className="absolute top-12 left-[6%] text-4xl sm:text-5xl opacity-55 animate-cloud-drift-1">
              ☁️
            </div>
            <div className="absolute top-28 right-[8%] text-3xl sm:text-5xl opacity-50 animate-cloud-drift-2">
              🌤️
            </div>
            <div className="absolute top-[46%] left-[4%] text-2xl sm:text-3xl opacity-45 animate-float-slow">
              🫧
            </div>
            <div className="absolute top-[55%] right-[5%] text-2xl sm:text-3xl opacity-45 animate-bounce">
              🌸
            </div>
            <div className="absolute bottom-24 left-[12%] text-3xl opacity-40 animate-cloud-drift-2">
              ☁️
            </div>
          </>
        ) : (
          /* NIGHT SKY LIVING WORLD: Aurora Borealis Ribbons, Streaking Shooting Stars & Fireflies */
          <>
            {/* Northern Lights Aurora Curtains */}
            <div className="absolute top-0 left-1/4 w-[65vw] h-64 bg-gradient-to-r from-pink-500/20 via-sky-400/25 to-emerald-300/20 blur-3xl rounded-full animate-pulse" />
            <div className="absolute top-20 right-1/4 w-[50vw] h-52 bg-gradient-to-r from-indigo-500/25 via-pink-400/20 to-sky-400/20 blur-3xl rounded-full animate-float-slow" />

            {/* Streaking Shooting Stars */}
            <div className="absolute top-16 right-[15%] w-28 h-1 bg-gradient-to-l from-transparent via-amber-200 to-white rounded-full shadow-[0_0_12px_#fde68a] animate-shooting-star-1" />
            <div className="absolute top-36 right-[42%] w-24 h-1 bg-gradient-to-l from-transparent via-pink-300 to-white rounded-full shadow-[0_0_12px_#f9a8d4] animate-shooting-star-2" />

            {/* Twinkling Constellations & Fireflies */}
            <div className="absolute top-16 left-[8%] text-2xl opacity-80 animate-twinkle">
              🌟
            </div>
            <div className="absolute top-32 right-[10%] text-3xl opacity-85 animate-float-slow">
              🪐
            </div>
            <div className="absolute top-[48%] left-[5%] text-xl opacity-75 animate-bounce">
              ✨
            </div>
            <div className="absolute top-[60%] right-[7%] text-2xl opacity-75 animate-twinkle">
              🏮
            </div>
          </>
        )}
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
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
          {/* 100% RESPONSIVE, CHARACTER-FOCUSED HERO SANCTUARY STAGE */}
          <section
            aria-labelledby="hero-title"
            className="pt-2 pb-8 sm:pb-12 px-3 sm:px-4 max-w-5xl mx-auto relative flex flex-col items-center"
          >
            {/* Responsive Header Badge & Title */}
            <div className="text-center max-w-2xl mx-auto space-y-2 px-1">
              <div className="inline-flex flex-wrap items-center justify-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-mono font-bold bg-pink-100 text-pink-700 dark:bg-pink-950/70 dark:text-pink-200 border-2 border-pink-300 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                <span>
                  {isNight
                    ? "🌙 Night Sky Aurora Sanctuary · Shooting Stars Active"
                    : "☀️ Day Sky Sunbeam Nursery · 0.4-Marshmallow Cloud Baby"}
                </span>
              </div>

              <h1
                id="hero-title"
                className="text-2xl sm:text-5xl font-bold text-espresso font-display leading-tight tracking-tight"
              >
                Meet{" "}
                <span className="text-pink-500 underline decoration-sky-400 decoration-wavy underline-offset-4 sm:underline-offset-8">
                  Mochi
                </span>
                , The Baby Cloud-Sprite.
              </h1>

              <p className="font-serif italic text-sm sm:text-lg text-sky-800 dark:text-sky-300 font-semibold px-2">
                {BITZ_CHARACTER_SHEET.tagline}
              </p>
            </div>

            {/* 100% Full-Spotlight Centerpiece: Mochi + Sky Buddies + Dress-Up Clothes */}
            <div className="w-full mt-2 flex items-center justify-center">
              <BitzCharacter
                theme={theme}
                onToggleTheme={handleToggleTheme}
                onEasterEggTriggered={handleEasterEggUnlocked}
                easterEggUnlocked={easterEggUnlocked}
              />
            </div>

            {/* Responsive Quick Jump Pills Beneath Mochi */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
              <a
                href="#projects-showcase"
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold bg-white/95 hover:bg-pink-50 dark:bg-slate-800 text-pink-700 dark:text-pink-200 border-2 border-pink-300 dark:border-slate-700 shadow-sm transition"
              >
                <Compass className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                <span>Play 4 Musical Toys ↓</span>
              </a>

              <a
                href="#origin-story"
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold bg-white/95 hover:bg-sky-50 dark:bg-slate-800 text-sky-900 dark:text-sky-200 border-2 border-sky-300 dark:border-slate-700 shadow-sm transition"
              >
                <BookOpen className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>Open 3D Pop-Up Storybook ↓</span>
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
    </div>
  );
}
