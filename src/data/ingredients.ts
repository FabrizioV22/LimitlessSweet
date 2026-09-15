import { IngredientEntry } from "@/types";

/**
 * DATOS DE EJEMPLO (PLACEHOLDER)
 * Transparencia total de ingredientes y certificaciones por producto.
 */
export const MOCK_INGREDIENTS: IngredientEntry[] = [
  {
    id: "ing-brownie",
    productName: "Brownie sin gluten",
    description:
      "Harina de almendra certificada sin trazas, cacao orgánico, edulcorante natural de stevia, aceite de coco, vainilla pura.",
    certifications: ["Certificado sin gluten", "Vegano certificado"],
  },
  {
    id: "ing-cheesecake",
    productName: "Cheesecake vegano de maracuyá",
    description:
      "Base de harina de arroz y coco, crema de anacardos, puré de maracuyá fresco, agar-agar, edulcorante de monk fruit.",
    certifications: ["Sin frutos secos", "Vegano"],
  },
  {
    id: "ing-tarta",
    productName: "Tarta de flores amarillas y limón",
    description:
      "Crema de limón con leche de avena, merengue vegetal, flores comestibles certificadas, base crujiente de semillas.",
    certifications: ["Sin azúcar añadido", "Flores certificadas"],
  },
  {
    id: "ing-galletas",
    productName: "Galletas sin azúcar de avena",
    description:
      "Avena certificada sin gluten, compota de manzana orgánica, canela de Ceilán, aceite de oliva virgen extra.",
    certifications: ["Certificado sin gluten", "Sin azúcar añadida"],
  },
  {
    id: "ing-muffin",
    productName: "Muffin sin lácteos de arándanos",
    description:
      "Harina de arroz integral, arándanos silvestres, bebida de avena certificada libre de gluten y vainilla de Madagascar.",
    certifications: ["100% Libre de lácteos", "Vegano"],
  },
  {
    id: "ing-cookie",
    productName: "Cookie sin frutos secos de chocolate",
    description:
      "Harina de maíz y mijo no-GMO, cobertura de cacao 70% orgánico, azúcar de coco y manteca de cacao pura.",
    certifications: ["Línea libre de trazas de nuez", "Certificado sin gluten"],
  },
];
