'use client';

import { motion } from "framer-motion";
import { useState, useMemo } from "react";

// Default/Empty data
const defaultData = [
    { name: "Visual Design", value: 0, color: "#818cf8" },
    { name: "Typography", value: 0, color: "#f472b6" },
    { name: "Color & Contrast", value: 0, color: "#34d399" },
    { name: "Accessibility", value: 0, color: "#fbbf24" },
];

export default function CategoryBreakdown({ breakdown }) {
    const data = useMemo(() => {
        if (!breakdown || Object.keys(breakdown).length === 0) return defaultData;

        // Map backend keys to our category names
        // Backend keys: "typography", "spacing", "color", "layout", "visual_hierarchy", "accessibility", "usability"
        const mapped = [
            { name: "Visual Design", value: breakdown.visual_hierarchy || 0, color: "#818cf8" },
            { name: "Typography", value: breakdown.typography || 0, color: "#f472b6" },
            { name: "Color & Contrast", value: breakdown.color || 0, color: "#34d399" },
            { name: "Accessibility", value: breakdown.accessibility || 0, color: "#fbbf24" },
            { name: "Layout", value: breakdown.layout || 0, color: "#60a5fa" }
        ].filter(d => d.value > 0);

        return mapped.length > 0 ? mapped : defaultData;
    }, [breakdown]);

    const totalValue = useMemo(() => data.reduce((acc, cur) => acc + cur.value, 0) || 0, [data]);

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
    }, [data, totalValue, circumference]);

    return (
        <div className="w-full h-full bg-white rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col relative overflow-hidden">

            {/* Content Container - Vertical Stack */}
            <div className="flex-1 flex flex-col items-center justify-between gap-8 mt-4">

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
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 pb-2">
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