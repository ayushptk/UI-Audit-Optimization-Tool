"use client";

import React, { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
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
  const label =
    type === "good" ? "Good" : type === "issue" ? "Issue" : "Suggestion";
  return (
    <span
      className={`px-2 py-0.5 rounded-md text-xs font-medium ${styles[type]}`}
    >
      {label}
    </span>
  );
}

function Section({ title, items, type }) {
  const list = Array.isArray(items) ? items : [];
  if (!list.length) return null;

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <Badge type={type} />
      </div>
      <ul className="space-y-3">
        {list.map((item, idx) => {
          // normalize display text: handle strings or common object shapes
          let display = "";
          if (item == null) display = "";
          else if (typeof item === "string") display = item;
          else if (typeof item === "object") {
            display =
              item.text ?? item.message ?? item.description ?? item.title ??
              // fallback: if object is simple with a single key, show its value
              (Object.keys(item).length === 1
                ? String(item[Object.keys(item)[0]])
                : JSON.stringify(item));
          } else {
            display = String(item);
          }

          return (
            <li key={idx} className="flex gap-3">
              <span
                className={`mt-1 inline-block h-2 w-2 flex-none rounded-full ${
                  type === "good"
                    ? "bg-emerald-500"
                    : type === "issue"
                    ? "bg-rose-500"
                    : "bg-indigo-500"
                }`}
              />
              <p className="text-sm leading-6 text-gray-700">{display}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default function ReportPage({ params }) {
  const routeParams = useParams();
  // prefer the incoming `params` prop (server->client), but fall back to `useParams`
  const id = params?.id ?? routeParams?.id;

  const [content, setContent] = useState(null);
  const [analysis, setAnalysis] = useState({
    good: [],
    issues: [],
    suggestions: [],
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
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("access_token")
            : null;

        const res = await getAnalyses(id, token);

        const latest = Array.isArray(res) && res.length ? res[0] : res || null;

        const candidate = latest?.result ?? null;
        const parsed = parseAiAnalysis(candidate);

        const normalized = {
          good: parsed?.good ?? [],
          issues: parsed?.issues ?? [],
          suggestions: parsed?.suggestions ?? [],
        };

        if (mounted) {
          setContent(latest);
          setAnalysis(normalized);
        }
      } catch (err) {
        setError(err.message || String(err));
        // preserve raw body if attached by getAnalyses
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 md:py-10">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              UI Audit Report
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Automated insights. Report ID: {id}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black">
              Export
            </button>
            <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Share
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs text-gray-500">Highlights</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {loading ? "…" : analysis.good.length}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs text-gray-500">Issues</p>
            <p className="mt-2 text-3xl font-semibold text-rose-600">
              {loading ? "…" : analysis.issues.length}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs text-gray-500">Suggestions</p>
            <p className="mt-2 text-3xl font-semibold text-indigo-600">
              {loading ? "…" : analysis.suggestions.length}
            </p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-6">
            <Section title="What’s Good" items={analysis.good} type="good" />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <Section title="Issues" items={analysis.issues} type="issue" />
            <Section
              title="Suggestions"
              items={analysis.suggestions}
              type="suggestion"
            />
          </div>
        </div>

        {/* Raw preview for debugging */}
        <details className="mt-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <summary className="cursor-pointer text-sm font-medium text-gray-800">
            Show raw ai_analysis / debug info
          </summary>
          <div className="mt-3 text-xs text-gray-600">
            {error && (
              <div className="mb-3 text-sm text-rose-600">
                <strong>Error:</strong> {String(error)}
              </div>
            )}
            <pre className="whitespace-pre-wrap text-xs text-gray-600">
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
