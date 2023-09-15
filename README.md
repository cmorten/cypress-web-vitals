<p align="center">
  <h1 align="center">cypress-web-vitals</h1>
</p>
<p align="center">
A <a href="https://github.com/GoogleChrome/web-vitals">Web Vitals</a> command for <a href="https://github.com/cypress-io/cypress">Cypress</a>.
</p>
<p align="center">
   <a href="https://github.com/cmorten/cypress-web-vitals/tags/"><img src="https://img.shields.io/github/tag/cmorten/cypress-web-vitals" alt="cypress-web-vitals versions" /></a>
   <a href="https://www.npmjs.com/package/cypress-web-vitals"><img alt="cypress-web-vitals available on NPM" src="https://img.shields.io/npm/dy/cypress-web-vitals"></a>
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

`cypress-web-vitals` allows you to test against these signals within your Cypress workflows through a set of [custom commands](https://docs.cypress.io/api/cypress-api/custom-commands):

- `cy.vitals()` - self contained command for performing a Web Vitals audit of page load performance.
- `cy.startVitalsCapture()` - command for starting a journey based Web Vitals audit, enabling capture of [interaction to next paint (INP)](https://web.dev/inp/).
- `cy.reportVitals()` - command for reporting on a journey based Web Vitals audit started with `cy.startVitalsCapture()`.

## Getting started

### Install the dependencies

In your terminal:

```console
$ yarn add -D cypress-web-vitals cypress-real-events
# or
$ npm install --save-dev cypress-web-vitals cypress-real-events
```

_Note: `cypress-web-vitals` currently makes use of `cypress-real-events` to click the page as a real user would to calculate [first input delay](https://web.dev/fid/). Hence it is needed as a peer-dependency._

### Add the commands

Add the following line to your `cypress/support/commands.js`:

```js
import "cypress-web-vitals";
```

### Write your tests

```js
describe("Web Vitals", () => {
  it("should pass the audits for a page load", () => {
    cy.vitals({ url: "https://www.google.com/" });
  });

  it("should pass the audits for a customer journey", () => {
    cy.startVitalsCapture({
      url: "https://www.google.com/",
    });

    cy.findByRole("combobox", { name: "Search" }).realClick();
    cy.findByRole("listbox").should("be.visible");

    cy.reportVitals();
  });
});
```

_Note: this example is making use of the [Cypress Testing Library](https://testing-library.com/docs/cypress-testing-library/intro) for interacting with the page. This is not required for use of this package nor is it included in the package._

## Examples

Example Cypress test setups with a variety of tests using `cypress-web-vitals` for Cypress 9.x, 10.x, 12.x and 13.x are available in the [`./examples` directory](./examples).

## API

### `cy.vitals([WebVitalsConfig])`

Performs and audit against the Google Web Vitals.

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

- `Optional` **firstInputSelector**: `string | string[]` - Selector(s) for the element(s) to click for capturing FID. Can be a single element selector or an array, all of which will be clicked. For each selector the first matching element is used. Default: `"body"`.
- `Optional` **onReport**: `Function` - Callback for custom handling of the report results, e.g. for sending results to application monitoring platforms.
- `Optional` **strict**: `boolean` - Enables strict mode in which tests will fail if metrics with specified thresholds cannot be calculated.
- `Optional` **thresholds**: `WebVitalsThresholds` - The thresholds to audit the Web Vitals against. If not provided Google's 'Good' scores will be used (see below). If provided, any missing Web Vitals signals will not be audited.
- `Optional` **url**: `string` - The url to audit. If not provided you will need to have called `cy.visit(url)` prior to the command.
- `Optional` **headers**: `string` - Additional headers that will be provided to `cy.visit()` if `url` is provided.
- `Optional` **auth**: `string` - Additional auth that will be provided to `cy.visit()` if `url` is provided.
- `Optional` **vitalsReportedTimeout**: `number` - Time in ms to wait for Web Vitals to be reported before failing. Default: `10000`.

### `cy.startVitalsCapture([StartWebVitalsCaptureConfig])`

Starts an audit against the Google Web Vitals.

```js
cy.startVitalsCapture();
cy.startVitalsCapture(startWebVitalsCaptureConfig);
```

Example:

```js
cy.startVitalsCapture({
  url: "https://www.google.com/",
});
```

`StartWebVitalsCaptureConfig`:

- `Optional` **url**: `string` - The url to audit. If not provided you will need to have called `cy.visit(url)` prior to the command.
- `Optional` **headers**: `string` - Additional headers that will be provided to `cy.visit()` if `url` is provided.
- `Optional` **auth**: `string` - Additional auth that will be provided to `cy.visit()` if `url` is provided.

### `cy.reportVitals([ReportWebVitalsConfig])`

Completes and reports on an audit against the Google Web Vitals.

```js
cy.reportVitals();
cy.reportVitals(reportWebVitalsConfig);
```

```js
cy.reportVitals({ thresholds: { inp: 500 } }); // Test the page against against an INP threshold of 500.
```

`ReportWebVitalsConfig`:

- `Optional` **onReport**: `Function` - Callback for custom handling of the report results, e.g. for sending results to application monitoring platforms.
- `Optional` **strict**: `boolean` - Enables strict mode in which tests will fail if metrics with specified thresholds cannot be calculated.
- `Optional` **thresholds**: `WebVitalsThresholds` - The thresholds to audit the Web Vitals against. If not provided Google's 'Good' scores will be used (see below). If provided, any missing Web Vitals signals will not be audited.
- `Optional` **vitalsReportedTimeout**: `number` - Time in ms to wait for Web Vitals to be reported before failing. Default: `10000`.

### `WebVitalsThresholds`

- `Optional` **lcp**: `number` - Threshold for [largest contentful paint (LCP)](https://web.dev/lcp/).
- `Optional` **fid**: `number` - Threshold for [first input delay (FID)](https://web.dev/fid/).
- `Optional` **cls**: `number` - Threshold for [cumulative layout shift (CLS)](https://web.dev/cls/).
- `Optional` **fcp**: `number` - Threshold for [first contentful paint (FCP)](https://web.dev/fcp/).
- `Optional` **ttfb**: `number` - Threshold for [time to first byte (TTFB)](https://web.dev/time-to-first-byte/).
- `Optional` **inp**: `number` - Threshold for [interaction to next paint (INP)](https://web.dev/inp/).

#### Google 'Good' scores

```json
{
  "lcp": 2500,
  "fid": 100,
  "cls": 0.1,
  "fcp": 1800,
  "ttfb": 600,
  "inp": 200
}
```

### Custom Reporting

It can be useful to have direct access to the raw data so you can generate custom reports, send to APM, etc.

This can be achieved through the optional `onReport` callback for `cy.vitals()` or `cy.reportVitals()` which receives the raw report before `cypress-web-vitals` passes or fails the test.

```js
describe("Web Vitals", () => {
  it("should log the report to APM", () => {
    cy.vitals({
      url: "https://www.google.com/",
      onReport({ results, strict, thresholds }) {
        console.log(results); // { lcp: ..., fid: ..., }
      },
    });
  });
});
```

The report results contains values for _all signals_, not just the values specified in the provided or default `thresholds`. Signals that couldn't be obtained are reported as `null`.

## How does it work?

When using the `cy.vitals()` command:

1. The url is visited with the HTML response intercepted and modified by Cypress to include the [Web Vitals](https://github.com/GoogleChrome/web-vitals#from-a-cdn) module script and some code to record the Web Vitals values.
1. The audit then waits for the page load event to allow for the values of LCP and CLS to settle; which are subject to change as different parts of the page load into view.
1. Several elements (if exist) starting with the provided element(s) (based on `firstInputSelector`) are then clicked in quick succession to simulate a user clicking on the page to aid FID reporting. Note: if choosing a custom element(s), don't pick something that will navigate away from the page otherwise the plugin will fail to capture the Web Vitals metrics.
1. Next the audit simulates a page visibility state change [which is required for the CLS web-vital to be reported](https://www.npmjs.com/package/web-vitals#basic-usage).
1. The audit then attempts to wait for any outstanding Web Vitals to be reported for which thresholds have been provided.
1. Finally the Web Vitals values are compared against the thresholds, logging successful results and throwing an error for any unsuccessful signals. Note: if the audit was unable to record a web-vital then it is logged, _but the test will not fail_.

The `cy.startVitalsCapture()` and `cy.reportVitals()` commands perform steps 1-2 and 4-6 respectively. There is no clicking of elements (step 3) with these commands as the expectation is for you to provide your own customer journey interactions.

## Contributing

Please check out the [CONTRIBUTING](./docs/CONTRIBUTING.md) docs.

## Changelog

Please check out the [CHANGELOG](./docs/CHANGELOG.md) docs.

---

## License

`cypress-web-vitals` is licensed under the [MIT License](./LICENSE.md).
