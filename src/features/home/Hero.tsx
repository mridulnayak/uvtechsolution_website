"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCTS } from "@/lib/constants";
import { synchronizeSiteConfig } from "@/lib/cms";

// Flatten product screenshots into a continuous master showcase array
const GLOBAL_SHOWCASE_ASSETS = PRODUCTS.flatMap(productMeta => productMeta.screenshots);

/**
 * Core interface for the hero's dynamic configuration from Supabase.
 */
interface HeroConfiguration {
  headline: string;
  subtext: string;
  badge: string;
}

/**
 * The primary visual and interactive entry point of the UV Tech website.
 * Features a dynamic headline system and an interactive, animated gallery 
 * of core product screenshots over a blurred structural background.
 */
export function Hero() {
  const [dynamicSiteConfig, setDynamicSiteConfig] = useState<HeroConfiguration | null>(null);
  const [activeAssetIndex, setActiveAssetIndex] = useState(0);
  const [isGalleryExpanded, setIsGalleryExpanded] = useState(false);
  const [slideDirection, setSlideDirection] = useState(0); 

  useEffect(() => {
    /**
     * Bootstraps the hero messaging by pulling legacy or active site config from Supabase.
     */
    async function initializeHeroConfiguration() {
      const dbConfigPayload = await synchronizeSiteConfig();
      if (dbConfigPayload) {
        // Normalize CMS payload inconsistencies across legacy and active tables
        const normalizedConfiguration: HeroConfiguration = {
          headline: dbConfigPayload.hero_headline || dbConfigPayload.hero_title || dbConfigPayload.title,
          subtext: dbConfigPayload.hero_subtext || dbConfigPayload.hero_subtitle || dbConfigPayload.subtitle,
          badge: dbConfigPayload.hero_badge || dbConfigPayload.badge || "Empowering Your Business"
        };
        setDynamicSiteConfig(normalizedConfiguration);
      }
    }
    initializeHeroConfiguration();
  }, []);

  /**
   * Paginates the interactive hero gallery.
   * @param offsetDirection The numerical direction (-1 for previous, 1 for next).
   */
  const handleGalleryPagination = useCallback((offsetDirection: number) => {
    setSlideDirection(offsetDirection);
    setActiveAssetIndex((previousIndex) => 
      (previousIndex + offsetDirection + GLOBAL_SHOWCASE_ASSETS.length) % GLOBAL_SHOWCASE_ASSETS.length
    );
  }, []);

  // Automate the gallery sliding unless the user expands the asset into full-screen view
  useEffect(() => {
    const defaultAutoplayInterval = setInterval(() => {
      if (!isGalleryExpanded) handleGalleryPagination(1);
    }, 5000);
    return () => clearInterval(defaultAutoplayInterval);
  }, [isGalleryExpanded, handleGalleryPagination]);

  // Framer Motion transition maps for the gallery injection and exit
  const gallerySlideVariants = {
    slideInFromSide: (directionIndicator: number) => ({ x: directionIndicator > 0 ? 500 : -500, opacity: 0 }),
    centerFocus: { zIndex: 1, x: 0, opacity: 1 },
    exitToSide: (directionIndicator: number) => ({ zIndex: 0, x: directionIndicator < 0 ? 500 : -500, opacity: 0 }),
  };

  const prioritizedHeroHeadline = dynamicSiteConfig?.headline || (
    <>
      Seamless Technology. <br className="hidden md:block" />
      Enterprise Reach. <br className="hidden md:block" />
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bef264] to-[#34d399] drop-shadow-[0_0_20px_rgba(145,203,40,0.3)]">
        Global Standards.
      </span>
    </>
  );

  return (
    <section id="home-hero" className="relative w-full py-20 lg:py-40 flex items-center justify-center overflow-x-hidden bg-[#050505] transition-colors duration-300">
      {/* Structural Abstract Infrastructure Overlay */}
      <div className="absolute inset-0 grid-bg opacity-[0.15] pointer-events-none" />
      
      {/* Brand Color Diffused Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-green/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <ScrollReveal entranceDelay={0.05}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs md:text-sm font-bold mb-8 shadow-sm text-slate-50 uppercase tracking-tighter">
            <span className="flex h-2 w-2 rounded-full bg-brand-green animate-pulse shadow-[0_0_10px_rgba(130,217,30,0.8)]" />
            {dynamicSiteConfig?.badge || "Enterprise Infrastructure"}
          </div>
        </ScrollReveal>

        <ScrollReveal entranceDelay={0.12}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-8 [overflow-wrap:anywhere] [hyphens:auto] text-white leading-[0.9] tracking-tighter">
            {prioritizedHeroHeadline}
          </h1>
        </ScrollReveal>

        <ScrollReveal entranceDelay={0.2}>
          <p className="max-w-3xl mx-auto text-lg md:text-xl xl:text-2xl text-slate-300 mb-10 leading-relaxed font-semibold break-words">
            {dynamicSiteConfig?.subtext || "UV Tech Solutions engineers high-performance, offline software ecosystems designed for mission-critical reliability in local enterprise environments."}
          </p>
        </ScrollReveal>

        <ScrollReveal entranceDelay={0.28}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 md:mb-20">
            <motion.div className="w-full sm:w-auto" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link href="/products" className="w-full sm:w-auto min-h-[48px] px-8 py-4 rounded-full bg-brand-green text-white font-black hover:bg-lime-600 transition-colors shadow-xl shadow-brand-green/20 flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]">
                Explore Products <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <motion.div className="w-full sm:w-auto" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link href="/contact" className="w-full sm:w-auto min-h-[48px] px-8 py-4 rounded-full bg-slate-white text-[#050505] font-black hover:opacity-90 transition-opacity flex items-center justify-center uppercase tracking-widest text-[10px]">
                Request Enterprise Demo
              </Link>
            </motion.div>
          </div>
        </ScrollReveal>

        {/* Dynamic Enterprise Showcase Gallery */}
        <ScrollReveal entranceDelay={0.4}>
          <div className="relative max-w-5xl mx-auto group">
            <div className="absolute inset-0 bg-gradient-to-b from-brand-green/20 to-transparent blur-3xl rounded-full -z-10" />
            
            <div className="glass rounded-2xl border border-white/10 p-2 md:p-4 shadow-2xl overflow-hidden aspect-video flex items-center justify-center bg-black/20 backdrop-blur-xl relative">
              <button
                onClick={(mouseEvent) => { mouseEvent.stopPropagation(); handleGalleryPagination(-1); }}
                className="absolute left-2 md:left-4 z-40 p-1.5 md:p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green"
                aria-label="View previous showcase asset"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button
                onClick={(mouseEvent) => { mouseEvent.stopPropagation(); handleGalleryPagination(1); }}
                className="absolute right-2 md:right-4 z-40 p-1.5 md:p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green"
                aria-label="View next showcase asset"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              
              <div className="w-full h-full rounded-lg bg-black/20 flex flex-col items-center justify-center relative overflow-hidden ring-1 ring-black/5">
                <AnimatePresence initial={false} custom={slideDirection}>
                  <motion.div
                    key={activeAssetIndex}
                    custom={slideDirection}
                    variants={gallerySlideVariants}
                    initial="slideInFromSide"
                    animate="centerFocus"
                    exit="exitToSide"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 }
                    }}
                    className="absolute inset-0 cursor-zoom-in"
                    onClick={() => setIsGalleryExpanded(true)}
                  >
                    <Image
                      src={GLOBAL_SHOWCASE_ASSETS[activeAssetIndex]}
                      alt={`UV Tech Solutions - High-Fidelity UI Presentation ${activeAssetIndex + 1}`}
                      fill
                      priority
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {/* Pagination Indicators */}
              <div className="absolute bottom-6 flex gap-2 z-30">
                {GLOBAL_SHOWCASE_ASSETS.map((_, dotIndex) => (
                  <div
                    key={dotIndex}
                    className={`h-1.5 rounded-full transition-all duration-300 ${dotIndex === activeAssetIndex ? "w-6 bg-brand-green shadow-[0_0_8px_rgba(130,217,30,0.8)]" : "w-1.5 bg-white/30"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Expanded Lightbox Modal Overlay */}
      <AnimatePresence>
        {isGalleryExpanded && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setIsGalleryExpanded(false)}
          >
            <button 
              className="absolute top-6 right-6 text-white hover:text-brand-green z-50 focus:outline-none"
              aria-label="Close expanded gallery view"
            >
              <X className="w-8 h-8" />
            </button>
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="relative w-full max-w-6xl aspect-video"
              onClick={(mouseEvent) => mouseEvent.stopPropagation()}
            >
              <Image 
                src={GLOBAL_SHOWCASE_ASSETS[activeAssetIndex]} 
                alt={`UV Tech Solutions - Expanded Showcase View ${activeAssetIndex + 1}`} 
                fill 
                className="object-contain drop-shadow-2xl" 
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
