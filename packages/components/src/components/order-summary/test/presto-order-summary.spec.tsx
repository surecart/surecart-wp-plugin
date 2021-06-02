import { newSpecPage } from '@stencil/core/testing';
import { PrestoOrderSummary } from '../presto-order-summary';

describe('presto-order-summary', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PrestoOrderSummary],
      html: `<presto-order-summary></presto-order-summary>`,
    });
    expect(page.root).toEqualHtml(`
      <presto-order-summary>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </presto-order-summary>
    `);
  });
});
