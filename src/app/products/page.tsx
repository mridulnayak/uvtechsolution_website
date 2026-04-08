"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, FileText, ZoomIn, Loader2 } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { HoverLift } from "@/components/ui/HoverLift";
import { PRODUCTS } from "@/lib/constants";
import { ProductLogo } from "@/components/product/ProductLogo";
import { Lightbox } from "@/components/product/Lightbox";
import { synchronizeProducts } from "@/lib/cms";

/**
 * Interface representing the structure of a product item.
 */
interface Product {
  id: string | number;
  name: string;
  tagline: string;
  description: string;
  themeColor: string;
  logo: string;
  screenshots: string[];
  features: string[];
  manual?: string;
  price?: number;
}

/**
 * Interface representing the state of the image lightbox.
 */
interface LightboxState {
  isOpen: boolean;
  images: string[];
  index: number;
}

export default function ProductsPage() {
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [lightboxState, setLightboxState] = useState<LightboxState>({
    isOpen: false,
    images: [],
    index: 0,
  });

  useEffect(() => {
    /**
     * Fetches product data from the CMS and merges it with local configuration for consistent branding.
     */
    async function loadProductsData() {
      try {
        setIsProductsLoading(true);
        // getProducts in @/lib/cms already includes cache: 'no-store' logic via setHeader('Cache-Control')
        const databaseProducts = await synchronizeProducts();
        
        if (databaseProducts && databaseProducts.length > 0) {
          const finalizedProducts = databaseProducts.map((databaseProduct: any, productsIndex: number) => {
            const fallbackProductConfig = PRODUCTS[productsIndex] || PRODUCTS[0];

            return {
              ...fallbackProductConfig,
              ...databaseProduct,
              logo: fallbackProductConfig.logo,
              screenshots: fallbackProductConfig.screenshots,
              features: Array.isArray(databaseProduct.features) 
                ? databaseProduct.features 
                : (databaseProduct.features?.split(',').map((featureItem: string) => featureItem.trim()) || fallbackProductConfig.features),
            };
          });
          setDisplayProducts(finalizedProducts);
        } else {
          setDisplayProducts(PRODUCTS);
        }
      } catch (loadingError) {
        // Fallback to local constants if database fetch fails
        setDisplayProducts(PRODUCTS);
      } finally {
        setIsProductsLoading(false);
      }
    }
    loadProductsData();
  }, []);

  /**
   * Opens the image lightbox at a specific index.
   * 
   * @param imagesList - Array of image URLs to display.
   * @param startingIndex - The index of the image to show first.
   */
  const handleOpenLightbox = useCallback((imagesList: string[], startingIndex: number) => {
    setLightboxState({ isOpen: true, images: imagesList, index: startingIndex });
  }, []);

  /**
   * Closes the active lightbox.
   */
  const handleCloseLightbox = useCallback(() => {
    setLightboxState(previousState => ({ ...previousState, isOpen: false }));
  }, []);

  return (
    <div className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Heading Section */}
        <ScrollReveal>
          <header id="products-header" className="text-center max-w-3xl mx-auto mb-24">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Industry-Specific{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-teal-400">
                Software
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Specialized digital tools engineered to solve the unique challenges of your business sector.
            </p>
          </header>
        </ScrollReveal>

        {/* Dynamic Products Showcase */}
        <main id="products-list" className="space-y-32">
          {isProductsLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-brand-green animate-spin" />
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Synchronizing Product Showcase...</p>
            </div>
          ) : (
            displayProducts.map((productItem, productIndex) => (
              <ScrollReveal key={productItem.id || productIndex} entranceDelay={0.1}>
                <section
                  id={`product-section-${productItem.id}`}
                  className={`flex flex-col lg:flex-row gap-16 lg:gap-24 items-start ${productIndex % 2 !== 0 ? "lg:flex-row-reverse" : ""
                    }`}
                >
                  {/* Visual Interface Gallery */}
                  <div className="w-full lg:w-3/5 space-y-6">
                    <HoverLift hoverIntensity="sm">
                      <button 
                        onClick={() => handleOpenLightbox(productItem.screenshots, 0)}
                        className={`aspect-[16/10] w-full rounded-2xl bg-gradient-to-br ${productItem.themeColor} border border-gray-100 dark:border-gray-800 shadow-2xl relative overflow-hidden group text-left cursor-zoom-in`}
                      >
                         {/* Main Dashboard Preview Wrapper */}
                         <div className="absolute inset-4 rounded-xl border border-white/20 bg-white/5 shadow-2xl overflow-hidden backdrop-blur-sm">
                            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-40 group-hover:opacity-60 transition-opacity p-8 text-center bg-gray-100/10">
                               <FileText className="w-16 h-16 text-brand-green/30 mb-4" />
                               <p className="text-xs font-bold text-brand-green/40 uppercase tracking-widest">{productItem.name} Dashboard</p>
                            </div>
                            <Image 
                               src={productItem.screenshots[0]} 
                               alt={`${productItem.name} Main Interface Dashboard`}
                               fill
                               priority={productIndex === 0}
                               className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-0 data-[loaded=true]:opacity-100"
                               onLoad={(loadEvent) => (loadEvent.target as HTMLImageElement).setAttribute("data-loaded", "true")}
                               onError={(errorEvent) => {
                                  (errorEvent.target as HTMLImageElement).style.display = 'none';
                               }}
                            />
                            
                            {/* Interactive Zoom Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                               <div className="p-4 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white translate-y-4 group-hover:translate-y-0 transition-transform">
                                  <ZoomIn className="w-8 h-8" />
                               </div>
                            </div>
                         </div>
                         
                         {/* Metadata Label overlay */}
                         <div className="absolute bottom-8 left-8 flex items-center gap-2">
                            <span className="px-3 py-1 bg-white/90 dark:bg-deep-charcoal/90 backdrop-blur rounded-full text-[10px] font-bold tracking-tight uppercase shadow-sm">
                              Main Interface
                            </span>
                         </div>
                      </button>
                    </HoverLift>
                    
                    {/* Secondary Perspective Thumbnails */}
                    <div className="grid grid-cols-3 gap-6">
                       {productItem.screenshots.slice(1, 4).map((thumbnailUrl: string, imageIndex: number) => (
                          <ScrollReveal key={imageIndex} entranceDelay={0.2 + imageIndex * 0.1} entryDirection="up">
                             <button 
                                onClick={() => handleOpenLightbox(productItem.screenshots, imageIndex + 1)}
                                className={`aspect-video w-full rounded-xl bg-gradient-to-br ${productItem.themeColor} border border-gray-100 dark:border-gray-800 overflow-hidden shadow-lg relative cursor-zoom-in group`}
                             >
                                <Image 
                                   src={thumbnailUrl} 
                                   alt={`${productItem.name} Feature Perspective ${imageIndex + 2}`}
                                   fill
                                   className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-0 data-[loaded=true]:opacity-100"
                                   onLoad={(loadEvent) => (loadEvent.target as HTMLImageElement).setAttribute("data-loaded", "true")}
                                   onError={(errorEvent) => {
                                      (errorEvent.target as HTMLImageElement).style.display = 'none';
                                   }}
                                />
                                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                   <ZoomIn className="w-4 h-4 text-white" />
                                </div>
                             </button>
                          </ScrollReveal>
                       ))}
                    </div>
                  </div>

                  {/* Product Information and CTAs */}
                  <div className="w-full lg:w-2/5 flex flex-col justify-center pt-8">
                    <ScrollReveal entranceDelay={0.2} entryDirection={productIndex % 2 !== 0 ? "right" : "left"}>
                      <div className="flex items-center gap-6 mb-8">
                        <ProductLogo 
                          logoImageSource={productItem.logo} 
                          productDisplayName={productItem.name} 
                          dimensionSize={64}
                          className="shadow-xl"
                        />
                        <div className="flex flex-col">
                          <div className="inline-flex items-center px-4 py-1 rounded-full bg-brand-green/10 text-brand-green text-xs font-bold uppercase tracking-wider mb-2 w-fit">
                            {productItem.tagline}
                          </div>
                          <h2 className="text-4xl md:text-5xl font-bold text-deep-charcoal dark:text-slate-white">
                            {productItem.name}
                          </h2>
                        </div>
                      </div>

                      <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed font-medium">
                        {productItem.description}
                      </p>

                      {/* Strategic Capabilities List */}
                      <div className="space-y-8 mb-12">
                         <h4 className="text-sm font-bold text-deep-charcoal dark:text-slate-white uppercase tracking-widest border-b border-gray-100 dark:border-gray-800 pb-2">Key Features</h4>
                         <ul className="grid grid-cols-1 gap-4">
                          {productItem.features.map((featureDescription: string, featureIndex: number) => (
                            <li key={featureIndex} className="flex items-start gap-3">
                              <CheckCircle2 className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700 dark:text-gray-300 font-medium text-lg italic">
                                {featureDescription}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex flex-wrap gap-4 pt-4">
                        <Link
                          href={productItem.manual || "#"}
                          target="_blank"
                          className="px-8 py-4 rounded-full bg-brand-green text-white font-bold hover:bg-lime-600 transition-all shadow-xl shadow-brand-green/20 text-center flex items-center gap-2 group"
                        >
                          {productItem.manual ? "Download Manual" : "View Manual"} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                          href={`/contact?product=${productItem.id || productIndex}`}
                          className="px-8 py-4 rounded-full border-2 border-gray-200 dark:border-gray-700 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center text-deep-charcoal dark:text-slate-white"
                        >
                          {productItem.price === 0 || !productItem.price ? "Contact for Pricing" : "Book Demo"}
                        </Link>
                      </div>
                    </ScrollReveal>
                  </div>
                </section>
              </ScrollReveal>
            ))
          )}
        </main>

        {/* Future-Focused Technology Roadmap */}
        <ScrollReveal>
          <footer className="mt-32 p-12 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2.5rem] relative overflow-hidden group">
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/10 text-brand-green text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                 Future Capabilities
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-6 uppercase tracking-tighter text-deep-charcoal dark:text-slate-white">
                Edge Diagnostic Integration <span className="text-gray-400 font-medium">(Coming Soon)</span>
              </h2>
              <p className="max-w-2xl text-lg text-gray-500 dark:text-slate-400 font-medium leading-relaxed">
                Next-generation hardware telemetry and remote diagnostic heartbeats for offline nodes. Currently in private R&D for elite infrastructure partners.
              </p>
            </div>
          </footer>
        </ScrollReveal>
      </div>

      <Lightbox 
        galleryImages={lightboxState.images}
        startingImageIndex={lightboxState.index}
        isGalleryOpen={lightboxState.isOpen}
        onGalleryClose={handleCloseLightbox}
      />
    </div>
  );
}

