import { describe, expect, it } from "@jest/globals";

export type SmokeTestInput = {
  url: string;
  selector: string;
  endpoint?: string;
};

export type EngineUnderTest = {
  runSmokeTest(input: SmokeTestInput): Promise<void>;
};

export type EngineContractMocks = {
  goto: jest.Mock;
  waitForSelector: jest.Mock;
  waitForRequest: jest.Mock;
};

export type EngineContractSetup = () => {
  engine: EngineUnderTest;
  mocks: EngineContractMocks;
};

export function runEngineContractTests(
  engineName: string,
  setup: EngineContractSetup,
) {
  describe(`${engineName} smoke-test contract`, () => {
    it("navigates to a specific url", async () => {
      const { engine, mocks } = setup();

      await engine.runSmokeTest({ url: "https://inter.net", selector: "div" });

      expect(mocks.goto).toHaveBeenCalledWith("https://inter.net");
    });

    it("waits for a selector to be in the document", async () => {
      const { engine, mocks } = setup();

      await engine.runSmokeTest({ url: "https://inter.net", selector: "div" });

      expect(mocks.waitForSelector).toHaveBeenCalledWith("div");
    });

    it("waits for a specific request with provided endpoint", async () => {
      const { engine, mocks } = setup();

      await engine.runSmokeTest({
        url: "https://inter.net",
        selector: "div",
        endpoint: "https://api.inter.net/whoiam",
      });

      expect(mocks.waitForRequest).toHaveBeenCalledWith(
        "https://api.inter.net/whoiam",
      );
    });

    it("does not wait for a specific request unless endpoint is provided", async () => {
      const { engine, mocks } = setup();

      await engine.runSmokeTest({ url: "https://inter.net", selector: "div" });

      expect(mocks.waitForRequest).not.toHaveBeenCalled();
    });

    it("throws if a specific request with provided endpoint is not fetched", async () => {
      const { engine, mocks } = setup();
      mocks.waitForRequest.mockRejectedValueOnce(
        new Error("Request not performed"),
      );

      await expect(
        engine.runSmokeTest({
          url: "https://inter.net",
          selector: "div",
          endpoint: "https://api.inter.net/whoiam",
        }),
      ).rejects.toThrow("Request not performed");
    });
  });
}
