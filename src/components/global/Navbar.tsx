"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/global/ThemeToggle";
import { Logo } from "@/components/global/Logo";

/**
 * Global navigation links for the primary site architecture.
 */
const APPLICATION_NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Products", href: "/products" },
  { name: "About Us", href: "/about" },
  { name: "Tech Blog", href: "/blog" },
];

/**
 * The global navigation bar component.
 * Manages sticky scroll states, active route highlighting, and a responsive mobile menu toggle.
 */
export function Navbar() {
  const [hasUserScrolled, setHasUserScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentPathname = usePathname();

  useEffect(() => {
    /**
     * Updates the scrolled state when the user moves past a specific pixel threshold.
     */
    const handleNavigationScrollPosition = () => {
      setHasUserScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleNavigationScrollPosition, { passive: true });
    return () => window.removeEventListener("scroll", handleNavigationScrollPosition);
  }, []);

  /**
   * Closes the mobile navigation menu on route transitions.
   */
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentPathname]);

  /**
   * Toggles the visibility state of the mobile-specific navigation overlay.
   */
  const toggleMobileNavigation = useCallback(() => {
    setIsMobileMenuOpen((previousState) => !previousState);
  }, []);

  return (
    <header
      id="global-navbar"
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 border-b",
        hasUserScrolled
          ? "bg-[#0a0f12]/80 dark:bg-[#050505]/80 backdrop-blur-md border-slate-800 dark:border-white/10 shadow-lg"
          : "bg-transparent border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Brand Identity / Logo Slot */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Image 
                src="/images/logos/logo.png" 
                alt="UV Tech Solutions Navigation Logo" 
                width={120} 
                height={40} 
                className="object-contain group-hover:scale-105 transition-transform opacity-0 data-[loaded=true]:opacity-100"
                priority
                onLoad={(loadEvent) => (loadEvent.target as HTMLImageElement).setAttribute("data-loaded", "true")}
                onError={(errorEvent) => {
                  (errorEvent.target as HTMLImageElement).style.display = 'none';
                  const svgFallbackElement = (errorEvent.target as HTMLElement).parentElement?.querySelector('.logo-fallback');
                  if (svgFallbackElement) svgFallbackElement.classList.remove('hidden');
                }}
              />
              <div className="logo-fallback hidden">
                 <Logo className="w-10 h-10 text-brand-green" />
              </div>
            </div>
          </Link>

          {/* Desktop Adaptive Navigation Menu */}
          <nav className="hidden md:flex space-x-8" aria-label="Desktop Global Navigation">
            {APPLICATION_NAV_LINKS.map((navigationLink) => {
              const isCurrentRoute = currentPathname === navigationLink.href;
              return (
                <Link
                  key={navigationLink.name}
                  href={navigationLink.href}
                  className={cn(
                    "relative px-1 py-2 transition-colors",
                    isCurrentRoute
                      ? "text-brand-green"
                      : "text-slate-900 dark:text-slate-100 hover:text-brand-green"
                  )}
                >
                  <span className="relative z-10 font-bold uppercase tracking-widest text-[10px] sm:text-xs">
                    {navigationLink.name}
                  </span>
                  {isCurrentRoute && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-green"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Navigational Utilities & Global Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />

            <Link
              href="/careers"
              className="text-brand-green border border-brand-green/30 hover:border-brand-green bg-brand-green/5 hover:bg-brand-green/10 px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all hover:shadow-[0_0_15px_rgba(143,203,39,0.2)]"
            >
              Join Our Team
            </Link>
            <Link
              href="/contact"
              className="bg-brand-green text-white px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-lime-600 transition-all shadow-lg shadow-brand-green/20"
            >
              Consult Now
            </Link>
          </div>

          {/* Mobile Utility Row (Visible on smaller viewports) */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={toggleMobileNavigation}
              className="text-gray-600 dark:text-gray-300 hover:text-brand-green p-2 transition-colors"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle mobile navigation menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-deep-charcoal border-b border-gray-100 dark:border-white/5 overflow-hidden"
            aria-label="Mobile Global Navigation"
          >
            <div className="flex flex-col px-4 pt-2 pb-6 space-y-1">
              {APPLICATION_NAV_LINKS.map((navigationLink) => {
                const isCurrentRoute = currentPathname === navigationLink.href;
                return (
                  <Link
                    key={navigationLink.name}
                    href={navigationLink.href}
                    className={cn(
                      "px-4 py-3 rounded-lg text-base font-medium transition-colors",
                      isCurrentRoute
                        ? "bg-brand-green/10 text-brand-green"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                    )}
                  >
                    {navigationLink.name}
                  </Link>
                );
              })}
              
              {/* Mobile Primary Actions */}
              <div className="pt-4 pb-2 px-4 space-y-3">
                <Link
                  href="/careers"
                  className="block w-full text-center text-brand-green border border-brand-green/20 bg-brand-green/5 px-5 py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-all"
                >
                  Join Our Team
                </Link>
                <Link
                  href="/contact"
                  className="block w-full text-center bg-brand-green text-white px-5 py-3 rounded-xl font-bold uppercase tracking-wider text-sm shadow-lg shadow-brand-green/20"
                >
                  Consult Now
                </Link>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
