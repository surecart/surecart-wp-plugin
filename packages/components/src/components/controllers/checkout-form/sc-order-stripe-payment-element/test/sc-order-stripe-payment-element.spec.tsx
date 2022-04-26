import { newSpecPage } from '@stencil/core/testing';
import { ScOrderStripePaymentElement } from '../sc-order-stripe-payment-element';

describe('sc-order-stripe-payment-element', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScOrderStripePaymentElement],
      html: `<sc-order-stripe-payment-element></sc-order-stripe-payment-element>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
