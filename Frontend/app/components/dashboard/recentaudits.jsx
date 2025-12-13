'use client';

import React from 'react';
import { FiExternalLink, FiMoreVertical, FiArrowRight, FiEye, FiEdit, FiTrash } from 'react-icons/fi';

const audits = [
    {
        id: 1,
        project: 'E-commerce Redesign',
        url: 'shop-demo.com',
        score: 92,
        date: '2 hours ago',
        status: 'Completed',
        image: 'https://ui-avatars.com/api/?name=E+C&background=6366f1&color=fff',
        related: 'View Related Audits',
    },
    {
        id: 2,
        project: 'SaaS Landing Page',
        url: 'saas-platform.io',
        score: 78,
        date: '5 hours ago',
        status: 'In Progress',
        image: 'https://ui-avatars.com/api/?name=S+L&background=10b981&color=fff',
        related: 'View Related Audits',
    },
    {
        id: 3,
        project: 'Portfolio Site',
        url: 'alex-design.dev',
        score: 85,
        date: '1 day ago',
        status: 'Completed',
        image: 'https://ui-avatars.com/api/?name=P+S&background=f59e0b&color=fff',
        related: 'View Related Audits',
    },
    {
        id: 4,
        project: 'Blog Template',
        url: 'blog-starter.net',
        score: 64,
        date: '2 days ago',
        status: 'Needs Review',
        image: 'https://ui-avatars.com/api/?name=B+T&background=ef4444&color=fff',
        related: 'View Related Audits',
    },
];

const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-600 bg-emerald-50 ring-emerald-100';
    if (score >= 70) return 'text-indigo-600 bg-indigo-50 ring-indigo-100';
    if (score >= 50) return 'text-amber-600 bg-amber-50 ring-amber-100';
    return 'text-rose-600 bg-rose-50 ring-rose-100';
};

export default function RecentAudits() {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <div>
                    <h3 className="font-outfit font-semibold text-lg text-slate-900">Recent Audits</h3>
                    <p className="text-sm text-slate-500">Latest project performance reports</p>
                </div>
                <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors">
                    View All <FiArrowRight />
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Project</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Score</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Related</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {audits.map((audit) => (
                            <tr key={audit.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img src={audit.image} alt={audit.project} className="w-8 h-8 rounded-lg shadow-sm" />
                                        <span className="font-medium text-slate-900 text-sm">{audit.project}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold ring-1 ring-inset ${getScoreColor(audit.score)}`}>
                                        {audit.score}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500">
                                    {audit.date}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500">
                                    {audit.related}
                                </td>
                                <td className="px-6 py-4 text-right flex gap-1 justify-end">
                                    <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white hover:shadow-sm transition-all">
                                        <FiEye className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white hover:shadow-sm transition-all">
                                        <FiEdit className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white hover:shadow-sm transition-all">
                                        <FiTrash className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
