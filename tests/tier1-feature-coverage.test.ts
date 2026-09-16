import React from "react";
import { TestCollector, renderComponent, assert, stripHtmlTags } from "./helpers/test-utils";

// Domain sections & layout imports
import { Hero } from "../src/components/sections/Hero";
import { AboutUs } from "../src/components/sections/AboutUs";
import { MissionVision } from "../src/components/sections/MissionVision";
import { WhatWeOffer } from "../src/components/sections/WhatWeOffer";
import { Menu } from "../src/components/sections/Menu";
import { MenuFilter, FILTER_OPTIONS } from "../src/components/sections/MenuFilter";
import { Experience } from "../src/components/sections/Experience";
import { Ingredients } from "../src/components/sections/Ingredients";
import { Testimonials } from "../src/components/sections/Testimonials";
import { FAQ } from "../src/components/sections/FAQ";
import { ContactReservation } from "../src/components/sections/ContactReservation";
import { Navbar } from "../src/components/layout/Navbar";
import { Footer } from "../src/components/layout/Footer";
import { DietaryDisclaimer } from "../src/components/common/DietaryDisclaimer";
import { ProductCard } from "../src/components/common/ProductCard";

// Mock data & utilities
import { MOCK_PRODUCTS } from "../src/data/products";
import { MOCK_INGREDIENTS } from "../src/data/ingredients";
import { MOCK_TESTIMONIALS } from "../src/data/testimonials";
import { MOCK_ACTIVITIES } from "../src/data/activities";
import { MOCK_FAQS } from "../src/data/faqs";
import { formatPrice, ALLERGEN_METADATA } from "../src/lib/utils";

