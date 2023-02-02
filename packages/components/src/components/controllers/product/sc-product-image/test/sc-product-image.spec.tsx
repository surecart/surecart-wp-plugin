import { newSpecPage } from '@stencil/core/testing';
import { ScProductImage } from '../sc-product-image';

describe('sc-product-image', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScProductImage],
      html: `<sc-product-image></sc-product-image>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-product-image>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sc-product-image>
    `);
  });
});
