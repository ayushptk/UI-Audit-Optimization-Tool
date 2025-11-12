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
  const profit  = [ 150, 500, 250, 400,  280, 800, 450, 400, 550, 350, 220, 500];

  const data = {
    labels,
    datasets: [
      {
        label: 'Revenue',
        data: revenue,
        borderColor: '#42e421ff',
        backgroundColor: 'transparent',
        fill: false,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
        borderDash: [8, 5],
      },
      {
        label: 'Profit',
        data: profit,
        borderColor: '#9333EA',
        backgroundColor: 'transparent',
        fill:false,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12 },
        },
      },
      title: {
        display: true,
        text: 'Revenue Analytics with Sales & Profit (USD)',
        align: 'start',
        font: { size: 16, weight: 'bold' },
        color: '#1F2937',
        padding: { top: 10, bottom: 30 },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
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
        ticks: { color: '#6B7280' },
      },
      y: {
        beginAtZero: true,
        max: 1000,
        ticks: {
          callback: function (value) {
            return `$${value}`;
          },
          stepSize: 200,
          color: '#6B7280',
        },
        grid: {
          display: true,                 // keep grid visible
  color: '#ecececff',              // light gray color
  lineWidth: 0.5,
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 ">
      <div className="h-96">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}