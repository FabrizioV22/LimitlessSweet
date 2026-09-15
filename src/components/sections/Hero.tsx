"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export interface HeroProps {
  themeBadge?: string;
  title?: string;
  subtitle?: string;
  ctaMenuHref?: string;
  ctaReserveHref?: string;
  backgroundImage?: string;
  className?: string;
}

export const Hero: React.FC<HeroProps> = ({
  themeBadge = "TEMA DEL MES: FLORES AMARILLAS 🌻",
  title = "Postres que florecen para ti, sin restricciones",
  subtitle = "Un espacio seguro donde cada bocado está pensado para quienes viven con alergias e intolerancias.",
  ctaMenuHref = "#menu",
  ctaReserveHref,
  backgroundImage = "/images/imagen_fondo.jpg",
  className,
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Animation variants conditioned on reduced motion preference
  const containerVariants = shouldReduceMotion
    ? undefined
    : staggerContainer(0.12, 0.05);

  const itemVariants = shouldReduceMotion ? undefined : fadeInUp;

  return (
    <section
      id="inicio"
      aria-label="Presentación Limitless Sweet"
      className={cn(
        "relative min-h-[85vh] sm:min-h-[88vh] flex items-center justify-center overflow-hidden pt-32 pb-20 sm:pt-36 sm:pb-24 lg:pt-44 lg:pb-32",
        className
      )}
    >
      {/* Background Image Container */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <Image
          src={backgroundImage}
          alt="Ambiente cálido de cafetería temática Limitless Sweet"
          fill
          priority
          sizes="100vw"
          className={cn(
            "object-cover object-center transform-gpu",
            !shouldReduceMotion && "animate-ken-burns"
          )}
        />
      </div>

      {/* Dark warm overlay matching reference fondo.png for optimal legibility */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-black/45 sm:bg-black/50"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-black/40 via-transparent to-black/50 pointer-events-none"
      />

      {/* Centered Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          {/* Theme Pill Badge */}
          <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
            <div
              role="status"
              aria-label={themeBadge}
              className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-[#E5A853] text-[#3A291E] font-bold text-xs sm:text-sm tracking-wider uppercase shadow-md border border-[#E5A853]/60 hover:bg-[#d99b46] transition-colors"
            >
              <span>{themeBadge}</span>
            </div>
          </motion.div>

          {/* Centered H1 Heading in Fraunces font */}
          <motion.h1
            variants={itemVariants}
            className="font-heading text-4xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.12] sm:leading-[1.14] tracking-tight max-w-4xl mb-6 sm:mb-8 drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
          >
            {title}
          </motion.h1>

          {/* Centered Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl md:text-2xl text-white/90 font-normal leading-relaxed max-w-2xl sm:max-w-3xl mb-8 sm:mb-10 drop-shadow-[0_1px_6px_rgba(0,0,0,0.4)]"
          >
            {subtitle}
          </motion.p>

          {/* Centered CTA Button(s) */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <a
              href={ctaMenuHref}
              className="inline-flex items-center justify-center px-8 sm:px-10 py-3.5 sm:py-4 rounded-button bg-mustard hover:bg-mustard-hover active:bg-mustard-dark text-white font-semibold text-base sm:text-lg shadow-warm-lg hover:shadow-warm-hover active:scale-95 transition-all duration-200 min-h-[48px]"
            >
              <span>Ver menú</span>
            </a>

            {ctaReserveHref && (
              <a
                href={ctaReserveHref}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 sm:py-4 rounded-button bg-white/20 hover:bg-white/30 active:bg-white/40 text-white backdrop-blur-md font-semibold text-base sm:text-lg border border-white/30 shadow-warm transition-all duration-200 min-h-[48px]"
              >
                <Calendar aria-hidden="true" className="w-5 h-5 text-yellow-light" />
                <span>Reservar mesa</span>
              </a>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
