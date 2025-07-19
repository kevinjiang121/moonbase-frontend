describe('Chat Auto‑Scroll on New Message', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/channels/get-channel-groups-list/**', { body: [] }).as('getGroups');
    cy.intercept('GET', '**/channels/get-channels-list/**', {
      body: [
        { id: 1, name: 'General', description: '', channel_type: 'text', created_at: '', group: null }
      ]
    }).as('getChannels');
    const initialMessages = Array.from({ length: 20 }, (_, i) => ({
      id:       i + 1,
      channel:  1,
      author:   1,
      content:  `Message ${i + 1}`,
      sent_at:  '2025-07-15T10:00:00Z',
      username: 'User'
    }));
    cy.intercept('GET', '**/api/chats/chats/?channel=1*', { body: initialMessages }).as('getInitialMessages');
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
    cy.wait(['@getGroups', '@getChannels', '@getInitialMessages']);
  });

  it('scrolls the messages container to bottom when a new message arrives', () => {
    cy.get('.messages').then($el => {
      Object.defineProperty($el[0], 'scrollHeight', { get: () => 1000 });
      Object.defineProperty($el[0], 'clientHeight', { get: () => 300 });
      $el[0].scrollTop = 0;
    });
    cy.window().then(win => {
      const ws = (win as any).lastWS;
      const payload = JSON.stringify({
        user_id:   2,
        username: 'ServerUser',
        message:  'Newest message',
        sent_at:  new Date().toISOString()
      });
      ws.onmessage?.({ data: payload });
    });
    cy.wait(100);
    cy.get('.messages').then($el => {
      expect($el[0].scrollTop).to.equal(1000);
    });
  });
});
