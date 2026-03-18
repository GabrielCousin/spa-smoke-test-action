import { describe, it, expect, jest } from "@jest/globals";
import type { Browser, BrowserContext, Page } from "playwright";

jest.unstable_mockModule("playwright", () => ({
  chromium: { launch: jest.fn() },
  firefox: { launch: jest.fn() },
}));

const playwrightModule = await import("playwright");
const { PlaywrightEngine } = await import("./playwrightEngine");
const { runEngineContractTests } = await import("./engineContractTests");

const mockChromiumLaunch = jest.mocked(playwrightModule.chromium.launch);
const mockFirefoxLaunch = jest.mocked(playwrightModule.firefox.launch);

describe("PlaywrightEngine", () => {
  const setup = () => {
    const goto = jest.fn<Page["goto"]>();
    const waitForSelector = jest.fn<Page["waitForSelector"]>();
    const waitForRequest = jest.fn<Page["waitForRequest"]>();

    const fakePage = {
      goto,
      waitForSelector,
      waitForRequest,
      close: jest.fn(),
    } as unknown as Page;
    const fakeContext = {
      newPage: jest.fn<BrowserContext["newPage"]>().mockResolvedValue(fakePage),
      close: jest.fn(),
    } as unknown as BrowserContext;
    const fakeBrowser = {
      newContext: jest
        .fn<Browser["newContext"]>()
        .mockResolvedValue(fakeContext),
      close: jest.fn(),
    } as unknown as Browser;

    mockChromiumLaunch.mockResolvedValue(fakeBrowser);
    mockFirefoxLaunch.mockResolvedValue(fakeBrowser);

    return {
      engine: new PlaywrightEngine("chromium"),
      mocks: { goto, waitForSelector, waitForRequest },
    };
  };

  runEngineContractTests("PlaywrightEngine(chromium)", setup);

  it("uses the firefox browser when browserName is firefox", async () => {
    const engine = new PlaywrightEngine("firefox");
    await engine.runSmokeTest({ url: "https://inter.net", selector: "div" });

    expect(mockFirefoxLaunch).toHaveBeenCalledTimes(1);
    expect(mockChromiumLaunch).not.toHaveBeenCalled();
  });
});
