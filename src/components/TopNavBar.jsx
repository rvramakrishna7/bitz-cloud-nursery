"use client";

import React from "react";
import {
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Sparkles,
  Gamepad2,
  Cloud,
} from "lucide-react";
import { soundEngine } from "@/lib/soundEngine";

export default function TopNavBar({
  muted,
  onToggleMute,
  theme,
  onToggleTheme,
  chaosMode,
  onToggleChaosMode,
  visitCount = 1,
}) {
  const isNight = theme === "night";

  return (
    <header className="sticky top-3 z-50 px-3 sm:px-6">
      <div className="max-w-6xl mx-auto rounded-full bg-white/95 dark:bg-slate-900/95 border-2 border-pink-200 dark:border-sky-700 shadow-md px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Brand Identity + Visitor Badge */}
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="#top"
            onClick={() => soundEngine.playClick(1.1)}
            className="inline-flex items-center gap-2 font-display font-bold text-lg text-espresso hover:text-pink-500 transition"
          >
            <span className="w-8 h-8 rounded-full bg-sky-400 text-white inline-flex items-center justify-center border-2 border-pink-300 shadow-sm">
              <Cloud className="w-4 h-4 fill-current" />
            </span>
            <span>
              Bitz<span className="text-pink-500">.sky</span>
            </span>
          </a>

          <span
            data-testid="visitor-memory-badge"
            className="hidden xl:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-pink-50 text-pink-700 dark:bg-pink-950/60 dark:text-pink-200 border border-pink-200 font-bold"
          >
            <Sparkles className="w-3 h-3 text-pink-500" />
            {visitCount > 1 ? `Visit #${visitCount}` : "First Visit ✨"}
          </span>
        </div>

        {/* Centered Navigation Links */}
        <nav
          aria-label="Primary Portfolio Navigation"
          className="hidden lg:flex items-center gap-1 bg-sky-50 dark:bg-slate-800 px-3 py-1 rounded-full border border-sky-200 dark:border-slate-700 text-xs font-bold text-espresso/85"
        >
          <a
            href="#character-sheet"
            className="px-3 py-1 rounded-full hover:bg-white dark:hover:bg-slate-700 hover:text-pink-500 transition"
          >
            Passport
          </a>
          <a
            href="#projects-showcase"
            className="px-3 py-1 rounded-full hover:bg-white dark:hover:bg-slate-700 hover:text-pink-500 transition"
          >
            Weather Lab
          </a>
          <a
            href="#origin-story"
            className="px-3 py-1 rounded-full hover:bg-white dark:hover:bg-slate-700 hover:text-pink-500 transition"
          >
            Storybook
          </a>
          <a
            href="#nursery-chat"
            className="px-3 py-1 rounded-full hover:bg-white dark:hover:bg-slate-700 hover:text-pink-500 transition"
          >
            Cloud Chat
          </a>
          <a
            href="#guestbook-wall"
            className="px-3 py-1 rounded-full hover:bg-white dark:hover:bg-slate-700 hover:text-pink-500 transition"
          >
            Dream Wall
          </a>
        </nav>

        {/* Sleek Single-Row Action Pills */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onToggleMute}
            data-testid="global-mute-toggle"
            aria-pressed={muted}
            aria-label={muted ? "Unmute nursery sounds" : "Mute nursery sounds"}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold border-2 transition ${
              muted
                ? "bg-pink-100 border-pink-400 text-pink-800 dark:bg-pink-950 dark:text-pink-200"
                : "bg-pink-500 border-pink-600 text-white shadow-sm"
            }`}
          >
            {muted ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Muted</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span>Sound ON</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick(1.15);
              onToggleTheme?.();
            }}
            data-testid="theme-mood-toggle"
            aria-label={
              isNight ? "Switch to Day Sky mode" : "Switch to Night Sky mode"
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold border-2 border-sky-300 bg-sky-100 hover:bg-sky-200 text-sky-950 transition"
          >
            {isNight ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">Day Sky</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-sky-700" />
                <span className="hidden sm:inline">Night Sky</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playGiggle();
              onToggleChaosMode?.();
            }}
            data-testid="chaos-mode-toggle"
            aria-pressed={chaosMode}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold border-2 transition ${
              chaosMode
                ? "bg-amber-300 border-slate-900 text-slate-950 shadow-sm"
                : "border-pink-200 bg-pink-50 hover:bg-pink-100 text-pink-900 dark:bg-slate-800 dark:text-pink-200"
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5 text-pink-500" />
            <span className="hidden sm:inline">
              {chaosMode ? "Toybox ON" : "Toybox"}
            </span>
          </button>
        </div>
      </div>

      {chaosMode && (
        <div className="max-w-5xl mx-auto mt-1.5 rounded-full bg-pink-500 text-white py-1 px-4 text-xs font-mono font-bold overflow-hidden whitespace-nowrap border-2 border-pink-300 shadow-sm">
          <div className="animate-marquee inline-block">
            ★ WELCOME TO BITZ&apos;S CLOUD-LOFT SANCTUARY ★ MOVE YOUR CURSOR TO TRACK BITZ&apos;S EYES ★ RING THE GOLDEN STAR-BELL 3 TIMES FOR A RAINBOW BRIDGE ★
          </div>
        </div>
      )}
    </header>
  );
}
