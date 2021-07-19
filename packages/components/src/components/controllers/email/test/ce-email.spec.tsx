import { newSpecPage } from '@stencil/core/testing';
import { CeEmail } from '../ce-email';

describe('ce-email', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeEmail],
      html: `<ce-email></ce-email>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-email>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ce-email>
    `);
  });
});
