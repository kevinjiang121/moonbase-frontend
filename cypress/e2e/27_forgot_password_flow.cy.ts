describe('Forgot Password Flow', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/auth/forgot-password/**', {
      statusCode: 200,
      body: { message: 'Email sent' }
    }).as('forgotRequest');
    cy.visit('/forgot-password');
  });

  it('submits an email and shows a success message', () => {
    cy.get('input[type="email"], input[type="text"]')
      .type('user@example.com');
    cy.get('button').click();
    cy.wait('@forgotRequest');
    cy.contains(/email sent/i).should('be.visible');
  });
});
