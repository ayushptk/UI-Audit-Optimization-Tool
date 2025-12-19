
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import {
  FaCheck,
  FaRocket,
  FaCrown,
  FaBuilding,
  FaArrowRight,
} from 'react-icons/fa';

const Pricing = () => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      icon: <FaRocket className="text-cyan-600 text-2xl" />,
      features: [
        '5 design audits per month',
        'Basic usability analysis',
        'Accessibility checklist',
        'PDF reports',
      ],
      buttonText: 'Get Started',
      popular: false,
      accent: 'from-violet-500/15 to-transparent',
      ring: 'ring-cyan-500/20',
      glow: 'shadow-[0_10px_40px_-10px_rgba(34,211,238,0.35)]',
    },
    {
      name: 'Pro',
      price: '$29',
      period: 'per month',
      description: 'For growing teams',
      icon: <FaCrown className="text-violet-600 text-2xl" />,
      features: [
        'Unlimited design audits',
        'Advanced AI analysis',
        'Full accessibility audit',
        'Priority support',
        'Team collaboration',
        'Custom integrations',
      ],
      buttonText: 'Start Free Trial',
      popular: true,
      accent: 'from-violet-500/15 to-transparent',
      ring: 'ring-violet-500/25',
      glow: 'shadow-[0_10px_50px_-10px_rgba(139,92,246,0.4)]',
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'pricing',
      description: 'For large organizations',
      icon: <FaBuilding className="text-amber-600 text-2xl" />,
      features: [
        'Everything in Pro',
        'Dedicated account manager',
        'On-premise deployment',
        'Advanced security',
        'Custom AI training',
        '24/7 phone support',
      ],
      buttonText: 'Contact Sales',
      popular: false,
      accent: 'from-violet-500/15 to-transparent',
      ring: 'ring-amber-500/20',
      glow: 'shadow-[0_10px_50px_-10px_rgba(245,158,11,0.35)]',
    },
  ];

  // Interactive cursor (magnetic) inside section
  const sectionRef = useRef(null);
  const [active, setActive] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 20 });
  const sy = useSpring(my, { stiffness: 200, damping: 20 });

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const onEnter = () => setActive(true);
    const onLeave = () => setActive(false);
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mx.set(x);
      my.set(y);
    };

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('mousemove', onMove);

    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('mousemove', onMove);
    };
  }, [mx, my]);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-4 overflow-hidden bg-white"
    >
      {/* Subtle decorative blobs on white */}
      <div className="absolute inset-0 -z-10">
        {/* Very faint blobs to keep it clean */}
        <div className="absolute -top-20 -left-24 w-80 h-80 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-[28rem] h-[28rem] rounded-full bg-violet-400/10 blur-3xl" />
      </div>

      {/* Interactive cursor ring (light theme) */}
      <motion.div
        className="pointer-events-none absolute z-40 hidden md:block"
        style={{ left: sx, top: sy }}
      >
        <div
          className={`-translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 ${
            active ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-full border border-slate-300/70 backdrop-blur-md bg-white/60" />
            <div className="absolute inset-0 w-12 h-12 rounded-full blur-md bg-gradient-to-tr from-cyan-400/30 to-violet-400/30" />
          </div>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <button className="text-slate-700 border border-slate-700 px-6 py-2 rounded-3xl mb-6 backdrop-blur-md bg-white hover:bg-slate-50 transition">
            Pricing
          </button>
          <h2 className="text-4xl md:text-5xl font-semibold text-slate-900 mb-4 tracking-tight">
            Choose Your Plan
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Start free and scale as you grow. All plans include our core AI-powered audit features.
          </p>
        </motion.div>

        {/* Equal-height grid */}
        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
              viewport={{ once: true }}
              className="relative group h-full"
            >
              {/* Hover glow */}
              <div
                className={`absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition ${plan.glow} pointer-events-none`}
              />

              {/* Card */}
              <div
                className={`
                  relative rounded-2xl p-8 border border-slate-200
                  bg-white/80 backdrop-blur-lg
                  hover:bg-white transition
                  h-full flex flex-col
                  ${plan.popular ? 'ring-2 ' + plan.ring : ''}
                `}
              >
                {/* Accent gradient wash */}
                <div
                  className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br ${plan.accent} opacity-70 group-hover:opacity-90 transition`}
                />

                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-6">
                    <div className="rounded-full bg-violet-600 text-white text-xs font-medium px-3 py-1 shadow-md">
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Header */}
                <div className="relative z-10 flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-900">
                    {plan.name}
                  </h3>
                </div>

                {/* Price */}
                <div className="relative z-10 mb-4">
                  <span className="text-4xl font-bold text-slate-900">
                    {plan.price}
                  </span>
                  <span className="text-slate-600 ml-2">/ {plan.period}</span>
                </div>

                <p className="relative z-10 text-slate-600 mb-6">
                  {plan.description}
                </p>

                {/* Features */}
                <ul className="relative z-10 space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-slate-700 group/feat"
                    >
                      <span className="mt-1">
                        <FaCheck className="text-emerald-500 group-hover/feat:scale-110 transition-transform" />
                      </span>
                      <span className="hover:text-slate-900 transition-colors">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Spacer */}
                <div className="mt-auto" />

                {/* CTA */}
                <button
                  className={`relative z-10 w-full py-3 px-6 rounded-xl font-semibold transition
                    focus:outline-none focus:ring-2 focus:ring-offset-0
                    ${plan.popular
                      ? 'bg-violet-600 hover:bg-violet-500 text-white focus:ring-violet-400'
                      : 'bg-slate-900 hover:bg-slate-800 text-white focus:ring-slate-400'
                    } flex items-center justify-center gap-2`}
                >
                  {plan.buttonText}
                  <FaArrowRight className="transition-transform group-hover:translate-x-0.5" />
                </button>

                {/* Subtle top-left sheen */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition">
                  <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/40 blur-2xl rotate-12" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
