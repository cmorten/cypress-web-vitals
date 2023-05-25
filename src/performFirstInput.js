const performFirstInput = (firstInputSelector) => () =>
  cy.document({ log: false }).then(($document) => {
    const selectors = Array.isArray(firstInputSelector)
      ? firstInputSelector
      : [firstInputSelector];

    selectors.forEach((selector) => {
      const documentResult = $document.querySelectorAll(selector);

      if (documentResult.length) {
        cy.get(selector, { log: false }).realClick();
      }
    });
  });

module.exports = performFirstInput;
