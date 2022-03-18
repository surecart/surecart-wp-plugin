import { newSpecPage } from '@stencil/core/testing';
import { CePriceChoices } from '../ce-price-choices';
import { h } from '@stencil/core';

describe('ce-price-choices', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CePriceChoices],
      template: () => <ce-price-choices></ce-price-choices>,
    });
    expect(page.root).toMatchSnapshot();
  });
});
