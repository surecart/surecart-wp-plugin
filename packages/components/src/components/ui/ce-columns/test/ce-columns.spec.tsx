import { newSpecPage } from '@stencil/core/testing';
import { CeColumns } from '../ce-columns';

describe('ce-columns', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeColumns],
      html: `<ce-columns></ce-columns>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-columns>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ce-columns>
    `);
  });
});
