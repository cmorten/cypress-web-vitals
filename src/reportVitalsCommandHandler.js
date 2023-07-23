const {
  DEFAULT_ALL_WEB_VITALS_REPORTED_TIMEOUT_MS,
  DEFAULT_STRICT_MODE,
  DEFAULT_THRESHOLDS,
  LOG_SLUG,
  SUPPORTED_BROWSERS,
  WEB_VITALS_KEYS,
} = require("./constants");
const triggerPageHideForReportingCls = require("./triggerPageHideForReportingCls");
const waitForVitals = require("./waitForVitals");
const reportResults = require("./reportResults");

const reportVitalsCommandHandler = (
  {
    onReport,
    strict = DEFAULT_STRICT_MODE,
    thresholds,
    vitalsReportedTimeout = DEFAULT_ALL_WEB_VITALS_REPORTED_TIMEOUT_MS,
  } = {
    strict: DEFAULT_STRICT_MODE,
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

  return triggerPageHideForReportingCls()
    .then(waitForVitals({ vitals: WEB_VITALS_KEYS, vitalsReportedTimeout }))
    .then(reportResults({ onReport, strict, thresholds }));
};

module.exports = reportVitalsCommandHandler;
