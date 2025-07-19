describe('Message Load Error Handling', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/channels/get-channel-groups-list/**',   { body: [] }).as('getGroups');
    cy.intercept('GET', '**/channels/get-channels-list/**', {
      body: [{ id: 1, name: 'General', description: '', channel_type: 'text', created_at: '', group: null }]
    }).as('getChannels');
    cy.intercept('GET', '**/api/chats/chats/?channel=1*', { statusCode: 500 }).as('getMessagesError');
  });

  it('alerts the user when initial messages fail to load', () => {
    const alertStub = cy.stub();
    cy.on('window:alert', alertStub);
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
    cy.wait('@getMessagesError').then(() => {
      expect(alertStub).to.have.been.calledWith(
        'Failed to load messages for the selected channel.'
      );
    });
  });
});
