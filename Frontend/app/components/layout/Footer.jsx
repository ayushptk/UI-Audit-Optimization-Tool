'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { FaXTwitter } from "react-icons/fa6";
const Footer = () => {
  const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  const linkVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  return (
    <motion.footer
      className="bg-[#FDFEFE] text-gray-700 py-12 px-6 md:px-12 border-t border-gray-200"
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto  ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <Image
              src="/Logo/Uiauditlogo.png"
              alt="UI Audit Logo"
              width={80}
              height={80}
              className="mb-4"
            />
            <p className="text-md leading-relaxed mb-4 max-w-md">
              UI Audit: Analyze and improve user interfaces with performance metrics and actionable recommendations.
            </p>
            <div className="flex space-x-4">
              <motion.a
                href="#"
                className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray hover:from-blue-500 hover:to-blue-700 transition-all duration-300 hover:bg-blue-500 hover:text-white"
                variants={linkVariants}
                whileHover="hover"
              >
                <FaFacebook className="w-5 h-5 "   />
              </motion.a>
              <motion.a
                href="#"
                className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray hover:from-sky-500 hover:to-sky-700 transition-all duration-300 hover:bg-blue-500 hover:text-white"
                variants={linkVariants}
                whileHover="hover"
              >
                <FaXTwitter className="w-5 h-5 " />
              </motion.a>
              <motion.a
                href="#"
                className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray hover:from-pink-500 hover:to-pink-700 transition-all duration-300 hover:bg-blue-500 hover:text-white"
                variants={linkVariants}
                whileHover="hover"
              >
                <FaInstagram className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#"
                className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray hover:from-blue-700 hover:to-blue-900 transition-all duration-300 hover:bg-blue-500 hover:text-white"
                variants={linkVariants}
                whileHover="hover"
              >
                <FaLinkedinIn className="w-4 h-4" />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: 'Home', href: '/' },
                { name: 'Features', href: '/features' },
                { name: 'Pricing', href: '/pricing' },
                { name: 'FAQ', href: '/faq' },
              ].map((item) => (
                <li key={item.name}>
                  
                    <Link
                      href={item.href}
                      className="text-sm hover:text-blue-600 transition-colors duration-300"
                    >
                      {item.name}
                    </Link>
                 
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Support</h3>
            <ul className="space-y-2">
              {[
                { name: 'Contact Us', href: '/contact' },
                { name: 'Help Center', href: '/help' },
                { name: 'Privacy Policy', href: '/privacy' },
                { name: 'Terms of Service', href: '/terms' },
              ].map((item) => (
                <li key={item.name}>
                
                    <Link
                      href={item.href}
                      className="text-sm hover:text-blue-600 transition-colors duration-300"
                    >
                      {item.name}
                    </Link>
                
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} UI Audit. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-300">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-300">
              Cookies Setings
            </Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
