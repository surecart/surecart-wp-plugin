import { newSpecPage } from '@stencil/core/testing';
import { CeStripePaymentRequest } from '../ce-stripe-payment-request';

describe('ce-stripe-payment-request', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeStripePaymentRequest],
      html: `<ce-stripe-payment-request></ce-stripe-payment-request>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
