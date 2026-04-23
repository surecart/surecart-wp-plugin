import { newSpecPage } from '@stencil/core/testing';
import { ScCheckoutRazorpayPaymentProvider } from '../sc-checkout-razorpay-payment-provider';

describe('sc-checkout-razorpay-payment-provider', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScCheckoutRazorpayPaymentProvider],
      html: `<sc-checkout-razorpay-payment-provider></sc-checkout-razorpay-payment-provider>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
