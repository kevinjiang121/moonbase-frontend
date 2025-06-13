describe('Forgot Password Page', () => {
  beforeEach(() => {
    cy.visit('/forgot-password');
  });

  it('shows the forgot-password heading and an email/text input plus submit button', () => {
    cy.contains('h2', /forgot password/i).should('exist');
    cy.get('input[type="email"], input[type="text"]').should('exist');
    cy.get('button').should('exist');
  });
});