/**
 * Interface for the Logo component properties.
 */
interface LogoProps {
  /** Optional CSS class names to apply to the SVG element. */
  className?: string;
}

/**
 * Standardized SVG Logo component for UV Tech Solutions.
 * Designed as a scalable vector asset for use across navigation and branding sections.
 * 
 * @param props - Styling properties for the logo.
 */
export function Logo({ className = "w-10 h-10" }: LogoProps) {
  return (
    <svg viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M50 20 L80 80 L110 20" fill="currentColor" />
      <path d="M120 70 H 180 M120 80 H 180 M20 80 H 40" stroke="currentColor" strokeWidth="6" />
    </svg>
  );
}

