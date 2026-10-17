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
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 border-b-2 border-pink-200 dark:border-sky-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand Identity + Returning Visitor Memory Pill */}
        <div className="flex items-center gap-3">
          <a
            href="#top"
            onClick={() => soundEngine.playClick(1.1)}
            className="inline-flex items-center gap-2.5 font-display font-bold text-lg sm:text-xl text-espresso hover:text-pink-500 transition"
          >
            <span className="w-9 h-9 rounded-2xl bg-sky-400 text-white inline-flex items-center justify-center border-2 border-pink-300 shadow-sm">
              <Cloud className="w-4 h-4 fill-current" />
            </span>
            <span>
              Bitz<span className="text-pink-500">.sky</span>
            </span>
          </a>

          <span
            data-testid="visitor-memory-badge"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono bg-pink-100 text-pink-800 dark:bg-pink-950/60 dark:text-pink-200 border border-pink-300 dark:border-pink-700 font-bold"
          >
            <Sparkles className="w-3 h-3 text-pink-500" />
            {visitCount > 1
              ? `Welcome back, Friend! (Visit #${visitCount})`
              : "First Sanctuary Visit ✨"}
          </span>
        </div>

        {/* Quick Section Links */}
        <nav
          aria-label="Primary Portfolio Navigation"
          className="hidden md:flex items-center gap-5 text-xs font-bold text-espresso/85"
        >
          <a href="#character-sheet" className="hover:text-pink-500 transition">
            1. Identity Passport
          </a>
          <a href="#projects-showcase" className="hover:text-pink-500 transition">
            2. Creations (4)
          </a>
          <a href="#origin-story" className="hover:text-pink-500 transition">
            3. Storybook
          </a>
          <a href="#nursery-chat" className="hover:text-pink-500 transition">
            Cloud-Phone Chat
          </a>
          <a href="#guestbook-wall" className="hover:text-pink-500 transition">
            Dream Wall
          </a>
        </nav>

        {/* Interactive Controls: Mute Switch (Mandatory) + Day/Night + Toybox Mode */}
        <div className="flex items-center gap-2">
          {/* Mandatory Visible Mute Toggle (+3 pts Side Quest & Section 09 Rule) */}
          <button
            type="button"
            onClick={onToggleMute}
            data-testid="global-mute-toggle"
            aria-pressed={muted}
            aria-label={muted ? "Unmute nursery sounds" : "Mute nursery sounds"}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold border-2 transition ${
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

          {/* Day / Night Mood Toggle (Tier 1 Requirement) */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick(1.15);
              onToggleTheme?.();
            }}
            data-testid="theme-mood-toggle"
            aria-label={
              isNight ? "Switch to Sunlit Sky mode" : "Switch to Night Sky mode"
            }
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold border-2 border-sky-300 bg-sky-100 hover:bg-sky-200 text-sky-950 transition"
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

          {/* Responsive Chaos / 90s Toybox Mode Toggle (+5 pts Side Quest) */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playGiggle();
              onToggleChaosMode?.();
            }}
            data-testid="chaos-mode-toggle"
            aria-pressed={chaosMode}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold border-2 transition ${
              chaosMode
                ? "bg-amber-300 border-slate-900 text-slate-950 shadow-sm"
                : "border-pink-300 bg-white dark:bg-slate-800 text-espresso hover:bg-pink-50"
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5 text-pink-500" />
            <span>{chaosMode ? "90s Toybox ON!" : "90s Toybox"}</span>
          </button>
        </div>
      </div>

      {/* Nostalgic 90s Marquee Ribbon when Toybox Mode is active (Solid Baby Pink Bar) */}
      {chaosMode && (
        <div className="bg-pink-500 text-white py-1 px-3 text-xs font-mono font-bold overflow-hidden whitespace-nowrap border-t border-pink-300">
          <div className="animate-marquee inline-block">
            ★ WELCOME TO BITZ&apos;S CELESTIAL CLOUD-LOFT ★ 100% ORIGINAL 3D PLUSHIE CHARACTER PORTFOLIO ★ TICKLE BITZ&apos;S BELLY OR RING THE STAR-BELL 3 TIMES ★
          </div>
        </div>
      )}
    </header>
  );
}
