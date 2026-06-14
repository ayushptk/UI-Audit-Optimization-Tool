// @ts-nocheck
// JavaScript (React + Tailwind)
// Premium Scanning UI: minimal, modern, elegant
import React from "react";

const stepsDefault = [
  "Uploading design",
  "Preprocessing layers",
  "Analyzing typography",
  "Evaluating spacing",
  "Checking color contrast",
  "Assessing layout",
  "Finalizing report",
];

export default function ScanningAnimation({
  progress = 0, // 0–100
  status = "Analyzing your design…",
  steps = stepsDefault,
  image, // optional File object for uploaded image
}) {
  const pct = Math.max(0, Math.min(100, Number(progress) || 0));

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />
      <div className="absolute inset-0 bg-[radial-gradient(1000px_600px_at_10%_10%,rgba(59,130,246,0.12),transparent),radial-gradient(800px_500px_at_90%_20%,rgba(16,185,129,0.10),transparent),radial-gradient(900px_700px_at_50%_100%,rgba(99,102,241,0.10),transparent)]" />

      {/* Frosted sheet */}
      <div className="absolute inset-0 backdrop-blur-xl bg-white/30" />

      {/* Center container */}
      <div className="relative mx-auto flex h-full max-w-3xl items-center justify-center px-6">
        <div className="w-full overflow-hidden rounded-3xl border border-white/50 bg-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/50 px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-black text-white shadow-sm">
                {/* Minimal mark */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M12 4v16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <div>
                <h3 className="text-sm font-semibold tracking-tight text-gray-900">Scanning</h3>
                <p className="text-xs text-gray-500">AI-powered UI audit in progress</p>
              </div>
            </div>
            <span className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-medium text-gray-700 ring-1 ring-black/5">
              {pct}% complete
            </span>
          </div>

          {/* Scan capsule */}
          <div className="px-6 py-8 sm:px-10">
            <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/70 p-0 shadow-sm">
              {/* Subtle grid backdrop */}
              <div className="absolute inset-0 opacity-[0.35]">
                <svg className="h-full w-full text-gray-200" viewBox="0 0 40 40" fill="none">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Gradient wash for depth */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/60" />

              {/* Scan line sweep */}
              <div className="relative aspect-[16/7] w-full">
                <div className="absolute inset-0">
                  {image && (
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Uploaded design"
                      className="absolute inset-0 h-full w-full rounded-2xl object-cover"
                    />
                  )}
                  <div className="absolute inset-0 animate-[pulse_4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-slate-50/70 to-transparent" />
                  {/* Line */}
                  <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-transparent via-sky-400/60 to-transparent blur-[1px]" />
                  {/* Moving sweep */}
                  <div className="absolute left-0 top-0 h-full w-[28%] animate-[scan_2.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-sky-500/10 to-transparent" />
                </div>
              </div>

              {/* Key status */}
              <div className="flex items-center justify-between gap-4 border-t border-white/60 px-4 py-3">
                <p className="truncate text-sm font-medium text-gray-800">{status}</p>
                <span className="text-xs text-gray-500">Optimizing signals…</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-500 transition-[width] duration-500 ease-out"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <span>Initializing</span>
                <span>Processing</span>
                <span>Finalizing</span>
              </div>
            </div>

            {/* Steps timeline */}
            {Array.isArray(steps) && steps.length > 0 && (
              <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {steps.map((s, i) => {
                  const stepPct = (i / (steps.length - 1)) * 100;
                  const done = pct >= stepPct || pct === 100;
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-xl border border-white/60 bg-white/70 px-3 py-2 text-sm"
                    >
                      <span
                        className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold ${
                          done ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {done ? "✓" : i + 1}
                      </span>
                      <span className={`truncate ${done ? "text-gray-900" : "text-gray-500"}`}>{s}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footnote */}
          <div className="flex items-center justify-between border-t border-white/50 px-6 py-4">
            <p className="text-xs text-gray-500">
              Tip: You can continue working while we analyze. We’ll notify you when it’s ready.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span>Secured processing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes scan {
          0% { transform: translateX(-40%); }
          50% { transform: translateX(120%); }
          100% { transform: translateX(-40%); }
        }
        @keyframes pulse {
          0%, 100% { opacity: .6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
