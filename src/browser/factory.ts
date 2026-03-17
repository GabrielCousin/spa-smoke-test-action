import type { BrowserEngine } from "./engine";
import { PuppeteerEngine } from "./puppeteerEngine";

export function createEngine(): BrowserEngine {
  return new PuppeteerEngine();
}
