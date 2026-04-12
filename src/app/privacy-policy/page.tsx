import Link from 'next/link';
import { Shield, Lock, Eye, Server, ArrowLeft } from 'lucide-react';
import { ScrollReveal } from "@/components/ui/ScrollReveal";

/**
 * Enterprise metadata for Search Engine Optimization and compliance.
 */
export const metadata = {
  title: "Privacy Governance | UV Tech Solutions",
  description: "Governance protocols and data protection standards for UV Tech Solutions' global enterprise ecosystem."
};

/**
 * PrivacyPolicyPage - A high-fidelity governance document outlining the 
 * data protection protocols and security standards of UV Tech Solutions.
 * Designed with the enterprise standard for clarity and mission-critical transparency.
 * 
 * @returns {JSX.Element} The rendered privacy governance page.
 */
export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-deep-charcoal text-slate-white font-sans py-32 px-4 sm:px-6">
      <article className="max-w-4xl mx-auto">
        
        {/* Navigation Layer */}
        <Link 
          href="/" 
          className="group inline-flex items-center gap-2 text-gray-500 hover:text-brand-green text-[10px] uppercase font-black tracking-widest mb-16 transition-all"
        >
          <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
          Execution Hub
        </Link>
        
        <ScrollReveal>
          <header className="mb-20 border-b border-white/5 pb-12">
            <span className="inline-block px-4 py-1 mb-6 text-[10px] font-black tracking-widest uppercase bg-brand-green/10 text-brand-green rounded-full border border-brand-green/20">
              Governance Protocol v4.0.1
            </span>
            <h1 className="text-4xl md:text-6xl font-black leading-none mb-6 tracking-tighter uppercase italic">
              Privacy <span className="text-brand-green not-italic">Governance.</span>
            </h1>
            <p className="text-xl text-gray-500 italic max-w-2xl">
              Architecting mission-critical data protection for the modern enterprise ecosystem.
            </p>
          </header>
        </ScrollReveal>

        <div className="space-y-20">
          
          {/* Section 1: Extraction & Identity */}
          <ScrollReveal>
            <section className="relative pl-12">
              <div className="absolute left-0 top-0 w-8 h-8 rounded-xl bg-brand-green/10 flex items-center justify-center border border-brand-green/20">
                <Eye className="w-4 h-4 text-brand-green" />
              </div>
              <h2 className="text-xl font-black mb-6 uppercase tracking-widest text-white">01. Data Extraction Pipeline</h2>
              <div className="space-y-6 text-lg text-gray-500 font-medium leading-relaxed italic border-l-2 border-brand-green/20 pl-8">
                <p>
                  Our system architecture extracts minimal identity markers required to maintain high-fidelity enterprise service delivery. This includes personnel names, communication nodes, and organizational hashes.
                </p>
                <ul className="space-y-2 list-none">
                  <li className="flex items-center gap-3 text-sm font-black uppercase tracking-widest not-italic text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-green" /> Identity Metadata
                  </li>
                  <li className="flex items-center gap-3 text-sm font-black uppercase tracking-widest not-italic text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-green" /> Service Delivery Logs
                  </li>
                  <li className="flex items-center gap-3 text-sm font-black uppercase tracking-widest not-italic text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-green" /> Diagnostic Trace Data
                  </li>
                </ul>
              </div>
            </section>
          </ScrollReveal>

          {/* Section 2: Utilization Logic */}
          <ScrollReveal>
            <section className="relative pl-12">
              <div className="absolute left-0 top-0 w-8 h-8 rounded-xl bg-brand-green/10 flex items-center justify-center border border-brand-green/20">
                <Server className="w-4 h-4 text-brand-green" />
              </div>
              <h2 className="text-xl font-black mb-6 uppercase tracking-widest text-white">02. Operational Payload Utilization</h2>
              <div className="space-y-6 text-lg text-gray-500 font-medium leading-relaxed italic border-l-2 border-brand-green/20 pl-8">
                <p>
                  Extracted data is utilized exclusively for service synchronization and proactive technical support. We maintain a zero-monetization policy for user data; your business intelligence remains your sovereign property.
                </p>
              </div>
            </section>
          </ScrollReveal>

          {/* Section 3: Security Invariants */}
          <ScrollReveal>
            <section className="relative pl-12">
              <div className="absolute left-0 top-0 w-8 h-8 rounded-xl bg-brand-green/10 flex items-center justify-center border border-brand-green/20">
                <Lock className="w-4 h-4 text-brand-green" />
              </div>
              <h2 className="text-xl font-black mb-6 uppercase tracking-widest text-white">03. Security Invariants</h2>
              <div className="space-y-6 text-lg text-gray-500 font-medium leading-relaxed italic border-l-2 border-brand-green/20 pl-8">
                <p>
                  All data streams are secured using high-fidelity encryption protocols (AES-256 at rest, TLS 1.3 in transit). UV Tech maintains mission-critical redundancy across distributed storage nodes to ensure data persistence and availability.
                </p>
              </div>
            </section>
          </ScrollReveal>

          {/* Footer Metadata */}
          <footer className="pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4">
              <Shield className="w-6 h-6 text-brand-green" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 italic">
                Verified Enterprise Security
              </p>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">
              Effective Date: 2026.04.01 | Revision: Alpha-Node
            </p>
          </footer>

        </div>
      </article>
    </div>
  );
}


