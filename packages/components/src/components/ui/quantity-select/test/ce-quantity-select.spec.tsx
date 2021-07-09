import { newSpecPage } from '@stencil/core/testing';
import { CeQuantitySelect } from '../ce-quantity-select';

describe('ce-quantity-select', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeQuantitySelect],
      html: `<ce-quantity-select></ce-quantity-select>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-quantity-select>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ce-quantity-select>
    `);
  });
});
