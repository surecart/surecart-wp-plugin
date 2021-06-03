import { newSpecPage } from '@stencil/core/testing';
import { CESkeleton } from '../ce-skeleton';

describe('ce-skeleton', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CESkeleton],
      html: `<ce-skeleton></ce-skeleton>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-skeleton>
        <mock:shadow-root>
          <div aria-busy="true" aria-live="polite" class="skeleton skeleton--sheen" part="base">
            <div class="skeleton__indicator" part="indicator"></div>
          </div>
        </mock:shadow-root>
      </ce-skeleton>
    `);
  });
});
