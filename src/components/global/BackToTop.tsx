"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";

/**
 * A floating action button that allows users to smoothly scroll back to the top of the page.
 * Appearing only after a specific scroll threshold (300px) to maintain a clean UI.
 */
export function BackToTop() {
  const [isFabVisible, setIsFabVisible] = useState(false);

  useEffect(() => {
    /**
     * Monitors the window scroll position to determine FAB visibility.
     */
    const handleScrollVisibility = () => {
      // Toggle visibility based on a 300px scroll threshold
      if (window.scrollY > 300) {
        setIsFabVisible(true);
      } else {
        setIsFabVisible(false);
      }
    };

    window.addEventListener("scroll", handleScrollVisibility, { passive: true });
    return () => window.removeEventListener("scroll", handleScrollVisibility);
  }, []);

  /**
   * Smoothly navigates the viewport back to the document origin.
   */
  const handleScrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <AnimatePresence>
      {isFabVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleScrollToTop}
          className="fixed bottom-8 right-8 p-3 rounded-full bg-brand-green text-white shadow-lg z-50 hover:bg-lime-600 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2 focus:ring-offset-deep-charcoal"
          aria-label="Back to top"
        >
          <ChevronUp className="w-6 h-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

