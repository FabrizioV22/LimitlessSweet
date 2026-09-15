"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, ShieldCheck } from "lucide-react";
import { FAQItem } from "@/types";
import { MOCK_FAQS } from "@/data/faqs";
import { SectionTitle } from "@/components/common/SectionTitle";
import { cn } from "@/lib/utils";

export interface FAQProps {
  faqs?: FAQItem[];
}

export const FAQ: React.FC<FAQProps> = ({ faqs = MOCK_FAQS }) => {
  const items = faqs && faqs.length > 0 ? faqs : MOCK_FAQS;

  // Set the first item open by default for immediate discoverability
  const [openId, setOpenId] = useState<string | null>(items[0]?.id || null);

  const toggleItem = (id: string) => {
    setOpenId((currentId) => (currentId === id ? null : id));
  };

  return (
    <section
      id="faq"
      className="py-16 md:py-24 bg-white relative overflow-hidden"
      aria-label="Preguntas frecuentes"
    >
      {/* Decorative background blurs */}
      <div
        className="absolute top-1/3 -right-24 w-96 h-96 bg-cream-soft rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 -left-20 w-80 h-80 bg-yellow-light/20 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Dudas frecuentes"
          title="Preguntas frecuentes"
          subtitle="Todo lo que necesitas saber sobre nuestros procesos de seguridad, alérgenos y reservas."
          align="center"
        />

        {/* Accordion Container */}
        <div className="mt-8 space-y-4" role="region" aria-label="Acordeón de preguntas frecuentes">
          {items.map((item, index) => {
            const isOpen = openId === item.id;
            const triggerId = `faq-trigger-${item.id}`;
            const panelId = `faq-panel-${item.id}`;

            return (
              <div
                key={item.id}
                className={cn(
                  "rounded-2xl transition-all duration-300 border bg-[#FAF7F2]/60",
                  isOpen
                    ? "bg-white border-mustard/60 shadow-warm ring-1 ring-mustard/20"
                    : "border-[#F3EADA] hover:border-mustard/40 hover:bg-white"
                )}
              >
                <h3>
                  <button
                    type="button"
                    id={triggerId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleItem(item.id)}
                    className="w-full py-4 sm:py-5 px-5 sm:px-6 flex items-center justify-between gap-4 text-left transition-colors min-h-[56px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mustard rounded-2xl"
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-colors shrink-0",
                          isOpen
                            ? "bg-mustard text-white"
                            : "bg-neutral-200/80 text-coffee/80"
                        )}
                        aria-hidden="true"
                      >
                        {index + 1}
                      </span>
                      <span className="font-heading font-semibold text-base sm:text-lg text-ink">
                        {item.question}
                      </span>
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-5 h-5 shrink-0 text-mustard transition-transform duration-300",
                        isOpen && "rotate-180"
                      )}
                      aria-hidden="true"
                    />
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                >
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1">
                          <div className="border-t border-[#F3EADA]/70 pt-3 text-ink-muted text-sm sm:text-base leading-relaxed">
                            <p>{item.answer}</p>
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

        {/* Additional Help Callout */}
        <div className="mt-10 sm:mt-12 p-5 sm:p-6 rounded-2xl bg-cream-soft border border-yellow/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-left">
            <div className="p-2.5 rounded-xl bg-yellow-light/80 text-coffee shrink-0">
              <HelpCircle className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-ink">
                ¿Tienes alguna alergia o requerimiento particular?
              </h4>
              <p className="text-xs sm:text-sm text-ink-muted">
                Nuestro personal está capacitado para detallarte cada paso de elaboración.
              </p>
            </div>
          </div>
          <a
            href="#reserva"
            className="shrink-0 inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-button bg-mustard hover:bg-mustard-hover text-white text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mustard"
          >
            Preguntar en mi reserva
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
