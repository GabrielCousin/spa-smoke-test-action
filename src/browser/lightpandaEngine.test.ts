import { describe, it, expect, beforeEach } from "@jest/globals";
import type { Browser } from "puppeteer-core";
import { LightpandaEngine } from "./lightpandaEngine";

const mockConnect = jest.fn();

jest.mock("puppeteer-core", () => ({
  __esModule: true,
  default: { connect: () => mockConnect() },
}));

describe("LightpandaEngine", () => {
  const engine = new LightpandaEngine();

  let goto: jest.Mock;
  let waitForSelector: jest.Mock;
  let waitForRequest: jest.Mock;

  beforeEach(() => {
    goto = jest.fn();
    waitForSelector = jest.fn();
    waitForRequest = jest.fn();

    const fakePage = {
      goto,
      waitForSelector,
      waitForRequest,
      close: jest.fn(),
    };
    const fakeContext = {
      newPage: jest.fn().mockResolvedValue(fakePage),
      close: jest.fn(),
    };
    const fakeBrowser = {
      createBrowserContext: jest.fn().mockResolvedValue(fakeContext),
      disconnect: jest.fn(),
    } as unknown as Browser;

    mockConnect.mockResolvedValue(fakeBrowser);
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
