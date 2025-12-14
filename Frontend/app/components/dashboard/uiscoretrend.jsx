'use client';

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function UiScoreTrend({ data: inputData }) {
    const data = useMemo(() => {
        // 1. Create array of last 7 days (YYYY-MM-DD)
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            last7Days.push(d.toISOString().split('T')[0]);
        }

        // 2. Create lookup for input data
        const dataMap = {};
        if (inputData && Array.isArray(inputData)) {
            inputData.forEach(item => {
                // Ensure date matches YYYY-MM-DD
                if (item.date) {
                    dataMap[item.date] = item.score;
                }
            });
        }

        // 3. Map to final format
        return last7Days.map(dateStr => {
            const dateObj = new Date(dateStr);
            return {
                date: dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
                score: dataMap[dateStr] || 0,
                fullDate: dateStr
            };
        });
    }, [inputData]);

    const [hovered, setHovered] = useState(null);

    // Dimensions
    const width = 600;
    const height = 280;
    const paddingX = 40;
    const paddingY = 40;

    // Scales
    const maxY = 100;
    const getX = (i) => paddingX + (i * (width - 2 * paddingX)) / (data.length - 1);
    const getY = (score) => height - paddingY - (score / maxY) * (height - 2 * paddingY);

    // Generate SVG Path
    const svgPath = useMemo(() => {
        if (data.length === 0) return "";
        let path = `M ${getX(0)} ${getY(data[0].score)}`;

        for (let i = 0; i < data.length - 1; i++) {
            const x0 = getX(i);
            const y0 = getY(data[i].score);
            const x1 = getX(i + 1);
            const y1 = getY(data[i + 1].score);

            // Control points for smooth curve
            const cp1x = x0 + (x1 - x0) / 2;
            const cp1y = y0;
            const cp2x = x1 - (x1 - x0) / 2;
            const cp2y = y1;

            path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x1} ${y1}`;
        }
        return path;
    }, []);

    // Gradient area fill (optional, but requested "line chart" usually implies just line or area. User said "single smooth curved line". I'll stick to line for clarity, or add a very subtle fade below.)
    // User asked for "single smooth curved line with a soft gradient stroke".

    return (
        <div className="w-full h-full bg-white rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col relative overflow-hidden group">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 font-outfit">UI Score Trend</h3>
                    <p className="text-sm text-slate-500 font-medium">Performance over last 7 days</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold flex items-center gap-1">
                    +12.4% <span className="text-green-600/60 font-medium">vs last week</span>
                </div>
            </div>

            <div className="flex-1 relative w-full aspect-[2/1] sm:aspect-auto sm:min-h-[300px]">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                    <defs>
                        <linearGradient id="score-gradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#3b82f6" /> {/* Blue */}
                            <stop offset="50%" stopColor="#6366f1" /> {/* Indigo */}
                            <stop offset="100%" stopColor="#8b5cf6" /> {/* Violet */}
                        </linearGradient>
                        <linearGradient id="grid-gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.1" />
                        </linearGradient>
                    </defs>

                    {/* Grid Lines */}
                    {[20, 40, 60, 80, 100].map((val) => (
                        <g key={val}>
                            {/* Dotted or light lines */}
                            <line
                                x1={paddingX}
                                y1={getY(val)}
                                x2={width - paddingX}
                                y2={getY(val)}
                                stroke="#f1f5f9"
                                strokeWidth="1"
                                strokeDasharray="4 4"
                            />
                            <text x={paddingX - 12} y={getY(val) + 4} textAnchor="end" className="text-[10px] fill-slate-400 font-medium">{val}</text>
                        </g>
                    ))}

                    {/* The Line */}
                    <motion.path
                        d={svgPath}
                        fill="none"
                        stroke="url(#score-gradient)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                    />

                    {/* Data Points */}
                    {data.map((d, i) => (
                        <motion.g
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.5 + i * 0.1, type: "spring", stiffness: 200 }}
                        >
                            {/* Invisible hit area for easier hovering */}
                            <circle cx={getX(i)} cy={getY(d.score)} r={20} fill="transparent"
                                onMouseEnter={() => setHovered({ x: getX(i), y: getY(d.score), ...d })}
                                onMouseLeave={() => setHovered(null)}
                                className="cursor-pointer"
                            />

                            {/* Visual Dot */}
                            <motion.circle
                                cx={getX(i)}
                                cy={getY(d.score)}
                                r={5}
                                fill="white"
                                stroke="url(#score-gradient)"
                                strokeWidth="2.5"
                                className="pointer-events-none"
                                animate={{
                                    scale: hovered && hovered.date === d.date ? 1.5 : 1,
                                    strokeWidth: hovered && hovered.date === d.date ? 3.5 : 2.5
                                }}
                            />
                        </motion.g>
                    ))}

                    {/* X Axis Labels */}
                    {data.map((d, i) => (
                        <text
                            key={i}
                            x={getX(i)}
                            y={height - 10}
                            textAnchor="middle"
                            className="text-[11px] fill-slate-400 font-medium"
                        >
                            {d.date}
                        </text>
                    ))}
                </svg>

                {/* Tooltip */}
                <AnimatePresence>
                    {hovered && (
                        <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                            className="absolute z-20 bg-slate-800 text-white rounded-lg py-2 px-3 shadow-xl backdrop-blur-sm pointer-events-none"
                            style={{
                                left: `${(hovered.x / width) * 100}%`,
                                top: `${(hovered.y / height) * 100}%`,
                                transform: 'translate(-50%, -130%)'
                            }}
                        >
                            <div className="text-xs text-slate-300 mb-0.5">{hovered.date}</div>
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-bold">{hovered.score}</span>
                                <span className="text-xs font-semibold text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded">{hovered.change}</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
