import withMock from 'storybook-addon-mock';

export default {
  title: 'Components/Checkout/Currencies',
  decorators: [withMock],
  argTypes: {
    mode: {
      control: {
        type: 'select',
      },
      options: ['test', 'live'],
    },
  },
};

const Template = ({ mode }) => {
  localStorage.clear();
  return `<ce-checkout mode="${mode}">
  <ce-form>
  <!-- wp:checkout-engine/price-selector {"label":"Choose A Product"}  -->
  <ce-price-choices type="radio" columns="1"><div><!-- wp:checkout-engine/price-choice -->
  <ce-price-choice type="radio" show-label="1" show-price="1" show-control="1"></ce-price-choice>
  <!-- /wp:checkout-engine/price-choice --></div></ce-price-choices>
  <!-- /wp:checkout-engine/price-selector -->

  <!-- wp:checkout-engine/express-payment -->
  <ce-express-payment divider-text="or" class="wp-block-checkout-engine-express-payment"></ce-express-payment>
  <!-- /wp:checkout-engine/express-payment -->

  <!-- wp:checkout-engine/columns -->
  <ce-columns class="wp-block-checkout-engine-columns"><!-- wp:checkout-engine/column -->
  <ce-column class="wp-block-checkout-engine-column"><!-- wp:checkout-engine/name -->
  <ce-customer-name label="Name" class="wp-block-checkout-engine-name"></ce-customer-name>
  <!-- /wp:checkout-engine/name --></ce-column>
  <!-- /wp:checkout-engine/column -->

  <!-- wp:checkout-engine/column -->
  <ce-column class="wp-block-checkout-engine-column"><!-- wp:checkout-engine/email -->
  <ce-customer-email label="Email" autocomplete="email" inputmode="email" required class="wp-block-checkout-engine-email"></ce-customer-email>
  <!-- /wp:checkout-engine/email --></ce-column>
  <!-- /wp:checkout-engine/column --></ce-columns>
  <!-- /wp:checkout-engine/columns -->

  <!-- wp:checkout-engine/payment {"secure_notice":"This is a secure, encrypted payment"} -->
  <ce-payment label="Payment" secure-notice="This is a secure, encrypted payment" class="wp-block-checkout-engine-payment"></ce-payment>
  <!-- /wp:checkout-engine/payment -->

  <!-- wp:checkout-engine/totals {"collapsible":true,"collapsed":false} -->
  <ce-order-summary collapsible="1" class="wp-block-checkout-engine-totals"><!-- wp:checkout-engine/divider -->
  <ce-divider></ce-divider>
  <!-- /wp:checkout-engine/divider -->

  <!-- wp:checkout-engine/line-items -->
  <ce-line-items removable="1" editable="1" class="wp-block-checkout-engine-line-items"></ce-line-items>
  <!-- /wp:checkout-engine/line-items -->

  <!-- wp:checkout-engine/divider -->
  <ce-divider></ce-divider>
  <!-- /wp:checkout-engine/divider -->

  <!-- wp:checkout-engine/subtotal -->
  <ce-line-item-total class="ce-subtotal" total="subtotal" class="wp-block-checkout-engine-subtotal"><span slot="description">Subtotal</span></ce-line-item-total>
  <!-- /wp:checkout-engine/subtotal -->

  <!-- wp:checkout-engine/tax-line-item -->
  <ce-line-item-tax class="wp-block-checkout-engine-tax-line-item"></ce-line-item-tax>
  <!-- /wp:checkout-engine/tax-line-item -->

  <!-- wp:checkout-engine/coupon {"text":"Add Coupon Code","button_text":"Apply Coupon"} -->
  <ce-coupon-form label="Add Coupon Code">Apply Coupon</ce-coupon-form>
  <!-- /wp:checkout-engine/coupon -->

  <!-- wp:checkout-engine/divider -->
  <ce-divider></ce-divider>
  <!-- /wp:checkout-engine/divider -->

  <!-- wp:checkout-engine/total -->
  <ce-line-item-total class="ce-line-item-total" total="total" size="large" show-currency="1" class="wp-block-checkout-engine-total"><span slot="description">Total</span><span slot="subscription-title">Total Due Today</span></ce-line-item-total>
  <!-- /wp:checkout-engine/total --></ce-order-summary>
  <!-- /wp:checkout-engine/totals -->

  <!-- wp:checkout-engine/submit {"show_total":true,"full":true} -->
  <ce-button submit="1" type="primary" full="1" size="large" class="wp-block-checkout-engine-submit"><svg slot="prefix" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewbox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>Purchase<span> <ce-total></ce-total></span></ce-button>
  <!-- /wp:checkout-engine/submit -->

  </ce-form>
  </ce-checkout>`;
};

