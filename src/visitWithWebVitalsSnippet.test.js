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

    visitWithWebVitalsSnippet({ url: mockUrl });
  });
  describe("only a url was passed", () => {
    it("should intercept the url", () => {
      expect(global.cy.intercept).toHaveBeenCalledWith(
        { method: "GET", url: mockUrl, times: 1 },
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

    describe("only targets first head tag", () => {
      const mockResponse = {
        send: jest.fn(),
        body: "<html><head><title>App</title><script>/** comment with <head> in it **/</script></head><body></body></html>",
      };

      beforeEach(() => {
        const mockRequest = {
          continue: (fn) => fn(mockResponse),
        };

        global.cy.intercept.mock.calls[0][1](mockRequest);
      });

      it("should only add the vitals snippet following the first <head> in the HTML response", () => {
        expect(mockResponse.send).toHaveBeenCalledWith(
          `<html><head>${WEB_VITALS_SNIPPET}<title>App</title><script>/** comment with <head> in it **/</script></head><body></body></html>`
        );
      });
    });

    it("should visit the url without logging", () => {
      expect(global.cy.visit).toHaveBeenCalledWith(mockUrl, { log: false });
    });
  });
  describe("additional params passed like auth + headers", () => {
    describe("auth + header params passed", () => {
      const exampleHeaders = {
        "Accept-Encoding": "gzip, deflate",
      };
      const examplAuth = {
        username: "qa",
        password: "examplepass",
      };
      beforeEach(() => {
        jest.clearAllMocks();
        global.cy = {
          intercept: jest.fn(),
          visit: jest.fn(),
        };
        visitWithWebVitalsSnippet({
          url: mockUrl,
          auth: examplAuth,
          headers: exampleHeaders,
        });
      });
      it("should visit the url without logging", () => {
        expect(global.cy.visit).toHaveBeenCalledWith(mockUrl, {
          headers: {
            "Accept-Encoding": "gzip, deflate",
          },
          auth: {
            username: "qa",
            password: "examplepass",
          },
          log: false,
        });
      });
    });
  });
});
