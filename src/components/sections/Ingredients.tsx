"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown, ShieldCheck, Check, Sparkles, Award } from "lucide-react";
import { IngredientEntry } from "@/types";
import { MOCK_INGREDIENTS } from "@/data/ingredients";
import { SectionTitle } from "@/components/common/SectionTitle";
import { cn } from "@/lib/utils";

export interface IngredientsProps {
  ingredients?: IngredientEntry[];
}

const INGREDIENT_VISUALS: Record<
  string,
  { image: string; tag: string; origin: string }
> = {
  "ing-brownie": {
    image: "/images/product-brownie.jpg",
    tag: "Cacao Orgánico & Flor de Sal",
    origin: "Chanchamayo & Maras, Perú",
  },
  "ing-cheesecake": {
    image: "/images/product-cheesecake.jpg",
    tag: "Maracuyá Fresco & Leche de Coco",
    origin: "Selva Central & Tarapoto",
  },
  "ing-tarta": {
    image: "/images/product-tarta-limon.jpg",
    tag: "Flores Comestibles & Cítricos",
    origin: "Huerto Botánico Certificado",
  },
  "ing-galletas": {
    image: "/images/product-cookies-avena.jpg",
    tag: "Avena Certificada Sin Gluten",
    origin: "Molino Certificado Libre de Trazas",
  },
  "ing-muffin": {
    image: "/images/product-muffin.jpg",
    tag: "Arándanos Silvestres & Vainilla",
    origin: "Valles del Sur del Perú",
  },
  "ing-cookie": {
    image: "/images/product-cookie-chocolate.jpg",
    tag: "Cacao 70% & Sin Trazas de Nuez",
    origin: "Línea de Envasado Segregada",
  },
};

