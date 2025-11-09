'use client';

import Link from 'next/link';
import Image from 'next/image';
import { IoRocketOutline } from 'react-icons/io5';
import { motion } from 'framer-motion';

const Navbar = () => {
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
      className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50"
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="bg-white/10  border border-white/20 rounded-full px-6 py-3 shadow-lg max-w-5xl">
        <div className="flex items-center  w-full gap-10">
          {/* Logo */}
          <Image src="/Logo/Uiauditlogo.png" alt="Logo" width={60} height={60} className="mr-4" />

          {/* Navigation */}
          <div className="flex items-center space-x-8">
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
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <IoRocketOutline className="w-5 h-5 animate-pulse" />
            <span className="whitespace-nowrap">Get Started</span>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
