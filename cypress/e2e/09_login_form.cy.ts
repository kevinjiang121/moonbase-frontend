describe('Login Form', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('renders login heading, inputs, and button', () => {
    cy.get('.login-box').within(() => {
      cy.get('h2').contains(/^login$/i).should('exist');
      cy.get('input[placeholder="Username"]').should('exist');
      cy.get('input[placeholder="Password"]').should('exist');
      cy.get('button.btn').contains(/^login$/i).should('exist');
    });
  });
});