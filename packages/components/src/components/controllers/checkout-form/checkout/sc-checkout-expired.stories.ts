import withMock from 'storybook-addon-mock';

export default {
  title: 'Components/Checkout',
  decorators: [withMock],
  argTypes: {
    mode: {
      control: {
        type: 'select',
      },
      options: ['test', 'live'],
    },
    currencyCode: {
      control: {
        type: 'select',
      },
      options: ['usd', 'eur'],
    },
  },
};

const Template = ({ mode }) => {
  localStorage.clear();
  return `<sc-checkout mode="${mode}">
  <sc-form>
  <!-- wp:surecart/price-selector {"label":"Choose A Product"}  -->
  <sc-price-choices type="radio" columns="1"><div><!-- wp:surecart/price-choice -->
  <sc-price-choice type="radio" show-label="1" show-price="1" show-control="1"></sc-price-choice>
  <!-- /wp:surecart/price-choice --></div></sc-price-choices>
  <!-- /wp:surecart/price-selector -->

  <!-- wp:surecart/express-payment -->
  <sc-express-payment divider-text="or" class="wp-block-surecart-express-payment"></sc-express-payment>
  <!-- /wp:surecart/express-payment -->

  <!-- wp:surecart/columns -->
  <sc-columns class="wp-block-surecart-columns"><!-- wp:surecart/column -->
  <sc-column class="wp-block-surecart-column"><!-- wp:surecart/name -->
  <sc-customer-name label="Name" class="wp-block-surecart-name"></sc-customer-name>
  <!-- /wp:surecart/name --></sc-column>
  <!-- /wp:surecart/column -->

  <!-- wp:surecart/column -->
  <sc-column class="wp-block-surecart-column"><!-- wp:surecart/email -->
  <sc-customer-email label="Email" autocomplete="email" inputmode="email" required class="wp-block-surecart-email"></sc-customer-email>
  <!-- /wp:surecart/email --></sc-column>
  <!-- /wp:surecart/column --></sc-columns>
  <!-- /wp:surecart/columns -->

  <!-- wp:surecart/payment {"secure_notice":"This is a secure, encrypted payment"} -->
  <sc-payment label="Payment" secure-notice="This is a secure, encrypted payment" class="wp-block-surecart-payment"></sc-payment>
  <!-- /wp:surecart/payment -->

  <!-- wp:surecart/totals {"collapsible":true,"collapsed":false} -->
  <sc-order-summary collapsible="1" class="wp-block-surecart-totals"><!-- wp:surecart/divider -->
  <sc-divider></sc-divider>
  <!-- /wp:surecart/divider -->

  <!-- wp:surecart/line-items -->
  <sc-line-items removable="1" editable="1" class="wp-block-surecart-line-items"></sc-line-items>
  <!-- /wp:surecart/line-items -->

  <!-- wp:surecart/divider -->
  <sc-divider></sc-divider>
  <!-- /wp:surecart/divider -->

  <!-- wp:surecart/subtotal -->
  <sc-line-item-total class="sc-subtotal" total="subtotal" class="wp-block-surecart-subtotal"><span slot="description">Subtotal</span></sc-line-item-total>
  <!-- /wp:surecart/subtotal -->

  <!-- wp:surecart/tax-line-item -->
  <sc-line-item-tax class="wp-block-surecart-tax-line-item"></sc-line-item-tax>
  <!-- /wp:surecart/tax-line-item -->

  <!-- wp:surecart/coupon {"text":"Add Coupon Code","button_text":"Apply Coupon"} -->
  <sc-coupon-form label="Add Coupon Code">Apply Coupon</sc-coupon-form>
  <!-- /wp:surecart/coupon -->

  <!-- wp:surecart/divider -->
  <sc-divider></sc-divider>
  <!-- /wp:surecart/divider -->

  <!-- wp:surecart/total -->
  <sc-line-item-total total="total" size="large" show-currency="1" class="wp-block-surecart-total"><span slot="description">Total</span><span slot="subscription-title">Total Due Today</span></sc-line-item-total>
  <!-- /wp:surecart/total --></sc-order-summary>
  <!-- /wp:surecart/totals -->

  <!-- wp:surecart/submit {"show_total":true,"full":true} -->
  <sc-button submit="1" type="primary" full="1" size="large" class="wp-block-surecart-submit"><svg slot="prefix" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewbox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>Purchase<span> <sc-total></sc-total></span></sc-button>
  <!-- /wp:surecart/submit -->

  </sc-form>
  </sc-checkout>`;
};

export const Expired = Template.bind({});
Expired.args = {
  mode: 'live',
};
Expired.parameters = {
  mockData: [
    {
      url: '/surecart/v1/orders/?expand%5B0%5D=line_items1&expand%5B1%5D=line_item.price&expand%5B2%5D=price.product&expand%5B3%5D=customer&expand%5B4%5D=customer.shipping_address&expand%5B5%5D=payment_intent&expand%5B6%5D=discount&expand%5B7%5D=discount.promotion&expand%5B8%5D=discount.coupon&expand%5B9%5D=shipping_address&expand%5B10%5D=tax_identifier&_locale=user',
      method: 'POST',
      status: 403,
      response: { code: 'rest_cookie_invalid_nonce', message: 'Cookie check failed', data: { status: 403 } },
    },
  ],
};
