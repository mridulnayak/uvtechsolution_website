import { Hero } from "@/features/home/Hero";
import { ProductBento } from "@/features/home/ProductBento";
import { Workflow } from "@/features/home/Workflow";
import { LogoMarquee } from "@/features/home/LogoMarquee";

/**
 * Configure the cache revalidation for the Home page.
 * Setting this to 0 ensures dynamic, real-time data from Supabase (e.g., in ProductBento and LogoMarquee).
 */
export const revalidate = 0;

/**
 * The primary landing page for UV Tech Solutions.
 * Orchestrates high-impact feature sections including the Hero showcase, 
 * the Big 3 product bento grid, the social-proof marquee, and the hybrid workflow sequence.
 */
export default function Home() {
  return (
    <div className="flex flex-col space-y-12 md:space-y-32 pb-32">
      
      {/* Principal Brand Identity & Vision Section */}
      <section id="hero-showcase">
        <Hero />
      </section>

      {/* Strategic Product Architecture (ERP & Billing Solutions) */}
      <section id="product-bento-grid">
        <ProductBento />
      </section>

      {/* Social Proof & Infrastructure Partner Marquee */}
      <section id="partner-ecosystem">
        <LogoMarquee />
      </section>

      {/* Operational Methodology & Technical Workflow */}
      <section id="hybrid-workflow">
        <Workflow />
      </section>
      
    </div>
  );
}
