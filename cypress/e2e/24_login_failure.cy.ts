describe('Login Failure Handling', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/auth/login/**', {
      statusCode: 401,
      body: {}
    }).as('loginFail');

    cy.visit('/login');
  });

  it('shows the fallback “Login failed” message and stays on /login', () => {
    cy.get('.login-box input[placeholder="Username"]').type('wronguser');
    cy.get('.login-box input[placeholder="Password"]').type('wrongpass');
    cy.get('.login-box button').contains(/^login$/i).click();
    cy.wait('@loginFail');
    cy.contains('.login-box', /login failed/i).should('be.visible');
    cy.url().should('include', '/login');
  });
});
