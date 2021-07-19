import { newSpecPage } from '@stencil/core/testing';
import { CeProductLineItem } from '../ce-product-line-item';

describe('ce-product-line-item', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeProductLineItem],
      html: `<ce-product-line-item></ce-product-line-item>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-product-line-item>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ce-product-line-item>
    `);
  });
});
