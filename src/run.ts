import { setFailed, info } from "@actions/core";
import puppeteer from "puppeteer";
import { wait } from "./utils/wait";
import { getArgs } from "./utils/getArgs";
import { findChromePath } from "./utils/findChromePath";

export async function run(): Promise<void> {
  const { waitMs, url, selector, endpoint, basicAuthUser, basicAuthPassword } =
    getArgs();
  const useBasicAuth = Boolean(basicAuthUser || basicAuthPassword);

  await wait(waitMs);

  const chromePath = await findChromePath();

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: chromePath,
  });

  try {
    const page = await browser.newPage();

    if (useBasicAuth) {
      await page.authenticate({
        username: basicAuthUser,
        password: basicAuthPassword,
      });
    }

    const requestCheck = endpoint
      ? page.waitForRequest(endpoint)
      : Promise.resolve();

    await page.goto(url);

    await Promise.all([requestCheck, page.waitForSelector(selector)]);

    info("Smoke test succeeded");
  } catch {
    setFailed("Smoke test failed");
  }

  await browser.close();
}
