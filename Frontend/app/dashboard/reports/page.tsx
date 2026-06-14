// @ts-nocheck
"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiFileText, FiTrendingUp, FiAlertCircle, FiCheckCircle, FiClock, FiArrowRight, FiFilter, FiDownload } from "react-icons/fi";
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';
import { useSelector } from "react-redux";

const BASE_URL = "https://fastapi-backend-s1rw.onrender.com";

function Badge({ tone = "neutral", children }) {
  const styles = {
    neutral: "bg-slate-100 text-slate-600 ring-slate-200",
    good: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    issue: "bg-rose-50 text-rose-700 ring-rose-200",
    warning: "bg-amber-50 text-amber-700 ring-amber-200",
  };
  return (
    <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${styles[tone]}`}>
      {children}
    </span>
  );
}

function Kpi({ label, value, hint, tone = "neutral", icon: Icon }) {
  const styles = {
    neutral: "bg-white border-slate-200 text-slate-900",
    emerald: "bg-white border-emerald-100 text-emerald-900",
    rose: "bg-white border-rose-100 text-rose-900",
    indigo: "bg-white border-indigo-100 text-indigo-900",
    amber: "bg-white border-amber-100 text-amber-900",
  };

  const iconColors = {
    neutral: "bg-slate-100 text-slate-500",
    emerald: "bg-emerald-100 text-emerald-600",
    rose: "bg-rose-100 text-rose-600",
    indigo: "bg-indigo-100 text-indigo-600",
    amber: "bg-amber-100 text-amber-600",
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl border p-6 shadow-sm transition-all hover:shadow-md ${styles[tone]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
        </div>
        {Icon && (
          <div className={`rounded-xl p-2.5 ${iconColors[tone]}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {hint && <div className="mt-4 text-xs font-medium text-slate-400">{hint}</div>}
    </div>
  );
}

function ScorePill({ score }) {
  const s = Math.max(0, Math.min(100, Number(score) || 0));
  let colorClass = "text-rose-600 bg-rose-50 ring-rose-200";
  if (s >= 85) colorClass = "text-emerald-600 bg-emerald-50 ring-emerald-200";
  else if (s >= 70) colorClass = "text-amber-600 bg-amber-50 ring-amber-200";

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 w-24 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${s >= 85 ? 'bg-emerald-500' : s >= 51 ? 'bg-amber-500' : 'bg-rose-500'}`}
          style={{ width: `${s}%` }}
        />
      </div>
      <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${colorClass}`}>
        {s}/100
      </span>
    </div>
  );
}

