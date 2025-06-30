describe('Login Failure Handling', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/auth/login/**', {
      statusCode: 401,
      body: { detail: 'Invalid credentials' }
    }).as('loginFail');

    cy.visit('/login');
  });

  it('displays an error message on failed login', () => {
    cy.get('.login-box input[placeholder="Username"]')
      .type('wronguser');
    cy.get('.login-box input[placeholder="Password"]')
      .type('wrongpass');
    cy.get('.login-box button').contains(/^login$/i).click();

    cy.wait('@loginFail');
    cy.get('.login-box')
      .contains(/invalid credentials/i)
      .should('be.visible');
  });
});
