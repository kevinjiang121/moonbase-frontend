describe('WebSocket Incoming Message', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/channels/get-channel-groups-list/**',   { body: [] }).as('getGroups');
    cy.intercept('GET', '**/channels/get-channels-list/**', {
      body: [{ id: 10, name: 'TestChannel', description: '', channel_type: 'text', created_at: '', group: null }]
    }).as('getChannels');
    cy.intercept('GET', '**/api/chats/chats/?channel=10*', { body: [] }).as('getMessages');
    cy.visit('/home-page', {
      onBeforeLoad(win) {
        (win as any).lastWS = null;

        class FakeWebSocket {
          static OPEN = 1;
          onopen: (() => void) | null = null;
          onmessage: ((ev: { data: string }) => void) | null = null;
          readyState = FakeWebSocket.OPEN;

          constructor(url: string) {
            (win as any).lastWS = this;
            setTimeout(() => this.onopen?.(), 0);
          }

          send(_data: string) { }
          close() {}
          addEventListener(type: string, fn: any) {
            if (type === 'open') this.onopen = fn;
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
    cy.wait('@getGroups');
    cy.wait('@getChannels');
    cy.wait('@getMessages');
  });

  it('renders a message when server pushes via WebSocket', () => {
    cy.get('.channel-btn').contains('TestChannel').click();
    cy.wait('@getMessages');
    cy.window().then(win => {
      const ws = (win as any).lastWS;
      const serverPayload = JSON.stringify({
        user_id:   2,
        username: 'ServerUser',
        message:  'Hello from server',
        sent_at:  new Date().toISOString()
      });
      ws.onmessage?.({ data: serverPayload });
    });

    cy.get('.message-body', { timeout: 5000 })
      .should('have.length', 1)
      .and('contain.text', 'Hello from server');
  });
});
