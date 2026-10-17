"use client";

import React, { useState, useEffect } from "react";
import { Compass, BookOpen, Sparkles, CloudRain, Music, Stars, Heart } from "lucide-react";
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
    <div id="top" className="min-h-screen flex flex-col relative overflow-x-hidden">
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
        {/* CENTERED INTERACTIVE SKY-SANCTUARY STAGE (Cute, Soft Pastel, Standout!) */}
        <section
          aria-labelledby="hero-title"
          className="pt-8 pb-12 sm:py-12 px-4 max-w-6xl mx-auto relative"
        >
          {/* Top Centered Editorial Title */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-200 border-2 border-pink-300 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              ☁️ Cloud-Loft Weather Nursery · Altitude 4,200 Marshmallows
            </div>

            <h1
              id="hero-title"
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-espresso font-display leading-tight tracking-tight"
            >
              Meet{" "}
              <span className="text-pink-500 underline decoration-sky-400 decoration-wavy underline-offset-8">
                Bitz
              </span>
              , The Baby Cloud-Sprite.
            </h1>

            <p className="font-serif italic text-lg sm:text-xl text-sky-700 dark:text-sky-300 font-semibold">
              {BITZ_CHARACTER_SHEET.tagline}
            </p>
          </div>

          {/* 3-Column Symmetric Stage: Left Cute Plush Card | Center Free-Floating Bitz | Right Cute Plush Card */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Cute Cloud Card */}
            <div className="lg:col-span-3 space-y-4 order-2 lg:order-1">
              <div className="p-5 rounded-3xl glass-panel border-2 border-sky-200 dark:border-slate-700 space-y-3 relative">
                <span className="absolute -top-3 -left-2 text-2xl select-none animate-bounce">
                  ☁️
                </span>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-sky-100 text-sky-800 dark:bg-slate-800 dark:text-sky-300 border border-sky-300">
                  <CloudRain className="w-3.5 h-3.5 text-sky-600" />
                  Baby Cloud-Sprite
                </div>
                <h2 className="font-display font-bold text-lg text-espresso">
                  0.4-Marshmallow Cumulus Hatchling
                </h2>
                <p className="text-xs text-muted leading-relaxed">
                  {BITZ_CHARACTER_SHEET.whatTheyAre}
                </p>
                <div className="pt-2 border-t border-pink-100 dark:border-slate-700 flex items-center justify-between text-xs font-mono">
                  <span className="text-muted">Sky Mood:</span>
                  <button
                    type="button"
                    onClick={handleToggleTheme}
                    className="font-bold text-pink-600 dark:text-pink-300 hover:underline cursor-pointer"
                  >
                    {isNight ? "🌙 Sleeping Moon" : "☀️ Cutie Sun"}
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-3xl bg-pink-50 dark:bg-slate-800 border-2 border-pink-200 dark:border-slate-700 flex items-center gap-3 shadow-sm">
                <span className="w-10 h-10 rounded-2xl bg-pink-500 text-white inline-flex items-center justify-center shrink-0 shadow-sm">
                  <Heart className="w-5 h-5 fill-current" />
                </span>
                <div>
                  <div className="text-xs font-mono font-bold text-pink-700 dark:text-pink-300">
                    100% Interactive Baby
                  </div>
                  <div className="text-xs text-espresso font-semibold">
                    Eyes follow your cursor + Dress-Up &amp; 4 cute animations!
                  </div>
                </div>
              </div>
            </div>

            {/* Centerpiece: Free-Floating 3D Plushie Character Stage */}
            <div className="lg:col-span-6 order-1 lg:order-2 flex items-center justify-center">
              <BitzCharacter
                theme={theme}
                onToggleTheme={handleToggleTheme}
                onEasterEggTriggered={handleEasterEggUnlocked}
                easterEggUnlocked={easterEggUnlocked}
              />
            </div>

            {/* Right Cute Cloud Card */}
            <div className="lg:col-span-3 space-y-4 order-3">
              <div className="p-5 rounded-3xl glass-panel border-2 border-pink-200 dark:border-slate-700 space-y-3 relative">
                <span className="absolute -top-3 -right-2 text-2xl select-none animate-pulse">
                  ⭐
                </span>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-pink-100 text-pink-800 dark:bg-slate-800 dark:text-pink-300 border border-pink-300">
                  <Stars className="w-3.5 h-3.5 text-pink-500" />
                  Bedtime Craft
                </div>
                <h2 className="font-display font-bold text-lg text-espresso">
                  {BITZ_CHARACTER_SHEET.title}
                </h2>
                <p className="text-xs text-muted leading-relaxed">
                  Born inside a rooftop weathervane at 04:17 AM, Bitz turns noisy
                  thunder into soothing raindrop lullabies, aurora jars, and paper
                  dream boats.
                </p>

                <div className="pt-2 flex flex-col gap-2">
                  <a
                    href="#projects-showcase"
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white border-2 border-pink-600 shadow-sm transition"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    Play With 4 Weather Toys
                  </a>
                  <a
                    href="#origin-story"
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold bg-sky-100 hover:bg-sky-200 text-sky-950 border-2 border-sky-300 transition"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-sky-700" />
                    Read Bedtime Storybook
                  </a>
                </div>
              </div>
            </div>
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
