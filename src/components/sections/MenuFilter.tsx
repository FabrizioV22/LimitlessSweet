"use client";

import React from "react";
import { motion } from "framer-motion";
import { AllergenTag } from "@/types";
import { cn } from "@/lib/utils";

export type FilterOption = "todos" | AllergenTag;

export interface MenuFilterProps {
  activeFilter: FilterOption;
  onSelectFilter: (filter: FilterOption) => void;
}

export const FILTER_OPTIONS: { id: FilterOption; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "sin-gluten", label: "Sin gluten" },
  { id: "sin-nueces", label: "Sin nueces" },
  { id: "vegano", label: "Vegano" },
  { id: "sin-azucar", label: "Sin azúcar" },
  { id: "sin-lacteos", label: "Sin lácteos" },
];

export const MenuFilter: React.FC<MenuFilterProps> = ({
  activeFilter,
  onSelectFilter,
}) => {
  return (
    <div className="w-full overflow-x-auto pb-4 pt-1 sm:overflow-visible">
      <div
        role="tablist"
        aria-label="Filtros de alérgenos y preferencias"
        className="flex items-center gap-2.5 min-w-max px-4 sm:px-0 sm:min-w-0 sm:flex-wrap sm:justify-center"
      >
        {FILTER_OPTIONS.map((option) => {
          const isActive = activeFilter === option.id;

          return (
            <button
              key={option.id}
              role="tab"
              type="button"
              aria-selected={isActive}
              tabIndex={0}
              onClick={() => onSelectFilter(option.id)}
              className={cn(
                "group relative min-h-[44px] px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-mustard focus-visible:ring-offset-2",
                "flex items-center justify-center select-none",
                isActive
                  ? "text-white shadow-sm"
                  : "bg-white text-ink-muted hover:text-ink hover:bg-cream-soft border border-[#EAE3D2]"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="activeFilterPill"
                  className="absolute inset-0 rounded-full bg-mustard shadow-sm"
                  transition={{
                    type: "spring",
                    stiffness: 450,
                    damping: 35,
                  }}
                />
              )}
              <span
                className={cn(
                  "relative z-10 transition-colors duration-150",
                  isActive ? "text-white font-semibold" : "text-ink-muted group-hover:text-ink"
                )}
              >
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
