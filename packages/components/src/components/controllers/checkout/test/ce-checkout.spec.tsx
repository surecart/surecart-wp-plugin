import { mockFetch, newSpecPage } from '@stencil/core/testing';
import { CECheckout } from '../ce-checkout';
import priceResponse from './fixtures/prices.js';

describe('ce-checkout', () => {
  afterEach(() => {
    mockFetch.reset();
  });

  it('renders', async () => {
    mockFetch.json(priceResponse);

    const page = await newSpecPage({
      components: [CECheckout],
      html: `<ce-checkout></ce-checkout>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-checkout>
        <div class="ce-checkout-container"></div>
      </ce-checkout>
    `);
  });
});
