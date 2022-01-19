import { newSpecPage } from '@stencil/core/testing';
import { CeLineItemTax } from '../ce-line-item-tax';

describe('ce-tax-line-item', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeLineItemTax],
      html: `<ce-tax-line-item></ce-tax-line-item>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-tax-line-item>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ce-tax-line-item>
    `);
  });
});
