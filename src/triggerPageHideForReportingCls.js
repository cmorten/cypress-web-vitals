/* eslint-disable cypress/no-unnecessary-waiting */
const { DELAY_MS_FOR_CLS_REPORTING } = require("./constants");

const openTab = (win) => cy.wrap(win.open(""), { log: false });

const closeTabAfterDelay = (tab) =>
  cy.wait(DELAY_MS_FOR_CLS_REPORTING, { log: false }).then(() => tab.close());

const triggerPageHideForReportingCls = () =>
  cy
    .window({ log: false })
    .then(openTab)
    .then(closeTabAfterDelay)
    .then(() => cy.wait(DELAY_MS_FOR_CLS_REPORTING, { log: false }));

module.exports = triggerPageHideForReportingCls;
