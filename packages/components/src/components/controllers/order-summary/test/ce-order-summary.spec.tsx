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
          <div>
            <ce-line-item>
              Subtotal
              <span slot="price">
                $0.00
              </span>
            </ce-line-item>
            <ce-divider style="--spacing: 20px;"></ce-divider>
            <ce-line-item currency="USD" price="$0.00">
              Total
            </ce-line-item>
          </div>
        </mock:shadow-root>
      </ce-order-summary>
    `);
  });
});
