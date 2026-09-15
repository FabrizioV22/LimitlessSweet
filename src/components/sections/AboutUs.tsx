"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Users, Award, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { MissionVision } from "./MissionVision";

export interface AboutUsProps {
  className?: string;
}

export const AboutUs: React.FC<AboutUsProps> = ({ className }) => {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = shouldReduceMotion
    ? undefined
    : staggerContainer(0.1, 0.05);

  const itemVariants = shouldReduceMotion ? undefined : fadeInUp;

  return (
    <section
      id="nosotros"
      aria-label="Sobre nosotros y quiénes somos"
      className={cn(
        "relative py-16 sm:py-20 lg:py-28 bg-cream-soft border-b border-coffee/5 overflow-hidden",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Panoramic Team Banner (visible on mobile/tablet) */}
        <div className="block lg:hidden mb-10">
          <div className="relative w-full aspect-[16/7] sm:aspect-[16/6] rounded-card overflow-hidden shadow-warm border-2 border-white bg-cream">
            <Image
              src="/images/about-team-panoramic.jpg"
              alt="Equipo de Limitless Sweet en la cafetería inclusiva"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-coffee-dark/50 via-transparent to-transparent pointer-events-none"
            />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs font-medium drop-shadow">
              <span className="flex items-center gap-1.5 bg-coffee-dark/70 backdrop-blur-sm px-2.5 py-1 rounded-full">
                <Users className="w-3.5 h-3.5 text-yellow" />
                <span>Equipo de maestros reposteros</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 bg-mustard/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-white font-semibold">
                Certificados en alérgenos
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column Main Layout for Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Eyebrow, Heading, Narrative Story & MissionVision cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* Eyebrow badge */}
            <motion.span
              variants={itemVariants}
              className="inline-block px-3.5 py-1 mb-3 text-xs font-semibold tracking-wider uppercase rounded-full bg-yellow-light/60 text-coffee border border-yellow/40"
            >
              Nuestra historia
            </motion.span>

            {/* H2 Title */}
            <motion.h2
              variants={itemVariants}
              className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-ink tracking-tight mb-6"
            >
              Quiénes somos
            </motion.h2>

            {/* Exact Brand Copy Story Paragraphs */}
            <motion.div
              variants={itemVariants}
              className="space-y-4 text-base sm:text-lg text-ink-muted leading-relaxed mb-8"
            >
              <p>
                Limitless Sweet nació de una idea simple pero poderosa: que nadie
                debería sentirse excluido al elegir un postre. Somos una cafetería
                temática donde cada mes elegimos un nuevo tema —este mes, flores
                amarillas— y creamos experiencias sensoriales únicas.
              </p>
              <p>
                Nuestro equipo trabaja con proveedores certificados y recetas
                probadas para garantizar que cada producto sea seguro para quienes
                conviven con alergias e intolerancias alimentarias.
              </p>
            </motion.div>

            {/* Embedded Mission & Vision Cards */}
            <motion.div variants={itemVariants} className="w-full pt-2">
              <MissionVision />
            </motion.div>
          </motion.div>

          {/* Right Column: Square Team Photo on Desktop */}
          <div className="hidden lg:block lg:col-span-5 relative sticky top-28">
            {/* Soft decorative ambient glow */}
            <div
              aria-hidden="true"
              className="absolute -inset-3 rounded-[28px] bg-gradient-to-tr from-yellow-light/50 via-sage-light/40 to-cream opacity-70 blur-xl -z-10"
            />

            <div className="group relative aspect-square rounded-card overflow-hidden shadow-warm-lg border-2 border-white bg-cream">
              <Image
                src="/images/about-team.jpg"
                alt="Equipo de reposteros de Limitless Sweet elaborando postres sin gluten ni alérgenos"
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />

              {/* Bottom gradient accent */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-coffee-dark/60 via-transparent to-transparent pointer-events-none"
              />

              {/* Floating Reassurance Tag */}
              <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md rounded-button p-4 border border-cream-soft shadow-warm flex items-center gap-3.5">
                <div
                  aria-hidden="true"
                  className="w-11 h-11 rounded-full bg-sage-light flex items-center justify-center text-sage-dark flex-shrink-0"
                >
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-ink">
                    100% Inclusivo & Seguro
                  </p>
                  <p className="text-xs text-ink-muted">
                    Capacitación constante en contaminación cruzada
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
