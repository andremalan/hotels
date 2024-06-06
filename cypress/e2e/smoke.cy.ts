describe("smoke tests", () => {
  it("should return a list of hotels", () => {
    cy.request("/refresh").then(() => {
      cy.request("/hotels").then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.length(3);
      });
    });
  });
  it("should filter by hotel id", () => {
    cy.request("/refresh").then(() => {
      cy.request("/hotels?ids=iJhz,SjyX").then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.length(2);
        const ids = [response.body[0].id, response.body[1].id];
        expect(ids).to.have.members(["SjyX", "iJhz"]);
      });
    });
  });
  it("should filter by destination", () => {
    cy.request("/refresh").then(() => {
      cy.request("/hotels?destination=5432").then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.length(2);
        const ids = [response.body[0].id, response.body[1].id];
        expect(ids).to.have.members(["SjyX", "iJhz"]);
        expect(response.body[0].destination_id).to.eq(5432);
        expect(response.body[1].destination_id).to.eq(5432);
      });
    });
  });
});
