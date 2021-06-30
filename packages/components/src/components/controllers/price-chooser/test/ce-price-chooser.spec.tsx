import { mockFetch, newSpecPage } from '@stencil/core/testing';
import { CePriceChoices } from '../ce-price-choices';

describe('ce-price-choices', () => {
  afterEach(() => {
    mockFetch.reset();
  });

  it('renders', async () => {
    const page = await newSpecPage({
      components: [CePriceChoices],
      html: `<ce-price-choices></ce-price-choices>`,
    });
    expect(page.root).toEqualHtml(`
      <ce-price-choices></ce-price-choices>
    `);
  });
});
