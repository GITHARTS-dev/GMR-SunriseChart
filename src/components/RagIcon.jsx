import React from "react";

// RAGP status indicator — a flat 2D colored dot per state, matching the traffic-
// light look:
//   green  → On track
//   amber  → At risk
//   red    → Delayed
//   purple → Not started
//
// Each dot carries its own white outer ring + subtle drop shadow, so it stays
// clearly visible on ANY background — white cards, the tinted sidebar rows, and
// especially the colored sunrise chart (the Establish phase is bright red and
// Enhance is orange, where a bare colored dot would blend in and vanish). The
// white ring guarantees separation from same-colored backgrounds.
const BEAD = {
  green: "#34d399",
  amber: "#fbbf24",
  red: "#f87171",
  purple: "#a78bfa",
};

export default function RagIcon({ level, size = 40, title }) {
  const color = BEAD[level] || BEAD.green;
  const ring = Math.max(2, size * 0.17); // white outer-ring thickness
  return (
    <span
      className="inline-block shrink-0 rounded-full"
      style={{
        width: size,
        height: size,
        // flat 2D solid fill — no gradient, no gloss
        background: color,
        boxShadow: [
          // wide white outer ring so the dot never disappears on colored bg
          `0 0 0 ${ring}px #ffffff`,
          // subtle drop shadow for separation on light backgrounds
          `0 1px 2px rgba(15,23,42,0.25)`,
        ].join(", "),
      }}
      title={title}
      role="img"
      aria-label={title || `${level} status`}
    />
  );
}
