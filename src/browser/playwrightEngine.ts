import { chromium, firefox, type Browser } from "playwright";
import type { BrowserEngine, BrowserName, SmokeTestOptions } from "./engine";

function getPlaywrightBrowser(browserName: BrowserName) {
  switch (browserName) {
    case "firefox":
      return firefox;
    case "chromium":
    default:
      return chromium;
  }
}

export class PlaywrightEngine implements BrowserEngine {
  constructor(private readonly browserName: BrowserName = "chromium") {}

  async runSmokeTest(options: SmokeTestOptions): Promise<void> {
    const browserType = getPlaywrightBrowser(this.browserName);
    const browser: Browser = await browserType.launch();

    try {
      const context = await browser.newContext();

      const page = await context.newPage();

      if (options.endpoint) {
        const requestPromise = page.waitForRequest(options.endpoint);
        await page.goto(options.url);
        await Promise.all([
          requestPromise,
          page.waitForSelector(options.selector),
        ]);
      } else {
        await page.goto(options.url);
        await page.waitForSelector(options.selector);
      }

      await page.close();
      await context.close();
    } finally {
      await browser.close();
    }
  }
}
