'use client';

import RevenueAnalyticsChart from "../components/dashboard/revenuechart";
import StatsCard from "../components/dashboard/statscard";
import TrafficSources from "../components/dashboard/trafficsources";
import RecentAudits from "../components/dashboard/recentaudits";
import { motion } from "framer-motion";
import { FiDownload, FiPlus } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchUserProfile } from "../lib/auth";
import { setUser } from "../redux/authSlice";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function DashboardPage() {
    const dispatch = useDispatch();
    const { user, token } = useSelector((state) => state.auth);

    useEffect(() => {
        if (token && !user) {
            fetchUserProfile(token).then((userData) => {
                dispatch(setUser(userData));
            }).catch((error) => {
                console.error("Failed to fetch user profile:", error);
            });
        }
    }, [token, user, dispatch]);

    const displayName = user ? (user.username || user.name).charAt(0).toUpperCase() + (user.username || user.name).slice(1) : 'User';

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
        >
            {/* Welcome Section */}
            <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-200/60">
                <div>
                    <h2 className="text-3xl font-bold font-outfit text-slate-900 tracking-tight">Welcome back, {displayName}! 👋</h2>
                    <p className="text-slate-500 mt-2 text-base font-medium">Here's what's happening with your projects today.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm hover:shadow active:scale-95">
                        <FiDownload className="w-4 h-4" />
                        Download Report
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 active:scale-95">
                        <FiPlus className="w-4 h-4" />
                        New Project
                    </button>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.section variants={item}>
                <StatsCard />
            </motion.section>

            {/* Charts Section */}
            <motion.section variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-2xl p-1 shadow-sm border border-slate-100">
                        <RevenueAnalyticsChart />
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 h-full">
                        <TrafficSources />
                    </div>
                </div>
            </motion.section>

            {/* Recent Audits & Projects */}
            <motion.section variants={item}>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <RecentAudits />
                </div>
            </motion.section>
        </motion.div>
    );
}
