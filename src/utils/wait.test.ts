import { describe, beforeEach, it, expect } from "@jest/globals";
import { wait } from "./wait";

describe("wait()", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global, "setTimeout");
  });

  it("returns a pending promise", () => {
    const waitTime = 100;
    const stub = jest.fn();

    wait(waitTime).then(stub);

    expect(stub).not.toHaveBeenCalled();
  });

  it("sets a given timeout", () => {
    const waitTime = 300;

    wait(waitTime);

    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), waitTime);
  });

  it("resolves after a given duration", async () => {
    expect.assertions(3);

    const waitTime = 100;
    const stub = jest.fn();

    const promise = wait(waitTime);
    promise.then(stub);

    expect(stub).not.toHaveBeenCalled();

    jest.advanceTimersByTime(waitTime);
    await expect(promise).resolves.toBe(undefined);
    expect(stub).toHaveBeenCalled();
  });
});
