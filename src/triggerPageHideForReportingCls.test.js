const triggerPageHideForReportingCls = require("./triggerPageHideForReportingCls");
const { DELAY_MS_FOR_CLS_REPORTING } = require("./constants");

const mockWindow = {
  open: jest.fn(),
};

const mockTab = {
  close: jest.fn().mockResolvedValue(),
};

describe("triggerPageHideForReportingCls", () => {
  let resolveTab, resolveTabOpenDelay;

  beforeEach(() => {
    jest.clearAllMocks();

    const tabPromise = new Promise((resolve) => (resolveTab = resolve));
    const tabOpenDelayPromise = new Promise(
      (resolve) => (resolveTabOpenDelay = resolve)
    );

    global.cy = {
      window: jest.fn().mockResolvedValue(mockWindow),
      wrap: jest.fn().mockReturnValueOnce(tabPromise),
      wait: jest.fn().mockReturnValueOnce(tabOpenDelayPromise),
    };

    triggerPageHideForReportingCls();
  });

  it("should open a new tab to set the original page's visibility state to hidden (which triggers the CLS to be reported - REF: https://www.npmjs.com/package/web-vitals#basic-usage)", () => {
    expect(mockWindow.open).toHaveBeenCalledWith("");
  });

  describe("when the tab has opened", () => {
    beforeEach(() => {
      resolveTab(mockTab);
    });

    it("should delay to ensure the original page's visibility state has changed to hidden", () => {
      expect(global.cy.wait).toHaveBeenNthCalledWith(
        1,
        DELAY_MS_FOR_CLS_REPORTING,
        {
          log: false,
        }
      );
    });

    it("should not yet close the tab", () => {
      expect(mockTab.close).not.toHaveBeenCalled();
    });

    describe("when the delay has completed", () => {
      beforeEach(() => {
        resolveTabOpenDelay();
      });

      it("should close the tab", () => {
        expect(mockTab.close).toHaveBeenCalled();
      });

      it("should delay to ensure the CLS has been reported and picked up by the web-vitals module", () => {
        expect(global.cy.wait).toHaveBeenNthCalledWith(
          2,
          DELAY_MS_FOR_CLS_REPORTING,
          { log: false }
        );
      });
    });
  });
});
