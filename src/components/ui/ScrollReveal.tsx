"use client";

import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";

/**
 * Interface representing the configuration for scroll-triggered entrance animations.
 */
interface ScrollRevealProps {
  /** The content to animate into view. */
  children: ReactNode;
  /** Transition delay (seconds) to sequence multiple entrance events. */
  entranceDelay?: number;
  /** Optional CSS classes for the animation container. */
  className?: string;
  /** The primary axis of entry (up, down, left, right). */
  entryDirection?: "up" | "down" | "left" | "right";
}

/**
 * A highly performant viewport synchronization component.
 * Automatically triggers entrance animations when the child content enters 
 * the user's focus, using smooth Bezier-based transitions.
 */
export function ScrollReveal({
  children,
  entranceDelay = 0,
  className = "",
  entryDirection = "up",
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isCurrentlyInView = useInView(containerRef, { once: true, amount: 0.1 });

  // Mapping directional presets to spatial displacement vectors
  const directionalDisplacementMap = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
  };

  const { x: initialXOffset, y: initialYOffset } = directionalDisplacementMap[entryDirection];

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, x: initialXOffset, y: initialYOffset }}
      animate={isCurrentlyInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: initialXOffset, y: initialYOffset }}
      transition={{
        duration: 0.6,
        delay: entranceDelay,
        // Custom Bezier curve for a rapid yet smooth enterprise-grade acceleration
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

