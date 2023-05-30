import { newSpecPage } from '@stencil/core/testing';
import { ScProductQuantity } from '../sc-product-quantity';

describe('sc-product-quantity', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScProductQuantity],
      html: `<sc-product-quantity></sc-product-quantity>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-product-quantity>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sc-product-quantity>
    `);
  });
});
