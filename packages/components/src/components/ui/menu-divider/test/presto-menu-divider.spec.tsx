import { newSpecPage } from '@stencil/core/testing';
import { PrestoMenuDivider } from '../presto-menu-divider';

describe('presto-menu-divider', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PrestoMenuDivider],
      html: `<presto-menu-divider></presto-menu-divider>`,
    });
    expect(page.root).toEqualHtml(`
      <presto-menu-divider>
        <mock:shadow-root>
          <div aria-hidden="true" class="menu-divider" part="base" role="separator"></div>
        </mock:shadow-root>
      </presto-menu-divider>
    `);
  });
});
