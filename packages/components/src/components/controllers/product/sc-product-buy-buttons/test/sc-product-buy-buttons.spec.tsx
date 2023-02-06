import { newSpecPage } from '@stencil/core/testing';
import { ScProductBuyButtons } from '../sc-product-buy-buttons';

describe('sc-product-buy-buttons', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScProductBuyButtons],
      html: `<sc-product-buy-buttons></sc-product-buy-buttons>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-product-buy-buttons>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sc-product-buy-buttons>
    `);
  });
});
