import type { BrowserName, BrowserEngine, EngineName } from "./engine";
import { PuppeteerEngine } from "./puppeteerEngine";
import { LightpandaEngine } from "./lightpandaEngine";
import { PlaywrightEngine } from "./playwrightEngine";

export function createEngine(
  engineName: string,
  browserName: string,
): BrowserEngine {
  const normalizedEngine = (engineName || "lightpanda") as EngineName;
  const normalizedBrowser = (browserName || "chromium") as BrowserName;

  switch (normalizedEngine) {
    case "lightpanda":
      return new LightpandaEngine();
    case "playwright":
      return new PlaywrightEngine(normalizedBrowser);
    case "puppeteer":
    default:
      return new PuppeteerEngine();
  }
}
