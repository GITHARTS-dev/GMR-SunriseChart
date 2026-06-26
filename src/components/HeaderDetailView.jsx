import React, { useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarRange,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock,
  Layers,
  LayoutGrid,
  ListChecks,
} from "lucide-react";

import ProgressCircle from "./ProgressCircle.jsx";
import { computeStats, getProgressColor } from "../utils.js";
import { PHASE_COLORS } from "../constants.js";

const statusLabel = (status) => {
  if (status === "done") return "Completed";
  if (status === "inprogress") return "In progress";
  return "To do";
};

// Status pill styling — In progress is orange, Done is green, To do is grey.
const STATUS_STYLES = {
  done: { bg: "bg-emerald-100", text: "text-emerald-700", Icon: CheckCircle2 },
  inprogress: { bg: "bg-orange-100", text: "text-orange-700", Icon: Clock },
  todo: { bg: "bg-slate-100", text: "text-slate-600", Icon: Circle },
};

// Display order for actions: To do first, then In progress, then Completed.
const STATUS_ORDER = { todo: 0, inprogress: 1, done: 2 };
const byStatusOrder = (a, b) =>
  (STATUS_ORDER[a.status] ?? 0) - (STATUS_ORDER[b.status] ?? 0);

// Dashboard blue (Optimize) — used for the left accent on each action card.
const TASK_ACCENT = PHASE_COLORS.Optimize.solid;

