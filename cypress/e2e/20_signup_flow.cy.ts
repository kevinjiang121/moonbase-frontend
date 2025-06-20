describe('Signup Flow', () => {
  it('submits the signup form and redirects to login', () => {
    cy.intercept('POST', '**/auth/signup/', {
      statusCode: 201,
      body: { message: 'User created' }
    }).as('signupRequest');
    cy.visit('/signup');
    cy.get('input[placeholder="Username"]').type('newuser');
    cy.get('input[placeholder="Email"]').type('newuser@example.com');
    cy.get('input[placeholder="Password"]').type('Password123!');
    cy.get('button').contains(/sign up/i).click();
    cy.wait('@signupRequest').its('request.body').should('deep.equal', {
      username: 'newuser',
      email: 'newuser@example.com',
      password: 'Password123!'
    });
    cy.url().should('include', '/login');
  });
});







