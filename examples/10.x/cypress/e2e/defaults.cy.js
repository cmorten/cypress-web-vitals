describe("cy.vitals() command using the defaults", () => {
  beforeEach(() => {
    cy.visit("https://www.google.com/");
  });

  it("should meet the Web Vitals default thresholds", () => {
    cy.vitals();
  });
});
