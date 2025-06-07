describe('Landing Page', () => {
  it('loads the landing page and verifies the title', () => {
    cy.visit('/');
    cy.title().should('equal', 'Moonbase');
    cy.get('app-root').should('exist');
  });
});







