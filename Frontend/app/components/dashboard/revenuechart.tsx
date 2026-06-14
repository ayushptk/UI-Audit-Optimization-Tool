'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { FiMoreHorizontal } from 'react-icons/fi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function RevenueAnalyticsChart() {
  const labels = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const revenue = [180, 600, 320, 180, 240, 420, 820, 680, 580, 230, 380, 330];
  const profit = [150, 500, 250, 400, 280, 800, 450, 400, 550, 350, 220, 500];

  const data = {
    labels,
    datasets: [
      {
        label: 'Revenue',
        data: revenue,
        borderColor: '#6366f1', // Indigo 500
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(99, 102, 241, 0.2)');
          gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#6366f1',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
        borderWidth: 2,
      },
      {
        label: 'Profit',
        data: profit,
        borderColor: '#10b981', // Emerald 500
        backgroundColor: 'transparent',
        fill: false,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#10b981',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
        borderWidth: 2,
        borderDash: [5, 5],
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: { family: "'Inter', sans-serif", size: 12 },
          color: '#64748b', // Slate 500
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#0f172a', // Slate 900
        bodyColor: '#334155', // Slate 700
        borderColor: '#e2e8f0', // Slate 200
        borderWidth: 1,
        padding: 12,
        titleFont: { family: "'Outfit', sans-serif", size: 14, weight: 'bold' },
        bodyFont: { family: "'Inter', sans-serif", size: 13 },
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: $${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: '#94a3b8', // Slate 400
          font: { family: "'Inter', sans-serif", size: 11 }
        },
      },
      y: {
        beginAtZero: true,
        max: 1000,
        ticks: {
          callback: function (value) {
            return `$${value}`;
          },
          stepSize: 200,
          color: '#94a3b8', // Slate 400
          font: { family: "'Inter', sans-serif", size: 11 }
        },
        grid: {
          display: true,
          color: '#f1f5f9', // Slate 100
          drawBorder: false,
        },
        border: { display: false },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-outfit font-semibold text-lg text-slate-900">Revenue Analytics</h3>
          <p className="text-sm text-slate-500">Revenue vs Profit over the last year</p>
        </div>
        <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
          <FiMoreHorizontal className="w-5 h-5" />
        </button>
      </div>
      <div className="h-80">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}