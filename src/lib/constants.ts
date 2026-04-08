import { Database, Zap, Code2, LucideIcon } from "lucide-react";

/**
 * Definition structure for a UV Tech core software module.
 */
export interface ProductConfiguration {
  /** Technical identifier for routing and database lookups. */
  id: string;
  /** Professional display name of the software product. */
  name: string;
  /** High-level pitch or summary statement. */
  tagline: string;
  /** Detailed technical and functional description. */
  description: string;
  /** Tailwind-compatible gradient classes for product-specific branding. */
  themeColor: string;
  /** URI path to the product's primary logo asset. */
  logo: string;
  /** Collection of high-fidelity dashboard and interface screenshots. */
  screenshots: string[];
  /** URI path to the technical operation manual. */
  manual: string;
  /** List of primary functional modules or capabilities. */
  features: string[];
}

/**
 * Metadata configuration for global enterprise services.
 */
export interface ServiceConfiguration {
  /** Unique identifier for the service pillar. */
  id: string;
  /** Human-readable title of the service offering. */
  title: string;
  /** Comprehensive description of the service scope. */
  description: string;
  /** The Lucide icon component representing the service visually. */
  icon: LucideIcon;
  /** Key highlights or deliverables within the service. */
  features: string[];
  /** Background gradient styling for card UI. */
  color: string;
  /** Text color styling for high-contrast branding. */
  accent: string;
  /** Background styling for the icon primitive. */
  iconBg: string;
  /** CSS grid span configuration for responsive layout. */
  span: string;
  /** Whether this service pillar is emphasized in the UI. */
  large: boolean;
}

/**
 * The definitive collection of core UV Tech software modules.
 * These represent the principal product offerings synchronized across the platform.
 */
export const PRODUCTS: ProductConfiguration[] = [
  {
    id: "hoteleo",
    name: "Hoteleo",
    tagline: "Comprehensive Hotel Management",
    description: "A complete Property Management System (PMS) designed to streamline hotel operations from front desk to back office. Manage bookings, guests, and staff through a single intuitive interface.",
    themeColor: "from-blue-600/10 to-indigo-600/10",
    logo: "/images/logos/hoteleo-logo.png",
    screenshots: [
      "/images/screenshots/hoteleo_1.png",
      "/images/screenshots/hoteleo_2.png",
      "/images/screenshots/hoteleo_3.png",
      "/images/screenshots/hoteleo_4.png",
    ],
    manual: "/docs/hoteleo-manual.pdf",
    features: [
      "Interactive room booking grid",
      "Real-time room status tracking",
      "Automated guest billing & tax calcs",
      "Staff shift & payroll management",
    ],
  },
  {
    id: "restpro",
    name: "Restpro",
    tagline: "Modern Restaurant POS",
    description: "An end-to-end Point of Sale system built specifically for the high-pressure restaurant environment. Optimize your workflow from table-side ordering to the kitchen.",
    themeColor: "from-emerald-600/10 to-teal-600/10",
    logo: "/images/logos/restpro-logo.png",
    screenshots: [
      "/images/screenshots/restpro_1.jpeg",
      "/images/screenshots/restpro_2.jpeg",
      "/images/screenshots/restpro_3.jpeg",
    ],
    manual: "/docs/restpro-manual.docx",
    features: [
      "Table-wise status & reservation tracking",
      "Takeaway & Home Delivery management",
      "Instant KOT (Kitchen Order Ticket) generation",
      "Integrated split-billing & discounts",
    ],
  },
  {
    id: "pro-retail",
    name: "Pro Retail",
    tagline: "Agile Retail Billing",
    description: "Rapid and reliable billing software for retail shops of all sizes. Keep your lines moving and your inventory accurate with powerful real-time analytics.",
    themeColor: "from-rose-600/10 to-orange-600/10",
    logo: "/images/logos/retail-logo.png",
    screenshots: [
      "/images/screenshots/retail_1.png",
      "/images/screenshots/retail_2.png",
      "/images/screenshots/retail_3.png",
    ],
    manual: "/docs/retail-manual.pdf",
    features: [
      "Rapid GS1-compliant invoice generation",
      "Real-time inventory & stock tracking",
      "Deep sales data & profit analytics",
      "Multi-payment support (UPI, Card, Cash)",
    ],
  },
];

/**
 * The strategic service pillars for UV Tech Solutions.
 * Orchestrates the 'Implementation' phase of the enterprise workflow.
 */
export const SERVICES: ServiceConfiguration[] = [
  {
    id: "deploy",
    title: "Managed Deployment & Setup",
    description: "Professional configuration of Hoteleo/Restpro, ensuring seamless printer and network integration in your global business ecosystem.",
    icon: Database,
    features: ["On-site Installation", "Database Configuration", "Hardware Synergy"],
    color: "from-brand-green/20 to-lime-400/20",
    accent: "text-brand-green",
    iconBg: "bg-brand-green/10",
    span: "md:col-span-2",
    large: true,
  },
  {
    id: "support",
    title: 'Priority Technical Support',
    description: "Industry-leading AMC support to ensure operational continuity and local system reliability for our products.",
    icon: Zap,
    features: ["Remote Assistance", "Backup Strategy", "Priority AMC Support"],
    color: "from-lime-400/20 to-brand-green/20",
    accent: "text-brand-green",
    iconBg: "bg-brand-green/10",
    span: "md:col-span-1",
    large: false,
  },
  {
    id: "custom",
    title: "Custom Module Development",
    description: "Tailored engineering to add unique features or data exports to Hoteleo/Restpro, perfectly matched to your business's unique workflow.",
    icon: Code2,
    features: ["Specialized Coding", "Report Templates", "API Integration"],
    color: "from-brand-green/20 to-deep-charcoal/20",
    accent: "text-brand-green",
    iconBg: "bg-brand-green/10",
    span: "md:col-span-3",
    large: true,
  },
];

