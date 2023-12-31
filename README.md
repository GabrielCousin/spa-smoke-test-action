# SPA smoke-test 🚭 action

GitHub action that runs very basic smoke tests for your single-page apps with Puppeteer.

## Usage

```
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
```
