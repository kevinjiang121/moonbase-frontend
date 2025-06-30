describe('Channel Group Toggle', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/channels/get-channel-groups-list/**', {
      body: [
        { id: 1, name: 'TestGroup', description: 'desc', created_at: '' }
      ]
    }).as('getGroups');

    cy.intercept('GET', '**/channels/get-channels-list/**', {
      body: [
        { id: 2, name: 'ChildChannel', description: '', channel_type: 'text', created_at: '', group: 1 }
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

  it('expands and collapses channel group correctly', () => {
    cy.get('.channel-btn.indented').should('not.exist');
    cy.get('.group-btn').contains('TestGroup').click();
    cy.get('.icon').should('have.class', 'expanded');
    cy.get('.channel-btn.indented').contains('ChildChannel').should('be.visible');
    cy.get('.group-btn').contains('TestGroup').click();
    cy.get('.channel-btn.indented').should('not.exist');
  });
});
