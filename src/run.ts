import { setFailed, info } from "@actions/core";
import { wait } from "./utils/wait";
import { getArgs } from "./utils/getArgs";
import { createEngine } from "./browser/factory";

export async function run(): Promise<void> {
  const {
    waitMs,
    url,
    selector,
    endpoint,
    basicAuthUser,
    basicAuthPassword,
    engine,
    browser,
  } = getArgs();
  const useBasicAuth = Boolean(basicAuthUser || basicAuthPassword);

  await wait(waitMs);

  const engineInstance = createEngine(engine, browser);

  try {
    await engineInstance.runSmokeTest({
      url,
      selector,
      endpoint,
      basicAuthUser: useBasicAuth ? basicAuthUser : undefined,
      basicAuthPassword: useBasicAuth ? basicAuthPassword : undefined,
    });

    info("Smoke test succeeded");
  } catch {
    setFailed("Smoke test failed");
  }
}
