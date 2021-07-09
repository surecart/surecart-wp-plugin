import { newSpecPage } from '@stencil/core/testing';
import { CeTotal } from '../ce-total';

describe('ce-total', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeTotal],
      html: `<ce-total></ce-total>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-total>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ce-total>
    `);
  });
});
