"use client";

import React, { useState } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Music,
  Sparkles,
} from "lucide-react";
import { ORIGIN_STORY_SCENES } from "@/lib/characterData";
import { soundEngine } from "@/lib/soundEngine";

export default function OriginStoryScroll() {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const currentScene = ORIGIN_STORY_SCENES[activeSceneIndex];

  const sceneEmojis = ["☁️", "🍭", "🔮", "⛵"];
  const chapterInstruments = [
    "🎻 Violin & Piano Duet",
    "🪈 Bansuri & Harp",
    "🔔 3/4 Bell Waltz",
    "🌟 90s Synth Pop",
  ];

  const handleSelectScene = (idx) => {
    soundEngine.playCardChord(idx);
    setIsFlipping(true);
    setActiveSceneIndex(idx);
    setTimeout(() => setIsFlipping(false), 320);
  };

  const handlePlayChapterTheme = () => {
    const variations = ["var1", "var2", "var3", "var4"];
    soundEngine.playCloudLullaby(variations[activeSceneIndex % 4]);
  };

  return (
    <section
      id="origin-story"
      aria-labelledby="origin-story-heading"
      className="py-10 sm:py-16 px-3 sm:px-4 max-w-6xl mx-auto"
    >
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="inline-flex flex-wrap items-center justify-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider bg-pink-100 text-pink-700 dark:bg-pink-950/70 dark:text-pink-200 font-bold border-2 border-pink-300 shadow-sm">
          <BookOpen className="w-3.5 h-3.5 text-pink-500 shrink-0" />
          <span>📖 Open 3D Pop-Up Bedtime Storybook</span>
        </span>
        <h2
          id="origin-story-heading"
          className="mt-3 text-2xl sm:text-4xl font-bold text-espresso font-display"
        >
          How Mochi Tumbled From the Sky
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-muted">
          Turn the pop-up pages of Mochi&apos;s bedtime fairytale—each page pops up with a live scene and its own musical theme!
        </p>
      </div>

      {/* RIBBON BOOKMARK TABS STICKING OUT OF THE TOP OF THE STORYBOOK */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-[-10px] relative z-20 px-2">
        {ORIGIN_STORY_SCENES.map((scene, idx) => {
          const isActive = activeSceneIndex === idx;
          return (
            <button
              key={scene.sceneNumber}
              type="button"
              onClick={() => handleSelectScene(idx)}
              className={`px-4 py-2 rounded-t-2xl text-xs font-mono font-bold border-2 border-b-0 transition-all duration-300 flex items-center gap-1.5 ${
                isActive
                  ? "bg-pink-500 border-pink-600 text-white -translate-y-1.5 shadow-md scale-105"
                  : "bg-sky-100 dark:bg-slate-800 border-sky-300 dark:border-slate-700 text-espresso hover:bg-pink-100 hover:-translate-y-0.5"
              }`}
            >
              <span className="text-base">{sceneEmojis[idx]}</span>
              <span>Page {scene.sceneNumber}</span>
              <span className="hidden sm:inline opacity-85">· {scene.badge}</span>
            </button>
          );
        })}
      </div>

      {/* 3D OPEN HARDCOVER POP-UP STORYBOOK */}
      <div className="relative rounded-[2.5rem] bg-gradient-to-r from-pink-300 via-pink-400 to-sky-300 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 p-2.5 sm:p-4 shadow-2xl border-4 border-pink-300 dark:border-sky-700">
        {/* Inner Open Book Spread */}
        <div
          className={`relative rounded-[2rem] bg-white/95 dark:bg-slate-900/95 border-2 border-pink-200 dark:border-slate-700 grid grid-cols-1 lg:grid-cols-12 overflow-hidden transition-transform duration-300 ${
            isFlipping ? "scale-[0.985]" : "scale-100"
          }`}
        >
          {/* Center Book Spine Shadow on Desktop */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-pink-200/40 via-pink-400/35 to-sky-200/40 dark:from-black/40 dark:via-black/60 dark:to-black/40 z-10 pointer-events-none"
          />

          {/* LEFT STORYBOOK PAGE: LIVE 3D POP-UP DIORAMA STAGE */}
          <div className="lg:col-span-6 p-6 sm:p-8 bg-gradient-to-br from-sky-50/90 via-white to-pink-50/80 dark:from-slate-800/90 dark:via-slate-900 dark:to-slate-800/90 flex flex-col items-center justify-between border-b-2 lg:border-b-0 lg:border-r-2 border-pink-200/60 dark:border-slate-700 relative">
            <div className="w-full flex items-center justify-between gap-2 text-xs font-mono font-bold text-sky-800 dark:text-sky-300">
              <span className="px-3 py-1 rounded-full bg-sky-100 dark:bg-slate-800 border border-sky-300 dark:border-slate-600">
                {currentScene.timeTag}
              </span>
              <span className="text-pink-600 dark:text-pink-300">
                Pop-Up Scene #{currentScene.sceneNumber}
              </span>
            </div>

            {/* Animated SVG Pop-Up Paper Diorama */}
            <div
              onClick={handlePlayChapterTheme}
              className="my-5 w-full max-w-[300px] h-52 rounded-[2rem] bg-gradient-to-b from-sky-200/75 via-pink-100/70 to-white dark:from-slate-950 dark:via-indigo-950/80 dark:to-slate-900 border-2 border-sky-300 dark:border-sky-600 shadow-inner flex flex-col items-center justify-center relative overflow-hidden cursor-pointer group hover:scale-[1.03] transition-transform"
              title="Tap to play this chapter's musical theme!"
            >
              {/* Floating background stars */}
              <span className="absolute top-3 left-5 text-lg animate-twinkle select-none">✨</span>
              <span className="absolute top-4 right-6 text-base animate-bounce select-none">⭐</span>
              <span className="absolute bottom-3 left-6 text-sm animate-pulse select-none">☁️</span>

              {activeSceneIndex === 0 && (
                <div className="flex flex-col items-center animate-float-slow select-none">
                  <div className="text-6xl drop-shadow-md">🌨️👶☁️</div>
                  <span className="mt-2 px-3 py-0.5 rounded-full bg-white/90 dark:bg-slate-800 text-[11px] font-mono font-bold text-pink-600 dark:text-pink-300 border border-pink-200">
                    *Pop-Up: Baby Mochi Hatching!*
                  </span>
                </div>
              )}

              {activeSceneIndex === 1 && (
                <div className="flex flex-col items-center animate-float-slow select-none">
                  <div className="flex items-center gap-2 text-6xl drop-shadow-md">
                    <span className="animate-bounce">🔔</span>
                    <span className="animate-spin-slow">🍭</span>
                    <span className="animate-pulse">🌈</span>
                  </div>
                  <span className="mt-2 px-3 py-0.5 rounded-full bg-white/90 dark:bg-slate-800 text-[11px] font-mono font-bold text-pink-600 dark:text-pink-300 border border-pink-200">
                    *Pop-Up: Star-Bell &amp; Candy Wand!*
                  </span>
                </div>
              )}

              {activeSceneIndex === 2 && (
                <div className="flex flex-col items-center animate-float-slow select-none">
                  <div className="text-6xl drop-shadow-md">🔮🌌🎻</div>
                  <span className="mt-2 px-3 py-0.5 rounded-full bg-white/90 dark:bg-slate-800 text-[11px] font-mono font-bold text-pink-600 dark:text-pink-300 border border-pink-200">
                    *Pop-Up: Singing Snow-Globe Loft!*
                  </span>
                </div>
              )}

              {activeSceneIndex === 3 && (
                <div className="flex flex-col items-center animate-float-slow select-none">
                  <div className="text-6xl drop-shadow-md">⛵💖🌠</div>
                  <span className="mt-2 px-3 py-0.5 rounded-full bg-white/90 dark:bg-slate-800 text-[11px] font-mono font-bold text-pink-600 dark:text-pink-300 border border-pink-200">
                    *Pop-Up: Starlight Paper Boats!*
                  </span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handlePlayChapterTheme}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white border-2 border-pink-600 transition shadow-sm"
            >
              <Music className="w-3.5 h-3.5 shrink-0" />
              <span>Play Page {currentScene.sceneNumber} Tune ({chapterInstruments[activeSceneIndex]})</span>
            </button>
          </div>

          {/* RIGHT STORYBOOK PAGE: ILLUSTRATED STORY TEXT & PAGE CONTROLS */}
          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-bl from-pink-50/60 via-white to-sky-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/90">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-200 border border-pink-300 font-mono text-xs font-bold">
                  Chapter {currentScene.sceneNumber} of 04 · {currentScene.badge}
                </span>

                <span className="inline-flex items-center gap-1 text-xs font-mono text-muted">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>
                    <strong className="text-espresso">{currentScene.wordCount} words</strong> (≤150)
                  </span>
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-espresso font-display leading-snug">
                {currentScene.title}
              </h3>

              <div className="mt-4 p-4 sm:p-5 rounded-3xl bg-white/90 dark:bg-slate-800/90 border-2 border-pink-200 dark:border-slate-700 shadow-sm">
                <p className="text-base sm:text-lg text-espresso/95 leading-relaxed font-serif first-letter:text-3xl first-letter:font-display first-letter:font-bold first-letter:text-pink-500 first-letter:mr-1">
                  {currentScene.content}
                </p>
              </div>
            </div>

            {/* Bottom Page-Turn Bar */}
            <div className="mt-6 pt-4 border-t-2 border-dashed border-pink-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() =>
                  handleSelectScene(
                    (activeSceneIndex - 1 + ORIGIN_STORY_SCENES.length) %
                      ORIGIN_STORY_SCENES.length
                  )
                }
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border-2 border-sky-300 bg-sky-100 hover:bg-sky-200 text-sky-950 transition hover:-translate-x-0.5"
              >
                <ChevronLeft className="w-4 h-4 shrink-0" />
                <span>Prev Page</span>
              </button>

              <span className="text-xs font-mono font-bold text-pink-600 dark:text-pink-300">
                <Sparkles className="w-3.5 h-3.5 inline mr-1" />
                Page {activeSceneIndex + 1} / 4
              </span>

              <button
                type="button"
                onClick={() =>
                  handleSelectScene((activeSceneIndex + 1) % ORIGIN_STORY_SCENES.length)
                }
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white border-2 border-pink-600 transition shadow-sm hover:translate-x-0.5"
              >
                <span>Turn Page</span>
                <ChevronRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
