'use client';

import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How does UiAudit analyze my designs?",
      answer: "UiAudit uses advanced AI algorithms to examine your uploaded Figma files or screenshots. It analyzes usability, accessibility, visual hierarchy, and consistency by comparing against best practices and industry standards."
    },
    {
      question: "What file formats are supported?",
      answer: "We support Figma files (.fig), PNG, JPG, and PDF screenshots. For best results, we recommend uploading high-resolution images or direct Figma links."
    },
    {
      question: "Is my design data secure?",
      answer: "Absolutely. All uploads are encrypted and processed securely. We don't store your designs permanently - they're analyzed and then deleted. Your data privacy is our top priority."
    },
    {
      question: "How accurate is the AI analysis?",
      answer: "Our AI is trained on thousands of design examples and continuously improved. While it's highly accurate for common issues, we recommend using it as a supplement to human expertise."
    },
    {
      question: "Can I integrate UiAudit with my workflow?",
      answer: "Yes! Pro and Enterprise plans include API access and integrations with popular design tools like Figma, Sketch, and Adobe XD."
    }
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-4 bg-white">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="text-center mb-16">
            <button className="text-blue-900 border border-indigo-600 px-6 py-2 rounded-3xl mb-6">
            Frequently Asked Questions
        </button>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about UiAudit
          </p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg">
              <button
                className="w-full text-left p-6 rounded-lg"
                onClick={() => toggleFaq(index)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaChevronDown className="text-gray-500" />
                  </motion.div>
                </div>
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
                    <div className="px-6 pb-6">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Faq;
