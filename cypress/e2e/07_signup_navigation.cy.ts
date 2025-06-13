describe('Signup Page Navigation', () => {
  beforeEach(() => {
    cy.visit('/signup');
  });

  it('navigates to login when "Login" link is clicked', () => {
    cy.get('.signup-box .login-link a')
      .click();
    cy.url().should('include', '/login');
  });
});
