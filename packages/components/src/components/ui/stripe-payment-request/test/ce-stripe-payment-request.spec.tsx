import { newSpecPage } from '@stencil/core/testing';
import { CEStripePaymentRequest } from '../ce-stripe-payment-request';

describe('ce-stripe-payment-request', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CEStripePaymentRequest],
      html: `<ce-stripe-payment-request></ce-stripe-payment-request>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-stripe-payment-request>
        <div class="request">
          <div class="ce-payment-request-button" part="button"></div>
          <div class="or" part="or"></div>
        </div>
      </ce-stripe-payment-request>
    `);
  });
});
