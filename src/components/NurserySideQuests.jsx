"use client";

import React, { useState, useEffect } from "react";
import {
  MessageCircle,
  Send,
  BookHeart,
  Eye,
  CheckCircle2,
  Sparkles,
  Radio,
} from "lucide-react";
import { BITZ_CHAT_PRESETS } from "@/lib/characterData";
import { soundEngine } from "@/lib/soundEngine";

export default function NurserySideQuests() {
  const [chatHistory, setChatHistory] = useState([
    {
      sender: "mochi",
      text: "*waves tiny cloud hand & twirls candy wand* Hiya! I'm Mochi! Tap a bubble below or whisper a message into my Cloud Walkie-Talkie!",
    },
  ]);
  const [customChatInput, setCustomChatInput] = useState("");

  const [odometerCount, setOdometerCount] = useState(1208);
  const [entries, setEntries] = useState([]);
  const [guestName, setGuestName] = useState("");
  const [guestMood, setGuestMood] = useState("🌟 Starlight Wish");
  const [guestMessage, setGuestMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitFeedback, setSubmitFeedback] = useState("");

  useEffect(() => {
    let mounted = true;
    try {
      const cached = window.localStorage.getItem("bitz_guestbook_cache");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.entries) setEntries(parsed.entries);
        if (parsed.odometerCount) setOdometerCount(parsed.odometerCount);
      }
    } catch (e) {}

    fetch("/api/guestbook?bump=1")
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        if (Array.isArray(data.entries)) {
          setEntries(data.entries);
        }
        if (typeof data.odometerCount === "number") {
          setOdometerCount(data.odometerCount);
        }
        try {
          window.localStorage.setItem("bitz_guestbook_cache", JSON.stringify(data));
        } catch (e) {}
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  const handleAskPreset = (preset, idx = 0) => {
    soundEngine.playCardChord(idx);
    setChatHistory((prev) => [
      ...prev,
      { sender: "visitor", text: preset.question },
      { sender: "mochi", text: preset.answer },
    ]);
  };

  const handleCustomChatSubmit = (e) => {
    e.preventDefault();
    const trimmed = customChatInput.trim();
    if (!trimmed) return;
    soundEngine.playGiggle();

    const lower = trimmed.toLowerCase();
    let reply =
      "*jingles golden star-bell happily* Ting-ring! That sounds super cozy! I just wrapped your wish inside a pastel rainbow bubble!";
    if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
      reply =
        "*bounces on marshmallow cloud* Hiya bestie! Try dressing me up in my Berry Onesie or Bunny Hoodie and playing my 4 musical toys!";
    } else if (lower.includes("rain") || lower.includes("weather") || lower.includes("cloud")) {
      reply =
        "*puffs up proudly* Every storm cloud is just a sleepy baby waiting for a lullaby! I tune raindrops into Violin & Bansuri wind chimes!";
    } else if (lower.includes("win") || lower.includes("hackathon") || lower.includes("judge")) {
      reply =
        "*twirls rainbow candy wand* We built this sanctuary with 100% original 3D plushie art, real baby outfits, and live Web Audio music!";
    }

    setChatHistory((prev) => [
      ...prev,
      { sender: "visitor", text: trimmed },
      { sender: "mochi", text: reply },
    ]);
    setCustomChatInput("");
  };

  const handleGuestbookSubmit = async (e) => {
    e.preventDefault();
    if (!guestName.trim() || !guestMessage.trim()) {
      setSubmitFeedback("Please enter both your name and a cozy dream wish!");
      return;
    }

    setSubmitting(true);
    setSubmitFeedback("");
    soundEngine.playSecretLullaby();

    const optimisticEntry = {
      id: `local-${Date.now()}`,
      name: guestName.trim(),
      mood: guestMood,
      message: guestMessage.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: optimisticEntry.name,
          mood: optimisticEntry.mood,
          message: optimisticEntry.message,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const updatedEntries = [data.entry, ...entries];
        const nextCount = data.odometerCount || odometerCount + 1;
        setEntries(updatedEntries);
        setOdometerCount(nextCount);
        try {
          window.localStorage.setItem(
            "bitz_guestbook_cache",
            JSON.stringify({ entries: updatedEntries, odometerCount: nextCount })
          );
        } catch (err) {}
      } else {
        setEntries((prev) => [optimisticEntry, ...prev]);
        setOdometerCount((c) => c + 1);
      }
    } catch (err) {
      setEntries((prev) => [optimisticEntry, ...prev]);
      setOdometerCount((c) => c + 1);
    } finally {
      setGuestName("");
      setGuestMessage("");
      setSubmitting(false);
      setSubmitFeedback("✨ Your wish-tag is now hanging on Mochi's Starlight Garland!");
    }
  };

  const formattedOdometer = String(odometerCount).padStart(6, "0").split("");

  const quickWishStickers = [
    {
      label: "💖 Cutest Mochi!",
      mood: "🌟 Starlight Wish",
      text: "Mochi is the cutest 3D cloud baby ever! Loved the Bunny Hoodie outfit & Candy Wand! 💖☁️",
    },
    {
      label: "🎻 Love the 4 Tunes!",
      mood: "🌧️ Cozy Raindrop",
      text: "The Violin, Bansuri Flute, Waltz & 90s Synth variations sound magical! 🎻🪈✨",
    },
    {
      label: "🌈 Rainbow Confetti!",
      mood: "🌈 Rainbow Spark",
      text: "Tapped the golden star-bell 3 times and unlocked the sky confetti shower! 🌈🔔",
    },
  ];

  return (
    <div className="py-8 sm:py-14 px-3 sm:px-4 max-w-6xl mx-auto space-y-12">
      {/* 1. FLOATING PASTEL SKY-BLIMP VISITOR ODOMETER */}
      <section
        aria-label="Vintage Nursery Hit Counter Odometer"
        data-testid="hit-counter-odometer"
        className="relative max-w-4xl mx-auto pt-6"
      >
        {/* Decorative Blimp Top Fin & Balloon Canopy */}
        <div
          aria-hidden="true"
          className="mx-auto w-44 sm:w-64 h-7 rounded-t-full bg-gradient-to-r from-pink-300 via-sky-300 to-pink-300 dark:from-pink-900 dark:via-sky-800 dark:to-pink-900 border-2 border-b-0 border-pink-400 flex items-center justify-center text-xs font-mono font-bold text-espresso shadow-sm"
        >
          🎈 MOCHI SKY-BLIMP #1773 🎈
        </div>

        <div className="rounded-[3.5rem] bg-gradient-to-r from-pink-100/95 via-white/95 to-sky-100/95 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-4 border-pink-300 dark:border-sky-600 p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 hover:scale-[1.01] transition-transform">
          <div className="text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-sky-100 text-sky-900 dark:bg-sky-950/70 dark:text-sky-200 font-bold border border-sky-300">
              <Eye className="w-3.5 h-3.5 text-pink-500 shrink-0" />
              <span>✨ Live 90s Sky-Blimp Odometer</span>
            </span>
            <h3 className="mt-2 text-2xl sm:text-3xl font-bold text-espresso font-display">
              Weather Wishes &amp; Dreams Delivered
            </h3>
            <p className="text-xs sm:text-sm text-muted mt-1">
              Click any spinning number tile below to ring a chime and boost Mochi&apos;s sky-blimp altitude!
            </p>
          </div>

          {/* Interactive Bouncing 3D Flip-Clock Tiles */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-b from-pink-200/80 to-sky-200/80 dark:from-slate-950 dark:to-slate-900 p-3 sm:p-4 rounded-[2rem] border-2 border-pink-400 dark:border-sky-500 shadow-inner shrink-0">
            {formattedOdometer.map((digit, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  soundEngine.playCardChord(index);
                  setOdometerCount((c) => c + 1);
                }}
                title="Tap to flip digit & chime!"
                className="w-9 h-12 sm:w-11 sm:h-14 rounded-2xl bg-white dark:bg-slate-800 border-b-4 border-2 border-sky-400 dark:border-pink-400 text-pink-600 dark:text-pink-300 font-mono text-xl sm:text-2xl font-bold inline-flex items-center justify-center shadow-md hover:-translate-y-1.5 active:translate-y-0.5 transition-transform"
              >
                {digit}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. SCULPTED TOY CLOUD WALKIE-TALKIE (CHARACTER CHAT) */}
      <section
        id="nursery-chat"
        aria-labelledby="chat-heading"
        data-testid="character-chat-section"
        className="relative max-w-4xl mx-auto pt-8"
      >
        {/* Walkie-Talkie Bobbing Star Antenna on Top */}
        <div
          aria-hidden="true"
          className="flex flex-col items-center justify-center -mb-2 relative z-10 pointer-events-none"
        >
          <div className="w-9 h-9 rounded-full bg-amber-300 border-2 border-amber-500 shadow-md flex items-center justify-center text-lg animate-bounce">
            ⭐
          </div>
          <div className="w-2 h-6 bg-gradient-to-b from-amber-400 to-pink-400 rounded-full" />
        </div>

        {/* Sculpted Toy Walkie-Talkie Shell */}
        <div className="rounded-[3rem] bg-gradient-to-b from-sky-100/95 via-white/95 to-pink-100/90 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-4 border-sky-300 dark:border-sky-600 p-5 sm:p-8 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b-2 border-dashed border-sky-200 dark:border-slate-700">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-pink-100 text-pink-700 dark:bg-pink-950/70 dark:text-pink-200 font-bold border border-pink-300">
                <Radio className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                <span>☁️ Direct Sky-Line · Toy Cloud Walkie-Talkie</span>
              </span>
              <h3
                id="chat-heading"
                className="mt-2 text-2xl sm:text-3xl font-bold text-espresso font-display"
              >
                Whisper to Mochi on the Cloud-Phone
              </h3>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/90 dark:bg-emerald-950/80 border border-emerald-400 text-xs font-mono text-emerald-800 dark:text-emerald-300 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span>Mochi is Listening ☁️</span>
            </div>
          </div>

          {/* Walkie-Talkie Cloud Screen */}
          <div className="mt-4 max-h-64 overflow-y-auto space-y-3 p-4 sm:p-5 rounded-[2rem] bg-gradient-to-b from-sky-50/90 to-pink-50/70 dark:from-slate-950/90 dark:to-slate-900/90 border-2 border-sky-300 dark:border-slate-700 shadow-inner">
            {chatHistory.map((item, idx) => (
              <div
                key={idx}
                className={`flex ${
                  item.sender === "visitor" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-md px-4 py-3 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-sm transition-transform hover:scale-[1.01] ${
                    item.sender === "visitor"
                      ? "bg-pink-500 text-white font-semibold rounded-br-none"
                      : "bg-white dark:bg-slate-800 border-2 border-pink-200 dark:border-slate-700 text-espresso rounded-bl-none"
                  }`}
                >
                  <span className="block text-[10px] font-mono uppercase opacity-80 mb-0.5 font-bold">
                    {item.sender === "visitor" ? "You ✨" : "Mochi ☁️🍭"}
                  </span>
                  {item.text}
                </div>
              </div>
            ))}
          </div>

          {/* Preset Cloud Question Bubbles */}
          <div className="mt-4 flex flex-wrap gap-2">
            {BITZ_CHAT_PRESETS.map((preset, idx) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleAskPreset(preset, idx)}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white dark:bg-slate-800 hover:bg-pink-500 hover:text-white text-espresso border-2 border-sky-300 dark:border-slate-600 transition-all hover:-translate-y-0.5 shadow-sm"
              >
                💬 {preset.question}
              </button>
            ))}
          </div>

          <form onSubmit={handleCustomChatSubmit} className="mt-4 flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={customChatInput}
              onChange={(e) => setCustomChatInput(e.target.value)}
              placeholder="Say something cozy to Mochi..."
              aria-label="Message to Mochi"
              className="flex-1 px-4 py-2.5 rounded-full text-xs sm:text-sm bg-white dark:bg-slate-900 border-2 border-pink-300 dark:border-sky-600 text-espresso focus:outline-none focus:border-pink-500"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white border-2 border-pink-600 transition shadow-sm shrink-0"
            >
              <Send className="w-3.5 h-3.5 shrink-0" />
              <span>Beam to Cloud</span>
            </button>
          </form>
        </div>
      </section>

      {/* 3. HANGING STARLIGHT WISH-GARLAND & CORK PINBOARD (GUESTBOOK) */}
      <section
        id="guestbook-wall"
        aria-labelledby="guestbook-heading"
        data-testid="live-guestbook-section"
        className="rounded-[3rem] bg-gradient-to-br from-pink-100/90 via-white/95 to-sky-100/90 dark:from-slate-900 dark:via-slate-800/95 dark:to-slate-900 border-4 border-pink-300 dark:border-sky-700 p-5 sm:p-8 shadow-xl"
      >
        <div className="pb-5 border-b-2 border-dashed border-pink-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-sky-100 text-sky-900 dark:bg-sky-950/70 dark:text-sky-200 font-bold border border-sky-300">
              <BookHeart className="w-3.5 h-3.5 text-pink-500 shrink-0" />
              <span>💌 Hanging Starlight Wish-Garland</span>
            </span>
            <h3
              id="guestbook-heading"
              className="mt-2 text-2xl sm:text-3xl font-bold text-espresso font-display"
            >
              Pin a Wish-Tag on Mochi&apos;s Sky Garland
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-muted">
              Every note hangs like a tilted paper wish-lantern—tap a 1-click sticker or write your own!
            </p>
          </div>

          {/* 1-Click Quick-Fill Sticker Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-mono font-bold text-pink-600 dark:text-pink-300 mr-1">
              <Sparkles className="w-3 h-3 inline mr-1" />
              1-Click Sticker:
            </span>
            {quickWishStickers.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  soundEngine.playCardChord(idx);
                  if (!guestName) setGuestName("Starlight Friend ✨");
                  setGuestMood(s.mood);
                  setGuestMessage(s.text);
                }}
                className="px-3 py-1 rounded-full text-[11px] font-bold bg-white dark:bg-slate-800 hover:bg-pink-500 hover:text-white text-espresso border border-pink-300 dark:border-slate-600 transition shadow-sm"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 items-start">
          {/* Left: Sculpted Postbox Form */}
          <form
            onSubmit={handleGuestbookSubmit}
            className="lg:col-span-5 space-y-4 bg-white/95 dark:bg-slate-900 p-5 sm:p-6 rounded-[2.2rem] border-2 border-pink-300 dark:border-slate-700 shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-pink-600 dark:text-pink-300">
                📮 CLOUD POSTBOX
              </span>
              <span className="text-lg select-none">💌</span>
            </div>

            <div>
              <label
                htmlFor="guest-name"
                className="block text-xs font-mono uppercase text-espresso font-bold mb-1"
              >
                Your Name *
              </label>
              <input
                id="guest-name"
                type="text"
                required
                maxLength={40}
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g., Captain Starlight"
                className="w-full px-3.5 py-2 rounded-2xl text-xs sm:text-sm bg-sky-50/60 dark:bg-slate-800 border-2 border-sky-200 dark:border-slate-700 text-espresso focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label
                htmlFor="guest-mood"
                className="block text-xs font-mono uppercase text-espresso font-bold mb-1"
              >
                Wish Stamp
              </label>
              <select
                id="guest-mood"
                value={guestMood}
                onChange={(e) => setGuestMood(e.target.value)}
                className="w-full px-3.5 py-2 rounded-2xl text-xs sm:text-sm bg-sky-50/60 dark:bg-slate-800 border-2 border-sky-200 dark:border-slate-700 text-espresso focus:outline-none focus:border-pink-500"
              >
                <option value="🌟 Starlight Wish">🌟 Starlight Wish</option>
                <option value="🌧️ Cozy Raindrop">🌧️ Cozy Raindrop</option>
                <option value="🌈 Rainbow Spark">🌈 Rainbow Spark</option>
                <option value="⛵ Paper-Boat Note">⛵ Paper-Boat Note</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="guest-message"
                className="block text-xs font-mono uppercase text-espresso font-bold mb-1"
              >
                Your Dream Wish *
              </label>
              <textarea
                id="guest-message"
                rows={3}
                required
                maxLength={220}
                value={guestMessage}
                onChange={(e) => setGuestMessage(e.target.value)}
                placeholder="Write a sweet wish for Mochi..."
                className="w-full px-3.5 py-2 rounded-2xl text-xs sm:text-sm bg-sky-50/60 dark:bg-slate-800 border-2 border-sky-200 dark:border-slate-700 text-espresso focus:outline-none focus:border-pink-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 rounded-full text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white border-2 border-pink-600 disabled:opacity-50 transition shadow-sm"
            >
              {submitting ? "Hanging Wish-Tag..." : "Hang Wish-Tag on Garland ✨"}
            </button>

            {submitFeedback && (
              <p
                role="status"
                className="text-xs font-mono text-emerald-600 dark:text-emerald-300 flex items-center gap-1.5 font-bold"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{submitFeedback}</span>
              </p>
            )}
          </form>

          {/* Right: Tilted Hanging Polaroid / Wish-Tags Grid with Playful Hover Transforms */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[420px] overflow-y-auto p-2">
            {entries.map((entry, idx) => {
              const tiltClass =
                idx % 2 === 0
                  ? "-rotate-1 hover:rotate-0"
                  : "rotate-1 hover:rotate-0";
              return (
                <article
                  key={entry.id}
                  onClick={() => soundEngine.playCardChord(idx)}
                  className={`relative pt-6 pb-4 px-4 rounded-[1.8rem] bg-white dark:bg-slate-900 border-2 border-sky-300 dark:border-slate-700 shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl cursor-pointer ${tiltClass}`}
                >
                  {/* Top Clothespin / Push-Pin Badge */}
                  <span
                    aria-hidden="true"
                    className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-pink-200 dark:bg-pink-900 border border-pink-400 flex items-center justify-center text-xs shadow-sm select-none"
                  >
                    📌
                  </span>

                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <strong className="text-sm font-display text-espresso truncate">
                      {entry.name}
                    </strong>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-200 border border-pink-300 font-bold shrink-0">
                      {entry.mood}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-espresso/90 leading-relaxed">
                    {entry.message}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
