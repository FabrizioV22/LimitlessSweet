"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

interface MagneticWrapperProps {
  children: React.ReactNode;
  strength?: number; // 0.1 to 0.5, default 0.3
  className?: string;
}

/**
 * MagneticWrapper
 * Adds a subtle magnetic pull toward the mouse cursor on fine pointer devices (desktop mouse/trackpad).
 * Gracefully deactivated on touch screens or when prefers-reduced-motion is active.
 */
export const MagneticWrapper: React.FC<MagneticWrapperProps> = ({
  children,
  strength = 0.3,
  className = "inline-block",
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [canAnimate, setCanAnimate] = useState(false);

  useEffect(() => {
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    setCanAnimate(hasFinePointer && !shouldReduceMotion);
  }, [shouldReduceMotion]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring physics for organic cursor reaction
  const springConfig = { stiffness: 260, damping: 20 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canAnimate || !wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;
    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (!canAnimate) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={wrapperRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default MagneticWrapper;
