const { LOG_SLUG, SUPPORTED_BROWSERS } = require("./constants");
const getUrl = require("./getUrl");
const visitWithWebVitalsSnippet = require("./visitWithWebVitalsSnippet");
const waitForPageLoad = require("./waitForPageLoad");

const startVitalsCaptureCommandHandler = ({ url, ...rest } = {}) => {
  const browserName = Cypress.browser.displayName;

  if (!SUPPORTED_BROWSERS[browserName]) {
    return cy.log(LOG_SLUG, `${browserName} is not supported. Skipping...`);
  }

  return getUrl(url)
    .then((url) => visitWithWebVitalsSnippet({ url, ...rest }))
    .then(waitForPageLoad);
};

module.exports = startVitalsCaptureCommandHandler;
