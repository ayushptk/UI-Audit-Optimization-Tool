'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiTrash2,
  FiDownload,
  FiEye,
  FiPlus,
  FiShare2,
} from 'react-icons/fi';

// Mock data
const MOCK_REPORTS = [
  {
    id: 'RPT-001',
    name: 'Homepage Audit',
    designName: 'Homepage_v2.fig',
    designType: 'Figma',
    date: '2025-10-20',
    score: 87,
    status: 'Completed',
    best: true,
  },
  {
    id: 'RPT-002',
    name: 'Onboarding Flow',
    designName: 'Onboarding_mobile.png',
    designType: 'Image',
    date: '2025-10-22',
    score: 78,
    status: 'Completed',
  },
  {
    id: 'RPT-003',
    name: 'Pricing Page',
    designName: 'pricing.fig',
    designType: 'Figma',
    date: '2025-11-02',
    score: 0,
    status: 'Failed',
  },
  {
    id: 'RPT-004',
    name: 'Checkout UX',
    designName: 'checkout.fig',
    designType: 'Figma',
    date: '2025-11-08',
    score: 65,
    status: 'Pending',
  },
  {
    id: 'RPT-005',
    name: 'Dashboard Refresh',
    designName: 'dashboard_v3.fig',
    designType: 'Figma',
    date: '2025-11-10',
    score: 83,
    status: 'Completed',
  },
];

// Helper: join class names
const cls = (...args) => args.filter(Boolean).join(' ');

// Status color mapping
const statusColor = (status) =>
  status === 'Completed'
    ? 'text-emerald-700 bg-emerald-50 ring-1 ring-emerald-100'
    : status === 'Pending'
    ? 'text-amber-700 bg-amber-50 ring-1 ring-amber-100'
    : 'text-rose-700 bg-rose-50 ring-1 ring-rose-100';

