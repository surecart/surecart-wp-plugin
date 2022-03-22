import { newSpecPage } from '@stencil/core/testing';
import { ScPriceChoice } from '../sc-price-choice';

describe('sc-price-choice', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScPriceChoice],
      html: `<sc-price-choice></sc-price-choice>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
