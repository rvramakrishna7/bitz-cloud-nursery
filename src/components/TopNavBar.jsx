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
      <div className="max-w-6xl mx-auto rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-sky-300 shadow-[5px_5px_0px_#f472b6] px-4 py-2.5 flex items-center justify-between gap-2">
        {/* 90s OS Taskbar Brand + Visitor Badge */}
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="#top"
            onClick={() => soundEngine.playClick(1.1)}
            className="inline-flex items-center gap-2 font-display font-bold text-lg text-espresso hover:text-pink-500 transition"
          >
            <span className="w-8 h-8 rounded-xl bg-sky-300 text-slate-900 inline-flex items-center justify-center border-2 border-slate-900 shadow-[2px_2px_0px_#1e293b]">
              <Cloud className="w-4 h-4 fill-current" />
            </span>
            <span>
              Bitz<span className="text-pink-500">.OS</span>
            </span>
          </a>

          <span
            data-testid="visitor-memory-badge"
            className="hidden xl:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-mono bg-pink-100 text-slate-900 border-2 border-slate-900 font-bold"
          >
            <Sparkles className="w-3 h-3 text-pink-600" />
            {visitCount > 1 ? `Visit #${visitCount}` : "First Visit ✨"}
          </span>
        </div>

        {/* Centered 90s Folder Tabs */}
        <nav
          aria-label="Primary Portfolio Navigation"
          className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-100"
        >
          <a
            href="#character-sheet"
            className="px-3 py-1 rounded-lg bg-pink-100 dark:bg-slate-800 border-2 border-slate-900 dark:border-sky-400 hover:bg-pink-200 transition"
          >
            📁 Dossier
          </a>
          <a
            href="#projects-showcase"
            className="px-3 py-1 rounded-lg bg-sky-100 dark:bg-slate-800 border-2 border-slate-900 dark:border-sky-400 hover:bg-sky-200 transition"
          >
            🎹 Weather Lab
          </a>
          <a
            href="#origin-story"
            className="px-3 py-1 rounded-lg bg-pink-100 dark:bg-slate-800 border-2 border-slate-900 dark:border-sky-400 hover:bg-pink-200 transition"
          >
            📖 Storybook
          </a>
          <a
            href="#nursery-chat"
            className="px-3 py-1 rounded-lg bg-sky-100 dark:bg-slate-800 border-2 border-slate-900 dark:border-sky-400 hover:bg-sky-200 transition"
          >
            📟 Pager Chat
          </a>
          <a
            href="#guestbook-wall"
            className="px-3 py-1 rounded-lg bg-pink-100 dark:bg-slate-800 border-2 border-slate-900 dark:border-sky-400 hover:bg-pink-200 transition"
          >
            💌 Dream Wall
          </a>
        </nav>

        {/* Tactile 3D Push-Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleMute}
            data-testid="global-mute-toggle"
            aria-pressed={muted}
            aria-label={muted ? "Unmute nursery sounds" : "Mute nursery sounds"}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono ${
              muted ? "retro-btn-cream" : "retro-btn-pink"
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
            className="retro-btn-sky inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono"
          >
            {isNight ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">Day Sky ☀️</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-sky-800" />
                <span className="hidden sm:inline">Night Sky 🌙</span>
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
            className="retro-btn-cream inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono"
          >
            <Gamepad2 className="w-3.5 h-3.5 text-pink-600" />
            <span className="hidden sm:inline">
              {chaosMode ? "Toybox ON" : "90s Toybox"}
            </span>
          </button>
        </div>
      </div>

      {chaosMode && (
        <div className="max-w-5xl mx-auto mt-2 rounded-xl bg-pink-400 text-slate-950 py-1 px-4 text-xs font-mono font-extrabold overflow-hidden whitespace-nowrap border-2 border-slate-900 shadow-[3px_3px_0px_#1e293b]">
          <div className="animate-marquee inline-block">
            ★ WELCOME TO BITZ.OS CLOUD SANCTUARY ★ TOGGLE DAY SKY ☀️ & NIGHT SKY 🌙 TO TRANSFORM THE FLOATING SUN, MOON & RAINBOW ★
          </div>
        </div>
      )}
    </header>
  );
}
