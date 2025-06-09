describe('Login Page', () => {
  it('should display email and password inputs and a login button', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').should('exist');
    cy.get('input[type="password"]').should('exist');
    cy.get('button[type="submit"]')
      .contains(/^login$/i)
      .should('exist');
  });
});