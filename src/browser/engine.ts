export type EngineName = "lightpanda" | "playwright" | "puppeteer";

export type BrowserName = "chromium" | "firefox" | "webkit";

export interface SmokeTestOptions {
  url: string;
  selector: string;
  endpoint?: string;
  basicAuthUser?: string;
  basicAuthPassword?: string;
}

export interface BrowserEngine {
  runSmokeTest(options: SmokeTestOptions): Promise<void>;
}
