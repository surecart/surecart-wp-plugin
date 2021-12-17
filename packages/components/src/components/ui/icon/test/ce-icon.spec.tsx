import { newSpecPage } from '@stencil/core/testing';
import { CeIcon } from '../ce-icon';

describe('ce-icon', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeIcon],
      html: `<ce-icon></ce-icon>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-icon>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ce-icon>
    `);
  });
});