export default function ReportsPage() {
  const [query, setQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [minScore, setMinScore] = useState('');
  const [status, setStatus] = useState('All');
  const [designType, setDesignType] = useState('All');

  // Action handlers
  const onDelete = (id) => {
    alert(`Delete report ${id}`);
  };

  const onReAudit = (id) => {
    alert(`Re-Audit triggered for ${id}`);
  };

  const onDownload = (id) => {
    alert(`Download report ${id} as PDF`);
  };

  // Fixed: window.location only used on click (no SSR mismatch)
  const onShare = (id) => {
    const path = `/dashboard/report/${id}`;
    const fullUrl = `${window.location.origin}${path}`;
    navigator.clipboard?.writeText(fullUrl);
    alert('Public link copied to clipboard');
  };

  // Filter & sort reports
  const filtered = useMemo(() => {
    return MOCK_REPORTS.filter((r) => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.designName.toLowerCase().includes(q);
      const inDateFrom = !dateFrom || new Date(r.date) >= new Date(dateFrom);
      const inDateTo = !dateTo || new Date(r.date) <= new Date(dateTo);
      const meetsScore = !minScore || Number(r.score || 0) >= Number(minScore);
      const matchesStatus = status === 'All' || r.status === status;
      const matchesType = designType === 'All' || r.designType === designType;

      return (
        matchesQuery &&
        inDateFrom &&
        inDateTo &&
        meetsScore &&
        matchesStatus &&
        matchesType
      );
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [query, dateFrom, dateTo, minScore, status, designType]);

  // Summary stats
  const summary = useMemo(() => {
    const total = filtered.length;
    const completed = filtered.filter((r) => r.status === 'Completed');
    const avg =
      completed.length === 0
        ? 0
        : Math.round(
            completed.reduce((sum, r) => sum + (r.score || 0), 0) /
              completed.length
          );
    const best =
      completed.length === 0
        ? null
        : completed.reduce((prev, curr) =>
            (prev?.score || 0) > (curr.score || 0) ? prev : curr
          );
    const pending = filtered.filter((r) => r.status === 'Pending').length;
    return { total, avg, best, pending };
  }, [filtered]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
            Audit Reports
          </h1>
          <p className="text-sm text-neutral-500">
            Review, filter, and manage your UI audit results.
          </p>
        </div>
        <Link
          href="/dashboard/upload"
          className="inline-flex items-center gap-2 rounded-md bg-blue-700 text-white px-3.5 py-2 text-sm font-medium hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-black/20"
        >
          <FiPlus className="h-4 w-4" />
          New Upload
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Reports Generated" value={summary.total} />
        <StatCard title="Average Audit Score" value={`${summary.avg}/100`} tone="blue" />
        <StatCard
          title="Best Scoring Design"
          value={summary.best ? `${summary.best.name} (${summary.best.score})` : '—'}
          tone="emerald"
        />
        <StatCard title="Reports Pending Review" value={summary.pending} tone="amber" />
      </div>

      {/* Filters */}
      {/* <div className="rounded-lg border border-neutral-200 bg-white p-3 sm:p-4">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-end">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search reports or design names"
              className="w-full pl-10 pr-3 py-2 rounded-md border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-1">
            <div>
              <label className="block text-xs text-neutral-500 mb-1">From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full rounded-md border border-neutral-200 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-1">To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full rounded-md border border-neutral-200 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-1">Min score</label>
              <input
                type="number"
                min={0}
                max={100}
                value={minScore}
                onChange={(e) => setMinScore(e.target.value)}
                placeholder="e.g. 80"
                className="w-full rounded-md border border-neutral-200 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>
            <div>
              <button
                onClick={() => {
                  setQuery('');
                  setDateFrom('');
                  setDateTo('');
                  setMinScore('');
                  setStatus('All');
                  setDesignType('All');
                }}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-neutral-200 px-3 py-2 text-sm hover:bg-neutral-50"
                title="Reset filters"
              >
                <FiRefreshCw className="h-4 w-4" />
                Reset
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full lg:w-auto">
            <div>
              <label className="block text-xs text-neutral-500 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-md border border-neutral-200 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              >
                <option>All</option>
                <option>Completed</option>
                <option>Pending</option>
                <option>Failed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-1">Design type</label>
              <select
                value={designType}
                onChange={(e) => setDesignType(e.target.value)}
                className="w-full rounded-md border border-neutral-200 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              >
                <option>All</option>
                <option>Figma</option>
                <option>Image</option>
                <option>Other</option>
              </select>
            </div>
            <div className="hidden md:flex items-center gap-2 text-neutral-500 text-sm">
              <FiFilter />
              Filters
            </div>
          </div>
        </div>
      </div> */}

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50 text-neutral-600">
              <tr>
                <Th>Report</Th>
                <Th>Design</Th>
                <Th>Date</Th>
                <Th>Score</Th>
                <Th>Status</Th>
                <Th className="text-right pr-4">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-50/50">
                  <Td>
                    <div className="flex flex-col">
                      <Link
                        href={`/dashboard/report/${r.id}`}
                        className="font-medium hover:underline"
                        title="View details"
                      >
                        {r.name}
                      </Link>
                      <span className="text-xs text-neutral-500">{r.id}</span>
                    </div>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-600">
                        {r.designType}
                      </span>
                      <span className="text-neutral-700">{r.designName}</span>
                    </div>
                  </Td>
                  <Td>{new Date(r.date).toLocaleDateString('en-US')}</Td>
                  <Td>
                    <ScorePill score={r.score} />
                  </Td>
                  <Td>
                    <span
                      className={cls(
                        'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium',
                        statusColor(r.status)
                      )}
                    >
                      {r.status}
                    </span>
                  </Td>
                  <Td className="text-right">
                    <div className="flex items-center justify-end gap-1.5 pr-2">
                      <Link href={`/dashboard/report/${r.id}`} className="icon-btn" title="View">
                        <FiEye className="h-4 w-4" />
                      </Link>
                      <button onClick={() => onDownload(r.id)} className="icon-btn" title="Download PDF">
                        <FiDownload className="h-4 w-4" />
                      </button>
                      <button onClick={() => onReAudit(r.id)} className="icon-btn" title="Re-Audit">
                        <FiRefreshCw className="h-4 w-4" />
                      </button>
                      <button onClick={() => onShare(r.id)} className="icon-btn" title="Copy share link">
                        <FiShare2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(r.id)}
                        className="icon-btn text-rose-600 hover:text-rose-700"
                        title="Delete"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-neutral-500">
                    No reports match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs text-neutral-500">
          Showing {filtered.length} of {MOCK_REPORTS.length} reports
        </div>
        <Link
          href="/dashboard/upload"
          className="inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm hover:bg-neutral-50"
        >
          <FiPlus className="h-4 w-4" />
          New Upload
        </Link>
      </div>

      {/* Icon Button Styles */}
      <style jsx global>{`
        .icon-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 6px;
          border-radius: 8px;
          color: #3f3f46;
          transition: background-color 0.15s ease, color 0.15s ease;
        }
        .icon-btn:hover {
          background: #f4f4f5;
        }
      `}</style>
    </div>
  );
}

// Reusable Components
function Th({ children, className }) {
  return (
    <th
      className={cls(
        'text-left font-medium tracking-tight px-4 py-3 border-b border-neutral-200',
        className
      )}
    >
      {children}
    </th>
  );
}

function Td({ children, className }) {
  return <td className={cls('px-4 py-3 align-middle', className)}>{children}</td>;
}

function ScorePill({ score }) {
  const tone =
    score >= 85
      ? 'bg-emerald-50 text-emerald-700 ring-emerald-100'
      : score >= 70
      ? 'bg-amber-50 text-amber-700 ring-amber-100'
      : 'bg-rose-50 text-rose-700 ring-rose-100';

  return (
    <span
      className={cls(
        'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1',
        tone
      )}
    >
      {typeof score === 'number' ? `${score}/100` : '—'}
    </span>
  );
}

function StatCard({ title, value, tone = 'neutral' }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4">
      <div className="text-xs text-neutral-500">{title}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}