import { newSpecPage } from '@stencil/core/testing';
import { ScSubscriptionPaymentMethod } from '../sc-subscription-payment-method';

describe('sc-subscription-payment-method', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScSubscriptionPaymentMethod],
      html: `<sc-subscription-payment-method></sc-subscription-payment-method>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
