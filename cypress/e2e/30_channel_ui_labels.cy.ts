describe('Channel UI Labels', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/channels/get-channel-groups-list/**', {
      body: [{ id: 1, name: 'TestGroup', description: 'desc', created_at: '' }]
    }).as('getGroups');
    cy.intercept('GET', '**/channels/get-channels-list/**', {
      body: [
        { id: 10, name: 'UngroupedChannel', description: '', channel_type: 'text', created_at: '', group: null },
        { id: 11, name: 'GroupedChannel', description: '', channel_type: 'text', created_at: '', group: 1 }
      ]
    }).as('getChannels');
    cy.intercept('GET', '**/chats/chats/**', { body: [] }).as('getMessages');
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

  it('shows the "Channels" heading and the group name', () => {
    cy.get('.ungrouped-section h3').contains('Channels').should('be.visible');
    cy.get('.ungrouped-section').contains('UngroupedChannel').should('be.visible');
    cy.get('.group-row .group-btn').contains('TestGroup').should('be.visible');
    cy.get('.group-row .group-btn').click();
    cy.get('.channel-btn.indented').contains('GroupedChannel').should('be.visible');
  });
});
