import { getInput, setFailed } from "@actions/core";
import puppeteer from "puppeteer";
import { wait } from "./utils/wait";

async function run(): Promise<void> {
  const browser = await puppeteer.launch({
    headless: "new",
  });

  const waitMsInput = getInput("wait-on-start");
  const waitMs = waitMsInput ? parseInt(waitMsInput) : 0;

  const url = getInput("target-url", { required: true });
  const selector = getInput("target-selector", { required: true });

  await wait(waitMs);

  try {
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector(selector);
    console.log("Smoke test succeeded");
  } catch (error) {
    console.log(error);
    setFailed("Smoke test failed");
  }

  await browser.close();
}

run();
