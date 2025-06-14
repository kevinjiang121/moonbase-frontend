describe('Reset Password Page', () => {
  beforeEach(() => {
    cy.visit('/reset-password');
  });

  it('renders two password fields and a reset button', () => {
    cy.get('input[type="password"]').should('have.length.at.least', 2);
    cy.get('button')
      .contains(/reset password/i)
      .should('exist');
  });

  it('allows typing into both password fields', () => {
    const newPass = 'NewPass123!';
    const confirmPass = 'NewPass123!';

    cy.get('input[type="password"]').first()
      .type(newPass)
      .should('have.value', newPass);

    cy.get('input[type="password"]').last()
      .type(confirmPass)
      .should('have.value', confirmPass);
  });
});