'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FiHome, FiUpload, FiBarChart2, FiUsers, FiSettings, FiLogOut, FiBell, FiSearch, FiMenu, FiX, FiHelpCircle } from 'react-icons/fi';
import { Outfit, Inter } from 'next/font/google';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdDashboardCustomize } from "react-icons/md";
import { TbWorldUpload } from "react-icons/tb";
import { TbReportSearch } from "react-icons/tb";
import { BsMicrosoftTeams } from "react-icons/bs";
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserProfile } from '../lib/auth';
import { setUser, setCredentials } from '../redux/authSlice';
import NotificationDropdown from '../components/dashboard/notificationdropdown';

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
  const [showNotifications, setShowNotifications] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  // Restore token from localStorage if missing in Redux
  useEffect(() => {
    if (!token && typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('access_token');
      if (storedToken) {
        // We can temporarily set a dummy user or just the token to trigger the next effect
        dispatch(setCredentials({ token: storedToken, user: null }));
      }
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (token) {
      if (!user) {
        fetchUserProfile(token)
          .then(userData => {
            const userWithCorrectName = { ...userData, name: userData.username || userData.name };
            dispatch(setUser(userWithCorrectName));
          })
          .catch(err => {
            console.error("Failed to fetch user:", err);
            // If token is invalid, maybe clear it?
          });
      }
    }
  }, [token, user, dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: MdDashboardCustomize },
    { name: 'Upload Design', href: '/dashboard/upload', icon: TbWorldUpload },
    { name: 'Reports', href: '/dashboard/reports', icon: TbReportSearch },
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
    <div className={`${inter.variable} ${outfit.variable} flex h-screen bg-white font-sans text-slate-900 selection:bg-indigo-500/30 selection:text-indigo-900`}>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-65 bg-white border-r border-slate-100 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.02)] transform transition-transform duration-300 ease-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-24 flex items-center px-8 border-b border-slate-50/50">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 flex items-center justify-center  bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform duration-300">
                <Image src="/Logo/Uisearchicon.png" alt="UI Audit Logo" fill className="object-contain p-1.5 invert brightness-0" />
              </div>
              <span className="font-outfit font-bold text-2xl text-slate-900 tracking-tight">UI Audit</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden ml-auto p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
            <div className="mb-2 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Menu</div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className="block relative group"
                >
                  <div className={`relative flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-300 ${isActive
                    ? 'text-white shadow-lg shadow-indigo-500/20'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-indigo-600 rounded-xl"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <Icon className={`relative z-10 w-5 h-5 transition-transform duration-300 ${isActive ? 'text-white' : 'group-hover:scale-110'}`} />
                    <span className={`relative z-10 font-medium text-[0.95rem] ${isActive ? 'text-white' : ''}`}>{item.name}</span>

                    {!isActive && (
                      <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}
                  </div>
                </Link>
              );
            })}

            <div className="mt-8 mb-2 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Support</div>
            <Link
              href="/dashboard/help"
              className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all duration-300 group"
            >
              <FiHelpCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-medium text-[0.95rem]">Help Center</span>
            </Link>
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-slate-100">
            <div className="bg-slate-50 rounded-2xl p-4 mb-2 border border-slate-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <FiUsers className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Free Trail</p>
                  <p className="text-xs text-slate-500">Active until 7 days</p>
                </div>
              </div>
            </div>
            <Link
              href="/logout"
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 font-medium text-sm group"
            >
              <FiLogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span>Sign Out</span>
            </Link>
          </div>
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
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className={`h-20 sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm' : 'bg-transparent'
          }`}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <FiMenu className="w-6 h-6" />
            </button>

            <div className="flex flex-col">
              <h1 className="font-outfit font-bold text-2xl text-slate-900 tracking-tight">{getPageName(pathname)}</h1>
              <span className="text-sm text-slate-500 font-medium hidden sm:block">Overview & Analytics</span>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            {/* Search */}
            <div className="hidden md:flex relative w-64 lg:w-96 group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400 transition-all duration-200 outline-none shadow-sm"
              />
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2.5 text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-md rounded-full transition-all duration-200"
                >
                  <FiBell className="w-5 h-5" />
                  <span className="absolute top-2.5 right-3 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
                </button>
                <NotificationDropdown
                  isOpen={showNotifications}
                  onClose={() => setShowNotifications(false)}
                />
              </div>

              {/* Profile */}
              <div className="flex items-center gap-3 pl-3 lg:pl-6 lg:border-l border-slate-200">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-semibold text-slate-900 leading-none">{user?.name || user?.username || "Guest User"}</p>
                  <p className="text-xs text-slate-500 mt-1">{user?.email || "User"}</p>
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
        <main className="flex-1 overflow-y-auto p-4 lg:p-4 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}