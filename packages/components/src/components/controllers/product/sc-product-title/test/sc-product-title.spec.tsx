import { newSpecPage } from '@stencil/core/testing';
import { ScProductTitle } from '../sc-product-title';

describe('sc-product-title', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScProductTitle],
      html: `<sc-product-title></sc-product-title>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-product-title>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sc-product-title>
    `);
  });
});
