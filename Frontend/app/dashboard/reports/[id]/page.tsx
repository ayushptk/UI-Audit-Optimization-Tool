// @ts-nocheck
"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAnalyses } from "../../../lib/analyze";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import {
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Share2,
  Download,
  ChevronRight,
  Layout,
  Type,
  Palette,
  MoveHorizontal,
  ImageIcon,
  TrendingUp,
  ArrowLeft,
  Calendar,
  Layers,
  Maximize2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

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

const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

function StatCard({ label, value, icon: Icon, color, delay }) {
  const colorStyles = {
    purple: "bg-purple-50 text-purple-600 ring-purple-100",
    blue: "bg-blue-50 text-blue-600 ring-blue-100",
    amber: "bg-amber-50 text-amber-600 ring-amber-100",
    emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  };

  const style = colorStyles[color] || colorStyles.blue;

  return (
    <motion.div
      variants={itemVariants}
      className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold text-gray-900">{value}</span>
            <span className="text-sm font-medium text-gray-400">/100</span>
          </div>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ring-1 ${style} transition-transform group-hover:scale-110`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {/* Decorative background blob */}
      <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-5 blur-2xl ${style.split(' ')[0].replace('bg-', 'bg-')}`} />
    </motion.div>
  );
}

function AnalysisCard({ item, type }) {
  const styles = {
    issue: {
      border: "border-rose-100 hover:border-rose-200",
      bg: "bg-white",
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
      icon: AlertTriangle,
      badge: "bg-rose-50 text-rose-700 border-rose-100",
    },
    suggestion: {
      border: "border-indigo-100 hover:border-indigo-200",
      bg: "bg-white",
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
      icon: Lightbulb,
      badge: "bg-indigo-50 text-indigo-700 border-indigo-100",
    },
    good: {
      border: "border-emerald-100 hover:border-emerald-200",
      bg: "bg-white",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      icon: CheckCircle,
      badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
  };

  const style = styles[type] || styles.suggestion;
  const Icon = style.icon;

  let content = "";
  if (typeof item === "string") content = item;
  else if (typeof item === "object") {
    content = item.text ?? item.message ?? item.description ?? item.title ?? JSON.stringify(item);
  } else {
    content = String(item ?? "");
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className={`group flex gap-4 rounded-xl border ${style.border} ${style.bg} p-5 shadow-sm transition-all hover:shadow-md`}
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${style.iconBg} ${style.iconColor} ring-1 ring-inset ring-black/5`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <p className="text-sm leading-relaxed text-gray-700">{content}</p>
      </div>
    </motion.div>
  );
}

export default function ReportPage() {
  const { id } = useParams();
  const router = useRouter();

  const [content, setContent] = useState(null);
  const [analysis, setAnalysis] = useState({
    good: [],
    issues: [],
    suggestions: [],
    kpi: { typography: 0, spacing: 0, color: 0, layout: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [activeTab, setActiveTab] = useState("issues");
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef(null);

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

        // Fetch Analysis
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

        // Fetch Image
        try {
          const imgRes = await fetch(`http://127.0.0.1:8000/api/design/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (imgRes.ok) {
            const blob = await imgRes.blob();
            const url = URL.createObjectURL(blob);
            if (mounted) setImageUrl(url);
          }
        } catch (imgErr) {
        }

        if (mounted) {
          setContent(latest);
          setAnalysis(normalized);
        }
      } catch (err) {
        setError(err.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [id]);

  const handleExport = async () => {
    if (!reportRef.current) return;

    setIsExporting(true);
    try {
      const dataUrl = await toPng(reportRef.current, {
        quality: 0.95,
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        width: reportRef.current.scrollWidth,
        height: reportRef.current.scrollHeight,
        fontEmbedCSS: '' // Prevent font parsing errors
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgProperties = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
      const pageHeight = pdf.internal.pageSize.getHeight();

      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`report-${id}.pdf`);
    } catch (error) {
    } finally {
      setIsExporting(false);
    }
  };

  const kpi = analysis.kpi || {};

  const tabs = [
    { id: "issues", label: "Critical Issues", icon: AlertTriangle, count: analysis.issues.length, color: "text-rose-600" },
    { id: "suggestions", label: "Suggestions", icon: Lightbulb, count: analysis.suggestions.length, color: "text-indigo-600" },
    { id: "good", label: "Passed Checks", icon: CheckCircle, count: analysis.good.length, color: "text-emerald-600" },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600"></div>
          <p className="text-sm font-medium text-gray-500">Analyzing design...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <AlertTriangle className="mx-auto h-12 w-12 text-rose-500" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">Analysis Failed</h3>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gray-50/50 pb-20 font-sans"
    >
      {/* Top Navigation Bar */}
      <div className="top-0 z-30 border-b border-gray-200 bg-white/80 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Reports
          </button>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-gray-800 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'Export Report'}</span>
            </button>
          </div>
        </div>
      </div>

      <div ref={reportRef} className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-gray-50/50">
        {/* Header Section */}
        <motion.div variants={itemVariants} className="mb-10">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Design Audit Result
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {new Date().toLocaleDateString()}
              </span>
              <span className="h-1 w-1 rounded-full bg-gray-300"></span>
              <span className="font-mono text-gray-600">ID: {id?.slice(0, 8)}</span>
            </div>
          </div>
        </motion.div>

        <div className="space-y-8">
          {/* Overall Score Section */}
          <motion.div variants={itemVariants} className="rounded-2xl border border-gray-200 bg-gradient-to-br from-indigo-500 to-purple-600 p-8 text-white shadow-lg">
            <div className="flex flex-col items-center justify-center text-center sm:flex-row sm:justify-between sm:text-left">
              <div>
                <div className="mb-2 flex items-center justify-center gap-3 sm:justify-start">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">Overall Score</h3>
                </div>
                <p className="max-w-xl text-indigo-100">
                  Based on AI analysis of typography, spacing, colors, and layout consistency.
                  Your design is evaluated against modern UI standards.
                </p>
              </div>
              <div className="mt-6 flex items-baseline gap-2 sm:mt-0">
                <span className="text-6xl font-bold tracking-tight">
                  {Math.round((kpi.typography + kpi.spacing + kpi.color + kpi.layout) / 4)}
                </span>
                <span className="text-xl font-medium text-white/80">/ 100</span>
              </div>
            </div>
          </motion.div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Typography" value={kpi.typography} icon={Type} color="purple" delay={0.1} />
            <StatCard label="Spacing" value={kpi.spacing} icon={MoveHorizontal} color="blue" delay={0.2} />
            <StatCard label="Color Palette" value={kpi.color} icon={Palette} color="amber" delay={0.3} />
            <StatCard label="Layout" value={kpi.layout} icon={Layout} color="emerald" delay={0.4} />
          </div>

          {/* Image Preview (Full Width) */}
          <motion.div variants={itemVariants}>
            <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
              <div className="absolute inset-x-0 top-0 z-10 flex items-center gap-1.5 border-b border-gray-100 bg-gray-50/90 px-4 py-3 backdrop-blur-sm">
                <div className="h-3 w-3 rounded-full bg-rose-400/80"></div>
                <div className="h-3 w-3 rounded-full bg-amber-400/80"></div>
                <div className="h-3 w-3 rounded-full bg-emerald-400/80"></div>
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-400">Preview</span>
                  <Maximize2 className="h-3.5 w-3.5 text-gray-400" />
                </div>
              </div>
              <div className="relative aspect-video w-full bg-gray-100 pt-10">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Analyzed Design"
                    className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-gray-400">
                    <ImageIcon className="h-10 w-10 opacity-50" />
                    <span className="text-sm font-medium">No preview available</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Analysis Tabs */}
          <motion.div variants={itemVariants} className="min-h-[500px] rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 p-2">
              <div className="flex gap-1 overflow-x-auto p-1 sm:gap-2">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all ${isActive ? "text-gray-900" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                        }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 rounded-xl bg-gray-100"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${isActive ? tab.color : "text-gray-400"}`} />
                        {tab.label}
                        <span className={`ml-1 rounded-full px-2 py-0.5 text-xs ${isActive ? "bg-white shadow-sm" : "bg-gray-100"}`}>
                          {tab.count}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {activeTab === "issues" && (
                    <>
                      <div className="mb-4 flex items-center gap-2 text-sm text-rose-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="font-medium">Critical issues that need attention</span>
                      </div>
                      {analysis.issues.length > 0 ? (
                        analysis.issues.map((item, idx) => (
                          <AnalysisCard key={idx} item={item} type="issue" />
                        ))
                      ) : (
                        <p className="py-8 text-center text-gray-500">No critical issues found! Great job.</p>
                      )}
                    </>
                  )}

                  {activeTab === "suggestions" && (
                    <>
                      <div className="mb-4 flex items-center gap-2 text-sm text-indigo-600">
                        <Lightbulb className="h-4 w-4" />
                        <span className="font-medium">Recommended improvements</span>
                      </div>
                      {analysis.suggestions.length > 0 ? (
                        analysis.suggestions.map((item, idx) => (
                          <AnalysisCard key={idx} item={item} type="suggestion" />
                        ))
                      ) : (
                        <p className="py-8 text-center text-gray-500">No suggestions available.</p>
                      )}
                    </>
                  )}

                  {activeTab === "good" && (
                    <>
                      <div className="mb-4 flex items-center gap-2 text-sm text-emerald-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-medium">Things you did well</span>
                      </div>
                      {analysis.good.length > 0 ? (
                        analysis.good.map((item, idx) => (
                          <AnalysisCard key={idx} item={item} type="good" />
                        ))
                      ) : (
                        <p className="py-8 text-center text-gray-500">No passed checks listed.</p>
                      )}
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
