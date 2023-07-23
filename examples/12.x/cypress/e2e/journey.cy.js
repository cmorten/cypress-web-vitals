describe("cy.startVitalsCapture() and cy.reportVitals() journey", () => {
  it("should meet the custom provided web-vitals thresholds including INP", () => {
    cy.startVitalsCapture({
      url: "https://www.google.com/",
    });

    cy.findByRole("button", { name: "Accept all" }).realClick();
    cy.findByRole("button", { name: "Google apps" }).realClick();
    cy.findByText("Gmail").should("be.visible");
    cy.findByRole("button", { name: "Google apps" }).realClick();
    cy.findByRole("combobox", { name: "Search" }).realClick();
    cy.findByRole("listbox").should("be.visible");

    cy.reportVitals({
      thresholds: {
        lcp: 2500,
        fid: 100,
        cls: 0.1,
        fcp: 1800,
        ttfb: 600,
        inp: 500,
      },
    });
  });
});
