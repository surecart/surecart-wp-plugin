describe('Coupon Field', () => {
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
          ]
        }
      },
    ).as('createUpdate');
  });

  it('Is able to apply a coupon', () => {
    cy.visit('/test/sc-checkout/coupon');

    cy.wait('@createUpdate');
    cy.get('sc-block-ui.busy-block-ui').should('not.exist');

    cy.intercept(
      {
        path: '**/surecart/v1/checkouts/*',
      },
      {
        id: 'test',
        object: 'checkout',
        status: 'draft',
        live_mode: false,
        discount_amount: -2000,
        discount: {
          coupon: {
            amount_off: 2000,
            currency: 'usd'
          },
          promotion: {
            code: '20OFF'
          }
        },
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
    ).as('applyCoupon');

    cy.get('sc-order-coupon-form').find('.trigger').click();
    cy.get('sc-order-coupon-form').find('input').type('Testcoupon {enter}',{ force: true });
    cy.get('sc-order-coupon-form').contains('20OFF');
    cy.get('sc-order-coupon-form').contains('-$20.00');
  });
});
