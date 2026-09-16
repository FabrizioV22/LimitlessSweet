"use client";

import React from "react";
import { motion, useScroll, useReducedMotion } from "framer-motion";

/**
 * ScrollProgress
 * Thin progress bar fixed at the top of the viewport indicating page scroll progress.
 * Deactivated when prefers-reduced-motion is detected.
 */
export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[3px] bg-mustard z-[60] origin-left pointer-events-none shadow-sm"
      style={{ scaleX: scrollYProgress }}
    />
  );
};

export default ScrollProgress;
