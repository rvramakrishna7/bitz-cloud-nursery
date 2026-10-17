import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import HomePage from "@/app/page";
import {
  BITZ_CHARACTER_SHEET,
  SHOWCASE_PROJECTS,
  ORIGIN_STORY_SCENES,
} from "@/lib/characterData";
import { calculatePupilOffset, soundEngine } from "@/lib/soundEngine";

describe("HaxBaby Track 2 Portfolio — Official Acceptance Criteria Verification", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            odometerCount: 1209,
            entries: [
              {
                id: "test-1",
                name: "Barnaby the Owl",
                mood: "🌟 Starlight Wish",
                message: "Cozy test wish!",
                createdAt: "2026-10-17T17:20:00+05:30",
              },
            ],
          }),
      })
    );
  });

  it("REQ-01 & REQ-02: displays Bitz's identity and the mandatory 5-Point Track 2 Character Sheet", () => {
    render(<HomePage />);
    expect(screen.getByText(/The Baby Cloud-Sprite/i)).toBeInTheDocument();
    expect(screen.getByText("1. Name")).toBeInTheDocument();
    expect(screen.getByText("2. What they are")).toBeInTheDocument();
    expect(screen.getByText("3. What they do")).toBeInTheDocument();
    expect(screen.getByText("4. Their story")).toBeInTheDocument();
    expect(screen.getByText("5. Tagline")).toBeInTheDocument();
    expect(
      screen.getAllByText(new RegExp(BITZ_CHARACTER_SHEET.registrationRef)).length
    ).toBeGreaterThan(0);
  });

  it("REQ-04: renders at least 3 showcase projects (4 interactive creations present)", () => {
    render(<HomePage />);
    expect(SHOWCASE_PROJECTS.length).toBeGreaterThanOrEqual(3);
    expect(screen.getByTestId("project-lullaby-lab")).toBeInTheDocument();
    expect(screen.getByTestId("project-nightlight-lanterns")).toBeInTheDocument();
    expect(screen.getByTestId("project-dream-routes")).toBeInTheDocument();
    expect(screen.getByTestId("project-block-toybox")).toBeInTheDocument();
  });

  it("REQ-05 (Golden Rule): verifies every Origin Story scene is strictly <= 150 words", () => {
    ORIGIN_STORY_SCENES.forEach((scene) => {
      const actualWords = scene.content.trim().split(/\s+/).length;
      expect(actualWords).toBeLessThanOrEqual(150);
    });
  });

  it("REQ-06 & REQ-13: verifies eye-tracking math, Day/Night toggle, and mandatory Mute Switch", () => {
    const offset = calculatePupilOffset({ x: 100, y: 100 }, { x: 250, y: 100 }, 8);
    expect(offset.x).toBeGreaterThan(0);
    expect(offset.y).toBe(0);

    render(<HomePage />);
    const muteBtn = screen.getByTestId("global-mute-toggle");
    expect(muteBtn).toHaveTextContent(/Sound ON/i);
    fireEvent.click(muteBtn);
    expect(muteBtn).toHaveTextContent(/Muted/i);
    expect(soundEngine.muted).toBe(true);

    const themeBtn = screen.getByTestId("theme-mood-toggle");
    fireEvent.click(themeBtn);
    expect(document.documentElement.getAttribute("data-theme")).toBe("night");
  });

  it("REQ-08: unlocks the hidden Easter egg when Bitz's brass antenna is tapped 3 times", () => {
    render(<HomePage />);
    const antenna = screen.getByTestId("bitz-antenna-trigger");
    fireEvent.click(antenna);
    fireEvent.click(antenna);
    fireEvent.click(antenna);
    expect(
      screen.getByText(/SECRET EASTER EGG UNLOCKED/i)
    ).toBeInTheDocument();
  });

  it("REQ-10, REQ-12, REQ-14 & REQ-15: renders Hit Counter, Live Guestbook, Chaos Mode, and Character Chat", () => {
    render(<HomePage />);
    expect(screen.getByTestId("hit-counter-odometer")).toBeInTheDocument();
    expect(screen.getByTestId("live-guestbook-section")).toBeInTheDocument();
    expect(screen.getByTestId("character-chat-section")).toBeInTheDocument();

    const chaosBtn = screen.getByTestId("chaos-mode-toggle");
    fireEvent.click(chaosBtn);
    expect(document.body.getAttribute("data-chaos")).toBe("true");
  });
});
