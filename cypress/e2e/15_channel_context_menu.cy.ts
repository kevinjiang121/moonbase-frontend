describe('Channel Context Menu', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/channels/get-channel-groups-list/**', { body: [] }).as('getGroups');
    cy.intercept('GET', '**/channels/get-channels-list/**', { body: [] }).as('getChannels');
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
  });

  it('opens the main context menu and displays create options, then shows the create-category form', () => {
    cy.get('.channel-display').rightclick();
    cy.get('.context-menu .menu-item')
      .contains('Create Channel')
      .should('be.visible');
    cy.get('.context-menu .menu-item')
      .contains('Create Category')
      .should('be.visible');
    cy.get('.context-menu .menu-item')
      .contains('Create Category')
      .click();
    cy.get('.context-menu input[placeholder="Enter category name"]')
      .should('be.visible');
    cy.get('.context-menu input[placeholder="Enter description"]')
      .should('be.visible');
  });
});
