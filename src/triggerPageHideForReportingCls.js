const triggerPageHideForReportingCls = () =>
  cy.document({ log: false }).then((doc) => {
    cy.stub(doc, "visibilityState").value("hidden");
    cy.stub(doc, "hidden").value(true);
    doc.dispatchEvent(new Event("visibilitychange"));
  });

module.exports = triggerPageHideForReportingCls;
