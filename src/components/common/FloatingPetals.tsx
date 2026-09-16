"use client";

import React, { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface PetalConfig {
  id: number;
  left: string;
  size: number;
  duration: string;
  delay: string;
  driftClass: string;
  rotate: number;
  opacity: number;
}

const PETALS: PetalConfig[] = [
  { id: 1, left: "10%", size: 24, duration: "14s", delay: "0s", driftClass: "animate-float-petal-1", rotate: 15, opacity: 0.65 },
  { id: 2, left: "26%", size: 18, duration: "17s", delay: "4s", driftClass: "animate-float-petal-2", rotate: -25, opacity: 0.55 },
  { id: 3, left: "48%", size: 22, duration: "15s", delay: "7s", driftClass: "animate-float-petal-1", rotate: 45, opacity: 0.6 },
  { id: 4, left: "67%", size: 26, duration: "18s", delay: "2s", driftClass: "animate-float-petal-2", rotate: -15, opacity: 0.5 },
  { id: 5, left: "82%", size: 20, duration: "16s", delay: "9s", driftClass: "animate-float-petal-1", rotate: 30, opacity: 0.65 },
  { id: 6, left: "93%", size: 16, duration: "13s", delay: "5s", driftClass: "animate-float-petal-2", rotate: -40, opacity: 0.55 },
];

/**
 * FloatingPetals
 * Subtle organic floating yellow petals reinforcing the "Flores Amarillas" seasonal theme.
 * Strictly non-interactive (pointer-events-none) and fully disabled under prefers-reduced-motion.
 */
export const FloatingPetals: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || shouldReduceMotion) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden -z-10"
    >
      {PETALS.map((petal) => (
        <div
          key={petal.id}
          className={`absolute bottom-[-40px] ${petal.driftClass}`}
          style={{
            left: petal.left,
            animationDuration: petal.duration,
            animationDelay: petal.delay,
            opacity: petal.opacity,
          }}
        >
          <svg
            width={petal.size}
            height={petal.size * 1.3}
            viewBox="0 0 24 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: `rotate(${petal.rotate}deg)` }}
          >
            <defs>
              <linearGradient id={`petal-grad-${petal.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE047" stopOpacity="0.9" />
                <stop offset="60%" stopColor="#F4C542" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#D98E4A" stopOpacity="0.7" />
              </linearGradient>
            </defs>
            {/* Organic petal leaf curve */}
            <path
              d="M12 1 C18 7, 23 15, 17 26 C14 31, 10 31, 7 26 C1 15, 6 7, 12 1 Z"
              fill={`url(#petal-grad-${petal.id})`}
            />
            {/* Delicate inner petal spine */}
            <path
              d="M12 5 C12.5 13, 12 21, 12 27"
              stroke="#FBF3E4"
              strokeWidth="0.8"
              strokeOpacity="0.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default FloatingPetals;
