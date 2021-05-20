import { newSpecPage } from '@stencil/core/testing';
import { PrestoCheckout } from '../presto-checkout';

describe('presto-checkout', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PrestoCheckout],
      html: `<presto-checkout>test</presto-checkout>`,
    });
    expect(page.root).toEqualHtml(`
      <presto-checkout>
        <stencil-provider>
          <div class="presto-checkout-container">
            test
          </div>
        </stencil-provider>
      </presto-checkout>
    `);
  });
});
