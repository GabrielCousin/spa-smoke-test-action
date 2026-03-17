import * as exec from "@actions/exec";
import * as core from "@actions/core";

export async function findChromePath() {
  const { getExecOutput } = exec;
  const { setFailed } = core;

  const output = await getExecOutput("which", ["google-chrome"]);

  if (output.exitCode === 0) {
    return output.stdout.trim();
  }

  setFailed("Chrome path not found");
}
