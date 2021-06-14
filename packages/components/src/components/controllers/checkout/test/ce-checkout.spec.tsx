import { newSpecPage } from '@stencil/core/testing';
import { CECheckout } from '../ce-checkout';

describe('ce-checkout', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CECheckout],
      html: `<ce-checkout>test</ce-checkout>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-checkout>
        <div class="ce-checkout-container">
          <ce-provider>
            test
          </ce-provider>
        </div>
      </ce-checkout>
    `);
  });
});
