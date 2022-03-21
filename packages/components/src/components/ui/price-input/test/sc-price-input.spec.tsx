import { newSpecPage } from '@stencil/core/testing';
import { ScPriceInput } from '../sc-price-input';

describe('sc-price-input', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScPriceInput],
      html: `<sc-price-input></sc-price-input>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
