"use client";

import React from "react";
import {
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Sparkles,
  Flame,
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
    <header className="sticky top-0 z-50 backdrop-blur-md bg-cream/85 border-b border-[#a34063]/20 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand Identity + Returning Visitor Memory Pill */}
        <div className="flex items-center gap-3">
          <a
            href="#top"
            onClick={() => soundEngine.playClick(1.1)}
            className="inline-flex items-center gap-2 font-display font-bold text-lg sm:text-xl text-espresso hover:text-[#a34063] transition"
          >
            <span className="w-8 h-8 rounded-xl bg-[#a34063] text-[#fff8f1] inline-flex items-center justify-center shadow-sm">
              <Cloud className="w-4 h-4 fill-current" />
            </span>
            <span>
              Bitz<span className="text-[#a34063]">.sky</span>
            </span>
          </a>

          <span
            data-testid="visitor-memory-badge"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono bg-[#a34063]/10 text-[#a34063] border border-[#a34063]/20"
          >
            <Sparkles className="w-3 h-3" />
            {visitCount > 1
              ? `Welcome back, Friend! (Visit #${visitCount})`
              : "First Nursery Visit ✨"}
          </span>
        </div>

        {/* Quick Section Links */}
        <nav
          aria-label="Primary Portfolio Navigation"
          className="hidden md:flex items-center gap-5 text-xs font-semibold text-espresso/80"
        >
          <a href="#character-sheet" className="hover:text-[#a34063] transition">
            1. What Bitz Is
          </a>
          <a href="#projects-showcase" className="hover:text-[#a34063] transition">
            2. Creations (4)
          </a>
          <a href="#origin-story" className="hover:text-[#a34063] transition">
            3. Origin Story
          </a>
          <a href="#nursery-chat" className="hover:text-[#a34063] transition">
            Chat
          </a>
          <a href="#guestbook-wall" className="hover:text-[#a34063] transition">
            Guestbook
          </a>
        </nav>

        {/* Interactive Controls: Mute Switch (Mandatory) + Day/Night + Chaos Mode */}
        <div className="flex items-center gap-2">
          {/* Mandatory Visible Mute Toggle (+3 pts Side Quest & Section 09 Rule) */}
          <button
            type="button"
            onClick={onToggleMute}
            data-testid="global-mute-toggle"
            aria-pressed={muted}
            aria-label={muted ? "Unmute nursery sounds" : "Mute nursery sounds"}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold border-2 transition ${
              muted
                ? "bg-rose-950/10 border-rose-500/40 text-rose-600 dark:text-rose-300"
                : "bg-[#a34063] border-[#a34063] text-[#fff8f1] shadow-sm"
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
              isNight ? "Switch to Sunbeam Day mode" : "Switch to Starlight Night mode"
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold border-2 border-[#a34063]/30 bg-card text-espresso hover:border-[#a34063] transition"
          >
            {isNight ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Sunbeam</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[#a34063]" />
                <span className="hidden sm:inline">Starlight</span>
              </>
            )}
          </button>

          {/* Responsive Chaos Mode Toggle (+5 pts Side Quest) */}
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
                ? "bg-amber-400 border-espresso text-espresso animate-bounce"
                : "border-[#a34063]/30 bg-card text-espresso hover:border-[#a34063]"
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-[#a34063]" />
            <span>{chaosMode ? "90s Chaos ON!" : "90s Chaos"}</span>
          </button>
        </div>
      </div>

      {/* Nostalgic 90s Marquee Ribbon when Chaos Mode is active */}
      {chaosMode && (
        <div className="bg-[#a34063] text-[#fff8f1] py-1 px-3 text-xs font-mono overflow-hidden whitespace-nowrap border-t border-white/20">
          <div className="animate-marquee inline-block">
            ★ WELCOME TO BITZ&apos;S 1999 SKY-LOFT WEB CORNER ★ BEST VIEWED WITH WIDE-EYED CURIOSITY ★ EVERY CLOUD HAND-WOVEN FOR HAX.BABY HACKATHON ★ CLICK BITZ&apos;S ANTENNA 3 TIMES FOR RAINBOW OVERDRIVE ★
          </div>
        </div>
      )}
    </header>
  );
}
