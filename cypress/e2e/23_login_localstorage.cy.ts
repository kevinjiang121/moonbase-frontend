describe('Login LocalStorage', () => {
  it('stores authToken and currentUser after successful login', () => {
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
    cy.window().then(win => {
      expect(win.localStorage.getItem('authToken')).to.equal('dummy-token');
      const storedUser = JSON.parse(win.localStorage.getItem('currentUser')!);
      expect(storedUser).to.deep.equal({
        user_id: 1,
        username: 'testuser',
        email: 'test@test.com'
      });
    });
  });
});
