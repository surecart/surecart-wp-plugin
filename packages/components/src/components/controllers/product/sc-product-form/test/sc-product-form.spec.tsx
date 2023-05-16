import { newSpecPage } from '@stencil/core/testing';
import { ScProductForm } from '../sc-product-form';

describe('sc-product-form', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScProductForm],
      html: `<sc-product-form></sc-product-form>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-product-form>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sc-product-form>
    `);
  });
});
