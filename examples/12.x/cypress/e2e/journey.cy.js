describe("cy.startVitalsCapture() and cy.reportVitals() journey", () => {
  it("should meet the custom provided Web Vitals thresholds including INP", () => {
    cy.startVitalsCapture({
      url: "https://www.google.com/",
    });

    // Handle CI vs local having differences in whether cookie banner is
    // present (the problem with testing against a site you don't own!)
    cy.get("body")
      .then(($body) => {
        const $button = $body.find("button:contains('Accept all')");

        return $button.length
          ? cy.wrap($button, { log: false }).realClick()
          : cy.wrap($button, { log: false });
      })
      .should("not.be.visible");

    cy.findByRole("button", { name: "Google apps" }).realClick();
    cy.findByText("Gmail").should("be.visible");
    cy.findByRole("button", { name: "Google apps" }).realClick();
    cy.findByRole("combobox", { name: "Search" }).realClick().realClick();
    cy.findByRole("listbox").should("be.visible");

    cy.reportVitals({
      thresholds: {
        lcp: 2500,
        fid: 100,
        cls: 0.1,
        fcp: 1800,
        ttfb: 600,
        // Google doesn't pass their own Good consistently
        inp: 500,
      },
    });
  });
});
