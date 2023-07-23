const waitForPageLoad = require("./waitForPageLoad");

describe("waitForPageLoad", () => {
  let mockWindow, resultPromise;

  beforeAll(() => {
    jest.clearAllMocks();

    global.cy = {
      window: jest.fn(),
    };
  });

  describe("when page load has already occurred", () => {
    beforeAll(async () => {
      mockWindow = {
        document: {
          readyState: "complete",
        },
        addEventListener: jest.fn(),
      };

      global.cy.window.mockResolvedValue(mockWindow);

      resultPromise = await waitForPageLoad();
    });

    it("should not add an event listener for load", () => {
      expect(mockWindow.addEventListener).not.toHaveBeenCalled();
    });

    it("should resolve", async () => {
      expect(await resultPromise).toEqual(true);
    });
  });

  describe("when the page has not fully loaded yet", () => {
    beforeAll(() => {
      mockWindow = {
        document: {
          readyState: "loading",
        },
        addEventListener: jest.fn(),
      };

      global.cy.window.mockResolvedValue(mockWindow);

      resultPromise = waitForPageLoad();
    });

    afterAll(async () => {
      await resultPromise;
    });

    it("should add an event listener for page load", () => {
      expect(mockWindow.addEventListener).toHaveBeenCalledWith(
        "load",
        expect.any(Function),
        { once: true },
      );
    });

    describe("when the page load event fires", () => {
      beforeAll(() => {
        mockWindow.addEventListener.mock.calls[0][1]();
      });

      it("should resolve", async () => {
        expect(await resultPromise).toEqual(true);
      });
    });
  });
});
