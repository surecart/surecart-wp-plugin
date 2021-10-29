import { newSpecPage } from '@stencil/core/testing';
import { CePriceSelector } from '../ce-price-selector';

describe('ce-price-selector', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CePriceSelector],
      html: `<ce-price-selector></ce-price-selector>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-price-selector>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ce-price-selector>
    `);
  });
});
