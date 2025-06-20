describe('Channel Category Deletion', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/channels/get-channel-groups-list/**', {
      body: [
        { id: 100, name: 'TestGroup', description: 'Desc', created_at: '', }
      ]
    }).as('getGroups');
    cy.intercept('GET', '**/channels/get-channels-list/**', { body: [] }).as('getChannels');
    cy.intercept('GET', '**/chats/chats/**', { body: [] }).as('getMessages');
    cy.intercept('DELETE', '**/channels/delete-channel-group/100/**', {
      statusCode: 204
    }).as('deleteCategory');
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

  it('deletes a channel group via the context menu', () => {
    cy.get('.group-row').contains('TestGroup').rightclick();
    cy.contains('.context-menu .menu-item', 'Delete Group').should('be.visible').click();
    cy.wait('@deleteCategory')
      .its('request.url')
      .should('include', '/delete-channel-group/100/');
  });
});
