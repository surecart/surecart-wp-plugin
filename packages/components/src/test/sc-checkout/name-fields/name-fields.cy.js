describe('Name fields', () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: 'POST',
        path: '**/surecart/v1/checkouts/*',
      },
      {
        id: 'test',
        object: 'checkout',
        status: 'draft',
      },
    ).as('createUpdate');


    cy.intercept({
			method: 'POST',
			path: '**/surecart/v1/checkouts/test/finalize*',
		}, {
      id: "test",
      object: "checkout",
      status: "processing"
    }).as('finalize');
  });


  it('Can checkout', () => {
    cy.visit('/test/sc-checkout/name-fields/');

    cy.wait('@createUpdate');
    cy.get('sc-block-ui.busy-block-ui').should('not.exist');

    cy.get('sc-order-submit sc-button').shadow()
    .find('.button')
    .should('not.have.class', 'button--loading')
    .click({ force: true, waitForAnimations: true, multiple: true });

    cy.wait('@finalize').then(({ request }) => {
      expect(request.body.first_name).to.eq('John');
      expect(request.body.last_name).to.eq('Smith');
    });
  });
});
