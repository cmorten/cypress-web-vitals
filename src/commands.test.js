const vitalsCommandHandler = require("./vitalsCommandHandler");
const startVitalsCaptureCommandHandler = require("./startVitalsCaptureCommandHandler");
const reportVitalsCommandHandler = require("./reportVitalsCommandHandler");

describe("commands", () => {
  beforeAll(() => {
    global.Cypress = {
      Commands: {
        add: jest.fn(),
      },
    };

    require("./commands");
  });

  it("should add the vitals command to Cypress", () => {
    expect(global.Cypress.Commands.add).toHaveBeenCalledWith(
      "vitals",
      vitalsCommandHandler
    );
  });

  it("should add the start vitals capture command to Cypress", () => {
    expect(global.Cypress.Commands.add).toHaveBeenCalledWith(
      "startVitalsCapture",
      startVitalsCaptureCommandHandler
    );
  });

  it("should add the report vitals command to Cypress", () => {
    expect(global.Cypress.Commands.add).toHaveBeenCalledWith(
      "reportVitals",
      reportVitalsCommandHandler
    );
  });
});
