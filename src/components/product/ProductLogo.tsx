"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Interface for the ProductLogo component properties.
 */
interface ProductLogoProps {
  /** The source URI of the product logo image. */
  logoImageSource: string;
  /** The human-readable name of the product, used for accessibility and fallbacks. */
  productDisplayName: string;
  /** Optional CSS class names for additional styling. */
  className?: string;
  /** The square dimension for the logo (default: 40px). */
  dimensionSize?: number;
}

/**
 * A standardized product branding component.
 * Displays a high-resolution logo asset with a graceful text-based fallback 
 * if the image fails to load or the source is unavailable.
 */
export function ProductLogo({ 
  logoImageSource, 
  productDisplayName, 
  className, 
  dimensionSize = 40 
}: ProductLogoProps) {
  const [hasLogoLoadError, setHasLogoLoadError] = useState(false);

  // Render a text-based avatar fallback if the image is missing or broken
  if (hasLogoLoadError || !logoImageSource) {
    return (
      <div 
        className={cn(
          "rounded-xl bg-gradient-to-br from-brand-green to-lime-500 flex items-center justify-center font-bold text-white shadow-lg shadow-brand-green/20",
          className
        )}
        style={{ 
          width: dimensionSize, 
          height: dimensionSize, 
          fontSize: dimensionSize * 0.5 
        }}
        aria-label={`Fallback representation for ${productDisplayName}`}
      >
        {productDisplayName.charAt(0)}
      </div>
    );
  }

  return (
    <div 
      className={cn("relative flex-shrink-0", className)} 
      style={{ width: dimensionSize, height: dimensionSize }}
    >
      <Image
        src={logoImageSource}
        alt={`${productDisplayName} Branding Logo`}
        fill
        className="object-contain transition-opacity duration-300 opacity-0 data-[loaded=true]:opacity-100"
        onLoad={(loadEvent) => (loadEvent.target as HTMLImageElement).setAttribute("data-loaded", "true")}
        onError={() => setHasLogoLoadError(true)}
      />
    </div>
  );
}

