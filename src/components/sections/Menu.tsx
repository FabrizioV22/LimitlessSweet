"use client";

import React, { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Product } from "@/types";
import { MOCK_PRODUCTS } from "@/data/products";
import { SectionTitle } from "@/components/common/SectionTitle";
import { ProductCard } from "@/components/common/ProductCard";
import { MenuFilter, FilterOption } from "./MenuFilter";

export interface MenuProps {
  products?: Product[];
}

export const Menu: React.FC<MenuProps> = ({ products = MOCK_PRODUCTS }) => {
  const [activeFilter, setActiveFilter] = useState<FilterOption>("todos");

  const filteredProducts = useMemo(() => {
    if (activeFilter === "todos") {
      return products;
    }
    return products.filter((p) => p.tags.includes(activeFilter));
  }, [products, activeFilter]);

  return (
    <section
      id="menu"
      className="py-16 sm:py-20 lg:py-24 bg-cream scroll-mt-20"
      aria-label="Nuestro menú"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Nuestra carta"
          title="Nuestro menú"
          subtitle="Filtra según tu necesidad y encuentra el postre perfecto para ti. Todos nuestros productos son elaborados en un espacio controlado."
        />

        {/* Filter Pills */}
        <div className="mb-10 sm:mb-12">
          <MenuFilter
            activeFilter={activeFilter}
            onSelectFilter={setActiveFilter}
          />
        </div>

        {/* Products Grid with popLayout AnimatePresence */}
        {filteredProducts.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="col-span-full py-12 px-6 text-center bg-white rounded-card border border-[#F3EADA]/80 shadow-warm max-w-md mx-auto my-6"
          >
            <p className="text-ink-muted text-base mb-5 leading-relaxed">
              No encontramos productos con este filtro actualmente.
            </p>
            <button
              type="button"
              onClick={() => setActiveFilter("todos")}
              className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-button bg-mustard hover:bg-mustard-hover active:bg-mustard-dark text-white text-sm font-medium transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-mustard focus-visible:ring-offset-2"
            >
              Ver todos los productos
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};
