import { newSpecPage } from '@stencil/core/testing';
import { ScLineItemBump } from '../sc-line-item-bump';

describe('sc-line-item-bump', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScLineItemBump],
      html: `<sc-line-item-bump></sc-line-item-bump>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-line-item-bump>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sc-line-item-bump>
    `);
  });
});
