import { newSpecPage } from '@stencil/core/testing';
import { ScStripePaymentMethodChoice } from '../sc-stripe-payment-method-choice';

describe('sc-stripe-payment-method-choice', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScStripePaymentMethodChoice],
      html: `<sc-stripe-payment-method-choice></sc-stripe-payment-method-choice>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-stripe-payment-method-choice>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sc-stripe-payment-method-choice>
    `);
  });
});
