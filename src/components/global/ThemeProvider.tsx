"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

/**
 * A global theme context provider wrapper for the application.
 * Manages 'light', 'dark', and 'system' theme states, ensuring consistent styling 
 * via CSS variables and Tailwind class injection.
 * 
 * @param props - Configuration properties including children and theme settings.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
