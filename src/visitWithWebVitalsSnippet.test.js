const visitWithWebVitalsSnippet = require("./visitWithWebVitalsSnippet");
const { WEB_VITALS_SNIPPET } = require("./constants");

const mockUrl = "test-url";

describe("visitWithWebVitalsSnippet", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    global.cy = {
      intercept: jest.fn(),
      visit: jest.fn(),
    };

    visitWithWebVitalsSnippet(mockUrl);
  });

  it("should intercept the url", () => {
    expect(global.cy.intercept).toHaveBeenCalledWith(
      mockUrl,
      expect.any(Function)
    );
  });

  describe("when the request comes back", () => {
    const mockResponse = {
      send: jest.fn(),
      body: "<html><head><title>App</title></head><body></body></html>",
    };

    beforeEach(() => {
      const mockRequest = {
        continue: (fn) => fn(mockResponse),
      };

      global.cy.intercept.mock.calls[0][1](mockRequest);
    });

    it("should add the web-vitals snippet to the response's <head>", () => {
      expect(mockResponse.send).toHaveBeenCalledWith(
        `<html><head>${WEB_VITALS_SNIPPET}<title>App</title></head><body></body></html>`
      );
    });
  });

  describe("irregular head tag intercept", () => {
    const mockResponse = {
      send: jest.fn(),
      body: '<html><head attribute="value"><title>App</title></head><body></body></html>',
    };

    beforeEach(() => {
      const mockRequest = {
        continue: (fn) => fn(mockResponse),
      };

      global.cy.intercept.mock.calls[0][1](mockRequest);
    });

    it("should recognize the irregular head tag format and preserve it", () => {
      expect(mockResponse.send).toHaveBeenCalledWith(
        `<html><head attribute="value">${WEB_VITALS_SNIPPET}<title>App</title></head><body></body></html>`
      );
    });
  });

  it("should visit the url without logging", () => {
    expect(global.cy.visit).toHaveBeenCalledWith(mockUrl, { log: false });
  });
});
