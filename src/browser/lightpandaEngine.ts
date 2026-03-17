import puppeteer from "puppeteer-core";
import type { BrowserEngine, SmokeTestOptions } from "./engine";

const DEFAULT_LIGHTPANDA_ENDPOINT =
  process.env.LIGHTPANDA_BROWSER_ENDPOINT ?? "ws://127.0.0.1:9222";

export class LightpandaEngine implements BrowserEngine {
  async runSmokeTest(options: SmokeTestOptions): Promise<void> {
    const browser = await puppeteer.connect({
      browserWSEndpoint: DEFAULT_LIGHTPANDA_ENDPOINT,
    });

    try {
      const context = await browser.createBrowserContext();
      const page = await context.newPage();

      const requestCheck = options.endpoint
        ? page.waitForRequest(options.endpoint)
        : Promise.resolve();

      await page.goto(options.url);

      await Promise.all([requestCheck, page.waitForSelector(options.selector)]);

      await page.close();
      await context.close();
    } finally {
      await browser.disconnect();
    }
  }
}
