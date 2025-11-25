// JavaScript
// app/dashboard/reports/page.jsx
import fs from "fs";
import path from "path";

function Badge({ tone = "neutral", children }) {
  const tones = {
    neutral: "bg-neutral-100 text-neutral-700 ring-1 ring-neutral-200",
    good: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    issue: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
    warning: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  };
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

function Kpi({ label, value, hint, tone = "neutral" }) {
  const border = {
    neutral: "border-neutral-200",
    emerald: "border-emerald-200",
    rose: "border-rose-200",
    indigo: "border-indigo-200",
    amber: "border-amber-200",
  }[tone];
  return (
    <div className={`rounded-2xl border ${border} bg-white p-5 shadow-sm`}>
      <div className="text-xs text-neutral-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-neutral-900">{value}</div>
      {hint && <div className="mt-1 text-xs text-neutral-500">{hint}</div>}
    </div>
  );
}

function ScorePill({ score }) {
  const s = Math.max(0, Math.min(100, Number(score) || 0));
  const tone = s >= 85 ? "text-emerald-600 bg-emerald-50 ring-emerald-200" : s >= 70 ? "text-amber-600 bg-amber-50 ring-amber-200" : "text-rose-600 bg-rose-50 ring-rose-200";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${tone}`}>
      {s}/100
    </span>
  );
}

function Section({ title, right, children }) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
        {right}
      </div>
      {children}
    </section>
  );
}

function Empty() {
  return (
    <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
      No reports yet. Generate your first audit to see insights here.
    </div>
  );
}

export default async function ReportsOverviewPage() {
  // Example: read a list file with many reports.
  // If you don't have it yet, keep a placeholder array and wire up later.
  const listPath = path.join(process.cwd(), "app", "reports.json");
  let reports = [];
  try {
    const raw = fs.readFileSync(listPath, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) reports = parsed;
  } catch {
    // Placeholder demo data
    reports = [
      { id: "R-1042", title: "UI Audit — Marketing Site", date: new Date().toISOString(), score: 87, totals: { good: 24, issues: 5, suggestions: 12 } },
      { id: "R-1041", title: "UI Audit — Dashboard", date: new Date(Date.now() - 86400000).toISOString(), score: 78, totals: { good: 19, issues: 9, suggestions: 14 } },
      { id: "R-1040", title: "UI Audit — Auth Flows", date: new Date(Date.now() - 2*86400000).toISOString(), score: 65, totals: { good: 12, issues: 15, suggestions: 9 } },
    ];
  }

  // Aggregate
  const count = reports.length;
  const avgScore = count ? Math.round(reports.reduce((a, r) => a + (Number(r.score) || 0), 0) / count) : 0;
  const totalGood = reports.reduce((a, r) => a + (r.totals?.good || 0), 0);
  const totalIssues = reports.reduce((a, r) => a + (r.totals?.issues || 0), 0);
  const totalSuggestions = reports.reduce((a, r) => a + (r.totals?.suggestions || 0), 0);

  return (
    <div className="min-h-screen ">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 md:py-10">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Reports</h1>
            <p className="mt-1 text-sm text-neutral-600">Overview of all generated audits across your project.</p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
              Export Summary
            </button>
            <button className="rounded-lg bg-neutral-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-black">
              New Audit
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi label="Reports" value={count} hint="Total generated" tone="neutral" />
          <Kpi label="Average Score" value={`${avgScore}/100`} hint="Across all reports" tone="amber" />
          <Kpi label="Highlights" value={totalGood} hint="Positive findings" tone="emerald" />
          <Kpi label="Issues" value={totalIssues} hint="Needs attention" tone="rose" />
        </div>

        {/* Filters + List */}
        <Section
          title="All Reports"
          right={
            <div className="flex items-center gap-2">
              <select className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-sm text-neutral-700">
                <option>Sort: Newest</option>
                <option>Sort: Oldest</option>
                <option>Sort: Highest Score</option>
                <option>Sort: Lowest Score</option>
              </select>
              <select className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-sm text-neutral-700">
                <option>Filter: All</option>
                <option>Score ≥ 85</option>
                <option>Score 70–84</option>
                <option>Score &lt; 70</option>
              </select>
            </div>
          }
        >
          {reports.length === 0 ? (
            <Empty />
          ) : (
            <ul className="divide-y divide-neutral-100">
              {reports.map((r) => (
                <li key={r.id} className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <a href={`/dashboard/reports/${encodeURIComponent(r.id)}`} className="truncate text-sm font-medium text-neutral-900 hover:underline">
                        {r.title || `Report ${r.id}`}
                      </a>
                      <Badge tone="neutral">{r.id}</Badge>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                      <span>{r.date ? new Date(r.date).toLocaleString() : "—"}</span>
                      <span className="hidden md:inline text-neutral-300">•</span>
                      <span className="flex items-center gap-2">
                        <Badge tone="good">Good: {r.totals?.good ?? 0}</Badge>
                        <Badge tone="issue">Issues: {r.totals?.issues ?? 0}</Badge>
                        <Badge tone="warning">Suggestions: {r.totals?.suggestions ?? 0}</Badge>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ScorePill score={r.score} />
                    <a
                      href={`/dashboard/reports/${encodeURIComponent(r.id)}`}
                      className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                    >
                      View
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Section>

      

        <div className="mt-10 text-center text-xs text-neutral-500">
          UIaudit — Overall report summary
        </div>
      </div>
    </div>
  );
}
