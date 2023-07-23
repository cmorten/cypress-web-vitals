const {
  DEFAULT_ALL_WEB_VITALS_REPORTED_TIMEOUT_MS,
  DEFAULT_FIRST_INPUT_SELECTOR,
  LOG_SLUG,
  SUPPORTED_BROWSERS,
  WEB_VITALS_KEYS_WITHOUT_CLS_FID_LCP_INP,
} = require("./constants");
const startVitalsCaptureCommandHandler = require("./startVitalsCaptureCommandHandler");
const waitForVitals = require("./waitForVitals");
const performFirstInput = require("./performFirstInput");
const reportVitalsCommandHandler = require("./reportVitalsCommandHandler");

const vitalsCommandHandler = (
  {
    firstInputSelector = DEFAULT_FIRST_INPUT_SELECTOR,
    onReport,
    strict,
    thresholds,
    url,
    vitalsReportedTimeout = DEFAULT_ALL_WEB_VITALS_REPORTED_TIMEOUT_MS,
    ...rest
  } = {
    firstInputSelector: DEFAULT_FIRST_INPUT_SELECTOR,
    vitalsReportedTimeout: DEFAULT_ALL_WEB_VITALS_REPORTED_TIMEOUT_MS,
  }
) => {
  const browserName = Cypress.browser.displayName;

  if (!SUPPORTED_BROWSERS[browserName]) {
    return cy.log(LOG_SLUG, `${browserName} is not supported. Skipping...`);
  }

  return startVitalsCaptureCommandHandler({ url, ...rest })
    .then(
      waitForVitals({
        vitals: WEB_VITALS_KEYS_WITHOUT_CLS_FID_LCP_INP,
        vitalsReportedTimeout,
      })
    )
    .then(performFirstInput(firstInputSelector))
    .then(performFirstInput(firstInputSelector))
    .then(() =>
      reportVitalsCommandHandler({
        onReport,
        strict,
        thresholds,
        vitalsReportedTimeout,
      })
    );
};

module.exports = vitalsCommandHandler;
