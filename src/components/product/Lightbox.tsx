"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Interface for the Lightbox component properties.
 */
interface LightboxProps {
  /** A collection of image URIs to display in the gallery. */
  galleryImages: string[];
  /** The zero-based index of the image to display upon opening. */
  startingImageIndex: number;
  /** Controls the visibility of the lightbox overlay. */
  isGalleryOpen: boolean;
  /** Callback function triggered to close the lightbox. */
  onGalleryClose: () => void;
}

/**
 * A mission-critical image gallery and lightbox component.
 * Features smooth transitions, interactive zooming, and high-fidelity navigation 
 * for presenting product assets and technical screenshots.
 */
export function Lightbox({ 
  galleryImages, 
  startingImageIndex, 
  isGalleryOpen, 
  onGalleryClose 
}: LightboxProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(startingImageIndex);
  const [activeZoomFactor, setActiveZoomFactor] = useState(1);

  useEffect(() => {
    // Reset state when the active image initialization changes or the gallery opens
    setActiveImageIndex(startingImageIndex);
    setActiveZoomFactor(1);
    
    // Manage document scrolling to prevent background movement
    if (isGalleryOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [startingImageIndex, isGalleryOpen]);

  /**
   * Navigates to the next image in the sequence, looping back to the origin.
   */
  const handleNavigateNext = useCallback(() => {
    setActiveImageIndex((previousIndex) => (previousIndex + 1) % galleryImages.length);
    setActiveZoomFactor(1);
  }, [galleryImages.length]);

  /**
   * Navigates to the previous image in the sequence, looping to the end.
   */
  const handleNavigatePrevious = useCallback(() => {
    setActiveImageIndex((previousIndex) => (previousIndex - 1 + galleryImages.length) % galleryImages.length);
    setActiveZoomFactor(1);
  }, [galleryImages.length]);

  /**
   * Increments the zoom level of the active image asset.
   */
  const handleIncrementZoom = useCallback(() => {
    setActiveZoomFactor((previousZoom) => Math.min(previousZoom + 0.5, 3));
  }, []);

  /**
   * Decrements the zoom level of the active image asset.
   */
  const handleDecrementZoom = useCallback(() => {
    setActiveZoomFactor((previousZoom) => Math.max(previousZoom - 0.5, 1));
  }, []);

  if (!isGalleryOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      >
        {/* Global Toolbar & Navigation Status */}
        <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center z-50">
          <div className="text-white/70 text-sm font-medium tracking-widest uppercase">
            Asset {activeImageIndex + 1} of {galleryImages.length}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleDecrementZoom}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors focus:ring-2 focus:ring-brand-green outline-none"
              aria-label="Lower zoom resolution"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <button
              onClick={handleIncrementZoom}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors focus:ring-2 focus:ring-brand-green outline-none"
              aria-label="Higher zoom resolution"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              onClick={onGalleryClose}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors focus:ring-2 focus:ring-brand-green outline-none"
              aria-label="Exit full-screen gallery"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Primary Sequential Navigation Controls */}
        {galleryImages.length > 1 && (
          <>
            <button
              onClick={handleNavigatePrevious}
              className="absolute left-6 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all z-50 group focus:ring-2 focus:ring-brand-green outline-none"
              aria-label="View previous asset"
            >
              <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
            </button>
            <button
              onClick={handleNavigateNext}
              className="absolute right-6 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all z-50 group focus:ring-2 focus:ring-brand-green outline-none"
              aria-label="View next asset"
            >
              <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
            </button>
          </>
        )}

        {/* Central Component Viewport */}
        <motion.div
          key={activeImageIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-7xl max-h-[85vh] px-12 overflow-hidden flex items-center justify-center pointer-events-none"
        >
          <motion.div
            animate={{ scale: activeZoomFactor }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full h-full aspect-video pointer-events-auto"
          >
            <Image
              src={galleryImages[activeImageIndex]}
              alt={`UV Tech Solutions Product Asset - Gallery View ${activeImageIndex + 1}`}
              fill
              className="object-contain"
              priority
            />
          </motion.div>
        </motion.div>

        {/* Navigation Thumbnail Catalog */}
        <div className="absolute bottom-8 flex gap-3 px-6 max-w-full overflow-x-auto no-scrollbar py-2">
          {galleryImages.map((imageAsset, assetIndex) => (
            <button
              key={assetIndex}
              onClick={() => {
                setActiveImageIndex(assetIndex);
                setActiveZoomFactor(1);
              }}
              className={cn(
                "relative w-20 aspect-video rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 focus:ring-2 focus:ring-brand-green outline-none",
                activeImageIndex === assetIndex 
                  ? "border-brand-green scale-110 z-10" 
                  : "border-secondary/10 opacity-50 hover:opacity-100"
              )}
              aria-label={`Jump to image asset ${assetIndex + 1}`}
              aria-current={activeImageIndex === assetIndex ? "true" : "false"}
            >
              <Image 
                src={imageAsset} 
                alt={`Quick-nav thumbnail for asset ${assetIndex + 1}`} 
                fill 
                className="object-cover" 
              />
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

