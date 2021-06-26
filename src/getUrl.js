const getUrl = (url) => {
  if (url) {
    return cy.wrap(url, { log: false });
  }

  return cy.url({ log: false });
};

module.exports = getUrl;
