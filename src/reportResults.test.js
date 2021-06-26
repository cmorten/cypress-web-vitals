const reportResults = require("./reportResults");
const { WEB_VITALS_ACCESSOR_KEY, LOG_SLUG } = require("./constants");

const mockThresholds = {
  metric1: 5,
  metric2: 5,
  metric3: 5,
};

describe("reportResults", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    global.cy = {
      window: jest.fn(),
      log: jest.fn(),
    };
  });

  describe("when all metrics are below the thresholds", () => {
    const mockWindow = {
      [WEB_VITALS_ACCESSOR_KEY]: {
        metric1: { value: 1 },
        metric2: { value: 2 },
        metric3: { value: 3 },
      },
    };

    beforeEach(async () => {
      global.cy.window.mockResolvedValue(mockWindow);

      await reportResults(mockThresholds)();
    });

    it("should log the results", () => {
      expect(global.cy.log).toHaveBeenCalledWith(
        `-------- ${LOG_SLUG} --------`
      );
      expect(global.cy.log).toHaveBeenCalledWith(
        `metric1 web-vital is 1, and threshold was 5.`
      );
      expect(global.cy.log).toHaveBeenCalledWith(
        `metric2 web-vital is 2, and threshold was 5.`
      );
      expect(global.cy.log).toHaveBeenCalledWith(
        `metric3 web-vital is 3, and threshold was 5.`
      );
      expect(global.cy.log).toHaveBeenCalledWith(
        "-----------------------------"
      );
    });
  });

  describe("when one metric is over it's threshold", () => {
    let error;

    const mockWindow = {
      [WEB_VITALS_ACCESSOR_KEY]: {
        metric1: { value: 1 },
        metric2: { value: 10 },
        metric3: { value: 5 },
      },
    };

    beforeEach(async () => {
      global.cy.window.mockResolvedValue(mockWindow);
      error = undefined;

      try {
        await reportResults(mockThresholds)();
      } catch (e) {
        error = e;
      }
    });

    it("should log the results", () => {
      expect(global.cy.log).toHaveBeenCalledWith(
        `-------- ${LOG_SLUG} --------`
      );
      expect(global.cy.log).toHaveBeenCalledWith(
        `metric1 web-vital is 1, and threshold was 5.`
      );
      expect(global.cy.log).toHaveBeenCalledWith(
        `metric3 web-vital is 5, and threshold was 5.`
      );
      expect(global.cy.log).toHaveBeenCalledWith(
        "-----------------------------"
      );
    });

    it("throw an error", () => {
      expect(error.message).toEqual(
        "cy.vitals() - A threshold has been crossed.\n\nmetric2 web-vital is 10, and is over the 5 threshold."
      );
    });
  });

  describe("when one metric cannot be calculated", () => {
    let error;

    const mockWindow = {
      [WEB_VITALS_ACCESSOR_KEY]: {
        metric1: { value: 1 },
        metric2: undefined,
        metric3: { value: 0.1 },
      },
    };

    beforeEach(async () => {
      global.cy.window.mockResolvedValue(mockWindow);

      await reportResults(mockThresholds)();
    });

    it("should log the results", () => {
      expect(global.cy.log).toHaveBeenCalledWith(
        `-------- ${LOG_SLUG} --------`
      );
      expect(global.cy.log).toHaveBeenCalledWith(
        `metric1 web-vital is 1, and threshold was 5.`
      );
      expect(global.cy.log).toHaveBeenCalledWith(
        `metric2 web-vital could not be calculated, and threshold was 5. Skipping...`
      );
      expect(global.cy.log).toHaveBeenCalledWith(
        `metric3 web-vital is 0.1, and threshold was 5.`
      );
      expect(global.cy.log).toHaveBeenCalledWith(
        "-----------------------------"
      );
    });
  });

  describe("when all metrics are over their threshold", () => {
    let error;

    const mockWindow = {
      [WEB_VITALS_ACCESSOR_KEY]: {
        metric1: { value: 5.1 },
        metric2: { value: 11 },
        metric3: { value: 12 },
      },
    };

    beforeEach(async () => {
      global.cy.window.mockResolvedValue(mockWindow);
      error = undefined;

      try {
        await reportResults(mockThresholds)();
      } catch (e) {
        error = e;
      }
    });

    it("should log the results", () => {
      expect(global.cy.log).not.toHaveBeenCalled();
    });

    it("throw an error", () => {
      expect(error.message).toEqual(
        "cy.vitals() - Some thresholds have been crossed.\n\nmetric1 web-vital is 5.1, and is over the 5 threshold.\nmetric2 web-vital is 11, and is over the 5 threshold.\nmetric3 web-vital is 12, and is over the 5 threshold."
      );
    });
  });
});
