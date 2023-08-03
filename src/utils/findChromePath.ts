import { getExecOutput } from "@actions/exec";
import { setFailed } from "@actions/core";

export async function findChromePath() {
  const output = await getExecOutput("which", ["google-chrome"]);

  if (output.exitCode === 0) {
    return output.stdout.trim();
  }

  setFailed("Chrome path not found");
}
