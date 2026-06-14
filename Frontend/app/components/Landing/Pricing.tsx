// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { FaCheck } from 'react-icons/fa';

export default function Pricing() {
  const [billing, setBilling] = useState('monthly');

  const plans = [
    {
      name: "Free Plan",
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: "Perfect for exploring our platform",
      buttonText: "Get Started",
      highlight: false,
    },
    {
      name: "Premium Plan",
      monthlyPrice: 45,
      yearlyPrice: 36, // 20% off $45
      description: "Best for growing businesses",
      buttonText: "Get Started",
      highlight: true,
    },
    {
      name: "Enterprise Plan",
      monthlyPrice: 99,
      yearlyPrice: 79, // ~20% off $99
      description: "Advanced features for scale",
      buttonText: "Get Started",
      highlight: false,
    }
  ];

  const rows = [
    {
      title: "Unlimited Designs",
      checks: [false, true, true]
    },
    {
      title: "Basic usability analysis",
      checks: [true, true, true]
    },
    {
      title: "Accessibility check",
      checks: [true, true, true]
    },
    {
      title: "Visual hierarchy analysis",
      checks: [false, true, true]
    },
    {
      title: "Custom integrations",
      checks: [false, false, true]
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#fafafa]/50 flex flex-col items-center pt-20 pb-28 overflow-hidden font-sans">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[5%] left-[-15%] w-[800px] h-[800px] bg-[#38bdf8] opacity-[0.12] blur-[100px] rounded-full"></div>
        <div className="absolute top-[20%] right-[-10%] w-[700px] h-[700px] bg-[#818cf8] opacity-[0.15] blur-[120px] rounded-full"></div>
      </div>

      {/* Floating Elements (Visible on lg and up) */}
      <div className="absolute z-0 hidden lg:flex items-center justify-center w-[72px] h-[72px] bg-white rounded-2xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.1)] rotate-[-12deg] left-[15%] top-[25%]">
        <span className="text-2xl font-bold text-gray-800">€</span>
      </div>
      <div className="absolute z-0 hidden lg:flex items-center justify-center w-[72px] h-[72px] bg-white rounded-2xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.1)] rotate-[15deg] right-[15%] top-[22%]">
        <span className="text-2xl font-bold text-gray-800">$</span>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-4 w-full">
        {/* Badge */}
        <div className="border border-gray-200 bg-white/60 backdrop-blur-md px-5 py-2 rounded-full text-xs font-semibold text-gray-700 tracking-wide mb-10 shadow-sm">
          Pricing
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-[700] text-black tracking-[-0.03em] leading-[1.05] mb-6 max-w-3xl mx-auto">
          Our plans scale <br className="hidden md:block"/>
          with <span className="text-[#a1a1aa] font-[500]">your business</span>
        </h1>

        {/* Subtitle */}
        <p className="text-[#52525b] text-[15px] md:text-[16px] leading-[1.6] max-w-[600px] mx-auto mb-12 px-4 font-medium">
          Your business evolves—and so should your user experience. Our UI Audit plans are built to adapt, giving you the insights you need to improve and scale your product with confidence.
        </p>

        {/* Billing Toggle (Improved for responsiveness) */}
        <div className="flex items-center gap-4 mb-16 bg-white/50 backdrop-blur-sm p-1.5 rounded-2xl border border-gray-200 shadow-sm">
          <button 
            onClick={() => setBilling('monthly')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${billing === 'monthly' ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:text-black'}`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setBilling('yearly')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${billing === 'yearly' ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:text-black'}`}
          >
            Yearly
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${billing === 'yearly' ? 'bg-white text-black' : 'bg-gray-100 text-black'}`}>Save 20%</span>
          </button>
        </div>

        {/* Desktop Comparison Table (Visible on lg and up) */}
        <div className="hidden lg:block w-full max-w-[1080px] bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] p-12 overflow-hidden border border-gray-100">
          <div className="grid grid-cols-4 gap-8 items-end mb-12">
            {/* Empty space for row titles */}
            <div className="text-left pb-4">
              <h3 className="text-xl font-bold text-black opacity-40">Features</h3>
            </div>

            {plans.map((plan, i) => (
              <div key={i} className={`flex flex-col items-center pb-4 ${plan.highlight ? 'bg-[#0a0a0a] rounded-[28px] pt-10 pb-10 px-6 shadow-2xl transform scale-105 z-10 -translate-y-2' : ''}`}>
                <h3 className={`text-[18px] font-bold mb-5 ${plan.highlight ? 'text-white' : 'text-black'}`}>{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className={`text-[52px] font-bold tracking-tight leading-none ${plan.highlight ? 'text-white' : 'text-black'}`}>
                    ${billing === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                  </span>
                </div>
                <span className={`text-[14px] font-medium mb-8 ${plan.highlight ? 'text-gray-400' : 'text-gray-400'}`}>per month</span>
                <button className={`w-full py-3.5 rounded-xl text-[14px] font-bold transition-all ${plan.highlight ? 'bg-white text-black hover:bg-gray-100' : 'border border-gray-200 text-black hover:bg-gray-50 shadow-sm'}`}>
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} className={`grid grid-cols-4 gap-8 items-center px-8 py-5 rounded-2xl transition-colors ${rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-transparent'}`}>
                <div className="text-left">
                  <span className="text-[15px] font-bold text-gray-800">{row.title}</span>
                </div>
                {row.checks.map((check, checkIndex) => (
                  <div key={checkIndex} className="flex justify-center">
                    {check && (
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shadow-sm ${plans[checkIndex].highlight ? 'bg-black text-white' : 'bg-black text-white'}`}>
                        <FaCheck size={10} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile/Tablet Card View (Visible below lg) */}
        <div className="lg:hidden flex flex-col gap-8 w-full max-w-[450px] px-4">
          {plans.map((plan, i) => (
            <div key={i} className={`relative flex flex-col text-left p-8 rounded-[2rem] shadow-xl border ${plan.highlight ? 'bg-[#0a0a0a] text-white border-black ring-4 ring-black/5' : 'bg-white text-black border-gray-100'}`}>
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white text-[11px] font-bold px-4 py-1.5 rounded-full border-2 border-white shadow-xl">
                  MOST POPULAR
                </div>
              )}
              
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <p className={`text-sm mb-6 ${plan.highlight ? 'text-gray-400' : 'text-gray-500'}`}>{plan.description}</p>
              
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-bold tracking-tight">
                  ${billing === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                </span>
                <span className={`text-sm font-medium ${plan.highlight ? 'text-gray-400' : 'text-gray-500'}`}>/month</span>
              </div>

              <div className="space-y-4 mb-8">
                {rows.map((row, rowIndex) => (
                  row.checks[i] && (
                    <div key={rowIndex} className="flex items-center gap-3">
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${plan.highlight ? 'bg-white text-black' : 'bg-black text-white'}`}>
                        <FaCheck size={9} />
                      </div>
                      <span className="text-[14px] font-semibold">{row.title}</span>
                    </div>
                  )
                ))}
              </div>

              <button className={`w-full py-4 rounded-2xl text-[15px] font-bold transition-all shadow-lg ${plan.highlight ? 'bg-white text-black hover:bg-gray-100' : 'bg-black text-white hover:bg-gray-900'}`}>
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>

      
      {/* Scrollbar Styles embedded */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #d4d4d8;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #a1a1aa;
        }
      `}} />
    </div>
  );
}
