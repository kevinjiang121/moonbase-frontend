describe('Channel Creation & Deletion via Context Menu', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/channels/get-channel-groups-list/**', { body: [] }).as('getGroups');
    cy.intercept('GET', '**/channels/get-channels-list/**', { body: [] }).as('getChannels');
    cy.intercept('POST', '**/channels/create-channel/**', { statusCode: 201 }).as('createChannel');
    cy.intercept('DELETE', '**/channels/delete-channel/**', { statusCode: 204 }).as('deleteChannel');
    cy.visit('/home-page', {
      onBeforeLoad(win) {
        win.localStorage.setItem('authToken', 'dummy-token');
        win.localStorage.setItem(
          'currentUser',
          JSON.stringify({ user_id: 1, username: 'test', email: 'test@example.com' })
        );
      }
    });

    cy.wait('@getGroups');
    cy.wait('@getChannels');
  });

  it('creates a new channel via the create-channel context menu', () => {
    cy.get('.channel-display').rightclick();
    cy.get('.context-menu .menu-item').contains('Create Channel').click();
    cy.get('.context-menu input[placeholder="Enter channel name"]').type('NewChannel');
    cy.get('.context-menu input[placeholder="Enter description"]').type('A test channel');
    cy.get('.context-menu button').contains('Create').click();
    cy.wait('@createChannel').its('request.body').should('deep.include', {
      name: 'NewChannel',
      description: 'A test channel'
    });
  });

  it('deletes an existing channel via the delete-channel context menu', () => {
    cy.intercept('GET', '**/channels/get-channels-list/**', {
      body: [
        { id: 42, name: 'DeleteMe', description: '', channel_type: 'text', created_at: '', group: null }
      ]
    }).as('getChannelsOne');

    cy.reload();
    cy.wait('@getGroups');
    cy.wait('@getChannelsOne');
    cy.get('.channel-btn').contains('DeleteMe').rightclick();
    cy.get('.context-menu .menu-item').contains('Delete Channel').click();
    cy.get('.context-menu .menu-item').contains('Delete Channel').click();
    cy.wait('@deleteChannel').its('request.url').should('include', '/delete-channel/42/');
  });
});
