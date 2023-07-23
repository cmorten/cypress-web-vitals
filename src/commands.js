require("cypress-real-events/support");

const vitalsCommandHandler = require("./vitalsCommandHandler");
const startVitalsCaptureCommandHandler = require("./startVitalsCaptureCommandHandler");
const reportVitalsCommandHandler = require("./reportVitalsCommandHandler");

Cypress.Commands.add("vitals", vitalsCommandHandler);
Cypress.Commands.add("startVitalsCapture", startVitalsCaptureCommandHandler);
Cypress.Commands.add("reportVitals", reportVitalsCommandHandler);
