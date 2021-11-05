import { newSpecPage } from '@stencil/core/testing';
import { CeSectionTitle } from '../ce-text';

describe('ce-section-title', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeSectionTitle],
      html: `<ce-section-title></ce-section-title>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-section-title>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ce-section-title>
    `);
  });
});
