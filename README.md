# SPA smoke-test 🚭 action

GitHub action that runs very basic smoke tests for your single-page apps using the Lightpanda headless browser by default (with a Puppeteer-compatible API).

## Usage

````
on:
  deployment_status:

jobs:
  spa_smoke_test:
    runs-on: ubuntu-latest
    if: github.event.deployment_status.state == 'success'
    steps:
    - name: Smoke test after deploy
      id: spa-smoke-test
      uses: GabrielCousin/spa-smoke-test-action@0.3.0
      with:
        # The URL of the single-page app
        target-url: "https://your-url.tld"

        # The CSS selector for the element to find
        target-selector: "#elementToWaitFor"

        # Some request URL to spy - will not check against any response
        request-url: "https://your-endpoint.tld"

        # Enable HTTP Basic Authentication
        http-auth-username: "USERNAME"
        http-auth-password: "PASSWORD"

        # Optional wait period before starting the test
        wait-on-start: 1000

        # Optional engine selection (lightpanda, puppeteer, playwright)
        engine: "lightpanda"

        # Optional browser selection for Playwright engine (chromium, firefox, webkit)
        browser: "chromium"

## Manual testing via workflow dispatch

You can also trigger the smoke test manually from the GitHub UI using the included `Manual SPA smoke test` workflow:

```yaml
on:
  workflow_dispatch:
    inputs:
      target-url:
        description: "URL to smoke-test"
        required: true
        type: string
      target-selector:
        description: "Selector to query"
        required: true
        type: string
      # ...other optional inputs...
````

This workflow forwards the provided inputs to `GabrielCousin/spa-smoke-test-action@v0.3.0`, allowing you to choose the `engine` (`lightpanda`, `playwright`, or `puppeteer`) and, when using Playwright, the `browser` (`chromium`, `firefox`, or `webkit`).

```

```
