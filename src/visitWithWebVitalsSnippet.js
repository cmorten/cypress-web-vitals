const { WEB_VITALS_SNIPPET } = require("./constants");

const visitWithWebVitalsSnippet = (url) => {
  cy.intercept({ method: "GET", url, times: 1 }, (req) => {
    req.continue((res) => {
      const body = res.body.replace(
        /<head(>|.*?[^?]>)/g,
        `<head$1${WEB_VITALS_SNIPPET}`
      );
      res.send(body);
    });
  });

  return cy.visit(url, { log: false });
};

module.exports = visitWithWebVitalsSnippet;
