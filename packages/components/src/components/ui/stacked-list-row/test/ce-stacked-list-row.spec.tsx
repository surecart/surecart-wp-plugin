import { newSpecPage } from '@stencil/core/testing';
import { CeStackedListRow } from '../ce-stacked-list-row';

describe('ce-stacked-list-row', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeStackedListRow],
      html: `<ce-stacked-list-row></ce-stacked-list-row>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-stacked-list-row>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ce-stacked-list-row>
    `);
  });
});
