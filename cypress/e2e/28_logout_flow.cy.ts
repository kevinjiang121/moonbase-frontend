describe('Logout Flow', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/auth/login/**', {
      statusCode: 200,
      body: {
        access_token: 'dummy-token',
        user: { user_id: 1, username: 'testuser', email: 'test@test.com' }
      }
    }).as('loginRequest');
    cy.intercept('GET', '**/channels/get-channel-groups-list/**', { body: [] }).as('getGroups');
    cy.intercept('GET', '**/channels/get-channels-list/**',       { body: [] }).as('getChannels');
    cy.intercept('GET', '**/chats/chats/**',                      { body: [] }).as('getMessages');
  });

  it('logs in, then logs out and redirects to landing page', () => {
    cy.visit('/login');
    cy.get('.login-box input[placeholder="Username"]').type('testuser');
    cy.get('.login-box input[placeholder="Password"]').type('password123');
    cy.get('.login-box button').contains(/login/i).click();
    cy.wait('@loginRequest');
    cy.location('pathname', { timeout: 10000 }).should('include', '/home-page');
    cy.wait('@getGroups');
    cy.wait('@getChannels');
    cy.wait('@getMessages');
    cy.get('.logoff-button', { timeout: 10000 }).should('be.visible').click();
    cy.window().then(win => {
      expect(win.localStorage.getItem('authToken')).to.be.null;
    });
    cy.location('pathname', { timeout: 10000 }).should('eq', '/login');
  });
});
