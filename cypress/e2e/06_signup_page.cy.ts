describe('Signup Page', () => {
  beforeEach(() => {
    cy.visit('/signup');
  });

  it('renders username, email, and password fields and a Sign Up button', () => {
    cy.get('.signup-box input[placeholder="Username"]').should('exist');
    cy.get('.signup-box input[placeholder="Email"]').should('exist');
    cy.get('.signup-box input[placeholder="Password"]').should('exist');
    cy.get('.signup-box button')
      .contains(/sign up/i)
      .should('exist');
  });
});