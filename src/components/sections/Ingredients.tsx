"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ShieldCheck, Check } from "lucide-react";
import { IngredientEntry } from "@/types";
import { MOCK_INGREDIENTS } from "@/data/ingredients";
import { SectionTitle } from "@/components/common/SectionTitle";
import { cn } from "@/lib/utils";

export interface IngredientsProps {
  ingredients?: IngredientEntry[];
}

export const Ingredients: React.FC<IngredientsProps> = ({
  ingredients = MOCK_INGREDIENTS,
}) => {
  const [openItemId, setOpenItemId] = useState<string | null>("ing-brownie");

  const toggleItem = (id: string) => {
    setOpenItemId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="insumos"
      className="py-16 sm:py-20 lg:py-24 bg-cream scroll-mt-20"
      aria-label="Lista de insumos"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Transparencia"
          title="Lista de insumos"
          subtitle="Transparencia total: conoce los ingredientes y certificaciones de cada producto. Trabajamos únicamente con proveedores auditados para garantizar la ausencia de contaminación cruzada."
        />

        {/* Accessible Accordion List */}
        <div className="space-y-4">
          {ingredients.map((item) => {
            const isOpen = openItemId === item.id;

            return (
              <div
                key={item.id}
                className="border border-[#F3EADA] rounded-card bg-white shadow-warm overflow-hidden transition-all duration-200"
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
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow-light/60 text-coffee">
                      <ShieldCheck className="w-5 h-5 text-mustard" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-ink leading-snug">
                      {item.productName}
                    </h3>
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
                        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-6 pb-6 pt-3 border-t border-[#F3EADA]/70 space-y-4 bg-cream/30">
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
                                  <Check className="w-3.5 h-3.5 text-sage" aria-hidden="true" />
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
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
