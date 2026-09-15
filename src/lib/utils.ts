import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AllergenTag } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  // Formato oficial de moneda en Perú: Soles (S/)
  return `S/ ${price.toFixed(2)}`;
}

export interface AllergenMeta {
  label: string;
  badgeBg: string;
  badgeText: string;
  border: string;
}

export const ALLERGEN_METADATA: Record<AllergenTag, AllergenMeta> = {
  "sin-gluten": {
    label: "Sin gluten",
    badgeBg: "bg-[#F7EFE2]",
    badgeText: "text-[#6B4F3A]",
    border: "border-[#E8DEC8]",
  },
  "sin-nueces": {
    label: "Sin nueces",
    badgeBg: "bg-[#F3EFE9]",
    badgeText: "text-[#5C5346]",
    border: "border-[#DFD6C9]",
  },
  vegano: {
    label: "Vegano",
    badgeBg: "bg-[#EBF1E3]",
    badgeText: "text-[#4D6031]",
    border: "border-[#CCDDBE]",
  },
  "sin-azucar": {
    label: "Sin azúcar",
    badgeBg: "bg-[#FBF0DF]",
    badgeText: "text-[#785324]",
    border: "border-[#EED9B8]",
  },
  "sin-lacteos": {
    label: "Sin lácteos",
    badgeBg: "bg-[#F8EFEA]",
    badgeText: "text-[#754E3C]",
    border: "border-[#E7D6CD]",
  },
  "contiene-huevo": {
    label: "Contiene huevo",
    badgeBg: "bg-[#FFF2D9]",
    badgeText: "text-[#785E22]",
    border: "border-[#F1DCAE]",
  },
};
