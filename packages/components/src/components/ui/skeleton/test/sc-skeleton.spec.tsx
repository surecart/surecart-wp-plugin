import { newSpecPage } from '@stencil/core/testing';
import { CESkeleton } from '../sc-skeleton';

describe('sc-skeleton', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CESkeleton],
      html: `<sc-skeleton></sc-skeleton>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-skeleton>
        <mock:shadow-root>
          <div aria-busy="true" aria-live="polite" class="skeleton skeleton--sheen" part="base">
            <div class="skeleton__indicator" part="indicator"></div>
          </div>
        </mock:shadow-root>
      </sc-skeleton>
    `);
  });
});
