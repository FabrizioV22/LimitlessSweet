"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Target, Sparkles, HeartHandshake, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MissionVisionProps {
  className?: string;
  missionTitle?: string;
  missionText?: string;
  visionTitle?: string;
  visionText?: string;
}

export const MissionVision: React.FC<MissionVisionProps> = ({
  className,
  missionTitle = "Misión",
  missionText = "Ofrecer productos deliciosos y seguros, creados con ingredientes de alta calidad, para que cada persona pueda disfrutar sin preocupaciones.",
  visionTitle = "Visión",
  visionText = "Convertirnos en el referente de gastronomía inclusiva, donde la seguridad alimentaria y el placer de comer van siempre de la mano.",
}) => {
  const shouldReduceMotion = useReducedMotion();

  const cardVariants = shouldReduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: "easeOut" },
        },
      };

  return (
    <div
      aria-label="Misión y Visión de Limitless Sweet"
      className={cn("grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6", className)}
    >
      {/* Misión Card */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        className="group relative bg-white/95 rounded-card p-6 sm:p-7 shadow-warm hover:shadow-warm-hover border border-neutral-200/70 border-l-4 border-l-mustard transition-all duration-300 hover:-translate-y-1"
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            aria-hidden="true"
            className="w-10 h-10 rounded-full bg-yellow-light/60 flex items-center justify-center text-mustard group-hover:bg-mustard group-hover:text-white transition-colors duration-200"
          >
            <Target className="w-5 h-5" />
          </div>
          <h3 className="font-heading text-xl sm:text-2xl font-semibold text-ink">
            {missionTitle}
          </h3>
        </div>
        <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
          {missionText}
        </p>
      </motion.div>

      {/* Visión Card */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        transition={{ delay: 0.1 }}
        className="group relative bg-white/95 rounded-card p-6 sm:p-7 shadow-warm hover:shadow-warm-hover border border-neutral-200/70 border-l-4 border-l-sage transition-all duration-300 hover:-translate-y-1"
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            aria-hidden="true"
            className="w-10 h-10 rounded-full bg-sage-light/70 flex items-center justify-center text-sage-dark group-hover:bg-sage group-hover:text-white transition-colors duration-200"
          >
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-heading text-xl sm:text-2xl font-semibold text-ink">
            {visionTitle}
          </h3>
        </div>
        <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
          {visionText}
        </p>
      </motion.div>
    </div>
  );
};

export default MissionVision;
