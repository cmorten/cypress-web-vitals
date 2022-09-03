const { WEB_VITALS_SNIPPET } = require("./constants");

const visitWithWebVitalsSnippet = ({ url, ...rest }) => {
  cy.intercept({ method: "GET", url, times: 1 }, (req) => {
    req.continue((res) => {
      const body = res.body.replace(
        /<head(>|.*?[^?]>)/,
        `<head$1${WEB_VITALS_SNIPPET}`
      );
      res.send(body);
    });
  });
  return cy.visit(url, { ...rest, log: false });
};

module.exports = visitWithWebVitalsSnippet;
