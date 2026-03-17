import { describe, it, expect } from "@jest/globals";
import { createEngine } from "./factory";
import { LightpandaEngine } from "./lightpandaEngine";
import { PuppeteerEngine } from "./puppeteerEngine";
import { PlaywrightEngine } from "./playwrightEngine";

describe("createEngine()", () => {
  it("returns LightpandaEngine by default", () => {
    const engine = createEngine("", "");
    expect(engine).toBeInstanceOf(LightpandaEngine);
  });

  it("returns PuppeteerEngine when engine is puppeteer", () => {
    const engine = createEngine("puppeteer", "");
    expect(engine).toBeInstanceOf(PuppeteerEngine);
  });

  it("returns PlaywrightEngine when engine is playwright", () => {
    const engine = createEngine("playwright", "firefox");
    expect(engine).toBeInstanceOf(PlaywrightEngine);
  });
});
