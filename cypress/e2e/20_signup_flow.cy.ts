describe('Signup Flow with Redirect Delay', () => {
  it('shows success message then redirects after 1.5s', () => {
    cy.intercept('POST', '**/auth/signup/**', { statusCode: 201 }).as('signupRequest');
    cy.clock();
    cy.visit('/signup');
    cy.get('input[placeholder="Username"]').type('newuser');
    cy.get('input[placeholder="Email"]').type('newuser@example.com');
    cy.get('input[placeholder="Password"]').type('Password123!');
    cy.get('input[placeholder="Confirm Password"]').type('Password123!');
    cy.contains('button', /sign up/i).click();
    cy.wait('@signupRequest');
    cy.contains('Signup successful! Redirecting to login...').should('be.visible');
    cy.tick(1500);
    cy.url().should('include', '/login');
  });
});
