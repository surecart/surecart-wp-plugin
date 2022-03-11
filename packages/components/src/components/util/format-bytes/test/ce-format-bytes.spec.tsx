import { newSpecPage } from '@stencil/core/testing';
import { CeFormatBytes } from '../ce-format-bytes';

describe('ce-format-bytes', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeFormatBytes],
      html: `<ce-format-bytes></ce-format-bytes>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-format-bytes>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ce-format-bytes>
    `);
  });
});
