"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, FileText, Tag, Hotel, Utensils, Zap, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import Image from "next/image";
import { PRODUCTS } from "@/lib/constants";
import { ProductLogo } from "@/components/product/ProductLogo";
import { synchronizeProducts } from "@/lib/cms";

/**
 * Renders a placeholder skeleton card while product metadata is fetched from the CMS.
 * Simulates the full structural layout of the bento grid cards to prevent layout shift.
 */
function DatabaseShimmerLoader() {
  return (
    <div className="h-[480px] bg-white dark:bg-deep-charcoal/50 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-pulse">
      <div className="h-[200px] w-full bg-gray-200 dark:bg-gray-800" />
      <div className="p-8 space-y-4">
        <div className="flex gap-4 items-center">
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded" />
        <div className="mt-auto h-8 w-full bg-gray-200 dark:bg-gray-800 rounded" />
      </div>
    </div>
  );
}

/**
 * The core product showcase grid on the homepage. By default, maps available products 
 * from Supabase with dynamic fallback icons, screenshots, and feature highlights.
 */
export function ProductBento() {
  const [enterpriseModules, setEnterpriseModules] = useState<any[]>([]); // Initialized empty for shimmer priority
  const [isNetworkSyncing, setIsNetworkSyncing] = useState(true);

  useEffect(() => {
    /**
     * Bootstraps the enterprise software grid from the live Supabase CMS.
     */
    async function synchronizeEnterpriseModules() {
      try {
        setIsNetworkSyncing(true);
        const databasePayload = await synchronizeProducts();

        if (databasePayload && databasePayload.length > 0) {
          const synchronizedModules = databasePayload.map((dbRecord: any, recordIndex: number) => {            
            const legacyFallbackConfig = PRODUCTS[recordIndex] || PRODUCTS[0];

            let ModuleIcon = Zap;
            if (legacyFallbackConfig.id === "hoteleo") ModuleIcon = Hotel;
            else if (legacyFallbackConfig.id === "restpro") ModuleIcon = Utensils;
            else if (legacyFallbackConfig.id === "pro-retail") ModuleIcon = ShoppingBag;

            return {
              ...legacyFallbackConfig,
              ...dbRecord,
              ModuleIcon,
              logo: legacyFallbackConfig.logo,
              screenshots: legacyFallbackConfig.screenshots,
              features: Array.isArray(dbRecord.features)
                ? dbRecord.features
                : (dbRecord.features?.split(',').map((f: string) => f.trim()) || legacyFallbackConfig.features),
            };
          });
          setEnterpriseModules(synchronizedModules);
        } else {
          // If empty DB, use hardcoded legacy list
          setEnterpriseModules(PRODUCTS.map(module => ({ ...module, ModuleIcon: Zap })));
        }
      } catch (syncError) {
        console.error("Failed to synchronize enterprise products:", syncError);
        setEnterpriseModules(PRODUCTS.map(module => ({ ...module, ModuleIcon: Zap })));
      } finally {
        setIsNetworkSyncing(false);
      }
    }
    synchronizeEnterpriseModules();
  }, []);

  return (
    <section id="product-bento" className="py-20 bg-gray-50 dark:bg-deep-charcoal/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4 uppercase tracking-tighter">Precision Engineering</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explore our core software solutions designed for industry-specific excellence.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isNetworkSyncing ? (
            Array.from({ length: 3 }).map((_, loaderIndex) => <DatabaseShimmerLoader key={loaderIndex} />)
          ) : (
            enterpriseModules.map((activeModule: any, moduleIndex: number) => (
              <ScrollReveal key={activeModule.id || moduleIndex} entranceDelay={moduleIndex * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="group relative h-[480px] bg-white dark:bg-deep-charcoal rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col hover:shadow-xl transition-all duration-300"
                >
                  {/* Software Window Visual Wrapper */}
                  <div className={`h-[200px] w-full bg-gradient-to-br ${activeModule.themeColor} relative overflow-hidden flex items-center justify-center p-6`}>
                    <div className="w-full h-full rounded-xl border border-white/40 dark:border-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-md shadow-2xl relative overflow-hidden flex flex-col">
                      <div className="h-6 bg-white/30 dark:bg-black/20 border-b border-white/20 px-3 flex items-center gap-1.5 flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-red-400/50" />
                        <div className="w-2 h-2 rounded-full bg-amber-400/50" />
                        <div className="w-2 h-2 rounded-full bg-emerald-400/50" />
                        <div className="text-[10px] text-gray-500/70 ml-2 font-mono">{activeModule.name}.exe</div>
                      </div>
                      <div className={`flex-grow relative overflow-hidden bg-gradient-to-br ${activeModule.themeColor.replace('10', '20')}`}>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent shimmer-overlay -translate-x-full animate-shimmer" />

                        {/* Dynamic Background Icon */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                          {activeModule.ModuleIcon && <activeModule.ModuleIcon className="w-32 h-32 text-white" />}
                        </div>

                        <Image
                          src={activeModule.screenshots?.[0] || '/images/placeholders/uvtech_premium.png'}
                          alt={`${activeModule.name} System Interface Interface`}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.15] opacity-0 data-[loaded=true]:opacity-100"
                          onLoad={(reactEvent) => (reactEvent.target as HTMLImageElement).setAttribute("data-loaded", "true")}
                          onError={(reactEvent) => {
                            (reactEvent.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        
                        {/* Modules Overlay */}
                        <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 flex flex-col justify-center items-center p-6 bg-gradient-to-br ${activeModule.themeColor.replace('10', '40')}`}>
                          <h4 className="text-white font-black mb-4 uppercase tracking-widest text-sm">Key Modules</h4>
                          <ul className="space-y-2 w-full max-w-[220px]">
                            {activeModule.features?.map((featureNode: string, featureIndex: number) => (
                              <li key={featureIndex} className="text-white/95 text-xs flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                {featureNode}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contextual Architecture Blueprint Content */}
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-4 mb-4">
                      <ProductLogo
                        logoImageSource={activeModule.logo}
                        productDisplayName={activeModule.name}
                        dimensionSize={32}
                      />
                      <div>
                        <h3 className="text-xl font-black text-deep-charcoal dark:text-slate-white uppercase tracking-tighter">
                          {activeModule.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Tag className="w-3 h-3 text-brand-green" />
                          <span className="text-[10px] font-black text-brand-green uppercase tracking-widest">
                            {activeModule.price === 0 || !activeModule.price ? "Contact for Enterprise Pricing" : `Starting at $${activeModule.price}`}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-2 font-medium italic">
                      {activeModule.description}
                    </p>

                    <div className="mt-auto flex items-center justify-between">
                      <Link
                        href={activeModule.manual || '#'}
                        target="_blank"
                        className="flex items-center gap-2 text-brand-green font-bold text-xs uppercase tracking-widest hover:underline underline-offset-4"
                      >
                        <FileText className="w-4 h-4" /> View Manual
                      </Link>
                      <Link
                        href={`/products#${activeModule.id}`}
                        className={`w-10 h-10 rounded-full border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-400 group-hover:text-white transition-all shadow-sm ${activeModule.name.toLowerCase().replace(/\s+/g, '').includes("hoteleo") ? 'group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:shadow-blue-600/20' :
                            activeModule.name.toLowerCase().replace(/\s+/g, '').includes("restpro") ? 'group-hover:bg-emerald-600 group-hover:border-emerald-600 group-hover:shadow-emerald-600/20' :
                              activeModule.name.toLowerCase().replace(/\s+/g, '').includes("retail") ? 'group-hover:bg-rose-600 group-hover:border-rose-600 group-hover:shadow-rose-600/20' :
                                'group-hover:bg-brand-green group-hover:border-brand-green group-hover:shadow-brand-green/20'
                          }`}
                        aria-label={`Learn more about ${activeModule.name}`}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
