import { setFailed, info } from "@actions/core";
import { wait } from "./utils/wait";
import { getArgs } from "./utils/getArgs";
import { createEngine } from "./browser/factory";

export async function run(): Promise<void> {
  const { waitMs, url, selector, endpoint, engine } = getArgs();

  await wait(waitMs);

  const engineInstance = createEngine(engine);

  try {
    await engineInstance.runSmokeTest({
      url,
      selector,
      endpoint,
    });

    info("Smoke test succeeded");
  } catch {
    setFailed("Smoke test failed");
  }
}
