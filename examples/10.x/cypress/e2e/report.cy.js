const customThresholds = {
  lcp: 2500,
  fid: 100,
  cls: 0.1,
};

describe("cy.vitals() command not using the defaults", () => {
  it("should meet the custom provided web-vitals thresholds", () => {
    cy.vitals({
      url: "https://www.google.com/",
      thresholds: customThresholds,
      onReport(report) {
        expect(report.thresholds).to.equal(customThresholds);
        expect(report.results).to.have.property("lcp");
        expect(report.results).to.have.property("fid");
        expect(report.results).to.have.property("cls");
        expect(report.results).to.have.property("fcp");
        expect(report.results).to.have.property("ttfb");

        cy.log("------ onReport values ------");
        cy.log(JSON.stringify(report, undefined, 2));
        cy.log("-----------------------------");
      },
    });
  });
});
