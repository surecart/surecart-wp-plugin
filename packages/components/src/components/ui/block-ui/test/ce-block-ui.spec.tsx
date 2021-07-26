import { newSpecPage } from '@stencil/core/testing';
import { CeBlockUi } from '../ce-block-ui';

describe('ce-block-ui', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeBlockUi],
      html: `<ce-block-ui></ce-block-ui>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-block-ui>
        <mock:shadow-root>
          <div class="overlay">
            <ce-spinner></ce-spinner>
          </div>
        </mock:shadow-root>
      </ce-block-ui>
    `);
  });
});
