/// <reference types="cypress" />

describe('Landing Page', () => {
  it('renders logo and navigation links', () => {
    cy.visit('http://localhost:4200/');

    cy.contains('h1', 'Moonbase').should('be.visible');

    cy.get('.bottom-box')
      .contains('Login')
      .should('have.attr', 'href', '/login');

    cy.get('.bottom-box')
      .contains('Sign Up')
      .should('have.attr', 'href', '/signup');
  });
});
