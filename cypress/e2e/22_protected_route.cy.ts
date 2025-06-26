describe('Protected Routes', () => {
  it('redirects unauthenticated users from /home-page to /login', () => {
    // Ensure no auth token is present
    cy.clearLocalStorage('authToken');
    cy.visit('/home-page', { failOnStatusCode: false });
    cy.url().should('include', '/login');
  });
});
