describe('Recaptcha', () => {
  beforeEach(() => {
    cy.intercept({
			method: 'POST',
			path: '**/surecart/v1/checkouts/*',
		}, {
      id: "test",
      object: "checkout",
      status: "draft"
    }).as('createUpdate');
  });

  it('Sends abandoned_checkout_return_url with request', async () => {
    cy.visit('/test/sc-checkout/abandoned-checkout');
    cy.wait('@createUpdate').then(({ request }) => {
      expect(request.body.abandoned_checkout_return_url).to.eq('https://test.com/surecart/redirect');
    })
  });
});
