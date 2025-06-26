describe('Protected Routes', () => {
  it('redirects unauthenticated users from /home-page to /login', () => {
    cy.clearLocalStorage('authToken');
    cy.visit('/home-page', { failOnStatusCode: false });
    cy.url().should('include', '/login');
  });
});
