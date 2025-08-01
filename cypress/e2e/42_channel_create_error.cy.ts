describe('Channel Creation Error Handling', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/channels/get-channel-groups-list/**',   { body: [] }).as('getGroups');
    cy.intercept('GET', '**/channels/get-channels-list/**',         { body: [] }).as('getChannels');
    cy.intercept('GET', '**/api/chats/chats/?channel=1*',           { body: [] }).as('getMessagesCh1');
    cy.intercept('POST', '**/channels/create-channel/**',           { statusCode: 500 }).as('createChannelFail');

    cy.visit('/home-page', {
      onBeforeLoad(win) {
        win.localStorage.setItem('authToken', 'dummy-token');
        win.localStorage.setItem(
          'currentUser',
          JSON.stringify({ user_id: 1, username: 'test', email: 'test@test.com' })
        );
      }
    });

    cy.wait(['@getGroups', '@getChannels', '@getMessagesCh1']);
  });

  it('shows an error when channel creation fails', () => {
    const alertStub = cy.stub();
    cy.on('window:alert', alertStub);
    cy.get('.channel-display').rightclick();
    cy.contains('.context-menu .menu-item', 'Create Channel').click();
    cy.get('input[placeholder="Enter channel name"]').type('BadChannel');
    cy.get('input[placeholder="Enter description"]').type('ShouldFail');
    cy.contains('.context-menu button', 'Create').click();
    cy.wait('@createChannelFail').then(() => {
      expect(alertStub).to.have.been.calledWith('Failed to create channel.');
    });
    cy.get('.channel-btn').should('not.contain.text', 'BadChannel');
  });
});
