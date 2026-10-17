import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("canvas-confetti", () => ({
  default: vi.fn(),
}));

if (typeof HTMLCanvasElement !== "undefined") {
  HTMLCanvasElement.prototype.getContext = () => ({
    clearRect: () => {},
    save: () => {},
    restore: () => {},
    translate: () => {},
    rotate: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    quadraticCurveTo: () => {},
    closePath: () => {},
    fill: () => {},
    stroke: () => {},
    arc: () => {},
    ellipse: () => {},
    fillRect: () => {},
    scale: () => {},
  });
}
