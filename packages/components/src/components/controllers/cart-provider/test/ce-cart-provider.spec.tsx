import { newSpecPage } from '@stencil/core/testing';
import { CeCartProvider } from '../ce-cart-provider';

describe('ce-cart-provider', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeCartProvider],
      html: `<ce-cart-provider></ce-cart-provider>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-cart-provider>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ce-cart-provider>
    `);
  });
});