export const USD = Template.bind({});
USD.parameters = {
  mockData: [
    {
      url: '/checkout-engine/v1/orders/?expand%5B0%5D=line_items1&expand%5B1%5D=line_item.price&expand%5B2%5D=price.product&expand%5B3%5D=customer&expand%5B4%5D=customer.shipping_address&expand%5B5%5D=payment_intent&expand%5B6%5D=discount&expand%5B7%5D=discount.promotion&expand%5B8%5D=discount.coupon&expand%5B9%5D=shipping_address&expand%5B10%5D=tax_identifier&_locale=user',
      method: 'POST',
      status: 200,
      response: {
        id: '5b4cf222-7898-4655-84a2-73b0559deb99',
        object: 'order',
        amount_due: 1200,
        currency: 'usd',
        discount_amount: 0,
        email: 'wordpress@example.com',
        group_key: 'ce-checkout-263',
        live_mode: false,
        metadata: [],
        name: 'Dre',
        number: 'D225F1C3',
        processor_data: {
          stripe: {
            account_id: 'acct_1KOoA62cow5C8zvP',
            publishable_key: 'pk_test_51FrVhTKIxBDlEhovnzFUjE1K3e8s9QInYW4a2S1BrYYgePmNIFZUCSvUY90MmD10PNh0ZxYFoxkW6P1xsfPofCYG00JTdSKWFO',
          },
        },
        return_url: 'http://localhost:8888/one-time/',
        status: 'draft',
        subtotal_amount: 2400,
        tax_amount: 0,
        tax_label: null,
        tax_status: 'tax_zone_not_found',
        total_amount: 2400,
        trial_amount: 20,
        url: 'https://staging.surecart.com/portal/orders/5b4cf222-7898-4655-84a2-73b0559deb99',
        billing_address: null,
        charge: null,
        customer: {
          id: 'b09dde5b-2b8d-47e1-a7b5-d9d2ed3d0a78',
          object: 'customer',
          billing_matches_shipping: true,
          email: 'wordpress@example.com',
          live_mode: false,
          name: 'Dre',
          phone: '9202462132',
          unsubscribed: false,
          billing_address: null,
          default_payment_method: '550f460f-f599-49e7-accc-e5c792c2abf5',
          shipping_address: {
            id: 'aa21c7dd-39a7-4fa0-b135-627ac38a49a3',
            object: 'address',
            city: 'Monona',
            country: 'US',
            line_1: '303 Panther Trl',
            line_2: '',
            name: null,
            postal_code: '53716',
            state: 'WI',
            created_at: 1644966839,
            updated_at: 1644966839,
          },
          tax_identifier: '1f2b43c0-ee3b-4278-aff0-2caf26e587fd',
          created_at: 1644962412,
          updated_at: 1647463174,
        },
        discount: [],
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
            {
              id: '5366e5a3-f129-402d-8e25-5b98061142e9',
              object: 'line_item',
              ad_hoc_amount: null,
              discount_amount: 0,
              quantity: 1,
              subtotal_amount: 1200,
              tax_amount: 0,
              total_amount: 1200,
              trial: true,
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
                recurring_interval: null,
                recurring_interval_count: null,
                tax_behavior: 'exclusive',
                trial_duration_days: 7,
                product: {
                  id: '36d82beb-2441-4e0d-b7b7-c39f4e46cd5b',
                  object: 'product',
                  archived: false,
                  archived_at: null,
                  description: null,
                  image_url: null,
                  name: 'One Time Name',
                  recurring: false,
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
        shipping_address: {
          id: '6e9fd111-0ee7-4b41-84a6-768c936b47fd',
          object: 'address',
          city: 'Monona',
          country: 'US',
          line_1: '303 Panther Trl',
          line_2: '',
          name: null,
          postal_code: '53716',
          state: 'WI',
          created_at: 1647382245,
          updated_at: 1647382245,
        },
        tax_identifier: null,
        created_at: 1647382132,
        updated_at: 1647463174,
        customer_id: 'b09dde5b-2b8d-47e1-a7b5-d9d2ed3d0a78',
        payment_intent_id: null,
        payment_method_id: null,
      },
    },
  ],
};

export const EUR = Template.bind({});
EUR.parameters = {
  mockData: [
    {
      url: '/checkout-engine/v1/orders/?expand%5B0%5D=line_items1&expand%5B1%5D=line_item.price&expand%5B2%5D=price.product&expand%5B3%5D=customer&expand%5B4%5D=customer.shipping_address&expand%5B5%5D=payment_intent&expand%5B6%5D=discount&expand%5B7%5D=discount.promotion&expand%5B8%5D=discount.coupon&expand%5B9%5D=shipping_address&expand%5B10%5D=tax_identifier&_locale=user',
      method: 'POST',
      status: 200,
      response: {
        id: '5b4cf222-7898-4655-84a2-73b0559deb99',
        object: 'order',
        amount_due: 1200,
        currency: 'eur',
        discount_amount: 0,
        email: 'wordpress@example.com',
        group_key: 'ce-checkout-263',
        live_mode: false,
        metadata: [],
        name: 'Dre',
        number: 'D225F1C3',
        processor_data: {
          stripe: {
            account_id: 'acct_1KOoA62cow5C8zvP',
            publishable_key: 'pk_test_51FrVhTKIxBDlEhovnzFUjE1K3e8s9QInYW4a2S1BrYYgePmNIFZUCSvUY90MmD10PNh0ZxYFoxkW6P1xsfPofCYG00JTdSKWFO',
          },
        },
        return_url: 'http://localhost:8888/one-time/',
        status: 'draft',
        subtotal_amount: 2400,
        tax_amount: 0,
        tax_label: null,
        tax_status: 'tax_zone_not_found',
        total_amount: 2400,
        trial_amount: 20,
        url: 'https://staging.surecart.com/portal/orders/5b4cf222-7898-4655-84a2-73b0559deb99',
        billing_address: null,
        charge: null,
        customer: {
          id: 'b09dde5b-2b8d-47e1-a7b5-d9d2ed3d0a78',
          object: 'customer',
          billing_matches_shipping: true,
          email: 'wordpress@example.com',
          live_mode: false,
          name: 'Dre',
          phone: '9202462132',
          unsubscribed: false,
          billing_address: null,
          default_payment_method: '550f460f-f599-49e7-accc-e5c792c2abf5',
          shipping_address: {
            id: 'aa21c7dd-39a7-4fa0-b135-627ac38a49a3',
            object: 'address',
            city: 'Monona',
            country: 'US',
            line_1: '303 Panther Trl',
            line_2: '',
            name: null,
            postal_code: '53716',
            state: 'WI',
            created_at: 1644966839,
            updated_at: 1644966839,
          },
          tax_identifier: '1f2b43c0-ee3b-4278-aff0-2caf26e587fd',
          created_at: 1644962412,
          updated_at: 1647463174,
        },
        discount: [],
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
                currency: 'eur',
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
            {
              id: '5366e5a3-f129-402d-8e25-5b98061142e9',
              object: 'line_item',
              ad_hoc_amount: null,
              discount_amount: 0,
              quantity: 1,
              subtotal_amount: 1200,
              tax_amount: 0,
              total_amount: 1200,
              trial: true,
              price: {
                id: 'ac7b1d56-0b7d-4e29-b2e5-e01ace8bf4ac',
                object: 'price',
                ad_hoc: false,
                ad_hoc_max_amount: null,
                ad_hoc_min_amount: 0,
                amount: 1200,
                archived: false,
                archived_at: null,
                currency: 'eur',
                current_version: true,
                metadata: [],
                recurring_interval: null,
                recurring_interval_count: null,
                tax_behavior: 'exclusive',
                trial_duration_days: 7,
                product: {
                  id: '36d82beb-2441-4e0d-b7b7-c39f4e46cd5b',
                  object: 'product',
                  archived: false,
                  archived_at: null,
                  description: null,
                  image_url: null,
                  name: 'One Time Name',
                  recurring: false,
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
        shipping_address: {
          id: '6e9fd111-0ee7-4b41-84a6-768c936b47fd',
          object: 'address',
          city: 'Monona',
          country: 'US',
          line_1: '303 Panther Trl',
          line_2: '',
          name: null,
          postal_code: '53716',
          state: 'WI',
          created_at: 1647382245,
          updated_at: 1647382245,
        },
        tax_identifier: null,
        created_at: 1647382132,
        updated_at: 1647463174,
        customer_id: 'b09dde5b-2b8d-47e1-a7b5-d9d2ed3d0a78',
        payment_intent_id: null,
        payment_method_id: null,
      },
    },
  ],
};

export const ZERO = Template.bind({});
ZERO.parameters = {
  mockData: [
    {
      url: '/checkout-engine/v1/orders/?expand%5B0%5D=line_items1&expand%5B1%5D=line_item.price&expand%5B2%5D=price.product&expand%5B3%5D=customer&expand%5B4%5D=customer.shipping_address&expand%5B5%5D=payment_intent&expand%5B6%5D=discount&expand%5B7%5D=discount.promotion&expand%5B8%5D=discount.coupon&expand%5B9%5D=shipping_address&expand%5B10%5D=tax_identifier&_locale=user',
      method: 'POST',
      status: 200,
      response: {
        id: '5b4cf222-7898-4655-84a2-73b0559deb99',
        object: 'order',
        amount_due: 1200,
        currency: 'jpy',
        discount_amount: 0,
        email: 'wordpress@example.com',
        group_key: 'ce-checkout-263',
        live_mode: false,
        metadata: [],
        name: 'Dre',
        number: 'D225F1C3',
        processor_data: {
          stripe: {
            account_id: 'acct_1KOoA62cow5C8zvP',
            publishable_key: 'pk_test_51FrVhTKIxBDlEhovnzFUjE1K3e8s9QInYW4a2S1BrYYgePmNIFZUCSvUY90MmD10PNh0ZxYFoxkW6P1xsfPofCYG00JTdSKWFO',
          },
        },
        return_url: 'http://localhost:8888/one-time/',
        status: 'draft',
        subtotal_amount: 2400,
        tax_amount: 0,
        tax_label: null,
        tax_status: 'tax_zone_not_found',
        total_amount: 2400,
        trial_amount: 20,
        url: 'https://staging.surecart.com/portal/orders/5b4cf222-7898-4655-84a2-73b0559deb99',
        billing_address: null,
        charge: null,
        customer: {
          id: 'b09dde5b-2b8d-47e1-a7b5-d9d2ed3d0a78',
          object: 'customer',
          billing_matches_shipping: true,
          email: 'wordpress@example.com',
          live_mode: false,
          name: 'Dre',
          phone: '9202462132',
          unsubscribed: false,
          billing_address: null,
          default_payment_method: '550f460f-f599-49e7-accc-e5c792c2abf5',
          shipping_address: {
            id: 'aa21c7dd-39a7-4fa0-b135-627ac38a49a3',
            object: 'address',
            city: 'Monona',
            country: 'US',
            line_1: '303 Panther Trl',
            line_2: '',
            name: null,
            postal_code: '53716',
            state: 'WI',
            created_at: 1644966839,
            updated_at: 1644966839,
          },
          tax_identifier: '1f2b43c0-ee3b-4278-aff0-2caf26e587fd',
          created_at: 1644962412,
          updated_at: 1647463174,
        },
        discount: [],
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
                currency: 'jpy',
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
            {
              id: '5366e5a3-f129-402d-8e25-5b98061142e9',
              object: 'line_item',
              ad_hoc_amount: null,
              discount_amount: 0,
              quantity: 1,
              subtotal_amount: 1200,
              tax_amount: 0,
              total_amount: 1200,
              trial: true,
              price: {
                id: 'ac7b1d56-0b7d-4e29-b2e5-e01ace8bf4ac',
                object: 'price',
                ad_hoc: false,
                ad_hoc_max_amount: null,
                ad_hoc_min_amount: 0,
                amount: 1200,
                archived: false,
                archived_at: null,
                currency: 'jpy',
                current_version: true,
                metadata: [],
                recurring_interval: null,
                recurring_interval_count: null,
                tax_behavior: 'exclusive',
                trial_duration_days: 7,
                product: {
                  id: '36d82beb-2441-4e0d-b7b7-c39f4e46cd5b',
                  object: 'product',
                  archived: false,
                  archived_at: null,
                  description: null,
                  image_url: null,
                  name: 'One Time Name',
                  recurring: false,
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
        shipping_address: {
          id: '6e9fd111-0ee7-4b41-84a6-768c936b47fd',
          object: 'address',
          city: 'Monona',
          country: 'US',
          line_1: '303 Panther Trl',
          line_2: '',
          name: null,
          postal_code: '53716',
          state: 'WI',
          created_at: 1647382245,
          updated_at: 1647382245,
        },
        tax_identifier: null,
        created_at: 1647382132,
        updated_at: 1647463174,
        customer_id: 'b09dde5b-2b8d-47e1-a7b5-d9d2ed3d0a78',
        payment_intent_id: null,
        payment_method_id: null,
      },
    },
  ],
};
