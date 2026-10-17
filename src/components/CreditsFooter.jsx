import React from "react";
import { Heart, Sparkles, Palette } from "lucide-react";
import { BITZ_CHARACTER_SHEET } from "@/lib/characterData";

export default function CreditsFooter({
  sparkleEnabled,
  onToggleSparkle,
  easterEggUnlocked,
}) {
  return (
    <footer className="mt-12 border-t-2 border-pink-200 dark:border-slate-800 glass-panel pt-10 pb-24 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="font-display font-bold text-xl text-espresso">
              Mochi<span className="text-pink-500">.sky</span> ·
              Celestial Cloud Sanctuary
            </div>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              Built with wide-eyed curiosity for{" "}
              <strong>haX.baby — Baby&apos;s First Website (48-Hour Hackathon)</strong>.
              Track 2: Your Own Baby (100% Original 3D Plushie Character &amp; World).
            </p>
            <div className="pt-1 text-xs font-mono text-pink-600 dark:text-pink-300 font-bold">
              Registration Ref: {BITZ_CHARACTER_SHEET.registrationRef}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-sky-700 dark:text-sky-300 font-bold flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-pink-500 shrink-0" />
              <span>Credits &amp; Craft Attributions</span>
            </h4>
            <ul className="text-xs text-muted space-y-1.5 leading-relaxed">
              <li>
                <strong>3D Plushie Character &amp; Dress-Up Wardrobe:</strong> 100% Original
                Multi-Part Interactive 3D Plushie Rig with 5 Baby Outfits created during the
                17–19 Oct 2026 sprint.
              </li>
              <li>
                <strong>1773 Symphony &amp; Nursery Lullaby Synth:</strong> 100% Procedural Web Audio API
                Violin, Grand Piano, Indian Bansuri Flute &amp; Music Box synthesis.
              </li>
              <li>
                <strong>Open-Source Libraries:</strong> Next.js, React, Tailwind CSS,
                Lucide Icons, and canvas-confetti.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-sky-700 dark:text-sky-300 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-500 shrink-0" />
              <span>Atmosphere Controls</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onToggleSparkle}
                className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold border-2 border-pink-300 bg-pink-50 hover:bg-pink-100 text-pink-900 dark:bg-slate-800 dark:text-pink-200 transition"
              >
                {sparkleEnabled ? "✨ Sparkle Cursor Trail: ON" : "✨ Sparkle Cursor Trail: OFF"}
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-sky-50 dark:bg-slate-800 border-2 border-sky-200 dark:border-slate-700 text-xs font-mono">
              {easterEggUnlocked ? (
                <span className="text-pink-600 dark:text-pink-300 font-bold">
                  🏆 Secret Unlocked: Rainbow Star-Bell Confetti Master!
                </span>
              ) : (
                <span className="text-muted">
                  🥚 Secret Hint: Tap Mochi&apos;s golden star-bell 3 times!
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t-2 border-pink-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-muted font-mono">
          <span className="inline-flex items-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 text-pink-500 fill-current" /> by R.
            V. Ramakrishna · October 17–19, 2026
          </span>
          <span>Baby Pink &amp; Light Sky Blue Edition · Track 2</span>
        </div>
      </div>
    </footer>
  );
}
