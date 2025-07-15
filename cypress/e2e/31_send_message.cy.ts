describe('Chat Message Sending via WebSocket', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/channels/get-channel-groups-list/**',   { body: [] }).as('getGroups');
    cy.intercept('GET', '**/channels/get-channels-list/**', {
      body: [{ id: 10, name: 'TestChannel', description: '', channel_type: 'text', created_at: '', group: null }]
    }).as('getChannels');
    cy.intercept('GET', '**/api/chats/chats/**', { body: [] }).as('getMessages');

    cy.visit('/home-page', {
      onBeforeLoad(win) {
        class FakeWebSocket {
          static OPEN = 1;
          onopen: ((ev: any) => void) | null = null;
          onmessage: ((ev: { data: string }) => void) | null = null;
          readyState = FakeWebSocket.OPEN;

          constructor(url: string) {
            setTimeout(() => this.onopen?.({}), 0);
          }

          send(data: string) {
            (win as any).lastSentMessage = data;
            const parsed = JSON.parse(data);
            const reply = {
              user_id: parsed.user_id,
              username: 'test',
              message: parsed.message,
              sent_at: new Date().toISOString()
            };
            setTimeout(() => this.onmessage?.({ data: JSON.stringify(reply) }), 0);
          }

          close() {}
        }
        win.WebSocket = FakeWebSocket as any;
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

  it('sends a message over WebSocket and renders it in the chat window', () => {
    cy.get('.channel-btn').contains('TestChannel').click();
    cy.get('.chat-input input[placeholder="Type a message..."]')
      .type('Hello WS!{enter}');

    cy.window().its('lastSentMessage')
      .should('include', '"message":"Hello WS!"')
      .and('include', '"user_id":1');

    cy.get('.message-body', { timeout: 10000 })
      .should('be.visible')
      .and('contain.text', 'Hello WS!');
  });
});