// Parse the assorted date formats coming from Excel (M/D/YYYY, M/D/YY,
// D-M-YYYY, YYYY-MM-DD, …) into a Date, or null if it can't be understood.
const parseDate = (value) => {
  const s = String(value || "").trim();
  if (!s) return null;

  const parts = s.split(/[/\-.]/).map((p) => p.trim());
  if (parts.length === 3 && parts.every((p) => /^\d+$/.test(p))) {
    let [a, b, c] = parts.map(Number);
    let year;
    let month;
    let day;
    if (String(parts[0]).length === 4) {
      // YYYY-MM-DD
      year = a;
      month = b;
      day = c;
    } else {
      // M/D/Y or D/M/Y — "16" can't be a month, so use that to disambiguate.
      year = c < 100 ? 2000 + c : c;
      if (a > 12) {
        day = a;
        month = b;
      } else {
        month = a;
        day = b;
      }
    }
    const d = new Date(year, month - 1, day);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
};

// A task is overdue when it isn't done yet and its end date is before today.
const isOverdue = (status, endValue) => {
  if (status === "done") return false;
  const end = parseDate(endValue);
  if (!end) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return end < today;
};

const fieldLabel = (key) =>
  String(key || "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());

const pickDetail = (details = {}, ...keys) => {
  for (const k of keys) {
    const v = details?.[k];
    if (v != null && String(v).trim()) return String(v).trim();
  }
  return "";
};

// Hide keys already shown elsewhere on the card (task title, status chip,
// assignee chip, dedicated date row, section header). Anything else from the
// spreadsheet — Notes, etc. — renders as a labelled detail card.
const HIDDEN_DETAIL_KEYS = new Set([
  "phase",
  "dimension",
  "header",
  "topic",
  "category",
  "initiative",
  "outcome",
  "task",
  "tasks",
  "action",
  "actions",
  "status",
  "assignee",
  "accountable",
  "owner",
  "sno",
  "sno.",
  "s.no",
  "s.no.",
  "s no",
  "serial no",
  "serial number",
  "start date",
  "startdate",
  "start",
  "end date",
  "enddate",
  "end",
  "due date",
  "duedate",
]);

const visibleDetails = (details = {}) =>
  Object.entries(details).filter(
    ([key, value]) =>
      key &&
      value &&
      !HIDDEN_DETAIL_KEYS.has(
        String(key).toLowerCase().replace(/\s+/g, " ").trim()
      )
  );

// A single action row. HARTS Scope and SSC Scope are hidden behind a "Scopes"
// button and only revealed when the user clicks it.
function TaskRow({ task }) {
  const [showScopes, setShowScopes] = useState(false);

  const status = STATUS_STYLES[task.status] || STATUS_STYLES.todo;
  const StatusIcon = status.Icon;

  const startDate = pickDetail(
    task.details,
    "Start Date",
    "Start",
    "StartDate",
    "start date",
    "start"
  );
  const endDate = pickDetail(
    task.details,
    "End Date",
    "End",
    "Due Date",
    "EndDate",
    "end date",
    "end",
    "due date"
  );

  const hartsScope = pickDetail(
    task.details,
    "HARTS Scope",
    "HARTS scope",
    "Harts Scope",
    "harts scope",
    "HARTSScope"
  );
  const sscScope = pickDetail(
    task.details,
    "SSC Scope",
    "SSC scope",
    "Ssc Scope",
    "ssc scope",
    "SSCScope"
  );
  const hasScopes = Boolean(hartsScope || sscScope);

  // Remaining detail fields (Notes, etc.) — minus the two scopes that now live
  // behind the Scopes button.
  const otherDetails = visibleDetails(task.details).filter(([key]) => {
    const k = String(key).toLowerCase().replace(/\s+/g, " ").trim();
    return k !== "harts scope" && k !== "ssc scope";
  });

  const assignee =
    task.assignee ||
    task.Assignee ||
    task.details?.Assignee ||
    task.details?.assignee ||
    task.details?.Owner ||
    task.details?.owner ||
    "";

  const overdue = isOverdue(task.status, endDate);

  return (
    <div
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
      style={{ borderLeft: `4px solid ${TASK_ACCENT}` }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <div className="text-base font-semibold text-slate-900">{task.task}</div>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.bg} ${status.text}`}
        >
          <StatusIcon className="h-3.5 w-3.5" />
          {statusLabel(task.status)}
        </span>
        {assignee ? (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
            {assignee}
          </span>
        ) : null}
        {overdue && (
          <span className="group relative inline-flex items-center">
            <AlertTriangle className="h-4 w-4 text-rose-500" />
            <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-1.5 hidden w-max max-w-[220px] -translate-x-1/2 rounded-md bg-slate-900 px-2.5 py-1.5 text-[11px] font-medium text-white shadow-lg group-hover:block">
              Deadline has passed. Immediate action is required.
            </span>
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
          <CalendarRange className="h-3.5 w-3.5 text-slate-500" />
          <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-500">
            Start
          </span>
          <span className="font-semibold text-slate-800">{startDate || "—"}</span>
          <span className="mx-1 text-slate-300">·</span>
          <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-500">
            End
          </span>
          <span
            className={`font-semibold ${overdue ? "text-rose-600" : "text-slate-800"}`}
          >
            {endDate || "—"}
          </span>
        </div>

        {hasScopes && (
          <button
            type="button"
            onClick={() => setShowScopes((v) => !v)}
            aria-expanded={showScopes}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <Layers className="h-3.5 w-3.5 text-slate-500" />
            Scopes
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-200 ${
                showScopes ? "rotate-180" : ""
              }`}
            />
          </button>
        )}
      </div>

      {showScopes && hasScopes && (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {hartsScope && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                HARTS Scope
              </div>
              <div className="mt-1 text-sm text-slate-700">{hartsScope}</div>
            </div>
          )}
          {sscScope && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                SSC Scope
              </div>
              <div className="mt-1 text-sm text-slate-700">{sscScope}</div>
            </div>
          )}
        </div>
      )}

      {otherDetails.length > 0 && (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {otherDetails.map(([key, value]) => (
            <div key={key} className="rounded-lg bg-slate-50 px-3 py-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {fieldLabel(key)}
              </div>
              <div className="mt-1 text-sm text-slate-700">{String(value)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HeaderDetailView({ item, onBack, onToggle, canEdit = true }) {
  if (!item) return null;

  const allTasks = item.tasks || [];
  const stats = computeStats(allTasks);
  const progressColor = getProgressColor(stats.pct);
  const initiatives = item.initiatives || [];
  const headerDetails = visibleDetails(allTasks[0]?.details);
  const phaseColor = PHASE_COLORS[item.phase]?.solid || "#00437A";

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="h-1 w-full" style={{ background: phaseColor }} />
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-6 py-2.5">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-[13px] font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </button>

          <div className="text-center">
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Header details
            </div>
            <div className="text-[17px] font-bold text-slate-900">{item.header}</div>
            <div className="text-[13px] text-slate-500">
              {item.phase} · {item.dimension}
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5">
            <div>
              <div className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-400">
                Progress
              </div>
              <div className="text-[18px] font-bold" style={{ color: progressColor }}>
                {stats.pct}%
              </div>
            </div>
            <ProgressCircle pct={stats.pct} size={44} />
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-5 px-5 py-6 xl:grid-cols-[360px_1fr]">
        <aside className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              <LayoutGrid className="h-4 w-4" />
              Header overview
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">{item.header}</div>
            <div className="mt-1 text-sm text-slate-500">
              {item.locked
                ? "Yet to begin. Complete the first two phases to unlock this phase."
                : "Review the initiatives and actions tracked under this header."}
            </div>
          </div>

          <div
            className="rounded-xl border border-slate-200 bg-white p-4"
            style={{ borderLeft: `4px solid ${phaseColor}` }}
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <ListChecks className="h-4 w-4 text-slate-400" />
              Initiatives
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Total initiatives
                </div>
                <div className="mt-0.5 text-3xl font-bold text-slate-900">
                  {initiatives.length}
                </div>
              </div>
              <ProgressCircle pct={stats.pct} size={52} />
            </div>

            {/* Each initiative with its own progress */}
            <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
              {initiatives.map((ini) => {
                const pct = ini.stats?.pct ?? 0;
                const color = getProgressColor(pct);
                return (
                  <div key={ini.name}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate text-sm font-medium text-slate-700">
                        {ini.name}
                      </span>
                      <span
                        className="shrink-0 text-sm font-bold tabular-nums"
                        style={{ color }}
                      >
                        {pct}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* {headerDetails.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-sm font-semibold text-slate-700">Excel fields</div>
              <div className="mt-3 space-y-2">
                {headerDetails.map(([key, value]) => (
                  <div key={key} className="rounded-lg bg-slate-50 px-3 py-2">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      {fieldLabel(key)}
                    </div>
                    <div className="mt-1 text-sm text-slate-800">{String(value)}</div>
                  </div>
                ))}
              </div>
            </div>
          )} */}
        </aside>

        <main className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Initiative breakdown
              </div>
              <div className="mt-1 text-lg font-bold text-slate-900">
                Actions grouped under each initiative
              </div>
            </div>
          </div>
          {item.locked ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-600">
              Optimize tasks will appear once Establish and Enhance are fully complete.
            </div>
          ) : (
            <div className="grid gap-4">
              {initiatives.map((initiative) => {
                const sectionStats = computeStats(initiative.tasks);
                const sectionColor = getProgressColor(sectionStats.pct);

                return (
                  <section
                    key={initiative.name}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                    style={{ borderLeft: `4px solid ${phaseColor}` }}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                          Initiative
                        </div>
                        <div className="mt-1 text-xl font-bold text-slate-900">{initiative.name}</div>
                        {initiative.tasks?.[0]?.outcome ? (
                          <div className="mt-1 max-w-2xl text-sm text-slate-500">
                            {initiative.tasks[0].outcome}
                          </div>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                        <div className="text-right">
                          <div className="text-[11px] uppercase tracking-wider text-slate-500">
                            Progress
                          </div>
                          <div className="text-lg font-bold" style={{ color: sectionColor }}>
                            {sectionStats.pct}%
                          </div>
                        </div>
                        <ProgressCircle pct={sectionStats.pct} size={42} />
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3">
                      {[...initiative.tasks].sort(byStatusOrder).map((task, idx) => (
                        <TaskRow
                          key={`${initiative.name}-${idx}-${task.task}`}
                          task={task}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
