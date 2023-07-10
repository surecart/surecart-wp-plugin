import { newSpecPage } from '@stencil/core/testing';
import { ScCheckoutPaystackPayment } from '../sc-checkout-paystack-payment';

describe('sc-checkout-paystack-payment', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScCheckoutPaystackPayment],
      html: `<sc-checkout-paystack-payment></sc-checkout-paystack-payment>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-checkout-paystack-payment>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sc-checkout-paystack-payment>
    `);
  });
});
