import { newSpecPage } from '@stencil/core/testing';
import { ScPriceRange } from '../sc-price-range';

describe('sc-price-range', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScPriceRange],
      html: `<sc-price-range></sc-price-range>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
