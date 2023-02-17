import { newSpecPage } from '@stencil/core/testing';
import { ScProductBuyPage } from '../sc-product-buy-page';

describe('sc-product-buy-page', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScProductBuyPage],
      html: `<sc-product-buy-page></sc-product-buy-page>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-product-buy-page>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sc-product-buy-page>
    `);
  });
});
