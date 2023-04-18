import { newSpecPage } from '@stencil/core/testing';
import { ScProduct } from '../sc-product';

describe('sc-product', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScProduct],
      html: `<sc-product></sc-product>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-product>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sc-product>
    `);
  });
});
