import { newSpecPage } from '@stencil/core/testing';
import { ScPurchase } from '../sc-purchase';

describe('sc-purchase', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScPurchase],
      html: `<sc-purchase></sc-purchase>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-purchase>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sc-purchase>
    `);
  });
});
