import { describe, it, expect, jest } from "@jest/globals";

jest.unstable_mockModule("@actions/exec", () => ({
  getExecOutput: jest.fn(),
}));

jest.unstable_mockModule("@actions/core", () => ({
  setFailed: jest.fn(),
}));

const execModule = await import("@actions/exec");
const coreModule = await import("@actions/core");
const { findChromePath } = await import("./findChromePath");

const mockGetExecOutput = jest.mocked(execModule.getExecOutput);
const mockSetFailed = jest.mocked(coreModule.setFailed);

describe("findChromePath()", () => {
  it("returns a trimmed path to the installed Chrome", async () => {
    mockGetExecOutput.mockResolvedValueOnce({
      exitCode: 0,
      stdout: "/foo/bar/baz/google-chrome ",
      stderr: "",
    });

    await expect(findChromePath()).resolves.toBe("/foo/bar/baz/google-chrome");
    expect(mockSetFailed).not.toHaveBeenCalled();
  });

  it("throws when Chrome is not found", async () => {
    mockGetExecOutput.mockResolvedValueOnce({
      exitCode: 1,
      stdout: "",
      stderr: "",
    });

    const result = await findChromePath();
    expect(result).toBeUndefined();
    expect(mockSetFailed).toHaveBeenCalledWith("Chrome path not found");
  });
});
