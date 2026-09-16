import React from "react";
import { cn } from "@/lib/utils";

export interface SectionDividerProps {
  /**
   * Position of the divider relative to the section ('top' or 'bottom')
   */
  position?: "top" | "bottom";
  /**
   * Tailwind text color class representing the fill color (e.g., 'text-cream-soft', 'text-white', 'text-coffee-dark')
   */
  colorClass?: string;
  /**
   * Horizontally mirror the wave shape for natural visual variety
   */
  flipX?: boolean;
  /**
   * Additional container CSS classes
   */
  className?: string;
}

/**
 * SectionDivider
 * Organic sweeping wave SVG divider connecting sections seamlessly.
 * Uses consistent prominent wave dimensions (h-[28px] sm:h-[44px] lg:h-[60px])
 * across all sections for a balanced, harmonious rhythm throughout the site.
 */
export const SectionDivider: React.FC<SectionDividerProps> = ({
  position = "bottom",
  colorClass = "text-cream-soft",
  flipX = false,
  className,
}) => {
  const isTop = position === "top";

  return (
    <div
      aria-hidden="true"
      className={cn(
        "w-full overflow-hidden leading-none pointer-events-none z-10",
        isTop ? "-mb-px" : "-mt-px",
        className
      )}
    >
      <svg
        viewBox="0 0 1440 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className={cn(
          "w-full h-[28px] sm:h-[44px] lg:h-[60px] block transition-colors",
          colorClass,
          isTop && "rotate-180",
          flipX && "-scale-x-100"
        )}
      >
        <path
          d="M0,32 C280,64 520,6 780,36 C1040,64 1260,10 1440,28 L1440,64 L0,64 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};

export default SectionDivider;
