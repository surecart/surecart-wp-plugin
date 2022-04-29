import { newSpecPage } from '@stencil/core/testing';
import { ScOrderStatusProvider } from '../sc-order-status-provider';

describe('sc-order-status-provider', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScOrderStatusProvider],
      html: `<sc-order-status-provider></sc-order-status-provider>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-order-status-provider>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sc-order-status-provider>
    `);
  });
});
