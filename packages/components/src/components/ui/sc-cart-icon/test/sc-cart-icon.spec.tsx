import { newSpecPage } from '@stencil/core/testing';
import { ScCartIcon } from '../sc-cart-icon';

describe('sc-cart-icon', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScCartIcon],
      html: `<sc-cart-icon></sc-cart-icon>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-cart-icon>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sc-cart-icon>
    `);
  });
});
