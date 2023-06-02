import { newSpecPage } from '@stencil/core/testing';
import { ScProductText } from '../sc-product-text';

describe('sc-product-text', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScProductText],
      html: `<sc-product-text></sc-product-text>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-product-text>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sc-product-text>
    `);
  });
});
