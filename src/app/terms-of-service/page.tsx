import Link from 'next/link';
import { Scale, FileWarning, HelpCircle, ArrowLeft, Terminal } from 'lucide-react';
import { ScrollReveal } from "@/components/ui/ScrollReveal";

/**
 * Enterprise metadata for Search Engine Optimization and service transparency.
 */
export const metadata = {
    title: "Service Terms | UV Tech Solutions",
    description: "Operational guidelines and mission-critical service level agreements for UV Tech Solutions' enterprise clients."
};

/**
 * TermsOfServicePage - Outlines the operational framework and service level 
 * agreements (SLAs) for the UV Tech Solutions ecosystem.
 * Formatted for executive clarity and engineering transparency.
 * 
 * @returns {JSX.Element} The rendered terms of service page.
 */
export default function TermsOfServicePage() {
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
                            Service Agreement v2.1.0
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black leading-none mb-6 tracking-tighter uppercase italic">
                            Service <span className="text-brand-green not-italic">Terms.</span>
                        </h1>
                        <p className="text-xl text-gray-500 italic max-w-2xl">
                            Defining the operational parameters for high-fidelity technical implementation.
                        </p>
                    </header>
                </ScrollReveal>

                <div className="space-y-20">
                    
                    {/* Section 1: Execution Framework */}
                    <ScrollReveal>
                        <section className="relative pl-12">
                            <div className="absolute left-0 top-0 w-8 h-8 rounded-xl bg-brand-green/10 flex items-center justify-center border border-brand-green/20">
                                <Scale className="w-4 h-4 text-brand-green" />
                            </div>
                            <h2 className="text-xl font-black mb-6 uppercase tracking-widest text-white">01. Service Execution Framework</h2>
                            <div className="space-y-6 text-lg text-gray-500 font-medium leading-relaxed italic border-l-2 border-brand-green/20 pl-8">
                                <p>
                                    By initiating deployment of UV Tech Solutions modules (including Hoteleo and Restpro ecosystems), you acknowledge and agree to our operational framework. These terms govern the technical implementation and maintenance cycles of your enterprise architecture.
                                </p>
                            </div>
                        </section>
                    </ScrollReveal>

                    {/* Section 2: Liability & Risk */}
                    <ScrollReveal>
                        <section className="relative pl-12">
                            <div className="absolute left-0 top-0 w-8 h-8 rounded-xl bg-brand-green/10 flex items-center justify-center border border-brand-green/20">
                                <FileWarning className="w-4 h-4 text-brand-green" />
                            </div>
                            <h2 className="text-xl font-black mb-6 uppercase tracking-widest text-white">02. Liability Boundary Conditions</h2>
                            <div className="space-y-6 text-lg text-gray-500 font-medium leading-relaxed italic border-l-2 border-brand-green/20 pl-8">
                                <p>
                                    UV Tech Solutions operates as a mission-critical service provider. We are not liable for incidental business downtime during scheduled system maintenance, node migrations, or required security patches. Our commitment is to maximize uptime through redundant engineering.
                                </p>
                            </div>
                        </section>
                    </ScrollReveal>

                    {/* Section 3: SLA & Diagnostics */}
                    <ScrollReveal>
                        <section className="relative pl-12">
                            <div className="absolute left-0 top-0 w-8 h-8 rounded-xl bg-brand-green/10 flex items-center justify-center border border-brand-green/20">
                                <HelpCircle className="w-4 h-4 text-brand-green" />
                            </div>
                            <h2 className="text-xl font-black mb-6 uppercase tracking-widest text-white">03. Support Tier Diagnostics</h2>
                            <div className="space-y-6 text-lg text-gray-500 font-medium leading-relaxed italic border-l-2 border-brand-green/20 pl-8">
                                <p>
                                    Technical support and onsite implementation are executed based on the selected Service Level Agreement (SLA). Priority diagnostics are reserved for enterprise-tier nodes with active operational contracts.
                                </p>
                            </div>
                        </section>
                    </ScrollReveal>

                    {/* Footer Metadata */}
                    <footer className="pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-4 text-brand-green">
                            <Terminal className="w-5 h-5" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 italic">
                                Technical Standards Compliant
                            </p>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">
                            System Node: UV-TERMINAL-01 | Global Reach
                        </p>
                    </footer>

                </div>
            </article>
        </div>
    );
}


