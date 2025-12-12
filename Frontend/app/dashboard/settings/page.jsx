'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CreditCard,
    Check,
    Download,
    AlertTriangle,
    Calendar,
    Zap,
    FileText,
    Plus,
    Shield,
    ChevronRight,
    Star
} from 'lucide-react';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('subscription');

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your account, billing, and preferences.</p>
            </header>

            <div className="flex flex-col lg:flex-row gap-8">
               
                {/* Main Content Area */}
                <div className="flex-1 min-w-0">
                    <AnimatePresence mode="wait">
                        {activeTab === 'subscription' ? (
                            <SubscriptionContent />
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm min-h-[400px] flex items-center justify-center text-gray-400"
                            >
                                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} settings are coming soon.
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function SubscriptionContent() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
        >
            {/* Current Plan Overview */}
            <section className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Zap className="w-64 h-64" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Current Plan</span>
                            <span className="text-sm text-gray-500">Renews on Oct 24, 2025</span>
                        </div>
                        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">Pro Plan</h2>
                        <p className="text-gray-500 max-w-md">Everything you need to grow your business. Ultra-fast performance and priority support.</p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <div className="text-right">
                            <span className="text-3xl font-bold text-gray-900 dark:text-white">$29</span>
                            <span className="text-gray-500">/month</span>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">Switch to Annual (Save 20%)</button>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <span>Monthly Usage</span>
                        <span>8,500 / 10,000 API Calls</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full w-[85%]" />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">You have used 85% of your included usage.</p>
                </div>
            </section>

            {/* Change Subscription Plan */}
            <section>
                <div className="flex justify-between items-end mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Available Plans</h3>
                    <span className="text-sm text-blue-600 cursor-pointer hover:underline">Compare all features</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['Starter', 'Pro', 'Enterprise'].map((plan, idx) => (
                        <div
                            key={plan}
                            className={`relative p-6 rounded-2xl border transition-all duration-300 ${plan === 'Pro'
                                    ? 'border-blue-500 ring-4 ring-blue-500/10 bg-white dark:bg-gray-900 shadow-xl'
                                    : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-blue-200'
                                }`}
                        >
                            {plan === 'Pro' && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                    MOST POPULAR
                                </div>
                            )}
                            <div className="mb-4">
                                <h4 className="text-lg font-bold text-gray-900 dark:text-white">{plan}</h4>
                                <p className="text-sm text-gray-500 mt-1">
                                    {plan === 'Starter' && 'For individuals'}
                                    {plan === 'Pro' && 'For growing teams'}
                                    {plan === 'Enterprise' && 'For large organizations'}
                                </p>
                            </div>
                            <div className="mb-6">
                                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {plan === 'Starter' && '$0'}
                                    {plan === 'Pro' && '$29'}
                                    {plan === 'Enterprise' && '$99'}
                                </span>
                                <span className="text-gray-500 text-sm">/mo</span>
                            </div>

                            <button className={`w-full py-2.5 rounded-xl font-medium text-sm transition-colors ${plan === 'Pro'
                                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30'
                                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700'
                                }`}>
                                {plan === 'Pro' ? 'Current Plan' : plan === 'Starter' ? 'Downgrade' : 'Upgrade'}
                            </button>

                            <ul className="mt-6 space-y-3">
                                {[1, 2, 3].map(i => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                        <Check className={`w-4 h-4 ${plan === 'Pro' ? 'text-blue-500' : 'text-gray-400'}`} />
                                        Feature description here
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Billing Information */}
                <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Payment Method</h3>

                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl mb-4 bg-gray-50 dark:bg-gray-800/50">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center">
                                <span className="font-bold text-xs italic text-blue-800">VISA</span>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">•••• •••• •••• 4242</p>
                                <p className="text-xs text-gray-500">Expires 12/28</p>
                            </div>
                        </div>
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">Default</span>
                    </div>

                    <button className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
                        <Plus className="w-4 h-4" />
                        Add new payment method
                    </button>

                    <div className="mt-8">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Billing Address</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            Alice Johnson<br />
                            123 Innovation Dr.<br />
                            Tech City, TC 94000<br />
                            United States
                        </p>
                        <button className="mt-2 text-sm text-gray-500 hover:text-gray-900 underline">Edit address</button>
                    </div>
                </section>

                {/* Billing History */}
                <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Invoice History</h3>
                        <button className="text-sm text-blue-600 hover:underline">View All</button>
                    </div>

                    <div className="space-y-4">
                        {[
                            { date: 'Oct 01, 2023', amount: '$29.00', status: 'Paid', invoice: '#INV-001' },
                            { date: 'Sep 01, 2023', amount: '$29.00', status: 'Paid', invoice: '#INV-002' },
                            { date: 'Aug 01, 2023', amount: '$29.00', status: 'Paid', invoice: '#INV-003' },
                        ].map((inv, i) => (
                            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                                <div className="flex items-center gap-4">
                                    <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                                        <FileText className="w-5 h-5 text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Invoice {inv.invoice}</p>
                                        <p className="text-xs text-gray-500">{inv.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{inv.amount}</span>
                                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1">
                                        <Download className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Cancel Subscription */}
            <section className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex gap-4">
                        <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full h-fit">
                            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-red-900 dark:text-red-300">Cancel Subscription</h3>
                            <p className="text-red-700 dark:text-red-400/80 text-sm mt-1 max-w-xl">
                                By canceling your subscription, you will lose access to all premium features at the end of your billing period. This action cannot be undone.
                            </p>
                        </div>
                    </div>
                    <button className="px-6 py-2.5 bg-white border border-red-200 text-red-600 font-medium rounded-xl hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm text-sm whitespace-nowrap">
                        Cancel Plan
                    </button>
                </div>
            </section>
        </motion.div>
    );
}
