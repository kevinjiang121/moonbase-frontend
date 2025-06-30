describe('Signup Form Validation', () => {
  beforeEach(() => {
    cy.visit('/signup');
  });

  it('shows an error if passwords do not match', () => {
    cy.get('input[placeholder="Username"]').type('user1');
    cy.get('input[placeholder="Email"]').type('user1@example.com');
    cy.get('input[placeholder="Password"]').type('password123');
    cy.get('input[placeholder="Confirm Password"]').type('different123');
    cy.contains('button', /sign up/i).click();
    cy.contains('Passwords do not match!')
      .should('be.visible')
      .and('have.class', 'error');
  });

  it('shows an error for an invalid email address', () => {
    cy.get('input[placeholder="Username"]').type('user2');
    cy.get('input[placeholder="Email"]').type('not-an-email');
    cy.get('input[placeholder="Password"]').type('password123');
    cy.get('input[placeholder="Confirm Password"]').type('password123');
    cy.contains('button', /sign up/i).click();
    cy.contains('Invalid email address!')
      .should('be.visible')
      .and('have.class', 'error');
  });
});
