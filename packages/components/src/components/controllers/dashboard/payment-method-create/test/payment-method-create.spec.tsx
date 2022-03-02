import { newSpecPage } from '@stencil/core/testing';
import { PaymentMethodCreate } from '../payment-method-create';

describe('payment-method-create', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PaymentMethodCreate],
      html: `<payment-method-create></payment-method-create>`,
    });
    expect(page.root).toEqualHtml(`
      <payment-method-create>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </payment-method-create>
    `);
  });
});
