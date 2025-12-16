'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiInfo } from 'react-icons/fi';

export default function NotificationDropdown({ isOpen, onClose }) {
    // Mock notifications - currently empty as per requirement to show empty state
    // You can populate this array to test non-empty state
    const notifications = [];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop to close on click outside */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 ring-1 ring-black/5 z-50 overflow-hidden"
                    >
                        <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-semibold text-slate-900 font-outfit">Notifications</h3>
                            <span className="text-xs font-medium text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                                {notifications.length} New
                            </span>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length > 0 ? (
                                <div className="divide-y divide-slate-50">
                                    {notifications.map((notification) => (
                                        <div key={notification.id} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                                            <div className="flex gap-3">
                                                <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${notification.type === 'alert' ? 'bg-rose-100 text-rose-600' :
                                                        notification.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                                                            'bg-blue-100 text-blue-600'
                                                    }`}>
                                                    <FiBell className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">{notification.title}</p>
                                                    <p className="text-xs text-slate-500 mt-1">{notification.description}</p>
                                                    <p className="text-[10px] text-slate-400 mt-2">{notification.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-3">
                                        <FiBell className="w-6 h-6" />
                                    </div>
                                    <p className="text-slate-900 font-medium">You have no notifications yet</p>
                                    <p className="text-sm text-slate-500 mt-1">When you get notifications, they'll show up here.</p>
                                </div>
                            )}
                        </div>

                        <div className="p-3 border-t border-slate-50 bg-slate-50/50 text-center">
                            <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                                Mark all as read
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
