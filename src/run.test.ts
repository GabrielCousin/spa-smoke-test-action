import { describe, it, expect, jest } from "@jest/globals";
import type { BrowserEngine, SmokeTestOptions } from "./browser/engine";

const mockRunSmokeTest = jest.fn<BrowserEngine["runSmokeTest"]>();

jest.unstable_mockModule("@actions/core", () => ({
  setFailed: jest.fn(),
  info: jest.fn(),
}));

jest.unstable_mockModule("./utils/getArgs", () => ({
  getArgs: jest.fn(),
}));

jest.unstable_mockModule("./browser/factory", () => ({
  createEngine: () => ({
    runSmokeTest: (options: SmokeTestOptions) => mockRunSmokeTest(options),
  }),
}));

const actionsCore = await import("@actions/core");
const getArgsModule = await import("./utils/getArgs");
const { run } = await import("./run");

const mockSetFailed = jest.mocked(actionsCore.setFailed);
const mockGetArgs = jest.mocked(getArgsModule.getArgs);

mockGetArgs.mockReturnValue({
  waitMs: 0,
  url: "https://inter.net",
  selector: "div",
  endpoint: "",
  engine: "puppeteer",
});

describe("run()", () => {
  it("passes the correct options to the engine", async () => {
    await run();

    expect(mockRunSmokeTest).toHaveBeenCalledWith({
      url: "https://inter.net",
      selector: "div",
      endpoint: "",
    });
  });

  it("marks the run as failed when the engine throws", async () => {
    mockRunSmokeTest.mockRejectedValueOnce(new Error("boom"));

    await run();

    expect(mockSetFailed).toHaveBeenCalledWith("Smoke test failed");
  });
});
