describe('Context Menu Cancellation', () => {
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

  it('closes the create-category form when clicking Cancel', () => {
    cy.get('.channel-display').rightclick();
    cy.contains('.context-menu .menu-item', 'Create Category').click();
    cy.get('.context-menu input[placeholder="Enter category name"]').should('be.visible');
    cy.contains('.context-menu button', 'Cancel').click();
    cy.get('.context-menu').should('not.exist');
  });
});
