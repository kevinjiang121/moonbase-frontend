describe('Chat Message Sending', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/channels/get-channel-groups-list/**', { body: [] }).as('getGroups');
    cy.intercept('GET', '**/channels/get-channels-list/**', {
      body: [
        { id: 10, name: 'TestChannel', description: '', channel_type: 'text', created_at: '', group: null }
      ]
    }).as('getChannels');
    cy.intercept('GET', '**/chats/chats/**', { body: [] }).as('getMessages');
    cy.intercept('POST', '**/chats/chats/**', { statusCode: 201 }).as('postMessage');
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

  it('sends a message and displays it in the chat window', () => {
    cy.get('.channel-btn').contains('TestChannel').click();
    cy.get('.chat-input input[placeholder="Type a message..."]')
      .type('Hello Cypress!{enter}');
    cy.wait('@postMessage')
      .its('request.body')
      .should('deep.equal', { message: 'Hello Cypress!' });
    cy.get('.message-body').contains('Hello Cypress!').should('be.visible');
  });
});
