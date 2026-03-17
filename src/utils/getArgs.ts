import * as core from "@actions/core";

export function getArgs() {
  const { getInput } = core;

  const waitMsInput = getInput("wait-on-start");

  return {
    waitMs: waitMsInput ? parseInt(waitMsInput) : 0,
    url: getInput("target-url", { required: true }),
    selector: getInput("target-selector", { required: true }),
    endpoint: getInput("request-url"),
  };
}
