# cypress-web-vitals-examples

## Getting started

### Install the dependencies

In your terminal:

```console
$ npm install
# or
$ yarn install --frozen-lockfile
```

### Running the tests

You can run all the tests headlessly using:

```console
$ npm run cy:run
# or
$ yarn cy:run
```

You can start the Cypress IDE using:

```console
$ npm run cy:open
# or
$ yarn cy:open
```

## Tests

There are four test files under `./cypress/e2e`:

1. `custom.cy.js` - invokes `cy.vitals()` with custom configuration.
1. `default.cy.js` - invokes `cy.vitals()` without custom configuration.
1. `journey.cy.js` - showcases a `cy.startVitalsCapture()` and `cy.reportVitals()` journey.
1. `report.cy.js`- invokes `cy.vitals` and tests the `onReport` callback.
