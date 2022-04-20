import { newSpecPage } from '@stencil/core/testing';
import { ScDrawer } from '../sc-drawer';

describe('sc-drawer', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScDrawer],
      html: `<sc-drawer></sc-drawer>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-drawer>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sc-drawer>
    `);
  });
});
