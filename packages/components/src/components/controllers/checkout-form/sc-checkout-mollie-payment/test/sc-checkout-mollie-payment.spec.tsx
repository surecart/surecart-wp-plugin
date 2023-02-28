import { newSpecPage } from '@stencil/core/testing';
import { ScCheckoutMolliePayment } from '../sc-checkout-mollie-payment';

describe('sc-checkout-mollie-payment', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScCheckoutMolliePayment],
      html: `<sc-checkout-mollie-payment></sc-checkout-mollie-payment>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
