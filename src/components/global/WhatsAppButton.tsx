"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

/**
 * A persistent floating action button linking to a direct WhatsApp inquiry channel.
 * Features a high-visibility brand color and informative tooltip for user engagement.
 */
export function WhatsAppButton() {
  const contactPhoneNumber = "9981679797";
  const defaultInquiryMessage = "Hello! I'm interested in UV Tech Solutions.";

  /**
   * Memoized WhatsApp communication URL to prevent unnecessary string computation.
   */
  const directWhatsAppLink = useMemo(() => {
    return `https://wa.me/${contactPhoneNumber}?text=${encodeURIComponent(defaultInquiryMessage)}`;
  }, [contactPhoneNumber, defaultInquiryMessage]);

  return (
    <motion.a
      href={directWhatsAppLink}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-4 left-4 md:bottom-8 md:left-8 p-2.5 md:p-3 rounded-full bg-green-500 text-white shadow-lg z-50 hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-deep-charcoal flex items-center justify-center group"
      aria-label="Direct inquiry via WhatsApp"
    >
      <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />

      {/* Narrative Engagement Tooltip */}
      <span className="absolute left-full ml-4 px-3 py-1.5 bg-deep-charcoal bg-slate-white text-slate-white text-deep-charcoal text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
        Consult with our experts
      </span>
    </motion.a>
  );
}

