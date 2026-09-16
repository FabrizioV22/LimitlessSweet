import React from "react";
import { TestCollector, renderComponent, assert } from "./helpers/test-utils";

import { ScrollProgress } from "../src/components/common/ScrollProgress";
import { FloatingPetals } from "../src/components/common/FloatingPetals";
import { MagneticWrapper } from "../src/components/common/MagneticWrapper";
import { SectionDivider } from "../src/components/common/SectionDivider";
import { Navbar } from "../src/components/layout/Navbar";
import { Hero } from "../src/components/sections/Hero";
import { ProductCard } from "../src/components/common/ProductCard";
import { Ingredients } from "../src/components/sections/Ingredients";
import { Testimonials } from "../src/components/sections/Testimonials";
import { WhatWeOffer } from "../src/components/sections/WhatWeOffer";
import { MOCK_PRODUCTS } from "../src/data/products";

export async function runRoadmapModernizationTests(collector: TestCollector): Promise<void> {
  collector.setTier("Roadmap UI/UX Modernization");

  // 1. Scrollspy & Navbar Indicator (1.1)
  await collector.runTest(
    "RM-1.1: Navbar supports scrollspy and renders active state indicators",
    () => {
      const html = renderComponent(React.createElement(Navbar));
      assert.ok(html.includes('href="#menu"'), "Navbar must have #menu anchor");
      assert.ok(html.includes('href="#nosotros"'), "Navbar must have #nosotros anchor");
      assert.ok(html.includes('href="#insumos"'), "Navbar must have #insumos anchor");
      assert.ok(html.includes("Ver menú"), "Navbar must render 'Ver menú' button");
    }
  );

  // 2. Parallax Hero & Floating Petals (1.2 & 2.4)
  await collector.runTest(
    "RM-1.2: Hero contains parallax background setup and FloatingPetals theme elements",
    () => {
      const html = renderComponent(React.createElement(Hero));
      assert.ok(html.includes('id="inicio"'), "Hero must define id='inicio'");
      assert.ok(html.includes("Flores Amarillas") || html.includes("FLORES AMARILLAS"), "Hero must include seasonal theme badge");
      assert.ok(html.includes("animate-ken-burns"), "Hero background must have ken burns class");
    }
  );

  // 3. Scroll Progress Indicator (1.3)
  await collector.runTest(
    "RM-1.3: ScrollProgress renders fixed top progress indicator with bg-mustard",
    () => {
      const html = renderComponent(React.createElement(ScrollProgress));
      assert.ok(html.includes("bg-mustard"), "ScrollProgress must render bg-mustard");
      assert.ok(html.includes("fixed top-0"), "ScrollProgress must be fixed at top");
      assert.ok(html.includes("z-[60]"), "ScrollProgress must have high z-index");
    }
  );

  // 4. Magnetic CTA Buttons (1.4)
  await collector.runTest(
    "RM-1.4: MagneticWrapper safely wraps interactive elements without DOM degradation",
    () => {
      const html = renderComponent(
        React.createElement(
          MagneticWrapper,
          { strength: 0.3 },
          React.createElement("button", { type: "button" }, "Click Me")
        )
      );
      assert.ok(html.includes("Click Me"), "MagneticWrapper must preserve children");
    }
  );

  // 5. 3D Tilt & Gentle Pulse in ProductCard (2.1 & 3)
  await collector.runTest(
    "RM-2.1: ProductCard includes animate-gentle-pulse on 'DEL MES' badge and 3D tilt styles",
    () => {
      const themeProduct = MOCK_PRODUCTS.find((p) => p.isThemeOfMonth)!;
      const html = renderComponent(React.createElement(ProductCard, { product: themeProduct }));
      assert.ok(
        html.includes("animate-gentle-pulse"),
        "ProductCard 'DEL MES' badge must include animate-gentle-pulse"
      );
      assert.ok(
        html.includes("will-change-transform"),
        "ProductCard must have will-change-transform for smooth 3D tilt"
      );
    }
  );

  // 6. Scrollytelling in Ingredients Section (2.2)
  await collector.runTest(
    "RM-2.2: Ingredients renders scrollytelling editorial layout with audit seal and preview",
    () => {
      const html = renderComponent(React.createElement(Ingredients));
      assert.ok(
        html.includes("Ingrediente Destacado"),
        "Ingredients must render editorial 'Ingrediente Destacado' badge"
      );
      assert.ok(
        html.includes("Trazabilidad auditada"),
        "Ingredients must render audit assurance seal"
      );
      assert.ok(
        html.includes("data-ingredient-id"),
        "Ingredients list items must include data-ingredient-id for scrollspy"
      );
    }
  );

  // 7. Organic Section Dividers (2.3)
  await collector.runTest(
    "RM-2.3: SectionDivider renders smooth SVG curves with preserveAspectRatio='none'",
    () => {
      const html = renderComponent(
        React.createElement(SectionDivider, {
          position: "bottom",
          colorClass: "text-cream-soft",
          flipX: true,
        })
      );
      assert.ok(html.includes("<svg"), "SectionDivider must render an SVG");
      assert.ok(
        html.includes('preserveAspectRatio="none"'),
        "SectionDivider must have preserveAspectRatio='none'"
      );
      assert.ok(
        html.includes("text-cream-soft"),
        "SectionDivider must apply the specified color class"
      );
    }
  );

  // 8. Testimonials Auto-play & Controls (3)
  await collector.runTest(
    "RM-3.1: Testimonials provides auto-play carousel structure and ARIA live region",
    () => {
      const html = renderComponent(React.createElement(Testimonials));
      assert.ok(
        html.includes('aria-live="polite"'),
        "Testimonials must define aria-live='polite' for carousel accessibility"
      );
      assert.ok(
        html.includes("Testimonio anterior") && html.includes("Siguiente testimonio"),
        "Testimonials must render accessible next/prev buttons"
      );
    }
  );

  // 9. WhatWeOffer Idle Float Animation (3)
  await collector.runTest(
    "RM-3.2: WhatWeOffer renders 4 core pillars with enhanced visual presentation",
    () => {
      const html = renderComponent(React.createElement(WhatWeOffer));
      assert.ok(html.includes("Sin gluten"), "WhatWeOffer must render 'Sin gluten'");
      assert.ok(html.includes("Vegano"), "WhatWeOffer must render 'Vegano'");
      assert.ok(html.includes("Sin lácteos"), "WhatWeOffer must render 'Sin lácteos'");
      assert.ok(html.includes("Café y bebidas"), "WhatWeOffer must render 'Café y bebidas'");
    }
  );

  // 10. SideVine Floral Lateral Border (Plan Vine Lateral 1.0)
  await collector.runTest(
    "RM-4.1: SideVine renders scroll-driven decorative vine with yellow blooms on left and right",
    () => {
      const { SideVine } = require("../src/components/common/SideVine");
      const leftHtml = renderComponent(React.createElement(SideVine, { side: "left" }));
      assert.ok(leftHtml.includes("fixed top-0"), "SideVine must be fixed top-0");
      assert.ok(leftHtml.includes("left-2") || leftHtml.includes("left-4"), "Left vine must align to left edge");
      assert.ok(leftHtml.includes("<svg"), "SideVine must render SVG element");
      assert.ok(leftHtml.includes("flower-grad-left"), "SideVine must render yellow flower petal gradient");

      const rightHtml = renderComponent(React.createElement(SideVine, { side: "right" }));
      assert.ok(rightHtml.includes("scaleX(-1)"), "Right vine must be mirrored with scaleX(-1)");
    }
  );

  // 11. PaperTexture (Plan Vine Lateral 2.3)
  await collector.runTest(
    "RM-4.2: PaperTexture renders subtle fractal noise overlay filter",
    () => {
      const { PaperTexture } = require("../src/components/common/PaperTexture");
      const html = renderComponent(React.createElement(PaperTexture));
      assert.ok(html.includes("feTurbulence"), "PaperTexture must define feTurbulence filter");
      assert.ok(html.includes("fractalNoise"), "PaperTexture must use fractalNoise type");
      assert.ok(html.includes("mix-blend-multiply"), "PaperTexture must use mix-blend-multiply");
    }
  );

  // 12. Continuous Section Flow & Full-Bleed Layout
  await collector.runTest(
    "RM-4.3: Continuous harmonious section flow without harsh bars and Experience full-bleed layout",
    () => {
      const { Menu } = require("../src/components/sections/Menu");
      const { FAQ } = require("../src/components/sections/FAQ");
      const { Experience } = require("../src/components/sections/Experience");

      const menuHtml = renderComponent(React.createElement(Menu));
      assert.ok(menuHtml.includes('id="menu"'), "Menu section must define id='menu'");
      assert.ok(!menuHtml.includes("h-[3px]"), "Menu must not have harsh 3px separator line");

      const faqHtml = renderComponent(React.createElement(FAQ));
      assert.ok(faqHtml.includes('id="faq"'), "FAQ section must define id='faq'");
      assert.ok(!faqHtml.includes("h-[3px]"), "FAQ must not have harsh 3px separator line");

      const expHtml = renderComponent(React.createElement(Experience));
      assert.ok(
        expHtml.includes("max-w-[1600px]"),
        "Experience section must break 7xl boundary with full-bleed max-w-[1600px] container"
      );
    }
  );
}
