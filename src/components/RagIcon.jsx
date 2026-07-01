import React from "react";
import { getRagColor } from "../utils.js";

// RAGP status indicator — a distinct glyph per state so it reads by SHAPE, not
// color alone (accessible / color-blind safe):
//   green  → check-circle      (On track)
//   amber  → warning-triangle  (At risk)
//   red    → stop-octagon      (Delayed)
//   purple → dashed-ring       (Not started)
//
// Each glyph sits on its own white disc with a soft shadow, so it stays clearly
// visible on ANY background — light cards, the tinted sidebar rows, or the
// colored sunrise chart. The colored glyph is never drawn onto a same-colored
// fill, so there is no risk of it disappearing (e.g. a red glyph on red).
const GLYPHS = {
  green: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  amber: (
    <>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </>
  ),
  red: (
    <>
      <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </>
  ),
  purple: (
    <>
      <path d="M10.1 2.18a9.93 9.93 0 0 1 3.8 0" />
      <path d="M17.6 3.71a9.95 9.95 0 0 1 2.69 2.7" />
      <path d="M21.82 10.1a9.93 9.93 0 0 1 0 3.8" />
      <path d="M20.29 17.6a9.95 9.95 0 0 1-2.7 2.69" />
      <path d="M13.9 21.82a9.94 9.94 0 0 1-3.8 0" />
      <path d="M6.4 20.29a9.95 9.95 0 0 1-2.69-2.7" />
      <path d="M2.18 13.9a9.93 9.93 0 0 1 0-3.8" />
      <path d="M3.71 6.4a9.95 9.95 0 0 1 2.7-2.69" />
    </>
  ),
};

export default function RagIcon({ level, size = 40, title }) {
  const color = getRagColor(level);
  const glyph = GLYPHS[level] || GLYPHS.green;
  const inner = Math.round(size * 0.64); // glyph diameter, leaving a white margin
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-white"
      style={{
        width: size,
        height: size,
        // subtle state-colored ring for definition + soft shadow so the white
        // disc separates cleanly from light, dark, or colored backgrounds.
        boxShadow: `inset 0 0 0 ${Math.max(1, Math.round(size * 0.05))}px ${color}40, 0 1px 3px rgba(15,23,42,0.22)`,
      }}
      title={title}
      aria-label={title || `${level} status`}
    >
      <svg
        width={inner}
        height={inner}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {glyph}
      </svg>
    </span>
  );
}
