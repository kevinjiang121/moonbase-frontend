describe('Protected Routes', () => {
  it('redirects unauthenticated users from /home-page to /login', () => {
    cy.visit('/home-page');
    cy.url().should('include', '/login');
  });
});
