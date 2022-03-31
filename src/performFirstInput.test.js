const mockFirstInputSelector = "test-first-input-selector";
const mockRealClick = jest.fn();

describe("performFirstInput", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when the element is in the DOM", () => {
    beforeEach(() => {
      const mockDocument = {
        querySelectorAll: jest.fn().mockReturnValue([Symbol("test-element")]),
      };

      global.cy = {
        document: jest.fn().mockResolvedValue(mockDocument),
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

  describe("when the element is not in the DOM", () => {
    beforeEach(() => {
      const mockDocument = {
        querySelectorAll: jest.fn().mockReturnValue([]),
      };

      global.cy = {
        document: jest.fn().mockResolvedValue(mockDocument),
        get: jest.fn(),
      };

      const performFirstInput = require("./performFirstInput");

      performFirstInput(mockFirstInputSelector)();
    });

    it("should not get the element ", () => {
      expect(global.cy.get).not.toHaveBeenCalled();
    });
  });
});
