describe('Logout Flow', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/channels/get-channel-groups-list/**', { body: [] });
    cy.intercept('GET', '**/channels/get-channels-list/**',       { body: [] });
    cy.intercept('GET', '**/chats/chats/**',                      { body: [] });
    cy.visit('/home-page', {
      onBeforeLoad(win) {
        win.localStorage.setItem('authToken', 'dummy-token');
        win.localStorage.setItem(
          'currentUser',
          JSON.stringify({ user_id: 1, username: 'test', email: 'test@test.com' })
        );
      }
    });
  });

  it('clears authToken and redirects to /login when Logout is clicked', () => {
    cy.contains('button', /logout/i).click();
    cy.url().should('include', '/login');
    cy.window().then(win => {
      expect(win.localStorage.getItem('authToken')).to.be.null;
    });
  });
});
