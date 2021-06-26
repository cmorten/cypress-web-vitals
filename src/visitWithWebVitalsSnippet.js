const { WEB_VITALS_SNIPPET } = require("./constants");

const visitWithWebVitalsSnippet = (url) => {
  cy.intercept(url, (req) => {
    req.continue((res) => {
      res.send(res.body.replace("<head>", `<head>${WEB_VITALS_SNIPPET}`));
    });
  });

  return cy.visit(url, { log: false });
};

module.exports = visitWithWebVitalsSnippet;
