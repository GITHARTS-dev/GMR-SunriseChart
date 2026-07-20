import React from "react";
import RagIcon from "./RagIcon.jsx";
import { RAG_LABEL, RAG_COLORS } from "../utils.js";

// Convert a #rrggbb colour to an "r, g, b" string for use inside rgba().
const toRgb = (hex) => {
  const h = hex.replace("#", "");
  return `${parseInt(h.slice(0, 2), 16)}, ${parseInt(h.slice(2, 4), 16)}, ${parseInt(
    h.slice(4, 6),
    16
  )}`;
};

// Legend for the RAGP status icons on the dashboard cards. Uses the same
// RagIcon (shape + colour) that each card shows, so the mapping is unambiguous.
const LEGEND = [
  { level: "green"},
  { level: "amber"},
  { level: "red"},
  { level: "purple"},
];

export default function RagLegend({ onHoverLevel, hoveredLevel }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-slate-200/80 bg-white/70 px-6 py-2.5 backdrop-blur">
      <span className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        Status legend
      </span>
      {LEGEND.map((it) => {
        const isActive = hoveredLevel === it.level;
        const isDimmed = hoveredLevel != null && !isActive;
        const rgb = toRgb(RAG_COLORS[it.level]);
        return (
          <button
            key={it.level}
            type="button"
            className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-2.5 py-1 transition-all duration-200 ${
              isDimmed ? "opacity-45" : "opacity-100"
            }`}
            style={
              isActive
                ? {
                    backgroundColor: `rgba(${rgb}, 0.12)`,
                    boxShadow: `0 0 0 1.5px rgba(${rgb}, 0.55), 0 0 14px rgba(${rgb}, 0.45)`,
                  }
                : undefined
            }
            title={`Hover to highlight “${RAG_LABEL[it.level]}” topics`}
            onMouseEnter={() => onHoverLevel?.(it.level)}
            onMouseLeave={() => onHoverLevel?.(null)}
            onFocus={() => onHoverLevel?.(it.level)}
            onBlur={() => onHoverLevel?.(null)}
          >
            <RagIcon level={it.level} size={15} title={RAG_LABEL[it.level]} />
            <span className="text-xs font-semibold text-slate-700">
              {RAG_LABEL[it.level]}
            </span>
            <span className="hidden text-[11px] text-slate-400 lg:inline">· {it.desc}</span>
          </button>
        );
      })}
    </div>
  );
}
