describe('Home Page Layout', () => {
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

  it('renders header, channel list, chat input, and footer', () => {
    cy.get('app-header').should('exist');
    cy.get('.channel-display').should('exist');
    cy.get('.chat-input input[placeholder="Type a message..."]').should('exist');
    cy.get('app-footer').should('exist');
  });
});
