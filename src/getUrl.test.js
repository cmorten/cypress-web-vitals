const mockUrl = "test-url";

describe("getUrl", () => {
  let getUrl;

  beforeEach(() => {
    jest.clearAllMocks();

    global.cy = {
      wrap: jest.fn(),
      url: jest.fn().mockReturnValue(),
    };

    getUrl = require("./getUrl");
  });

  describe("when a url is provided", () => {
    beforeEach(() => {
      global.cy.wrap.mockImplementation((str) => `wrapped_${str}`);

      result = getUrl(mockUrl);
    });

    it("should wrap the url without logging", () => {
      expect(global.cy.wrap).toHaveBeenCalledWith(mockUrl, { log: false });
    });

    it("should return the wrapped url", () => {
      expect(result).toEqual(`wrapped_${mockUrl}`);
    });
  });

  describe("when a url is not provided", () => {
    beforeEach(() => {
      global.cy.url.mockReturnValue(mockUrl);

      result = getUrl();
    });

    it("should get the current url without logging", () => {
      expect(global.cy.url).toHaveBeenCalledWith({ log: false });
    });

    it("should return the url", () => {
      expect(result).toEqual(mockUrl);
    });
  });
});
