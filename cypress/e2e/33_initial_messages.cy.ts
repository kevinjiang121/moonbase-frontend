describe('Initial Message Loading', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/channels/get-channel-groups-list/**',   { body: [] }).as('getGroups');
    cy.intercept('GET', '**/channels/get-channels-list/**', {
      body: [{ id: 1, name: 'General', description: '', channel_type: 'text', created_at: '', group: null }]
    }).as('getChannels');

    cy.intercept(
      'GET',
      '**/api/chats/chats/?channel=1*',
      {
        body: [
          {
            id:       100,
            channel:  1,
            author:   2,
            content:  'First message',
            sent_at:  '2025-07-14T12:00:00Z',
            username: 'Alice'
          },
          {
            id:       101,
            channel:  1,
            author:   3,
            content:  'Second message',
            sent_at:  '2025-07-14T12:05:00Z',
            username: 'Bob'
          }
        ]
      }
    ).as('getInitialMessages');

    cy.visit('/home-page', {
      onBeforeLoad(win) {
        win.localStorage.setItem('authToken', 'dummy-token');
        win.localStorage.setItem(
          'currentUser',
          JSON.stringify({ user_id: 1, username: 'test', email: 'test@test.com' })
        );
      }
    });
    cy.wait(['@getGroups', '@getChannels', '@getInitialMessages']);
  });

  it('renders stubbed messages in order with username, timestamp, and body', () => {
    cy.get('.chat-window .message').should('have.length', 2);

    cy.get('.chat-window .message').first().within(() => {
      cy.get('.message-username strong').should('contain.text', 'Alice');
      cy.get('.timestamp').invoke('text')
        .should('match', /\d{1,2}\/\d{1,2}\/\d{2}, \d{1,2}:\d{2} [AP]M/);
      cy.get('.message-body').should('contain.text', 'First message');
    });

    cy.get('.chat-window .message').eq(1).within(() => {
      cy.get('.message-username strong').should('contain.text', 'Bob');
      cy.get('.timestamp').invoke('text')
        .should('match', /\d{1,2}\/\d{1,2}\/\d{2}, \d{1,2}:\d{2} [AP]M/);
      cy.get('.message-body').should('contain.text', 'Second message');
    });
  });
});
