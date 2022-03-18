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

export const Expired = Template.bind({});
Expired.args = {
  mode: 'live',
};
Expired.parameters = {
  mockData: [
    {
      url: '/checkout-engine/v1/orders/?expand%5B0%5D=line_items1&expand%5B1%5D=line_item.price&expand%5B2%5D=price.product&expand%5B3%5D=customer&expand%5B4%5D=customer.shipping_address&expand%5B5%5D=payment_intent&expand%5B6%5D=discount&expand%5B7%5D=discount.promotion&expand%5B8%5D=discount.coupon&expand%5B9%5D=shipping_address&expand%5B10%5D=tax_identifier&_locale=user',
      method: 'POST',
      status: 403,
      response: { code: 'rest_cookie_invalid_nonce', message: 'Cookie check failed', data: { status: 403 } },
    },
  ],
};
