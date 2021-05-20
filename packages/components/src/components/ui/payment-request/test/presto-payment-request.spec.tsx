import { newSpecPage } from '@stencil/core/testing';
import { PrestoStripePaymentRequest } from '../presto-stripe-payment-request';

describe('presto-stripe-payment-request', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PrestoStripePaymentRequest],
      html: `<presto-stripe-payment-request></presto-stripe-payment-request>`,
    });
    expect(page.root).toEqualHtml(`
      <presto-stripe-payment-request>
        <div class="request">
          <div class="button" part="button"></div>
          <div class="or" part="or"></div>
        </div>
      </presto-stripe-payment-request>
    `);
  });
});
