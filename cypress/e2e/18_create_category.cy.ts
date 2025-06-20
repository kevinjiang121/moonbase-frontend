describe('Channel Category Creation', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/channels/get-channel-groups-list/**', { body: [] }).as('getGroups');
    cy.intercept('GET', '**/channels/get-channels-list/**',       { body: [] }).as('getChannels');
    cy.intercept('GET', '**/chats/chats/**',                      { body: [] }).as('getMessages');
    cy.intercept('POST', '**/channels/create-channel-group/**', { statusCode: 201 }).as('createCategory');
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

  it('creates a new category via the context menu', () => {
    cy.get('.channel-display').rightclick();
    cy.contains('.context-menu .menu-item', 'Create Category').click();
    cy.get('.context-menu input[placeholder="Enter category name"]')
      .type('NewCategory');
    cy.get('.context-menu input[placeholder="Enter description"]')
      .type('Category description');
    cy.contains('.context-menu button', 'Create').click();
    cy.wait('@createCategory')
      .its('request.body')
      .should('deep.equal', {
        name: 'NewCategory',
        description: 'Category description'
      });
  });
});
