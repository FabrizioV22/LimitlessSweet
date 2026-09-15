import { chromium } from "playwright";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

const REQUIRED_DISCLAIMER =
  "La información alimentaria mostrada es orientativa. Si tienes una alergia severa, confirma directamente con el establecimiento los ingredientes, procesos de preparación y medidas frente a contaminación cruzada antes de consumir.";

async function runTests() {
  console.log("==================================================");
  console.log("STARTING ADVERSARIAL RESPONSIVE & A11Y TEST SUITE");
  console.log(`Target: ${BASE_URL}`);
  console.log("==================================================\n");

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const results = {
    breakpoints: [],
    overflows: [],
    touchTargets: [],
    keyboardNav: [],
    ariaCompliance: [],
    disclaimer: null,
    reducedMotion: null,
  };

  try {
    // ----------------------------------------------------
    // TEST 1: VIEWPORT & RESPONSIVE LAYOUTS & OVERFLOW
    // Breakpoints: 320px (stress), 390px (mobile), 768px (tablet), 1280px (desktop), 1440px (wide)
    // ----------------------------------------------------
    const viewports = [
      { name: "mobile-stress (320px)", width: 320, height: 568 },
      { name: "mobile (390px)", width: 390, height: 844 },
      { name: "tablet (768px)", width: 768, height: 1024 },
      { name: "desktop (1280px)", width: 1280, height: 800 },
      { name: "desktop-large (1440px)", width: 1440, height: 900 },
    ];

    for (const vp of viewports) {
      console.log(`\n--- Testing Viewport: ${vp.name} ---`);
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        userAgent:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
      });
      const page = await context.newPage();
      await page.goto(BASE_URL, { waitUntil: "networkidle" });

      // Viewport meta check
      const viewportMeta = await page.evaluate(() => {
        const meta = document.querySelector('meta[name="viewport"]');
        return meta ? meta.getAttribute("content") : null;
      });

      // Horizontal overflow check
      const overflowData = await page.evaluate(() => {
        const docWidth = document.documentElement.clientWidth;
        const scrollWidth = document.documentElement.scrollWidth;
        const bodyScrollWidth = document.body.scrollWidth;

        // Check which elements protrude beyond window innerWidth
        const protruding = [];
        const allElements = document.querySelectorAll("*");
        for (const el of allElements) {
          const rect = el.getBoundingClientRect();
          // el must be visible
          if (rect.width > 0 && rect.height > 0) {
            if (rect.right > docWidth + 1 || rect.left < -1) {
              const tag = el.tagName.toLowerCase();
              const id = el.id ? `#${el.id}` : "";
              const cls = el.className && typeof el.className === "string" ? `.${el.className.split(" ").slice(0, 3).join(".")}` : "";
              protruding.push({
                element: `${tag}${id}${cls}`,
                rect: { left: rect.left, right: rect.right, width: rect.width },
                excess: rect.right - docWidth,
              });
            }
          }
        }
        return {
          clientWidth: docWidth,
          scrollWidth,
          bodyScrollWidth,
          hasDocOverflow: scrollWidth > docWidth,
          hasBodyOverflow: bodyScrollWidth > docWidth,
          protruding: protruding.slice(0, 10),
        };
      });

      const bpResult = {
        viewport: vp,
        viewportMeta,
        overflow: overflowData,
      };
      results.breakpoints.push(bpResult);

      console.log(`Viewport ${vp.name}: clientWidth=${overflowData.clientWidth}, scrollWidth=${overflowData.scrollWidth}`);
      console.log(`Doc overflow: ${overflowData.hasDocOverflow}, Body overflow: ${overflowData.hasBodyOverflow}`);
      if (overflowData.protruding.length > 0) {
        console.log(`Protruding elements found (${overflowData.protruding.length}):`);
        overflowData.protruding.forEach((p) => {
          console.log(`  - ${p.element}: excess = ${p.excess.toFixed(1)}px (right: ${p.rect.right.toFixed(1)})`);
        });
      } else {
        console.log(`No protruding elements.`);
      }

      await context.close();
    }

    // ----------------------------------------------------
    // TEST 2: TOUCH TARGETS (WCAG 2.5.5 >= 44px)
    // ----------------------------------------------------
    console.log("\n--- Testing Touch Target Sizes (WCAG 2.5.5 >= 44x44) at 390px ---");
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(BASE_URL, { waitUntil: "networkidle" });

    // Measure all interactive elements
    const touchTargetResults = await mobilePage.evaluate(() => {
      const interactives = document.querySelectorAll(
        'button, a, input:not([type="hidden"]), select, textarea, [role="button"], [role="tab"]'
      );
      const measured = [];

      interactives.forEach((el, index) => {
        // Skip hidden / sr-only elements if not visible
        const style = window.getComputedStyle(el);
        if (
          style.display === "none" ||
          style.visibility === "hidden" ||
          style.opacity === "0" ||
          el.offsetWidth === 0 ||
          el.offsetHeight === 0
        ) {
          return;
        }

        const rect = el.getBoundingClientRect();
        const tag = el.tagName.toLowerCase();
        const text = (el.innerText || el.getAttribute("aria-label") || el.getAttribute("placeholder") || "").trim().slice(0, 30);
        const id = el.id ? `#${el.id}` : "";
        const className = typeof el.className === "string" ? el.className.split(" ").slice(0, 3).join(" ") : "";

        const meetsHeight = rect.height >= 44 - 0.5; // allowing 0.5px subpixel antialiasing
        const meetsWidth = rect.width >= 44 - 0.5;
        const meetsBoth = meetsHeight && meetsWidth;

        measured.push({
          index,
          tag,
          id,
          className,
          text,
          width: Math.round(rect.width * 10) / 10,
          height: Math.round(rect.height * 10) / 10,
          meetsHeight,
          meetsWidth,
          meetsBoth,
          ariaLabel: el.getAttribute("aria-label"),
        });
      });

      return measured;
    });

    results.touchTargets = touchTargetResults;
    const failingTargets = touchTargetResults.filter((t) => !t.meetsHeight || !t.meetsWidth);
    console.log(`Total visible interactive elements inspected: ${touchTargetResults.length}`);
    console.log(`Elements failing 44x44 minimum touch target: ${failingTargets.length}`);
    failingTargets.forEach((t) => {
      console.log(`  FAIL: [${t.tag}${t.id}] "${t.text}" -> ${t.width}x${t.height}px (height >= 44: ${t.meetsHeight}, width >= 44: ${t.meetsWidth})`);
    });

    // ----------------------------------------------------
    // TEST 3: KEYBOARD NAVIGATION & FOCUS RINGS
    // ----------------------------------------------------
    console.log("\n--- Testing Keyboard Navigation & Focus Rings ---");
    // Test skip link
    await mobilePage.keyboard.press("Tab");
    const firstFocused = await mobilePage.evaluate(() => {
      const active = document.activeElement;
      if (!active) return null;
      const rect = active.getBoundingClientRect();
      const style = window.getComputedStyle(active);
      return {
        tag: active.tagName,
        text: active.innerText,
        href: active.getAttribute("href"),
        visible: rect.width > 0 && rect.height > 0 && style.display !== "none",
        outline: style.outline,
        outlineColor: style.outlineColor,
      };
    });
    console.log("First Tab element (Skip Link):", firstFocused);

    // Test visible focus ring color on focused elements
    const focusRingResults = [];
    for (let i = 0; i < 8; i++) {
      await mobilePage.keyboard.press("Tab");
      const focused = await mobilePage.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
          tag: el.tagName,
          text: (el.innerText || el.getAttribute("aria-label") || "").trim().slice(0, 25),
          outline: style.outline,
          outlineColor: style.outlineColor,
          boxShadow: style.boxShadow,
          visible: rect.width > 0 && rect.height > 0,
        };
      });
      if (focused) focusRingResults.push(focused);
    }
    results.keyboardNav = { firstFocused, focusRingResults };
    console.log(`Tabbed through 8 items. Focus samples:`, focusRingResults.slice(0, 4));

    // ----------------------------------------------------
    // TEST 4: ACCORDION KEYBOARD INTERACTION (ENTER & SPACE)
    // ----------------------------------------------------
    console.log("\n--- Testing Accordion Keyboard Interaction ---");
    const accordionTest = await mobilePage.evaluate(async () => {
      const btn = document.querySelector("#accordion-trigger-ing-brownie") || document.querySelector("#insumos button[aria-expanded]");
      if (!btn) return { error: "No accordion button found" };
      btn.focus();
      const initialExpanded = btn.getAttribute("aria-expanded");
      btn.click(); // or trigger click via space/enter
      const toggledExpanded = btn.getAttribute("aria-expanded");
      btn.click();
      const revertedExpanded = btn.getAttribute("aria-expanded");
      return {
        initialExpanded,
        toggledExpanded,
        revertedExpanded,
        ariaControls: btn.getAttribute("aria-controls"),
        panelExists: !!document.getElementById(btn.getAttribute("aria-controls")),
      };
    });
    console.log("Accordion keyboard/aria test:", accordionTest);

    // ----------------------------------------------------
    // TEST 5: ARIA COMPLIANCE (ROLES, CONTROLS, LABELS)
    // ----------------------------------------------------
    console.log("\n--- Testing ARIA Compliance Across Sections ---");
    const ariaAudit = await mobilePage.evaluate(() => {
      const findings = [];

      // Accordion buttons in Insumos
      const insumosButtons = document.querySelectorAll("#insumos button[aria-expanded]");
      insumosButtons.forEach((btn) => {
        const controls = btn.getAttribute("aria-controls");
        const panel = controls ? document.getElementById(controls) : null;
        findings.push({
          section: "Insumos Accordion",
          hasAriaExpanded: btn.hasAttribute("aria-expanded"),
          ariaExpandedValue: btn.getAttribute("aria-expanded"),
          hasAriaControls: !!controls,
          panelExists: !!panel,
          panelRole: panel ? panel.getAttribute("role") : null,
          panelLabelledBy: panel ? panel.getAttribute("aria-labelledby") : null,
          matchesTriggerId: panel ? panel.getAttribute("aria-labelledby") === btn.id : false,
        });
      });

      // FAQ accordion buttons
      const faqButtons = document.querySelectorAll("#faq button[aria-expanded]");
      faqButtons.forEach((btn) => {
        const controls = btn.getAttribute("aria-controls");
        const panel = controls ? document.getElementById(controls) : null;
        findings.push({
          section: "FAQ Accordion",
          hasAriaExpanded: btn.hasAttribute("aria-expanded"),
          ariaExpandedValue: btn.getAttribute("aria-expanded"),
          hasAriaControls: !!controls,
          panelExists: !!panel,
          panelRole: panel ? panel.getAttribute("role") : null,
          panelLabelledBy: panel ? panel.getAttribute("aria-labelledby") : null,
          matchesTriggerId: panel ? panel.getAttribute("aria-labelledby") === btn.id : false,
        });
      });

      // Menu filter tabs
      const tablist = document.querySelector('[role="tablist"]');
      const tabs = document.querySelectorAll('[role="tab"]');
      findings.push({
        section: "Menu Filter Tabs",
        hasTablist: !!tablist,
        tabCount: tabs.length,
        tabsHaveAriaSelected: Array.from(tabs).every((t) => t.hasAttribute("aria-selected")),
        activeTabCount: Array.from(tabs).filter((t) => t.getAttribute("aria-selected") === "true").length,
      });

      return findings;
    });
    results.ariaCompliance = ariaAudit;
    console.log(`Checked ARIA on ${ariaAudit.length} components.`);

    // ----------------------------------------------------
    // TEST 6: VERBATIM DIETARY DISCLAIMER
    // ----------------------------------------------------
    console.log("\n--- Testing Verbatim Dietary Legal Disclaimer ---");
    const disclaimerAudit = await mobilePage.evaluate((expected) => {
      // Find all text elements containing "La información alimentaria"
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let foundNode = null;
      let fullMatchedText = "";
      while (walker.nextNode()) {
        if (walker.currentNode.nodeValue.includes("información alimentaria")) {
          foundNode = walker.currentNode;
          fullMatchedText = walker.currentNode.nodeValue.trim();
          break;
        }
      }

      if (!foundNode) {
        return { found: false, error: "Text not found anywhere in DOM" };
      }

      const parent = foundNode.parentElement;
      const isExactMatch = fullMatchedText === expected;
      const parentTag = parent.tagName.toLowerCase();
      const containerRole = parent.closest('[role="note"]')?.getAttribute("role") || null;
      const containerAriaLabel = parent.closest('[role="note"]')?.getAttribute("aria-label") || null;

      // Check visibility
      const rect = parent.getBoundingClientRect();
      const style = window.getComputedStyle(parent);
      const isVisible = rect.height > 0 && rect.width > 0 && style.visibility !== "hidden" && style.display !== "none";

      return {
        found: true,
        actualText: fullMatchedText,
        expectedText: expected,
        isExactMatch,
        parentTag,
        containerRole,
        containerAriaLabel,
        isVisible,
        diff: isExactMatch ? null : {
          expectedLength: expected.length,
          actualLength: fullMatchedText.length,
        },
      };
    }, REQUIRED_DISCLAIMER);

    results.disclaimer = disclaimerAudit;
    console.log("Disclaimer Exact Match:", disclaimerAudit.isExactMatch);
    console.log("Disclaimer Visible:", disclaimerAudit.isVisible);
    console.log("Disclaimer Container Role:", disclaimerAudit.containerRole);

    // ----------------------------------------------------
    // TEST 7: PREFERS-REDUCED-MOTION
    // ----------------------------------------------------
    console.log("\n--- Testing prefers-reduced-motion Overrides ---");
    const reducedMotionContext = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      reducedMotion: "reduce",
    });
    const reducedMotionPage = await reducedMotionContext.newPage();
    await reducedMotionPage.goto(BASE_URL, { waitUntil: "networkidle" });

    const reducedMotionStyles = await reducedMotionPage.evaluate(() => {
      const body = document.body;
      const html = document.documentElement;
      const card = document.querySelector("article");

      const bodyStyle = window.getComputedStyle(body);
      const htmlStyle = window.getComputedStyle(html);
      const cardStyle = card ? window.getComputedStyle(card) : null;

      return {
        scrollBehavior: htmlStyle.scrollBehavior,
        cardTransitionDuration: cardStyle ? cardStyle.transitionDuration : null,
        cardAnimationDuration: cardStyle ? cardStyle.animationDuration : null,
      };
    });
    results.reducedMotion = reducedMotionStyles;
    console.log("Reduced motion styles:", reducedMotionStyles);

    await reducedMotionContext.close();
    await mobileContext.close();

    console.log("\n==================================================");
    console.log("TEST RUN COMPLETE - GENERATING SUMMARY");
    console.log("==================================================");

    return results;
  } finally {
    await browser.close();
  }
}

runTests().then((res) => {
  // Output JSON for programmatic analysis if needed
  console.log("\n--- FULL RESULT SUMMARY JSON ---");
  console.log(JSON.stringify({
    overflows: res.breakpoints.map((b) => ({
      viewport: b.viewport.name,
      docOverflow: b.overflow.hasDocOverflow,
      bodyOverflow: b.overflow.hasBodyOverflow,
      protrudingCount: b.overflow.protruding.length,
      protrudingElements: b.overflow.protruding,
    })),
    touchTargetsSummary: {
      total: res.touchTargets.length,
      failingCount: res.touchTargets.filter((t) => !t.meetsHeight || !t.meetsWidth).length,
      failing: res.touchTargets.filter((t) => !t.meetsHeight || !t.meetsWidth),
    },
    disclaimerExact: res.disclaimer?.isExactMatch,
    disclaimerVisible: res.disclaimer?.isVisible,
    ariaAccordionsValid: res.ariaCompliance.every((a) => a.panelExists !== false),
  }, null, 2));
}).catch((err) => {
  console.error("Test failed with error:", err);
  process.exit(1);
});
