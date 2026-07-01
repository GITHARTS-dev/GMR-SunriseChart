import React from "react";
import RiskCard from "./RiskCard.jsx";

// Renders an initiative's FMEA record(s). Normally one card per initiative; if
// more than one row matched, the higher-RPN one is shown first. The FMEA tab is
// only rendered when there is at least one risk, so the empty case is a no-op.
export default function RiskRegister({ initiative }) {
  const risks = initiative?.risks || [];
  if (!risks.length) return null;

  const ordered = [...risks].sort((a, b) => (Number(b.rpn) || 0) - (Number(a.rpn) || 0));

  return (
    <div className="space-y-3">
      {ordered.map((risk, idx) => (
        <RiskCard key={`${risk.failureMode}-${idx}`} risk={risk} />
      ))}
    </div>
  );
}
