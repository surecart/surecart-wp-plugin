import { newSpecPage } from '@stencil/core/testing';
import { ScProductPrices } from '../sc-product-prices';

describe('sc-product-prices', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScProductPrices],
      html: `<sc-product-prices></sc-product-prices>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-product-prices>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sc-product-prices>
    `);
  });
});
