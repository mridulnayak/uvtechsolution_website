'use client';

import { ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Zap, Shield, Users, Activity, Settings, Cpu, Globe } from "lucide-react";

/**
 * Interface representing a performance or reach statistic for the enterprise showcase.
 */
interface PerformanceMetric {
  /** The descriptive title of the metric. */
  metricLabel: string;
  /** The formatted numerical or textual value for the metric. */
  metricValue: string;
  /** The visual icon representing the metric pillar. */
  metricIcon: ReactNode;
}

/**
 * Interface representing a core company value or engineering principle.
 */
interface EngineeringValue {
  /** The visual icon component for the principle. */
  valueIcon: ReactNode;
  /** The high-level title of the engineering principle. */
  valueTitle: string;
  /** A deep description of the principle's impact on business logic. */
  valueDescription: string;
}

/**
 * AboutPage - Architected to provide a high-fidelity overview of UV Tech Solutions' 
 * global mission, engineering standards, and strategic alignment with enterprise nodes.
 * 
 * @returns {JSX.Element} The rendered enterprise overview section.
 */
export default function AboutPage() {
  
  /**
   * High-level performance KPIs demonstrating UV Tech's global footprint.
   */
  const reachMetrics: PerformanceMetric[] = [
    { 
      metricLabel: "Specialized Products", 
      metricValue: "3+", 
      metricIcon: <Settings className="w-5 h-5" /> 
    },
    { 
      metricLabel: "Native Support", 
      metricValue: "Enterprise Grade", 
      metricIcon: <Globe className="w-5 h-5 text-blue-500" /> 
    }
  ];

  /**
   * Foundation values that drive our localized software engineering strategy.
   */
  const foundationalPrinciples: EngineeringValue[] = [
    {
      valueIcon: <Cpu className="w-8 h-8" />,
      valueTitle: "Engineering Excellence",
      valueDescription: "Our architecture isn't just functional; it's optimized for the high-pressure environments of the hospitality and retail sectors."
    },
    {
      valueIcon: <Shield className="w-8 h-8" />,
      valueTitle: "Offline Reliability",
      valueDescription: "We understand that business doesn't stop when the internet does. Our ERPs are built for local resilience first."
    },
    {
      valueIcon: <Users className="w-8 h-8" />,
      valueTitle: "Strategic Partnership",
      valueDescription: "As an enterprise-first company, we aren't just vendors; we're your technological partners."
    }
  ];

  return (
    <div className="pb-20 lg:pb-32 bg-slate-white dark:bg-deep-charcoal text-deep-charcoal dark:text-slate-white transition-colors duration-300">
      
      {/* ─── Mission Narrative Section ────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-green/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-brand-green/10 text-brand-green rounded-full border border-brand-green/20">
              Our Visionary Core
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
              Engineering <br /> <span className="text-brand-green tracking-tighter">Mission-Critical Resilience.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed mb-12 font-medium">
              UV Tech Solutions engineers high-performance, offline software ecosystems designed for absolute reliability in hyper-local enterprise environments.
            </p>
          </motion.div>

          {/* Metric Blueprint Grid */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mt-16"
          >
            {reachMetrics.map((activeMetric, index) => (
              <div 
                key={index} 
                className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-8 rounded-3xl text-center group hover:border-brand-green/50 transition-all duration-300"
              >
                <div className="flex justify-center mb-4 text-brand-green group-hover:scale-110 transition-transform duration-300">
                  {activeMetric.metricIcon}
                </div>
                <div className="text-4xl font-black text-deep-charcoal dark:text-white mb-2">
                  {activeMetric.metricValue}
                </div>
                <div className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  {activeMetric.metricLabel}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Engineering Depth Section ────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Contextual Narrative */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase">
                Rooted in <span className="text-brand-green">Software Excellence.</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Founded to bridge the gap between world-class engineering standards and the specialized needs of global service industries. 
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed italic border-l-4 border-brand-green pl-6 py-2 bg-brand-green/5">
                With deep domain expertise in systems architecture, our team engineers robust products that scale seamlessly within local infrastructure boundaries.
              </p>
              
              <Link href="/services" className="inline-flex items-center gap-4 group cursor-pointer pt-4">
                <div className="w-16 h-16 rounded-full bg-brand-green/20 flex items-center justify-center text-brand-green group-hover:bg-brand-green group-hover:text-white transition-all duration-300 shadow-xl shadow-brand-green/10">
                  <Activity className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-xl uppercase tracking-tighter italic">Precision Driven</h4>
                  <p className="text-slate-500 text-sm">Deploying Core Enterprise Intelligence</p>
                </div>
              </Link>
            </motion.div>

            {/* Principles Architecture Grid */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {foundationalPrinciples.map((activePrinciple, index) => (
                <div 
                  key={index} 
                  className={`bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 p-8 rounded-3xl hover:shadow-xl hover:shadow-brand-green/5 hover:border-brand-green/30 transition-all duration-300 ${index === 2 ? 'sm:col-span-2' : ''}`}
                >
                  <div className="text-brand-green mb-6">{activePrinciple.valueIcon}</div>
                  <h3 className="text-xl font-extrabold mb-4 uppercase tracking-tighter">{activePrinciple.valueTitle}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{activePrinciple.valueDescription}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Global Call to Action ────────────────────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="bg-black text-white p-12 md:p-20 rounded-[3rem] text-center relative overflow-hidden shadow-2xl shadow-black/20">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-green/20 to-teal-500/20 opacity-40 mix-blend-overlay" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            
            <h2 className="text-4xl md:text-6xl font-black mb-8 relative z-10 uppercase tracking-tighter">Integrate our Intelligence.</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12 relative z-10 leading-relaxed">
              Join the growing network of global enterprises that trust UV Tech Solutions for their mission-critical operations.
            </p>
            <div className="flex flex-wrap justify-center gap-6 relative z-10">
               <Link 
                 href="/contact"
                 className="px-10 py-5 bg-brand-green hover:bg-lime-500 text-white font-black rounded-2xl transition-all hover:scale-105 hover:-translate-y-1 shadow-lg shadow-brand-green/30 uppercase tracking-widest text-xs"
               >
                  Consultation
               </Link>
               <Link 
                 href="/products"
                 className="px-10 py-5 bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 text-white font-black rounded-2xl transition-all hover:scale-105 hover:-translate-y-1 uppercase tracking-widest text-xs"
               >
                  Product Catalog
               </Link>
            </div>
         </div>
      </section>
    </div>
  );
}

