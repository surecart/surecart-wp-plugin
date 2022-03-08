import { newSpecPage } from '@stencil/core/testing';
import { CeColumn } from '../ce-column';

describe('ce-column', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeColumn],
      html: `<ce-column></ce-column>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-column>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ce-column>
    `);
  });
});
