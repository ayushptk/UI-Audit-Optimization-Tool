'use client';

import React, { useRef } from 'react';
import { FaArrowRight, FaChevronDown } from 'react-icons/fa';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import TrueFocus from './TrueFocus';

const Herosection = () => {
  const router = useRouter();
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  // Parallax effects
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delayChildren: 0.3, staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  return (
    <section ref={ref} className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
      {/* Background Image with Parallax */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: backgroundY }}
      >
        <Image
          src="/Images/uiaudittareeyy.png"
          alt="UI Audit Background"
          fill
          className="object-cover object-center opacity-60"
          priority
        />
        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 w-full max-w-7xl mx-auto px-4 text-center mt-16"
        style={{ y: textY, opacity }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-2xl sm:text-3xl md:text-4xl lg:text-[4rem] leading-none font-extrabold text-white mb-6 tracking-tight drop-shadow-2xl"
          variants={itemVariants}
        >
          Revolutionize Your{' '}
          <motion.span
            className="block mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          > 
            <TrueFocus
              sentence="UX Insights"
              manualMode={false}
              blurAmount={5}
              borderColor="rgba(99, 102, 241, 0.8)"
              animationDuration={2}
              pauseBetweenAnimations={1}
            />
          </motion.span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-200 mb-12 max-w-3xl mx-auto font-light drop-shadow-lg"
          variants={itemVariants}
        >
          Upload your designs and get instant feedback on usability, accessibility, visual hierarchy, and consistency.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-6"
          variants={itemVariants}
        >
          <button
            className="group bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-full font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transform hover:-translate-y-1"
            onClick={() => router.push('/login')}
          >
            Get Started Free 
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            className="border-2 border-white/30 hover:border-white/80 hover:bg-white/10 text-white px-6 py-3 rounded-full font-bold text-lg transition-all duration-300 backdrop-blur-sm cursor-pointer"
          >
            Learn More
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll Down Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span className="text-xs sm:text-sm font-medium tracking-[0.3em] uppercase opacity-70">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <FaChevronDown className="text-xl sm:text-2xl opacity-70" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Herosection;
