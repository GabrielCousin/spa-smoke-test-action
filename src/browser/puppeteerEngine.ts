import puppeteer from "puppeteer";
import type { BrowserEngine, SmokeTestOptions } from "./engine";
import { findChromePath } from "../utils/findChromePath";

export class PuppeteerEngine implements BrowserEngine {
  async runSmokeTest(options: SmokeTestOptions): Promise<void> {
    const chromePath = await findChromePath();

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: chromePath,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();

      const requestCheck = options.endpoint
        ? page.waitForRequest(options.endpoint)
        : Promise.resolve();

      await page.goto(options.url);

      await Promise.all([requestCheck, page.waitForSelector(options.selector)]);
    } finally {
      await browser.close();
    }
  }
}
