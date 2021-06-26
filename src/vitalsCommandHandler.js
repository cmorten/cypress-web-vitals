const {
  DEFAULT_THRESHOLDS,
  DEFAULT_FIRST_INPUT_SELECTOR,
  SUPPORTED_BROWSERS,
  LOG_SLUG,
} = require("./constants");
const getUrl = require("./getUrl");
const visitWithWebVitalsSnippet = require("./visitWithWebVitalsSnippet");
const performFirstInput = require("./performFirstInput");
const waitForPageLoad = require("./waitForPageLoad");
const triggerPageHideForReportingCls = require("./triggerPageHideForReportingCls");
const waitForVitals = require("./waitForVitals");
const reportResults = require("./reportResults");

const vitalsCommandHandler = (
  { thresholds, firstInputSelector = DEFAULT_FIRST_INPUT_SELECTOR, url } = {
    firstInputSelector: DEFAULT_FIRST_INPUT_SELECTOR,
  }
) => {
  const browserName = Cypress.browser.displayName;

  if (!SUPPORTED_BROWSERS[browserName]) {
    return cy.log(LOG_SLUG, `${browserName} is not supported. Skipping...`);
  }

  if (!thresholds) {
    cy.log(
      LOG_SLUG,
      "You have not set any thresholds. The test will use Google's 'Good' scores as the thresholds for every metric."
    );

    thresholds = DEFAULT_THRESHOLDS;
  }

  return getUrl(url)
    .then(visitWithWebVitalsSnippet)
    .then(performFirstInput(firstInputSelector))
    .then(performFirstInput(firstInputSelector))
    .then(performFirstInput(firstInputSelector))
    .then(performFirstInput(firstInputSelector))
    .then(performFirstInput(firstInputSelector))
    .then(waitForPageLoad)
    .then(triggerPageHideForReportingCls)
    .then(waitForVitals(thresholds))
    .then(reportResults(thresholds));
};

module.exports = vitalsCommandHandler;
