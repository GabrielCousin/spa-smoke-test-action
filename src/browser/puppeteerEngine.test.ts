import { describe, it, expect, beforeEach } from "@jest/globals";
import type { Browser } from "puppeteer";
import { PuppeteerEngine } from "./puppeteerEngine";

const mockLaunch = jest.fn();

jest.mock("puppeteer", () => ({
  __esModule: true,
  default: { launch: () => mockLaunch() },
}));

jest.mock("../utils/findChromePath", () => ({
  findChromePath: jest.fn().mockResolvedValue("/path/to/chrome"),
}));

describe("PuppeteerEngine", () => {
  const engine = new PuppeteerEngine();

  let goto: jest.Mock;
  let waitForSelector: jest.Mock;
  let waitForRequest: jest.Mock;

  beforeEach(() => {
    goto = jest.fn();
    waitForSelector = jest.fn();
    waitForRequest = jest.fn();

    const fakePage = { goto, waitForSelector, waitForRequest };
    const fakeBrowser = {
      newPage: jest.fn().mockResolvedValue(fakePage),
      close: jest.fn(),
    } as unknown as Browser;

    mockLaunch.mockResolvedValue(fakeBrowser);
  });

  it("navigates to a specific url", async () => {
    await engine.runSmokeTest({ url: "https://inter.net", selector: "div" });

    expect(goto).toHaveBeenCalledWith("https://inter.net");
  });

  it("waits for a selector to be in the document", async () => {
    await engine.runSmokeTest({ url: "https://inter.net", selector: "div" });

    expect(waitForSelector).toHaveBeenCalledWith("div");
  });

  it("waits for a specific request with provided endpoint", async () => {
    await engine.runSmokeTest({
      url: "https://inter.net",
      selector: "div",
      endpoint: "https://api.inter.net/whoiam",
    });

    expect(waitForRequest).toHaveBeenCalledWith("https://api.inter.net/whoiam");
  });

  it("does not wait for a specific request unless endpoint is provided", async () => {
    await engine.runSmokeTest({ url: "https://inter.net", selector: "div" });

    expect(waitForRequest).not.toHaveBeenCalled();
  });

  it("throws if a specific request with provided endpoint is not fetched", async () => {
    waitForRequest.mockRejectedValueOnce(new Error("Request not performed"));

    await expect(
      engine.runSmokeTest({
        url: "https://inter.net",
        selector: "div",
        endpoint: "https://api.inter.net/whoiam",
      }),
    ).rejects.toThrow("Request not performed");
  });
});
