const mockFirstInputSelector = "test-first-input-selector";
const mockSecondInputSelector = "test-second-input-selector";
const mockThirdInputSelector = "test-third-input-selector";
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

  describe("when an array of selectors for elements in the DOM are provided", () => {
    beforeEach(() => {
      const mockDocument = {
        querySelectorAll: jest
          .fn()
          .mockReturnValueOnce([Symbol("test-element-1")])
          .mockReturnValueOnce([Symbol("test-element-2")])
          .mockReturnValueOnce([Symbol("test-element-3")]),
      };

      global.cy = {
        document: jest.fn().mockResolvedValue(mockDocument),
        get: jest.fn().mockReturnValue({ realClick: mockRealClick }),
      };

      const performFirstInput = require("./performFirstInput");

      performFirstInput([
        mockFirstInputSelector,
        mockSecondInputSelector,
        mockThirdInputSelector,
      ])();
    });

    it("should get the first element without logging", () => {
      expect(global.cy.get).toHaveBeenCalledWith(mockFirstInputSelector, {
        log: false,
      });
    });

    it("should get the first element without logging", () => {
      expect(global.cy.get).toHaveBeenCalledWith(mockSecondInputSelector, {
        log: false,
      });
    });

    it("should get the first element without logging", () => {
      expect(global.cy.get).toHaveBeenCalledWith(mockThirdInputSelector, {
        log: false,
      });
    });

    it("should natively click the elements", () => {
      expect(mockRealClick).toHaveBeenCalledTimes(3);
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
