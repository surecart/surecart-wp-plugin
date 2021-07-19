import { newSpecPage } from '@stencil/core/testing';
import { CeCard } from '../ce-card';

describe('ce-card', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeCard],
      html: `<ce-card></ce-card>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-card>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ce-card>
    `);
  });
});
