import { newSpecPage } from '@stencil/core/testing';
import { ScProductBuyButton } from '../sc-product-buy-button';

describe('sc-product-buy-button', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScProductBuyButton],
      html: `<sc-product-buy-button></sc-product-buy-button>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-product-buy-button>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sc-product-buy-button>
    `);
  });
});
