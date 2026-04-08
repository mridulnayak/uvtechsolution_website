import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Headings
    h1: ({ children }) => (
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 text-deep-charcoal dark:text-slate-white">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-5 text-deep-charcoal dark:text-slate-white">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-bold mt-8 mb-4 text-deep-charcoal dark:text-slate-white">
        {children}
      </h3>
    ),

    // Prose
    p: ({ children }) => (
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 text-lg">
        {children}
      </p>
    ),

    // Lists
    ul: ({ children }) => (
      <ul className="space-y-2 mb-6 pl-6 list-disc text-gray-600 dark:text-gray-300">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="space-y-2 mb-6 pl-6 list-decimal text-gray-600 dark:text-gray-300">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="leading-relaxed">{children}</li>
    ),

    // Code
    code: ({ children }) => (
      <code className="px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-brand-green text-sm font-mono">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="my-6 p-5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-x-auto text-sm font-mono leading-relaxed">
        {children}
      </pre>
    ),

    // Blockquote
    blockquote: ({ children }) => (
      <blockquote className="my-6 pl-5 border-l-4 border-brand-green italic text-gray-600 dark:text-gray-400">
        {children}
      </blockquote>
    ),

    // Links
    a: ({ href, children }) => (
      <Link
        href={href ?? "#"}
        className="text-brand-green hover:text-lime-500 underline underline-offset-2 transition-colors"
      >
        {children}
      </Link>
    ),

    // HR
    hr: () => (
      <hr className="my-10 border-gray-200 dark:border-gray-800" />
    ),

    // Strong / Em
    strong: ({ children }) => (
      <strong className="font-bold text-deep-charcoal dark:text-slate-white">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic text-gray-700 dark:text-gray-300">{children}</em>
    ),

    ...components,
  };
}
