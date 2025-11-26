// JavaScript (React / Next.js)
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAnalyses } from "../../../lib/analyze";

// Robust parser: accepts fenced JSON string, plain JSON string, or direct object
function parseAiAnalysis(raw) {
  if (!raw) return null;
  if (typeof raw === "object") return raw;
  if (typeof raw !== "string") return null;

  const fenceRegex = /```(?:json)?\s*([\s\S]*?)\s*```/i;
  const match = raw.match(fenceRegex);
  const jsonStr = match ? match[1] : raw;
  try {
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

function Badge({ type = "good" }) {
  const styles = {
    good: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    issue: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
    suggestion: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
  };
  const label = type === "good" ? "Good" : type === "issue" ? "Issue" : "Suggestion";
  return (
    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${styles[type]}`}>
      {label}
    </span>
  );
}

function Dot({ color = "emerald" }) {
  const map = {
    emerald: "bg-emerald-500",
    rose: "bg-rose-500",
    indigo: "bg-indigo-500",
    gray: "bg-gray-400",
  };
  return <span className={`inline-block h-2 w-2 rounded-full ${map[color]}`} />;
}

function SectionList({ title, items, type }) {
  const list = Array.isArray(items) ? items : [];
  if (!list.length) return null;

  const color = type === "good" ? "emerald" : type === "issue" ? "rose" : "indigo";

  return (
    <section className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-md">
      <div className="mb-4 flex items-center gap-3">
        <h2 className="text-base font-semibold text-gray-900/90">{title}</h2>
        <Badge type={type} />
      </div>
      <ul className="space-y-3">
        {list.map((item, idx) => {
          let display = "";
          if (item == null) display = "";
          else if (typeof item === "string") display = item;
          else if (typeof item === "object") {
            display =
              item.text ??
              item.message ??
              item.description ??
              item.title ??
              (Object.keys(item).length === 1 ? String(item[Object.keys(item)[0]]) : JSON.stringify(item));
          } else {
            display = String(item);
          }

          return (
            <li key={idx} className="flex gap-3">
              <Dot color={color} />
              <p className="text-sm leading-6 text-gray-800">{display}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function CircleKpi({ label, value, tone = "emerald" }) {
  const ring = {
    emerald: "from-emerald-400 via-emerald-500 to-emerald-600",
    rose: "from-rose-400 via-rose-500 to-rose-600",
    indigo: "from-indigo-400 via-indigo-500 to-indigo-600",
  }[tone];

  const text = {
    emerald: "text-emerald-700",
    rose: "text-rose-700",
    indigo: "text-indigo-700",
  }[tone];

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-24 w-24">
        <div className={`absolute inset-0 rounded-full bg-gradient-to-tr ${ring} opacity-20`} />
        <div className="absolute inset-1 rounded-full bg-white/70 backdrop-blur-md shadow-sm" />
        <div className="relative z-10 flex h-full w-full items-center justify-center">
          <span className={`text-3xl font-semibold ${text}`}>{value}</span>
        </div>
      </div>
      <span className="mt-2 text-xs font-medium text-gray-600">{label}</span>
    </div>
  );
}

function GlassCard({ children, className = "" }) {
  return (
    <div
      className={`rounded-3xl border border-white/25 bg-white/30 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

export default function ReportPage({ params }) {
  const routeParams = useParams();
  const id = params?.id ?? routeParams?.id;

  const [content, setContent] = useState(null);
  const [analysis, setAnalysis] = useState({
    good: [],
    issues: [],
    suggestions: [],
    // Optional KPI buckets for analysis areas (fallback to 0 if missing)
    kpi: {
      typography: 0,
      spacing: 0,
      color: 0,
      layout: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rawErrorBody, setRawErrorBody] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);

      if (!id) {
        setError("Missing report id");
        setLoading(false);
        return;
      }

      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
        const res = await getAnalyses(id, token);
        const latest = Array.isArray(res) && res.length ? res[0] : res || null;

        const candidate = latest?.result ?? null;
        const parsed = parseAiAnalysis(candidate);

        const normalized = {
          good: parsed?.good ?? [],
          issues: parsed?.issues ?? [],
          suggestions: parsed?.suggestions ?? [],
          kpi: {
            typography: Number(parsed?.kpi?.typography ?? 0),
            spacing: Number(parsed?.kpi?.spacing ?? 0),
            color: Number(parsed?.kpi?.color ?? 0),
            layout: Number(parsed?.kpi?.layout ?? 0),
          },
        };

        if (mounted) {
          setContent(latest);
          setAnalysis(normalized);
        }
      } catch (err) {
        setError(err.message || String(err));
        if (err && err.body) setRawErrorBody(err.body);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  const goodCount = loading ? "…" : analysis.good.length;
  const issueCount = loading ? "…" : analysis.issues.length;
  const suggestionCount = loading ? "…" : analysis.suggestions.length;

  const kpi = analysis.kpi || {};
  const kTypography = loading ? "…" : kpi.typography;
  const kSpacing = loading ? "…" : kpi.spacing;
  const kColor = loading ? "…" : kpi.color;
  const kLayout = loading ? "…" : kpi.layout;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 md:py-10">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">UI Audit Report</h1>
            <p className="mt-1 text-sm text-gray-600">Automated insights. Report ID: {id}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow hover:bg-black">
              Export
            </button>
            <button className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
              Share
            </button>
          </div>
        </div>

        {/* Top: KPI Circle cluster + Analysis Area KPIs (both glassmorphism) */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Circular KPI cluster */}
          
          <GlassCard className="flex items-center justify-between">
            
            <div className="flex items-center gap-6">
              <CircleKpi label="Good" value={goodCount} tone="emerald" />
              <CircleKpi label="Issues" value={issueCount} tone="rose" />
              <CircleKpi label="Suggestions" value={suggestionCount} tone="indigo" />
            </div>
          </GlassCard>

          {/* Analysis categories KPI */}
          <GlassCard>
            <h2 className="text-lg font-semibold text-gray-900">Analysis Overview</h2>
            <p className="mt-1 text-sm text-gray-600">Typography, spacing, colors, and layout</p>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-2xl border border-white/30 bg-white/40 p-4 text-center backdrop-blur">
                <p className="text-xs text-gray-600">Typography</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{kTypography}</p>
              </div>
              <div className="rounded-2xl border border-white/30 bg-white/40 p-4 text-center backdrop-blur">
                <p className="text-xs text-gray-600">Spacing</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{kSpacing}</p>
              </div>
              <div className="rounded-2xl border border-white/30 bg-white/40 p-4 text-center backdrop-blur">
                <p className="text-xs text-gray-600">Color</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{kColor}</p>
              </div>
              <div className="rounded-2xl border border-white/30 bg-white/40 p-4 text-center backdrop-blur">
                <p className="text-xs text-gray-600">Layout</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{kLayout}</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Details: What’s Good, Issues, Suggestions in a single elegant panel */}
        <GlassCard className="mb-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6">
              <SectionList title="What’s Good" items={analysis.good} type="good" />
            </div>
            <div className="space-y-6 lg:col-span-2">
              <SectionList title="Issues" items={analysis.issues} type="issue" />
              <SectionList title="Suggestions" items={analysis.suggestions} type="suggestion" />
            </div>
          </div>
        </GlassCard>

        {/* Debug panel (collapsible) */}
        <details className="mt-8 rounded-2xl border border-white/25 bg-white/40 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl">
          <summary className="cursor-pointer text-sm font-medium text-gray-800">Show raw ai_analysis / debug info</summary>
          <div className="mt-3 text-xs text-gray-700">
            {error && (
              <div className="mb-3 text-sm text-rose-600">
                <strong>Error:</strong> {String(error)}
              </div>
            )}
            <pre className="whitespace-pre-wrap text-xs text-gray-700">
              {loading
                ? "Loading…"
                : rawErrorBody
                ? rawErrorBody
                : JSON.stringify(content?.result ?? content ?? null, null, 2)}
            </pre>
          </div>
        </details>
      </div>
    </div>
  );
}
