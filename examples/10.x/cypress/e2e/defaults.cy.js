describe("cy.vitals() command using the defaults", () => {
  beforeEach(() => {
    cy.visit("https://www.google.com/");
  });

  it("should meet the web-vitals default thresholds", () => {
    cy.vitals();
  });
});
