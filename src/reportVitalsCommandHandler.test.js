const {
  DEFAULT_ALL_WEB_VITALS_REPORTED_TIMEOUT_MS,
  DEFAULT_FIRST_INPUT_SELECTOR,
  DEFAULT_THRESHOLDS,
  LOG_SLUG,
  WEB_VITALS_KEYS,
  WEB_VITALS_KEYS_WITHOUT_CLS_FID_LCP_INP,
  DEFAULT_STRICT_MODE,
} = require("./constants");

jest.mock("./triggerPageHideForReportingCls", () => jest.fn());
jest.mock("./waitForVitals", () => jest.fn());
jest.mock("./reportResults", () => jest.fn());

const reportVitalsCommandHandler = require("./reportVitalsCommandHandler");
const triggerPageHideForReportingCls = require("./triggerPageHideForReportingCls");
const waitForVitals = require("./waitForVitals");
const reportResults = require("./reportResults");

const mockOnReport = jest.fn();
const mockThresholds = Symbol("test-thresholds");
const mockVitalsReportedTimeout = Symbol("test-vitals-reported-timeout");

describe("reportVitalsCommandHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    global.cy = {
      log: jest.fn(),
    };
  });

  describe("when the browser is not supported", () => {
    beforeEach(() => {
      global.Cypress = {
        browser: {
          displayName: "Firefox",
        },
      };

      reportVitalsCommandHandler();
    });

    it("should log a warning", () => {
      expect(global.cy.log).toHaveBeenCalledWith(
        LOG_SLUG,
        `Firefox is not supported. Skipping...`
      );
    });

    it("should not report any results", () => {
      expect(reportResults).not.toHaveBeenCalled();
    });
  });

  describe("when the browser is supported", () => {
    beforeEach(() => {
      global.Cypress = {
        browser: {
          displayName: "Chrome",
        },
      };

      triggerPageHideForReportingCls.mockReturnValue(Promise.resolve());
      waitForVitals.mockReturnValue(Promise.resolve());
    });

    describe("when no custom config is provided", () => {
      beforeEach(() => {
        reportVitalsCommandHandler();
      });

      it("should log a that Google's thresholds will be used", () => {
        expect(global.cy.log).toHaveBeenCalledWith(
          LOG_SLUG,
          "You have not set any thresholds. The test will use Google's 'Good' scores as the thresholds for every metric."
        );
      });

      it("should trigger a page hide so CLS is reported", () => {
        expect(triggerPageHideForReportingCls).toHaveBeenCalled();
      });

      it("should wait for all vitals to have been reported", () => {
        expect(waitForVitals).toHaveBeenCalledWith({
          vitals: WEB_VITALS_KEYS,
          vitalsReportedTimeout: DEFAULT_ALL_WEB_VITALS_REPORTED_TIMEOUT_MS,
        });
      });

      it("should report on the results using the default thresholds and strictness", () => {
        expect(reportResults).toHaveBeenCalledWith({
          strict: DEFAULT_STRICT_MODE,
          thresholds: DEFAULT_THRESHOLDS,
        });
      });
    });

    describe("when a custom report callback is provided", () => {
      beforeEach(() => {
        reportVitalsCommandHandler({ onReport: mockOnReport });
      });

      it("should log a that Google's thresholds will be used", () => {
        expect(global.cy.log).toHaveBeenCalledWith(
          LOG_SLUG,
          "You have not set any thresholds. The test will use Google's 'Good' scores as the thresholds for every metric."
        );
      });

      it("should trigger a page hide so CLS is reported", () => {
        expect(triggerPageHideForReportingCls).toHaveBeenCalled();
      });

      it("should wait for all vitals to have been reported", () => {
        expect(waitForVitals).toHaveBeenCalledWith({
          vitals: WEB_VITALS_KEYS,
          vitalsReportedTimeout: DEFAULT_ALL_WEB_VITALS_REPORTED_TIMEOUT_MS,
        });
      });

      it("should report on the results using the default thresholds and strictness", () => {
        expect(reportResults).toHaveBeenCalledWith({
          strict: DEFAULT_STRICT_MODE,
          thresholds: DEFAULT_THRESHOLDS,
          onReport: mockOnReport,
        });
      });
    });

    describe("when custom strictness is provided", () => {
      beforeEach(() => {
        reportVitalsCommandHandler({ strict: true });
      });

      it("should trigger a page hide so CLS is reported", () => {
        expect(triggerPageHideForReportingCls).toHaveBeenCalled();
      });

      it("should wait for all vitals to have been reported", () => {
        expect(waitForVitals).toHaveBeenCalledWith({
          vitals: WEB_VITALS_KEYS,
          vitalsReportedTimeout: DEFAULT_ALL_WEB_VITALS_REPORTED_TIMEOUT_MS,
        });
      });

      it("should report on the results using the provided strictness and default thresholds", () => {
        expect(reportResults).toHaveBeenCalledWith({
          strict: true,
          thresholds: DEFAULT_THRESHOLDS,
        });
      });
    });

    describe("when custom thresholds are provided", () => {
      beforeEach(() => {
        reportVitalsCommandHandler({ thresholds: mockThresholds });
      });

      it("should trigger a page hide so CLS is reported", () => {
        expect(triggerPageHideForReportingCls).toHaveBeenCalled();
      });

      it("should wait for all vitals to have been reported", () => {
        expect(waitForVitals).toHaveBeenCalledWith({
          vitals: WEB_VITALS_KEYS,
          vitalsReportedTimeout: DEFAULT_ALL_WEB_VITALS_REPORTED_TIMEOUT_MS,
        });
      });

      it("should report on the results using the provided thresholds and default strictness", () => {
        expect(reportResults).toHaveBeenCalledWith({
          strict: DEFAULT_STRICT_MODE,
          thresholds: mockThresholds,
        });
      });
    });

    describe("when vitals reported timeout is provided", () => {
      beforeEach(() => {
        reportVitalsCommandHandler({
          vitalsReportedTimeout: mockVitalsReportedTimeout,
        });
      });

      it("should trigger a page hide so CLS is reported", () => {
        expect(triggerPageHideForReportingCls).toHaveBeenCalled();
      });

      it("should wait for all vitals to have been reported", () => {
        expect(waitForVitals).toHaveBeenCalledWith({
          vitals: WEB_VITALS_KEYS,
          vitalsReportedTimeout: mockVitalsReportedTimeout,
        });
      });

      it("should report on the results using the default thresholds and strictness", () => {
        expect(reportResults).toHaveBeenCalledWith({
          strict: DEFAULT_STRICT_MODE,
          thresholds: DEFAULT_THRESHOLDS,
        });
      });
    });
  });
});
