import { newSpecPage } from '@stencil/core/testing';
import { ScOrderBump } from '../sc-order-bump';

describe('sc-order-bump', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScOrderBump],
      html: `<sc-order-bump></sc-order-bump>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-order-bump>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sc-order-bump>
    `);
  });
});
