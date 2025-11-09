'use client';

import React from 'react';
import { FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "5 design audits per month",
        "Basic usability analysis",
        "Accessibility checklist",
        "PDF reports"
      ],
      buttonText: "Get Started",
      popular: false
    },
    {
      name: "Pro",
      price: "$29",
      period: "per month",
      description: "For growing teams",
      features: [
        "Unlimited design audits",
        "Advanced AI analysis",
        "Full accessibility audit",
        "Priority support",
        "Team collaboration",
        "Custom integrations"
      ],
      buttonText: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "For large organizations",
      features: [
        "Everything in Pro",
        "Dedicated account manager",
        "On-premise deployment",
        "Advanced security",
        "Custom AI training",
        "24/7 phone support"
      ],
      buttonText: "Contact Sales",
      popular: false
    }
  ];

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
          
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
            <button className="text-blue-900 border border-indigo-600 px-6 py-2 rounded-3xl mb-6">
            Pricing
        </button>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start free and scale as you grow. All plans include our core AI-powered audit features.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className={`bg-white p-8 rounded-xl shadow-lg ${plan.popular ? 'border-2 border-indigo-500 scale-105' : ''} transition duration-300`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              {plan.popular && (
                <div className="bg-indigo-500 text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-600">/{plan.period}</span>
              </div>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              <ul className="mb-8 space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <FaCheck className="text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 px-6 rounded-lg font-semibold transition duration-300 ${plan.popular ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}>
                {plan.buttonText}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
