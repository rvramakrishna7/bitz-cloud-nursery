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
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-200 font-bold border border-pink-300">
          <BookOpen className="w-3.5 h-3.5 text-pink-500" />
          Illustrated Bedtime Flipbook · 4 Chapters
        </span>
        <h2
          id="origin-story-heading"
          className="mt-3 text-3xl sm:text-4xl font-bold text-espresso font-display"
        >
          How Bitz Tumbled From the Sky
        </h2>
        <p className="mt-2 text-sm sm:text-base text-muted">
          Flip through the 4 illustrated chapters below! Every chapter is concise,
          animated, and strictly under 60 words.
        </p>
      </div>

      <div className="rounded-3xl glass-panel p-6 sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b-2 border-pink-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            {ORIGIN_STORY_SCENES.map((scene, idx) => (
              <button
                key={scene.sceneNumber}
                type="button"
                onClick={() => handleSelectScene(idx)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold border-2 transition ${
                  activeSceneIndex === idx
                    ? "bg-pink-500 border-pink-600 text-white shadow-sm"
                    : "bg-sky-50 dark:bg-slate-800 border-sky-200 dark:border-slate-700 text-espresso hover:border-pink-400"
                }`}
              >
                {scene.sceneNumber}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-muted">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>
              Scene Word Count: <strong className="text-espresso">{currentScene.wordCount} words</strong> (Limit: ≤150)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-6">
          <div className="md:col-span-5 rounded-2xl bg-sky-100/80 dark:bg-slate-800 border-2 border-sky-300 dark:border-sky-700 p-6 flex flex-col items-center justify-center text-center min-h-[210px]">
            <div className="w-20 h-20 rounded-2xl bg-pink-500 text-white border-2 border-pink-300 flex items-center justify-center shadow-md mb-3">
              <Sparkles className="w-9 h-9" />
            </div>
            <span className="text-xs font-mono uppercase tracking-wider text-sky-800 dark:text-sky-300 font-bold">
              {currentScene.timeTag}
            </span>
            <p className="mt-1 font-display font-bold text-lg text-espresso">
              {currentScene.badge} Chapter
            </p>
          </div>

          <div className="md:col-span-7 space-y-4">
            <div className="inline-block px-3 py-1 rounded-md bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-200 border border-pink-300 font-mono text-xs font-bold">
              {currentScene.sceneNumber} of 04
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-espresso font-display">
              {currentScene.title}
            </h3>
            <p className="text-base sm:text-lg text-espresso/90 leading-relaxed font-serif">
              {currentScene.content}
            </p>

            <div className="pt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  handleSelectScene(
                    (activeSceneIndex - 1 + ORIGIN_STORY_SCENES.length) %
                      ORIGIN_STORY_SCENES.length
                  )
                }
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold border-2 border-sky-300 bg-sky-100 hover:bg-sky-200 text-sky-950 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous Page
              </button>

              <button
                type="button"
                onClick={() =>
                  handleSelectScene((activeSceneIndex + 1) % ORIGIN_STORY_SCENES.length)
                }
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white border-2 border-pink-600 transition shadow-sm"
              >
                Next Page
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t-2 border-pink-100 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ORIGIN_STORY_SCENES.map((scene, idx) => (
            <div
              key={scene.sceneNumber}
              onClick={() => handleSelectScene(idx)}
              className={`p-4 rounded-2xl border-2 transition cursor-pointer ${
                activeSceneIndex === idx
                  ? "border-pink-500 bg-pink-50 dark:bg-slate-800"
                  : "border-sky-200 bg-sky-50/50 dark:bg-slate-800/60 dark:border-slate-700 hover:border-pink-400"
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-pink-600 dark:text-pink-300 font-bold">
                <span>{scene.sceneNumber}</span>
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
    </section>
  );
}
