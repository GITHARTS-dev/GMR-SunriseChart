import React from "react";

// RAGP status indicator — a horizontal traffic-light signal. Four lamps sit in a
// dark housing in a fixed order (red · amber · green · purple); only the lamp for
// the current state is lit (vivid + glowing), the rest stay dark-but-coloured so
// the palette still reads clearly:
//   green  → On track
//   amber  → At risk
//   red    → Delayed
//   purple → Not started
//
// The dark housing + a thin light ring keep the signal clearly visible on ANY
// background — white cards, tinted sidebar rows, and the coloured sunrise chart
// (bright-red Establish, orange Enhance, deep-blue Optimize).
const LAMP = {
  red: "#ef4444",
  amber: "#f59e0b",
  green: "#22c55e",
  purple: "#8b5cf6",
};
// Left-to-right lamp order in the housing.
const ORDER = ["red", "amber", "green", "purple"];

export default function RagIcon({ level, size = 40, title }) {
  const active = LAMP[level] ? level : "green";

  // `size` is the housing height; the signal is ~3.4× as wide (four lamps).
  const pad = size * 0.15;
  const gap = size * 0.11;
  const lamp = size - pad * 2;
  const radius = size * 0.32;
  const ring = Math.max(1, size * 0.035);

  return (
    <span
      className="inline-flex shrink-0 items-center"
      style={{
        gap,
        padding: pad,
        height: size,
        borderRadius: radius,
        background: "linear-gradient(158deg, #3a434f, #1c222b)",
        boxShadow: [
          `inset 0 ${size * 0.04}px ${size * 0.06}px rgba(255,255,255,0.18)`,
          `0 0 0 ${ring}px rgba(255,255,255,0.55)`,
          `0 ${size * 0.05}px ${size * 0.14}px rgba(10,15,25,0.4)`,
        ].join(", "),
      }}
      title={title}
      role="img"
      aria-label={title || `${level} status`}
    >
      {ORDER.map((k) => {
        const c = LAMP[k];
        const on = k === active;
        return (
          <span
            key={k}
            style={{
              width: lamp,
              height: lamp,
              borderRadius: "50%",
              background: on
                ? `radial-gradient(circle at 35% 28%, #ffffff 0%, ${c} 40%, ${c} 100%)`
                : `radial-gradient(circle at 38% 32%, color-mix(in srgb, ${c} 60%, #0b0e15), color-mix(in srgb, ${c} 34%, #0b0e15) 100%)`,
              boxShadow: on
                ? `0 0 ${lamp * 0.5}px ${lamp * 0.1}px color-mix(in srgb, ${c} 80%, transparent), inset 0 0 ${lamp * 0.2}px rgba(255,255,255,0.45)`
                : `inset 0 0 ${lamp * 0.18}px rgba(0,0,0,0.55)`,
            }}
          />
        );
      })}
    </span>
  );
}
