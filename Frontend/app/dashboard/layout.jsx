'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FiHome, FiUpload, FiBarChart2, FiUsers, FiSettings, FiLogOut, FiBell, FiUser, FiSearch } from 'react-icons/fi';
import { Lobster } from 'next/font/google';
import { Lato } from 'next/font/google';

const lobster = Lobster({
  subsets: ['latin'], // specify subsets
  weight: '400', 
  color: 'blue',    // font weight, Lobster usually has 400 only
});

const lato = Lato({
  subsets: ['latin'],       // Include subsets you need
  weight: ['400', '700'],   // Load normal and bold weights
  style: ['normal', 'italic'], // (optional) if you want italic styles
  display: 'swap',          // Recommended for performance
});

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome },
    { name: 'Upload Design', href: '/dashboard/upload', icon: FiUpload },
    { name: 'Reports', href: '/dashboard/reports', icon: FiBarChart2 },
    { name: 'Team', href: '/dashboard/team', icon: FiUsers },
    { name: 'Settings', href: '/dashboard/settings', icon: FiSettings },
    { name: 'Logout', href: '/logout', icon: FiLogOut },
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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo and Company Name */}
        <div className="pt-5 pl-6  border-b border-gray-200 flex items-center gap-2 ">
          <Image src="/Logo/dashboardlogo3.png" alt="UI Audit Logo" width={45} height={45} className="mb-2" />
          <h1 className={`${lobster.className} text-blue-500 text-xl`}>UI Audit</h1>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={` ${lato.className} flex items-center space-x-3 px-2 py-3 rounded-lg transition-colors text-[13px] font-semibold ${
                      isActive
                        ? 'bg-blue-100   py-1 rounded-xs text-gray-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={isActive ? 'text-blue-500' : 'text-gray-400'  } size={17} />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Headbar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          {/* Left: Logo, Name, and Breadcrumb */}
          <div className="flex items-center space-x-4">
            
            <h1 className={`${lobster.className} text-blue-500 text-lg`}>Home</h1>
            <span className={`${lato.className} text-gray-600 text-sm`}>/ {getPageName(pathname)}</span>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search the dashboard"
                className={`${lato.className} w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-xs`}
              />
            </div>
          </div>

          {/* Right: Notifications and User */}
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:text-gray-800">
              <FiBell className="w-6 h-6" />
              <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
            </button>

            <div className="">
             <Image src="/images/man.png" alt="UI Audit Logo" width={45} height={45} className="mb-2 w-9 h-9 bg-gray-300 rounded-full" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}
