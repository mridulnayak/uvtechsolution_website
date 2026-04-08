"use client";

import React, { useState, useEffect, useCallback, ElementType } from "react";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import Link from "next/link";
import { 
  ArrowRight, 
  Code2, 
  Globe, 
  Cloud, 
  Network, 
  BarChart4, 
  Server,
  Settings,
  ShieldCheck,
  Cpu,
  Database
} from "lucide-react";
import { synchronizeActiveServices } from "@/lib/cms";

/**
 * Interface representing the structure of a single service offering.
 */
interface Service {
  id: string | number;
  title: string;
  description: string;
  icon: ElementType;
  icon_name?: string;
  accent: string;
  bg: string;
}

// --- CUSTOM ICONS ---

/**
 * Custom Zap/Energy icon component.
 * @param props - SVG attributes to apply to the icon.
 */
const ZapIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    viewBox="0 0 24 24" 
    width="24" 
    height="24" 
    stroke="currentColor" 
    strokeWidth="2" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

// --- CORE SERVICES (User provided 10 Pillars) ---

/**
 * Default service offerings used as fallbacks when live data is unavailable.
 */
const SERVICE_FALLBACKS: Service[] = [
  {
    id: "it-consulting",
    title: "IT Consulting",
    description: "Strategic advice to align your technology roadmap with mission-critical operational benchmarks.",
    icon: Settings,
    accent: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    id: "network-support",
    title: "Network Support",
    description: "Maintenance and proactive health-checks for enterprise-grade network architectures.",
    icon: ZapIcon,
    accent: "text-brand-green",
    bg: "bg-brand-green/10",
  },
  {
    id: "computer-networking",
    title: "Computer Networking",
    description: "Professional configuration of local area networks for hotels, restaurants, and retail setups.",
    icon: Network,
    accent: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    id: "custom-software",
    title: "Custom Software Development",
    description: "Bespoke engineering for Hoteleo/Restpro modules and specialized corporate dashboards.",
    icon: Code2,
    accent: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    id: "app-dev",
    title: "Application Development",
    description: "Lifecycle development of cross-platform apps for retail billing and customer outreach.",
    icon: Cpu,
    accent: "text-sky-500",
    bg: "bg-sky-500/10",
  },
  {
    id: "web-design",
    title: "Web Design",
    description: "High-end visual architecture for global enterprise digital presences.",
    icon: Cloud,
    accent: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    id: "web-dev",
    title: "Enterprise Solutions",
    description: "Rapid delivery of high-performance internal tools and local enterprise portals.",
    icon: Globe,
    accent: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    id: "tech-support",
    title: "Technical Support",
    description: "Industry-leading AMC support to ensure uptime and near-zero latency for our products.",
    icon: ShieldCheck,
    accent: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    id: "ecm",
    title: "Enterprise Content Management",
    description: "Secure synchronization of hotel and inventory data across local infrastructure nodes.",
    icon: Database,
    accent: "text-pink-500",
    bg: "bg-pink-500/10",
  },
  {
    id: "analytics",
    title: "Business Analytics",
    description: "Data-driven insights to optimize your retail and hospitality throughput.",
    icon: BarChart4,
    accent: "text-slate-500",
    bg: "bg-slate-500/10",
  }
];

/**
 * Mapping of string identifiers to Lucide icon components for dynamic service resolution.
 */
const ICON_COMPONENT_MAP: Record<string, ElementType> = {
  Settings, 
  Database, 
  Zap: ZapIcon, 
  Code2, 
  ShieldCheck, 
  Cpu, 
  Globe, 
  Cloud, 
  Network, 
  BarChart4, 
  Server
};

