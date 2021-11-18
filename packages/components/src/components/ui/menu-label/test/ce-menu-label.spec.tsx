import { newSpecPage } from '@stencil/core/testing';
import { CeMenuLabel } from '../ce-menu-label';

describe('ce-menu-label', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeMenuLabel],
      html: `<ce-menu-label></ce-menu-label>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-menu-label>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ce-menu-label>
    `);
  });
});
