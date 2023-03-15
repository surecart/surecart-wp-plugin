describe('Abandoned Checkouts', () => {
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
  });

  it('Sends abandoned_checkout_return_url with request', async () => {
    cy.visit('/test/sc-checkout/abandoned-checkout');
    cy.wait('@createUpdate').then(({ request }) => {
      expect(request.body.abandoned_checkout_enabled).to.eq(true);
      expect(request.body.abandoned_checkout_return_url).to.eq('https://test.com/surecart/redirect/');
      expect(request.body.metadata.page_url).to.include('/test/sc-checkout/abandoned-checkout');
      expect(request.body.metadata.page_id).to.eq(1);
      expect(request.body.metadata.buy_page_product_id).to.eq('testproductid');
    });
  });
});
