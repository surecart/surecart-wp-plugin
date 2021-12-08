import { newSpecPage } from '@stencil/core/testing';
import { CeCard } from '../ce-session-detail';

describe('ce-card', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeCard],
      html: `<ce-card></ce-card>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-card>
        <mock:shadow-root>
          <div class="card">
            <slot></slot>
          </div>
        </mock:shadow-root>
      </ce-card>
    `);
  });
});
