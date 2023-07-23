const triggerPageHideForReportingCls = require("./triggerPageHideForReportingCls");

const mockDocument = {
  dispatchEvent: jest.fn(),
};

const mockVisibilityStateSetter = jest.fn();
const mockDocumentHiddenSetter = jest.fn();
const mockEvent = {
  "test-key": Symbol("test-value"),
};

describe("triggerPageHideForReportingCls", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    global.cy = {
      document: jest.fn().mockResolvedValue(mockDocument),
      stub: jest
        .fn()
        .mockReturnValueOnce({ value: mockVisibilityStateSetter })
        .mockReturnValueOnce({ value: mockDocumentHiddenSetter }),
    };

    global.Event = jest.fn().mockReturnValue(mockEvent);

    triggerPageHideForReportingCls();
  });

  it("should set the document's visibilityState to 'hidden'", () => {
    expect(global.cy.stub).toHaveBeenCalledWith(
      mockDocument,
      "visibilityState",
    );
    expect(mockVisibilityStateSetter).toHaveBeenCalledWith("hidden");
  });

  it("should set the document's hidden state to 'true'", () => {
    expect(global.cy.stub).toHaveBeenCalledWith(mockDocument, "hidden");
    expect(mockDocumentHiddenSetter).toHaveBeenCalledWith(true);
  });

  it("should dispatch a new 'visibilitychange' Event to trigger the CLS reporting", () => {
    expect(Event).toHaveBeenCalledWith("visibilitychange");
    expect(mockDocument.dispatchEvent).toHaveBeenCalledWith(mockEvent);
  });
});
