import { newSpecPage } from '@stencil/core/testing';
import { CeCcLogo } from '../ce-cc-logo';

describe('ce-cc-logo', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeCcLogo],
      html: `<ce-cc-logo></ce-cc-logo>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-cc-logo>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ce-cc-logo>
    `);
  });
});
