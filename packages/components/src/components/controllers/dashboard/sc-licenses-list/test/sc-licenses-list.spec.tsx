import { newSpecPage } from '@stencil/core/testing';
import { ScLicensesList } from '../sc-licenses-list';

describe('sc-licenses-list', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScLicensesList],
      html: `<sc-licenses-list></sc-licenses-list>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-licenses-list>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sc-licenses-list>
    `);
  });
});
