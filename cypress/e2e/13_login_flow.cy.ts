describe('Login Flow', () => {
  it('logs in successfully and redirects to home-page', () => {
    cy.intercept('POST', '**/auth/login/', {
      statusCode: 200,
      body: {
        access_token: 'dummy-token',
        user: { user_id: 1, username: 'testuser', email: 'test@test.com' }
      }
    }).as('loginRequest');
    cy.visit('/login');
    cy.get('.login-box input[placeholder="Username"]').type('testuser');
    cy.get('.login-box input[placeholder="Password"]').type('password123');
    cy.get('.login-box button').contains(/^login$/i).click();
    cy.wait('@loginRequest');
    cy.url().should('include', '/home-page');
  });
});
