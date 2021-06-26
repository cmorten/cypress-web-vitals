const performFirstInput = (firstInputSelector) => () =>
  cy.get(firstInputSelector, { log: false }).realClick();

module.exports = performFirstInput;
