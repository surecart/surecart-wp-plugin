import { newSpecPage } from '@stencil/core/testing';
import { ScToggle } from '../sc-toggle';

describe('sc-toggle', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScToggle],
      html: `<sc-toggle></sc-toggle>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-toggle>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sc-toggle>
    `);
  });
});
