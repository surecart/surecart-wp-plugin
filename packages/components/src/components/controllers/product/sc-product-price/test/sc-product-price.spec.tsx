import { newSpecPage } from '@stencil/core/testing';
import { ScProductPrice } from '../sc-product-price';

describe('sc-product-prices', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScProductPrice],
      html: `<sc-product-price></sc-product-price>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
