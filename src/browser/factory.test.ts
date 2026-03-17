import { describe, it, expect } from "@jest/globals";
import { createEngine } from "./factory";
import { PuppeteerEngine } from "./puppeteerEngine";

describe("createEngine()", () => {
  it("returns a PuppeteerEngine", () => {
    const engine = createEngine();
    expect(engine).toBeInstanceOf(PuppeteerEngine);
  });
});