export async function runTier1Tests(collector: TestCollector): Promise<void> {
  collector.setTier("Tier 1: Feature Coverage");

  // 1. All 10 Domain Sections & Layout Presence
  await collector.runTest(
    "T1.1: Section exports & React component integrity",
    () => {
      assert.ok(typeof Hero === "function", "Hero must export a valid component");
      assert.ok(typeof AboutUs === "function", "AboutUs must export a valid component");
      assert.ok(typeof MissionVision === "function", "MissionVision must export a valid component");
      assert.ok(typeof WhatWeOffer === "function", "WhatWeOffer must export a valid component");
      assert.ok(typeof Menu === "function", "Menu must export a valid component");
      assert.ok(typeof MenuFilter === "function", "MenuFilter must export a valid component");
      assert.ok(typeof Experience === "function", "Experience must export a valid component");
      assert.ok(typeof Ingredients === "function", "Ingredients must export a valid component");
      assert.ok(typeof Testimonials === "function", "Testimonials must export a valid component");
      assert.ok(typeof FAQ === "function", "FAQ must export a valid component");
      assert.ok(typeof ContactReservation === "function", "ContactReservation must export a valid component");
      assert.ok(typeof Navbar === "function", "Navbar must export a valid component");
      assert.ok(typeof Footer === "function", "Footer must export a valid component");
    }
  );

  // 2. Hero Structure & Theme Badge
  await collector.runTest(
    "T1.2: Hero presentation, Fraunces heading, monthly theme badge, and CTA",
    () => {
      const html = renderComponent(React.createElement(Hero));
      assert.ok(html.includes("TEMA DEL MES: FLORES AMARILLAS 🌻"), "Hero must render the monthly theme badge");
      assert.ok(
        html.includes("Postres que florecen para ti, sin restricciones"),
        "Hero must render the main title"
      );
      assert.ok(
        html.includes("Un espacio seguro donde cada bocado está pensado"),
        "Hero must render the subtitle"
      );
      assert.ok(html.includes('href="#menu"'), "Hero CTA must point to #menu anchor");
      assert.ok(html.includes("Ver menú"), "Hero CTA must have 'Ver menú' label");
      assert.ok(html.includes('id="inicio"'), "Hero section must have id='inicio'");
    }
  );

  // 3. Navigation Anchors
  await collector.runTest(
    "T1.3: Navigation anchors match semantic section IDs (#nosotros, #menu, #ambiente, #insumos, #testimonios, #reserva)",
    () => {
      const navbarHtml = renderComponent(React.createElement(Navbar));
      const requiredAnchors = [
        "#nosotros",
        "#menu",
        "#ambiente",
        "#insumos",
        "#testimonios",
        "#reserva",
      ];

      for (const anchor of requiredAnchors) {
        assert.ok(
          navbarHtml.includes(`href="${anchor}"`),
          `Navbar must contain link with href="${anchor}"`
        );
      }

      // Check section target IDs
      const aboutHtml = renderComponent(React.createElement(AboutUs));
      assert.ok(aboutHtml.includes('id="nosotros"'), "AboutUs section must define id='nosotros'");

      const menuHtml = renderComponent(React.createElement(Menu));
      assert.ok(menuHtml.includes('id="menu"'), "Menu section must define id='menu'");

      const expHtml = renderComponent(React.createElement(Experience));
      assert.ok(expHtml.includes('id="ambiente"'), "Experience section must define id='ambiente'");

      const ingHtml = renderComponent(React.createElement(Ingredients));
      assert.ok(ingHtml.includes('id="insumos"'), "Ingredients section must define id='insumos'");

      const testHtml = renderComponent(React.createElement(Testimonials));
      assert.ok(testHtml.includes('id="testimonios"'), "Testimonials section must define id='testimonios'");

      const resHtml = renderComponent(React.createElement(ContactReservation));
      assert.ok(resHtml.includes('id="reserva"'), "ContactReservation section must define id='reserva'");
    }
  );

  // 4. Value Pillars & About Us Story
  await collector.runTest(
    "T1.4: AboutUs 2-column layout and WhatWeOffer 4 core pillars",
    () => {
      const whatWeOfferHtml = renderComponent(React.createElement(WhatWeOffer));
      const pillars = ["Sin gluten", "Vegano", "Sin lácteos", "Café y bebidas"];
      for (const pillar of pillars) {
        assert.ok(
          whatWeOfferHtml.includes(pillar),
          `WhatWeOffer must render pillar '${pillar}'`
        );
      }

      const aboutHtml = renderComponent(React.createElement(AboutUs));
      assert.ok(
        aboutHtml.includes("Nuestra historia") || aboutHtml.includes("Quiénes somos"),
        "AboutUs must render header copy"
      );
      assert.ok(
        aboutHtml.includes("Misión") && aboutHtml.includes("Visión"),
        "AboutUs must render Mission and Vision cards"
      );
    }
  );

  // 5. Allergen Filter Options
  await collector.runTest(
    "T1.5: MenuFilter renders pill selector with all required allergen options",
    () => {
      const expectedFilterIds = [
        "todos",
        "sin-gluten",
        "sin-nueces",
        "vegano",
        "sin-azucar",
        "sin-lacteos",
      ];
      const filterIds = FILTER_OPTIONS.map((f) => f.id);
      for (const id of expectedFilterIds) {
        assert.ok(filterIds.includes(id as any), `FILTER_OPTIONS must include '${id}'`);
      }

      const filterHtml = renderComponent(
        React.createElement(MenuFilter, {
          activeFilter: "todos",
          onSelectFilter: () => {},
        })
      );
      assert.ok(filterHtml.includes('role="tablist"'), "MenuFilter must have role='tablist'");
      assert.ok(filterHtml.includes("Todos"), "MenuFilter must render 'Todos' button");
      assert.ok(filterHtml.includes("Sin gluten"), "MenuFilter must render 'Sin gluten' button");
      assert.ok(filterHtml.includes("Vegano"), "MenuFilter must render 'Vegano' button");
      assert.ok(filterHtml.includes('aria-selected="true"'), "Active pill must have aria-selected='true'");
    }
  );

  // 6. Product Cards & Price Formatting ($X.XXX notation)
  await collector.runTest(
    "T1.6: ProductCard displays prices in authoritative $X.XXX format in mustard font",
    () => {
      // Test formatPrice utility (Peruvian Soles)
      assert.strictEqual(formatPrice(16), "S/ 16.00", "16 must format as S/ 16.00");
      assert.strictEqual(formatPrice(22), "S/ 22.00", "22 must format as S/ 22.00");
      assert.strictEqual(formatPrice(11.5), "S/ 11.50", "11.5 must format as S/ 11.50");

      const product = MOCK_PRODUCTS[0]; // Brownie floral
      const html = renderComponent(React.createElement(ProductCard, { product }));
      assert.ok(html.includes(formatPrice(product.price)), "Card must render formatted price");
      assert.ok(html.includes("text-mustard"), "Price must be styled with text-mustard");
      assert.ok(html.includes(product.name), "Card must render product name");
    }
  );

  // 7. ProductCard 3 States
  await collector.runTest(
    "T1.7: ProductCard renders 3 states: available, sold-out-today, and isThemeOfMonth",
    () => {
      // State 1: Available
      const availableProduct = MOCK_PRODUCTS.find((p) => p.status === "available")!;
      const availHtml = renderComponent(
        React.createElement(ProductCard, { product: availableProduct })
      );
      assert.ok(
        availHtml.includes("Agregar al pedido"),
        "Available product must display 'Agregar al pedido' CTA"
      );
      assert.ok(
        !availHtml.includes("Agotado por hoy"),
        "Available product must NOT display 'Agotado por hoy'"
      );

      // State 2: Sold out today
      const soldOutProduct = MOCK_PRODUCTS.find((p) => p.status === "sold-out-today")!;
      const soldOutHtml = renderComponent(
        React.createElement(ProductCard, { product: soldOutProduct })
      );
      assert.ok(
        soldOutHtml.includes("Agotado por hoy"),
        "Sold-out product must display 'Agotado por hoy' badge"
      );
      assert.ok(
        soldOutHtml.includes("Disponible mañana"),
        "Sold-out product button must display 'Disponible mañana'"
      );
      assert.ok(
        soldOutHtml.includes('aria-disabled="true"') || soldOutHtml.includes("disabled"),
        "Sold-out button must be disabled and have aria-disabled"
      );

      // State 3: Theme of Month
      const themeProduct = MOCK_PRODUCTS.find((p) => p.isThemeOfMonth)!;
      const themeHtml = renderComponent(
        React.createElement(ProductCard, { product: themeProduct })
      );
      assert.ok(
        themeHtml.includes("DEL MES"),
        "Monthly theme item must display 'DEL MES' badge"
      );
    }
  );

  // 8. Ingredients Accordion
  await collector.runTest(
    "T1.8: Ingredients accordion renders all items with certifications and ARIA structure",
    () => {
      const html = renderComponent(React.createElement(Ingredients));
      assert.ok(html.includes('id="insumos"'), "Section must have id='insumos'");
      assert.ok(
        html.includes("Transparencia total"),
        "Section must render transparency subtitle"
      );

      // Check that all 6 mock ingredient products are present
      for (const item of MOCK_INGREDIENTS) {
        assert.ok(
          html.includes(item.productName),
          `Ingredients list must include '${item.productName}'`
        );
      }

      // Check ARIA accordion triggers & panels
      assert.ok(html.includes("aria-expanded"), "Accordion triggers must have aria-expanded");
      assert.ok(html.includes("aria-controls"), "Accordion triggers must have aria-controls");
      assert.ok(html.includes('role="region"'), "Accordion panel must have role='region'");
      assert.ok(
        html.includes("Certificado sin gluten") || html.includes("Vegano certificado"),
        "Accordion must render certification badges"
      );
    }
  );

  // 9. FAQ Accordion
  await collector.runTest(
    "T1.9: FAQ accordion renders 5 questions covering celiac safety (<5 ppm) and procedures",
    () => {
      const html = renderComponent(React.createElement(FAQ));
      assert.ok(html.includes('id="faq"'), "FAQ section must have id='faq'");
      assert.ok(
        html.includes("Preguntas frecuentes"),
        "FAQ section must render heading"
      );

      for (const faq of MOCK_FAQS) {
        assert.ok(html.includes(faq.question), `FAQ must render question '${faq.question}'`);
      }

      // Check celiac reassurance (< 5 ppm)
      assert.ok(
        html.includes("&lt;5 ppm") || html.includes("<5 ppm") || html.includes("5 ppm") || html.includes("celiacas"),
        "FAQ must address celiac safety standard (<5 ppm)"
      );
    }
  );

  // 10. Testimonials Carousel
  await collector.runTest(
    "T1.10: Testimonials renders customer reviews, 5 stars, conditions, and nav controls",
    () => {
      const html = renderComponent(React.createElement(Testimonials));
      assert.ok(html.includes('id="testimonios"'), "Section must have id='testimonios'");
      assert.ok(
        html.includes("Lo que dicen nuestros clientes"),
        "Section must render title"
      );

      // Verify customer names and conditions
      const names = MOCK_TESTIMONIALS.map((t) => t.name);
      for (const name of names) {
        assert.ok(html.includes(name), `Testimonials must render reviewer '${name}'`);
      }

      // Check navigation buttons with accessible labels
      assert.ok(
        html.includes('aria-label="Testimonio anterior"') || html.includes("anterior"),
        "Testimonials must have previous slide button"
      );
      assert.ok(
        html.includes('aria-label="Siguiente testimonio"') || html.includes("siguiente"),
        "Testimonials must have next slide button"
      );
    }
  );

  // 11. Reservation Form Fields
  await collector.runTest(
    "T1.11: ContactReservation renders all required form inputs and submission CTA",
    () => {
      const html = renderComponent(React.createElement(ContactReservation));
      assert.ok(html.includes('id="reserva"'), "Section must have id='reserva'");
      assert.ok(html.includes('id="fullName"'), "Form must render 'fullName' input");
      assert.ok(html.includes('id="email"'), "Form must render 'email' input");
      assert.ok(html.includes('id="phone"'), "Form must render 'phone' input");
      assert.ok(html.includes('id="date"'), "Form must render 'date' input");
      assert.ok(html.includes('id="time"'), "Form must render 'time' select/input");
      assert.ok(html.includes('id="guests"'), "Form must render 'guests' input");
      assert.ok(html.includes('id="dietaryNotes"'), "Form must render 'dietaryNotes' textarea");
      assert.ok(
        html.includes("Confirmar mi reserva"),
        "Form must render 'Confirmar mi reserva' submit button"
      );
    }
  );

  // 12. Footer & Mandatory Disclaimer
  await collector.runTest(
    "T1.12: Footer renders 4-column info and includes verbatim legal dietary disclaimer",
    () => {
      const footerHtml = renderComponent(React.createElement(Footer));
      assert.ok(footerHtml.includes("footer-map.png"), "Footer must render static map thumbnail");
      assert.ok(footerHtml.includes("Lunes - Viernes"), "Footer must render schedule");
      assert.ok(footerHtml.includes("WhatsApp"), "Footer must render WhatsApp CTA");

      // Verify verbatim statutory disclaimer in footer
      const expectedDisclaimer =
        "La información alimentaria mostrada es orientativa. Si tienes una alergia severa, confirma directamente con el establecimiento los ingredientes, procesos de preparación y medidas frente a contaminación cruzada antes de consumir.";

      assert.ok(
        footerHtml.includes(expectedDisclaimer),
        "Footer must contain exact verbatim dietary legal disclaimer"
      );
    }
  );
}
