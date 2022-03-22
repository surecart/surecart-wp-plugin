import { newSpecPage } from '@stencil/core/testing';
import { ScPriceChoices } from '../sc-price-choices';
import { h } from '@stencil/core';

describe('sc-price-choices', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScPriceChoices],
      template: () => <sc-price-choices></sc-price-choices>,
    });
    expect(page.root).toMatchSnapshot();
  });
});
