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
    <>
      {/* Responsive Top-Corner Sky Status Badges */}
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 pt-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <a
          href="#top"
          onClick={() => soundEngine.playClick(1.1)}
          className="pointer-events-auto inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 border-2 border-pink-200 dark:border-sky-700 shadow-sm font-display font-bold text-xs sm:text-sm text-espresso hover:text-pink-500 transition"
        >
          <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-sky-400 text-white inline-flex items-center justify-center border border-pink-300">
            <Cloud className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
          </span>
          <span>
            Mochi<span className="text-pink-500">.sky</span>
          </span>
        </a>

        <span
          data-testid="visitor-memory-badge"
          className="pointer-events-auto inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-mono bg-white/95 dark:bg-slate-900/95 text-pink-700 dark:text-pink-200 border-2 border-pink-200 dark:border-sky-700 font-bold shadow-sm"
        >
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-pink-500 shrink-0" />
          <span>{visitCount > 1 ? `Visit #${visitCount} · Cloud Loft` : "First Visit ✨ · Cloud Loft"}</span>
        </span>
      </div>

      {chaosMode && (
        <div className="max-w-4xl mx-auto mt-2 px-3 sm:px-4">
          <div className="rounded-full bg-pink-500 text-white py-1 px-4 text-xs font-mono font-bold overflow-hidden whitespace-nowrap border-2 border-pink-300 shadow-sm">
            <div className="animate-marquee inline-block">
              ★ WELCOME TO MOCHI&apos;S CLOUD-LOFT SANCTUARY ★ DRESS UP MOCHI IN BERRY ONESIE OR BUNNY HOODIE ★ TAP THE GOLDEN STAR-BELL 3 TIMES FOR MASSIVE SKY CONFETTI ★
            </div>
          </div>
        </div>
      )}

      {/* FLOATING BOTTOM CLOUD DOCK */}
      <header
        aria-label="Floating Cloud Dock Navigation"
        className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[96vw]"
      >
        <div className="rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-2 border-pink-300 dark:border-sky-600 shadow-xl px-2.5 sm:px-4 py-1.5 sm:py-2 flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
          {/* Quick Section Jump Links */}
          <nav
            aria-label="Primary Portfolio Navigation"
            className="hidden md:flex items-center gap-1 pr-2 border-r border-pink-200 dark:border-slate-700 text-xs font-bold text-espresso/90"
          >
            <a
              href="#top"
              className="px-2.5 py-1.5 rounded-full hover:bg-pink-50 dark:hover:bg-slate-800 hover:text-pink-600 transition whitespace-nowrap"
            >
              ☁️ Mochi
            </a>
            <a
              href="#character-sheet"
              className="px-2.5 py-1.5 rounded-full hover:bg-pink-50 dark:hover:bg-slate-800 hover:text-pink-600 transition whitespace-nowrap"
            >
              🎠 Mobile
            </a>
            <a
              href="#projects-showcase"
              className="px-2.5 py-1.5 rounded-full hover:bg-pink-50 dark:hover:bg-slate-800 hover:text-pink-600 transition whitespace-nowrap"
            >
              🎹 4 Toys
            </a>
            <a
              href="#origin-story"
              className="px-2.5 py-1.5 rounded-full hover:bg-pink-50 dark:hover:bg-slate-800 hover:text-pink-600 transition whitespace-nowrap"
            >
              📖 Pop-Up Book
            </a>
            <a
              href="#guestbook-wall"
              className="px-2.5 py-1.5 rounded-full hover:bg-pink-50 dark:hover:bg-slate-800 hover:text-pink-600 transition whitespace-nowrap"
            >
              💌 Wish Garland
            </a>
          </nav>

          {/* Action Toggles */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <button
              type="button"
              onClick={onToggleMute}
              data-testid="global-mute-toggle"
              aria-pressed={muted}
              aria-label={muted ? "Unmute nursery sounds" : "Mute nursery sounds"}
              className={`inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-mono font-bold border-2 transition whitespace-nowrap ${
                muted
                  ? "bg-pink-100 border-pink-400 text-pink-800 dark:bg-pink-950 dark:text-pink-200"
                  : "bg-pink-500 border-pink-600 text-white shadow-sm"
              }`}
            >
              {muted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 shrink-0" />
                  <span>Muted</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 shrink-0" />
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
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-mono font-bold border-2 border-sky-300 bg-sky-100 hover:bg-sky-200 text-sky-950 transition whitespace-nowrap"
            >
              {isNight ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Day Sky ☀️</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                  <span>Night Sky 🌙</span>
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
              className={`inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-mono font-bold border-2 transition whitespace-nowrap ${
                chaosMode
                  ? "bg-amber-300 border-amber-500 text-slate-950 shadow-sm"
                  : "border-pink-200 bg-pink-50 hover:bg-pink-100 text-pink-900 dark:bg-slate-800 dark:text-pink-200"
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5 text-pink-500 shrink-0" />
              <span>{chaosMode ? "Toybox ON" : "Toybox"}</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
