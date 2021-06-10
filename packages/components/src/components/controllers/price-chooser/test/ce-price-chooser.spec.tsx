import { newSpecPage } from '@stencil/core/testing';
import { CePriceChooser } from '../ce-price-choices';

describe('ce-price-chooser', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CePriceChooser],
      html: `<ce-price-chooser></ce-price-chooser>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-price-chooser>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ce-price-chooser>
    `);
  });
});