export default function ServicesPage() {
  const [activeServices, setActiveServices] = useState<Service[]>(SERVICE_FALLBACKS);

  useEffect(() => {
    /**
     * Synchronizes local services state with the database, applying branding theme to dynamic rows.
     */
    async function synchronizeServices() {
      try {
        const databaseServices = await synchronizeActiveServices();
        
        if (databaseServices && databaseServices.length > 0) {
          // Map raw database fields to the application's visual UI components
          const processedServices = databaseServices.map((serviceItem: any): Service => ({
            ...serviceItem,
            icon: typeof serviceItem.icon === 'function' 
              ? serviceItem.icon 
              : (ICON_COMPONENT_MAP[serviceItem.icon_name || serviceItem.icon] || Code2),
            bg: serviceItem.bg || "bg-brand-green/10",
            accent: serviceItem.accent || "text-brand-green"
          }));
          
          // Ensure the layout remains consistent by padding with fallbacks if fewer than 10 items exist
          const combinedServicesList = processedServices.length >= 10 
            ? processedServices 
            : [...processedServices, ...SERVICE_FALLBACKS.slice(processedServices.length)];
          
          setActiveServices(combinedServicesList);
        }
      } catch (error) {
        // Silently fallback to predefined services if database is unreachable
        setActiveServices(SERVICE_FALLBACKS);
      }
    }
    synchronizeServices();
  }, []);

  return (
    <div className="bg-slate-white dark:bg-[#0a0f12] text-deep-charcoal dark:text-white min-h-screen pt-32 pb-24 transition-colors duration-300">
      
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[-5%] w-[40rem] h-[40rem] bg-brand-green/10 rounded-full blur-[120px] opacity-20" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[35rem] h-[35rem] bg-indigo-500/10 rounded-full blur-[100px] opacity-10" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <ScrollReveal>
          <header className="mb-20">
            <span className="inline-block px-4 py-1 mb-6 text-[10px] font-black uppercase tracking-widest text-brand-green border border-brand-green/30 rounded-full bg-brand-green/5">
              Service Ecosystem
            </span>
            <h1 className="fluid-h1 font-black mb-8">
              Strategic <br />
              <span className="italic text-brand-green">Capabilities.</span>
            </h1>
            <p className="max-w-xl text-lg md:text-xl text-gray-500 dark:text-slate-400 font-medium leading-relaxed">
              We provide enterprise-grade IT solutions specialized for hospitality, retail, and modern infrastructure engineering.
            </p>
          </header>
        </ScrollReveal>

        {/* Global Service Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {activeServices.map((service, serviceIndex) => {
            const ServiceIcon = service.icon || Code2;
            const isWideLayout = serviceIndex === 3 || serviceIndex === 8; // Emphasize high-value pillars in the grid
            
            return (
              <ScrollReveal key={service.id || serviceIndex} entranceDelay={serviceIndex * 0.05}>
                <section 
                  className={`group relative h-full bg-white dark:bg-[#080808] border border-gray-100 dark:border-white/5 p-8 rounded-3xl transition-all duration-300 hover:border-brand-green/40 hover:shadow-2xl hover:shadow-brand-green/10 inner-glow flex flex-col ${
                    isWideLayout ? "lg:col-span-2" : "col-span-1"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl ${service.bg} ${service.accent} flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform`}>
                    <ServiceIcon className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-bold mb-4 tracking-tight group-hover:text-brand-green transition-colors uppercase">
                    {service.title}
                  </h3>

                  <p className="text-gray-500 dark:text-slate-400 text-sm font-medium leading-relaxed mb-8 flex-grow">
                    {service.description}
                  </p>

                  <Link 
                    href="/contact" 
                    className="mt-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-brand-green transition-colors"
                  >
                    Acquire Support <ArrowRight className="w-3 h-3" />
                  </Link>

                  {/* Decorative index numbering */}
                  <div className="absolute top-4 right-8 opacity-0 group-hover:opacity-20 transition-opacity">
                    <span className="text-4xl font-black italic select-none">{(serviceIndex + 1).toString().padStart(2, '0')}</span>
                  </div>
                </section>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Future Capabilities Teaser Section */}
        <ScrollReveal>
          <div className="mt-32 p-12 bg-white dark:bg-[#080808] border border-gray-100 dark:border-white/5 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
              <Cpu className="w-64 h-64 rotate-12" />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/10 text-brand-green text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                Infrastructure Phase II
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-6 uppercase tracking-tighter">
                Edge Diagnostic Integration <span className="text-gray-400 font-medium">(Coming Soon)</span>
              </h2>
              <p className="max-w-2xl text-lg text-gray-500 dark:text-slate-400 font-medium leading-relaxed mb-8">
                Next-generation hardware telemetry and remote diagnostic heartbeats for offline nodes. Currently in private R&D for elite infrastructure partners.
              </p>
              <div className="flex gap-4">
                <div className="px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Private Beta
                </div>
                <div className="px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Enterprise Only
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Final CTA Section */}
        <ScrollReveal>
          <footer className="mt-32 pt-20 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tighter uppercase italic leading-[1.1]">
                Mission-Critical <br /> 
                <span className="text-brand-green">Engineering.</span>
              </h2>
              <p className="text-lg text-gray-500 dark:text-slate-400 font-medium">
                UV Tech Solutions doesn't just deploy—we engineer the resilience your business demands.
              </p>
            </div>
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-4 px-12 py-6 rounded-2xl bg-brand-green text-white font-black hover:scale-105 transition-all shadow-xl shadow-brand-green/30 uppercase tracking-widest text-[10px] italic"
            >
              Book Consultation <ArrowRight className="w-4 h-4" />
            </Link>
          </footer>
        </ScrollReveal>
      </div>
    </div>
  );
}
