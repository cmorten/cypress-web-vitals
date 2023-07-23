const {
  DEFAULT_ALL_WEB_VITALS_REPORTED_TIMEOUT_MS,
  DEFAULT_FIRST_INPUT_SELECTOR,
  DEFAULT_THRESHOLDS,
  LOG_SLUG,
  WEB_VITALS_KEYS,
  WEB_VITALS_KEYS_WITHOUT_CLS_FID_LCP_INP,
  DEFAULT_STRICT_MODE,
} = require("./constants");

jest.mock("./startVitalsCaptureCommandHandler", () => jest.fn());
jest.mock("./waitForVitals", () => jest.fn());
jest.mock("./performFirstInput", () => jest.fn());
jest.mock("./reportVitalsCommandHandler", () => jest.fn());

const vitalsCommandHandler = require("./vitalsCommandHandler");
const startVitalsCaptureCommandHandler = require("./startVitalsCaptureCommandHandler");
const waitForVitals = require("./waitForVitals");
const performFirstInput = require("./performFirstInput");
const reportVitalsCommandHandler = require("./reportVitalsCommandHandler");

const mockUrl = Symbol("test-url");
const mockFirstInputSelector = Symbol("test-first-input-selector");
const mockOnReport = jest.fn();
const mockThresholds = Symbol("test-thresholds");
const mockVitalsReportedTimeout = Symbol("test-vitals-reported-timeout");

