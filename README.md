<p align="center">
  <h1 align="center">cypress-web-vitals</h1>
</p>
<p align="center">
A <a href="https://github.com/GoogleChrome/web-vitals">web-vitals</a> command for <a href="https://github.com/cypress-io/cypress">cypress</a>.
</p>
<p align="center">
   <a href="https://github.com/cmorten/cypress-web-vitals/tags/"><img src="https://img.shields.io/github/tag/cmorten/cypress-web-vitals" alt="Current version" /></a>
   <img src="https://github.com/cmorten/cypress-web-vitals/workflows/Test/badge.svg" alt="Current test status" />
   <a href="http://makeapullrequest.com"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs are welcome" /></a>
   <a href="https://github.com/cmorten/cypress-web-vitals/issues/"><img src="https://img.shields.io/github/issues/cmorten/cypress-web-vitals" alt="cypress-web-vitals issues" /></a>
   <img src="https://img.shields.io/github/stars/cmorten/cypress-web-vitals" alt="cypress-web-vitals stars" />
   <img src="https://img.shields.io/github/forks/cmorten/cypress-web-vitals" alt="cypress-web-vitals forks" />
   <img src="https://img.shields.io/github/license/cmorten/cypress-web-vitals" alt="cypress-web-vitals license" />
   <a href="https://GitHub.com/cmorten/cypress-web-vitals/graphs/commit-activity"><img src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" alt="cypress-web-vitals is maintained" /></a>
</p>
<p align="center">
  <i>Quantifying the quality of user experience on your site.</i>
</p>

---

## About

[Web Vitals](https://web.dev/vitals/) is a Google initiative which provides a set of quality signals and thresholds that are essential to delivering a great user experience on the web.

`cypress-web-vitals` allows you to test against these signals within your Cypress workflows through a new `cy.vitals()` [custom command](https://docs.cypress.io/api/cypress-api/custom-commands).

## Getting Started

### Install the dependencies

In your terminal:

```console
$ yarn add -D cypress-web-vitals cypress-real-events
# or
$ npm install --save-dev cypress-web-vitals cypress-real-events
```

_Note: `cypress-web-vitals` currently makes use of `cypress-real-events` to click the page to calculate [first input delay](https://web.dev/fid/). Hence it is needed as a peer-dependency._

### Add the commands

Add the following line to your `cypress/support/commands.js`:

```js
import "cypress-web-vitals/commands";
```

### Write your tests

```js
describe("web-vitals", () => {
  it("should pass the audits", () => {
    cy.vitals({ url: "https://www.google.com/" });
  });
});
```

## Examples

An example Cypress test setup with a variety of tests using `cypress-web-vitals` is available in the [`./examples` directory](./examples).

## API

### `cy.vitals([WebVitalsConfig])`

Performs and audit against the Google web-vitals.

```js
cy.vitals();
cy.vitals(webVitalsConfig);
```

Example:

```js
cy.vitals({ firstInputSelector: "main" }); // Use the `main` element of the page for clicking to capture the FID.
cy.vitals({ thresholds: { cls: 0.2 } }); // Test the page against against a CLS threshold of 0.2.
```

`WebVitalsConfig`:

- `Optional` **url**: `string` - The url to audit. If not provided you will need to have called `cy.visit(url)` prior to the command.
- `Optional` **firstInputSelector**: `string` - The element to click for capturing FID. Default: `"body"`.
- `Optional` **thresholds**: `WebVitalsThresholds` - The thresholds to audit the web-vitals against. If not provided Google's 'Good' scores will be used (see below). If provided, any missing web-vitals signals will not be audited.

`WebVitalsThresholds`:

- `Optional` **lcp**: `number` - Threshold for [largest contentful paint (LCP)](https://web.dev/lcp/).
- `Optional` **fid**: `number` - Threshold for [first input delay (FID)](https://web.dev/fid/).
- `Optional` **cls**: `number` - Threshold for [cumulative layout shift (CLS)](https://web.dev/cls/).
- `Optional` **fcp**: `number` - Threshold for [first contentful paint (FCP)](https://web.dev/fcp/).
- `Optional` **ttfb**: `number` - Threshold for [time to first byte (TTFB)](https://web.dev/time-to-first-byte/).

#### Google 'Good' scores

```json
{
  "lcp": 2500,
  "fid": 100,
  "cls": 0.1,
  "fcp": 1800,
  "ttfb": 600
}
```

## Contributing

Please check out the [CONTRIBUTING](./docs/CONTRIBUTING.md) docs.

## Changelog

Please check out the [CHANGELOG](./docs/CHANGELOG.md) docs.

---

## License

`cypress-web-vitals` is licensed under the [MIT License](./LICENSE.md).
