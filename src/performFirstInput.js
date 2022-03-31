const performFirstInput = (firstInputSelector) => () =>
  cy.document({ log: false }).then(($document) => {
    const documentResult = $document.querySelectorAll(firstInputSelector);

    if (documentResult.length) {
      return cy.get(firstInputSelector, { log: false }).realClick();
    }
  });

module.exports = performFirstInput;
