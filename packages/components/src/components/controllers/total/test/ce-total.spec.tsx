import { newSpecPage } from '@stencil/core/testing';
import { CeTotal } from '../ce-total';

describe('ce-total', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeTotal],
      html: `<ce-total></ce-total>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-total>
        <mock:shadow-root>
          <ce-line-item>
            <ce-skeleton slot="title" style="width: 120px; display: inline-block;"></ce-skeleton>
            <ce-skeleton slot="price" style="width: 70px; display: inline-block; --border-radius: 6px;"></ce-skeleton>
          </ce-line-item>
        </mock:shadow-root>
      </ce-total>
    `);
  });
});
