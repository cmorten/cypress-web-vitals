# cypress-web-vitals-examples

## Getting Started

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

There are two test files under `./cypress/integration`:

1. `custom.test.js` - invokes `cy.vitals()` with custom configuration.
1. `default.test.js` - invokes `cy.vitals()` without custom configuration.
