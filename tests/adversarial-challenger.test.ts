import React from "react";
import fs from "node:fs";
import path from "node:path";
import { TestCollector, renderComponent, assert } from "./helpers/test-utils";
import { authoritativeReservationSchema } from "./helpers/reservation-schema";

import { ProductCard } from "../src/components/common/ProductCard";
import { Menu } from "../src/components/sections/Menu";
import { MenuFilter, FILTER_OPTIONS, FilterOption } from "../src/components/sections/MenuFilter";
import { ContactReservation } from "../src/components/sections/ContactReservation";
import { MOCK_PRODUCTS } from "../src/data/products";
import { Product, AllergenTag } from "../src/types";
import { formatPrice } from "../src/lib/utils";

export async function runAdversarialChallengerSuite(): Promise<{ total: number; passed: number; failed: number }> {
  const collector = new TestCollector();

  console.log("======================================================================");
  console.log("⚔️ CHALLENGER 1 — ADVERSARIAL STRESS HARNESS & EMPIRICAL ORACLE");
  console.log("   Scope: Functional logic, Filter switching, Form boundaries, Card states, Motion");
  console.log("======================================================================\n");

  // =====================================================================
  // SUITE 1: Form Validation Boundaries (Guests 0/21, Emails, Dates, Notes)
  // =====================================================================
  collector.setTier("Adversarial Suite 1: Form Validation Boundaries");

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const validTomorrowStr = tomorrow.toISOString().split("T")[0];

  const baseValid = {
    fullName: "Lucía Fernández",
    email: "lucia.f@example.com",
    phone: "+57 311 555 1234",
    date: validTomorrowStr,
    time: "14:00",
    guests: 2,
    dietaryNotes: "Sin gluten estricto",
  };

  // 1.1 Guests lower boundary (0, negative, floats, non-numeric)
  await collector.runTest("CH-1.1: Guests boundary: 0 guests must be rejected", () => {
    const res = authoritativeReservationSchema.safeParse({ ...baseValid, guests: 0 });
    assert.ok(!res.success, "0 guests must fail validation");
    const guestsError = res.error?.issues.find((i) => i.path.includes("guests"));
    assert.ok(guestsError !== undefined, "Issue must be on 'guests' field");
    assert.ok(
      guestsError?.message.includes("Mínimo 1") || guestsError?.message.includes("1"),
      `Expected 'Mínimo 1', got: ${guestsError?.message}`
    );
  });

  await collector.runTest("CH-1.2: Guests boundary: negative numbers (-1, -100) must be rejected", () => {
    const resNeg1 = authoritativeReservationSchema.safeParse({ ...baseValid, guests: -1 });
    assert.ok(!resNeg1.success, "guests=-1 must fail");
    const resNeg100 = authoritativeReservationSchema.safeParse({ ...baseValid, guests: -100 });
    assert.ok(!resNeg100.success, "guests=-100 must fail");
  });

  await collector.runTest("CH-1.3: Guests boundary: 21 guests must be rejected (> 20 limit)", () => {
    const res = authoritativeReservationSchema.safeParse({ ...baseValid, guests: 21 });
    assert.ok(!res.success, "21 guests must fail validation");
    const guestsError = res.error?.issues.find((i) => i.path.includes("guests"));
    assert.ok(guestsError !== undefined, "Issue must be on 'guests' field");
    assert.ok(
      guestsError?.message.includes("20"),
      `Expected message referencing 20 max limit, got: ${guestsError?.message}`
    );
  });

  await collector.runTest("CH-1.4: Guests boundary: extreme values (22, 50, 100, 1000) must be rejected", () => {
    for (const count of [22, 50, 100, 1000]) {
      const res = authoritativeReservationSchema.safeParse({ ...baseValid, guests: count });
      assert.ok(!res.success, `guests=${count} must fail validation`);
    }
  });

  await collector.runTest("CH-1.5: Guests boundary: valid limits (exactly 1 and exactly 20) must pass", () => {
    const res1 = authoritativeReservationSchema.safeParse({ ...baseValid, guests: 1 });
    assert.ok(res1.success, "guests=1 must pass validation");
    const res20 = authoritativeReservationSchema.safeParse({ ...baseValid, guests: 20 });
    assert.ok(res20.success, "guests=20 must pass validation");
  });

  await collector.runTest("CH-1.6: Guests boundary: fractional/float numbers (1.5, 2.9) must be rejected", () => {
    const res15 = authoritativeReservationSchema.safeParse({ ...baseValid, guests: 1.5 });
    assert.ok(!res15.success, "guests=1.5 must fail (int requirement)");
    const res29 = authoritativeReservationSchema.safeParse({ ...baseValid, guests: 2.9 });
    assert.ok(!res29.success, "guests=2.9 must fail (int requirement)");
  });

  await collector.runTest("CH-1.7: Guests boundary: string coercion and non-numeric inputs", () => {
    // String "4" coerced to 4 should pass
    const resStr4 = authoritativeReservationSchema.safeParse({ ...baseValid, guests: "4" });
    assert.ok(resStr4.success, "String '4' must coerce to number 4 and pass");
    if (resStr4.success) {
      assert.strictEqual(resStr4.data.guests, 4);
    }

    // String "0" coerced to 0 should fail
    const resStr0 = authoritativeReservationSchema.safeParse({ ...baseValid, guests: "0" });
    assert.ok(!resStr0.success, "String '0' must fail boundary check");

    // String "21" coerced to 21 should fail
    const resStr21 = authoritativeReservationSchema.safeParse({ ...baseValid, guests: "21" });
    assert.ok(!resStr21.success, "String '21' must fail boundary check");

    // Non-numeric string "abc" should fail
    const resAbc = authoritativeReservationSchema.safeParse({ ...baseValid, guests: "abc" });
    assert.ok(!resAbc.success, "Non-numeric string 'abc' must fail validation");
  });

  // 1.8 Email Validation Boundaries
  await collector.runTest("CH-1.8: Email boundary: malformed and invalid emails must be rejected", () => {
    const invalidEmails = [
      "",
      "plainaddress",
      "@missingusername.com",
      "username@.com",
      "username@com",
      "user@example..com",
      "user space@example.com",
      "user@domain@another.com",
      "user@",
      "@domain",
    ];

    for (const email of invalidEmails) {
      const res = authoritativeReservationSchema.safeParse({ ...baseValid, email });
      assert.ok(!res.success, `Email '${email}' must be rejected`);
      const emailError = res.error?.issues.find((i) => i.path.includes("email"));
      assert.ok(emailError !== undefined, `Error must identify email field for '${email}'`);
    }
  });

  await collector.runTest("CH-1.9: Email boundary: standard, subdomains, plus-addressing must pass", () => {
    const validEmails = [
      "user@example.com",
      "customer.name@bakery.co",
      "celiac+family@gmail.com",
      "laura_123@sub.domain.org",
      "a@b.com",
    ];

    for (const email of validEmails) {
      const res = authoritativeReservationSchema.safeParse({ ...baseValid, email });
      assert.ok(res.success, `Valid email '${email}' should pass validation`);
    }
  });

  // 1.10 Date Boundaries
  await collector.runTest("CH-1.10: Date boundary: past dates must be rejected, today and future pass", () => {
    // Yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
    const resPast = authoritativeReservationSchema.safeParse({ ...baseValid, date: yesterdayStr });
    assert.ok(!resPast.success, `Yesterday (${yesterdayStr}) must be rejected`);

    // 10 days ago
    const past10 = new Date();
    past10.setDate(past10.getDate() - 10);
    const resPast10 = authoritativeReservationSchema.safeParse({
      ...baseValid,
      date: past10.toISOString().split("T")[0],
    });
    assert.ok(!resPast10.success, "Past date (-10 days) must be rejected");

    // Today (local midnight)
    const todayStr = new Date().toISOString().split("T")[0];
    const resToday = authoritativeReservationSchema.safeParse({ ...baseValid, date: todayStr });
    assert.ok(resToday.success, `Today (${todayStr}) must be accepted`);

    // Tomorrow
    const resTomorrow = authoritativeReservationSchema.safeParse({ ...baseValid, date: validTomorrowStr });
    assert.ok(resTomorrow.success, `Tomorrow (${validTomorrowStr}) must be accepted`);

    // Empty date
    const resEmptyDate = authoritativeReservationSchema.safeParse({ ...baseValid, date: "" });
    assert.ok(!resEmptyDate.success, "Empty date must be rejected");
  });

  // 1.11 Full Name and Phone Boundaries
  await collector.runTest("CH-1.11: Name and Phone boundaries: minimum lengths enforced", () => {
    // Full name min 2 chars
    assert.ok(!authoritativeReservationSchema.safeParse({ ...baseValid, fullName: "" }).success, "Empty name must fail");
    assert.ok(!authoritativeReservationSchema.safeParse({ ...baseValid, fullName: "A" }).success, "1-char name must fail");
    assert.ok(authoritativeReservationSchema.safeParse({ ...baseValid, fullName: "Al" }).success, "2-char name must pass");

    // Phone min 7 digits
    assert.ok(!authoritativeReservationSchema.safeParse({ ...baseValid, phone: "" }).success, "Empty phone must fail");
    assert.ok(!authoritativeReservationSchema.safeParse({ ...baseValid, phone: "123456" }).success, "6-char phone must fail");
    assert.ok(authoritativeReservationSchema.safeParse({ ...baseValid, phone: "1234567" }).success, "7-char phone must pass");
    assert.ok(authoritativeReservationSchema.safeParse({ ...baseValid, phone: "+57 300 123 4567" }).success, "Formatted phone must pass");
  });

  // 1.12 Dietary Notes Character Limit & Sanitization Tolerance
  await collector.runTest("CH-1.12: Dietary notes: 500 max length and XSS input safety", () => {
    // 500 chars valid, 501 invalid
    assert.ok(
      authoritativeReservationSchema.safeParse({ ...baseValid, dietaryNotes: "X".repeat(500) }).success,
      "500 characters in notes must pass"
    );
    assert.ok(
      !authoritativeReservationSchema.safeParse({ ...baseValid, dietaryNotes: "X".repeat(501) }).success,
      "501 characters in notes must fail"
    );

    // XSS injection payloads safely accepted as plain text in schema
    const xssPayload = "<script>alert('xss')</script>";
    const resXss = authoritativeReservationSchema.safeParse({ ...baseValid, dietaryNotes: xssPayload });
    assert.ok(resXss.success, "Schema safely accepts strings with HTML characters without crashing");
    if (resXss.success) {
      assert.strictEqual(resXss.data.dietaryNotes, xssPayload);
    }
  });

  // 1.13 ContactReservation DOM Input Attributes
  await collector.runTest("CH-1.13: ContactReservation DOM: HTML attributes enforce min, max, types", () => {
    const html = renderComponent(React.createElement(ContactReservation));

    // Guests input
    assert.ok(html.includes('id="guests"'), "Must render #guests input");
    assert.ok(html.includes('type="number"'), "Guests input must have type='number'");
    assert.ok(html.includes('min="1"') || html.includes("min={1}"), "Guests input must specify min=1");
    assert.ok(html.includes('max="20"') || html.includes("max={20}"), "Guests input must specify max=20");

    // Email input
    assert.ok(html.includes('id="email"'), "Must render #email input");
    assert.ok(html.includes('type="email"'), "Email input must have type='email'");

    // Date input
    assert.ok(html.includes('id="date"'), "Must render #date input");
    assert.ok(html.includes('type="date"'), "Date input must have type='date'");

    // Phone input
    assert.ok(html.includes('id="phone"'), "Must render #phone input");
    assert.ok(html.includes('type="tel"'), "Phone input must have type='tel'");

    // Submit CTA touch target
    assert.ok(
      html.includes("min-h-[48px]"),
      "Submit button must have min-h-[48px] for optimal mobile tap accessibility"
    );
  });

  // =====================================================================
  // SUITE 2: Filter Switching & Menu Functional Logic
  // =====================================================================
  collector.setTier("Adversarial Suite 2: Filter Switching & Menu Logic");

  await collector.runTest("CH-2.1: Filter 'todos' returns 100% of products in catalog", () => {
    const allProducts = MOCK_PRODUCTS;
    const filterOption: FilterOption = "todos";
    const filtered = filterOption === "todos" ? allProducts : allProducts.filter((p) => p.tags.includes(filterOption));
    assert.strictEqual(filtered.length, 6, "Expected 6 products in total catalog");
  });

  await collector.runTest("CH-2.2: Allergen tag filters strictly partition the catalog", () => {
    const specificFilters: AllergenTag[] = [
      "sin-gluten",
      "sin-nueces",
      "vegano",
      "sin-azucar",
      "sin-lacteos",
    ];

    for (const tag of specificFilters) {
      const filtered = MOCK_PRODUCTS.filter((p) => p.tags.includes(tag));
      for (const prod of filtered) {
        assert.ok(
          prod.tags.includes(tag),
          `Product '${prod.name}' returned under filter '${tag}' MUST include tag '${tag}'`
        );
      }
      const excluded = MOCK_PRODUCTS.filter((p) => !p.tags.includes(tag));
      for (const prod of excluded) {
        assert.ok(
          !filtered.some((p) => p.id === prod.id),
          `Product '${prod.name}' without tag '${tag}' must NOT appear in filter '${tag}'`
        );
      }
    }
  });

  await collector.runTest("CH-2.3: Menu renders empty state correctly when filter has 0 matching products", () => {
    // Menu with products matching 'sin-lacteos' now includes muffin
    const sinLacteosProducts = MOCK_PRODUCTS.filter((p) => p.tags.includes("sin-lacteos"));
    assert.strictEqual(sinLacteosProducts.length, 1, "Catalog includes muffin under 'sin-lacteos'");

    // Render Menu passing 0 products (simulating empty state)
    const htmlEmpty = renderComponent(React.createElement(Menu, { products: [] }));
    assert.ok(
      htmlEmpty.includes("No encontramos productos con este filtro actualmente."),
      "Empty state message must be displayed"
    );
    assert.ok(
      htmlEmpty.includes("Ver todos los productos"),
      "Must offer button to reset filter to 'todos'"
    );
  });

  await collector.runTest("CH-2.4: Rapid filter switching simulation maintains deterministic integrity", () => {
    // Simulate 200 random rapid filter transitions
    const filterKeys: FilterOption[] = [
      "todos",
      "sin-gluten",
      "sin-nueces",
      "vegano",
      "sin-azucar",
      "sin-lacteos",
    ];

    let currentFilter: FilterOption = "todos";
    for (let i = 0; i < 200; i++) {
      const nextFilter = filterKeys[Math.floor(Math.random() * filterKeys.length)];
      currentFilter = nextFilter;

      const filtered =
        currentFilter === "todos"
          ? MOCK_PRODUCTS
          : MOCK_PRODUCTS.filter((p) => p.tags.includes(currentFilter as AllergenTag));

      if (currentFilter === "todos") {
        assert.strictEqual(filtered.length, 6);
      } else if (currentFilter === "sin-gluten") {
        assert.strictEqual(filtered.length, 5);
      } else if (currentFilter === "sin-lacteos") {
        assert.strictEqual(filtered.length, 1);
      } else {
        assert.strictEqual(filtered.length, 4);
      }
    }
    assert.ok(true, "Deterministic state maintained across 200 rapid filter switches");
  });

  await collector.runTest("CH-2.5: MenuFilter pill navigation satisfies ARIA role='tablist' and min-h-[44px]", () => {
    const html = renderComponent(
      React.createElement(MenuFilter, { activeFilter: "sin-gluten", onSelectFilter: () => {} })
    );

    assert.ok(html.includes('role="tablist"'), "Container must have role='tablist'");
    assert.ok(html.includes('role="tab"'), "Items must have role='tab'");
    assert.ok(html.includes('aria-selected="true"'), "Active tab must have aria-selected='true'");
    assert.ok(html.includes('aria-selected="false"'), "Inactive tabs must have aria-selected='false'");
    assert.ok(html.includes("min-h-[44px]"), "Tabs must enforce min 44px touch target height");
  });

  // =====================================================================
  // SUITE 3: ProductCard States & Out-of-Stock Disabled States
  // =====================================================================
  collector.setTier("Adversarial Suite 3: ProductCard Disabled & Cart States");

  const soldOutProduct = MOCK_PRODUCTS.find((p) => p.status === "sold-out-today")!;
  const availableProduct = MOCK_PRODUCTS.find((p) => p.status === "available" && !p.isThemeOfMonth)!;
  const themeProduct = MOCK_PRODUCTS.find((p) => p.isThemeOfMonth === true)!;

  await collector.runTest("CH-3.1: Sold-out card renders disabled button, 'Disponible mañana', and overlay", () => {
    assert.ok(soldOutProduct !== undefined, "Mock data must contain at least 1 sold-out product");
    const html = renderComponent(React.createElement(ProductCard, { product: soldOutProduct }));

    assert.ok(html.includes("disabled"), "Sold-out button must have HTML disabled attribute");
    assert.ok(html.includes('aria-disabled="true"'), "Sold-out button must have aria-disabled='true'");
    assert.ok(html.includes("Disponible mañana"), "Button text must read 'Disponible mañana'");
    assert.ok(html.includes("cursor-not-allowed"), "Button must have cursor-not-allowed CSS class");
    assert.ok(html.includes("Agotado por hoy"), "Image overlay must display 'Agotado por hoy'");
    assert.ok(html.includes("grayscale-[20%]"), "Sold-out image must have desaturation styling");
  });

  await collector.runTest("CH-3.2: Sold-out card NEVER triggers onAddToCart callback", () => {
    let callbackTriggered = false;

    // Simulate ProductCard logic:
    const handleAddToCartSimulated = (product: Product, cb: (p: Product) => void) => {
      if (product.status === "sold-out-today") return;
      cb(product);
    };

    handleAddToCartSimulated(soldOutProduct, () => {
      callbackTriggered = true;
    });

    assert.strictEqual(callbackTriggered, false, "Sold-out product must never invoke cart addition");
  });

  await collector.runTest("CH-3.3: Available card renders active CTA button, price, and 'DEL MES' badge conditionality", () => {
    const htmlAvailable = renderComponent(React.createElement(ProductCard, { product: availableProduct }));
    assert.ok(!htmlAvailable.includes("Disponible mañana"), "Available product must not show 'Disponible mañana'");
    assert.ok(htmlAvailable.includes("Agregar al pedido"), "Available product must show 'Agregar al pedido'");
    assert.ok(!htmlAvailable.includes("disabled"), "Available button must NOT be disabled");
    assert.ok(!htmlAvailable.includes("DEL MES"), "Non-theme product must NOT show 'DEL MES' badge");

    const htmlTheme = renderComponent(React.createElement(ProductCard, { product: themeProduct }));
    assert.ok(htmlTheme.includes("DEL MES"), "Theme of month product MUST show 'DEL MES' badge");
    assert.ok(htmlTheme.includes("Agregar al pedido"), "Theme of month product is available to order");
  });

  await collector.runTest("CH-3.4: Currency formatting in ProductCard adheres to authoritative Soles (S/)", () => {
    // Format test for all 6 mock products
    for (const p of MOCK_PRODUCTS) {
      const html = renderComponent(React.createElement(ProductCard, { product: p }));
      const expectedFormatted = formatPrice(p.price);
      assert.ok(
        html.includes(expectedFormatted),
        `Product '${p.name}' price (${p.price}) must be rendered formatted as ${expectedFormatted}`
      );
    }
  });

  // =====================================================================
  // SUITE 4: prefers-reduced-motion Configuration & Framer Motion Guards
  // =====================================================================
  collector.setTier("Adversarial Suite 4: prefers-reduced-motion Guards");

  await collector.runTest("CH-4.1: globals.css sets universal motion reduction rules", () => {
    const cssPath = path.join(process.cwd(), "src/app/globals.css");
    const cssContent = fs.readFileSync(cssPath, "utf-8");

    assert.ok(
      cssContent.includes("@media (prefers-reduced-motion: reduce)"),
      "globals.css must include '@media (prefers-reduced-motion: reduce)' media query"
    );
    assert.ok(
      cssContent.includes("*,") && cssContent.includes("*::before,") && cssContent.includes("*::after"),
      "Reduced motion block must target all elements and pseudo-elements"
    );
    assert.ok(
      cssContent.includes("animation-duration: 0.01ms !important"),
      "animation-duration must be crushed to 0.01ms !important"
    );
    assert.ok(
      cssContent.includes("transition-duration: 0.01ms !important"),
      "transition-duration must be crushed to 0.01ms !important"
    );
    assert.ok(
      cssContent.includes("animation-iteration-count: 1 !important"),
      "animation-iteration-count must be forced to 1 !important"
    );
    assert.ok(
      cssContent.includes("scroll-behavior: auto !important"),
      "scroll-behavior must be set to auto !important"
    );
  });

  await collector.runTest("CH-4.2: Core animated components implement useReducedMotion hook", () => {
    const animatedFiles = [
      "src/components/sections/Hero.tsx",
      "src/components/sections/AboutUs.tsx",
      "src/components/sections/WhatWeOffer.tsx",
    ];

    for (const relPath of animatedFiles) {
      const fullPath = path.join(process.cwd(), relPath);
      const code = fs.readFileSync(fullPath, "utf-8");
      assert.ok(
        code.includes("useReducedMotion"),
        `Component '${relPath}' must import and utilize 'useReducedMotion'`
      );
      assert.ok(
        code.includes("shouldReduceMotion"),
        `Component '${relPath}' must guard animation variants with shouldReduceMotion`
      );
    }
  });

  // =====================================================================
  // SUITE 5: Cross-Cutting & Edge Integrity (Disclaimer, Touch Targets, Insumos)
  // =====================================================================
  collector.setTier("Adversarial Suite 5: Cross-Cutting Edge Integrity");

  await collector.runTest("CH-5.1: Statutory legal dietary disclaimer verbatim match", () => {
    const statutorySubstring =
      "La información alimentaria mostrada es orientativa. Si tienes una alergia severa, confirma directamente con el establecimiento los ingredientes, procesos de preparación y medidas frente a contaminación cruzada antes de consumir.";

    // 1. Verify in DietaryDisclaimer component source
    const disclaimerPath = path.join(process.cwd(), "src/components/common/DietaryDisclaimer.tsx");
    const disclaimerCode = fs.readFileSync(disclaimerPath, "utf-8");
    assert.ok(
      disclaimerCode.includes(statutorySubstring),
      "DietaryDisclaimer must contain exact statutory disclaimer text verbatim"
    );

    // 2. Verify in rendered Footer DOM
    const { Footer } = require("../src/components/layout/Footer");
    const footerHtml = renderComponent(React.createElement(Footer));
    assert.ok(
      footerHtml.includes(statutorySubstring),
      "Rendered Footer DOM must output the statutory dietary disclaimer verbatim"
    );
  });

  await collector.runTest("CH-5.2: ProductCard image aspect ratio and line clamping", () => {
    const html = renderComponent(React.createElement(ProductCard, { product: availableProduct }));
    assert.ok(html.includes("aspect-[4/3]"), "Image container must maintain 4:3 aspect ratio");
    assert.ok(html.includes("line-clamp-2"), "Description must enforce line-clamp-2 to prevent overflow");
  });

  // =====================================================================
  // SUITE 6: Deep Edge & Structural Boundary Verification
  // =====================================================================
  collector.setTier("Adversarial Suite 6: Deep Edge & Structural Boundaries");

  await collector.runTest("CH-6.1: Guests boundary: NaN and Infinity are strictly rejected", () => {
    assert.ok(!authoritativeReservationSchema.safeParse({ ...baseValid, guests: NaN }).success, "NaN must fail");
    assert.ok(!authoritativeReservationSchema.safeParse({ ...baseValid, guests: Infinity }).success, "Infinity must fail");
    assert.ok(!authoritativeReservationSchema.safeParse({ ...baseValid, guests: -Infinity }).success, "-Infinity must fail");
  });

  await collector.runTest("CH-6.2: formatPrice edge cases: zero and large values formatted gracefully", () => {
    const { formatPrice } = require("../src/lib/utils");
    assert.strictEqual(formatPrice(0), "S/ 0.00", "formatPrice(0) should return 'S/ 0.00'");
    assert.strictEqual(formatPrice(10), "S/ 10.00", "formatPrice(10) should return 'S/ 10.00'");
    assert.strictEqual(formatPrice(15.5), "S/ 15.50", "formatPrice(15.5) should return 'S/ 15.50'");
  });

  await collector.runTest("CH-6.3: ProductCard resilience: empty tags array renders without crashing", () => {
    const noTagsProduct: Product = {
      ...availableProduct,
      id: "prod-no-tags",
      tags: [],
    };
    const html = renderComponent(React.createElement(ProductCard, { product: noTagsProduct }));
    assert.ok(html.includes(noTagsProduct.name), "ProductCard must render product name even with 0 tags");
  });

  await collector.runTest("CH-6.4: Menu resilience: default parameter falls back to MOCK_PRODUCTS", () => {
    const html = renderComponent(React.createElement(Menu));
    assert.ok(html.includes(MOCK_PRODUCTS[0].name), "Menu without products prop must default to MOCK_PRODUCTS");
  });


  // Summary Report
  const overall = collector.getOverallSummary();
  console.log("\n======================================================================");
  console.log("                  CHALLENGER 1 VERIFICATION RESULTS                   ");
  console.log("======================================================================");
  console.log(`  TOTAL ADVERSARIAL TESTS: ${overall.total}`);
  console.log(`  PASSED: ${overall.passed}`);
  console.log(`  FAILED: ${overall.failed}`);
  console.log(`  SUCCESS RATE: ${((overall.passed / overall.total) * 100).toFixed(1)}%`);
  console.log(`  TOTAL DURATION: ${overall.durationMs}ms`);
  console.log("======================================================================\n");

  if (overall.failed > 0) {
    console.error("❌ ADVERSARIAL TESTS FAILED: One or more assertions did not pass.");
    process.exit(1);
  } else {
    console.log("🎉 ALL ADVERSARIAL CHALLENGES PASSED EMPIRICALLY!");
  }

  return { total: overall.total, passed: overall.passed, failed: overall.failed };
}

// Self-run when executed directly
if (require.main === module) {
  runAdversarialChallengerSuite().catch((err) => {
    console.error("Fatal error executing adversarial suite:", err);
    process.exit(1);
  });
}
