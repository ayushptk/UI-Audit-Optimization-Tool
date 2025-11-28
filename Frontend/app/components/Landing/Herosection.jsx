'use client';

import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import LiquidEther from './Liquidether';
import MagnetizeButton from './MagnetizeButton';
import Prism from './Prism';
const Herosection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  const buttonVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section className="relative py-20 px-4 min-h-screen flex items-center">
      <div style={{ width: '100%', height: '100vh', position: 'absolute', top: 0, left: 0 }}>
      <Prism

    animationType="hover"

    timeScale={0.5}

    height={3.5}

    baseWidth={5.5}

    scale={3.6}

    hueShift={0}

    colorFrequency={1}

    noise={0}

    glow={1}

  />
      </div>
      <motion.div
        className="relative z-10 max-w-6xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight mt-13"
          variants={itemVariants}
        >
          Revolutionize Your UI with Automated{' '}
          <motion.span
            className="text-indigo-600"
            initial={{ color: '#6B7280' }}
            animate={{ color: '#4F46E5' }}
            transition={{ duration: 1, delay: 1 }}
          >
            UX Insights
          </motion.span>
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto"
          variants={itemVariants}
        >
          Upload your designs and get instant feedback on usability, accessibility, visual hierarchy, and consistency. Perfect for designers, product teams, and developers.
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4"
          variants={containerVariants}
        >
          <motion.button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold text-lg transition duration-300 flex items-center justify-center gap-2"
            variants={buttonVariants}
            whileHover="hover"
          >
            Get Started Free <FaArrowRight />
          </motion.button>
          <motion.button
            className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-2 rounded-lg font-bold text-lg transition duration-300"
            variants={buttonVariants}
            whileHover="hover"
          >
            Learn More
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Herosection;
