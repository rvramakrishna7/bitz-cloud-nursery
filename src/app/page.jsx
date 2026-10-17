"use client";

import React, { useState, useEffect } from "react";
import { Compass, BookOpen, Sparkles, CloudRain, Music, Stars, Sun, Moon } from "lucide-react";
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
    <div id="top" className="min-h-screen flex flex-col relative">
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
        {/* CENTERED INTERACTIVE SKY-SANCTUARY STAGE + 90S CLOUD-OS WIDGETS */}
        <section
          aria-labelledby="hero-title"
          className="pt-8 pb-12 sm:py-12 px-4 max-w-6xl mx-auto"
        >
          {/* Top Centered Editorial Title */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-mono font-extrabold bg-pink-200 text-slate-900 border-2 border-slate-900 shadow-[3px_3px_0px_#1e293b]">
              <Sparkles className="w-3.5 h-3.5 text-pink-600" />
              BITZ.OS v1.99 · 90s Cloud-Loft Weather Sanctuary
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

          {/* 3-Column Symmetric Stage: Left 90s OS Widget | Center Free-Floating Bitz | Right 90s OS Widget */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left 90s Pastel Cloud-OS Mini Window */}
            <div className="lg:col-span-3 space-y-4 order-2 lg:order-1">
              <div className="retro-window overflow-hidden">
                <div className="bg-sky-300 dark:bg-sky-900 border-b-2 border-slate-900 dark:border-sky-300 px-3 py-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-white border border-slate-900" />
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-300 border border-slate-900" />
                    <span className="font-mono text-[10px] font-extrabold text-slate-900 dark:text-white ml-1">
                      SPRITE_BIO.SYS
                    </span>
                  </div>
                  <CloudRain className="w-3.5 h-3.5 text-slate-900 dark:text-sky-200" />
                </div>
                <div className="p-4 space-y-2.5">
                  <h2 className="font-display font-bold text-base text-espresso">
                    0.4-Marshmallow Cumulus Baby
                  </h2>
                  <p className="text-xs text-muted leading-relaxed">
                    {BITZ_CHARACTER_SHEET.whatTheyAre}
                  </p>
                  <div className="pt-2 border-t-2 border-pink-100 dark:border-slate-700 flex items-center justify-between text-xs font-mono">
                    <span className="text-muted">Sky Mode:</span>
                    <button
                      type="button"
                      onClick={handleToggleTheme}
                      className="font-extrabold text-pink-600 dark:text-pink-300 underline cursor-pointer"
                    >
                      {isNight ? "🌙 Night Stars" : "☀️ Cutie Sun"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-pink-100 dark:bg-slate-800 border-2 border-slate-900 dark:border-sky-300 shadow-[4px_4px_0px_#38bdf8] flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-pink-400 text-slate-900 border-2 border-slate-900 inline-flex items-center justify-center shrink-0">
                  <Music className="w-4 h-4" />
                </span>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  Click the floating Sun/Moon in the sky above Bitz to switch Day &amp; Night!
                </div>
              </div>
            </div>

            {/* Centerpiece: Free-Floating 3D Plushie Baby Character + Floating Sky World */}
            <div className="lg:col-span-6 order-1 lg:order-2 flex items-center justify-center">
              <BitzCharacter
                theme={theme}
                onToggleTheme={handleToggleTheme}
                onEasterEggTriggered={handleEasterEggUnlocked}
                easterEggUnlocked={easterEggUnlocked}
              />
            </div>

            {/* Right 90s Pastel Cloud-OS Mini Window */}
            <div className="lg:col-span-3 space-y-4 order-3">
              <div className="retro-window overflow-hidden">
                <div className="bg-pink-300 dark:bg-pink-900 border-b-2 border-slate-900 dark:border-sky-300 px-3 py-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-white border border-slate-900" />
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-300 border border-slate-900" />
                    <span className="font-mono text-[10px] font-extrabold text-slate-900 dark:text-white ml-1">
                      CRAFT_MENU.EXE
                    </span>
                  </div>
                  <Stars className="w-3.5 h-3.5 text-slate-900 dark:text-pink-200" />
                </div>
                <div className="p-4 space-y-3">
                  <h2 className="font-display font-bold text-base text-espresso">
                    {BITZ_CHARACTER_SHEET.title}
                  </h2>
                  <p className="text-xs text-muted leading-relaxed">
                    Holding a glowing <strong>Starlight Lantern</strong> in one hand and a{" "}
                    <strong>Rainbow Music Box</strong> in the other, Bitz weaves cozy skies!
                  </p>

                  <div className="pt-1 flex flex-col gap-2.5">
                    <a
                      href="#projects-showcase"
                      className="retro-btn-pink w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      Open Weather Lab (4)
                    </a>
                    <a
                      href="#origin-story"
                      className="retro-btn-sky w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Read 4-Scene Storybook
                    </a>
                  </div>
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
