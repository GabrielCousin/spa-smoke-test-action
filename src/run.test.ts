import { describe, it, expect } from "@jest/globals";
import { run } from "./run";

const mockGetArgs = jest.fn().mockReturnValue({
  waitMs: 0,
  url: "https://inter.net",
  selector: "div",
  endpoint: undefined,
  basicAuthUser: undefined,
  basicAuthPassword: undefined,
  engine: "puppeteer",
  browser: "chromium",
});

const mockRunSmokeTest = jest.fn();

const mockSetFailed = jest.fn();

jest.mock("@actions/core", () => ({
  setFailed: (message: string) => mockSetFailed(message),
  info: jest.fn(),
}));

jest.mock("./utils/getArgs", () => ({
  getArgs: () => mockGetArgs(),
}));

jest.mock("./browser/factory", () => ({
  createEngine: () => ({
    runSmokeTest: (options: unknown) => mockRunSmokeTest(options),
  }),
}));

describe("run()", () => {
  it("passes the correct options to the engine", async () => {
    await run();

    expect(mockRunSmokeTest).toHaveBeenCalledWith({
      url: "https://inter.net",
      selector: "div",
      endpoint: undefined,
      basicAuthUser: undefined,
      basicAuthPassword: undefined,
    });
  });

  it("marks the run as failed when the engine throws", async () => {
    mockRunSmokeTest.mockRejectedValueOnce(new Error("boom"));

    await run();

    expect(mockSetFailed).toHaveBeenCalledWith("Smoke test failed");
  });
});
