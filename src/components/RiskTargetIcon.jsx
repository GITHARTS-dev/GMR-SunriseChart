import React from "react";

// Risk Register logo: a target / crosshair reticle with a checkmark in the
// centre. Stroke uses currentColor so the caller sets the colour (red outline).
export default function RiskTargetIcon({ className, strokeWidth = 1.9 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* outer ring */}
      <circle cx="12" cy="12" r="7.5" />
      {/* cardinal crosshair bars — cross the ring and reach the inner circle */}
      <line x1="12" y1="1.5" x2="12" y2="8" />
      <line x1="12" y1="16" x2="12" y2="22.5" />
      <line x1="1.5" y1="12" x2="8" y2="12" />
      <line x1="16" y1="12" x2="22.5" y2="12" />
      {/* diagonal ticks just outside the ring */}
      <line x1="6.7" y1="6.7" x2="5.3" y2="5.3" />
      <line x1="17.3" y1="6.7" x2="18.7" y2="5.3" />
      <line x1="6.7" y1="17.3" x2="5.3" y2="18.7" />
      <line x1="17.3" y1="17.3" x2="18.7" y2="18.7" />
      {/* inner circle + checkmark */}
      <circle cx="12" cy="12" r="4" />
      <path d="M10 12.1l1.4 1.4 2.7-3.1" />
    </svg>
  );
}