export const Ingredients: React.FC<IngredientsProps> = ({
  ingredients = MOCK_INGREDIENTS,
}) => {
  const [openItemId, setOpenItemId] = useState<string | null>("ing-brownie");
  const [spotlightItemId, setSpotlightItemId] = useState<string>("ing-brownie");
  const [isPaused, setIsPaused] = useState(false);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const shouldReduceMotion = useReducedMotion();

  const toggleItem = (id: string) => {
    setSpotlightItemId(id);
    setOpenItemId((prev) => (prev === id ? null : id));
  };

  // Rotación suave y automática del tablero destacado con tiempo suficiente (8 segundos)
  // Se pausa automáticamente al interactuar o pasar el cursor para leer tranquilamente.
  // NO depende del scroll para evitar cambios involuntarios al desplazarse.
  useEffect(() => {
    if (shouldReduceMotion || isPaused || ingredients.length <= 1) return;

    const interval = setInterval(() => {
      setSpotlightItemId((currentId) => {
        const currentIndex = ingredients.findIndex((item) => item.id === currentId);
        const nextIndex = (currentIndex + 1) % ingredients.length;
        const nextId = ingredients[nextIndex]?.id || ingredients[0].id;
        setOpenItemId(nextId);
        return nextId;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [isPaused, shouldReduceMotion, ingredients]);

  const activeVisual =
    INGREDIENT_VISUALS[spotlightItemId] || INGREDIENT_VISUALS["ing-brownie"];
  const activeProduct =
    ingredients.find((i) => i.id === spotlightItemId) || ingredients[0];

  return (
    <section
      id="insumos"
      className="py-20 sm:py-24 lg:py-28 bg-white scroll-mt-20 relative overflow-hidden"
      aria-label="Lista de insumos"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Transparencia"
          title="Lista de insumos"
          subtitle="Transparencia total: conoce los ingredientes y certificaciones de cada producto. Trabajamos únicamente con proveedores auditados para garantizar la ausencia de contaminación cruzada."
        />

        {/* Scrollytelling 2-column layout on desktop, stacked on mobile */}
        <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-12 items-start">
          {/* Left Column: Sticky Editorial Showcase (Desktop) */}
          <div className="hidden lg:block lg:col-span-5 sticky top-28">
            <div className="bg-white rounded-card shadow-warm-lg border border-[#F3EADA] overflow-hidden p-6 relative">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[#FBF3E4] mb-5 shadow-sm">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={spotlightItemId}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={activeVisual.image}
                      alt={activeProduct.productName}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
                      <span className="bg-mustard/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                        {activeVisual.tag}
                      </span>
                      <span className="bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px]">
                        {activeVisual.origin}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Editorial Caption */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-mustard">
                  <Sparkles className="w-4 h-4 text-yellow" />
                  <span>Ingrediente Destacado</span>
                </div>
                <h3 className="font-heading text-2xl font-bold text-ink">
                  {activeProduct.productName}
                </h3>
                <p className="text-sm text-ink-muted leading-relaxed">
                  {activeProduct.description}
                </p>

                {/* Audit reassurance seal */}
                <div className="pt-3 border-t border-coffee/10 flex items-center gap-2.5 text-xs text-coffee font-medium">
                  <Award className="w-4 h-4 text-mustard shrink-0" />
                  <span>Trazabilidad auditada y libre de trazas (&lt; 5 ppm)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Scrollable Accordion List */}
          <div className="lg:col-span-7 space-y-4">
            {ingredients.map((item, idx) => {
              const isOpen = openItemId === item.id;
              const isSpotlight = spotlightItemId === item.id;

              return (
                <motion.div
                  key={item.id}
                  ref={(el) => {
                    cardRefs.current[item.id] = el;
                  }}
                  data-ingredient-id={item.id}
                  className={cn(
                    "border rounded-card bg-white shadow-warm overflow-hidden transition-all duration-300",
                    isSpotlight
                      ? "border-mustard/60 ring-2 ring-mustard/15 shadow-warm-hover"
                      : "border-[#F3EADA] hover:border-mustard/30"
                  )}
                >
                  <button
                    type="button"
                    id={`accordion-trigger-${item.id}`}
                    aria-expanded={isOpen}
                    aria-controls={`accordion-panel-${item.id}`}
                    onClick={() => toggleItem(item.id)}
                    className="w-full min-h-[44px] flex items-center justify-between p-5 sm:p-6 text-left transition-colors duration-200 hover:bg-cream-soft/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-mustard focus-visible:ring-inset"
                  >
                    <div className="flex items-center gap-3.5 pr-4">
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
                          isSpotlight
                            ? "bg-mustard text-white"
                            : "bg-yellow-light/60 text-coffee"
                        )}
                      >
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-ink leading-snug">
                          {item.productName}
                        </h3>
                        <p className="text-xs text-ink-subtle mt-0.5 line-clamp-1">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <ChevronDown
                      className={cn(
                        "w-5 h-5 text-coffee transition-transform duration-300 shrink-0",
                        isOpen && "rotate-180 text-mustard"
                      )}
                      aria-hidden="true"
                    />
                  </button>

                  <div
                    id={`accordion-panel-${item.id}`}
                    role="region"
                    aria-labelledby={`accordion-trigger-${item.id}`}
                  >
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.3,
                            ease: [0.25, 0.1, 0.25, 1],
                          }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 sm:px-6 pb-6 pt-3 border-t border-[#F3EADA]/70 space-y-4 bg-cream/30">
                            {/* Mobile thumbnail image preview */}
                            <div className="block lg:hidden relative h-36 w-full rounded-xl overflow-hidden shadow-xs">
                              <Image
                                src={
                                  (INGREDIENT_VISUALS[item.id] ||
                                    INGREDIENT_VISUALS["ing-brownie"]).image
                                }
                                alt={item.productName}
                                fill
                                sizes="(max-width: 640px) 100vw, 50vw"
                                className="object-cover"
                              />
                            </div>

                            {/* Ingredient Description */}
                            <div>
                              <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1.5">
                                Ingredientes detallados
                              </h4>
                              <p className="text-sm sm:text-base text-ink leading-relaxed">
                                {item.description}
                              </p>
                            </div>

                            {/* Certification Badges */}
                            <div>
                              <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-2">
                                Garantías & Certificaciones
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {item.certifications.map((cert) => (
                                  <span
                                    key={cert}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-sage-light/70 text-sage-dark border border-sage/30 shadow-xs"
                                  >
                                    <Check
                                      className="w-3.5 h-3.5 text-sage"
                                      aria-hidden="true"
                                    />
                                    {cert}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Ingredients;
