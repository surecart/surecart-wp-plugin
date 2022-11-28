/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

/**
 * Get a stripe card element.
 *
 * @example cy.getStripeCardElement('number').type('4242424242424242');
 */
Cypress.Commands.add('getStripeCardElement', fieldName => {
  if (Cypress.config('chromeWebSecurity')) {
    throw new Error('To get stripe element `chromeWebSecurity` must be disabled');
  }

  const selector = `.CardField-${fieldName} input:not([disabled])`;

  return cy.get('.StripeElement').find('iframe').its('0.contentDocument.body').should('not.be.empty').then(cy.wrap).find(selector);
});

Cypress.Commands.add('getStripePaymentElement', (fieldName, tag = 'input') => {
  if (Cypress.config('chromeWebSecurity')) {
    throw new Error('To get stripe element `chromeWebSecurity` must be disabled');
  }

  const selector = `[data-field=${fieldName}] ${tag}:not([disabled])`;

  return cy.get('.StripeElement').find('iframe').its('0.contentDocument.body').should('not.be.empty').then(cy.wrap).find(selector);
});

Cypress.Commands.add('getPayPalButton', fieldName => {
  if (Cypress.config('chromeWebSecurity')) {
    throw new Error('To get stripe element `chromeWebSecurity` must be disabled');
  }

  return cy
    .get('sc-paypal-buttons')
    .find('iframe.visible')
    .its('0.contentDocument.body')
    .should('not.be.empty')
    .should('not.be.undefined')
    .then(cy.wrap)
    .find(`div[data-funding-source="${fieldName}"]`)
    .last();
});
