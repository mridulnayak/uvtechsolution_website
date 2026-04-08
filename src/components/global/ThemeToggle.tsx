"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useCallback } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * A specialized toggle component that allows users to switch between 'light', 'dark', and 'system' themes. 
 * Orchestrates animations and ensures theme persistence using next-themes.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [hasComponentMounted, setHasComponentMounted] = useState(false);

  // Prevents hydration mismatch by ensuring the component is only rendered on the client
  useEffect(() => {
    setHasComponentMounted(true);
  }, []);

  /**
   * Cycles through the available theme modes (Light -> Dark -> System).
   */
  const handleThemeCycleSequence = useCallback(() => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  }, [theme, setTheme]);

  // Loading state placeholder to ensure UI stability
  if (!hasComponentMounted) {
    return (
      <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse" />
    );
  }

  /**
   * Resolves the appropriate icon based on the active theme mode.
   */
  const renderThemeIcon = () => {
    switch (theme) {
      case "light": return <Sun className="w-4 h-4" />;
      case "dark": return <Moon className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  return (
    <motion.button
      id="theme-toggle-btn"
      onClick={handleThemeCycleSequence}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-brand-green/10 hover:text-brand-green transition-colors focus:ring-2 focus:ring-brand-green/30 outline-none"
      aria-label={`Current theme: ${theme}. Click to cycle themes.`}
      title={`Theme: ${theme}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderThemeIcon()}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
