const {
  DEFAULT_ALL_WEB_VITALS_REPORTED_TIMEOUT_MS,
  DEFAULT_FIRST_INPUT_SELECTOR,
  DEFAULT_THRESHOLDS,
  LOG_SLUG,
  WEB_VITALS_KEYS,
  WEB_VITALS_KEYS_WITHOUT_CLS_FID_LCP,
} = require("./constants");

jest.mock("./getUrl", () => jest.fn());
jest.mock("./visitWithWebVitalsSnippet", () => jest.fn());
jest.mock("./performFirstInput", () => jest.fn());
jest.mock("./waitForPageLoad", () => jest.fn());
jest.mock("./triggerPageHideForReportingCls", () => jest.fn());
jest.mock("./waitForVitals", () => jest.fn());
jest.mock("./reportResults", () => jest.fn());

const vitalsCommandHandler = require("./vitalsCommandHandler");
const reportResults = require("./reportResults");
const getUrl = require("./getUrl");
const visitWithWebVitalsSnippet = require("./visitWithWebVitalsSnippet");
const performFirstInput = require("./performFirstInput");
const waitForPageLoad = require("./waitForPageLoad");
const triggerPageHideForReportingCls = require("./triggerPageHideForReportingCls");
const waitForVitals = require("./waitForVitals");

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

      getUrl.mockResolvedValue(mockUrl);
    });

    describe("when no custom config is provided", () => {
      beforeEach(() => {
        vitalsCommandHandler();
      });

      it("should log a that Google's thresholds will be used", () => {
        expect(global.cy.log).toHaveBeenCalledWith(
          LOG_SLUG,
          "You have not set any thresholds. The test will use Google's 'Good' scores as the thresholds for every metric."
        );
      });

      it("should get the target url", () => {
        expect(getUrl).toHaveBeenCalled();
      });

      it("should visit the url with the web-vitals snippet injected", () => {
        expect(visitWithWebVitalsSnippet).toHaveBeenCalledWith({
          url: mockUrl,
        });
      });

      it("should wait for the onload event", () => {
        expect(waitForPageLoad).toHaveBeenCalled();
      });

      it("should wait for 'first render' metrics to have been reported", () => {
        expect(waitForVitals).toHaveBeenCalledWith({
          vitals: WEB_VITALS_KEYS_WITHOUT_CLS_FID_LCP,
          vitalsReportedTimeout: DEFAULT_ALL_WEB_VITALS_REPORTED_TIMEOUT_MS,
        });
      });

      it("should perform the first input with the default selector and other common elements (a few times to ensure the browser registers the click - think impatient user!)", () => {
        expect(performFirstInput).toHaveBeenCalledWith(
          DEFAULT_FIRST_INPUT_SELECTOR
        );
        expect(performFirstInput).toHaveBeenCalledWith("main");
        expect(performFirstInput).toHaveBeenCalledWith("header");
        expect(performFirstInput).toHaveBeenCalledWith("nav");
        expect(performFirstInput).toHaveBeenCalledWith("body");
        expect(performFirstInput).toHaveBeenCalledTimes(5);
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

      it("should report on the results using the default thresholds", () => {
        expect(reportResults).toHaveBeenCalledWith({
          thresholds: DEFAULT_THRESHOLDS,
        });
      });
    });

    describe("when a custom url is provided", () => {
      beforeEach(() => {
        vitalsCommandHandler({ url: mockUrl });
      });

      it("should log a that Google's thresholds will be used", () => {
        expect(global.cy.log).toHaveBeenCalledWith(
          LOG_SLUG,
          "You have not set any thresholds. The test will use Google's 'Good' scores as the thresholds for every metric."
        );
      });

      it("should use the provided url", () => {
        expect(getUrl).toHaveBeenCalledWith(mockUrl);
      });

      it("should visit the url with the web-vitals snippet injected", () => {
        expect(visitWithWebVitalsSnippet).toHaveBeenCalledWith({
          url: mockUrl,
        });
      });

      it("should perform the first input with the default selector (a few times to ensure the browser registers the click - think impatient user!)", () => {
        expect(performFirstInput).toHaveBeenCalledWith(
          DEFAULT_FIRST_INPUT_SELECTOR
        );
        expect(performFirstInput).toHaveBeenCalledTimes(5);
      });

      it("should wait for the onload event", () => {
        expect(waitForPageLoad).toHaveBeenCalled();
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

      it("should report on the results using the default thresholds", () => {
        expect(reportResults).toHaveBeenCalledWith({
          thresholds: DEFAULT_THRESHOLDS,
        });
      });
    });

    describe("when a custom first input selector is provided", () => {
      beforeEach(() => {
        vitalsCommandHandler({ firstInputSelector: mockFirstInputSelector });
      });

      it("should log a that Google's thresholds will be used", () => {
        expect(global.cy.log).toHaveBeenCalledWith(
          LOG_SLUG,
          "You have not set any thresholds. The test will use Google's 'Good' scores as the thresholds for every metric."
        );
      });

      it("should get the target url", () => {
        expect(getUrl).toHaveBeenCalled();
      });

      it("should visit the url with the web-vitals snippet injected", () => {
        expect(visitWithWebVitalsSnippet).toHaveBeenCalledWith({
          url: mockUrl,
        });
      });

      it("should perform the first input with the provided selector (a few times to ensure the browser registers the click - think impatient user!)", () => {
        expect(performFirstInput).toHaveBeenCalledWith(mockFirstInputSelector);
        expect(performFirstInput).toHaveBeenCalledTimes(5);
      });

      it("should wait for the onload event", () => {
        expect(waitForPageLoad).toHaveBeenCalled();
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

      it("should report on the results using the default thresholds", () => {
        expect(reportResults).toHaveBeenCalledWith({
          thresholds: DEFAULT_THRESHOLDS,
        });
      });
    });

    describe("when a custom report callback is provided", () => {
      beforeEach(() => {
        vitalsCommandHandler({ onReport: mockOnReport });
      });

      it("should log a that Google's thresholds will be used", () => {
        expect(global.cy.log).toHaveBeenCalledWith(
          LOG_SLUG,
          "You have not set any thresholds. The test will use Google's 'Good' scores as the thresholds for every metric."
        );
      });

      it("should get the target url", () => {
        expect(getUrl).toHaveBeenCalled();
      });

      it("should visit the url with the web-vitals snippet injected", () => {
        expect(visitWithWebVitalsSnippet).toHaveBeenCalledWith({
          url: mockUrl,
        });
      });

      it("should perform the first input with the default selector (a few times to ensure the browser registers the click - think impatient user!)", () => {
        expect(performFirstInput).toHaveBeenCalledWith(
          DEFAULT_FIRST_INPUT_SELECTOR
        );
        expect(performFirstInput).toHaveBeenCalledTimes(5);
      });

      it("should wait for the onload event", () => {
        expect(waitForPageLoad).toHaveBeenCalled();
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

      it("should report on the results using the default thresholds", () => {
        expect(reportResults).toHaveBeenCalledWith({
          thresholds: DEFAULT_THRESHOLDS,
          onReport: mockOnReport,
        });
      });
    });

    describe("when custom thresholds are provided", () => {
      beforeEach(() => {
        vitalsCommandHandler({ thresholds: mockThresholds });
      });

      it("should get the target url", () => {
        expect(getUrl).toHaveBeenCalled();
      });

      it("should visit the url with the web-vitals snippet injected", () => {
        expect(visitWithWebVitalsSnippet).toHaveBeenCalledWith({
          url: mockUrl,
        });
      });

      it("should perform the first input with the default selector (a few times to ensure the browser registers the click - think impatient user!)", () => {
        expect(performFirstInput).toHaveBeenCalledWith(
          DEFAULT_FIRST_INPUT_SELECTOR
        );
        expect(performFirstInput).toHaveBeenCalledTimes(5);
      });

      it("should wait for the onload event", () => {
        expect(waitForPageLoad).toHaveBeenCalled();
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

      it("should report on the results using the provided thresholds", () => {
        expect(reportResults).toHaveBeenCalledWith({
          thresholds: mockThresholds,
        });
      });
    });

    describe("when vitals reported timeout is provided", () => {
      beforeEach(() => {
        vitalsCommandHandler({
          vitalsReportedTimeout: mockVitalsReportedTimeout,
        });
      });

      it("should get the target url", () => {
        expect(getUrl).toHaveBeenCalled();
      });

      it("should visit the url with the web-vitals snippet injected", () => {
        expect(visitWithWebVitalsSnippet).toHaveBeenCalledWith({
          url: mockUrl,
        });
      });

      it("should perform the first input with the default selector (a few times to ensure the browser registers the click - think impatient user!)", () => {
        expect(performFirstInput).toHaveBeenCalledWith(
          DEFAULT_FIRST_INPUT_SELECTOR
        );
        expect(performFirstInput).toHaveBeenCalledTimes(5);
      });

      it("should wait for the onload event", () => {
        expect(waitForPageLoad).toHaveBeenCalled();
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

      it("should report on the results using the default thresholds", () => {
        expect(reportResults).toHaveBeenCalledWith({
          thresholds: DEFAULT_THRESHOLDS,
        });
      });
    });
  });
});
