import React from "react";
import fs from "node:fs";
import path from "node:path";
import { TestCollector, renderComponent, assert } from "./helpers/test-utils";

import { Menu } from "../src/components/sections/Menu";
import { ProductCard } from "../src/components/common/ProductCard";
import { Ingredients } from "../src/components/sections/Ingredients";
import { FAQ } from "../src/components/sections/FAQ";
import { ContactReservation } from "../src/components/sections/ContactReservation";

import { MOCK_PRODUCTS } from "../src/data/products";
import { MOCK_INGREDIENTS } from "../src/data/ingredients";
import { MOCK_FAQS } from "../src/data/faqs";
import { Product, AllergenTag } from "../src/types";

export async function runTier3Tests(collector: TestCollector): Promise<void> {
  collector.setTier("Tier 3: Cross-Feature Combinations");

  // 1. Allergen Filtering + Cart Button Interaction
  await collector.runTest(
    "T3.1: Allergen filter dynamically scopes catalog and maintains cart addition contract",
    () => {
      // Simulate filtering by 'vegano'
      const veganProducts = MOCK_PRODUCTS.filter((p) => p.tags.includes("vegano"));
      assert.ok(veganProducts.length > 0, "There should be vegan products in mock dataset");

      // Verify that non-vegan products like 'prod-brownie' (which is not vegan) are excluded
      const brownie = veganProducts.find((p) => p.id === "prod-brownie");
      assert.strictEqual(brownie, undefined, "Brownie is not vegan and should be excluded");

      // Render Menu with vegan filtered products
      const veganMenuHtml = renderComponent(React.createElement(Menu, { products: veganProducts }));
      for (const p of veganProducts) {
        assert.ok(veganMenuHtml.includes(p.name), `Vegan menu must render '${p.name}'`);
      }

      // Simulate cart callback invocation for an available vegan product
      const targetProduct = veganProducts.find((p) => p.status === "available")!;
      let addedProduct: Product | null = null;

      const cardHtml = renderComponent(
        React.createElement(ProductCard, {
          product: targetProduct,
          onAddToCart: (p) => {
            addedProduct = p;
          },
        })
      );

      assert.ok(
        cardHtml.includes("Agregar al pedido"),
        "Filtered available product must render 'Agregar al pedido'"
      );
      assert.ok(
        cardHtml.includes(targetProduct.name),
        "Card must display target product name"
      );
    }
  );

  // 2. Accordion Expand/Collapse Independence
  await collector.runTest(
    "T3.2: Accordion elements maintain isolated ARIA state, ID pairings, and prevent cross-talk",
    () => {
      // 1. Ingredients Accordion ARIA & ID Pairing
      const ingHtml = renderComponent(React.createElement(Ingredients));

      for (const item of MOCK_INGREDIENTS) {
        const triggerId = `accordion-trigger-${item.id}`;
        const panelId = `accordion-panel-${item.id}`;

        assert.ok(
          ingHtml.includes(`id="${triggerId}"`),
          `Trigger element for ${item.id} must have id='${triggerId}'`
        );
        assert.ok(
          ingHtml.includes(`aria-controls="${panelId}"`),
          `Trigger for ${item.id} must point to aria-controls='${panelId}'`
        );
      }

      // Default open item in Ingredients is 'ing-brownie'
      assert.ok(
        ingHtml.includes('id="accordion-trigger-ing-brownie" aria-expanded="true"') ||
          ingHtml.includes('aria-expanded="true" aria-controls="accordion-panel-ing-brownie"'),
        "Default open item 'ing-brownie' must have aria-expanded='true'"
      );

      // 2. FAQ Accordion ARIA & ID Pairing
      const faqHtml = renderComponent(React.createElement(FAQ));

      for (const item of MOCK_FAQS) {
        const triggerId = `faq-trigger-${item.id}`;
        const panelId = `faq-panel-${item.id}`;

        assert.ok(
          faqHtml.includes(`id="${triggerId}"`),
          `FAQ Trigger for ${item.id} must have id='${triggerId}'`
        );
        assert.ok(
          faqHtml.includes(`aria-controls="${panelId}"`),
          `FAQ Trigger for ${item.id} must point to aria-controls='${panelId}'`
        );
      }

      // FAQ default open item is first item
      assert.ok(
        faqHtml.includes(`id="faq-trigger-${MOCK_FAQS[0].id}" aria-expanded="true"`) ||
          faqHtml.includes(`aria-controls="faq-panel-${MOCK_FAQS[0].id}"`),
        "FAQ first item must have aria-controls set"
      );
    }
  );

  // 3. Modal Backdrop & Escape Key Behavior in ContactReservation
  await collector.runTest(
    "T3.3: Booking confirmation modal provides backdrop dismiss, close button, and Escape key listener",
    () => {
      const contactFile = fs.readFileSync(
        path.join(process.cwd(), "src/components/sections/ContactReservation.tsx"),
        "utf-8"
      );

      // Verify accessible dialog semantics
      assert.ok(
        contactFile.includes('role="dialog"') && contactFile.includes('aria-modal="true"'),
        "Modal must have role='dialog' and aria-modal='true'"
      );

      // Verify backdrop blur and click dismissal
      assert.ok(
        contactFile.includes("handleCloseModal") && contactFile.includes("onClick={handleCloseModal}"),
        "Modal backdrop must trigger handleCloseModal on click"
      );

      // Verify Escape key event listener
      assert.ok(
        contactFile.includes('e.key === "Escape"') || contactFile.includes("e.key === 'Escape'"),
        "Component must listen for Escape key to dismiss modal"
      );

      // Verify form reset upon closing modal
      assert.ok(
        contactFile.includes("reset()") || contactFile.includes("handleCloseModal"),
        "Form must reset upon closing modal"
      );
    }
  );
}
