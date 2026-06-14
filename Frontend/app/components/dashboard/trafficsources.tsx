'use client';

import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { FiMoreHorizontal } from 'react-icons/fi';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TrafficSources() {
    const data = {
        labels: ['Direct', 'Social Media', 'Organic Search', 'Referral'],
        datasets: [
            {
                data: [35, 25, 20, 20],
                backgroundColor: [
                    '#6366f1', // Indigo 500
                    '#8b5cf6', // Violet 500
                    '#ec4899', // Pink 500
                    '#10b981', // Emerald 500
                ],
                borderWidth: 0,
                hoverOffset: 4,
            },
        ],
    };

    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 20,
                    font: { family: "'Inter', sans-serif", size: 12 },
                    color: '#64748b',
                },
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#0f172a',
                bodyColor: '#334155',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                padding: 12,
                bodyFont: { family: "'Inter', sans-serif", size: 13 },
                callbacks: {
                    label: function (context) {
                        return `${context.label}: ${context.parsed}%`;
                    },
                },
            },
        },
        cutout: '75%',
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-outfit font-semibold text-lg text-slate-900">Traffic Sources</h3>
                <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
                    <FiMoreHorizontal className="w-5 h-5" />
                </button>
            </div>
            <div className="flex-1 relative min-h-[250px] flex items-center justify-center">
                <Doughnut data={data} options={options} />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center mt-[-20px]">
                        <p className="text-3xl font-bold text-slate-900 font-outfit">100%</p>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Traffic</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
