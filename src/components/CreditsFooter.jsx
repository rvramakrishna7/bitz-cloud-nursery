import React from "react";
import { Heart, Sparkles, Code2, Volume2, Palette } from "lucide-react";
import { BITZ_CHARACTER_SHEET } from "@/lib/characterData";

export default function CreditsFooter({
  sparkleEnabled,
  onToggleSparkle,
  easterEggUnlocked,
}) {
  return (
    <footer className="mt-16 border-t-2 border-[#a34063]/20 bg-card/90 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Character & Hackathon Identity */}
          <div className="space-y-2">
            <div className="font-display font-bold text-xl text-espresso">
              Bitz<span className="text-[#a34063]">.sky</span> · Sky-Loft Nursery
            </div>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              Built with wide-eyed curiosity for{" "}
              <strong>haX.baby — Baby&apos;s First Website (48-Hour Hackathon)</strong>.
              Track 2: Your Own Baby (100% Original Character & World).
            </p>
            <div className="pt-1 text-xs font-mono text-[#a34063] font-bold">
              Registration Ref: {BITZ_CHARACTER_SHEET.registrationRef}
            </div>
          </div>

          {/* Column 2: Mandatory Section 09 & 10 Art, Audio & Library Attributions */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#a34063] font-bold flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" />
              Official Credits & Attributions (Sec 09/10)
            </h4>
            <ul className="text-xs text-muted space-y-1.5 leading-relaxed">
              <li>
                <strong>Character & Illustrations:</strong> 100% Original Hand-Crafted
                SVG & HTML5 Canvas Artwork created during the 17–19 Oct 2026 sprint
                (Zero external IP).
              </li>
              <li>
                <strong>Sound & Lullaby Synth:</strong> 100% Procedural Web Audio API
                oscillators & wind-chime synthesis (Zero copyrighted audio samples).
              </li>
              <li>
                <strong>Open-Source Libraries:</strong> Next.js, React, Tailwind CSS,
                Lucide Icons, and canvas-confetti.
              </li>
            </ul>
          </div>

          {/* Column 3: Interactive Toy Settings & Easter Egg Status */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#a34063] font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Early-Web Toybox Controls
            </h4>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onToggleSparkle}
                className="px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold border border-[#a34063]/30 bg-cream text-espresso hover:border-[#a34063] transition"
              >
                {sparkleEnabled ? "✨ Sparkle Trail: ON (+2 pts)" : "✨ Sparkle Trail: OFF"}
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-cream border border-[#a34063]/20 text-xs font-mono">
              {easterEggUnlocked ? (
                <span className="text-emerald-600 font-bold">
                  🏆 Secret Unlocked: Rainbow Storm Antenna Master!
                </span>
              ) : (
                <span className="text-muted">
                  🥚 Secret Hint: Try tapping Bitz&apos;s brass lightning antenna 3 times!
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#a34063]/15 flex flex-wrap items-center justify-between gap-4 text-xs text-muted font-mono">
          <span className="inline-flex items-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 text-[#a34063] fill-current" /> by R.
            V. Ramakrishna · October 17–19, 2026
          </span>
          <span>“Good things start small.” · haX.baby #001</span>
        </div>
      </div>
    </footer>
  );
}
