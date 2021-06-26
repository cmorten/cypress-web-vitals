require("cypress-real-events/support");

const vitalsCommandHandler = require("./vitalsCommandHandler");

Cypress.Commands.add("vitals", vitalsCommandHandler);
