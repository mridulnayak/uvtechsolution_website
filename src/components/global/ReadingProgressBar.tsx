"use client";

import { useEffect, useState } from "react";

/**
 * A horizontal progress bar that synchronizes with the user's vertical scroll position.
 * Provides a non-intrusive visual indicator of reading progress throughout the document.
 */
export function ReadingProgressBar() {
  const [scrollProgressPercentage, setScrollProgressPercentage] = useState(0);

  useEffect(() => {
    /**
     * Calculates the current scroll percentage based on the viewport and document height.
     */
    const handleReadingProgressCalculation = () => {
      const currentScrollTop = window.scrollY;
      const totalScrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      const scrollPercentageResult = totalScrollableHeight > 0 
        ? (currentScrollTop / totalScrollableHeight) * 100 
        : 0;

      setScrollProgressPercentage(Math.min(100, Math.max(0, scrollPercentageResult)));
    };

    window.addEventListener("scroll", handleReadingProgressCalculation, { passive: true });
    return () => window.removeEventListener("scroll", handleReadingProgressCalculation);
  }, []);

  return (
    <div
      id="reading-progress-bar"
      style={{ width: `${scrollProgressPercentage}%` }}
      aria-hidden="true"
      role="presentation"
    />
  );
}

