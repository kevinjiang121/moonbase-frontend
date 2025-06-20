describe('Context Menu Dismissal', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/channels/get-channel-groups-list/**', { body: [] }).as('getGroups');
    cy.intercept('GET', '**/channels/get-channels-list/**',       { body: [] }).as('getChannels');
    cy.intercept('GET', '**/chats/chats/**',                      { body: [] }).as('getMessages');
    cy.visit('/home-page', {
      onBeforeLoad(win) {
        win.localStorage.setItem('authToken', 'dummy-token');
        win.localStorage.setItem(
          'currentUser',
          JSON.stringify({ user_id: 1, username: 'test', email: 'test@test.com' })
        );
      }
    });
    cy.wait('@getGroups');
    cy.wait('@getChannels');
    cy.wait('@getMessages');
  });

  it('closes the context menu when clicking outside of it', () => {
    cy.get('.channel-display').rightclick();
    cy.get('.context-menu').should('be.visible');
    cy.get('body').click(0, 0);
    cy.get('.context-menu').should('not.exist');
  });
});
