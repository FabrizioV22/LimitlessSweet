import { Product } from "@/types";

/**
 * DATOS DE EJEMPLO (PLACEHOLDER)
 * Los siguientes productos corresponden a los mockups aprobados.
 * Pendientes de validación final con el negocio antes del paso a producción.
 */
export const MOCK_PRODUCTS: Product[] = [
  {
    id: "brownie-sin-gluten",
    name: "Brownie sin gluten",
    price: 16.0,
    description: "Fudgy, con cacao orgánico y un toque de flor de sal.",
    image: "/images/product-brownie.jpg",
    tags: ["sin-gluten", "vegano", "sin-azucar"],
    status: "available",
    isThemeOfMonth: true,
  },
  {
    id: "cheesecake-vegano-maracuya",
    name: "Cheesecake vegano de maracuyá",
    price: 22.0,
    description: "Base de coco y arroz, crema de maracuyá fresca.",
    image: "/images/product-cheesecake.jpg",
    tags: ["sin-gluten", "sin-nueces", "vegano"],
    status: "sold-out-today",
  },
  {
    id: "galletas-sin-azucar-avena",
    name: "Galletas sin azúcar de avena",
    price: 11.0,
    description: "Crujientes por fuera y suaves por dentro, con canela.",
    image: "/images/product-cookies-avena.jpg",
    tags: ["sin-gluten", "sin-azucar"],
    status: "available",
  },
  {
    id: "tarta-flores-amarillas-limon",
    name: "Tarta de flores amarillas y limón",
    price: 24.0,
    description: "Crema cítrica suave, merengue vegetal y flores comestibles.",
    image: "/images/product-tarta-limon.jpg",
    tags: ["sin-gluten", "sin-nueces", "vegano", "sin-azucar"],
    status: "available",
    isThemeOfMonth: true,
  },
  {
    id: "muffin-sin-lacteos-arandanos",
    name: "Muffin sin lácteos de arándanos",
    price: 14.0,
    description: "Esponjoso con arándanos silvestres y toque de vainilla.",
    image: "/images/product-muffin.jpg",
    tags: ["sin-nueces", "vegano", "sin-lacteos"],
    status: "available",
  },
  {
    id: "cookie-sin-frutos-secos-chocolate",
    name: "Cookie sin frutos secos de chocolate",
    price: 12.0,
    description: "Intensidad de chocolate puro elaborada en línea 100% segura.",
    image: "/images/product-cookie-chocolate.jpg",
    tags: ["sin-gluten", "sin-nueces", "sin-azucar"],
    status: "available",
  },
];
