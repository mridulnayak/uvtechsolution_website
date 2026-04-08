/**
 * Defines the structural variants available for the Skeleton indicator.
 */
type SkeletonVariantType = "blog" | "product" | "default";

/**
 * Interface for the SkeletonCard component properties.
 */
interface SkeletonCardProps {
  /** The specific layout variant to render. Defaults to "blog". */
  skeletonVariant?: SkeletonVariantType;
  /** Optional custom CSS classes for the outermost container. */
  className?: string;
}

/**
 * A highly reusable placeholder component used during asynchronous data fetching.
 * Implements a shimmering effect ("shimmer" class) to provide visual feedback.
 * Supports multiple distinct layouts aligned with the primary data structures (e.g., Blog or Product).
 */
export function SkeletonCard({ 
  skeletonVariant = "blog", 
  className = "" 
}: SkeletonCardProps) {
  
  if (skeletonVariant === "blog") {
    return (
      <div className={`rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-white dark:bg-deep-charcoal ${className}`}>
        {/* Placeholder for the blog post hero image */}
        <div className="aspect-video w-full shimmer" />
        <div className="p-6 space-y-3">
          {/* Category and date row placeholders */}
          <div className="flex justify-between">
            <div className="h-3 w-16 rounded-full shimmer" />
            <div className="h-3 w-20 rounded-full shimmer" />
          </div>
          {/* Title placeholders (two lines) */}
          <div className="h-5 w-full rounded-lg shimmer" />
          <div className="h-5 w-4/5 rounded-lg shimmer" />
          {/* Excerpt placeholders (three lines) */}
          <div className="h-3 w-full rounded shimmer" />
          <div className="h-3 w-full rounded shimmer" />
          <div className="h-3 w-2/3 rounded shimmer" />
          {/* Author avatar and name placeholders */}
          <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
            <div className="w-8 h-8 rounded-full shimmer" />
            <div className="h-3 w-24 rounded shimmer" />
          </div>
        </div>
      </div>
    );
  }

  if (skeletonVariant === "product") {
    return (
      <div className={`flex flex-col lg:flex-row gap-12 items-center ${className}`}>
        {/* Placeholder for the product showcase image */}
        <div className="w-full lg:w-1/2">
          <div className="aspect-video lg:aspect-square w-full rounded-3xl shimmer" />
        </div>
        
        {/* Placeholder for product details and metadata */}
        <div className="w-full lg:w-1/2 space-y-4">
          <div className="h-6 w-32 rounded-full shimmer" />
          <div className="h-8 w-3/4 rounded-xl shimmer" />
          <div className="h-4 w-full rounded shimmer" />
          <div className="h-4 w-full rounded shimmer" />
          <div className="h-4 w-4/5 rounded shimmer" />
          
          {/* Feature list placeholders */}
          <div className="space-y-3 pt-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full shimmer flex-shrink-0" />
                <div className="h-4 w-48 rounded shimmer" />
              </div>
            ))}
          </div>
          
          {/* Action button placeholders */}
          <div className="flex gap-4 pt-4">
            <div className="h-11 w-36 rounded-full shimmer" />
            <div className="h-11 w-44 rounded-full shimmer" />
          </div>
        </div>
      </div>
    );
  }

  // Default block-based text skeleton
  return (
    <div className={`rounded-2xl p-6 border border-gray-100 dark:border-gray-800 space-y-3 ${className}`}>
      <div className="h-4 w-full rounded shimmer" />
      <div className="h-4 w-4/5 rounded shimmer" />
      <div className="h-4 w-3/5 rounded shimmer" />
    </div>
  );
}
