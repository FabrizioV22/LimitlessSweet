"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Wheat, Leaf, Droplets, Coffee, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionTitle } from "@/components/common/SectionTitle";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export interface WhatWeOfferProps {
  className?: string;
}

interface Pillar {
  id: string;
  title: string;
  description: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  accentHover: string;
}

const PILLARS: Pillar[] = [
  {
    id: "sin-gluten",
    title: "Sin gluten",
    description:
      "100% libre de trazas en un obrador controlado con protocolos estrictos para personas celíacas.",
    badge: "Estándar < 5 ppm",
    icon: Wheat,
    iconBg: "bg-yellow-light/70",
    iconColor: "text-coffee",
    accentHover: "group-hover:border-mustard/60",
  },
  {
    id: "vegano",
    title: "Vegano",
    description:
      "Repostería vegetal creativa elaborada sin ningún derivado de origen animal, llena de sabor.",
    badge: "100% Plant-based",
    icon: Leaf,
    iconBg: "bg-sage-light/80",
    iconColor: "text-sage-dark",
    accentHover: "group-hover:border-sage/60",
  },
  {
    id: "sin-lacteos",
    title: "Sin lácteos",
    description:
      "Bebidas y cremas vegetales de avena, coco y arroz certificadas, libres de caseína y lactosa.",
    badge: "0% Lactosa & Caseína",
    icon: Droplets,
    iconBg: "bg-[#F8EFEA]",
    iconColor: "text-[#754E3C]",
    accentHover: "group-hover:border-[#754E3C]/40",
  },
  {
    id: "cafe-bebidas",
    title: "Café y bebidas",
    description:
      "Café de especialidad de origen orgánico, tueste artesanal e infusiones botánicas aromatizadas.",
    badge: "Grano seleccionado",
    icon: Coffee,
    iconBg: "bg-cream-soft",
    iconColor: "text-mustard",
    accentHover: "group-hover:border-mustard/60",
  },
];

export const WhatWeOffer: React.FC<WhatWeOfferProps> = ({ className }) => {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = shouldReduceMotion
    ? undefined
    : staggerContainer(0.08, 0.05);

  const itemVariants = shouldReduceMotion ? undefined : fadeInUp;

  return (
    <section
      id="ofrecemos"
      aria-label="Nuestras especialidades"
      className={cn(
        "relative py-16 sm:py-20 lg:py-28 bg-cream border-b border-coffee/5 overflow-hidden",
        className
      )}
    >
      {/* Soft background ambient accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-yellow-light/30 blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <SectionTitle
          eyebrow="Especialidades"
          title="Qué ofrecemos"
          subtitle="Opciones pensadas para cada necesidad, preparadas con el máximo cuidado."
          align="center"
        />

        {/* 4 Core Pillars Grid: 4 cols on desktop, 2x2 on tablet, stacked on mobile */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-stretch"
        >
          {PILLARS.map((pillar) => {
            const IconComponent = pillar.icon;

            return (
              <motion.div
                key={pillar.id}
                variants={itemVariants}
                whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={cn(
                  "group relative flex flex-col justify-between bg-white/95 rounded-card p-6 sm:p-7 shadow-warm hover:shadow-warm-hover border border-neutral-200/80 transition-all duration-300",
                  pillar.accentHover
                )}
              >
                <div>
                  {/* Circular Icon Container */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      aria-hidden="true"
                      className={cn(
                        "w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-110",
                        pillar.iconBg,
                        pillar.iconColor
                      )}
                    >
                      <IconComponent className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>

                    <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-subtle bg-cream-soft px-2.5 py-1 rounded-full border border-coffee/10">
                      {pillar.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading text-xl sm:text-2xl font-semibold text-ink group-hover:text-mustard transition-colors duration-200 mb-3">
                    {pillar.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                {/* Subtle bottom indicator line */}
                <div
                  aria-hidden="true"
                  className="mt-6 pt-4 border-t border-coffee/5 flex items-center gap-1.5 text-xs font-semibold text-mustard group-hover:text-mustard-hover transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow flex-shrink-0" />
                  <span>Preparación segura</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default WhatWeOffer;
