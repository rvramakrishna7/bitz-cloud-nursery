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
      text: "*waves tiny cloud hand* Hiya! I'm Bitz! Ask me anything on my 90s Cloud-Pager or click a quick button below!",
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
        "*bounces on a marshmallow cloud* Hiya friend! Welcome to Bitz.OS! Have you tried playing my Raindrop Lullaby Lab yet?";
    } else if (lower.includes("rain") || lower.includes("weather") || lower.includes("cloud")) {
      reply =
        "*puffs up proudly* Every storm cloud is just a sleepy baby waiting for a C-major lullaby! I tune raindrops into wind chimes!";
    } else if (lower.includes("win") || lower.includes("hackathon") || lower.includes("judge")) {
      reply =
        "*scatters pastel confetti* We built this cozy 90s-meets-modern world with 100% original 3D plushie art and lots of love!";
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
      {/* 90S VINTAGE HIT COUNTER ODOMETER WINDOW */}
      <section
        aria-label="Vintage Nursery Hit Counter Odometer"
        data-testid="hit-counter-odometer"
        className="retro-window overflow-hidden"
      >
        <div className="bg-pink-300 dark:bg-pink-900 border-b-2 border-slate-900 dark:border-sky-300 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-white border-2 border-slate-900" />
            <span className="w-3 h-3 rounded-full bg-sky-300 border-2 border-slate-900" />
            <span className="font-mono text-xs font-extrabold text-slate-900 dark:text-white ml-1.5">
              📟 HIT_COUNTER_98.SYS
            </span>
          </div>
          <Eye className="w-4 h-4 text-slate-900 dark:text-white" />
        </div>

        <div className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-espresso font-display">
              Weather Wishes &amp; Dreams Delivered
            </h3>
            <p className="text-xs sm:text-sm text-muted mt-1">
              Authentic 90s web odometer tracking every visitor and bedtime wish in Bitz&apos;s cloud sanctuary.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-sky-200 dark:bg-slate-900 p-3 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_#1e293b]">
            {formattedOdometer.map((digit, index) => (
              <span
                key={index}
                className="w-9 h-11 sm:w-10 sm:h-12 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-900 text-pink-600 dark:text-pink-300 font-mono text-xl sm:text-2xl font-extrabold inline-flex items-center justify-center shadow-[0_2px_0_#1e293b]"
              >
                {digit}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 90S CLOUD-PAGER INTERACTIVE CHARACTER CHAT WINDOW */}
      <section
        id="nursery-chat"
        aria-labelledby="chat-heading"
        data-testid="character-chat-section"
        className="retro-window overflow-hidden"
      >
        <div className="bg-sky-300 dark:bg-sky-900 border-b-2 border-slate-900 dark:border-sky-300 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-900" />
            <span className="w-3.5 h-3.5 rounded-full bg-pink-300 border-2 border-slate-900" />
            <span className="ml-1.5 font-mono text-xs font-extrabold text-slate-900 dark:text-white">
              💬 BITZ_CLOUD_MESSENGER_99.EXE
            </span>
          </div>
          <span className="text-xs font-mono bg-white text-emerald-700 px-2.5 py-0.5 rounded border-2 border-slate-900 font-extrabold">
            ● Bitz is Online
          </span>
        </div>

        <div className="p-6 sm:p-8">
          <h3
            id="chat-heading"
            className="text-2xl font-bold text-espresso font-display flex items-center gap-2"
          >
            <MessageCircle className="w-5 h-5 text-pink-500" />
            Whisper to Bitz on the Cloud-Pager
          </h3>

          <div className="mt-4 max-h-60 overflow-y-auto space-y-3 p-4 rounded-2xl bg-sky-50 dark:bg-slate-800 border-2 border-slate-900 dark:border-sky-300">
            {chatHistory.map((item, idx) => (
              <div
                key={idx}
                className={`flex ${
                  item.sender === "visitor" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-md px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed border-2 border-slate-900 ${
                    item.sender === "visitor"
                      ? "bg-pink-400 text-slate-950 font-bold shadow-[3px_3px_0px_#1e293b]"
                      : "bg-white dark:bg-slate-900 text-espresso font-medium shadow-[3px_3px_0px_#38bdf8]"
                  }`}
                >
                  <span className="block text-[10px] font-mono uppercase opacity-80 mb-0.5 font-extrabold">
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
                className="retro-btn-cream px-3.5 py-1.5 text-xs"
              >
                {preset.question}
              </button>
            ))}
          </div>

          <form onSubmit={handleCustomChatSubmit} className="mt-4 flex gap-2.5">
            <input
              type="text"
              value={customChatInput}
              onChange={(e) => setCustomChatInput(e.target.value)}
              placeholder="Type a message to Bitz..."
              aria-label="Message to Bitz"
              className="flex-1 px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-800 border-2 border-slate-900 dark:border-sky-300 text-espresso font-medium focus:outline-none focus:bg-pink-50"
            />
            <button
              type="submit"
              className="retro-btn-pink inline-flex items-center gap-1.5 px-5 py-2.5 text-xs"
            >
              <Send className="w-3.5 h-3.5" />
              Send
            </button>
          </form>
        </div>
      </section>

      {/* 90S BBS DREAM GUESTBOOK WALL WINDOW */}
      <section
        id="guestbook-wall"
        aria-labelledby="guestbook-heading"
        data-testid="live-guestbook-section"
        className="retro-window overflow-hidden"
      >
        <div className="bg-pink-300 dark:bg-pink-900 border-b-2 border-slate-900 dark:border-sky-300 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-900" />
            <span className="w-3.5 h-3.5 rounded-full bg-sky-300 border-2 border-slate-900" />
            <span className="ml-1.5 font-mono text-xs font-extrabold text-slate-900 dark:text-white">
              💌 DREAM_GUESTBOOK_WALL.BBS
            </span>
          </div>
          <BookHeart className="w-4 h-4 text-slate-900 dark:text-white" />
        </div>

        <div className="p-6 sm:p-8">
          <div className="pb-5 border-b-2 border-slate-900/15 dark:border-slate-700">
            <h3
              id="guestbook-heading"
              className="text-2xl sm:text-3xl font-bold text-espresso font-display"
            >
              Sign the Sky-Loft Dream Wall
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-muted">
              Leave a 90s web guestbook note or bedtime wish for Bitz! Entries are saved
              live to our persistent sanctuary wall.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
            <form
              onSubmit={handleGuestbookSubmit}
              className="lg:col-span-5 space-y-4 bg-pink-50 dark:bg-slate-800 p-5 rounded-2xl border-2 border-slate-900 dark:border-sky-300 shadow-[4px_4px_0px_#f472b6]"
            >
              <div>
                <label
                  htmlFor="guest-name"
                  className="block text-xs font-mono uppercase text-espresso font-extrabold mb-1"
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
                  className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-900 border-2 border-slate-900 text-espresso font-medium focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="guest-mood"
                  className="block text-xs font-mono uppercase text-espresso font-extrabold mb-1"
                >
                  Weather Sticker Stamp
                </label>
                <select
                  id="guest-mood"
                  value={guestMood}
                  onChange={(e) => setGuestMood(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-900 border-2 border-slate-900 text-espresso font-bold focus:outline-none"
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
                  className="block text-xs font-mono uppercase text-espresso font-extrabold mb-1"
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
                  className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-900 border-2 border-slate-900 text-espresso font-medium focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="retro-btn-pink w-full py-2.5 px-4 text-xs disabled:opacity-50"
              >
                {submitting ? "Pinning Wish..." : "Pin Wish to Sanctuary Wall ✨"}
              </button>

              {submitFeedback && (
                <p
                  role="status"
                  className="text-xs font-mono text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 font-extrabold"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{submitFeedback}</span>
                </p>
              )}
            </form>

            <div className="lg:col-span-7 space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
              {entries.map((entry) => (
                <article
                  key={entry.id}
                  className="p-4 rounded-2xl bg-sky-100/80 dark:bg-slate-800 border-2 border-slate-900 dark:border-sky-300 shadow-[4px_4px_0px_#38bdf8] flex flex-col justify-between gap-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <strong className="text-sm font-display text-espresso">
                      {entry.name}
                    </strong>
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-lg bg-pink-200 text-slate-900 border border-slate-900 font-extrabold">
                      {entry.mood}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-espresso/95 leading-relaxed font-medium">
                    {entry.message}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
