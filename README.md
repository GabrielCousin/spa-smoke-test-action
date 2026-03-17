# SPA smoke-test action

After deploying a single-page app, you want to know it actually rendered — not just that the server
returned a 200. SPAs can fail silently: the CDN serves the HTML shell, but the JavaScript fails to
hydrate, an API call never fires, or a key element never appears.

This action opens a real headless browser (Puppeteer + system Chrome), navigates to your URL, and
asserts that a CSS selector appears on the page. That's the whole test — and for most deployment
pipelines it's enough.

Works on `ubuntu-latest` with no extra setup.

## Inputs

| Input | Required | Description |
|---|---|---|
| `target-url` | ✅ | URL to navigate to |
| `target-selector` | ✅ | CSS selector that must appear after load |
| `request-url` | | HTTP request URL the page must fire (not validated, just spied) |
| `wait-on-start` | | Delay in ms before starting (useful for async initial loads) |

## Usage

```yaml
on:
  deployment_status:

jobs:
  spa_smoke_test:
    runs-on: ubuntu-latest
    if: github.event.deployment_status.state == 'success'
    steps:
      - name: Smoke test after deploy
        uses: GabrielCousin/spa-smoke-test-action@v1
        with:
          target-url: "https://your-url.tld"
          target-selector: "#elementToWaitFor"

          # Optional: assert a specific API call was made
          request-url: "https://your-endpoint.tld"

          # Optional: wait before starting (ms)
          wait-on-start: 1000
```

## Manual testing

A `Manual SPA smoke test` workflow is included for on-demand runs directly from the GitHub UI or CLI.

**With [`gh act`](https://github.com/nektos/gh-act) (local runner via GitHub CLI):**
```bash
gh act workflow_dispatch -W .github/workflows/manual-smoke-test.yml \
  --input target-url=https://example.com \
  --input target-selector=h1
```

**With plain [`act`](https://github.com/nektos/act):**
```bash
act workflow_dispatch -W .github/workflows/manual-smoke-test.yml \
  --input target-url=https://example.com \
  --input target-selector=h1
```
