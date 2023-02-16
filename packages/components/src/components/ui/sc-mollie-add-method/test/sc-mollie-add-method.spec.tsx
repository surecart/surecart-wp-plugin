import { newSpecPage } from '@stencil/core/testing';
import { ScMollieAddMethod } from '../sc-mollie-add-method';

describe('sc-mollie-add-method', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScMollieAddMethod],
      html: `<sc-mollie-add-method></sc-mollie-add-method>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-mollie-add-method>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sc-mollie-add-method>
    `);
  });
});
