"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { Testimonial } from "@/types";
import { MOCK_TESTIMONIALS } from "@/data/testimonials";
import { SectionTitle } from "@/components/common/SectionTitle";
import { cn } from "@/lib/utils";

export interface TestimonialsProps {
  testimonials?: Testimonial[];
}

export const Testimonials: React.FC<TestimonialsProps> = ({
  testimonials = MOCK_TESTIMONIALS,
}) => {
  const items = testimonials && testimonials.length > 0 ? testimonials : MOCK_TESTIMONIALS;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  }, [items.length]);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  }, [items.length]);

  const goToSlide = useCallback(
    (index: number) => {
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [currentIndex]
  );

  // Keyboard navigation when focused inside carousel
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevSlide();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      nextSlide();
    }
  };

  // Drag / swipe handler for touch and mouse
  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number }; velocity: { x: number } }
  ) => {
    const swipeThreshold = 40;
    if (info.offset.x < -swipeThreshold || info.velocity.x < -400) {
      nextSlide();
    } else if (info.offset.x > swipeThreshold || info.velocity.x > 400) {
      prevSlide();
    }
  };

  const current = items[currentIndex];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
      scale: 0.97,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 },
      },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 60 : -60,
      opacity: 0,
      scale: 0.97,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
      },
    }),
  };

  return (
    <section
      id="testimonios"
      className="py-16 md:py-24 bg-cream/70 relative overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Opiniones de clientes"
    >
      {/* Decorative background blurs */}
      <div
        className="absolute top-10 left-1/4 w-72 h-72 bg-yellow-light/30 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 right-1/4 w-80 h-80 bg-terracotta/5 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Opiniones"
          title="Lo que dicen nuestros clientes"
          subtitle="Historias reales de personas que vuelven a disfrutar de un postre con total tranquilidad."
          align="center"
        />

        {/* Carousel Container */}
        <div
          ref={containerRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="relative max-w-3xl mx-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-mustard rounded-card"
          aria-live="polite"
        >
          {/* Main Slide Track */}
          <div className="relative min-h-[300px] sm:min-h-[260px] flex items-center justify-center">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={current.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                className="w-full cursor-grab active:cursor-grabbing"
              >
                <article className="bg-white rounded-card shadow-warm p-6 sm:p-8 md:p-10 border border-[#F3EADA]/80 relative overflow-hidden">
                  {/* Decorative Quote Icon */}
                  <Quote
                    className="absolute top-4 right-6 w-14 h-14 text-yellow-light/60 pointer-events-none -z-0"
                    aria-hidden="true"
                  />

                  {/* Header: Avatar, Name, Context */}
                  <div className="flex items-center gap-4 mb-5 relative z-10">
                    <div className="relative h-14 w-14 sm:h-16 sm:w-16 overflow-hidden rounded-full ring-3 ring-yellow-light/80 shadow-sm shrink-0">
                      <Image
                        src={current.avatar}
                        alt={`Foto de ${current.name}`}
                        fill
                        sizes="(max-width: 640px) 56px, 64px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-ink leading-tight">
                        {current.name}
                      </h3>
                      <p className="text-xs sm:text-sm font-medium text-ink-subtle mt-0.5">
                        {current.context}
                      </p>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div
                    className="flex items-center gap-1.5 mb-4 relative z-10"
                    aria-label={`Calificación: ${current.rating} de 5 estrellas`}
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-5 h-5",
                          i < current.rating
                            ? "fill-yellow text-yellow"
                            : "text-neutral-200"
                        )}
                        aria-hidden="true"
                      />
                    ))}
                    <span className="ml-2 text-xs font-semibold text-coffee/80">
                      {current.rating}.0 / 5.0
                    </span>
                  </div>

                  {/* Quote Body */}
                  <blockquote className="text-base sm:text-lg text-ink leading-relaxed italic relative z-10">
                    &ldquo;{current.quote}&rdquo;
                  </blockquote>
                </article>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel Navigation Arrows */}
          <div className="flex items-center justify-between mt-6 sm:mt-8">
            <button
              type="button"
              onClick={prevSlide}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white shadow-warm border border-[#F3EADA] flex items-center justify-center text-ink hover:text-mustard hover:border-mustard/60 hover:shadow-warm-hover active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mustard min-w-[44px] min-h-[44px]"
              aria-label="Testimonio anterior"
            >
              <ChevronLeft className="w-6 h-6" aria-hidden="true" />
            </button>

            {/* Pagination Dots */}
            <div
              className="flex items-center gap-2 sm:gap-2.5"
              role="tablist"
              aria-label="Controles de testimonios"
            >
              {items.map((item, idx) => {
                const isActive = currentIndex === idx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Ver testimonio ${idx + 1} de ${items.length}: ${item.name}`}
                    onClick={() => goToSlide(idx)}
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mustard transition-colors"
                  >
                    <span
                      className={cn(
                        "h-2.5 rounded-full transition-all duration-300 block",
                        isActive
                          ? "w-8 bg-mustard shadow-sm"
                          : "w-2.5 bg-neutral-300 hover:bg-mustard/50"
                      )}
                    />
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={nextSlide}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white shadow-warm border border-[#F3EADA] flex items-center justify-center text-ink hover:text-mustard hover:border-mustard/60 hover:shadow-warm-hover active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mustard min-w-[44px] min-h-[44px]"
              aria-label="Siguiente testimonio"
            >
              <ChevronRight className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>

          {/* Swipe indicator hint for mobile */}
          <p className="sm:hidden text-center text-xs text-ink-subtle mt-3">
            Desliza para ver más opiniones
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
