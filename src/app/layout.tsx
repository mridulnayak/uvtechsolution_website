import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/global/Navbar";
import { Footer } from "@/components/global/Footer";
import { BackToTop } from "@/components/global/BackToTop";
import { WhatsAppButton } from "@/components/global/WhatsAppButton";
import { ThemeProvider } from "@/components/global/ThemeProvider";
import { ReadingProgressBar } from "@/components/global/ReadingProgressBar";
import { AiChat } from "@/features/ai/AiChat";

/**
 * Configure the primary sans-serif font family (Inter) for the application.
 */
const sansFontConfiguration = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

/**
 * Global SEO and OpenGraph metadata configuration for UV Tech Solutions.
 * Ensures optimal indexing, professional social sharing, and brand consistency.
 */
export const metadata: Metadata = {
  // Sets the base URL for resolving relative metadata paths, crucial for social media crawlers.
  metadataBase: new URL("https://uvtechsolutions.in"),

  title: {
    default: "UV Tech Solutions | Offline Reliability. Mission-Critical Resilience.",
    template: "%s | UV Tech Solutions",
  },
  description: "Enterprise ERP & Technical Support Solutions for Hospitality, Restaurants, and Retail globally.",

  keywords: [
    "Enterprise ERP",
    "Global Hospitality Software",
    "Enterprise POS Solutions",
    "Hoteleo",
    "Restpro",
    "Retail Billing Software"
  ],

  icons: {
    // Brand identity icons for browser tabs and mobile devices
    icon: "/images/logos/logo.png",
    apple: "/images/logos/logo.png",
    shortcut: "/images/logos/logo.png",
  },

  openGraph: {
    title: "UV Tech Solutions",
    description: "Securing global business infrastructure with real-time technical support.",
    url: "https://uvtechsolutions.in",
    siteName: "UV Tech Solutions",
    images: [
      {
        url: "/og-image.png", // Recommended size: 1200x630px
        width: 1200,
        height: 630,
        alt: "UV Tech Solutions - Offline Reliability. Mission-Critical Resilience.",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

/**
 * Interface for the RootLayout component props.
 */
interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * The fundamental layout wrapper for the entire UV Tech Solutions application.
 * Orchestrates themes, global navigation, reading progress, and core infrastructure components.
 * 
 * @param props - The layout configuration containing the page content (children).
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${sansFontConfiguration.variable} font-sans antialiased min-h-screen flex flex-col bg-slate-white dark:bg-deep-charcoal text-deep-charcoal dark:text-slate-white`}
      >
        <ThemeProvider>
          {/* Visual indicators and navigational overlays */}
          <ReadingProgressBar />
          <Navbar />
          
          {/* Principal application viewport */}
          <main className="flex-1 mt-20 w-full overflow-x-hidden">
            {children}
          </main>
          
          {/* Global structural components and utility triggers */}
          <Footer />
          <BackToTop />
          <WhatsAppButton />
          <AiChat />
        </ThemeProvider>
      </body>
    </html>
  );
}