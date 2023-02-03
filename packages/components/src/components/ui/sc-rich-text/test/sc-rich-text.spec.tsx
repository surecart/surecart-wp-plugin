import { newSpecPage } from '@stencil/core/testing';
import { ScRichText } from '../sc-rich-text';

describe('sc-rich-text', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScRichText],
      html: `<sc-rich-text></sc-rich-text>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-rich-text>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sc-rich-text>
    `);
  });
});
