"use client";

import React, { useState } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Music,
} from "lucide-react";
import { ORIGIN_STORY_SCENES } from "@/lib/characterData";
import { soundEngine } from "@/lib/soundEngine";

export default function OriginStoryScroll() {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const currentScene = ORIGIN_STORY_SCENES[activeSceneIndex];

  const sceneEmojis = ["🌩️", "🔔", "🏮", "⛵"];

  const handleSelectScene = (idx) => {
    soundEngine.playCardChord(idx);
    setActiveSceneIndex(idx);
  };

  const handlePlayChapterTheme = () => {
    const variations = ["var1", "var2", "var3", "var4"];
    soundEngine.playCloudLullaby(variations[activeSceneIndex % 4]);
  };

  return (
    <section
      id="origin-story"
      aria-labelledby="origin-story-heading"
      className="py-10 sm:py-14 px-4 max-w-6xl mx-auto"
    >
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-200 font-bold border border-pink-300 whitespace-nowrap">
          <BookOpen className="w-3.5 h-3.5 text-pink-500 shrink-0" />
          <span>📖 Step 5A · Illustrated Bedtime Flipbook (4 Chapters)</span>
        </span>
        <h2
          id="origin-story-heading"
          className="mt-3 text-3xl sm:text-4xl font-bold text-espresso font-display"
        >
          How Bitz Tumbled From the Sky
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-muted">
          Flip through Bitz&apos;s 4 bedtime chapters below—each chapter has its own
          1773 Violin &amp; Grand Piano musical theme and is strictly under 60 words!
        </p>
      </div>

      <div className="rounded-3xl glass-panel border-2 border-pink-200 dark:border-slate-700 p-6 sm:p-9">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b-2 border-pink-100 dark:border-slate-700">
          <div className="flex items-center gap-2 overflow-x-auto">
            {ORIGIN_STORY_SCENES.map((scene, idx) => (
              <button
                key={scene.sceneNumber}
                type="button"
                onClick={() => handleSelectScene(idx)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold border-2 transition whitespace-nowrap shrink-0 ${
                  activeSceneIndex === idx
                    ? "bg-pink-500 border-pink-600 text-white shadow-sm"
                    : "bg-sky-50 dark:bg-slate-800 border-sky-200 dark:border-slate-700 text-espresso hover:border-pink-400"
                }`}
              >
                {sceneEmojis[idx]} {scene.sceneNumber}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-muted whitespace-nowrap">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              Word Count: <strong className="text-espresso">{currentScene.wordCount} words</strong> (Limit: ≤150)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-6">
          <div className="md:col-span-5 rounded-3xl bg-sky-100/80 dark:bg-slate-800 border-2 border-sky-300 dark:border-sky-700 p-6 flex flex-col items-center justify-center text-center min-h-[220px] relative">
            <div className="w-20 h-20 rounded-3xl bg-pink-500 text-white border-2 border-pink-300 flex items-center justify-center shadow-md mb-3 text-4xl select-none">
              {sceneEmojis[activeSceneIndex]}
            </div>
            <span className="text-xs font-mono uppercase tracking-wider text-sky-800 dark:text-sky-300 font-bold whitespace-nowrap">
              {currentScene.timeTag}
            </span>
            <p className="mt-1 font-display font-bold text-lg text-espresso">
              {currentScene.badge} Chapter
            </p>
            <button
              type="button"
              onClick={handlePlayChapterTheme}
              className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/95 dark:bg-slate-900 text-pink-600 dark:text-pink-300 border border-pink-300 hover:bg-pink-50 transition whitespace-nowrap shadow-sm"
            >
              <Music className="w-3.5 h-3.5 shrink-0" />
              <span>🎻 Play Chapter {currentScene.sceneNumber} Theme</span>
            </button>
          </div>

          <div className="md:col-span-7 space-y-4">
            <div className="inline-block px-3 py-1 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-200 border border-pink-300 font-mono text-xs font-bold whitespace-nowrap">
              Chapter {currentScene.sceneNumber} of 04
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-espresso font-display">
              {currentScene.title}
            </h3>
            <p className="text-base sm:text-lg text-espresso/90 leading-relaxed font-serif">
              {currentScene.content}
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() =>
                  handleSelectScene(
                    (activeSceneIndex - 1 + ORIGIN_STORY_SCENES.length) %
                      ORIGIN_STORY_SCENES.length
                  )
                }
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold border-2 border-sky-300 bg-sky-100 hover:bg-sky-200 text-sky-950 transition whitespace-nowrap"
              >
                <ChevronLeft className="w-4 h-4 shrink-0" />
                <span>Previous Page</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleSelectScene((activeSceneIndex + 1) % ORIGIN_STORY_SCENES.length)
                }
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white border-2 border-pink-600 transition shadow-sm whitespace-nowrap"
              >
                <span>Next Page</span>
                <ChevronRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t-2 border-pink-100 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {ORIGIN_STORY_SCENES.map((scene, idx) => (
            <div
              key={scene.sceneNumber}
              onClick={() => handleSelectScene(idx)}
              className={`p-4 rounded-2xl border-2 transition cursor-pointer ${
                activeSceneIndex === idx
                  ? "border-pink-500 bg-pink-50 dark:bg-slate-800 shadow-sm"
                  : "border-sky-200 bg-sky-50/50 dark:bg-slate-800/60 dark:border-slate-700 hover:border-pink-400"
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-pink-600 dark:text-pink-300 font-bold whitespace-nowrap">
                <span>
                  {sceneEmojis[idx]} Chapter {scene.sceneNumber}
                </span>
                <span>{scene.wordCount}w</span>
              </div>
              <h4 className="mt-1 font-display font-bold text-sm text-espresso">
                {scene.title}
              </h4>
              <p className="mt-1 text-xs text-muted line-clamp-2 leading-relaxed">
                {scene.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
