describe('Signup Page Interactions', () => {
  beforeEach(() => {
    cy.visit('/signup');
  });

  it('renders the expected inputs and button', () => {
    cy.get('input[placeholder="Username"]').should('exist');
    cy.get('input[placeholder="Email"]').should('exist');
    cy.get('input[placeholder="Password"]').should('exist');
    cy.get('button').contains(/sign up/i).should('exist');
  });

  it('allows typing into all fields', () => {
    cy.get('input[placeholder="Username"]')
      .type('newuser')
      .should('have.value', 'newuser');

    cy.get('input[placeholder="Email"]')
      .type('newuser@example.com')
      .should('have.value', 'newuser@example.com');

    cy.get('input[placeholder="Password"]')
      .type('SuperSecret123')
      .should('have.value', 'SuperSecret123');
  });
});
