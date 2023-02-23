beforeEach(() => {
  cy.intercept(
    {
      path: '**/surecart/v1/checkouts/*',
    },
    {
      id: 'test',
      object: 'checkout',
      status: 'draft',
      live_mode: false,
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
        ],
      },
    },
  ).as('createUpdate');
});

describe('Line Items', () => {
  it('Handles line items as URL params', () => {
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
    cy.visit('/test/sc-checkout/url-params?line_items[0][price_id]=price_id&line_items[0][quantity]=2');
    cy.wait('@createUpdate').then(({ request }) => {
      expect(request.body.line_items.length).to.eq(1);
      expect(request.body.line_items[0]['price_id']).to.eq('price_id');
      expect(request.body.line_items[0]['quantity'].toString()).to.eq('2');
      expect(request.body.shipping_address.country).to.eq('DK');
    });
  });
});

describe('Coupons', () => {
  it('Applies a coupon', () => {
    cy.visit('/test/sc-checkout/url-params?coupon=TESTCOUPON');
    cy.wait('@createUpdate').then(({ request }) => {
      expect(request.body.discount.promotion_code).to.eq('TESTCOUPON');
      expect(request.body.shipping_address.country).to.eq('DK');
    });
  });
});

describe('Abandoned Cart', () => {
  it('Loads a checkout', () => {
    cy.visit('/test/sc-checkout/url-params?checkout_id=test');
    cy.wait('@createUpdate').its('request.method').should('eq', 'GET');
  });
  it('Applies a coupon with an existing checkout', () => {
    cy.visit('/test/sc-checkout/url-params?checkout_id=testcheckoutid&coupon=TESTCOUPON');
    cy.wait('@createUpdate').then(({ request }) => {
      expect(request.url).to.include('testcheckoutid');
      expect(request.method).to.eq('POST');
      expect(request.body.discount.promotion_code).to.eq('TESTCOUPON');
    });
  });
  it('Ignores existing sessions', () => {
    cy.visit('/test/sc-checkout/url-params?checkout_id=test&coupon=TESTCOUPON');
    cy.wait('@createUpdate');
    cy.visit('/test/sc-checkout/url-params?checkout_id=test2&coupon=TESTCOUPON');
    cy.wait('@createUpdate').its('request.url').should('include', 'checkouts/test2');
  });
  it('Shows an empty cart if form mode does not match', () => {
    cy.intercept(
      {
        path: '**/surecart/v1/checkouts/*',
      },
      {
        id: 'test',
        object: 'checkout',
        status: 'draft',
        live_mode: true,
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
          ],
        },
      },
    ).as('fetchMismatchLiveMode');

    cy.visit('/test/sc-checkout/url-params?checkout_id=test&coupon=TESTCOUPON');
    cy.wait('@fetchMismatchLiveMode');
    cy.get('sc-order-summary').shadow().find('p').contains('Your cart is empty');
  });
});

describe('Payment Instrument Redirects', () => {
  it('Handles redirect success', () => {
    cy.intercept(
      {
        path: '**/surecart/v1/checkouts/*',
      },
      {
        id: 'test',
        object: 'checkout',
        status: 'paid',
      },
    ).as('createUpdate');
    cy.intercept(
      {
        method: 'POST',
        path: '**/surecart/v1/checkouts/test/confirm*',
      },
      {
        id: 'test',
        status: 'paid',
      },
    ).as('confirm');
    cy.visit('/test/sc-checkout/url-params?checkout_id=test&redirect_status=succeeded');
    cy.wait('@createUpdate');
    cy.wait('@confirm');
    cy.get('sc-dialog').find('sc-dashboard-module').should('be.visible');
    cy.get('sc-dialog').find('.dialog__overlay').first().click({force: true});
    cy.get('sc-dialog').find('sc-dashboard-module').should('be.visible');
    cy.get('sc-button[href]').should('have.attr', 'href').and('contain', 'success').and('contain', 'order=test');
  });

  it('Handles mollie success', () => {
    cy.intercept(
      {
        path: '**/surecart/v1/checkouts/*',
      },
      {
        id: 'test',
        object: 'checkout',
        status: 'paid',
      },
    ).as('createUpdate');
    cy.intercept(
      {
        method: 'POST',
        path: '**/surecart/v1/checkouts/test/confirm*',
      },
      {
        id: 'test',
        status: 'paid',
      },
    ).as('confirm');
    cy.visit('/test/sc-checkout/url-params?checkout_id=test&redirect_status=succeeded&is_surecart_payment_redirect=true');
    cy.wait('@createUpdate');
    cy.wait('@confirm');
    cy.location('pathname').should('contain', 'success');
    cy.location('search').should('contain', 'order=test');
  });

  it('Handles redirect errors', () => {
    cy.intercept(
      {
        path: '**/surecart/v1/checkouts/*',
      },
      {
        id: 'test',
        object: 'checkout',
        status: 'finalized',
      },
    ).as('createUpdate');
    cy.visit('/test/sc-checkout/url-params?redirect_status=failed&checkout_id=test');
    cy.get('sc-checkout sc-checkout-form-errors').shadow().find('sc-alert').should('be.visible').should('have.attr', 'type', 'danger');
  });
});
