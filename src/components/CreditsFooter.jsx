import React from "react";
import { Heart, Sparkles, Palette } from "lucide-react";
import { BITZ_CHARACTER_SHEET } from "@/lib/characterData";

export default function CreditsFooter({
  sparkleEnabled,
  onToggleSparkle,
  easterEggUnlocked,
}) {
  return (
    <footer className="mt-16 border-t border-indigo-500/20 glass-panel py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="font-display font-bold text-xl text-espresso">
              Bitz<span className="text-indigo-600 dark:text-sky-400">.sky</span> ·
              Celestial Cloud Sanctuary
            </div>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              Built with wide-eyed curiosity for{" "}
              <strong>haX.baby — Baby&apos;s First Website (48-Hour Hackathon)</strong>.
              Track 2: Your Own Baby (100% Original 3D Character & World).
            </p>
            <div className="pt-1 text-xs font-mono text-indigo-600 dark:text-sky-300 font-bold">
              Registration Ref: {BITZ_CHARACTER_SHEET.registrationRef}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-sky-300 font-bold flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" />
              Official Credits & Attributions (Sec 09/10)
            </h4>
            <ul className="text-xs text-muted space-y-1.5 leading-relaxed">
              <li>
                <strong>3D Character & Studio Renders:</strong> 100% Original 3D
                Plushie Renders (`bitz_hero_portrait.jpg`, `bitz_lullaby_box.jpg`,
                `bitz_aurora_jar.jpg`) & Interactive Three.js WebGL Stage created
                during the 17–19 Oct 2026 sprint.
              </li>
              <li>
                <strong>Sound & Lullaby Synth:</strong> 100% Procedural Web Audio API
                oscillators & wind-chime synthesis.
              </li>
              <li>
                <strong>Open-Source Libraries:</strong> Next.js, React, Three.js,
                Tailwind CSS, Lucide Icons, and canvas-confetti.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-sky-300 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Early-Web Toybox Controls
            </h4>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onToggleSparkle}
                className="px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold border border-indigo-500/30 bg-white/60 dark:bg-slate-900/60 text-espresso hover:border-indigo-500 transition"
              >
                {sparkleEnabled ? "✨ Sparkle Trail: ON (+2 pts)" : "✨ Sparkle Trail: OFF"}
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-white/55 dark:bg-slate-900/60 border border-indigo-500/20 text-xs font-mono">
              {easterEggUnlocked ? (
                <span className="text-emerald-500 font-bold">
                  🏆 Secret Unlocked: Rainbow Aurora Star-Bell Master!
                </span>
              ) : (
                <span className="text-muted">
                  🥚 Secret Hint: Tap Bitz&apos;s golden star-bell 3 times!
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-indigo-500/15 flex flex-wrap items-center justify-between gap-4 text-xs text-muted font-mono">
          <span className="inline-flex items-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 text-pink-500 fill-current" /> by R.
            V. Ramakrishna · October 17–19, 2026
          </span>
          <span>Celestial Cloud-Glass Edition · Track 2</span>
        </div>
      </div>
    </footer>
  );
}
