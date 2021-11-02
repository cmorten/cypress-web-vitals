const {
  DEFAULT_ALL_WEB_VITALS_REPORTED_TIMEOUT_MS,
  DEFAULT_THRESHOLDS,
  DEFAULT_FIRST_INPUT_SELECTOR,
  LOG_SLUG,
  SUPPORTED_BROWSERS,
} = require("./constants");
const getUrl = require("./getUrl");
const visitWithWebVitalsSnippet = require("./visitWithWebVitalsSnippet");
const performFirstInput = require("./performFirstInput");
const waitForPageLoad = require("./waitForPageLoad");
const triggerPageHideForReportingCls = require("./triggerPageHideForReportingCls");
const waitForVitals = require("./waitForVitals");
const reportResults = require("./reportResults");

const vitalsCommandHandler = (
  {
    thresholds,
    firstInputSelector = DEFAULT_FIRST_INPUT_SELECTOR,
    url,
    vitalsReportedTimeout = DEFAULT_ALL_WEB_VITALS_REPORTED_TIMEOUT_MS,
  } = {
    firstInputSelector: DEFAULT_FIRST_INPUT_SELECTOR,
    vitalsReportedTimeout: DEFAULT_ALL_WEB_VITALS_REPORTED_TIMEOUT_MS,
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
    .then(waitForVitals({ thresholds, vitalsReportedTimeout }))
    .then(reportResults(thresholds));
};

module.exports = vitalsCommandHandler;
