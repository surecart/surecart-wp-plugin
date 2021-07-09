import { newSpecPage } from '@stencil/core/testing';
import { CeLineItems } from '../ce-line-items';

describe('ce-line-items', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeLineItems],
      html: `<ce-line-items></ce-line-items>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-line-items>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ce-line-items>
    `);
  });
});
