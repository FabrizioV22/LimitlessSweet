"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { Product } from "@/types";
import { AllergenBadge } from "./AllergenBadge";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [canTilt, setCanTilt] = useState(false);

  useEffect(() => {
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    setCanTilt(hasFinePointer && !shouldReduceMotion);
  }, [shouldReduceMotion]);

  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);

  const rotateX = useSpring(rawRotateX, { stiffness: 300, damping: 25 });
  const rotateY = useSpring(rawRotateY, { stiffness: 300, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!canTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rawRotateY.set(px * 7); // Maximum 7 degrees
    rawRotateX.set(-py * 7);
  };

  const handleMouseLeave = () => {
    rawRotateX.set(0);
    rawRotateY.set(0);
  };

  const isSoldOut = product.status === "sold-out-today";

  const handleAddToCart = () => {
    if (isSoldOut) return;
    setIsAdded(true);
    if (onAddToCart) {
      onAddToCart(product);
    }
    setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite((prev) => !prev);
  };

  return (
    <motion.article
      ref={cardRef}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      whileHover={canTilt ? undefined : { y: -4 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={canTilt ? { rotateX, rotateY, transformPerspective: 800 } : undefined}
      className="group relative flex flex-col bg-white rounded-card shadow-warm hover:shadow-warm-hover transition-all duration-300 overflow-hidden border border-[#F3EADA]/70 will-change-transform"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FBF3E4]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
            isSoldOut ? "grayscale-[20%] opacity-90" : ""
          }`}
        />

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={handleToggleFavorite}
          aria-label={
            isFavorite
              ? `Quitar ${product.name} de favoritos`
              : `Agregar ${product.name} a favoritos`
          }
          className="absolute top-3 right-3 z-10 flex h-11 w-11 min-w-[44px] min-h-[44px] items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-transform active:scale-90 hover:bg-white"
        >
          <Heart
            className={`h-5 w-5 transition-colors duration-200 ${
              isFavorite
                ? "fill-[#D98E4A] text-[#D98E4A]"
                : "text-ink-muted hover:text-ink"
            }`}
          />
        </button>

        {/* Badge "DEL MES" */}
        {product.isThemeOfMonth && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="inline-flex items-center gap-1 rounded-full bg-yellow px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink shadow-sm animate-gentle-pulse">
              DEL MES
            </span>
          </div>
        )}

        {/* Sold Out Overlay Badge */}
        {isSoldOut && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
            <span className="rounded-full bg-white/95 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-ink shadow-md border border-neutral-200">
              Agotado por hoy
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Name and Price */}
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-lg font-bold text-ink leading-tight group-hover:text-coffee transition-colors">
            {product.name}
          </h3>
          <span className="text-lg font-bold text-mustard flex-shrink-0">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Short description */}
        <p className="mt-1.5 text-xs sm:text-sm text-ink-muted line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Allergen Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {product.tags.map((tag) => (
            <AllergenBadge key={tag} tag={tag} size="sm" />
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-auto pt-5">
          {isSoldOut ? (
            <button
              type="button"
              disabled
              aria-disabled="true"
              aria-label={`${product.name} no está disponible hoy. Disponible mañana.`}
              className="w-full h-11 min-h-[44px] rounded-button bg-[#EAE8E4] text-[#8A847C] text-sm font-medium cursor-not-allowed flex items-center justify-center transition-colors"
            >
              Disponible mañana
            </button>
          ) : (
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={handleAddToCart}
              aria-label={`Agregar ${product.name} al pedido por ${formatPrice(product.price)}`}
              className={`w-full h-11 min-h-[44px] rounded-button font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-colors duration-200 ${
                isAdded
                  ? "bg-sage text-white"
                  : "bg-mustard hover:bg-mustard-hover active:bg-mustard-dark text-white"
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>¡Agregado!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Agregar al pedido</span>
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </motion.article>
  );
};
