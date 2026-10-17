# ☁️ Meet Bitz · The Baby Cloud-Sprite (`Bitz.sky`)

> **Official Submission for [haX.baby — Baby's First Website (48-Hour Hackathon)](https://hax.baby/first-website)**  
> **Track:** Track 2 — Your Own Baby (100% Original Character & World)  
> **Builder:** R. V. Ramakrishna (`HAX-456DA90F0BD7458D`) · Building Solo  
> **Sprint Window:** 17–19 October 2026 (17:17 IST)

---

## 🌟 1. Official 5-Point Character Sheet (Section 04 Compliance)

| Field | Description |
| :--- | :--- |
| **1. Name** | **Bitz** (*Junior Weather Weaver & Cloud-Sprite Hatchling*) |
| **2. What they are** | **Cumulus Nimbus Sprite (0.4 marshmallows heavy)** — A fluffy, warm-cream baby cloud sprite with rosy rainbow-blush cheeks, wide starry amber eyes, and a tiny brass lightning-rod antenna that twinkles whenever a good idea strikes. |
| **3. What they do** | **Junior Weather Weaver at the Sky-Loft Nursery.** Bitz catches stray static sparks, tangled breezes, and nighttime worries, weaving them into soothing raindrop lullabies, bottled auroras, and paper-boat dreams. |
| **4. Their story** | Born from a stray giggle and a golden sunbeam inside an old copper weathervane at 04:17 AM, Bitz tumbled into the Sky-Loft Nursery with a pocketful of unspun dew. Now Bitz drifts from rooftop to rooftop, making sure every creature sleeps under a gentle sky. |
| **5. Tagline** | *“I weave stray sparks into cozy skies and bedtime rainbows.”* |

---

## 🎮 2. Mandatory Core Features & Tier 1–3 Standouts

### ✅ Section 05 Core Requirements
1. **What They Are (Hero Stage):** Custom interactive SVG illustration of **Bitz** with cursor/touch pupil tracking, head-tilt physics, belly-tickle giggles, and the 5-Point Identity Passport.
2. **What They Do (4 Playable Showcase Creations):**
   - **Project 01 — The Raindrop Lullaby Lab (Tier 2):** Interactive 6-puddle pentatonic Web Audio API synthesizer + auto-winding Golden Music Box sequencer.
   - **Project 02 — Bottled Aurora Nightlights (Tier 2):** Interactive darkroom nursery with a toggleable **Starlight Torch / Flashlight Cursor Mask** revealing hidden bedtime constellations.
   - **Project 03 — Paper-Boat Dream Delivery Routes (Tier 2):** Scroll/scrub-synced SVG rooftop flight path with clickable delivery stops and cargo manifests.
   - **Project 04 — Cumulus Block & Rattle Toybox (Tier 2):** Playable cloud-block tower stacker mini-game (with tumble physics at 7 blocks!) and interactive brass rattle.
3. **What Their Story Is (Origin Story Scroll & Flipbook):** 4-chapter interactive bedtime storybook where every scene is strictly **under 60 words** (honoring the $\le 150$-word Golden Rule).
4. **Immersion:** Real-time cursor & mobile touch eye-tracking, procedural Web Audio sound effects, and **Sunbeam Day / Starlight Night** mood theme toggle.
5. **Mobile-First Responsive Layout:** Tested across 320px–1440px+ screens with large touch targets and `prefers-reduced-motion` accessibility.
6. **Hidden Easter Egg:** Tapping Bitz's brass lightning-rod antenna **3 times** unlocks **Rainbow Storm Overdrive**, triggers a secret Web Audio melody, fires pastel confetti, and awards a collector badge!

### 🏆 All 5 Bonus Side Quests (+13 / +13 Bonus Points)
- **Live Guestbook (+2 pts):** Persistent Sky-Loft Dream Wall backed by `/api/guestbook` + instant `localStorage` optimistic sync.
- **Sparkle Cursor Trail (+2 pts):** 60fps HTML5 Canvas 4-point retro star glitter trail.
- **Hit Counter Odometer (+1 pt):** Vintage 6-digit rolling visitor & dream-wish odometer.
- **Click Sounds + Accessible Mute Switch (+3 pts):** Procedural Web Audio clicks/chimes on interactive elements with an always-visible sticky **Mute/Sound ON** toggle in the top navbar.
- **Responsive Chaos Mode (+5 pts):** One-click **90s Chaos Mode** toggle adding nostalgic marquee ribbons, chunky dashed borders, and retro dot-matrix backgrounds.

### 🚀 Tier 3 Boss Features
- **Character Remembers Returning Visitors:** Tracks visit count in `localStorage` and displays a custom *"Welcome back, Friend! (Visit #N)"* badge.
- **Character Chats Back:** Interactive *"Whisper to Bitz on the Cloud-Phone"* dialogue engine with preset and custom responses in Bitz's voice.

---

## 🛠️ 3. Tech Stack & Local Setup

- **Framework:** Next.js 15 (App Router) + React 19
- **Styling:** Tailwind CSS + CSS Custom Properties (`#fff8f1` Warm Cream, `#a34063` Berry, `#5c4033` Espresso, `#120d16` Starlight Night)
- **Audio & Graphics:** Native `Web Audio API` (procedural synthesis), `HTML5 Canvas`, custom `SVG`, `lucide-react`, `canvas-confetti`
- **Testing:** Vitest + React Testing Library (`src/test/portfolio.test.jsx`)

```bash
# 1. Install dependencies
npm install

# 2. Run automated acceptance test suite
npm test

# 3. Start local development server
npm run dev

# 4. Build for production
npm run build
```

---

## 🎨 4. Credits & Attributions (Sections 09 & 10 Compliance)

- **Character Concept, Lore & SVG/Canvas Art:** 100% Original creation by R. V. Ramakrishna during the October 17–19, 2026 sprint.
- **Audio Synthesis:** 100% Procedural Web Audio API oscillators (zero external audio files).
- **Fonts & Icons:** Google Fonts (`Fredoka`, `Fraunces`, `Plus Jakarta Sans`, `Space Mono`) & `lucide-react`.
