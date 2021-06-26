const mockFirstInputSelector = "test-first-input-selector";
const mockRealClick = jest.fn();

describe("performFirstInput", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    global.cy = {
      get: jest.fn().mockReturnValue({ realClick: mockRealClick }),
    };

    const performFirstInput = require("./performFirstInput");

    performFirstInput(mockFirstInputSelector)();
  });

  it("should get the element without logging", () => {
    expect(global.cy.get).toHaveBeenCalledWith(mockFirstInputSelector, {
      log: false,
    });
  });

  it("should natively click the element", () => {
    expect(mockRealClick).toHaveBeenCalled();
  });
});
