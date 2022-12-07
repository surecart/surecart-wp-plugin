describe('Manual Payments', () => {
  beforeEach(() => {
    cy.intercept({
			method: 'POST',
			path: '**/surecart/v1/checkouts/*',
		}, {
      id: "test",
      object: "checkout",
      status: "draft"
    }).as('createUpdate');

    cy.intercept({
			method: 'POST',
			path: '**/surecart/v1/checkouts/test/finalize*',
		}, {
      id: "test",
      object: "checkout",
      status: "processing"
    }).as('finalize');

    cy.intercept({
			method: 'POST',
			path: '**/surecart/v1/checkouts/test/confirm*',
		}, {
      id: "test",
      status: "processing"
    }).as('confirm');
  });

  it('Can checkout with a manual payment', () => {
    cy.visit('/test/sc-checkout/manual-payments');

    cy.wait('@createUpdate');
    cy.get('sc-block-ui.busy-block-ui').should('not.exist');

    cy.get('sc-order-submit sc-button').shadow()
    .find('.button')
    .should('not.have.class', 'button--loading')
    .click({ force: true, waitForAnimations: true, multiple: true });

    cy.wait('@finalize').its('request.url')
      .should('include', 'manual_payment=true')
      .should('include', 'manual_payment_method_id=test')
      .should('include', 'form_id=1');

    cy.location('pathname').should('contain', 'success');
    cy.location('search').should('contain', 'order=test');
  });
});
