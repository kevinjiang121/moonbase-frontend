describe('No Message Display Before Server Echo', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/channels/get-channel-groups-list/**',   { body: [] }).as('getGroups');
    cy.intercept('GET', '**/channels/get-channels-list/**', {
      body: [
        { id: 10, name: 'TestChannel', description: '', channel_type: 'text', created_at: '', group: null }
      ]
    }).as('getChannels');
    cy.intercept('GET', '**/api/chats/chats/?channel=1*', { body: [] }).as('getMessagesCh1');
    cy.intercept('GET', '**/api/chats/chats/?channel=10*', { body: [] }).as('getMessagesCh10');
    cy.visit('/home-page', {
      onBeforeLoad(win) {
        (win as any).lastWS = null;

        class FakeWebSocket {
          static OPEN = 1;
          readyState = FakeWebSocket.OPEN;
          onopen = () => {};
          onmessage = (_: any) => {};
          constructor() {
            (win as any).lastWS = this;
            setTimeout(() => this.onopen(), 0);
          }
          send() {}
          close() {}
          addEventListener(type: string, fn: any) {
            if (type === 'open')    this.onopen = fn;
            if (type === 'message') this.onmessage = fn;
          }
        }

        win.WebSocket = FakeWebSocket as any;

        win.localStorage.setItem('authToken', 'dummy-token');
        win.localStorage.setItem(
          'currentUser',
          JSON.stringify({ user_id: 1, username: 'test', email: 'test@test.com' })
        );
      }
    });

    cy.wait(['@getGroups', '@getChannels', '@getMessagesCh1']);
  });

  it('does not render the sent message until the server echoes it back', () => {
    cy.get('.channel-btn').contains('TestChannel').click();
    cy.wait('@getMessagesCh10');
    cy.get('.chat-input input[placeholder="Type a message..."]')
      .type('Delayed display test{enter}');
    cy.get('.message-body').should('not.exist');
    cy.window().then(win => {
      const ws = (win as any).lastWS;
      ws.onmessage({
        data: JSON.stringify({
          user_id:   1,
          username: 'test',
          message:  'Delayed display test',
          sent_at:  new Date().toISOString()
        })
      });
    });

    cy.get('.message-body', { timeout: 5000 })
      .should('have.length', 1)
      .and('contain.text', 'Delayed display test');
  });
});