describe("vitalsCommandHandler", () => {
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

      vitalsCommandHandler();
    });

    it("should log a warning", () => {
      expect(global.cy.log).toHaveBeenCalledWith(
        LOG_SLUG,
        `Firefox is not supported. Skipping...`
      );
    });

    it("should not report any results", () => {
      expect(reportVitalsCommandHandler).not.toHaveBeenCalled();
    });
  });

  describe("when the browser is supported", () => {
    beforeEach(() => {
      global.Cypress = {
        browser: {
          displayName: "Chrome",
        },
      };

      startVitalsCaptureCommandHandler.mockReturnValue(Promise.resolve());
      reportVitalsCommandHandler.mockReturnValue(Promise.resolve());
    });

    describe("when no custom config is provided", () => {
      beforeEach(() => {
        vitalsCommandHandler();
      });

      it("should start the vitals capture", () => {
        expect(startVitalsCaptureCommandHandler).toHaveBeenCalledWith({
          url: undefined,
        });
      });

      it("should wait for 'first render' metrics to have been reported", () => {
        expect(waitForVitals).toHaveBeenCalledWith({
          vitals: WEB_VITALS_KEYS_WITHOUT_CLS_FID_LCP_INP,
          vitalsReportedTimeout: DEFAULT_ALL_WEB_VITALS_REPORTED_TIMEOUT_MS,
        });
      });

      it("should perform the first input with the default selector and other common elements (a few times to ensure the browser registers the click - think impatient user!)", () => {
        expect(performFirstInput).toHaveBeenCalledWith(
          DEFAULT_FIRST_INPUT_SELECTOR
        );
        expect(performFirstInput).toHaveBeenCalledWith("body");
        expect(performFirstInput).toHaveBeenCalledTimes(2);
      });

      it("should report on the results", () => {
        expect(reportVitalsCommandHandler).toHaveBeenCalledWith({
          onReport: undefined,
          strict: undefined,
          thresholds: undefined,
          vitalsReportedTimeout: DEFAULT_ALL_WEB_VITALS_REPORTED_TIMEOUT_MS,
        });
      });
    });

    describe("when a custom url is provided", () => {
      beforeEach(() => {
        vitalsCommandHandler({ url: mockUrl });
      });

      it("should start the vitals capture with the url", () => {
        expect(startVitalsCaptureCommandHandler).toHaveBeenCalledWith({
          url: mockUrl,
        });
      });

      it("should wait for 'first render' metrics to have been reported", () => {
        expect(waitForVitals).toHaveBeenCalledWith({
          vitals: WEB_VITALS_KEYS_WITHOUT_CLS_FID_LCP_INP,
          vitalsReportedTimeout: DEFAULT_ALL_WEB_VITALS_REPORTED_TIMEOUT_MS,
        });
      });

      it("should perform the first input with the default selector (a few times to ensure the browser registers the click - think impatient user!)", () => {
        expect(performFirstInput).toHaveBeenCalledWith(
          DEFAULT_FIRST_INPUT_SELECTOR
        );
        expect(performFirstInput).toHaveBeenCalledTimes(2);
      });

      it("should report on the results", () => {
        expect(reportVitalsCommandHandler).toHaveBeenCalledWith({
          onReport: undefined,
          strict: undefined,
          thresholds: undefined,
          vitalsReportedTimeout: DEFAULT_ALL_WEB_VITALS_REPORTED_TIMEOUT_MS,
        });
      });
    });

    describe("when a custom first input selector is provided", () => {
      beforeEach(() => {
        vitalsCommandHandler({ firstInputSelector: mockFirstInputSelector });
      });

      it("should start the vitals capture", () => {
        expect(startVitalsCaptureCommandHandler).toHaveBeenCalledWith({
          url: undefined,
        });
      });

      it("should wait for 'first render' metrics to have been reported", () => {
        expect(waitForVitals).toHaveBeenCalledWith({
          vitals: WEB_VITALS_KEYS_WITHOUT_CLS_FID_LCP_INP,
          vitalsReportedTimeout: DEFAULT_ALL_WEB_VITALS_REPORTED_TIMEOUT_MS,
        });
      });

      it("should perform the first input with the provided selector (a few times to ensure the browser registers the click - think impatient user!)", () => {
        expect(performFirstInput).toHaveBeenCalledWith(mockFirstInputSelector);
        expect(performFirstInput).toHaveBeenCalledTimes(2);
      });

      it("should report on the results", () => {
        expect(reportVitalsCommandHandler).toHaveBeenCalledWith({
          onReport: undefined,
          strict: undefined,
          thresholds: undefined,
          vitalsReportedTimeout: DEFAULT_ALL_WEB_VITALS_REPORTED_TIMEOUT_MS,
        });
      });
    });

    describe("when a custom report callback is provided", () => {
      beforeEach(() => {
        vitalsCommandHandler({ onReport: mockOnReport });
      });

      it("should start the vitals capture", () => {
        expect(startVitalsCaptureCommandHandler).toHaveBeenCalledWith({
          url: undefined,
        });
      });

      it("should wait for 'first render' metrics to have been reported", () => {
        expect(waitForVitals).toHaveBeenCalledWith({
          vitals: WEB_VITALS_KEYS_WITHOUT_CLS_FID_LCP_INP,
          vitalsReportedTimeout: DEFAULT_ALL_WEB_VITALS_REPORTED_TIMEOUT_MS,
        });
      });

      it("should perform the first input with the default selector (a few times to ensure the browser registers the click - think impatient user!)", () => {
        expect(performFirstInput).toHaveBeenCalledWith(
          DEFAULT_FIRST_INPUT_SELECTOR
        );
        expect(performFirstInput).toHaveBeenCalledTimes(2);
      });

      it("should report on the results", () => {
        expect(reportVitalsCommandHandler).toHaveBeenCalledWith({
          onReport: mockOnReport,
          strict: undefined,
          thresholds: undefined,
          vitalsReportedTimeout: DEFAULT_ALL_WEB_VITALS_REPORTED_TIMEOUT_MS,
        });
      });
    });

    describe("when custom strictness is provided", () => {
      beforeEach(() => {
        vitalsCommandHandler({ strict: true });
      });

      it("should start the vitals capture", () => {
        expect(startVitalsCaptureCommandHandler).toHaveBeenCalledWith({
          url: undefined,
        });
      });

      it("should wait for 'first render' metrics to have been reported", () => {
        expect(waitForVitals).toHaveBeenCalledWith({
          vitals: WEB_VITALS_KEYS_WITHOUT_CLS_FID_LCP_INP,
          vitalsReportedTimeout: DEFAULT_ALL_WEB_VITALS_REPORTED_TIMEOUT_MS,
        });
      });

      it("should perform the first input with the default selector (a few times to ensure the browser registers the click - think impatient user!)", () => {
        expect(performFirstInput).toHaveBeenCalledWith(
          DEFAULT_FIRST_INPUT_SELECTOR
        );
        expect(performFirstInput).toHaveBeenCalledTimes(2);
      });

      it("should report on the results", () => {
        expect(reportVitalsCommandHandler).toHaveBeenCalledWith({
          onReport: undefined,
          strict: true,
          thresholds: undefined,
          vitalsReportedTimeout: DEFAULT_ALL_WEB_VITALS_REPORTED_TIMEOUT_MS,
        });
      });
    });

    describe("when custom thresholds are provided", () => {
      beforeEach(() => {
        vitalsCommandHandler({ thresholds: mockThresholds });
      });

      it("should start the vitals capture", () => {
        expect(startVitalsCaptureCommandHandler).toHaveBeenCalledWith({
          url: undefined,
        });
      });

      it("should wait for 'first render' metrics to have been reported", () => {
        expect(waitForVitals).toHaveBeenCalledWith({
          vitals: WEB_VITALS_KEYS_WITHOUT_CLS_FID_LCP_INP,
          vitalsReportedTimeout: DEFAULT_ALL_WEB_VITALS_REPORTED_TIMEOUT_MS,
        });
      });

      it("should perform the first input with the default selector (a few times to ensure the browser registers the click - think impatient user!)", () => {
        expect(performFirstInput).toHaveBeenCalledWith(
          DEFAULT_FIRST_INPUT_SELECTOR
        );
        expect(performFirstInput).toHaveBeenCalledTimes(2);
      });

      it("should report on the results", () => {
        expect(reportVitalsCommandHandler).toHaveBeenCalledWith({
          onReport: undefined,
          strict: undefined,
          thresholds: mockThresholds,
          vitalsReportedTimeout: DEFAULT_ALL_WEB_VITALS_REPORTED_TIMEOUT_MS,
        });
      });
    });

    describe("when vitals reported timeout is provided", () => {
      beforeEach(() => {
        vitalsCommandHandler({
          vitalsReportedTimeout: mockVitalsReportedTimeout,
        });
      });

      it("should start the vitals capture", () => {
        expect(startVitalsCaptureCommandHandler).toHaveBeenCalledWith({
          url: undefined,
        });
      });

      it("should wait for 'first render' metrics to have been reported", () => {
        expect(waitForVitals).toHaveBeenCalledWith({
          vitals: WEB_VITALS_KEYS_WITHOUT_CLS_FID_LCP_INP,
          vitalsReportedTimeout: mockVitalsReportedTimeout,
        });
      });

      it("should perform the first input with the default selector (a few times to ensure the browser registers the click - think impatient user!)", () => {
        expect(performFirstInput).toHaveBeenCalledWith(
          DEFAULT_FIRST_INPUT_SELECTOR
        );
        expect(performFirstInput).toHaveBeenCalledTimes(2);
      });

      it("should report on the results", () => {
        expect(reportVitalsCommandHandler).toHaveBeenCalledWith({
          onReport: undefined,
          strict: undefined,
          thresholds: undefined,
          vitalsReportedTimeout: mockVitalsReportedTimeout,
        });
      });
    });
  });
});
