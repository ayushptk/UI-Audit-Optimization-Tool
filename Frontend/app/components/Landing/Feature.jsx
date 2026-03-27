'use client';

import React from 'react';
import {
  FaEye,
  FaUniversalAccess,
  FaLayerGroup,
  FaCheckCircle,
  FaLightbulb,
  FaMobileAlt,
  FaPalette,
  FaRocket,
  FaLock,
  FaChartLine,
} from 'react-icons/fa';
import { motion, useScroll, useTransform } from "framer-motion";
import { Instrument_Serif } from 'next/font/google';

const instrumentSerif = Instrument_Serif({ weight: '400', subsets: ['latin'] });

const Feature = () => {
  const column1 = [
    {
      icon: <FaEye className="text-2xl text-indigo-600" />,
      title: 'Usability Analysis',
      description: 'AI-powered insights to identify usability issues and improve UX flow.',
    },
    {
      icon: <FaUniversalAccess className="text-2xl text-indigo-600" />,
      title: 'Accessibility Audit',
      description: 'Ensure designs meet WCAG standards for all users.',
    },
    {
      icon: <FaLayerGroup className="text-2xl text-indigo-600" />,
      title: 'Visual Hierarchy',
      description: 'Enhance information structure for better readability.',
    },
    {
      icon: <FaPalette className="text-2xl text-indigo-600" />,
      title: 'Color Optimization',
      description: 'Improve contrast and visual balance in your UI.',
    },
    {
      icon: <FaRocket className="text-2xl text-indigo-600" />,
      title: 'Performance Boost',
      description: 'Reduce UI load time and improve user interaction.',
    },
  ];

  const column2 = [
    {
      icon: <FaCheckCircle className="text-2xl text-indigo-600" />,
      title: 'Consistency Check',
      description: 'Maintain design consistency across all screens.',
    },
    {
      icon: <FaLightbulb className="text-2xl text-indigo-600" />,
      title: 'Smart Suggestions',
      description: 'AI gives improvement tips for each component.',
    },
    {
      icon: <FaMobileAlt className="text-2xl text-indigo-600" />,
      title: 'Responsive Design',
      description: 'Ensures layouts adapt beautifully on any device.',
    },
    {
      icon: <FaLock className="text-2xl text-indigo-600" />,
      title: 'Secure Components',
      description: 'Best practices for secure and stable UI behavior.',
    },
    {
      icon: <FaChartLine className="text-2xl text-indigo-600" />,
      title: 'Analytics Integration',
      description: 'Track design performance and user engagement.',
    },
  ];

  const column3 = [
    {
      icon: <FaEye className="text-2xl text-indigo-600" />,
      title: 'Design Review',
      description: 'AI reviews layouts and gives improvement feedback.',
    },
    {
      icon: <FaUniversalAccess className="text-2xl text-indigo-600" />,
      title: 'Inclusive Design',
      description: 'Cater to diverse users through thoughtful design.',
    },
    {
      icon: <FaPalette className="text-2xl text-indigo-600" />,
      title: 'Brand Harmony',
      description: 'Ensure consistent color and typography across pages.',
    },
    {
      icon: <FaRocket className="text-2xl text-indigo-600" />,
      title: 'Speed Insights',
      description: 'Get optimization reports for better performance.',
    },
    {
      icon: <FaCheckCircle className="text-2xl text-indigo-600" />,
      title: 'Quality Assurance',
      description: 'AI validates alignment and pixel perfection.',
    },
  ];

  const renderColumn = (features, direction) => (
    <div className="overflow-hidden h-[450px] w-72">
      <div className={`flex flex-col gap-6 ${direction === 'up' ? 'animate-scroll-up' : 'animate-scroll-down'}`}>
        {[...features, ...features].map((feature, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-2 text-center"
          >
            <div className="flex justify-center mb-4 "><span className='bg-gray-100 p-4 rounded-full'>{feature.icon}</span></div>
            <h3 className={`text-xl ${instrumentSerif.className} text-gray-900 mb-2`}>{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="py-10 px-6 bg-white">
       <div className="text-center max-w-3xl mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className={`text-4xl sm:text-5xl ${instrumentSerif.className} text-gray-900 mb-6 tracking-tight`}>
                Powerful features <br className="hidden sm:block" />
                at <span style={{ position: 'relative', display: 'inline-block', zIndex: 1 }}>
                  <span style={{ 
                    position: 'absolute', 
                    bottom: '4px', 
                    left: '-2px', 
                    right: '-2px', 
                    height: '14px', 
                    backgroundColor: '#FEF08A', // Slightly darker yellow (yellow-200) for better visibility
                    borderRadius: '4px',
                    transform: 'rotate(-4deg)',
                    zIndex: -1
                  }}></span>
                  <span style={{ position: 'relative' }}>UI Audit</span>
                </span>
              </h2>
              <p className="text-lg text-gray-500 leading-relaxed">
                Analyze your interface instantly and uncover hidden UX issues with smart, data driven recommendations.
              </p>
            </motion.div>
          </div>
      <div className="grid grid-cols-1 md:grid-cols-3  justify-items-center">
        {renderColumn(column1, 'up')}
        {renderColumn(column2, 'down')}
        {renderColumn(column3, 'up')}
      </div>
    </section>
  );
};

export default Feature;
