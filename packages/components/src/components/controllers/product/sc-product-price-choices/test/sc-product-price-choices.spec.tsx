import { newSpecPage } from '@stencil/core/testing';
import { ScProductPriceChoices } from '../sc-product-price-choices';

describe('sc-product-price-choices', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScProductPriceChoices],
      html: `<sc-product-price-choices></sc-product-price-choices>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-product-price-choices>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sc-product-price-choices>
    `);
  });
});
