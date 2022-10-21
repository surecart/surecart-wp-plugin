import { newSpecPage } from '@stencil/core/testing';
import { ScPaymentMethodChoice } from '../sc-payment-method-choice';

describe('sc-payment-method-choice', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScPaymentMethodChoice],
      html: `<sc-payment-method-choice></sc-payment-method-choice>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-payment-method-choice>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sc-payment-method-choice>
    `);
  });
});
