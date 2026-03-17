import type { BrowserEngine, EngineName } from "./engine";
import { PuppeteerEngine } from "./puppeteerEngine";
import { LightpandaEngine } from "./lightpandaEngine";
import { PlaywrightEngine } from "./playwrightEngine";

export function createEngine(engineName: string): BrowserEngine {
  const normalizedEngine = (engineName || "lightpanda") as EngineName;

  switch (normalizedEngine) {
    case "lightpanda":
      return new LightpandaEngine();
    case "puppeteer":
      return new PuppeteerEngine();
    case "playwright-chrome":
      return new PlaywrightEngine("chromium");
    case "playwright-firefox":
      return new PlaywrightEngine("firefox");
    default:
      return new LightpandaEngine();
  }
}
