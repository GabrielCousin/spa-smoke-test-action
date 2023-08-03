import core from "@actions/core";
import puppeteer from "puppeteer";

async function run(): Promise<void> {
  const browser = await puppeteer.launch();

  const url = core.getInput("target-url", { required: true });
  const selector = core.getInput("target-selector", { required: true });

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
