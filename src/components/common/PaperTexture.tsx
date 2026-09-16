import React, { useId } from "react";
import { cn } from "@/lib/utils";

export interface PaperTextureProps {
  className?: string;
  opacity?: string;
}

/**
 * PaperTexture
 * Subtle SVG fractal noise texture giving an artisanal paper feel to selected key sections.
 * Non-intrusive (pointer-events-none, mix-blend-multiply, very low opacity ~0.035).
 */
export const PaperTexture: React.FC<PaperTextureProps> = ({
  className = "",
  opacity = "opacity-[0.035]",
}) => {
  const uniqueId = useId().replace(/:/g, "-");
  const filterId = `paper-grain-${uniqueId}`;

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "absolute inset-0 w-full h-full pointer-events-none mix-blend-multiply select-none -z-10",
        opacity,
        className
      )}
    >
      <defs>
        <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
      <rect width="100%" height="100%" filter={`url(#${filterId})`} />
    </svg>
  );
};

export default PaperTexture;
