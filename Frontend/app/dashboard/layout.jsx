'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FiHome, FiUpload, FiBarChart2, FiUsers, FiSettings, FiLogOut, FiBell, FiSearch, FiMenu, FiX } from 'react-icons/fi';
import { Outfit, Inter } from 'next/font/google';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-outfit',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
});

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome },
    { name: 'Upload Design', href: '/dashboard/upload', icon: FiUpload },
    { name: 'Reports', href: '/dashboard/reports', icon: FiBarChart2 },
    { name: 'Team', href: '/dashboard/team', icon: FiUsers },
    { name: 'Settings', href: '/dashboard/settings', icon: FiSettings },
  ];

  const getPageName = (path) => {
    if (path === '/dashboard') return 'Dashboard';
    if (path.startsWith('/dashboard/upload')) return 'Upload Design';
    if (path.startsWith('/dashboard/reports')) return 'Reports';
    if (path.startsWith('/dashboard/team')) return 'Team';
    if (path.startsWith('/dashboard/settings')) return 'Settings';
    return 'Dashboard';
  };

  return (
    <div className={`${inter.variable} ${outfit.variable} flex h-screen bg-slate-50/50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700`}>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 transform transition-transform duration-300 ease-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          }`}
      >
        {/* Logo */}
        <div className="h-24 flex items-center px-8">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 transition-transform group-hover:scale-105 duration-300">
              <Image src="/Logo/dashboardlogo3.png" alt="UI Audit Logo" fill className="object-contain" />
            </div>
            <span className="font-outfit font-bold text-2xl text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">UI Audit</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden ml-auto p-2 text-slate-400 hover:text-slate-600"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 space-y-1.5 mt-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group relative flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-300 font-medium text-[0.95rem] ${isActive
                  ? 'text-indigo-600 bg-indigo-50/80 shadow-sm shadow-indigo-100'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-indigo-50/80 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{ zIndex: -1 }}
                  />
                )}
                <Icon className={`w-5 h-5 transition-colors duration-300 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-100/80 bg-gradient-to-t from-white to-transparent">
          <Link
            href="/logout"
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 font-medium text-sm group"
          >
            <FiLogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#FAFAFA]">
        {/* Header */}
        <header className={`h-20 sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between transition-all duration-300 ${scrolled || true ? 'bg-white/70 backdrop-blur-xl border-b border-slate-200/60 supports-[backdrop-filter]:bg-white/60' : 'bg-transparent'
          }`}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <FiMenu className="w-6 h-6" />
            </button>

            <div className="flex flex-col">
              <h1 className="font-outfit font-bold text-xl text-slate-900 tracking-tight">{getPageName(pathname)}</h1>
              <span className="text-xs text-slate-500 font-medium hidden sm:block">Overview & Analytics</span>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            {/* Search */}
            <div className="hidden md:flex relative w-64 lg:w-96 group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors w-4 h-4" />
              <input
                type="text"
                placeholder="Search projects, reports..."
                className="w-full pl-11 pr-4 py-2.5 bg-slate-100/50 border border-transparent hover:bg-white hover:border-slate-200 focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-500/10 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400 transition-all duration-200 outline-none"
              />
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="relative p-2.5 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 rounded-full transition-all duration-200">
                <FiBell className="w-5 h-5" />
                <span className="absolute top-2.5 right-3 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
              </button>

              {/* Profile */}
              <div className="flex items-center gap-3 pl-3 lg:pl-6 lg:border-l border-slate-200/60">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-semibold text-slate-900 leading-none">Alex Morgan</p>
                  <p className="text-xs text-slate-500 mt-1">Admin Workspace</p>
                </div>
                <button className="relative group">
                  <div className="absolute inset-0 bg-indigo-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <Image
                    src="/images/manxa.png"
                    alt="Profile"
                    width={40}
                    height={40}
                    className="relative w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm transition-transform group-hover:scale-105"
                  />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Scroll Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}