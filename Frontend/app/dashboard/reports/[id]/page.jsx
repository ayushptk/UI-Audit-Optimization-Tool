// JavaScript (React / Next.js)
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAnalyses } from "../../../lib/analyze";
import {
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Share2,
  Download,
  ChevronDown,
  Activity,
  Layout,
  Type,
  Palette,
  MoveHorizontal,
  ImageIcon,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

function KpiPill({ label, value, icon: Icon, tone = "blue", delay = 0 }) {
  const tones = {
    emerald: "text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200",
    rose: "text-rose-700 bg-rose-50 ring-1 ring-rose-200",
    indigo: "text-indigo-700 bg-indigo-50 ring-1 ring-indigo-200",
    blue: "text-blue-700 bg-blue-50 ring-1 ring-blue-200",
    amber: "text-amber-700 bg-amber-50 ring-1 ring-amber-200",
    purple: "text-purple-700 bg-purple-50 ring-1 ring-purple-200",
  };
  const cls = tones[tone] || tones.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay }}
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${cls} backdrop-blur-sm`}
    >
      <div className="rounded-xl bg-white/70 p-2 shadow-sm">
        {Icon && <Icon className="h-4 w-4" />}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-xs font-medium opacity-80">{label}</span>
        <span className="text-xl font-bold leading-none">{value}</span>
      </div>
    </motion.div>
  );
}

function IssueCard({ item, type }) {
  const styles = {
    issue: {
      border: "border-rose-100",
      bg: "bg-rose-50/60",
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
      icon: AlertTriangle,
      titleColor: "text-rose-900",
    },
    suggestion: {
      border: "border-indigo-100",
      bg: "bg-indigo-50/60",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      icon: Lightbulb,
      titleColor: "text-indigo-900",
    },
    good: {
      border: "border-emerald-100",
      bg: "bg-emerald-50/60",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      icon: CheckCircle,
      titleColor: "text-emerald-900",
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group relative overflow-hidden rounded-xl border ${style.border} ${style.bg} p-4 transition-all hover:shadow-sm`}
    >
      <div className="flex gap-4">
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style.iconBg} ${style.iconColor}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <p className={`text-sm font-medium leading-relaxed ${style.titleColor}`}>{content}</p>
        </div>
      </div>
    </motion.div>
  );
}

function AccordionSection({ title, items, type, icon: Icon, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (!items?.length) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between bg-gray-50/60 px-6 py-4 transition-colors hover:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-gray-900/5">
            {Icon && <Icon className="h-4 w-4 text-gray-600" />}
          </div>
          <div className="flex flex-col items-start">
            <h2 className="text-base font-semibold text-gray-900">{title}</h2>
            <span className="text-xs text-gray-500">{items.length} items</span>
          </div>
        </div>
        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="border-t border-gray-100 p-6">
              <div className="grid gap-3">
                {items.map((item, idx) => (
                  <IssueCard key={idx} item={item} type={type} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
    kpi: { typography: 0, spacing: 0, color: 0, layout: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rawErrorBody, setRawErrorBody] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

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

        // Fetch Image (full width display)
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
          console.error("Failed to fetch image:", imgErr);
        }

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
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [id]);

  const kpi = analysis.kpi || {};

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20 font-sans">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Dashboard</span>
              <span>/</span>
              <span>Reports</span>
              <span>/</span>
              <span className="font-mono text-gray-900">#{id?.slice(0, 8)}</span>
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">UI Audit Analysis</h1>
            <p className="mt-2 text-gray-600">Clean, minimal, and clear view of your design health.</p>
          </div>
          <div className="flex gap-3">
            <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900">
              <Share2 className="h-4 w-4" />
              Share
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-800">
              <Download className="h-4 w-4" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Scoreboard: horizontal AI Calculated */}
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-sm backdrop-blur">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
              <TrendingUp className="h-4 w-4" />
              Scorecard
            </h3>
            
          </div>
          <div className="flex flex-wrap items-stretch gap-3">
            <KpiPill label="Typography" value={kpi.typography} icon={Type} tone="purple" delay={0.05} />
            <KpiPill label="Spacing" value={kpi.spacing} icon={MoveHorizontal} tone="blue" delay={0.1} />
            <KpiPill label="Color Palette" value={kpi.color} icon={Palette} tone="amber" delay={0.15} />
            <KpiPill label="Layout Structure" value={kpi.layout} icon={Layout} tone="emerald" delay={0.2} />
          </div>
        </div>

        {/* Full-width image */}
        <div className="mb-10 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 bg-gray-50/60 px-4 py-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <ImageIcon className="h-4 w-4 text-gray-500" />
              Design Preview
            </h3>
          </div>
          <div className="relative w-full bg-gray-100">
            {imageUrl ? (
              <img src={imageUrl} alt="Analyzed Design" className="h-auto w-full object-contain" />
            ) : (
              <div className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 text-gray-400">
                <ImageIcon className="h-8 w-8 opacity-50" />
                <span className="text-sm">No image available</span>
              </div>
            )}
          </div>
        </div>

        {/* Analysis sections under image */}
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-12 space-y-6">
            <AccordionSection
              title="Critical Issues"
              items={analysis.issues}
              type="issue"
              icon={AlertTriangle}
              defaultOpen={true}
            />
            <AccordionSection
              title="Optimization Suggestions"
              items={analysis.suggestions}
              type="suggestion"
              icon={Lightbulb}
            />
            <AccordionSection
              title="What You Did Well"
              items={analysis.good}
              type="good"
              icon={CheckCircle}
            />
          </div>
        </div>


      </div>
    </div>
  );      
}
