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
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-[#a34063]/10 text-[#a34063] font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          Section 05.3 · Interactive Bedtime Storybook (&lt;60 Words / Scene)
        </span>
        <h2
          id="origin-story-heading"
          className="mt-2 text-3xl sm:text-4xl font-bold text-espresso font-display"
        >
          How Bitz Tumbled From the Sky
        </h2>
        <p className="mt-2 text-sm sm:text-base text-muted">
          Scroll through the 4 illustrated chapters below or flip the interactive
          storybook pages with your keyboard or thumb!
        </p>
      </div>

      {/* Interactive Flipbook / Scene Stage */}
      <div className="rounded-3xl border-2 border-[#a34063]/25 bg-card p-6 sm:p-10 shadow-cozy">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-[#a34063]/15">
          <div className="flex items-center gap-2">
            {ORIGIN_STORY_SCENES.map((scene, idx) => (
              <button
                key={scene.sceneNumber}
                type="button"
                onClick={() => handleSelectScene(idx)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition ${
                  activeSceneIndex === idx
                    ? "bg-[#a34063] text-[#fff8f1] shadow-sm"
                    : "bg-cream border border-[#a34063]/20 text-espresso hover:border-[#a34063]"
                }`}
              >
                {scene.sceneNumber}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-muted">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              Scene Word Count: <strong>{currentScene.wordCount} words</strong> (Limit: ≤150)
            </span>
          </div>
        </div>

        {/* Active Storybook Page Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-6">
          {/* Illustrated Scene Badge & Visual Card */}
          <div className="md:col-span-5 rounded-2xl bg-cream border-2 border-[#a34063]/20 p-6 flex flex-col items-center justify-center text-center min-h-[210px]">
            <div
              style={{ backgroundColor: `${currentScene.moodColor}25` }}
              className="w-20 h-20 rounded-full flex items-center justify-center border-2 border-[#5c4033] mb-3"
            >
              <Sparkles className="w-9 h-9 text-[#a34063]" />
            </div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#a34063] font-bold">
              {currentScene.timeTag}
            </span>
            <p className="mt-1 font-display font-bold text-lg text-espresso">
              {currentScene.badge} Chapter
            </p>
          </div>

          {/* Story Narrative */}
          <div className="md:col-span-7 space-y-4">
            <div className="inline-block px-3 py-1 rounded-md bg-[#a34063]/10 text-[#a34063] font-mono text-xs font-bold">
              {currentScene.sceneNumber} of 04
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-espresso font-display">
              {currentScene.title}
            </h3>
            <p className="text-base sm:text-lg text-espresso/90 leading-relaxed font-serif">
              {currentScene.content}
            </p>

            {/* Flipbook Navigation Controls */}
            <div className="pt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  handleSelectScene(
                    (activeSceneIndex - 1 + ORIGIN_STORY_SCENES.length) %
                      ORIGIN_STORY_SCENES.length
                  )
                }
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border-2 border-[#a34063]/30 bg-cream text-espresso hover:border-[#a34063] transition"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous Page
              </button>

              <button
                type="button"
                onClick={() =>
                  handleSelectScene((activeSceneIndex + 1) % ORIGIN_STORY_SCENES.length)
                }
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-[#a34063] text-[#fff8f1] hover:opacity-95 transition"
              >
                Next Page
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* All 4 Scrollable Story Cards Overview */}
        <div className="mt-8 pt-6 border-t border-[#a34063]/15 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ORIGIN_STORY_SCENES.map((scene, idx) => (
            <div
              key={scene.sceneNumber}
              onClick={() => handleSelectScene(idx)}
              className={`p-4 rounded-2xl border transition cursor-pointer ${
                activeSceneIndex === idx
                  ? "border-2 border-[#a34063] bg-[#a34063]/5"
                  : "border-[#a34063]/15 bg-cream/60 hover:border-[#a34063]/50"
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-[#a34063] font-bold">
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
