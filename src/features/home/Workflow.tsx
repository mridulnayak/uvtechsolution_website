"use client";

import { Search, MessageSquare, PackageCheck, ArrowRight, LucideIcon } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

/**
 * Defines the structure for an individual step in the enterprise implementation pipeline.
 */
interface ImplementationStep {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Tailwind text color class for the icon */
  colorClass: string;
  /** Tailwind background color class for the icon container */
  backgroundClass: string;
}

// Global configuration for the hybrid workflow pipeline
const CORE_IMPLEMENTATION_STEPS: ImplementationStep[] = [
  {
    icon: Search,
    title: "Discover",
    description: "Browse our enterprise solutions and precision-engineered products.",
    colorClass: "text-blue-500",
    backgroundClass: "bg-blue-500/10",
  },
  {
    icon: MessageSquare,
    title: "Consult",
    description: "Chat with our Gemini AI Ambassador or visit us in person for a direct consultation.",
    colorClass: "text-brand-green",
    backgroundClass: "bg-brand-green/10",
  },
  {
    icon: PackageCheck,
    title: "Deploy",
    description: "Experience professional offline setup and local hardware implementation handled by experts.",
    colorClass: "text-amber-500",
    backgroundClass: "bg-amber-500/10",
  },
];

/**
 * A highly visual, step-by-step pipeline component illustrating the UV Tech onboarding process.
 * Bridges the digital SaaS experience with the physical, offline deployment reality.
 */
export function Workflow() {
  const activeEnterprisePartnersCount = 50;

  return (
    <section id="hybrid-workflow" className="py-24 bg-white dark:bg-deep-charcoal transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              The Enterprise <span className="text-brand-green">Implementation</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Bridging the digital and physical worlds for a seamless service experience.
            </p>
          </div>
        </ScrollReveal>

        <div className="relative">
          {/* Connector line mapping the pipeline (desktop viewport only) */}
          <div className="hidden lg:block absolute top-12 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent z-0" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
            {CORE_IMPLEMENTATION_STEPS.map((pipelineStep, stepIndex) => (
              <ScrollReveal key={stepIndex} entranceDelay={stepIndex * 0.15}>
                <div className="flex flex-col items-center text-center">
                  <div className={`w-24 h-24 ${pipelineStep.backgroundClass} rounded-3xl flex items-center justify-center mb-8 relative group transition-all duration-300 hover:scale-110`}>
                     <pipelineStep.icon className={`w-10 h-10 ${pipelineStep.colorClass}`} />
                     
                     {/* Directional arrow connecting linear steps */}
                     {stepIndex < CORE_IMPLEMENTATION_STEPS.length - 1 && (
                        <div className="hidden lg:block absolute -right-6 top-1/2 -translate-y-1/2 text-gray-300">
                           <ArrowRight className="w-6 h-6" />
                        </div>
                     )}
                     
                     {/* Hover glow effect */}
                     <div className="absolute -inset-2 bg-gradient-to-r from-brand-green/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-deep-charcoal dark:text-slate-white">
                    {pipelineStep.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-[280px]">
                    {pipelineStep.description}
                  </p>
                  
                  {/* Final Step Call-to-Action Indicator */}
                  {stepIndex === 2 && (
                    <div className="mt-6 px-4 py-2 bg-amber-500/10 rounded-full text-amber-600 dark:text-amber-400 text-sm font-semibold flex items-center gap-2 border border-amber-500/20 shadow-sm">
                       <span className="relative flex h-2 w-2">
                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                         <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                       </span>
                       Join {activeEnterprisePartnersCount}+ Active Enterprise Partners
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
