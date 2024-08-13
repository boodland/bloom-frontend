import { getLocalePageUrl } from '../support/utils';

const welcomePageUrl = '/welcome';
const invalidPartnerPageUrl = `${welcomePageUrl}/invalid-partner`;
const coursesPageUrl = getLocalePageUrl('courses');

describe('Welcome page should', () => {
  before(() => {
    cy.cleanUpTestState();
  });

  describe('Redirect to courses page', () => {
    it('for a non-logged in user visiting page without partner', () => {
      cy.visit(welcomePageUrl);
      cy.url().should('be.equal', coursesPageUrl);
    });
    describe('for a public logged in user', () => {
      before(() => {
        cy.cleanUpTestState();
        cy.logInWithEmailAndPassword(Cypress.env('public_email'), Cypress.env('public_password'));
      });
      it('visiting page without partner', () => {
        cy.visit(welcomePageUrl);
        cy.url().should('be.equal', coursesPageUrl);
      });
      after(() => {
        cy.logout();
      });
    });
  });

  it('Display not found page for an invalid partner', () => {
    cy.visit(invalidPartnerPageUrl, { failOnStatusCode: false });
    cy.get('p', { timeout: 10000 }).contains('This page could not be found');
  });
});
