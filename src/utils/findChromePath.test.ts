import { describe, it, expect } from "@jest/globals";
import { findChromePath } from "./findChromePath";

const mockGetExecOutput = jest.fn();
const mockSetFailed = jest.fn();

jest.mock("@actions/exec", () => ({
  getExecOutput: () => mockGetExecOutput(),
}));

jest.mock("@actions/core", () => ({
  setFailed: (message: string) => mockSetFailed(message),
}));

describe("findChromePath()", () => {
  it("returns a trimmed path to the installed Chrome", async () => {
    mockGetExecOutput.mockReturnValueOnce({
      exitCode: 0,
      stdout: "/foo/bar/baz/google-chrome ",
    });

    await expect(findChromePath()).resolves.toBe("/foo/bar/baz/google-chrome");
    expect(mockSetFailed).not.toHaveBeenCalled();
  });

  it("throws when Chrome is not found", async () => {
    mockGetExecOutput.mockReturnValueOnce({
      exitCode: 1,
    });

    const result = await findChromePath();
    expect(result).toBeUndefined();
    expect(mockSetFailed).toHaveBeenCalledWith("Chrome path not found");
  });
});
