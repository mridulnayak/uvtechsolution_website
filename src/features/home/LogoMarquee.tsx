"use client";

import { useState, useEffect } from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { synchronizeClientPortfolio } from "@/lib/cms";

/**
 * Enterprise client record structure.
 */
interface ClientRecord {
  name: string;
  logo?: string;
  url?: string;
}

/**
 * An infinite marquee component displaying the active client portfolio.
 * Utilizes CSS animations for performant continuous horizontal scrolling, 
 * populated dynamically from the Supabase CMS.
 */
export function LogoMarquee() {
  const [activeClients, setActiveClients] = useState<ClientRecord[]>([]);

  useEffect(() => {
    /**
     * Retrieves and processes the global client list for the marquee display.
     */
    async function fetchAndPopulateClients() {
      try {
        const clientDataPayload = await synchronizeClientPortfolio();
        if (clientDataPayload && clientDataPayload.length > 0) {
          setActiveClients(clientDataPayload);
        }
      } catch (networkError) {
        console.error("Failed to load client references:", networkError);
      }
    }
    fetchAndPopulateClients();
  }, []);

  // Standardize the dataset to ensure a seamless CSS loop
  // If the active database is empty, fallback to the default company messaging
  const loopedClientDataset = activeClients.length > 0 
    ? [...activeClients, ...activeClients] 
    : [
        { name: "Join our growing list of 100+ clients across Raipur." }, 
        { name: "Join our growing list of 100+ clients across Raipur." }
      ];

  return (
    <section id="logo-marquee" className="py-12 bg-[#050505] overflow-hidden border-y border-white/5 transition-colors duration-300">
      <div className="relative">
        <div className="flex animate-marquee whitespace-nowrap" aria-label="Our Trusted Enterprise Clients">
          {loopedClientDataset.map((clientData, index) => (
            <div
              key={index}
              className="mx-12 text-2xl md:text-3xl font-bold text-slate-400 hover:text-brand-green transition-colors cursor-default"
            >
              <span>{clientData.name}</span>
            </div>
          ))}
        </div>

        {/* Note: The animate-marquee keyframes reside in globals.css to bypass styled-jsx hydration mismatches */}

        {/* Subtle gradient masks for smooth edge fade-out transitions */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
}
