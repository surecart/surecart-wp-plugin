import { newSpecPage } from '@stencil/core/testing';
import { CePriceInput } from '../ce-price-input';

describe('ce-price-input', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CePriceInput],
      html: `<ce-price-input></ce-price-input>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-price-input>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ce-price-input>
    `);
  });
});
