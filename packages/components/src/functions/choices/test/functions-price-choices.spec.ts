import { ProductChoices } from '../../../types';
import { getChoicePrices, getProductsFirstPriceId, getAvailablePricesForProduct } from '../index';

const prices = {
  product1: {
    prices: {
      price1: {
        quantity: 1,
      },
      price2: {
        quantity: 2,
      },
    },
  },
  product2: {
    prices: {
      price3: {
        quantity: 3,
      },
      price4: {
        quantity: 4,
      },
    },
  },
} as ProductChoices;

describe('Price choice functions', () => {
  it('getChoicePrices', () => {
    expect(getChoicePrices(prices)).toEqual([
      { id: 'price1', quantity: 1 },
      { id: 'price2', quantity: 2 },
      { id: 'price3', quantity: 3 },
      { id: 'price4', quantity: 4 },
    ]);
  });
  it('getProductsFirstPriceId', () => {
    expect(getProductsFirstPriceId('product2', prices)).toEqual('price3');
  });
  it('getAvailablePricesForProduct', () => {
    expect(
      getAvailablePricesForProduct(
        {
          id: 'product1',
          prices: [
            { id: 'price2', amount: 1000 },
            { id: 'price3', amount: 2000 },
          ],
        },
        prices,
      ),
    ).toEqual([{ id: 'price2', amount: 1000 }]);

    expect(
      getAvailablePricesForProduct(
        {
          id: 'product1',
          prices: [
            { id: 'priceasdf', amount: 1000 },
            { id: 'priceghhhsh', amount: 2000 },
          ],
        },
        prices,
      ),
    ).toEqual([]);
  });
});
