import core from "@actions/core";
import puppeteer from "puppeteer";
import { wait } from "./utils/wait";

async function run(): Promise<void> {
  const browser = await puppeteer.launch();

  const waitMsInput = core.getInput("wait-on-start");
  const waitMs = waitMsInput ? parseInt(waitMsInput) : 0;

  const url = core.getInput("target-url", { required: true });
  const selector = core.getInput("target-selector", { required: true });

  await wait(waitMs);

  try {
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector(selector);
    console.log("Smoke test succeeded");
  } catch (error) {
    console.log(error);
    core.setFailed("Smoke test failed");
  }

  await browser.close();
}

run();
