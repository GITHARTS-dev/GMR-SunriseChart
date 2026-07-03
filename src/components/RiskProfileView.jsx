import React, { useMemo, useState } from "react";
import {
  ShieldAlert,
  ChevronLeft,
  ChevronDown,
  Layers,
  ListChecks,
  Siren,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Zap,
  Search,
  ShieldCheck,
  Lightbulb,
  UserCheck,
  User,
  CalendarDays,
  Activity,
  ClipboardCheck,
} from "lucide-react";
import RiskTargetIcon from "./RiskTargetIcon.jsx";
import { RISK_COLORS, RISK_LABEL, riskLevel } from "../utils.js";

// Project brand blue (the "Optimize" phase colour) — the single accent.
const BRAND = "#00437A";

// Per-level tint used for chips, rails and score pills.
const TINT = {
  high: { bg: "#fef2f2", ring: "#fecaca", text: "#b91c1c" },
  medium: { bg: "#fff8ec", ring: "#fde3ad", text: "#b45309" },
  low: { bg: "#effaf1", ring: "#bbe9c8", text: "#15803d" },
};
const LEVEL_ICON = { high: AlertOctagon, medium: AlertTriangle, low: CheckCircle2 };

// Numeric value out of a cell that may carry symbols ("162", "-67%", "54").
const num = (v) => {
  if (v == null || v === "") return null;
  const n = Number(String(v).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : null;
};

// ── Small building blocks ────────────────────────────────────────────────────

function RiskChip({ level, size = "md" }) {
  const t = TINT[level];
  const Icon = LEVEL_ICON[level];
  const pad = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]";
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full font-bold uppercase tracking-wide ${pad}`}
      style={{ color: t.text, background: t.bg, boxShadow: `inset 0 0 0 1px ${t.ring}` }}
    >
      <Icon className="h-3.5 w-3.5" />
      {RISK_LABEL[level]}
    </span>
  );
}

// Current RPN value, coloured by risk level.
function RpnDelta({ risk, compact }) {
  const before = num(risk.rpn);
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
        RPN
      </span>
      <span
        className={`font-extrabold tabular-nums ${compact ? "text-base" : "text-lg"}`}
        style={{ color: RISK_COLORS[riskLevel(risk)] }}
      >
        {before ?? "—"}
      </span>
    </div>
  );
}

// A single S / O / D metric pill, showing before → after when mitigated.
function Metric({ label, before, after }) {
  const b = num(before);
  const a = num(after);
  const changed = b != null && a != null && a !== b;
  return (
    <div className="flex flex-1 flex-col items-center rounded-lg bg-slate-50 py-1.5 ring-1 ring-slate-200/70">
      <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </span>
      <span className="text-sm font-bold tabular-nums text-slate-700">
        {b ?? "—"}
        {changed ? (
          <>
            <span className="text-slate-300"> → </span>
            <span className="text-emerald-600">{a}</span>
          </>
        ) : null}
      </span>
    </div>
  );
}

// Labelled field row (Effect / Cause / Controls / Recommended action).
function Field({ Icon, label, value, highlight }) {
  if (!value) return null;
  return (
    <div className={`flex gap-3 ${highlight ? "-mx-3 rounded-xl px-3 py-2.5" : "py-2.5"}`}
      style={highlight ? { background: "#f0f6fb" } : undefined}>
      <span
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
        style={{ background: highlight ? "#dcebf6" : "rgba(0,67,122,0.08)", color: BRAND }}
      >
        <Icon className="h-[15px] w-[15px]" />
      </span>
      <div className="min-w-0">
        <div
          className="text-[10px] font-bold uppercase tracking-[0.1em]"
          style={{ color: highlight ? BRAND : "#94a3b8" }}
        >
          {label}
        </div>
        <div className="mt-0.5 text-[13px] leading-relaxed text-slate-700">{value}</div>
      </div>
    </div>
  );
}

// A compact meta pill (Accountable / Responsible / Target / Status / Update).
function Meta({ Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <Icon className="h-[15px] w-[15px]" />
      </span>
      <div className="min-w-0">
        <div className="text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400">
          {label}
        </div>
        <div className="truncate text-[12.5px] font-semibold text-slate-700">{value}</div>
      </div>
    </div>
  );
}

// ── Detailed FMEA card for one (sub-)risk row ────────────────────────────────
function SubRiskCard({ risk, rollup }) {
  const level = riskLevel(risk);
  const color = RISK_COLORS[level];
  return (
    <div
      className="overflow-hidden rounded-xl border border-slate-200 bg-white"
      style={{ borderLeft: `4px solid ${color}` }}
    >
      {/* Header */}
      <div className="flex items-start gap-3 border-b border-slate-100 px-4 py-3">
        <span
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white"
          style={{ background: color }}
        >
          {rollup ? (
            <Siren className="h-[18px] w-[18px]" />
          ) : (
            <AlertTriangle className="h-[18px] w-[18px]" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          {rollup ? (
            <div className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: BRAND }}>
              Failure Mode
            </div>
          ) : null}
          <div
            className={`text-[14.5px] font-bold leading-snug text-slate-900 ${rollup ? "mt-0.5" : ""}`}
          >
            {risk.failureMode || risk.processStep || "—"}
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <RiskChip level={level} size="sm" />
          <RpnDelta risk={risk} compact />
        </div>
      </div>

      {/* Score strip: S / O / D before → after */}
      {/* <div className="flex gap-2 px-4 pt-3">
        <Metric label="Sev" before={risk.severity} after={risk.severityAfter} />
        <Metric label="Occ" before={risk.occurrence} after={risk.occurrenceAfter} />
        <Metric label="Det" before={risk.detection} after={risk.detectionAfter} />
      </div> */}

      {/* Narrative fields */}
      <div className="px-4 pb-1 pt-1">
        <Field Icon={Zap} label="Effect on Customer / Process" value={risk.effect} />
        <Field Icon={Search} label="Cause(s)" value={risk.cause} />
        <Field Icon={ShieldCheck} label="Current Controls" value={risk.controls} />
        <Field
          Icon={Lightbulb}
          label="Recommended Action"
          value={risk.recommended || risk.action}
          highlight
        />
      </div>

      {/* Meta footer */}
      {(risk.accountable || risk.responsible || risk.target || risk.status || risk.actionTaken) && (
        <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-slate-100 bg-slate-50/60 px-4 py-3">
          <Meta Icon={UserCheck} label="Accountable" value={risk.accountable} />
          <Meta Icon={User} label="Responsible" value={risk.responsible} />
          <Meta Icon={CalendarDays} label="Target" value={risk.target} />
          <Meta Icon={Activity} label="Status" value={risk.status} />
          <Meta Icon={ClipboardCheck} label="Action Taken / Update" value={risk.actionTaken} />
        </div>
      )}
    </div>
  );
}

// ── Parent process-step card (accordion) ─────────────────────────────────────
function ParentCard({ group, open, onToggle }) {
  const level = riskLevel(group);
  const color = RISK_COLORS[level];
  const childCount = group.children?.length || 0;
  // What to show when expanded: the parent's own roll-up (when it carries FMEA
  // detail) followed by its children; or just the parent when it has no rows.
  const rollupDetail = group.failureMode ? group : null;

  return (
    <div
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      style={{ borderLeft: `5px solid ${color}` }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-slate-50/70 sm:px-5"
      >
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
          style={{ background: color, boxShadow: `0 4px 12px ${color}44` }}
        >
          <ShieldAlert className="h-5 w-5" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-[16px] font-extrabold text-slate-900">
              {group.processStep || group.programRiskTheme || "Program Risk"}
            </h3>
            <RiskChip level={level} size="sm" />
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-slate-500">
            {group.programRiskTheme && group.programRiskTheme !== group.processStep ? (
              <span className="truncate font-medium">{group.programRiskTheme}</span>
            ) : null}
            <span className="inline-flex items-center gap-1 font-semibold text-slate-600">
              <ListChecks className="h-3.5 w-3.5" />
              {childCount} sub-initiatives
            </span>
            {group.phase ? (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                {group.phase}
              </span>
            ) : null}
            {group.category ? (
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                style={{ color: BRAND, background: "rgba(0,67,122,0.08)" }}
              >
                {group.category}
              </span>
            ) : null}
          </div>
        </div>

        <div className="hidden shrink-0 flex-col items-end gap-1 sm:flex">
          <RpnDelta risk={group} />
          {/* {improved && pct != null ? (
            <span className="text-[10.5px] font-semibold text-emerald-600">
              projected residual risk
            </span>
          ) : null} */}
        </div>

        <ChevronDown
          className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <div className="space-y-3 border-t border-slate-200 bg-slate-50/60 px-3 py-4 sm:px-5">
          {rollupDetail ? <SubRiskCard risk={rollupDetail} rollup /> : null}
          {group.children?.map((child, idx) => (
            <SubRiskCard key={`${child.processStep}-${idx}`} risk={child} />
          ))}
          {childCount === 0 && !rollupDetail ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-400">
              No sub-process risks recorded for this program outcome.
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

// ── KPI summary tile ─────────────────────────────────────────────────────────
function Kpi({ Icon, value, label, tint, fg }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tint} ${fg}`}>
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <div className="text-xl font-extrabold leading-none text-slate-900">{value}</div>
        <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </div>
      </div>
    </div>
  );
}

