'use client';

import { motion } from "framer-motion";
import { useState, useMemo } from "react";

// Updated categories based on "Visual Design, Typography, Color & Contrast, Accessibility"
const data = [
    { name: "Visual Design", value: 35, color: "#818cf8" },    // Soft Indigo
    { name: "Typography", value: 25, color: "#f472b6" },       // Soft Pink
    { name: "Color & Contrast", value: 20, color: "#34d399" }, // Soft Mint
    { name: "Accessibility", value: 20, color: "#fbbf24" },    // Soft Amber
];

// Calculate total value for percentage calculation
const totalValue = data.reduce((acc, cur) => acc + cur.value, 0);

export default function CategoryBreakdown() {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    // Chart Dimensions
    const size = 200; // Slightly reduced for better fit in column
    const strokeWidth = 20;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;

    // Calculate segments
    let accumulatedAngle = 0;

    const segments = useMemo(() => {
        return data.map((item, index) => {
            const percentage = item.value / totalValue;
            const filledLength = (percentage * circumference) - 8; // Small gap
            const emptyLength = circumference - filledLength;
            const rotation = accumulatedAngle;

            accumulatedAngle += percentage * 360;

            return {
                ...item,
                percentage,
                filledLength,
                emptyLength,
                rotation,
            };
        });
    }, [circumference]); // Added dependency

    return (
        <div className="w-full h-full bg-white rounded-2xl p-2 shadow-[0_2px_20px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col relative overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 font-outfit">Category Breakdown</h3>
                    <p className="text-sm text-slate-500 font-medium mt-1">Issues distribution by type</p>
                </div>
            </div>

            {/* Content Container - Vertical Stack */}
            <div className="flex-1 flex flex-col items-center justify-between gap-8">

                {/* Donut Chart */}
                <div className="relative flex items-center justify-center shrink-0">
                    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg] overflow-visible">
                        {segments.map((segment, index) => (
                            <motion.circle
                                key={index}
                                cx={center}
                                cy={center}
                                r={radius}
                                fill="transparent"
                                stroke={segment.color}
                                strokeWidth={strokeWidth}
                                strokeLinecap="round"
                                strokeDasharray={`${segment.filledLength} ${segment.emptyLength}`}
                                strokeDashoffset={0}
                                transform={`rotate(${segment.rotation} ${center} ${center})`}
                                initial={{ opacity: 0, strokeDasharray: `0 ${circumference}` }}
                                animate={{
                                    opacity: hoveredIndex !== null && hoveredIndex !== index ? 0.3 : 1,
                                    strokeDasharray: `${segment.filledLength} ${segment.emptyLength}`
                                }}
                                transition={{
                                    duration: 1.2,
                                    delay: 0.2 + index * 0.1,
                                    ease: "circOut"
                                }}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                className="transition-all duration-300 cursor-pointer hover:brightness-110"
                            />
                        ))}
                    </svg>

                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-4xl font-bold text-slate-900 font-outfit">
                            {hoveredIndex !== null ? data[hoveredIndex].value : totalValue}
                        </span>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
                            {hoveredIndex !== null ? "Issues" : "Total"}
                        </span>
                    </div>
                </div>

                {/* Custom Legend - Below Chart */}
                <div className="w-full grid grid-cols-1 sm:grid-cols-2  pb-2">
                    {segments.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                            className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 cursor-default border border-transparent ${hoveredIndex === index
                                    ? 'bg-slate-50 border-slate-100 shadow-sm'
                                    : 'hover:bg-slate-50/50'
                                }`}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-2.5 h-2.5 rounded-full ring-4 ring-opacity-20"
                                    style={{
                                        backgroundColor: item.color,
                                        boxShadow: `0 0 0 2px ${item.color}20`
                                    }}
                                />
                                <span className={`text-sm font-medium transition-colors ${hoveredIndex === index ? 'text-slate-900' : 'text-slate-600'
                                    }`}>
                                    {item.name}
                                </span>
                            </div>
                            <span className="text-sm font-bold text-slate-900 font-outfit">
                                {Math.round(item.percentage * 100)}%
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
