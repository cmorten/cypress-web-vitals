const {
  DEFAULT_ALL_WEB_VITALS_REPORTED_TIMEOUT_MS,
  DEFAULT_FIRST_INPUT_SELECTOR,
  DEFAULT_STRICT_MODE,
  DEFAULT_THRESHOLDS,
  LOG_SLUG,
  SUPPORTED_BROWSERS,
  WEB_VITALS_KEYS,
  WEB_VITALS_KEYS_WITHOUT_CLS_FID_LCP,
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
    firstInputSelector = DEFAULT_FIRST_INPUT_SELECTOR,
    onReport,
    strict = DEFAULT_STRICT_MODE,
    thresholds,
    url,
    vitalsReportedTimeout = DEFAULT_ALL_WEB_VITALS_REPORTED_TIMEOUT_MS,
    ...rest
  } = {
    firstInputSelector: DEFAULT_FIRST_INPUT_SELECTOR,
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

  return getUrl(url)
    .then((url) => visitWithWebVitalsSnippet({ url, ...rest }))
    .then(waitForPageLoad)
    .then(
      waitForVitals({
        vitals: WEB_VITALS_KEYS_WITHOUT_CLS_FID_LCP,
        vitalsReportedTimeout,
      })
    )
    .then(performFirstInput(firstInputSelector))
    .then(performFirstInput(firstInputSelector))
    .then(triggerPageHideForReportingCls)
    .then(waitForVitals({ vitals: WEB_VITALS_KEYS, vitalsReportedTimeout }))
    .then(reportResults({ onReport, strict, thresholds }));
};

module.exports = vitalsCommandHandler;
