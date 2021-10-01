import { newSpecPage } from '@stencil/core/testing';
import { CePriceChoices } from '../ce-price-choices';
import { getAvailablePricesForProduct, getAvailablePriceIds } from '../functions';
import { Product, RecursivePartial } from '../../../../types';

describe('ce-price-choices', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CePriceChoices],
      html: `<ce-price-choices></ce-price-choices>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});

describe('functions', () => {
  it('getAvailablePriceIds', () => {
    expect(
      getAvailablePriceIds({
        product_id: {
          prices: ['price_1', 'price_2'],
        },
        product_id_2: {
          prices: ['price_3', 'price_4'],
        },
      }),
    ).toMatchObject(['price_1', 'price_2', 'price_3', 'price_4']);
  });

  it('getAvailablePricesForProduct', () => {
    const product: RecursivePartial<Product> = {
      prices: [
        {
          id: 'price_1',
        },
        {
          id: 'price_2',
        },
        {
          id: 'price_3',
        },
      ],
    };

    const choices = getAvailablePricesForProduct(product, {
      product_id: {
        prices: ['price_1', 'price_3'],
      },
    });
    expect(choices).toMatchObject([{ id: 'price_1' }, { id: 'price_3' }]);
  });
});
