"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function IntroLayout({ children }) {
  const [showIntro, setShowIntro] = useState(true);
  const [logoMoved, setLogoMoved] = useState(false);

  useEffect(() => {
    const logoTimer = setTimeout(() => setLogoMoved(true), 1500);
    const introTimer = setTimeout(() => setShowIntro(false), 3500);
    
    return () => {
      clearTimeout(logoTimer);
      clearTimeout(introTimer);
    };
  }, []);

  return (
    <>
      {showIntro ? (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">
          {/* Animated background ripples */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-indigo-200"
                initial={{ width: 0, height: 0, opacity: 0.8 }}
                animate={{
                  width: [0, 800, 1200],
                  height: [0, 800, 1200],
                  opacity: [0.6, 0.3, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.4,
                  ease: "easeOut",
                  repeat: Infinity,
                  repeatDelay: 0.5,
                }}
              />
            ))}
          </motion.div>

          {/* Content container */}
          <div className="relative z-10 flex items-center gap-6">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
              animate={
                logoMoved
                  ? { opacity: 1, scale: 1, rotate: 0, x: 0 }
                  : { opacity: 1, scale: 1, rotate: 0 }
              }
              transition={{
                duration: 1,
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="w-28 h-28 bg-gradient-to-br from-white-500 to-white-600 rounded-2xl shadow-2xl flex items-center justify-center">
                  <img src="/Logo/Uisearchicon.png" alt="Logo" />
                </div>
              </motion.div>
            </motion.div>

            {/* Text with ripple effect */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={logoMoved ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="overflow-hidden"
            >
              <motion.h1
                className="text-7xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent relative"
                style={{
                  backgroundSize: "200% auto",
                }}
                animate={{
                  backgroundPosition: ["0% center", "200% center"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                {"UI AUDIT".split("").map((char, index) => (
                  <motion.span
                    key={index}
                    className="inline-block"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: logoMoved ? index * 0.08 : 0,
                      type: "spring",
                      stiffness: 200,
                    }}
                    whileHover={{ scale: 1.2, color: "#8b5cf6" }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </motion.h1>

              {/* Underline animation */}
              <motion.div
                className="h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mt-2"
                initial={{ width: 0 }}
                animate={logoMoved ? { width: "100%" } : { width: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
              />
            </motion.div>
          </div>

          {/* Particle effects */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-indigo-400 rounded-full"
              initial={{
                x: "50vw",
                y: "50vh",
                opacity: 0,
              }}
              animate={{
                x: `${Math.random() * 100}vw`,
                y: `${Math.random() * 100}vh`,
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 2,
                repeat: Infinity,
              }}
            />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      )}
    </>
  );
}