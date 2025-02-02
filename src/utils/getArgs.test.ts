import { describe, afterEach, it, expect } from "@jest/globals";
import { getArgs } from "./getArgs";

function useInputs(inputs: Record<string, string>) {
  return Object.entries(inputs).forEach(([key, value]) => {
    process.env[`INPUT_${key.toUpperCase()}`] = value;
  });
}

function clearInputs(keys: string[]) {
  return keys.forEach(
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    (key) => delete process.env[`INPUT_${key.toUpperCase()}`],
  );
}

describe("getArgs()", () => {
  afterEach(() => {
    clearInputs(["target-url", "target-selector"]);
  });

  it("throws when target-url is missing", () => {
    useInputs({
      "target-selector": "div",
    });

    expect(() => getArgs()).toThrow(
      "Input required and not supplied: target-url",
    );
  });

  it("throws when target-selector is missing", () => {
    useInputs({
      "target-url": "https://inter.net",
    });

    expect(() => getArgs()).toThrow(
      "Input required and not supplied: target-selector",
    );
  });

  it("returns a default waitMs value", () => {
    useInputs({
      "target-url": "https://inter.net",
      "target-selector": "div",
    });

    expect(getArgs().waitMs).toBe(0);
  });

  it("returns a custom waitMs value", () => {
    useInputs({
      "target-url": "https://inter.net",
      "target-selector": "div",
      "wait-on-start": "100",
    });

    expect(getArgs().waitMs).toBe(100);
  });

  it("returns a selector", () => {
    useInputs({
      "target-url": "https://inter.net",
      "target-selector": "div",
    });

    expect(getArgs().selector).toBe("div");
  });

  it("returns some URL", () => {
    useInputs({
      "target-url": "https://inter.net",
      "target-selector": "div",
    });

    expect(getArgs().url).toBe("https://inter.net");
  });

  it("returns some endpoint URL", () => {
    useInputs({
      "target-url": "https://inter.net",
      "target-selector": "div",
      "request-url": "https://api.inter.net/whoiam",
    });

    expect(getArgs().endpoint).toBe("https://api.inter.net/whoiam");
  });

  it("returns some username", () => {
    useInputs({
      "target-url": "https://inter.net",
      "target-selector": "div",
      "http-auth-username": "user",
    });

    expect(getArgs().basicAuthUser).toBe("user");
  });

  it("returns some password", () => {
    useInputs({
      "target-url": "https://inter.net",
      "target-selector": "div",
      "http-auth-password": "password",
    });

    expect(getArgs().basicAuthPassword).toBe("password");
  });
});
