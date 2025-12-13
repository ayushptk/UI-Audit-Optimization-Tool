'use client';


import StatsCard from "../components/dashboard/statscard";
import RecentAudits from "../components/dashboard/recentaudits";
import UiScoreTrend from "../components/dashboard/uiscoretrend";
import CategoryBreakdown from "../components/dashboard/categorybreakdown";
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
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 15 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 50, damping: 20 }
    }
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
            className="min-h-screen bg-white p-6 sm:p-8 space-y-10 max-w-[1600px] mx-auto"
        >
            {/* Header Section */}
            <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-slate-100">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold font-outfit text-slate-900 tracking-tight">Overview</h2>
                    <p className="text-slate-500 text-base font-medium">Welcome back, {displayName}. Here's your audit performance.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:translate-y-0.5">
                        <FiDownload className="w-4 h-4" />
                        Export
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-slate-200 hover:shadow-xl active:translate-y-0.5">
                        <FiPlus className="w-4 h-4" />
                        New Audit
                    </button>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.section variants={item}>
                <StatsCard />
            </motion.section>

            {/* Charts Section */}
            <motion.section variants={item} className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                    <UiScoreTrend />
                </div>
                <div className="xl:col-span-1">
                    <CategoryBreakdown />
                </div>
            </motion.section>
            {/* Recent Table */}
            <motion.section variants={item}>
                <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
                    <RecentAudits />
                </div>
            </motion.section>
        </motion.div>
    );
}
