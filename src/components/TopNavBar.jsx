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
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/75 dark:bg-slate-950/80 border-b border-indigo-500/15 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand Identity + Returning Visitor Memory Pill */}
        <div className="flex items-center gap-3">
          <a
            href="#top"
            onClick={() => soundEngine.playClick(1.1)}
            className="inline-flex items-center gap-2.5 font-display font-bold text-lg sm:text-xl text-espresso hover:text-indigo-500 transition"
          >
            <span className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-400 text-white inline-flex items-center justify-center shadow-md">
              <Cloud className="w-4 h-4 fill-current" />
            </span>
            <span>
              Bitz<span className="text-indigo-600 dark:text-sky-400">.sky</span>
            </span>
          </a>

          <span
            data-testid="visitor-memory-badge"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono bg-indigo-500/10 text-indigo-700 dark:text-sky-300 border border-indigo-500/20"
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            {visitCount > 1
              ? `Welcome back, Friend! (Visit #${visitCount})`
              : "First Sanctuary Visit ✨"}
          </span>
        </div>

        {/* Quick Section Links */}
        <nav
          aria-label="Primary Portfolio Navigation"
          className="hidden md:flex items-center gap-5 text-xs font-semibold text-espresso/80"
        >
          <a href="#character-sheet" className="hover:text-indigo-500 transition">
            1. Identity Passport
          </a>
          <a href="#projects-showcase" className="hover:text-indigo-500 transition">
            2. 3D Creations (4)
          </a>
          <a href="#origin-story" className="hover:text-indigo-500 transition">
            3. Storybook
          </a>
          <a href="#nursery-chat" className="hover:text-indigo-500 transition">
            Cloud-Phone Chat
          </a>
          <a href="#guestbook-wall" className="hover:text-indigo-500 transition">
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
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold border transition ${
              muted
                ? "bg-rose-500/10 border-rose-500/40 text-rose-600 dark:text-rose-300"
                : "bg-gradient-to-r from-indigo-600 to-sky-500 border-transparent text-white shadow-sm"
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
              isNight ? "Switch to Sunlit Sky mode" : "Switch to Aurora Night mode"
            }
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold border border-indigo-500/25 glass-panel text-espresso hover:border-indigo-500 transition"
          >
            {isNight ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Sunlit Sky</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Aurora Night</span>
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
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold border transition ${
              chaosMode
                ? "bg-amber-400 border-slate-900 text-slate-950 shadow-sm"
                : "border-indigo-500/25 glass-panel text-espresso hover:border-indigo-500"
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5 text-indigo-600 dark:text-sky-400" />
            <span>{chaosMode ? "90s Toybox ON!" : "90s Toybox"}</span>
          </button>
        </div>
      </div>

      {/* Nostalgic 90s Marquee Ribbon when Toybox Mode is active */}
      {chaosMode && (
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-500 text-white py-1 px-3 text-xs font-mono overflow-hidden whitespace-nowrap border-t border-white/20">
          <div className="animate-marquee inline-block">
            ★ WELCOME TO BITZ&apos;S CELESTIAL CLOUD-LOFT ★ 100% ORIGINAL 3D PLUSHIE & WEBGL PORTFOLIO ★ RING BITZ&apos;S STAR-BELL 3 TIMES FOR RAINBOW AURORA OVERDRIVE ★
          </div>
        </div>
      )}
    </header>
  );
}