export default function ReportsOverviewPage() {
  const { token } = useSelector((state: any) => state.auth);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reportsRef = useRef(null);

  useEffect(() => {
    async function fetchReports() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BASE_URL}/api/designs`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const normalized = (Array.isArray(data) ? data : []).map((d) => {
          const analysisRaw = d.analysis_result;
          let analysis = null;

          // Robust parsing logic similar to details page
          if (typeof analysisRaw === "object" && analysisRaw !== null) {
            analysis = analysisRaw;
          } else if (typeof analysisRaw === "string") {
            try {
              // Try removing markdown fences if present
              const fenceRegex = /```(?:json)?\s*([\s\S]*?)\s*```/i;
              const match = analysisRaw.match(fenceRegex);
              const jsonStr = match ? match[1] : analysisRaw;
              analysis = JSON.parse(jsonStr);
            } catch (e) {
              analysis = null;
            }
          }

          const goodCount = Array.isArray(analysis?.good) ? analysis.good.length : typeof analysis?.good === "number" ? analysis.good : 0;
          const issuesCount = Array.isArray(analysis?.issues) ? analysis.issues.length : typeof analysis?.issues === "number" ? analysis.issues : 0;
          const suggestionsCount = Array.isArray(analysis?.suggestions) ? analysis.suggestions.length : typeof analysis?.suggestions === "number" ? analysis.suggestions : 0;

          let scoreValue = null;

          // prioritize KPI average calculation to match details page
          if (analysis?.kpi) {
            const kpi = analysis.kpi;
            const typography = Number(kpi.typography || 0);
            const spacing = Number(kpi.spacing || 0);
            const color = Number(kpi.color || 0);
            const layout = Number(kpi.layout || 0);

            // Only use average if we have some KPI data
            if (typography || spacing || color || layout) {
              scoreValue = Math.round((typography + spacing + color + layout) / 4);
            }
          }

          // Fallback to existing logic if KPI-based score is not available
          if (scoreValue === null) {
            if (analysis && typeof analysis.score === "number") {
              scoreValue = analysis.score;
            } else if (analysis && typeof analysis.score === "string" && !isNaN(Number(analysis.score))) {
              scoreValue = Number(analysis.score);
            } else {
              const totalFindings = goodCount + issuesCount + suggestionsCount;
              scoreValue = totalFindings > 0 ? Math.round((goodCount / totalFindings) * 100) : null;
            }
          }

          return {
            id: String(d.id),
            title: d.filename || `Report ${d.id}`,
            date: d.uploaded_at || null,
            score: scoreValue,
            totals: {
              good: goodCount,
              issues: issuesCount,
              suggestions: suggestionsCount,
            },
          };
        });
        setReports(normalized);
      } catch (err) {
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

  const handleExport = async () => {
    if (!reportsRef.current) return;

    try {
      const dataUrl = await toPng(reportsRef.current, {
        cacheBust: false,
        pixelRatio: 2,
        fontEmbedCSS: '' // Skip font embedding to avoid parsing errors
      });
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [reportsRef.current.scrollWidth, reportsRef.current.scrollHeight]
      });

      pdf.addImage(dataUrl, 'PNG', 0, 0, reportsRef.current.scrollWidth, reportsRef.current.scrollHeight);
      pdf.save('reports-summary.pdf');
    } catch (error) {
    }
  };

  const count = reports.length;
  const avgScore = count ? Math.round(reports.reduce((a, r) => a + (Number(r.score) || 0), 0) / count) : 0;
  const totalGood = reports.reduce((a, r) => a + (r.totals?.good || 0), 0);
  const totalIssues = reports.reduce((a, r) => a + (r.totals?.issues || 0), 0);

  return (
    <motion.div
      ref={reportsRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen space-y-8 bg-white p-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between pb-6 border-b border-slate-200/60">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-outfit">Audit Reports</h1>
          <p className="mt-2 text-slate-500">Track and analyze your design quality over time.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5  cursor-pointer text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
          >
            <FiDownload className="w-4 h-4" />
            Export Summary
          </button>
          <Link href="/dashboard/upload">
            <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all">
              <FiFileText className="w-4 h-4" />
              New Audit
            </button>
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Total Reports" value={count} hint="Generated audits" tone="neutral" icon={FiFileText} />
        <Kpi label="Average Score" value={`${avgScore}`} hint="Overall quality score" tone="amber" icon={FiTrendingUp} />
        <Kpi label="Total Highlights" value={totalGood} hint="Positive findings" tone="emerald" icon={FiCheckCircle} />
        <Kpi label="Critical Issues" value={totalIssues} hint="Needs attention" tone="rose" icon={FiAlertCircle} />
      </div>

      {/* Reports List */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Recent Audits</h3>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors">
              <FiFilter className="w-3 h-3" />
              Filter
            </button>
            <select className="bg-transparent text-xs font-medium text-slate-500 outline-none cursor-pointer hover:text-indigo-600 transition-colors">
              <option>Sort by: Newest</option>
              <option>Sort by: Score</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-indigo-600"></div>
            <p className="mt-4 text-sm text-slate-500">Loading reports...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-rose-600">
            <FiAlertCircle className="mx-auto h-8 w-8 mb-2" />
            <p>Error loading reports: {error}</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="p-16 text-center">
            <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <FiFileText className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No reports yet</h3>
            <p className="mt-1 text-slate-500 max-w-sm mx-auto">Upload your first design to generate a comprehensive audit report.</p>
            <Link href="/dashboard/upload" className="mt-6 inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700 hover:underline">
              Start your first audit <FiArrowRight />
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {reports.map((r, i) => (
              <motion.li
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group flex flex-col gap-4 p-6 transition-colors hover:bg-slate-50/50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold text-lg">
                    IMG
                  </div>
                  <div>
                    <Link href={`/dashboard/reports/${encodeURIComponent(r.id)}`} className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors">
                      {r.title}
                    </Link>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <FiClock className="w-3 h-3" />
                        {r.date ? new Date(r.date).toLocaleDateString() : "Unknown date"}
                      </span>
                      <span className="hidden sm:inline text-slate-300">•</span>
                      <div className="flex gap-2">
                        <span className="text-emerald-600 font-medium">{r.totals?.good ?? 0} Good</span>
                        <span className="text-rose-600 font-medium">{r.totals?.issues ?? 0} Issues</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-6 sm:justify-end">
                  <div className="w-32 hidden sm:block">
                    <ScorePill score={r.score} />
                  </div>
                  <Link
                    href={`/dashboard/reports/${encodeURIComponent(r.id)}`}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:border-indigo-200 hover:text-indigo-600 hover:shadow-sm"
                  >
                    View Report
                    <FiArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}

