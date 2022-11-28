beforeEach(() => {
  cy.intercept(
    {
      path: '**/surecart/v1/checkouts/*',
    },
    {
      id: 'test',
      object: 'checkout',
      status: 'draft',
    },
  ).as('checkout');
  cy.intercept(
    {
      path: '**/surecart/v1/prices/*',
    },
    [{
      id: 'price_1',
      amount: 1000,
      currency: 'usd',
      product: {
        id: "product_1",
        name: 'name'
      }
    }],
  ).as('price1');
});

describe('Initial Load', () => {
  it('Creates a checkout with the checked price on load.', () => {
    cy.visit('/test/sc-checkout/price-selector/');
    cy.wait('@checkout').then(({ request }) => {
      expect(request.body.line_items.length).to.eq(1);
      expect(request.body.line_items[0]['price_id']).to.eq('price_1');
      expect((request.body.line_items[0]['quantity']).toString()).to.eq('1');
    })
  });
});
