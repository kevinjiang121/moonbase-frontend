describe('Message Input Clearing on Send', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/channels/get-channel-groups-list/**',   { body: [] }).as('getGroups');
    cy.intercept('GET', '**/channels/get-channels-list/**', {
      body: [{ id: 10, name: 'TestChannel', description: '', channel_type: 'text', created_at: '', group: null }]
    }).as('getChannels');
    cy.intercept('GET', '**/api/chats/chats/?channel=10*', { body: [] }).as('getMessages');
    cy.visit('/home-page', {
      onBeforeLoad(win) {
        (win as any).lastWS = null;
        (win as any).lastSentMessage = null;

        class FakeWebSocket {
          static OPEN = 1;
          readyState = FakeWebSocket.OPEN;
          onopen = () => {};
          onmessage = (_: any) => {};
          constructor() {
            (win as any).lastWS = this;
            setTimeout(() => this.onopen(), 0);
          }
          send(data: string) {
            (win as any).lastSentMessage = data;
          }
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

    cy.wait(['@getGroups', '@getChannels', '@getMessages']);
  });

  it('clears the input after sending a message', () => {
    cy.get('.channel-btn').contains('TestChannel').click();
    cy.wait('@getMessages');
    const testMsg = 'ClearTest message';
    cy.get('.chat-input input[placeholder="Type a message..."]')
      .type(`${testMsg}{enter}`);

    cy.window()
      .its('lastSentMessage')
      .should('contain', `"message":"${testMsg}"`);
    cy.get('.chat-input input[placeholder="Type a message..."]')
      .should('have.value', '');
  });
});
