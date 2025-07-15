describe('Channel Switching', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/channels/get-channel-groups-list/**', { body: [] }).as('getGroups');
    cy.intercept('GET', '**/channels/get-channels-list/**', {
      body: [
        { id: 10, name: 'ChannelOne',   description: '', channel_type: 'text', created_at: '', group: null },
        { id: 20, name: 'ChannelTwo',   description: '', channel_type: 'text', created_at: '', group: null }
      ]
    }).as('getChannels');
    cy.intercept('GET', '**/api/chats/chats/?channel=1*', { body: [] }).as('getMessagesCh1');
    cy.intercept('GET', '**/api/chats/chats/?channel=10*', {
      body: [{
        id:       1,
        channel:  10,
        author:   1,
        content:  'Hello from One',
        sent_at:  '2025-07-15T19:00:00Z',
        username: 'Alice'
      }]
    }).as('getMessagesCh10');

    cy.intercept('GET', '**/api/chats/chats/?channel=20*', {
      body: [{
        id:       2,
        channel:  20,
        author:   2,
        content:  'Hello from Two',
        sent_at:  '2025-07-15T19:05:00Z',
        username: 'Bob'
      }]
    }).as('getMessagesCh20');
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

  it('loads ChannelOne then switches to ChannelTwo', () => {
    cy.get('.channel-btn').contains('ChannelOne').click();
    cy.wait('@getMessagesCh10');
    cy.get('.message-body')
      .should('have.length', 1)
      .and('contain.text', 'Hello from One');

    cy.get('.channel-btn').contains('ChannelTwo').click();
    cy.wait('@getMessagesCh20');
    cy.get('.message-body')
      .should('have.length', 1)
      .and('contain.text', 'Hello from Two')
      .and('not.contain', 'Hello from One');
  });
});
