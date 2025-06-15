describe('Unknown Route Handling', () => {
  it('redirects unknown URLs back to the landing page', () => {
    cy.visit('/this-route-does-not-exist', { failOnStatusCode: false });
    cy.url().should('eq', `${Cypress.config('baseUrl')}/`);
  });
});
