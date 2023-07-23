const { LOG_SLUG } = require("./constants");

jest.mock("./getUrl", () => jest.fn());
jest.mock("./visitWithWebVitalsSnippet", () => jest.fn());
jest.mock("./waitForPageLoad", () => jest.fn());

const startVitalsCaptureCommandHandler = require("./startVitalsCaptureCommandHandler");
const getUrl = require("./getUrl");
const visitWithWebVitalsSnippet = require("./visitWithWebVitalsSnippet");
const waitForPageLoad = require("./waitForPageLoad");

const mockUrl = Symbol("test-url");
const mockVisitParameter = Symbol("test-visit-parameter");

describe("startVitalsCaptureCommandHandler", () => {
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

      startVitalsCaptureCommandHandler();
    });

    it("should log a warning", () => {
      expect(global.cy.log).toHaveBeenCalledWith(
        LOG_SLUG,
        `Firefox is not supported. Skipping...`
      );
    });

    it("should not proceed", () => {
      expect(getUrl).not.toHaveBeenCalled();
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
        startVitalsCaptureCommandHandler();
      });

      it("should get the target url", () => {
        expect(getUrl).toHaveBeenCalled();
      });

      it("should visit the url with the Web Vitals snippet injected", () => {
        expect(visitWithWebVitalsSnippet).toHaveBeenCalledWith({
          url: mockUrl,
        });
      });

      it("should wait for the onload event", () => {
        expect(waitForPageLoad).toHaveBeenCalled();
      });
    });

    describe("when a custom url is provided", () => {
      beforeEach(() => {
        startVitalsCaptureCommandHandler({ url: mockUrl });
      });

      it("should use the provided url", () => {
        expect(getUrl).toHaveBeenCalledWith(mockUrl);
      });

      it("should visit the url with the Web Vitals snippet injected", () => {
        expect(visitWithWebVitalsSnippet).toHaveBeenCalledWith({
          url: mockUrl,
        });
      });

      it("should wait for the onload event", () => {
        expect(waitForPageLoad).toHaveBeenCalled();
      });
    });

    describe("when other custom visit parameters are provided", () => {
      beforeEach(() => {
        startVitalsCaptureCommandHandler({
          visitParameterKey: mockVisitParameter,
        });
      });

      it("should use the provided url", () => {
        expect(getUrl).toHaveBeenCalled();
      });

      it("should visit the url with the Web Vitals snippet injected", () => {
        expect(visitWithWebVitalsSnippet).toHaveBeenCalledWith({
          url: mockUrl,
          visitParameterKey: mockVisitParameter,
        });
      });

      it("should wait for the onload event", () => {
        expect(waitForPageLoad).toHaveBeenCalled();
      });
    });
  });
});
