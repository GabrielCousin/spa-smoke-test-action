# SPA smoke-test 🚭 action

GitHub action that runs very basic smoke tests for your single-page apps with Puppeteer.

## Usage

```
- name: Smoke test after deploy
  id: spa-smoke-test
  uses: gabrielcousin/spa-smoke-test-action@0.1.0
  with:
    # The URL of the single-page app
    target-url: 'https://your-url.tld'

    # The CSS selector for the element to find
    target-selector: '#elementToWaitFor'
```
