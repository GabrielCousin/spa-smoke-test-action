export type EngineName =
  | "lightpanda"
  | "puppeteer"
  | "playwright-chrome"
  | "playwright-firefox";

export type BrowserName = "chromium" | "firefox";

export interface SmokeTestOptions {
  url: string;
  selector: string;
  endpoint?: string;
}

export interface BrowserEngine {
  runSmokeTest(options: SmokeTestOptions): Promise<void>;
}
