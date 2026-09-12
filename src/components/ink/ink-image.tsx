import { useReveal } from "@/lib/hooks/use-reveal";
import { cn } from "@/lib/utils";

/**
 * An image that soaks in through an ink-blot mask when scrolled into view.
 * Used inline on lite/off tiers where the hover plate isn't available.
 */
export function InkImage({
  src,
  alt,
  className,
  width = 1200,
  height = 750,
}: {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}) {
  const { ref, isVisible } = useReveal<HTMLDivElement>({ threshold: 0.25 });
  return (
    <div
      ref={ref}
      className={cn("ink-mask overflow-hidden rounded-sm", isVisible && "is-visible", className)}
    >
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full"
      />
    </div>
  );
}
