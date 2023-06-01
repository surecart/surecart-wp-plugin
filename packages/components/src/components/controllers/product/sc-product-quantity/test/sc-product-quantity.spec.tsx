import { newSpecPage } from '@stencil/core/testing';
import { ScProductQuantity } from '../sc-product-quantity';

describe('sc-product-quantity', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScProductQuantity],
      html: `<sc-product-quantity></sc-product-quantity>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
