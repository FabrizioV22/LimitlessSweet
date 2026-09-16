#!/usr/bin/env node

/**
 * ======================================================================
 * LIMITLESS SWEET — E2E REQUIREMENT-DRIVEN TEST RUNNER
 * 4-Tier Verification Suite
 * ======================================================================
 */

import { TestCollector, TierSummary } from "./helpers/test-utils";
import { runTier1Tests } from "./tier1-feature-coverage.test";
import { runTier2Tests } from "./tier2-boundary-corner.test";
import { runTier3Tests } from "./tier3-cross-feature.test";
import { runTier4Tests } from "./tier4-user-scenarios.test";
import { runRoadmapModernizationTests } from "./roadmap-modernization.test";

async function main() {
  const collector = new TestCollector();
  const overallStart = Date.now();

  console.log("======================================================================");
  console.log("🌸 LIMITLESS SWEET — E2E REQUIREMENT & UI/UX MODERNIZATION SUITE");
  console.log("   Framework: Next.js 15 App Router | React 18 | Tailwind CSS");
  console.log(`   Execution Started: ${new Date().toISOString()}`);
  console.log("======================================================================\n");

  // Tier 1: Feature Coverage
  console.log("▶ Running Tier 1: Feature Coverage (10 Sections, Anchors, Cards, Accordions)...");
  await runTier1Tests(collector);
  console.log("");

  // Tier 2: Boundary & Corner Cases
  console.log("▶ Running Tier 2: Boundary & Corner Cases (Guests 1-20, Stock, Clamps, A11y)...");
  await runTier2Tests(collector);
  console.log("");

  // Tier 3: Cross-Feature Combinations
  console.log("▶ Running Tier 3: Cross-Feature Combinations (Filter+Cart, Accordion IDs, Modals)...");
  await runTier3Tests(collector);
  console.log("");

  // Tier 4: Real-World User Scenarios
  console.log("▶ Running Tier 4: Real-World User Scenarios (Celiac, Lactose, Anaphylaxis, Disclaimer)...");
  await runTier4Tests(collector);
  console.log("");

  // Tier 5: Roadmap UI/UX Modernization
  console.log("▶ Running Roadmap UI/UX Modernization (Scrollspy, Parallax, Petals, Tilt, Scrollytelling)...");
  await runRoadmapModernizationTests(collector);
  console.log("");

  const overallDuration = Date.now() - overallStart;
  const overall = collector.getOverallSummary();

  const tier1 = collector.getTierSummary("Tier 1: Feature Coverage");
  const tier2 = collector.getTierSummary("Tier 2: Boundary & Corner Cases");
  const tier3 = collector.getTierSummary("Tier 3: Cross-Feature Combinations");
  const tier4 = collector.getTierSummary("Tier 4: Real-World User Scenarios");
  const tier5 = collector.getTierSummary("Roadmap UI/UX Modernization");

  console.log("======================================================================");
  console.log("                  VERIFICATION SUITE SUMMARY RESULTS                   ");
  console.log("======================================================================");

  const formatSummaryLine = (summary: TierSummary) => {
    const status = summary.failed === 0 ? "PASSED" : "FAILED";
    const symbol = summary.failed === 0 ? "✔" : "✖";
    const counts = `${summary.passed}/${summary.total} tests passed`;
    const time = `${summary.durationMs}ms`;
    console.log(
      `  ${symbol} [${status.padEnd(6)}] ${summary.tier.padEnd(36)} ${counts.padStart(20)} (${time})`
    );
  };

  formatSummaryLine(tier1);
  formatSummaryLine(tier2);
  formatSummaryLine(tier3);
  formatSummaryLine(tier4);
  formatSummaryLine(tier5);

  console.log("----------------------------------------------------------------------");
  const successRate = overall.total > 0 ? ((overall.passed / overall.total) * 100).toFixed(1) : "0.0";
  console.log(
    `  TOTAL TESTS: ${overall.total} | PASSED: ${overall.passed} | FAILED: ${overall.failed} | SUCCESS RATE: ${successRate}%`
  );
  console.log(`  TOTAL ELAPSED TIME: ${overallDuration}ms`);
  console.log("======================================================================");

  if (overall.failed > 0) {
    console.error("\n❌ SUITE EXECUTION FAILED: One or more assertions did not pass.");
    const failures = collector.getAllResults().filter((r) => !r.passed);
    console.error("\nFailed Assertions:");
    failures.forEach((f, idx) => {
      console.error(`  ${idx + 1}. [${f.tier}] ${f.name}`);
      if (f.error) console.error(`     ${f.error.split("\n")[0]}`);
    });
    process.exit(1);
  } else {
    console.log("\n🎉 SUITE EXECUTION SUCCESSFUL: All requirement verifications passed cleanly!");
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("Fatal unhandled error during verification execution:", err);
  process.exit(1);
});
