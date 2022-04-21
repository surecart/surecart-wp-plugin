import { newSpecPage } from '@stencil/core/testing';
import { ScCustomOrderPriceInput } from '../sc-custom-order-price-input';

describe('sc-custom-order-price-input', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScCustomOrderPriceInput],
      html: `<sc-custom-order-price-input></sc-custom-order-price-input>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
