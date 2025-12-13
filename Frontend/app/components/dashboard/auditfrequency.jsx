'use client';

import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { FiMoreHorizontal, FiActivity } from 'react-icons/fi';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function AuditFrequencyChart() {
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    const dataPoints = [8, 12, 20, 15, 22, 18, 25];

    const data = {
        labels,
        datasets: [
            {
                label: 'Audits',
                data: dataPoints,
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, '#6366f1'); // Indigo 500
                    gradient.addColorStop(1, '#a5b4fc'); // Indigo 300
                    return gradient;
                },
                hoverBackgroundColor: '#4f46e5',
                borderRadius: 6,
                borderSkipped: false,
                barThickness: 32,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1e293b',
                titleColor: '#f8fafc',
                bodyColor: '#e2e8f0',
                padding: 12,
                cornerRadius: 8,
                displayColors: false,
                titleFont: { family: "'Outfit', sans-serif", size: 13 },
                bodyFont: { family: "'Inter', sans-serif", size: 12 },
                callbacks: {
                    title: (items) => `${items[0].label}`,
                    label: (item) => `Audits: ${item.formattedValue}`
                }
            },
        },
        scales: {
            x: {
                grid: { display: false, drawBorder: false },
                ticks: {
                    color: '#94a3b8',
                    font: { family: "'Inter', sans-serif", size: 12 }
                },
                border: { display: false },
            },
            y: {
                beginAtZero: true,
                grid: {
                    display: true,
                    color: '#f1f5f9',
                    borderDash: [5, 5],
                    drawBorder: false,
                },
                ticks: {
                    stepSize: 5,
                    color: '#94a3b8',
                    font: { family: "'Inter', sans-serif", size: 11 },
                    padding: 10,
                },
                border: { display: false },
            },
        },
    };

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-full flex flex-col group hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-outfit font-semibold text-lg text-slate-900 flex items-center gap-2">
                        <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                            <FiActivity className="w-5 h-5" />
                        </div>
                        Audit Frequency
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 pl-1">Weekly audit activity</p>
                </div>
                <button className="p-2 text-slate-400 hover:text-indigo-600 rounded-xl hover:bg-slate-50 transition-colors">
                    <FiMoreHorizontal className="w-5 h-5" />
                </button>
            </div>
            <div className="flex-1 min-h-[240px] w-full">
                <Bar data={data} options={options} />
            </div>
        </div>
    );
}
