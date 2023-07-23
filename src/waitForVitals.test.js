const waitForVitals = require("./waitForVitals");
const { WEB_VITALS_ACCESSOR_KEY } = require("./constants");

const mockVitals = ["metric1", "metric2", "metric3"];

describe("waitForVitals", () => {
  let mockWindow, resultPromise;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers();

    global.cy = {
      window: jest.fn(),
    };
  });

  describe("when all vitals have already been reported", () => {
    beforeEach(async () => {
      mockWindow = {
        [WEB_VITALS_ACCESSOR_KEY]: {
          metric1: 1,
          metric2: 2,
          metric3: 3,
        },
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      };

      global.cy.window.mockImplementation(() => ({
        then(_, fn) {
          return Promise.resolve(fn(mockWindow));
        },
      }));

      resultPromise = await waitForVitals({
        vitals: mockVitals,
        vitalsReportedTimeout: 10000,
      })();
    });

    it("should not add an event listener for observing Web Vitals reports", () => {
      expect(mockWindow.addEventListener).not.toHaveBeenCalled();
    });

    it("should resolve", async () => {
      expect(await resultPromise).toEqual(true);
    });
  });

  describe("when not all vitals have been reported yet", () => {
    let resultPromisePending;

    beforeEach(() => {
      mockWindow = {
        [WEB_VITALS_ACCESSOR_KEY]: {
          metric1: 1,
        },
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      };

      global.cy.window.mockImplementation(() => ({
        then(_, fn) {
          return Promise.resolve(fn(mockWindow));
        },
      }));

      resultPromisePending = true;

      resultPromise = waitForVitals({
        vitals: mockVitals,
        vitalsReportedTimeout: 10000,
      })();

      resultPromise.then(() => {
        resultPromisePending = false;
      });
    });

    afterEach(async () => {
      jest.runAllTimers();
      await resultPromise;
    });

    it("should add an event listener for observing Web Vitals reports", () => {
      expect(mockWindow.addEventListener).toHaveBeenCalledWith(
        WEB_VITALS_ACCESSOR_KEY,
        expect.any(Function)
      );
    });

    describe("when another metric is reported, but not all of them", () => {
      beforeEach(() => {
        mockWindow[WEB_VITALS_ACCESSOR_KEY].metric2 = 2;
        mockWindow.addEventListener.mock.calls[0][1]();
      });

      it("should not yet have resolved", () => {
        expect(resultPromisePending).toBe(true);
      });

      describe("when the final web-vital is reported", () => {
        beforeEach(() => {
          mockWindow[WEB_VITALS_ACCESSOR_KEY].metric3 = 3;
          mockWindow.addEventListener.mock.calls[0][1]();
        });

        it("should resolve", async () => {
          expect(await resultPromise).toEqual(true);
          expect(resultPromisePending).toEqual(false);
        });
      });

      describe("when the timeout finishes before the final web-vital is reported", () => {
        beforeEach(() => {
          jest.runAllTimers();
        });

        it("should remove the Web Vitals event listener", () => {
          expect(mockWindow.removeEventListener).toHaveBeenCalledWith(
            WEB_VITALS_ACCESSOR_KEY,
            expect.any(Function)
          );
        });

        it("should resolve", async () => {
          expect(await resultPromise).toEqual(true);
          expect(resultPromisePending).toEqual(false);
        });
      });
    });
  });

  describe("when the vitals namespace has not yet been (or failed to be) set up", () => {
    beforeEach(() => {
      mockWindow = {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      };

      global.cy.window.mockImplementation(() => ({
        then(_, fn) {
          return Promise.resolve(fn(mockWindow));
        },
      }));

      resultPromisePending = true;

      resultPromise = waitForVitals({
        vitals: mockVitals,
        vitalsReportedTimeout: 10000,
      })();

      resultPromise.then(() => {
        resultPromisePending = false;
      });
    });

    afterEach(async () => {
      jest.runAllTimers();
      await resultPromise;
    });

    it("should add an event listener for observing Web Vitals reports", () => {
      expect(mockWindow.addEventListener).toHaveBeenCalledWith(
        WEB_VITALS_ACCESSOR_KEY,
        expect.any(Function)
      );
    });
  });
});
