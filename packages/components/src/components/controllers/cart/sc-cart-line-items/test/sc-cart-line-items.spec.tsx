import { newSpecPage } from '@stencil/core/testing';
import { ScCartLineItems } from '../sc-cart-line-items';

describe('sc-cart-line-items', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScCartLineItems],
      html: `<sc-cart-line-items></sc-cart-line-items>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-cart-line-items>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sc-cart-line-items>
    `);
  });
});
