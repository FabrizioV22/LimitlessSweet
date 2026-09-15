import React from "react";
import { AllergenTag } from "@/types";
import { ALLERGEN_METADATA } from "@/lib/utils";
import { Wheat, Leaf, Ban, Sparkles, Droplets, Egg } from "lucide-react";

interface AllergenBadgeProps {
  tag: AllergenTag;
  showIcon?: boolean;
  className?: string;
  size?: "sm" | "md";
}

export const AllergenBadge: React.FC<AllergenBadgeProps> = ({
  tag,
  showIcon = true,
  className = "",
  size = "sm",
}) => {
  const meta = ALLERGEN_METADATA[tag] || {
    label: tag,
    badgeBg: "bg-cream-soft",
    badgeText: "text-coffee",
    border: "border-[#E8DEC8]",
  };

  const getIcon = () => {
    const iconSize = size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5";
    switch (tag) {
      case "sin-gluten":
        return <Wheat className={iconSize} aria-hidden="true" />;
      case "vegano":
        return <Leaf className={iconSize} aria-hidden="true" />;
      case "sin-nueces":
        return <Ban className={iconSize} aria-hidden="true" />;
      case "sin-azucar":
        return <Sparkles className={iconSize} aria-hidden="true" />;
      case "sin-lacteos":
        return <Droplets className={iconSize} aria-hidden="true" />;
      case "contiene-huevo":
        return <Egg className={iconSize} aria-hidden="true" />;
      default:
        return null;
    }
  };

  const sizeClasses =
    size === "sm"
      ? "text-xs px-2.5 py-1 gap-1.5"
      : "text-sm px-3 py-1.5 gap-2";

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border transition-colors ${meta.badgeBg} ${meta.badgeText} ${meta.border} ${sizeClasses} ${className}`}
    >
      {showIcon && getIcon()}
      <span>{meta.label}</span>
    </span>
  );
};
