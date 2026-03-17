import * as core from "@actions/core";
import { wait } from "./utils/wait";
import { getArgs } from "./utils/getArgs";
import { createEngine } from "./browser/factory";

export async function run(): Promise<void> {
  const { setFailed, info, error: logError } = core;
  const { waitMs, url, selector, endpoint } = getArgs();

  info(`Smoke-testing ${url} for selector "${selector}"`);

  await wait(waitMs);

  const engineInstance = createEngine();

  try {
    await engineInstance.runSmokeTest({
      url,
      selector,
      endpoint,
    });

    info("Smoke test succeeded");
  } catch (err) {
    logError(err instanceof Error ? err : String(err));
    setFailed("Smoke test failed");
  }
}
