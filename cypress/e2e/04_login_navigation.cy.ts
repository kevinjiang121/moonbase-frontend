describe('Login Page Navigation', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('navigates to forgot-password when link is clicked', () => {
    cy.get('.login-box .forgot-password a')
      .click();
    cy.url().should('include', '/forgot-password');
  });

  it('navigates to signup when "Sign up" link is clicked', () => {
    cy.get('.login-box .signup-link a')
      .click();
    cy.url().should('include', '/signup');
  });
});
