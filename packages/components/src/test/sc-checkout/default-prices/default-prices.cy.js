
beforeEach(() => {
  cy.intercept(
    {
      path: '**/surecart/v1/checkouts/*',
    },
    {
      id: 'test',
      object: 'checkout',
      status: 'draft',
      line_items: {
        object: 'list',
        pagination: { count: 1, limit: 20, page: 1, url: '/api/v1/line_items?order_ids%5B%5D=5b4cf222-7898-4655-84a2-73b0559deb99' },
        data: [
          {
            id: '5366e5a3-f129-402d-8e25-5b98061142e9',
            object: 'line_item',
            ad_hoc_amount: null,
            discount_amount: 0,
            quantity: 1,
            subtotal_amount: 1200,
            tax_amount: 0,
            total_amount: 1200,
            trial: false,
            price: {
              id: 'ac7b1d56-0b7d-4e29-b2e5-e01ace8bf4ac',
              object: 'price',
              ad_hoc: false,
              ad_hoc_max_amount: null,
              ad_hoc_min_amount: 0,
              amount: 1200,
              archived: false,
              archived_at: null,
              currency: 'usd',
              current_version: true,
              metadata: [],
              recurring_interval: 'month',
              recurring_interval_count: 1,
              tax_behavior: 'exclusive',
              trial_duration_days: null,
              product: {
                id: '36d82beb-2441-4e0d-b7b7-c39f4e46cd5b',
                object: 'product',
                archived: false,
                archived_at: null,
                description: null,
                image_url: null,
                name: 'Product Name',
                recurring: true,
                tax_enabled: true,
                tax_category: null,
                product_group: null,
                created_at: 1645027950,
                updated_at: 1645130871,
              },
              created_at: 1645027950,
              updated_at: 1645130871,
            },
            created_at: 1647382132,
            updated_at: 1647382132,
            price_id: 'ac7b1d56-0b7d-4e29-b2e5-e01ace8bf4ac',
          },
        ]
      }
    },
  ).as('createUpdate');
});

describe('Default Prices', () => {
  it('Creates new checkout with default prices added to the checkout form', () => {
    cy.intercept(
      {
        path: '**/surecart/v1/checkouts/*',
      },
      {
        id: 'test',
        object: 'checkout',
        status: 'draft',
      },
    ).as('createUpdate');
    cy.visit('/test/sc-checkout/default-prices');
    cy.wait('@createUpdate').then(({ request }) => {
      expect(request.body.line_items.length).to.eq(2);
      expect(request.body.line_items[0]['price_id']).to.eq('default_price_1');
      expect((request.body.line_items[0]['quantity'])).to.eq(2);
      expect(request.body.line_items[1]['price_id']).to.eq('default_price_2');
      expect((request.body.line_items[1]['quantity'])).to.eq(3);
    })
  });
  it('Ignores form default prices when a checkout_id is passed in the url', () => {
    cy.intercept(
      {
        path: '**/surecart/v1/checkouts/*',
      },
      {
        id: 'test',
        object: 'checkout',
        status: 'draft',
      },
    ).as('createUpdate');
    cy.visit('/test/sc-checkout/default-prices?checkout_id=test');
    cy.wait('@createUpdate').its('request.method').should('eq', 'GET');
  });
});
