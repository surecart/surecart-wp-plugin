import { newSpecPage } from '@stencil/core/testing';
import { ScOrderManualInstructions } from '../sc-order-manual-instructions';

describe('sc-order-manual-instructions', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScOrderManualInstructions],
      html: `<sc-order-manual-instructions></sc-order-manual-instructions>`,
    });
    expect(page.root).toEqualHtml(`
      <sc-order-manual-instructions>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </sc-order-manual-instructions>
    `);
  });
});
