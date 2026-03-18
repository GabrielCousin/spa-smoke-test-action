import { describe, it, expect, beforeEach } from "@jest/globals";
import type { Browser } from "playwright";
import { PlaywrightEngine } from "./playwrightEngine";

const mockChromiumLaunch = jest.fn();
const mockFirefoxLaunch = jest.fn();

jest.mock("playwright", () => ({
  chromium: { launch: () => mockChromiumLaunch() },
  firefox: { launch: () => mockFirefoxLaunch() },
}));

describe("PlaywrightEngine", () => {
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
      newContext: jest.fn().mockResolvedValue(fakeContext),
      close: jest.fn(),
    } as unknown as Browser;

    mockChromiumLaunch.mockResolvedValue(fakeBrowser);
    mockFirefoxLaunch.mockResolvedValue(fakeBrowser);
  });

  it("navigates to a specific url", async () => {
    const engine = new PlaywrightEngine("chromium");
    await engine.runSmokeTest({ url: "https://inter.net", selector: "div" });

    expect(goto).toHaveBeenCalledWith("https://inter.net");
  });

  it("waits for a selector to be in the document", async () => {
    const engine = new PlaywrightEngine("chromium");
    await engine.runSmokeTest({ url: "https://inter.net", selector: "div" });

    expect(waitForSelector).toHaveBeenCalledWith("div");
  });

  it("waits for a specific request with provided endpoint", async () => {
    const engine = new PlaywrightEngine("chromium");
    await engine.runSmokeTest({
      url: "https://inter.net",
      selector: "div",
      endpoint: "https://api.inter.net/whoiam",
    });

    expect(waitForRequest).toHaveBeenCalledWith("https://api.inter.net/whoiam");
  });

  it("does not wait for a specific request unless endpoint is provided", async () => {
    const engine = new PlaywrightEngine("chromium");
    await engine.runSmokeTest({ url: "https://inter.net", selector: "div" });

    expect(waitForRequest).not.toHaveBeenCalled();
  });

  it("throws if a specific request with provided endpoint is not fetched", async () => {
    const engine = new PlaywrightEngine("chromium");
    waitForRequest.mockRejectedValueOnce(new Error("Request not performed"));

    await expect(
      engine.runSmokeTest({
        url: "https://inter.net",
        selector: "div",
        endpoint: "https://api.inter.net/whoiam",
      }),
    ).rejects.toThrow("Request not performed");
  });

  it("uses the firefox browser when browserName is firefox", async () => {
    const engine = new PlaywrightEngine("firefox");
    await engine.runSmokeTest({ url: "https://inter.net", selector: "div" });

    expect(mockFirefoxLaunch).toHaveBeenCalledTimes(1);
    expect(mockChromiumLaunch).not.toHaveBeenCalled();
  });
});
