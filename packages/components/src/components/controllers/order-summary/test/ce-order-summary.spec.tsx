import { newSpecPage } from '@stencil/core/testing';
import { CEOrderSummary } from '../ce-order-summary';

describe('ce-order-summary', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CEOrderSummary],
      html: `<ce-order-summary></ce-order-summary>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-order-summary>
        <mock:shadow-root>
          <div class="summary">
            <slot></slot>
          </div>
        </mock:shadow-root>
      </ce-order-summary>
    `);
  });
});
