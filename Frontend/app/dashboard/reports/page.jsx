// JavaScript
// Frontend/app/dashboard/reports/[id]/page.jsx
import fs from "fs";
import path from "path";
import { SlBadge } from "react-icons/sl";

// Robust parser for ai_analysis: supports object, plain JSON string, and fenced ```json blocks.
function parseAiAnalysis(raw) {
  if (!raw) return null;
  if (typeof raw === "object") return raw;

  if (typeof raw === "string") {
    const fenceRegex = /```(?:json)?\s*([\s\S]*?)\s*```/i;
    const match = raw.match(fenceRegex);
    const jsonStr = match ? match[1] : raw;
    try {
      return JSON.parse(jsonStr);
    } catch {
      return null;
    }
  }
  return null;
}

function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-neutral-100 text-neutral-700 ring-1 ring-neutral-200",
    good: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    issue: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
    suggestion: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
  };
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

function KpiCard({ label, value, tone = "neutral" }) {
  const tones = {
    neutral: "border-neutral-200",
    emerald: "border-emerald-200",
    rose: "border-rose-200",
    indigo: "border-indigo-200",
  };
  return (
    <div className={`rounded-xl border ${tones[tone]} bg-white p-4 shadow-sm`}>
      <div className="text-xs text-neutral-500">{label}</div>
      <div className="mt-1 text-xl font-semibold text-neutral-900">{value}</div>
    </div>
  );
}

function Dot({ tone }) {
  const map = {
    good: "bg-emerald-500",
    issue: "bg-rose-500",
    suggestion: "bg-indigo-500",
    neutral: "bg-neutral-300",
  };
  return <span className={`mt-2 h-2 w-2 rounded-full ${map[tone]}`} />;
}

function ListSection({ title, items, tone }) {
  if (!items?.length) return null;
  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
        <Badge tone={tone}>{tone === "good" ? "Good" : title}</Badge>
      </div>
      <ul className="space-y-3">
        {items.map((text, idx) => (
          <li key={idx} className="flex gap-3">
            <Dot tone={tone} />
            <p className="text-sm leading-6 text-neutral-800">{String(text)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ScoreRing({ score = 0 }) {
  // Simple ring visualization
  const clamped = Math.max(0, Math.min(100, Number(score) || 0));
  const dash = 283; // circumference for r=45 (approx)
  const offset = dash - (dash * clamped) / 100;
  const tone =
    clamped >= 85 ? "text-emerald-500" : clamped >= 70 ? "text-amber-500" : "text-rose-500";

  return (
    <div className="relative h-24 w-24">
      <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90">
        <circle cx="50" cy="50" r="45" className="stroke-neutral-200" strokeWidth="8" fill="none" />
        <circle
          cx="50"
          cy="50"
          r="45"
          className={`${tone}`}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          strokeDasharray={dash}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 rotate-90 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold text-neutral-900">{clamped}</div>
          <div className="text-[10px] text-neutral-500">Score</div>
        </div>
      </div>
    </div>
  );
}

export default async function ReportDetailPage() {
  // Read app/output.json from the Next.js project root (Frontend)
  const filePath = path.join(process.cwd(), "app", "output.json");

  let content = null;
  let analysis = { good: [], issues: [], suggestions: [] };
  let meta = { name: "Untitled Report", date: null, id: "" };
  let score = 0;

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    content = JSON.parse(raw);

    // Flexible keys support; adjust here to your actual file keys
    // Example optional keys: title/name, created_at/date, score
    meta = {
      name: content?.title || content?.name || "UI Audit Report",
      date: content?.created_at || content?.date || null,
      id: "",
    };
    score = Number(content?.score ?? 0);

    const candidate = content?.ai_analysis ?? content?.analysis ?? content?.result ?? null;
    const parsed = parseAiAnalysis(candidate);
    if (parsed && typeof parsed === "object") {
      analysis = {
        good: Array.isArray(parsed.good) ? parsed.good : [],
        issues: Array.isArray(parsed.issues) ? parsed.issues : [],
        suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
      };
    }
  } catch {
    // keep defaults
  }

  const totals = {
    good: analysis.good.length,
    issues: analysis.issues.length,
    suggestions: analysis.suggestions.length,
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 md:py-10">
        {/* Hero */}
        <div className="mb-8 flex flex-col gap-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-6">
            <ScoreRing score={score} />
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{meta.name}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-neutral-600">
                <Badge>Report #{meta.id}</Badge>
                {meta.date && (
                  <span className="text-neutral-500">
                    {new Date(meta.date).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
              Share
            </button>
            <button className="rounded-lg bg-neutral-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-black">
              Export PDF
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <KpiCard label="Highlights" value={totals.good} tone="emerald" />
          <KpiCard label="Issues" value={totals.issues} tone="rose" />
          <KpiCard label="Suggestions" value={totals.suggestions} tone="indigo" />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: Issues + Suggestions */}
          <div className="lg:col-span-2 space-y-6">
            <ListSection title="Top Issues" items={analysis.issues} tone="issue" />
            <ListSection title="Suggestions" items={analysis.suggestions} tone="suggestion" />
          </div>

          {/* Right: Highlights + Meta */}
          <div className="lg:col-span-1 space-y-6">
            <ListSection title="What’s Good" items={analysis.good} tone="good" />
            <section className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-base font-semibold text-neutral-900">Report Details</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-neutral-500">Report ID</dt>
                  <dd className="text-neutral-800">{meta.id}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-neutral-500">Generated At</dt>
                  <dd className="text-neutral-800">
                    {meta.date ? new Date(meta.date).toLocaleString() : "—"}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-neutral-500">Score</dt>
                  <dd className="text-neutral-800">{Number(score) || 0}/100</dd>
                </div>
              </dl>
            </section>

            {/* Optional raw preview for debugging (collapse) */}
            <details className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
              <summary className="cursor-pointer text-sm font-medium text-neutral-800">
                Raw JSON (debug)
              </summary>
              <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap text-xs text-neutral-700">
                {JSON.stringify(content ?? {}, null, 2)}
              </pre>
            </details>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-xs text-neutral-500">
          Generated by UIaudit • Validate with user testing for best results
        </div>
      </div>
    </div>
  );
}
