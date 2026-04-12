"use client";

import React, { ElementType } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { Logo } from "@/components/global/Logo";
import { motion } from "framer-motion";

/**
 * Custom SVG component for the LinkedIn brand icon.
 */
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-5 h-5">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

/**
 * Interface representing a social platform entry in the footer.
 */
interface FooterSocialPlatform {
  name: string;
  icon: ElementType;
  href: string;
  hoverColor: string;
}

/**
 * Interface representing a navigation link entry in the footer columns.
 */
interface FooterNavigationLink {
  label: string;
  path: string;
}

/**
 * The global application footer providing brand identity, structural navigation, 
 * contact details, and core operational messaging for the enterprise platform.
 */
export function Footer() {
  const footerSocialPlatforms: FooterSocialPlatform[] = [
    { 
      name: "LinkedIn", 
      icon: LinkedInIcon, 
      href: "https://www.linkedin.com/company/uv-tech-solutions/", 
      hoverColor: "hover:text-brand-green" 
    },
    { 
      name: "WhatsApp", 
      icon: MessageCircle, 
      href: "https://wa.me/919981679797", 
      hoverColor: "hover:text-[#25D366]" 
    }
  ];

  const capabilityPillars = [
    "Enterprise ERP", 
    "Local Implementation", 
    "Infrastructure Resilience", 
    "Custom Engineering"
  ];

  const primaryCompanyLinks: FooterNavigationLink[] = [
    { label: "About Us", path: "/about" },
    { label: "Tech Blog", path: "/blog" },
    { label: "Contact", path: "/contact" },
    { label: "Join Our Team", path: "/careers" }
  ];

  return (
    <footer id="global-footer" className="bg-[#050505] text-white border-t border-white/5 selection:bg-brand-green/30 px-4 md:px-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Column 1: Brand & Identity */}
          <section className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-8 group -ml-2">
              <div className="relative">
                <Image
                  src="/images/logos/logo.png"
                  alt="UV Tech Solutions Branding Logo"
                  width={140}
                  height={48}
                  className="object-contain group-hover:scale-105 transition-transform opacity-0 data-[loaded=true]:opacity-100"
                  onLoad={(loadEvent) => (loadEvent.target as HTMLImageElement).setAttribute("data-loaded", "true")}
                  onError={(errorEvent) => {
                    (errorEvent.target as HTMLImageElement).style.display = 'none';
                    const svgFallbackElement = (errorEvent.target as HTMLElement).parentElement?.querySelector('.logo-fallback');
                    if (svgFallbackElement) svgFallbackElement.classList.remove('hidden');
                  }}
                />
                <div className="logo-fallback hidden">
                  <Logo className="w-12 h-12 text-brand-green" />
                </div>
              </div>
            </Link>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed font-semibold">
              Engineering high-performance, offline software ecosystems designed for mission-critical reliability in local enterprise environments.
            </p>
            <nav className="flex space-x-4">
              {footerSocialPlatforms.map((platform) => (
                <motion.a
                  key={platform.name}
                  href={platform.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className={`text-slate-500 ${platform.hoverColor} transition-colors p-2 rounded-xl bg-white/5 ring-1 ring-white/10`}
                  aria-label={`Connect with us on ${platform.name}`}
                >
                  <platform.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </nav>
          </section>

          {/* Column 2: Capabilities Ecosystem */}
          <nav aria-labelledby="footer-capabilities-heading">
            <h3 id="footer-capabilities-heading" className="text-xs font-black text-brand-green tracking-widest uppercase mb-8">Capabilities</h3>
            <ul className="space-y-4">
              {capabilityPillars.map((capabilityItem, capabilityIndex) => (
                <li key={capabilityIndex}>
                  <Link href="/services" className="text-sm text-slate-400 hover:text-brand-green transition-colors font-medium">
                    {capabilityItem}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 3: Global Organization */}
          <nav aria-labelledby="footer-company-heading">
            <h3 id="footer-company-heading" className="text-xs font-black text-brand-green tracking-widest uppercase mb-8">Company</h3>
            <ul className="space-y-4">
              {primaryCompanyLinks.map((navigationLink, navigationIndex) => (
                <li key={navigationIndex}>
                  <Link 
                    href={navigationLink.path} 
                    className="text-sm text-slate-400 hover:text-brand-green transition-colors font-bold uppercase tracking-wider text-[11px]"
                  >
                    {navigationLink.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 4: Communication Support */}
          <section aria-labelledby="footer-contact-heading">
            <h3 id="footer-contact-heading" className="text-xs font-black text-brand-green tracking-widest uppercase mb-8">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-brand-green" />
                <a href="mailto:support@uvtechsolutions.in" className="font-medium text-slate-200 hover:text-brand-green transition-colors">
                  support@uvtechsolutions.in
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Phone className="w-4 h-4 text-brand-green" />
                <span className="font-medium">+91-771-2274930 (Global HQ)</span>
              </li>
              <li className="mt-8 p-6 bg-white/5 border border-white/10 rounded-3xl">
                <span className="block font-black text-brand-green mb-2 tracking-widest uppercase text-[10px]">Global Operations</span>
                <span className="text-xs text-slate-300 leading-relaxed font-medium">
                  Distributed Engineering Teams<br />
                  Worldwide Support Infrastructure
                </span>
              </li>
            </ul>
          </section>
        </div>

        {/* Global Copyright & Legal Footer */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
            © {new Date().getFullYear()} UV Tech Solutions. Infrastructure for the Infinite Enterprise.
          </p>
          <nav className="flex gap-6" aria-label="Legal navigation">
            <Link href="/privacy-policy" className="text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:text-brand-green transition-colors">
              Privacy
            </Link>
            <Link href="/terms-of-service" className="text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:text-brand-green transition-colors">
              Terms
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
