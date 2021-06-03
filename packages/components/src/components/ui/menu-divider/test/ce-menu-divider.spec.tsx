import { newSpecPage } from '@stencil/core/testing';
import { CEMenuDivider } from '../ce-menu-divider';

describe('ce-menu-divider', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CEMenuDivider],
      html: `<ce-menu-divider></ce-menu-divider>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-menu-divider>
        <mock:shadow-root>
          <div aria-hidden="true" class="menu-divider" part="base" role="separator"></div>
        </mock:shadow-root>
      </ce-menu-divider>
    `);
  });
});
