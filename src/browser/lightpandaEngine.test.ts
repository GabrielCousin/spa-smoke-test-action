import { describe, jest } from "@jest/globals";
import type { Browser, BrowserContext, Page } from "puppeteer-core";

jest.unstable_mockModule("puppeteer-core", () => ({
  default: { connect: jest.fn() },
}));

const { default: puppeteer } = await import("puppeteer-core");
const { LightpandaEngine } = await import("./lightpandaEngine");
const { runEngineContractTests } = await import("./engineContractTests");

const mockConnect = jest.mocked(puppeteer.connect);

describe("LightpandaEngine", () => {
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
      createBrowserContext: jest
        .fn<Browser["createBrowserContext"]>()
        .mockResolvedValue(fakeContext),
      disconnect: jest.fn(),
    } as unknown as Browser;

    mockConnect.mockResolvedValue(fakeBrowser);

    return {
      engine: new LightpandaEngine(),
      mocks: { goto, waitForSelector, waitForRequest },
    };
  };

  runEngineContractTests("LightpandaEngine", setup);
});
