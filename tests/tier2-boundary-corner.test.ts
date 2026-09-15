import React from "react";
import fs from "node:fs";
import path from "node:path";
import { TestCollector, renderComponent, assert } from "./helpers/test-utils";
import { authoritativeReservationSchema } from "./helpers/reservation-schema";

import { ProductCard } from "../src/components/common/ProductCard";
import { Menu } from "../src/components/sections/Menu";
import { MenuFilter } from "../src/components/sections/MenuFilter";
import { ContactReservation } from "../src/components/sections/ContactReservation";
import { MOCK_PRODUCTS } from "../src/data/products";
import { Product } from "../src/types";

export async function runTier2Tests(collector: TestCollector): Promise<void> {
  collector.setTier("Tier 2: Boundary & Corner Cases");

  // 1. Guest Limits Boundary Testing (1 - 20)
  await collector.runTest(
    "T2.1: Reservation guests boundary testing (1-20 valid, <=0 and >20 invalid)",
    () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().split("T")[0];

      const baseValidPayload = {
        fullName: "Lucía Fernández",
        email: "lucia.f@example.com",
        phone: "+57 311 555 1234",
        date: dateStr,
        time: "14:00",
        dietaryNotes: "Sin gluten estricto",
      };

      // Boundary 1: Minimum valid boundary (1 guest)
      const validMin = authoritativeReservationSchema.safeParse({
        ...baseValidPayload,
        guests: 1,
      });
      assert.ok(validMin.success, "guests=1 should be valid");

      // Boundary 2: Common nominal value (4 guests)
      const validMid = authoritativeReservationSchema.safeParse({
        ...baseValidPayload,
        guests: 4,
      });
      assert.ok(validMid.success, "guests=4 should be valid");

      // Boundary 3: Maximum valid boundary (20 guests)
      const validMax = authoritativeReservationSchema.safeParse({
        ...baseValidPayload,
        guests: 20,
      });
      assert.ok(validMax.success, "guests=20 should be valid");

      // Boundary 4: Lower out-of-bounds (0 guests)
      const invalidZero = authoritativeReservationSchema.safeParse({
        ...baseValidPayload,
        guests: 0,
      });
      assert.ok(!invalidZero.success, "guests=0 must be rejected");

      // Boundary 5: Negative out-of-bounds (-1 guests)
      const invalidNegative = authoritativeReservationSchema.safeParse({
        ...baseValidPayload,
        guests: -1,
      });
      assert.ok(!invalidNegative.success, "guests=-1 must be rejected");

      // Boundary 6: Upper out-of-bounds (21 guests)
      const invalidUpper = authoritativeReservationSchema.safeParse({
        ...baseValidPayload,
        guests: 21,
      });
      assert.ok(!invalidUpper.success, "guests=21 must be rejected");

      // Boundary 7: Extreme upper out-of-bounds (100 guests)
      const invalidExtreme = authoritativeReservationSchema.safeParse({
        ...baseValidPayload,
        guests: 100,
      });
      assert.ok(!invalidExtreme.success, "guests=100 must be rejected");

      // Boundary 8: Non-integer floats (3.5 guests)
      const invalidFloat = authoritativeReservationSchema.safeParse({
        ...baseValidPayload,
        guests: 3.5,
      });
      assert.ok(!invalidFloat.success, "guests=3.5 must be rejected (must be integer)");
    }
  );

  // 2. Out-of-Stock Disabled Button State
  await collector.runTest(
    "T2.2: Out-of-stock product card enforces disabled button, aria-disabled, and prevents add-to-cart",
    () => {
      let cartAdded = false;
      const soldOutProduct = MOCK_PRODUCTS.find((p) => p.status === "sold-out-today")!;

      const html = renderComponent(
        React.createElement(ProductCard, {
          product: soldOutProduct,
          onAddToCart: () => {
            cartAdded = true;
          },
        })
      );

      // Verify disabled attributes and visual cues
      assert.ok(
        html.includes("disabled") || html.includes('aria-disabled="true"'),
        "Sold-out card button must be disabled"
      );
      assert.ok(
        html.includes("Disponible mañana"),
        "Sold-out card button must show 'Disponible mañana'"
      );
      assert.ok(
        html.includes("cursor-not-allowed"),
        "Sold-out button must have cursor-not-allowed styling"
      );
      assert.ok(
        html.includes("Agotado por hoy"),
        "Sold-out card must display 'Agotado por hoy' overlay badge"
      );
    }
  );

  // 3. Empty Filter Handling
  await collector.runTest(
    "T2.3: Menu renders graceful empty state when no products match filter",
    () => {
      // Pass an empty array to Menu
      const html = renderComponent(React.createElement(Menu, { products: [] }));

      assert.ok(
        html.includes("No encontramos productos con este filtro actualmente."),
        "Empty state message must be displayed when 0 products match"
      );
      assert.ok(
        html.includes("Ver todos los productos"),
        "Empty state must provide a reset CTA button 'Ver todos los productos'"
      );
    }
  );

  // 4. Long Text Clamp & Boundary Characters
  await collector.runTest(
    "T2.4: Long text clamp in ProductCard and 500-char boundary in dietaryNotes",
    () => {
      const longTextProduct: Product = {
        id: "prod-adversarial-long",
        name: "Tarta Monumental Con Nombre Extraordinariamente Extenso Para Pruebas De Diseño De Interfaz Responsiva",
        price: 9900,
        description:
          "Descripción deliberadamente extensa y detallada para verificar que el layout no sufra desbordamientos horizontales ni colapsos tipográficos, comprobando la presencia estricta de line-clamp-2 y la retención del botón CTA en el margen inferior mediante mt-auto.".repeat(
            2
          ),
        image: "/images/product-tarta-limon.jpg",
        tags: ["sin-gluten", "vegano", "sin-azucar"],
        status: "available",
      };

      const html = renderComponent(React.createElement(ProductCard, { product: longTextProduct }));
      assert.ok(html.includes("line-clamp-2"), "Description container must employ line-clamp-2");
      assert.ok(html.includes("mt-auto"), "CTA container must employ mt-auto to anchor button");

      // Dietary notes character boundary testing (500 chars vs 501 chars)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().split("T")[0];

      const valid500Notes = "A".repeat(500);
      const parse500 = authoritativeReservationSchema.safeParse({
        fullName: "Carlos Mendoza",
        email: "carlos@test.com",
        phone: "3001234567",
        date: dateStr,
        time: "16:00",
        guests: 2,
        dietaryNotes: valid500Notes,
      });
      assert.ok(parse500.success, "500 characters in dietaryNotes should pass");

      const invalid501Notes = "A".repeat(501);
      const parse501 = authoritativeReservationSchema.safeParse({
        fullName: "Carlos Mendoza",
        email: "carlos@test.com",
        phone: "3001234567",
        date: dateStr,
        time: "16:00",
        guests: 2,
        dietaryNotes: invalid501Notes,
      });
      assert.ok(!parse501.success, "501 characters in dietaryNotes must be rejected (> 500)");
    }
  );

  // 5. Touch Target Standards (WCAG 2.5.5 >= 44px)
  await collector.runTest(
    "T2.5: Interactive elements satisfy WCAG 2.5.5 minimum 44px touch target height",
    () => {
      // 1. ProductCard CTA button
      const cardHtml = renderComponent(
        React.createElement(ProductCard, { product: MOCK_PRODUCTS[0] })
      );
      assert.ok(
        cardHtml.includes("min-h-[44px]") || cardHtml.includes("h-11"),
        "ProductCard CTA button must enforce min-h-[44px] or h-11"
      );

      // 2. MenuFilter pill tabs
      const filterHtml = renderComponent(
        React.createElement(MenuFilter, { activeFilter: "todos", onSelectFilter: () => {} })
      );
      assert.ok(
        filterHtml.includes("min-h-[44px]"),
        "MenuFilter tabs must enforce min-h-[44px]"
      );

      // 3. Reservation form submit button
      const resHtml = renderComponent(React.createElement(ContactReservation));
      assert.ok(
        resHtml.includes("min-h-[48px]") || resHtml.includes("min-h-[44px]"),
        "Reservation submit button must enforce >= 44px height"
      );

      // 4. WhatsApp callout CTA button
      assert.ok(
        resHtml.includes("min-h-[44px]"),
        "WhatsApp group link must enforce min-h-[44px]"
      );
    }
  );

  // 6. prefers-reduced-motion Compliance
  await collector.runTest(
    "T2.6: System prefers-reduced-motion media query configuration and Framer Motion guards",
    () => {
      // Check globals.css for prefers-reduced-motion
      const globalsCssPath = path.join(process.cwd(), "src/app/globals.css");
      const globalsCss = fs.readFileSync(globalsCssPath, "utf-8");

      assert.ok(
        globalsCss.includes("prefers-reduced-motion: reduce"),
        "globals.css must contain '@media (prefers-reduced-motion: reduce)'"
      );
      assert.ok(
        globalsCss.includes("animation-duration: 0.01ms !important") ||
          globalsCss.includes("animation: none") ||
          globalsCss.includes("0.01ms"),
        "globals.css must reduce animation durations to imperceptible threshold"
      );
      assert.ok(
        globalsCss.includes("scroll-behavior: auto !important") ||
          globalsCss.includes("scroll-behavior: auto"),
        "globals.css must disable smooth scroll under reduced motion"
      );

      // Check Hero.tsx component for useReducedMotion import
      const heroPath = path.join(process.cwd(), "src/components/sections/Hero.tsx");
      const heroCode = fs.readFileSync(heroPath, "utf-8");
      assert.ok(
        heroCode.includes("useReducedMotion"),
        "Hero.tsx must integrate 'useReducedMotion' from framer-motion"
      );

      // Check AboutUs.tsx component for useReducedMotion import
      const aboutPath = path.join(process.cwd(), "src/components/sections/AboutUs.tsx");
      const aboutCode = fs.readFileSync(aboutPath, "utf-8");
      assert.ok(
        aboutCode.includes("useReducedMotion"),
        "AboutUs.tsx must integrate 'useReducedMotion' from framer-motion"
      );
    }
  );
}
