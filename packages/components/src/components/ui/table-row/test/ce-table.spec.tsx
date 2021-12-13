import { newSpecPage } from '@stencil/core/testing';
import { CeTable } from '../ce-table-row';

describe('ce-table', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeTable],
      html: `<ce-table></ce-table>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-table>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ce-table>
    `);
  });
});
