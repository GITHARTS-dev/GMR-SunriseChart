import React from "react";
import {
  PHASE_COLORS,
  PHASE_BANDS,
  CANVAS_W,
  CANVAS_H,
  HEADER_H,
  LEFT_GUTTER,
  BOTTOM_LABEL,
} from "../constants.js";

// Timeline markers along the band above the phase headers. `x` is the canvas
// coordinate; `anchor` decides how the label sits on it: "start" = left corner,
// "middle" = centred on that point (used on a phase boundary), "end" = right
// corner. Boundaries: Establish|Enhance = 430, Enhance|Optimize = 775.
const TIMELINE_MARKERS = [
  { text: "May '26", x: PHASE_BANDS.Establish.x0 + 12, anchor: "start" },
  { text: "Dec '26", x: PHASE_BANDS.Establish.x1, anchor: "middle" },
  { text: "Jun '27", x: PHASE_BANDS.Enhance.x1, anchor: "middle" },
  { text: "Oct '27", x: PHASE_BANDS.Optimize.x1 - 12, anchor: "end" },
];

const anchorTransform = (anchor) =>
  anchor === "middle"
    ? "translateX(-50%)"
    : anchor === "end"
    ? "translateX(-100%)"
    : "none";

export function PhaseHeaders() {
  const phases = ["Establish", "Enhance", "Optimize"];
  return (
    <>
      {/* Grey timeline band — one segment per phase, with dividers */}
      {phases.map((phase, i) => {
        const band = PHASE_BANDS[phase];
        return (
          <div
            key={`timeline-${phase}`}
            className="absolute"
            style={{
              left: band.x0,
              top: -8,
              width: band.x1 - band.x0,
              height: 34,
              background: "#EFF1F4",
              borderRight:
                i < phases.length - 1 ? "1px solid #D8DDE4" : undefined,
              zIndex: 11,
            }}
          />
        );
      })}

      {/* Timeline labels, positioned along the band */}
      {TIMELINE_MARKERS.map((m) => (
        <div
          key={m.text}
          className="absolute flex items-center font-bold tracking-wide text-[#1A2F5C] select-none"
          style={{
            left: m.x,
            top: -8,
            height: 34,
            fontSize: 14,
            letterSpacing: "0.02em",
            whiteSpace: "nowrap",
            transform: anchorTransform(m.anchor),
            zIndex: 13,
          }}
        >
          {m.text}
        </div>
      ))}

      {/* Phase headers */}
      {phases.map((phase) => {
        const band = PHASE_BANDS[phase];
        const width = band.x1 - band.x0;
        return (
          <div
            key={phase}
            className="absolute flex items-center justify-center font-bold tracking-wide text-white select-none"
            style={{
              left: band.x0,
              top: 28,
              width,
              height: HEADER_H,
              background: PHASE_COLORS[phase].header,
              fontSize: 22,
              letterSpacing: "0.02em",
              boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.15)",
              zIndex: 12,
            }}
          >
            {phase}
          </div>
        );
      })}
    </>
  );
}

export function AxisLabels() {
  return (
    <>
      <div
        className="absolute font-bold tracking-[0.2em] text-[#1A2F5C] select-none"
        style={{
          left: 38,
          top: HEADER_H + 160,
          fontSize: 16,
          transform: "rotate(-90deg)",
          transformOrigin: "left top",
          zIndex: 14,
        }}
      >
        PEOPLE
      </div>
      <div
        className="absolute font-bold tracking-[0.2em] text-[#1A2F5C] select-none"
        style={{
          left: 38,
          top: HEADER_H + 450,
          fontSize: 16,
          transform: "rotate(-90deg)",
          transformOrigin: "left top",
          zIndex: 14,
        }}
      >
        PROCESS
      </div>
      <div
        className="absolute font-bold tracking-[0.2em] text-[#1A2F5C] select-none"
        style={{
          left: LEFT_GUTTER + 60,
          top: CANVAS_H - BOTTOM_LABEL + 10,
          fontSize: 16,
          zIndex: 14,
        }}
      >
        TECHNOLOGY
      </div>
    </>
  );
}

export function GMRBadge() {
  return (
    <div
      className="absolute rounded-full flex flex-col items-center justify-center text-white font-bold shadow-2xl select-none"
      style={{
        left: CANVAS_W - 180,
        top: HEADER_H + 28,
        width: 152,
        height: 152,
        background:
          "radial-gradient(circle at 30% 30%, #FFB347, #EE8A1A 70%, #D67200)",
        fontSize: 23,
        lineHeight: 1.05,
        letterSpacing: "0.02em",
        boxShadow:
          "0 12px 32px rgba(238,138,26,0.45), inset 0 -4px 12px rgba(0,0,0,0.15)",
        zIndex: 16,
      }}
    >
      <span>GMR</span>
      <span>GCC</span>
    </div>
  );
}
