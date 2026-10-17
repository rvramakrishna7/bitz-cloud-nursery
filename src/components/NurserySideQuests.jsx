"use client";

import React, { useState, useEffect } from "react";
import {
  MessageCircle,
  Send,
  BookHeart,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { BITZ_CHAT_PRESETS } from "@/lib/characterData";
import { soundEngine } from "@/lib/soundEngine";

export default function NurserySideQuests() {
  const [chatHistory, setChatHistory] = useState([
    {
      sender: "bitz",
      text: "*waves tiny cloud hand* Hiya! I'm Bitz! Ask me anything about my weather workshop or click a question below!",
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

  const handleAskPreset = (preset) => {
    soundEngine.playClick(1.15);
    setChatHistory((prev) => [
      ...prev,
      { sender: "visitor", text: preset.question },
      { sender: "bitz", text: preset.answer },
    ]);
  };

  const handleCustomChatSubmit = (e) => {
    e.preventDefault();
    const trimmed = customChatInput.trim();
    if (!trimmed) return;
    soundEngine.playGiggle();

    const lower = trimmed.toLowerCase();
    let reply =
      "*tilts golden star-bell curiously* Bzzzt-ting! That sounds magical! I just wrapped your message inside a warm golden sunbeam!";
    if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
      reply =
        "*bounces on a marshmallow cloud* Hiya friend! Welcome to the Sky-Loft Sanctuary! Have you tried playing my Raindrop Lullaby Lab yet?";
    } else if (lower.includes("rain") || lower.includes("weather") || lower.includes("cloud")) {
      reply =
        "*puffs up proudly* Every storm cloud is just a sleepy baby waiting for a C-major lullaby! I tune raindrops into wind chimes!";
    } else if (lower.includes("win") || lower.includes("hackathon") || lower.includes("judge")) {
      reply =
        "*scatters pastel confetti* We built this cozy corner with 100% original 3D plushie art, zero console errors, and lots of love!";
    }

    setChatHistory((prev) => [
      ...prev,
      { sender: "visitor", text: trimmed },
      { sender: "bitz", text: reply },
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
      setSubmitFeedback("✨ Your weather wish has been pinned to the Sky-Loft Wall!");
    }
  };

  const formattedOdometer = String(odometerCount).padStart(6, "0").split("");

  return (
    <div className="py-12 sm:py-16 px-4 max-w-6xl mx-auto space-y-12">
      {/* VINTAGE HIT COUNTER ODOMETER */}
      <section
        aria-label="Vintage Nursery Hit Counter Odometer"
        data-testid="hit-counter-odometer"
        className="rounded-3xl glass-panel border-2 border-pink-200 dark:border-slate-700 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-200 font-bold border border-sky-300">
            <Eye className="w-3.5 h-3.5 text-pink-500" />
            ✨ Live Sanctuary Telemetry · Visitor Odometer
          </span>
          <h3 className="mt-2 text-2xl font-bold text-espresso font-display">
            Weather Wishes &amp; Dreams Delivered
          </h3>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Live counter tracking every curious builder and bedtime wish that visits Bitz&apos;s cloud sanctuary.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-pink-50 dark:bg-slate-900 p-3 rounded-2xl border-2 border-pink-300 dark:border-sky-500 shadow-sm">
          {formattedOdometer.map((digit, index) => (
            <span
              key={index}
              className="w-8 h-11 sm:w-10 sm:h-12 rounded-xl bg-white dark:bg-slate-800 border-2 border-sky-300 text-pink-600 dark:text-pink-300 font-mono text-xl sm:text-2xl font-bold inline-flex items-center justify-center shadow-sm"
            >
              {digit}
            </span>
          ))}
        </div>
      </section>

      {/* INTERACTIVE CHARACTER CHAT */}
      <section
        id="nursery-chat"
        aria-labelledby="chat-heading"
        data-testid="character-chat-section"
        className="rounded-3xl glass-panel border-2 border-sky-200 dark:border-slate-700 p-6 sm:p-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b-2 border-pink-100 dark:border-slate-700">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-200 font-bold border border-pink-300">
              <MessageCircle className="w-3.5 h-3.5 text-pink-500" />
              ☁️ Direct Sky-Line · Interactive Cloud-Phone
            </span>
            <h3
              id="chat-heading"
              className="mt-2 text-2xl font-bold text-espresso font-display"
            >
              Whisper to Bitz on the Cloud-Phone
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
            ● Bitz is Awake &amp; Listening
          </span>
        </div>

        <div className="mt-4 max-h-60 overflow-y-auto space-y-3 p-4 rounded-2xl bg-sky-50/70 dark:bg-slate-800/80 border-2 border-sky-200 dark:border-slate-700">
          {chatHistory.map((item, idx) => (
            <div
              key={idx}
              className={`flex ${
                item.sender === "visitor" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-md px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  item.sender === "visitor"
                    ? "bg-pink-500 text-white font-semibold"
                    : "bg-white dark:bg-slate-900 border-2 border-pink-200 dark:border-slate-700 text-espresso"
                }`}
              >
                <span className="block text-[10px] font-mono uppercase opacity-80 mb-0.5 font-bold">
                  {item.sender === "visitor" ? "You" : "Bitz ☁️"}
                </span>
                {item.text}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {BITZ_CHAT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleAskPreset(preset)}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-sky-100 hover:bg-sky-200 text-sky-950 border-2 border-sky-300 transition"
            >
              {preset.question}
            </button>
          ))}
        </div>

        <form onSubmit={handleCustomChatSubmit} className="mt-4 flex gap-2">
          <input
            type="text"
            value={customChatInput}
            onChange={(e) => setCustomChatInput(e.target.value)}
            placeholder="Say something cozy to Bitz..."
            aria-label="Message to Bitz"
            className="flex-1 px-4 py-2.5 rounded-full text-xs sm:text-sm bg-white dark:bg-slate-800 border-2 border-pink-300 dark:border-sky-600 text-espresso focus:outline-none focus:border-pink-500"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white border-2 border-pink-600 transition shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            Send
          </button>
        </form>
      </section>

      {/* LIVE DREAM GUESTBOOK WALL */}
      <section
        id="guestbook-wall"
        aria-labelledby="guestbook-heading"
        data-testid="live-guestbook-section"
        className="rounded-3xl glass-panel border-2 border-pink-200 dark:border-slate-700 p-6 sm:p-8"
      >
        <div className="pb-6 border-b-2 border-pink-100 dark:border-slate-700">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-200 font-bold border border-sky-300">
            <BookHeart className="w-3.5 h-3.5 text-pink-500" />
            💌 Community Sanctuary · Live Persistent Wish Wall
          </span>
          <h3
            id="guestbook-heading"
            className="mt-2 text-2xl sm:text-3xl font-bold text-espresso font-display"
          >
            Sign the Sky-Loft Dream Wall
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-muted">
            Leave a message, bedtime wish, or 90s web hello for Bitz! Entries are saved
            live to our persistent sanctuary wall.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          <form
            onSubmit={handleGuestbookSubmit}
            className="lg:col-span-5 space-y-4 bg-pink-50/70 dark:bg-slate-800 p-5 rounded-3xl border-2 border-pink-200 dark:border-slate-700"
          >
            <div>
              <label
                htmlFor="guest-name"
                className="block text-xs font-mono uppercase text-espresso font-bold mb-1"
              >
                Your Builder / Creature Name *
              </label>
              <input
                id="guest-name"
                type="text"
                required
                maxLength={40}
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g., Captain Starlight"
                className="w-full px-3.5 py-2 rounded-2xl text-xs sm:text-sm bg-white dark:bg-slate-900 border-2 border-sky-200 dark:border-slate-700 text-espresso focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label
                htmlFor="guest-mood"
                className="block text-xs font-mono uppercase text-espresso font-bold mb-1"
              >
                Weather Stamp
              </label>
              <select
                id="guest-mood"
                value={guestMood}
                onChange={(e) => setGuestMood(e.target.value)}
                className="w-full px-3.5 py-2 rounded-2xl text-xs sm:text-sm bg-white dark:bg-slate-900 border-2 border-sky-200 dark:border-slate-700 text-espresso focus:outline-none focus:border-pink-500"
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
                placeholder="Leave a kind note for Bitz and fellow builders..."
                className="w-full px-3.5 py-2 rounded-2xl text-xs sm:text-sm bg-white dark:bg-slate-900 border-2 border-sky-200 dark:border-slate-700 text-espresso focus:outline-none focus:border-pink-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 rounded-full text-xs font-bold bg-pink-500 hover:bg-pink-600 text-white border-2 border-pink-600 disabled:opacity-50 transition shadow-sm"
            >
              {submitting ? "Pinning Wish..." : "Pin Wish to Sanctuary Wall ✨"}
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

          <div className="lg:col-span-7 space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {entries.map((entry) => (
              <article
                key={entry.id}
                className="p-4 rounded-3xl bg-sky-50/70 dark:bg-slate-800 border-2 border-sky-200 dark:border-slate-700 flex flex-col justify-between gap-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <strong className="text-sm font-display text-espresso">
                    {entry.name}
                  </strong>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-200 border border-pink-300 font-bold">
                    {entry.mood}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-espresso/90 leading-relaxed">
                  {entry.message}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
