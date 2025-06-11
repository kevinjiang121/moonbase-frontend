describe('Landing Page Links', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('navigates to login when "Login" is clicked', () => {
    cy.contains(/^login$/i).click();
    cy.url().should('include', '/login');
  });

  it('navigates to signup when "Sign up" is clicked', () => {
    cy.contains(/sign up/i).click();
    cy.url().should('include', '/signup');
  });
});
