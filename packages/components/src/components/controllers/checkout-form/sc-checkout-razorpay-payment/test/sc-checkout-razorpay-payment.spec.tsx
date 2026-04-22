import { newSpecPage } from '@stencil/core/testing';
import { ScCheckoutRazorpayPayment } from '../sc-checkout-razorpay-payment';

describe('sc-checkout-razorpay-payment', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScCheckoutRazorpayPayment],
      html: `<sc-checkout-razorpay-payment></sc-checkout-razorpay-payment>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
