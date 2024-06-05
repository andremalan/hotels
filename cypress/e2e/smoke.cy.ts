describe("smoke tests", () => {
  it("should return a list of hotels", () => {
    cy.request("/refresh").then(() => {
      cy.request("/hotels").then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.length(1);
      });
    });
  });
});
