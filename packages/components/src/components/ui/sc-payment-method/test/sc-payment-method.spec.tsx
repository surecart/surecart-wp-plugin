import { newSpecPage } from '@stencil/core/testing';
import { ScPaymentMethod } from '../sc-payment-method';

describe('sc-payment-method', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScPaymentMethod],
      html: `<sc-payment-method></sc-payment-method>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-payment-method>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sc-payment-method>
    `);
  });
});
