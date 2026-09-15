import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function runEmpiricalVerification() {
  console.log("================================================================================");
  console.log("🔬 EMPIRICAL CHALLENGER REMEDIATION 2 — TARGETED MEASUREMENT & ARIA SUITE");
  console.log(`Target: ${BASE_URL}`);
  console.log("================================================================================\n");

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const failures = [];
  const observations = [];

  try {
    // =========================================================================
    // PART 1: TOUCH TARGET MEASUREMENT (390px Mobile Viewport & 320px Stress)
    // =========================================================================
    for (const vp of [
      { name: "Mobile Standard (390x844)", width: 390, height: 844 },
      { name: "Mobile Minimum Stress (320x568)", width: 320, height: 568 },
    ]) {
      console.log(`\n--- [1] Checking Touch Targets at Viewport: ${vp.name} ---`);
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
      });
      const page = await context.newPage();
      await page.goto(BASE_URL, { waitUntil: "networkidle" });

      // Target 1: Mobile hamburger button in Navbar.tsx
      const hamburger = await page.evaluate(() => {
        const btn = document.querySelector('header button[aria-label*="menú de navegación"]');
        if (!btn) return { found: false, error: "Hamburger button not found in header" };
        const rect = btn.getBoundingClientRect();
        return {
          found: true,
          tag: btn.tagName,
          ariaLabel: btn.getAttribute("aria-label"),
          width: Math.round(rect.width * 10) / 10,
          height: Math.round(rect.height * 10) / 10,
          left: rect.left,
          top: rect.top,
          className: btn.className,
          meetsTarget: rect.width >= 43.5 && rect.height >= 43.5,
        };
      });
      console.log(`1. Navbar Hamburger: ${hamburger.width}x${hamburger.height}px | Pass: ${hamburger.meetsTarget} ("${hamburger.ariaLabel}")`);
      observations.push({ target: "Navbar Hamburger", vp: vp.name, ...hamburger });
      if (!hamburger.found || !hamburger.meetsTarget) {
        failures.push(`Navbar Hamburger failed 44px target at ${vp.name}: ${hamburger.width}x${hamburger.height}px`);
      }

      // Target 2: Favorite heart buttons in ProductCard.tsx
      const heartButtons = await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('article button[aria-label*="favoritos"]'));
        return btns.map((b, i) => {
          const rect = b.getBoundingClientRect();
          return {
            index: i,
            ariaLabel: b.getAttribute("aria-label"),
            width: Math.round(rect.width * 10) / 10,
            height: Math.round(rect.height * 10) / 10,
            meetsTarget: rect.width >= 43.5 && rect.height >= 43.5,
          };
        });
      });
      console.log(`2. ProductCard Heart Buttons (${heartButtons.length} cards):`);
      heartButtons.forEach((hb) => {
        console.log(`   Card ${hb.index + 1}: ${hb.width}x${hb.height}px | Pass: ${hb.meetsTarget} ("${hb.ariaLabel}")`);
        if (!hb.meetsTarget) {
          failures.push(`Heart button ${hb.index + 1} failed 44px target at ${vp.name}: ${hb.width}x${hb.height}px`);
        }
      });
      observations.push({ target: "ProductCard Heart Buttons", vp: vp.name, count: heartButtons.length, allPass: heartButtons.every(b => b.meetsTarget) });

      // Target 3: Testimonials pagination dots in Testimonials.tsx
      const paginationDots = await page.evaluate(() => {
        const dots = Array.from(document.querySelectorAll('#testimonios [role="tab"]'));
        return dots.map((d, i) => {
          const rect = d.getBoundingClientRect();
          return {
            index: i,
            ariaLabel: d.getAttribute("aria-label"),
            role: d.getAttribute("role"),
            width: Math.round(rect.width * 10) / 10,
            height: Math.round(rect.height * 10) / 10,
            meetsTarget: rect.width >= 43.5 && rect.height >= 43.5,
          };
        });
      });
      console.log(`3. Testimonials Pagination Dots (${paginationDots.length} dots):`);
      paginationDots.forEach((d) => {
        console.log(`   Dot ${d.index + 1}: ${d.width}x${d.height}px | Pass: ${d.meetsTarget} ("${d.ariaLabel}")`);
        if (!d.meetsTarget) {
          failures.push(`Testimonials dot ${d.index + 1} failed 44px target at ${vp.name}: ${d.width}x${d.height}px`);
        }
      });
      observations.push({ target: "Testimonials Dots", vp: vp.name, count: paginationDots.length, allPass: paginationDots.every(d => d.meetsTarget) });

      // Target 4: FAQ CTA button in FAQ.tsx ("Preguntar en mi reserva")
      const faqCta = await page.evaluate(() => {
        const btn = document.querySelector('#faq a[href="#reserva"]');
        if (!btn) return { found: false, error: "FAQ CTA link not found" };
        const rect = btn.getBoundingClientRect();
        return {
          found: true,
          text: btn.innerText.trim(),
          width: Math.round(rect.width * 10) / 10,
          height: Math.round(rect.height * 10) / 10,
          meetsTarget: rect.width >= 43.5 && rect.height >= 43.5,
        };
      });
      console.log(`4. FAQ CTA Button: ${faqCta.width}x${faqCta.height}px | Pass: ${faqCta.meetsTarget} ("${faqCta.text}")`);
      observations.push({ target: "FAQ CTA", vp: vp.name, ...faqCta });
      if (!faqCta.found || !faqCta.meetsTarget) {
        failures.push(`FAQ CTA failed 44px target at ${vp.name}: ${faqCta.width}x${faqCta.height}px`);
      }

      // Target 5: Footer social media links in Footer.tsx (Instagram, Facebook, TikTok)
      const footerSocials = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('footer a[aria-label*="Síguenos"]'));
        return links.map((l, i) => {
          const rect = l.getBoundingClientRect();
          return {
            index: i,
            ariaLabel: l.getAttribute("aria-label"),
            width: Math.round(rect.width * 10) / 10,
            height: Math.round(rect.height * 10) / 10,
            meetsTarget: rect.width >= 43.5 && rect.height >= 43.5,
          };
        });
      });
      console.log(`5. Footer Social Media Links (${footerSocials.length} links):`);
      footerSocials.forEach((l) => {
        console.log(`   Social ${l.index + 1}: ${l.width}x${l.height}px | Pass: ${l.meetsTarget} ("${l.ariaLabel}")`);
        if (!l.meetsTarget) {
          failures.push(`Social link ${l.index + 1} failed 44px target at ${vp.name}: ${l.width}x${l.height}px`);
        }
      });
      observations.push({ target: "Footer Socials", vp: vp.name, count: footerSocials.length, allPass: footerSocials.every(l => l.meetsTarget) });

      // Target 6: Footer WhatsApp CTA in Footer.tsx
      const footerWhatsapp = await page.evaluate(() => {
        const btn = document.querySelector('footer a[href*="wa.me"]');
        if (!btn) return { found: false, error: "Footer WhatsApp link not found" };
        const rect = btn.getBoundingClientRect();
        return {
          found: true,
          text: btn.innerText.trim(),
          width: Math.round(rect.width * 10) / 10,
          height: Math.round(rect.height * 10) / 10,
          meetsTarget: rect.width >= 43.5 && rect.height >= 43.5,
        };
      });
      console.log(`6. Footer WhatsApp CTA: ${footerWhatsapp.width}x${footerWhatsapp.height}px | Pass: ${footerWhatsapp.meetsTarget} ("${footerWhatsapp.text}")`);
      observations.push({ target: "Footer WhatsApp", vp: vp.name, ...footerWhatsapp });
      if (!footerWhatsapp.found || !footerWhatsapp.meetsTarget) {
        failures.push(`Footer WhatsApp failed 44px target at ${vp.name}: ${footerWhatsapp.width}x${footerWhatsapp.height}px`);
      }

      await context.close();
    }

    // =========================================================================
    // PART 2: ARIA ACCORDION PANEL REFERENCES (Ingredients & FAQ)
    // =========================================================================
    console.log("\n--- [2] Checking ARIA Accordion References (Collapsed & Expanded States) ---");
    const testContext = await browser.newContext({ viewport: { width: 1024, height: 800 } });
    const testPage = await testContext.newPage();
    await testPage.goto(BASE_URL, { waitUntil: "networkidle" });

    // 2.1 Ingredients Accordion
    const ingredientsAccordions = await testPage.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('#insumos button[aria-expanded]'));
      return buttons.map((b) => ({
        id: b.id,
        text: b.innerText.trim().slice(0, 30),
        ariaControls: b.getAttribute("aria-controls"),
        initialExpanded: b.getAttribute("aria-expanded") === "true",
      }));
    });

    console.log(`\nFound ${ingredientsAccordions.length} accordion items in Ingredients (#insumos):`);
    for (const item of ingredientsAccordions) {
      // Step A: Check initial panel existence in DOM
      const initialPanelCheck = await testPage.evaluate((controlsId) => {
        const panel = document.getElementById(controlsId);
        if (!panel) return { exists: false };
        return {
          exists: true,
          role: panel.getAttribute("role"),
          ariaLabelledby: panel.getAttribute("aria-labelledby"),
          tagName: panel.tagName.toLowerCase(),
        };
      }, item.ariaControls);

      console.log(`   [Initial (expanded: ${item.initialExpanded})] "${item.text}" -> "${item.ariaControls}": in DOM = ${initialPanelCheck.exists}, role="${initialPanelCheck.role}", labelledby="${initialPanelCheck.ariaLabelledby}"`);

      if (!initialPanelCheck.exists) {
        failures.push(`Ingredients accordion panel "${item.ariaControls}" DOES NOT exist in DOM in initial state!`);
      }
      if (initialPanelCheck.role !== "region") {
        failures.push(`Ingredients accordion panel "${item.ariaControls}" role is not "region" (got "${initialPanelCheck.role}")`);
      }
      if (initialPanelCheck.ariaLabelledby !== item.id) {
        failures.push(`Ingredients accordion panel "${item.ariaControls}" aria-labelledby ("${initialPanelCheck.ariaLabelledby}") does not match trigger ID ("${item.id}")`);
      }

      // Step B: Toggle state
      const triggerSelector = `#${item.id}`;
      await testPage.click(triggerSelector);
      await testPage.waitForTimeout(100);

      const toggledCheck = await testPage.evaluate(({ triggerId, controlsId }) => {
        const btn = document.getElementById(triggerId);
        const panel = document.getElementById(controlsId);
        return {
          expandedAttr: btn?.getAttribute("aria-expanded") === "true",
          panelExists: !!panel,
        };
      }, { triggerId: item.id, controlsId: item.ariaControls });

      const expectedToggledState = !item.initialExpanded;
      console.log(`   [Toggled]  "${item.text}": aria-expanded=${toggledCheck.expandedAttr} (expected ${expectedToggledState}), panelExists=${toggledCheck.panelExists}`);
      if (toggledCheck.expandedAttr !== expectedToggledState) {
        failures.push(`Ingredients accordion "${item.id}" toggled state was ${toggledCheck.expandedAttr}, expected ${expectedToggledState}`);
      }
      if (!toggledCheck.panelExists) {
        failures.push(`Ingredients accordion panel "${item.ariaControls}" missing from DOM after toggle`);
      }

      // Step C: Re-toggle back
      await testPage.click(triggerSelector);
      await testPage.waitForTimeout(100);

      const reToggledCheck = await testPage.evaluate(({ triggerId, controlsId }) => {
        const btn = document.getElementById(triggerId);
        const panel = document.getElementById(controlsId);
        return {
          expandedAttr: btn?.getAttribute("aria-expanded") === "true",
          panelExists: !!panel,
        };
      }, { triggerId: item.id, controlsId: item.ariaControls });

      console.log(`   [Re-toggled] "${item.text}": aria-expanded=${reToggledCheck.expandedAttr} (expected ${item.initialExpanded}), panelExists=${reToggledCheck.panelExists}`);
      if (reToggledCheck.expandedAttr !== item.initialExpanded) {
        failures.push(`Ingredients accordion "${item.id}" re-toggled state was ${reToggledCheck.expandedAttr}, expected ${item.initialExpanded}`);
      }
      if (!reToggledCheck.panelExists) {
        failures.push(`Ingredients accordion panel "${item.ariaControls}" missing from DOM after re-toggle`);
      }
    }

    // 2.2 FAQ Accordion
    const faqAccordions = await testPage.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('#faq button[aria-expanded]'));
      return buttons.map((b) => ({
        id: b.id,
        text: b.innerText.trim().slice(0, 30),
        ariaControls: b.getAttribute("aria-controls"),
        initialExpanded: b.getAttribute("aria-expanded") === "true",
      }));
    });

    console.log(`\nFound ${faqAccordions.length} accordion items in FAQ (#faq):`);
    for (const item of faqAccordions) {
      // Step A: Check initial state
      const initialPanelCheck = await testPage.evaluate((controlsId) => {
        const panel = document.getElementById(controlsId);
        if (!panel) return { exists: false };
        return {
          exists: true,
          role: panel.getAttribute("role"),
          ariaLabelledby: panel.getAttribute("aria-labelledby"),
          tagName: panel.tagName.toLowerCase(),
        };
      }, item.ariaControls);

      console.log(`   [Initial (expanded: ${item.initialExpanded})] "${item.text}" -> "${item.ariaControls}": in DOM = ${initialPanelCheck.exists}, role="${initialPanelCheck.role}", labelledby="${initialPanelCheck.ariaLabelledby}"`);

      if (!initialPanelCheck.exists) {
        failures.push(`FAQ accordion panel "${item.ariaControls}" DOES NOT exist in DOM initially!`);
      }
      if (initialPanelCheck.role !== "region") {
        failures.push(`FAQ accordion panel "${item.ariaControls}" role is not "region" (got "${initialPanelCheck.role}")`);
      }
      if (initialPanelCheck.ariaLabelledby !== item.id) {
        failures.push(`FAQ accordion panel "${item.ariaControls}" aria-labelledby ("${initialPanelCheck.ariaLabelledby}") does not match trigger ID ("${item.id}")`);
      }

      // Step B: Toggle
      const triggerSelector = `#${item.id}`;
      await testPage.click(triggerSelector);
      await testPage.waitForTimeout(100);

      const toggledCheck = await testPage.evaluate(({ triggerId, controlsId }) => {
        const btn = document.getElementById(triggerId);
        const panel = document.getElementById(controlsId);
        return {
          expandedAttr: btn?.getAttribute("aria-expanded") === "true",
          panelExists: !!panel,
        };
      }, { triggerId: item.id, controlsId: item.ariaControls });

      const expectedToggledState = !item.initialExpanded;
      console.log(`   [Toggled] "${item.text}": aria-expanded=${toggledCheck.expandedAttr} (expected ${expectedToggledState}), panelExists=${toggledCheck.panelExists}`);
      if (toggledCheck.expandedAttr !== expectedToggledState) {
        failures.push(`FAQ accordion "${item.id}" toggled state was ${toggledCheck.expandedAttr}, expected ${expectedToggledState}`);
      }
      if (!toggledCheck.panelExists) {
        failures.push(`FAQ accordion panel "${item.ariaControls}" missing after toggle`);
      }

      // Step C: Toggle back
      await testPage.click(triggerSelector);
      await testPage.waitForTimeout(100);

      const reToggledCheck = await testPage.evaluate(({ triggerId, controlsId }) => {
        const btn = document.getElementById(triggerId);
        const panel = document.getElementById(controlsId);
        return {
          expandedAttr: btn?.getAttribute("aria-expanded") === "true",
          panelExists: !!panel,
        };
      }, { triggerId: item.id, controlsId: item.ariaControls });

      console.log(`   [Re-toggled] "${item.text}": aria-expanded=${reToggledCheck.expandedAttr} (expected ${item.initialExpanded}), panelExists=${reToggledCheck.panelExists}`);
      if (reToggledCheck.expandedAttr !== item.initialExpanded) {
        failures.push(`FAQ accordion "${item.id}" re-toggled state was ${reToggledCheck.expandedAttr}, expected ${item.initialExpanded}`);
      }
      if (!reToggledCheck.panelExists) {
        failures.push(`FAQ accordion panel "${item.ariaControls}" missing after re-toggle`);
      }
    }

    // =========================================================================
    // PART 3: RAPID STRESS INTERACTION (Adversarial clicks on accordions)
    // =========================================================================
    console.log("\n--- [3] Rapid Stress Toggling on Accordions ---");
    const rapidTestPassed = await testPage.evaluate(async () => {
      const btn = document.querySelector('#insumos button[aria-expanded]');
      const controlsId = btn.getAttribute("aria-controls");
      for (let i = 0; i < 20; i++) {
        btn.click();
        if (!document.getElementById(controlsId)) {
          return { passed: false, error: `Panel disappeared on rapid click iteration ${i}` };
        }
      }
      return { passed: true };
    });
    console.log(`Rapid click stress test (20 clicks): ${rapidTestPassed.passed ? "PASSED" : "FAILED"}`);
    if (!rapidTestPassed.passed) {
      failures.push(rapidTestPassed.error);
    }

    await testContext.close();

    console.log("\n================================================================================");
    console.log("FINAL RESULTS SUMMARY");
    console.log("================================================================================");
    console.log(`Total Failures Detected: ${failures.length}`);
    if (failures.length > 0) {
      console.error("\n❌ VERIFICATION FAILED:");
      failures.forEach((f, idx) => console.error(`  ${idx + 1}. ${f}`));
      process.exit(1);
    } else {
      console.log("\n🎉 ALL 6 TOUCH TARGETS (>= 44px) AND ALL ARIA ACCORDION TARGETS EMPIRICALLY VERIFIED!");
    }

  } finally {
    await browser.close();
  }
}

runEmpiricalVerification().catch((err) => {
  console.error("Fatal test execution error:", err);
  process.exit(1);
});
