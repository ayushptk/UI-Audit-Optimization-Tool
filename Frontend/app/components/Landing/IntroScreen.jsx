"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function IntroLayout({ children }) {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Total duration of the intro sequence
    const timer = setTimeout(() => setShowIntro(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {showIntro ? (
          <motion.div
            key="intro"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              y: -50,
              opacity: 0,
              transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
            }}
          >
            <div className="flex flex-col items-center gap-8">
              {/* Logo Container */}
              <motion.div
                className="relative flex items-center justify-center w-24 h-24 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5"
                initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  filter: "blur(0px)",
                }}
                transition={{
                  duration: 1.2,
                  ease: [0.16, 1, 0.3, 1], // Apple-style spring ease
                }}
              >
                <motion.img
                  src="/Logo/Uisearchicon.png"
                  alt="Logo"
                  className="w-12 h-12 object-contain opacity-90"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                />
              </motion.div>

              {/* Text Reveal */}
              <div className="flex flex-col items-center gap-2">
                <div className="overflow-hidden">
                  <motion.h1
                    className="text-3xl font-semibold tracking-[-0.04em] text-zinc-900"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{
                      delay: 0.4,
                      duration: 0.8,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    UI AUDIT
                  </motion.h1>
                </div>

                {/* Minimal Loading Line */}
                <motion.div
                  className="h-[2px] bg-zinc-100 w-24 rounded-full overflow-hidden mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <motion.div
                    className="h-full bg-zinc-900"
                    initial={{ width: "0%" }}
                    animate={{ width: ["0%", "25%", "100%"] }}
                    transition={{
                      duration: 2,
                      times: [0, 0.3, 1],
                      ease: "easeInOut",
                      delay: 0.8,
                    }}
                  />
                </motion.div>

                {/* Loading Text */}
                <motion.p
                  className="text-xs text-zinc-400 mt-2 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  Loading...
                </motion.p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            className="min-h-screen"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}