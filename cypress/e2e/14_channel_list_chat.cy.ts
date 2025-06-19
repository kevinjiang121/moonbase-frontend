describe('Channel List and Chat Interaction', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/channels/get-channel-groups-list/**', { body: [] }).as('getGroups');
    cy.intercept('GET', '**/channels/get-channels-list/**', {
      body: [
        { id: 10, name: 'TestChannel', description: '', channel_type: 'text', created_at: '', group: null }
      ]
    }).as('getChannels');
    cy.intercept('GET', '**/chats/chats/**', { body: [] }).as('getMessages');
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

  it('displays the channel list and opens chat input when a channel is selected', () => {
    cy.wait('@getGroups');
    cy.wait('@getChannels');
    cy.get('.channel-display').contains('TestChannel').should('be.visible');
    cy.get('.channel-btn').contains('TestChannel').click();
    cy.wait('@getMessages');
    cy.get('.chat-input input[placeholder="Type a message..."]').should('exist');
  });
});
