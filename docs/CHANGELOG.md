# ChangeLog

For the latest changes, please refer to the [releases page](https://github.com/cmorten/cypress-web-vitals/releases).

## [0.4.0] - 02-11-2021

- [#1] bug: fix script injection when head tag has whitespace or attributes (#2) @jonthemiller
- feat: `vitalsReportedTimeout` config (#3)

## [0.3.0] - 26-06-2021

- fix: `visibilityState` changes now simulated through stubbing the document as `window.open()` does not work with headless Cypress.
- docs: added section to readme on how the command works internally.
- feat: now wait for page load to allow LCP and CLS to change and settle.
- feat: now attempt to wait for all desired Web Vitals to have been reported before calculating the results.

## [0.2.0] - 26-06-2021

- ci: fix `.npmignore`.

## [0.1.0] - 26-06-2021

- feat: initial release.
