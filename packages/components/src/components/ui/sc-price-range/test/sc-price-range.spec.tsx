import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { Price } from '../../../../types';
import { ScPriceRange } from '../sc-price-range';

describe('sc-price-range', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScPriceRange],
      html: `<sc-price-range></sc-price-range>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('It should render the correct minimum and maximum price in a range', async function () {
    const page = await newSpecPage({
      components: [ScPriceRange],
      template: () => <sc-price-range prices={[
        {
          amount: 2900,
          currency: 'usd',
        },
        {
          amount: 200,
          currency: 'usd',
        },
        {
          amount: 120,
          currency: 'usd',
        },
      ] as Price[]}></sc-price-range>
    });
    expect(page.root).toMatchSnapshot();
  });

  it('It should render one price if only one is passed', async function () {
    const page = await newSpecPage({
      components: [ScPriceRange],
      template: () => <sc-price-range prices={[
        {
          amount: 2900,
          currency: 'usd',
        },
      ] as Price[]}></sc-price-range>
    });
    expect(page.root).toMatchSnapshot();
  });
});
