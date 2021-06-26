const vitalsCommandHandler = require("./vitalsCommandHandler");

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
});
