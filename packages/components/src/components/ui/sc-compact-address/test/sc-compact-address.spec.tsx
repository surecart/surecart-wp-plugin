import { newSpecPage } from '@stencil/core/testing';
import { ScCompactAddress } from '../sc-compact-address';

describe('sc-compact-address', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScCompactAddress],
      html: `<sc-compact-address></sc-compact-address>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-compact-address>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sc-compact-address>
    `);
  });
});
