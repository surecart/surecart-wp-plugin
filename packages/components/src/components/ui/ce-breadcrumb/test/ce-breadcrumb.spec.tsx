import { newSpecPage } from '@stencil/core/testing';
import { CeBreadcrumb } from '../ce-breadcrumb';

describe('ce-breadcrumb', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CeBreadcrumb],
      html: `<ce-breadcrumb></ce-breadcrumb>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-breadcrumb>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </ce-breadcrumb>
    `);
  });
});
