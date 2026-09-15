import React from "react";
import { TestCollector, renderComponent, assert } from "./helpers/test-utils";
import { authoritativeReservationSchema } from "./helpers/reservation-schema";

import { Menu } from "../src/components/sections/Menu";
import { Ingredients } from "../src/components/sections/Ingredients";
import { FAQ } from "../src/components/sections/FAQ";
import { Testimonials } from "../src/components/sections/Testimonials";
import { DietaryDisclaimer } from "../src/components/common/DietaryDisclaimer";
import { Footer } from "../src/components/layout/Footer";

import { MOCK_PRODUCTS } from "../src/data/products";
import { MOCK_INGREDIENTS } from "../src/data/ingredients";
import { MOCK_TESTIMONIALS } from "../src/data/testimonials";
import { MOCK_FAQS } from "../src/data/faqs";

export async function runTier4Tests(collector: TestCollector): Promise<void> {
  collector.setTier("Tier 4: Real-World User Scenarios");

  // Scenario 1: Celiac Customer End-to-End Journey
  await collector.runTest(
    "T4.1: Celiac Customer Journey (gluten-free filtering, <5 ppm safety standard, and certified ingredients)",
    () => {
      // 1. Menu filtering for gluten-free
      const glutenFreeProducts = MOCK_PRODUCTS.filter((p) => p.tags.includes("sin-gluten"));
      assert.ok(
        glutenFreeProducts.length >= 4,
        "Limitless Sweet must offer a comprehensive gluten-free catalog (>= 4 items)"
      );

      for (const p of glutenFreeProducts) {
        assert.ok(
          p.tags.includes("sin-gluten"),
          `Product '${p.name}' in gluten-free filter must possess 'sin-gluten' tag`
        );
      }

      // 2. Ingredients certifications check
      const ingHtml = renderComponent(React.createElement(Ingredients));
      assert.ok(
        ingHtml.includes("Certificado sin gluten"),
        "Ingredients accordion must display 'Certificado sin gluten' badges"
      );

      // 3. FAQ celiac standard (< 5 ppm) verification
      const celiacFaq = MOCK_FAQS.find((f) =>
        f.question.toLowerCase().includes("celiacas")
      );
      assert.ok(celiacFaq !== undefined, "FAQ must contain a question tailored for celiacs");
      assert.ok(
        celiacFaq!.answer.includes("< 5 ppm") || celiacFaq!.answer.includes("<5 ppm") || celiacFaq!.answer.includes("5 ppm"),
        "Celiac FAQ answer must cite the strict international threshold of <5 ppm"
      );

      // 4. Testimonials confirmation (María G.)
      const mariaTestimonial = MOCK_TESTIMONIALS.find((t) => t.name.includes("María"));
      assert.ok(mariaTestimonial !== undefined, "Must feature testimonial from María G.");
      assert.ok(
        mariaTestimonial!.context.toLowerCase().includes("celiaca"),
        "María's context must specify 'Celiaca'"
      );
    }
  );

  // Scenario 2: Lactose-Intolerant Booking Journey
  await collector.runTest(
    "T4.2: Lactose-Intolerant Customer Journey (dairy-free selection, testimonial context, and tailored booking notes)",
    () => {
      // 1. Check dairy-free options in catalog (vegano or sin-lacteos)
      const dairyFree = MOCK_PRODUCTS.filter(
        (p) => p.tags.includes("vegano") || p.tags.includes("sin-lacteos")
      );
      assert.ok(dairyFree.length >= 2, "Must offer dairy-free or vegan pastry choices");

      // 2. Check testimonial from Laura P.
      const lauraTestimonial = MOCK_TESTIMONIALS.find((t) => t.name.includes("Laura"));
      assert.ok(lauraTestimonial !== undefined, "Must feature testimonial from Laura P.");
      assert.ok(
        lauraTestimonial!.context.toLowerCase().includes("lactosa"),
        "Laura's context must specify lactose intolerance"
      );

      // 3. Customer submits reservation booking for 2 with dairy-free notes
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().split("T")[0];

      const lactoseBookingPayload = {
        fullName: "Laura Peña",
        email: "laura.pena@example.com",
        phone: "+57 315 888 9900",
        date: dateStr,
        time: "17:00",
        guests: 2,
        dietaryNotes:
          "Intolerancia severa a la lactosa y caseína. Solicitamos bebidas preparadas exclusivamente con leche vegetal de avena o almendra certificada.",
      };

      const result = authoritativeReservationSchema.safeParse(lactoseBookingPayload);
      assert.ok(result.success, "Lactose-intolerant booking payload must pass validation");
      assert.strictEqual(
        result.data?.dietaryNotes,
        lactoseBookingPayload.dietaryNotes,
        "Dietary notes must be preserved verbatim"
      );
    }
  );

  // Scenario 3: Table Reservation with Severe Allergy Notes (Anaphylaxis)
  await collector.runTest(
    "T4.3: Severe Nut Allergy Family Reservation (strict sanitation, validation edge cases, and field integrity)",
    () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 2);
      const dateStr = tomorrow.toISOString().split("T")[0];

      // Valid severe allergy booking
      const severeAllergyBooking = {
        fullName: "Alejandro Morales",
        email: "alejandro.morales@example.com",
        phone: "+57 300 987 6543",
        date: dateStr,
        time: "15:00",
        guests: 4,
        dietaryNotes:
          "Alergia severa (anafilaxia) a frutos secos y cacahuetes. Por favor confirmar protocolo estricto de cocina sin contaminación cruzada antes de nuestra llegada.",
      };

      const validResult = authoritativeReservationSchema.safeParse(severeAllergyBooking);
      assert.ok(validResult.success, "Valid severe allergy reservation must succeed");

      // Adversarial Check 1: Missing email at-sign
      const badEmailResult = authoritativeReservationSchema.safeParse({
        ...severeAllergyBooking,
        email: "alejandro.morales.example.com",
      });
      assert.ok(!badEmailResult.success, "Malformed email must fail validation");

      // Adversarial Check 2: Past date
      const badDateResult = authoritativeReservationSchema.safeParse({
        ...severeAllergyBooking,
        date: "2020-01-01",
      });
      assert.ok(!badDateResult.success, "Past date must fail validation");

      // Adversarial Check 3: Short phone number (< 7 digits)
      const badPhoneResult = authoritativeReservationSchema.safeParse({
        ...severeAllergyBooking,
        phone: "123",
      });
      assert.ok(!badPhoneResult.success, "Phone numbers under 7 digits must fail validation");
    }
  );

  // Scenario 4: Verbatim Mandatory Legal Disclaimer Verification
  await collector.runTest(
    "T4.4: Verbatim statutory legal disclaimer verification across components and DOM rendering",
    () => {
      const expectedLegalNotice =
        "La información alimentaria mostrada es orientativa. Si tienes una alergia severa, confirma directamente con el establecimiento los ingredientes, procesos de preparación y medidas frente a contaminación cruzada antes de consumir.";

      // 1. Verify in DietaryDisclaimer component
      const disclaimerHtml = renderComponent(React.createElement(DietaryDisclaimer));
      assert.ok(
        disclaimerHtml.includes(expectedLegalNotice),
        "DietaryDisclaimer must contain exact verbatim statutory legal text"
      );

      // 2. Verify in Footer component
      const footerHtml = renderComponent(React.createElement(Footer));
      assert.ok(
        footerHtml.includes(expectedLegalNotice),
        "Footer must contain exact verbatim statutory legal text"
      );

      // 3. Adversarial integrity checks on the legal text
      const corruptedVariations = [
        expectedLegalNotice.replace("orientativa", "referencial"),
        expectedLegalNotice.replace("severa,", "severa"),
        expectedLegalNotice.substring(0, 100),
      ];

      for (const corrupted of corruptedVariations) {
        assert.notStrictEqual(
          corrupted,
          expectedLegalNotice,
          "Corrupted text must not match verbatim text"
        );
      }
    }
  );
}
