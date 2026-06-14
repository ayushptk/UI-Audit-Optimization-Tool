// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HiOutlineMail, HiOutlinePlus, HiOutlineMinus } from "react-icons/hi";
import { IoRocketOutline } from "react-icons/io5";
import Image from 'next/image';
import { Instrument_Serif } from 'next/font/google';

const instrumentSerif = Instrument_Serif({ weight: '400', subsets: ['latin'] });

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How does the AI-powered UI audit work?",
      answer: "Our AI analyzes your layout, typography, and color schemes against 100+ design principles and user psychology patterns to provide actionable, data-driven feedback within seconds."
    },
    {
      question: "Can I audit specifically for accessibility compliance?",
      answer: "Yes, UI Audit checks your designs against WCAG 2.1 levels AA and AAA. We analyze color contrast ratios, font legibility, and interactive element sizing to ensure inclusivity."
    },
    {
      question: "What platforms or formats do you support?",
      answer: "We support direct URL analysis for live websites, Figma file integration via our plugin, and high-fidelity image uploads (JPEG, PNG, WebP) for early-stage design reviews."
    },
    {
      question: "How long does a typical audit take?",
      answer: "A comprehensive scan of a single page typically takes less than 45 seconds. For full site audits, we provide a detailed report in under 5 minutes."
    },
    {
      question: "Does UI Audit provide suggestions for fixing issues?",
      answer: "Absolutely. We don't just find problems; we provide specific recommendations, color palette alternatives, and even CSS snippets to help you resolve issues instantly."
    },
    {
      question: "Can I use UI Audit for mobile app designs?",
      answer: "Yes, our tool is optimized for responsive design audits. It automatically tests your UI across multiple breakpoints to ensure a seamless experience on all devices."
    }
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white">
      {/* FAQ Main Section matching the UI PDF/Image exactly */}
      <section className="font-sans py-16 md:py-24 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1300px] mx-auto">
          
          {/* Centered Header: FAQ "Middle of web page" */}
          <div className="mb-12 md:mb-16 text-center max-w-3xl mx-auto">
            <h2 className={`text-[36px] sm:text-[42px] lg:text-[48px] xl:text-[52px] ${instrumentSerif.className} text-[#0f172a] mb-3 tracking-tight leading-tight`}>
              Frequently asked questions
            </h2>
            <p className="text-[#64748b] text-base sm:text-lg font-medium px-4">
              Everything you need to know about UI Audit and our process
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left Side: Image Column - Stretches to match the height of the FAQ column */}
            <div className="relative w-full h-full">
              {/* This inner div is what actually sticks */}
              <div className="lg:sticky lg:top-32 flex justify-center">
                <Image 
                  src="/Images/Faqimages.jpg" 
                  alt="FAQ Illustration" 
                  width={1000}
                  height={800}
                  className="w-full max-w-lg lg:max-w-none lg:w-[120%] xl:w-[125%] h-auto object-contain lg:-ml-12 pointer-events-none select-none"
                  priority
                />
              </div>
            </div>

            {/* Right Side: Content Column */}
            <div className="flex flex-col pt-2">
              <motion.div 
                className="w-full"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="w-full">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-0 md:last:border-b">
                    <button
                      className="w-full py-[18px] md:py-[22px] flex items-center justify-between text-left group transition-all duration-300 outline-none"
                      onClick={() => toggleFaq(index)}
                    >
                      <span className="text-[14px] sm:text-[15px] md:text-[16px] font-semibold text-[#1e293b] group-hover:text-[#3b82f6] transition-colors pr-6">
                        {faq.question}
                      </span>
                      <span className="text-[#3b82f6] flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        {openIndex === index ? (
                          <HiOutlineMinus className="w-5 h-5 sm:w-[22px] sm:h-[22px] stroke-[2]" />
                        ) : (
                          <HiOutlinePlus className="w-5 h-5 sm:w-[22px] sm:h-[22px] stroke-[2]" />
                        )}
                      </span>
                    </button>
                    <AnimatePresence>
                      {openIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="pb-6 pr-10">
                            <p className="text-[#64748b] text-[14px] sm:text-[15px] leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Still Have Questions? section (Maintained from previous design) */}
      <section className="bg-[#F6F3FF] text-center text-black py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className={`text-2xl sm:text-3xl lg:text-3xl ${instrumentSerif.className} mb-4 text-[#0f172a] font-bold`}>
            Still Have Questions?
          </h2>

          <p className="text-sm sm:text-base leading-relaxed mb-8 text-[#475569] max-w-2xl mx-auto">
            Our team is ready to help you find the perfect UI/UX audit solution for your product designed to improve usability, consistency, and user trust
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#432DD7] text-white text-sm sm:text-base font-medium px-8 py-3.5 rounded-xl hover:bg-blue-800 transition shadow-sm">
              <IoRocketOutline className="w-5 h-5 animate-pulse" />
              Start Free Audit
            </button>

            <button className="w-full sm:w-auto flex items-center justify-center gap-2 border border-gray-300 text-gray-800 text-sm sm:text-base font-medium px-8 py-3.5 rounded-xl hover:bg-gray-50 transition shadow-sm bg-white">
              <HiOutlineMail className="text-lg" />
              Contact Support
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Faq;

