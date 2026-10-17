"use client";

import React, { useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight, Sparkles, CheckCircle2 } from "lucide-react";
import { ORIGIN_STORY_SCENES } from "@/lib/characterData";
import { soundEngine } from "@/lib/soundEngine";

export default function OriginStoryScroll() {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const currentScene = ORIGIN_STORY_SCENES[activeSceneIndex];

  const handleSelectScene = (idx) => {
    soundEngine.playNote(523.25 + idx * 70, 0.25, "sine");
    setActiveSceneIndex(idx);
  };

  return (
    <section
      id="origin-story"
      aria-labelledby="origin-story-heading"
      className="py-12 sm:py-16 px-4 max-w-6xl mx-auto"
    >
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider bg-pink-200 text-slate-900 font-extrabold border-2 border-slate-900 shadow-[3px_3px_0px_#1e293b]">
          <BookOpen className="w-3.5 h-3.5 text-pink-600" />
          Illustrated Bedtime Flipbook · 4 Chapters
        </span>
        <h2
          id="origin-story-heading"
          className="mt-3 text-3xl sm:text-4xl font-bold text-espresso font-display"
        >
          How Bitz Tumbled From the Sky
        </h2>
        <p className="mt-2 text-sm sm:text-base text-muted">
          Flip through the 4 illustrated chapters inside Bitz&apos;s 90s Storybook Reader!
        </p>
      </div>

      {/* 90s Pastel Cloud-OS Storybook Reader Window */}
      <div className="retro-window overflow-hidden">
        {/* OS Window Header Bar */}
        <div className="bg-sky-300 dark:bg-sky-900 border-b-2 border-slate-900 dark:border-sky-300 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-900" />
            <span className="w-3.5 h-3.5 rounded-full bg-pink-300 border-2 border-slate-900" />
            <span className="w-3.5 h-3.5 rounded-full bg-amber-300 border-2 border-slate-900" />
            <span className="ml-2 font-mono text-xs font-extrabold text-slate-900 dark:text-white">
              📖 BEDTIME_STORYBOOK_READER.DOC
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold bg-white dark:bg-slate-900 text-slate-900 dark:text-emerald-300 px-3 py-0.5 rounded-md border-2 border-slate-900">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>
              Scene Word Count: <strong>{currentScene.wordCount} words</strong> (Limit: ≤150)
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {/* Chapter Folder Tabs */}
          <div className="flex flex-wrap items-center gap-2 pb-6 border-b-2 border-slate-900/15 dark:border-slate-700">
            {ORIGIN_STORY_SCENES.map((scene, idx) => (
              <button
                key={scene.sceneNumber}
                type="button"
                onClick={() => handleSelectScene(idx)}
                className={`px-4 py-1.5 text-xs font-mono ${
                  activeSceneIndex === idx ? "retro-btn-pink" : "retro-btn-cream"
                }`}
              >
                Chapter {scene.sceneNumber} · {scene.badge}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-6">
            <div className="md:col-span-5 rounded-2xl bg-pink-100 dark:bg-slate-800 border-2 border-slate-900 dark:border-sky-300 shadow-[5px_5px_0px_#38bdf8] p-6 flex flex-col items-center justify-center text-center min-h-[210px]">
              <div className="w-20 h-20 rounded-2xl bg-sky-300 text-slate-900 border-2 border-slate-900 shadow-[3px_3px_0px_#1e293b] flex items-center justify-center mb-3">
                <Sparkles className="w-9 h-9 text-pink-600" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-pink-700 dark:text-pink-300 font-extrabold">
                {currentScene.timeTag}
              </span>
              <p className="mt-1 font-display font-bold text-lg text-espresso">
                {currentScene.badge} Chapter
              </p>
            </div>

            <div className="md:col-span-7 space-y-4">
              <div className="inline-block px-3 py-1 rounded-lg bg-sky-200 text-slate-900 border-2 border-slate-900 font-mono text-xs font-extrabold">
                Page {currentScene.sceneNumber} of 04
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-espresso font-display">
                {currentScene.title}
              </h3>
              <p className="text-base sm:text-lg text-espresso/95 leading-relaxed font-serif bg-sky-50/70 dark:bg-slate-800/80 p-4 rounded-2xl border-2 border-slate-900 dark:border-slate-700">
                {currentScene.content}
              </p>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    handleSelectScene(
                      (activeSceneIndex - 1 + ORIGIN_STORY_SCENES.length) %
                        ORIGIN_STORY_SCENES.length
                    )
                  }
                  className="retro-btn-sky inline-flex items-center gap-1.5 px-4 py-2 text-xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous Page
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleSelectScene((activeSceneIndex + 1) % ORIGIN_STORY_SCENES.length)
                  }
                  className="retro-btn-pink inline-flex items-center gap-1.5 px-4 py-2 text-xs"
                >
                  Next Page
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t-2 border-slate-900/15 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ORIGIN_STORY_SCENES.map((scene, idx) => (
              <div
                key={scene.sceneNumber}
                onClick={() => handleSelectScene(idx)}
                className={`p-4 rounded-2xl border-2 border-slate-900 transition cursor-pointer ${
                  activeSceneIndex === idx
                    ? "bg-pink-100 dark:bg-slate-800 shadow-[4px_4px_0px_#f472b6]"
                    : "bg-sky-50 dark:bg-slate-800/60 hover:bg-pink-50 shadow-[3px_3px_0px_#1e293b]"
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-pink-700 dark:text-pink-300 font-extrabold">
                  <span>CH #{scene.sceneNumber}</span>
                  <span>{scene.wordCount}w</span>
                </div>
                <h4 className="mt-1 font-display font-bold text-sm text-espresso">
                  {scene.title}
                </h4>
                <p className="mt-1.5 text-xs text-muted line-clamp-3 leading-relaxed">
                  {scene.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
