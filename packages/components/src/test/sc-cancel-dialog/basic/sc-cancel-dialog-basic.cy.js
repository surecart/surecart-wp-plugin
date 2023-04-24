describe('Cancel Dialog (basic) ', () => {
  it('Can cancel immediately', () => {
    cy.visit('/test/sc-cancel-dialog/basic/immediate.html');
    cy.get('sc-cancel-dialog').shadow().find('sc-subscription-cancel').shadow().find('sc-dashboard-module').as('inner');
    // should be immediate.
    cy.get('@inner').should('contain', 'immediately');

    cy.intercept('**//surecart/v1/subscriptions/subscription_id/cancel*', {
      id: 'test'
    }).as('cancel');

    // cancel.
    cy.get('@inner').find('sc-button[type=primary]').shadow()
    .find('.button')
    .should('not.have.class', 'button--loading')
    .click({ force: true, waitForAnimations: true, multiple: true });
  });
  it('Can cancel pending', () => {
    cy.visit('/test/sc-cancel-dialog/basic/pending.html');
    cy.get('sc-cancel-dialog').shadow().find('sc-subscription-cancel').shadow().find('sc-dashboard-module').as('inner');
    // should be immediate.
    cy.get('@inner').should('contain', 'end of your billing period');

    cy.intercept('**//surecart/v1/subscriptions/subscription_id/cancel*', {
      id: 'test'
    }).as('cancel');

    // cancel.
    cy.get('@inner').find('sc-button[type=primary]').shadow()
    .find('.button')
    .should('not.have.class', 'button--loading')
    .click({ force: true, waitForAnimations: true, multiple: true });
  });
});
