// @ts-nocheck
// JavaScript (React / Next.js)
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { IoRocketOutline } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/#home' },
    { name: 'Features', href: '/#features' },
    { name: 'Pricing', href: '/#pricing' },
    { name: 'FAQ', href: '/#faq' },
  ];

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2, ease: 'easeOut' },
    },
    exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
  };

  return (
    <motion.nav
      className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-full px-4"
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mx-auto   px-4 sm:px-6 py-3 max-w-5xl ">
      
        <div className="flex items-center justify-between w-full gap-3">
          
          <div className="flex items-center gap-3">
            <Image
              src="/Logo/Uiauditlogo.png"
              alt="Logo"
              width={44}
              height={44}
              className="sm:w-[60px] sm:h-[40px]"
              priority
            />
          </div>

          {/* Center: Desktop navigation (unchanged on ≥ sm) */}
          <div className="hidden sm:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-100 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-300 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right: Desktop CTA */}
          <div className="hidden sm:block ">
            <Link
              href="/login"
              className="flex items-center space-x-2  text-white px-6 py-2 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <IoRocketOutline className="w-5 h-5 animate-pulse" />
              <span className="whitespace-nowrap ">Get Started</span>
            </Link>
          </div>

          {/* Right: Mobile hamburger */}
          <button
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="sm:hidden inline-flex items-center justify-center rounded-full p-2 text-white hover:bg-white/20 transition"
          >
            {open ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="mobile-menu"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={mobileMenuVariants}
              className="sm:hidden mt-3"
            >
              <div className="bg-white/70 backdrop-blur border border-white/30 rounded-2xl p-3 shadow-md">
                <nav className="flex flex-col">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="px-3 py-2 rounded-xl text-gray-800 hover:bg-white transition font-medium"
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
                  >
                    <IoRocketOutline className="w-5 h-5" />
                    <span>Get Started</span>
                  </Link>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
