"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

/**
 * Interface for the HoverLift component properties.
 */
interface HoverLiftProps extends HTMLMotionProps<"div"> {
  /** The content elements to be wrapped by the lift effect. */
  children: ReactNode;
  /** 
   * The vertical displacement and scaling intensity.
   * - sm: subtle lift (-4px)
   * - md: standard lift (-8px)
   * - lg: pronounced lift (-12px)
   */
  hoverIntensity?: "sm" | "md" | "lg";
}

/**
 * A tactile UI wrapper that provides a premium 'lifting' effect on hover.
 * Orchestrates vertical translation and subtle scaling using high-precision spring physics.
 * 
 * @param props - Configuration for the lift intensity and animation container.
 */
export function HoverLift({
  children,
  hoverIntensity = "md",
  className = "",
  ...restMotionProps
}: HoverLiftProps) {
  // Mapping intensity levels to precise spatial transformations
  const verticalLiftPixels = { sm: -4, md: -8, lg: -12 }[hoverIntensity];
  const relativeScaleFactor = { sm: 1.01, md: 1.02, lg: 1.03 }[hoverIntensity];

  return (
    <motion.div
      whileHover={{ y: verticalLiftPixels, scale: relativeScaleFactor }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20, 
        mass: 0.5 // Reduced mass for a Snappier response
      }}
      className={className}
      {...restMotionProps}
    >
      {children}
    </motion.div>
  );
}

