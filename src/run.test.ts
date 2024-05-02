import { describe, it, expect } from "@jest/globals";
import { run } from "./run";

const mockGetArgs = jest.fn().mockReturnValue({});
const mockFindChromePath = jest.fn();

const mockAuthenticate = jest.fn();
const mockWaitForRequest = jest.fn();
const mockWaitForSelector = jest.fn();
const mockGoto = jest.fn();
const mockClose = jest.fn();

const mockNewPage = jest.fn().mockResolvedValue({
  authenticate: (options: unknown) => mockAuthenticate(options),
  waitForRequest: (url: string) => mockWaitForRequest(url),
  waitForSelector: (selector: string) => mockWaitForSelector(selector),
  goto: (url: string) => mockGoto(url),
});

const mockPuppeteerLaunch = jest.fn().mockResolvedValue({
  newPage: () => mockNewPage(),
  close: () => mockClose(),
});

const mockSetFailed = jest.fn();

jest.mock("puppeteer", () => ({
  __esModule: true,
  default: {
    launch: (options: unknown) => mockPuppeteerLaunch(options),
  },
}));

jest.mock("@actions/core", () => ({
  setFailed: (message: string) => mockSetFailed(message),
}));

jest.mock("./utils/getArgs", () => ({
  getArgs: () => mockGetArgs(),
}));

jest.mock("./utils/findChromePath", () => ({
  findChromePath: () => mockFindChromePath(),
}));

describe("run()", () => {
  it("launches a Puppeteer instance and opens a new page", async () => {
    const chromePath = "/path/to/chrome";
    mockFindChromePath.mockResolvedValueOnce(chromePath);

    await run();

    expect(mockPuppeteerLaunch).toHaveBeenCalledWith({
      headless: true,
      executablePath: chromePath,
    });
  });

  it("does not authenticate unless credentials are provided", async () => {
    await run();
    expect(mockAuthenticate).not.toHaveBeenCalled();
  });

  it("authenticates with provided credentials", async () => {
    mockGetArgs.mockReturnValueOnce({
      basicAuthUser: "user",
      basicAuthPassword: "password",
    });

    await run();

    expect(mockAuthenticate).toHaveBeenCalledWith({
      username: "user",
      password: "password",
    });
  });

  it("does not wait for a specific request unless endpoint is provided", async () => {
    await run();
    expect(mockWaitForRequest).not.toHaveBeenCalled();
  });

  it("waits for a specific request with provided endpoint", async () => {
    mockGetArgs.mockReturnValueOnce({
      endpoint: "https://api.inter.net",
    });

    await run();

    expect(mockWaitForRequest).toHaveBeenCalledWith("https://api.inter.net");
  });

  it("navigates to a specific url", async () => {
    mockGetArgs.mockReturnValueOnce({
      url: "https://inter.net",
    });

    await run();

    expect(mockGoto).toHaveBeenCalledWith("https://inter.net");
  });

  it("throws if a specific request with provided endpoint is not fetched", async () => {
    mockGetArgs.mockReturnValueOnce({
      endpoint: "https://api.inter.net",
    });
    mockWaitForRequest.mockRejectedValueOnce(undefined);

    await run();

    expect(mockSetFailed).toHaveBeenCalledWith("Smoke test failed");
  });

  it("waits for a selector to be in the document", async () => {
    mockGetArgs.mockReturnValueOnce({
      selector: "div",
    });

    await run();

    expect(mockWaitForSelector).toHaveBeenCalledWith("div");
  });

  it("throws if a selector is not found", async () => {
    mockWaitForSelector.mockRejectedValueOnce(undefined);

    await run();

    expect(mockSetFailed).toHaveBeenCalledWith("Smoke test failed");
  });
});
