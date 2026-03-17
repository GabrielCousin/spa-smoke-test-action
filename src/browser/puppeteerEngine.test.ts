import { describe, it, expect, jest } from "@jest/globals";
import type { Browser, Page } from "puppeteer";

jest.unstable_mockModule("puppeteer", () => ({
  default: { launch: jest.fn() },
}));

jest.unstable_mockModule("../utils/findChromePath", () => ({
  findChromePath: jest.fn(),
}));

const { default: puppeteer } = await import("puppeteer");
const findChromePathModule = await import("../utils/findChromePath");
const { PuppeteerEngine } = await import("./puppeteerEngine");
const { runEngineContractTests } = await import("./engineContractTests");

const mockLaunch = jest.mocked(puppeteer.launch);
const mockFindChromePath = jest.mocked(findChromePathModule.findChromePath);

mockFindChromePath.mockResolvedValue("/path/to/chrome");

describe("PuppeteerEngine", () => {
  const setup = () => {
    const goto = jest.fn<Page["goto"]>();
    const waitForSelector = jest.fn<Page["waitForSelector"]>();
    const waitForRequest = jest.fn<Page["waitForRequest"]>();

    const fakePage = {
      goto,
      waitForSelector,
      waitForRequest,
    } as unknown as Page;
    const fakeBrowser = {
      newPage: jest.fn<Browser["newPage"]>().mockResolvedValue(fakePage),
      close: jest.fn(),
    } as unknown as Browser;

    mockLaunch.mockResolvedValue(fakeBrowser);

    return {
      engine: new PuppeteerEngine(),
      mocks: { goto, waitForSelector, waitForRequest },
    };
  };

  runEngineContractTests("PuppeteerEngine", setup);

  it("launches Chrome with --no-sandbox", async () => {
    const { engine } = setup();
    await engine.runSmokeTest({ url: "https://inter.net", selector: "div" });

    expect(mockLaunch).toHaveBeenCalledWith(
      expect.objectContaining({
        args: expect.arrayContaining(["--no-sandbox"]),
      }),
    );
  });
});
