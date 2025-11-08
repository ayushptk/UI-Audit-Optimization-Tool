'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IoRocketOutline } from 'react-icons/io5';
import { HiMenu, HiX } from 'react-icons/hi';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'FAQ', href: '/faq' },
  ];

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.nav
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 shadow-lg max-w-5xl">
        <div className="flex items-center  w-full gap-10">
          {/* Logo */}
          <Image src="/Logo/Uiauditlogo.png" alt="Logo" width={60} height={60} className="mr-4" />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Get Started Button */}
          <Link
            href="/get-started"
            className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <IoRocketOutline className="w-5 h-5 animate-pulse" />
            <span className="whitespace-nowrap">Get Started</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 hover:text-blue-600 transition-colors duration-300"
          >
            {isOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-gray-50 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/get-started"
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl mx-4"
                onClick={() => setIsOpen(false)}
              >
                <IoRocketOutline className="w-5 h-5 animate-pulse" />
                <span className="whitespace-nowrap">Get Started</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
