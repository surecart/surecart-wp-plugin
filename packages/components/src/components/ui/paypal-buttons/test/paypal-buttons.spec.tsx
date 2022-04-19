import { newSpecPage } from '@stencil/core/testing';
import { PaypalButtons } from '../paypal-buttons';

describe('paypal-buttons', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PaypalButtons],
      html: `<paypal-buttons></paypal-buttons>`,
    });
    expect(page.root).toEqualHtml(`
      <paypal-buttons>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </paypal-buttons>
    `);
  });
});