// ── Main view ────────────────────────────────────────────────────────────────
export default function RiskProfileView({ groups = [], onBack }) {
  const [openKeys, setOpenKeys] = useState(() => new Set());

  const toggle = (key) =>
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const allKeys = groups.map((g, i) => `${g.processStep}-${i}`);
  const allOpen = openKeys.size >= allKeys.length && allKeys.length > 0;
  const toggleAll = () =>
    setOpenKeys(allOpen ? new Set() : new Set(allKeys));

  const summary = useMemo(() => {
    const leaves = groups.flatMap((g) => (g.children?.length ? g.children : [g]));
    const counts = { high: 0, medium: 0, low: 0 };
    leaves.forEach((r) => {
      counts[riskLevel(r)] += 1;
    });
    const withBoth = leaves.filter((r) => num(r.rpn) && num(r.rpnAfter) != null);
    let reduction = null;
    if (withBoth.length) {
      const before = withBoth.reduce((s, r) => s + num(r.rpn), 0);
      const after = withBoth.reduce((s, r) => s + num(r.rpnAfter), 0);
      reduction = before ? Math.round(((before - after) / before) * 100) : null;
    }
    return { total: leaves.length, counts, reduction };
  }, [groups]);

  return (
    <div className="min-h-screen w-full bg-slate-100">
      {/* Sticky header */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Dashboard
          </button>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600">
              <RiskTargetIcon className="h-6 w-6" />
            </span>
            <div className="leading-none">
              {/* <div className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Failure Mode &amp; Effects Analysis
              </div> */}
              <h1 className="mt-1 text-[19px] font-extrabold tracking-tight text-slate-900">
                Risk Register
              </h1>
            </div>
          </div>
          {groups.length ? (
            <button
              type="button"
              onClick={toggleAll}
              className="ml-auto rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
            >
              {allOpen ? "Collapse all" : "Expand all"}
            </button>
          ) : null}
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
        {groups.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <ShieldAlert className="mx-auto h-10 w-10 text-slate-300" />
            <div className="mt-3 text-base font-bold text-slate-700">No risk data found</div>
            <p className="mx-auto mt-1 max-w-md text-sm text-slate-400">
              The “Risks” sheet couldn’t be located in the workbook, or it has no
              rows marked as “Program Outcome (Board Level)”. Check the sheet and
              refresh.
            </p>
          </div>
        ) : (
          <>
            {/* KPI summary */}
            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              <Kpi
                Icon={Layers}
                value={groups.length}
                label="Program Outcomes"
                tint="bg-blue-50"
                fg="text-blue-600"
              />
              <Kpi
                Icon={ListChecks}
                value={summary.total}
                label="Total Risks"
                tint="bg-violet-50"
                fg="text-violet-600"
              />
              <Kpi
                Icon={AlertOctagon}
                value={summary.counts.high}
                label="High Risk"
                tint="bg-rose-50"
                fg="text-rose-600"
              />
              <Kpi
                Icon={AlertTriangle}
                value={summary.counts.medium}
                label="Medium Risk"
                tint="bg-amber-50"
                fg="text-amber-600"
              />
              {/* {summary.reduction != null ? (
                <Kpi
                  Icon={TrendingDown}
                  value={`${summary.reduction}%`}
                  label="Avg RPN Reduction"
                  tint="bg-emerald-50"
                  fg="text-emerald-600"
                />
              ) : (
                <Kpi
                  Icon={CheckCircle2}
                  value={summary.counts.low}
                  label="Low Risk"
                  tint="bg-emerald-50"
                  fg="text-emerald-600"
                />
              )} */}
            </div>

            {/* Program outcome cards */}
            <div className="space-y-4">
              {groups.map((group, i) => {
                const key = `${group.processStep}-${i}`;
                return (
                  <ParentCard
                    key={key}
                    group={group}
                    open={openKeys.has(key)}
                    onToggle={() => toggle(key)}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
