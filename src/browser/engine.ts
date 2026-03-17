export interface SmokeTestOptions {
  url: string;
  selector: string;
  endpoint?: string;
}

export interface BrowserEngine {
  runSmokeTest(options: SmokeTestOptions): Promise<void>;
}
