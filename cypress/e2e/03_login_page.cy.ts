describe('Login Page Interactions', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('allows typing into username and password fields', () => {
    cy.get('.login-box input[placeholder="Username"]')
      .type('testuser')
      .should('have.value', 'testuser');

    cy.get('.login-box input[placeholder="Password"]')
      .type('P@ssw0rd123')
      .should('have.value', 'P@ssw0rd123');
  });

  it('has working navigation links for forgot-password and sign-up', () => {
    cy.get('.login-box .forgot-password a')
      .should('have.attr', 'href')
      .and('include', '/forgot-password');

    cy.get('.login-box .signup-link a')
      .should('have.attr', 'href')
      .and('include', '/signup');
  });
});
