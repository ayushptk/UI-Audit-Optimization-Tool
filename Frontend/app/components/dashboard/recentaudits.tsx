'use client';

import React from 'react';
import { FiExternalLink, FiMoreVertical, FiArrowRight, FiEye, FiEdit, FiTrash } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { deleteAudit } from '../../lib/api';

export default function RecentAudits({ audits = [] }) {
    const router = useRouter();
    const { token } = useSelector((state: any) => state.auth);

    const handleView = (id) => {
        router.push(`/dashboard/reports/${id}`);
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this audit report?")) return;

        try {
            await deleteAudit(id, token);
            // Reload to refresh stats and list
            window.location.reload();
        } catch (error) {
            alert("Error deleting audit");
        }
    };

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

                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {audits.map((audit) => (
                            <tr key={audit.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${audit.design_name ? audit.design_name.substring(0, 2) : 'UI'}&background=random&color=fff`}
                                            alt={audit.design_name}
                                            className="w-8 h-8 rounded-lg shadow-sm"
                                        />
                                        <span className="font-medium text-slate-900 text-sm">{audit.design_name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold ring-1 ring-inset ${audit.overall_score >= 90 ? 'text-emerald-600 bg-emerald-50 ring-emerald-100' :
                                        audit.overall_score >= 70 ? 'text-indigo-600 bg-indigo-50 ring-indigo-100' :
                                            audit.overall_score >= 50 ? 'text-amber-600 bg-amber-50 ring-amber-100' :
                                                'text-rose-600 bg-rose-50 ring-rose-100'
                                        }`}>
                                        {audit.overall_score}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500">
                                    {new Date(audit.date).toLocaleDateString()}
                                </td>

                                <td className="px-6 py-4 text-right flex gap-1 justify-end">


                                    <button
                                        onClick={() => handleView(audit.id)}
                                        className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white hover:shadow-sm transition-all"
                                        title="View"
                                    >
                                        <FiEye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(audit.id)}
                                        className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white hover:shadow-sm transition-all"
                                        title="Delete"
                                    >
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

