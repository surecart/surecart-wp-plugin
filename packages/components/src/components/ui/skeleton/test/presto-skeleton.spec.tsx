import { newSpecPage } from '@stencil/core/testing';
import { PrestoSkeleton } from '../presto-skeleton';

describe('presto-skeleton', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PrestoSkeleton],
      html: `<presto-skeleton></presto-skeleton>`,
    });
    expect(page.root).toEqualHtml(`
      <presto-skeleton>
        <mock:shadow-root>
          <div aria-busy="true" aria-live="polite" class="skeleton skeleton--sheen" part="base">
            <div class="skeleton__indicator" part="indicator"></div>
          </div>
        </mock:shadow-root>
      </presto-skeleton>
    `);
  });
});
