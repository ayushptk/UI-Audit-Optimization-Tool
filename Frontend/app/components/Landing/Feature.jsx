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
    <div className="overflow-hidden h-[450px] w-84">
      <div className={`flex flex-col gap-6 ${direction === 'up' ? 'animate-scroll-up' : 'animate-scroll-down'}`}>
        {[...features, ...features].map((feature, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-2 text-center"
          >
            <div className="flex justify-center mb-4 "><span className='bg-gray-100 p-4 rounded-full'>{feature.icon}</span></div>
            <h3 className="text-md font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="py-10 px-6 bg-white">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <button className="text-blue-900 border border-slate-700 px-6 py-2 rounded-3xl mb-6">
          Features
        </button>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Powerful Features for Better Design
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Our AI comprehensively analyzes your UI designs, giving you insights to build visually stunning and accessible experiences.
        </p>
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
