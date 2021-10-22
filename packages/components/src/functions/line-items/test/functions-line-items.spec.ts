import { calculateInitialLineItems, getLineItemPriceIds } from '../index';

const prices = {
  product1: {
    prices: {
      price1: {
        quantity: 1,
        enabled: true,
      },
      price2: {
        quantity: 2,
        enabled: true,
      },
    },
  },
  product2: {
    prices: {
      price3: {
        quantity: 3,
        enabled: true,
      },
      price4: {
        quantity: 4,
        enabled: true,
      },
    },
  },
};

const lineItems = [
  {
    price: {
      id: 'price1',
    },
  },
  {
    price: {
      id: 'price2',
    },
  },
];

describe('Line items functions', () => {
  it('calculateInitialLineItems', () => {
    expect(calculateInitialLineItems(prices, 'all')).toEqual([
      { price_id: 'price1', quantity: 1 },
      { price_id: 'price2', quantity: 2 },
      { price_id: 'price3', quantity: 3 },
      { price_id: 'price4', quantity: 4 },
    ]);
    expect(calculateInitialLineItems(prices, 'multiple')).toEqual([{ price_id: 'price1', quantity: 1 }]);
    expect(calculateInitialLineItems(prices, 'single')).toEqual([{ price_id: 'price1', quantity: 1 }]);
  });

  it('getLineItemPriceIds', () => {
    expect(getLineItemPriceIds(lineItems)).toEqual(['price1', 'price2']);
  });
});
