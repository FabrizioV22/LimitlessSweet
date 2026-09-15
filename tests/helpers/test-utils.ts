import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import assert from "node:assert/strict";

export interface TestCaseResult {
  tier: string;
  name: string;
  passed: boolean;
  error?: string;
  durationMs: number;
}

export interface TierSummary {
  tier: string;
  total: number;
  passed: number;
  failed: number;
  durationMs: number;
  results: TestCaseResult[];
}

export class TestCollector {
  private currentTier: string = "Default";
  private results: TestCaseResult[] = [];
  private tierStartTime: number = 0;

  setTier(tierName: string) {
    this.currentTier = tierName;
    this.tierStartTime = Date.now();
  }

  async runTest(name: string, fn: () => void | Promise<void>): Promise<boolean> {
    const start = Date.now();
    try {
      await fn();
      const durationMs = Date.now() - start;
      this.results.push({
        tier: this.currentTier,
        name,
        passed: true,
        durationMs,
      });
      console.log(`  ✔ [PASS] ${name} (${durationMs}ms)`);
      return true;
    } catch (err: unknown) {
      const durationMs = Date.now() - start;
      const errorMsg = err instanceof Error ? err.stack || err.message : String(err);
      this.results.push({
        tier: this.currentTier,
        name,
        passed: false,
        error: errorMsg,
        durationMs,
      });
      console.error(`  ✖ [FAIL] ${name} (${durationMs}ms)`);
      console.error(`     Error: ${errorMsg.split("\n")[0]}`);
      return false;
    }
  }

  getTierSummary(tierName: string): TierSummary {
    const tierResults = this.results.filter((r) => r.tier === tierName);
    const passed = tierResults.filter((r) => r.passed).length;
    const failed = tierResults.filter((r) => !r.passed).length;
    const durationMs = tierResults.reduce((sum, r) => sum + r.durationMs, 0);

    return {
      tier: tierName,
      total: tierResults.length,
      passed,
      failed,
      durationMs,
      results: tierResults,
    };
  }

  getAllResults(): TestCaseResult[] {
    return this.results;
  }

  getOverallSummary() {
    const total = this.results.length;
    const passed = this.results.filter((r) => r.passed).length;
    const failed = this.results.filter((r) => !r.passed).length;
    const durationMs = this.results.reduce((sum, r) => sum + r.durationMs, 0);

    return { total, passed, failed, durationMs };
  }
}

/**
 * Utility to render a React element to an HTML string.
 */
export function renderComponent(element: React.ReactElement): string {
  return renderToStaticMarkup(element);
}

/**
 * Normalizes text by collapsing whitespace and trimming.
 */
export function normalizeText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/**
 * Strips HTML tags from an HTML string to get pure visible text content.
 */
export function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export { assert };
