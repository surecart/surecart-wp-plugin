import { getPricesAndProducts } from '../index';

describe('fetching', () => {
  describe('getPricesAndProducts', () => {
    const originalFetch = window.fetch;

    beforeEach(() => {
      window.fetch = jest.fn();
    });

    afterAll(() => {
      window.fetch = originalFetch;
    });

    it('fetches and normalizes prices', async () => {
      window.fetch.mockReturnValue(
        Promise.resolve({
          status: 200,
          json() {
            return Promise.resolve([
              {
                id: 'price_1',
                product: {
                  id: 'product_1',
                },
              },
              {
                id: 'price_2',
                product: {
                  id: 'product_2',
                },
              },
            ]);
          },
        }),
      );

      expect(await getPricesAndProducts({ ids: ['price_1', 'price_2'], active: true })).toMatchObject({
        prices: {
          price_1: {
            id: 'price_1',
            product: 'product_1',
          },
          price_2: {
            id: 'price_2',
            product: 'product_2',
          },
        },
        products: {
          product_1: {
            id: 'product_1',
          },
          product_2: {
            id: 'product_2',
          },
        },
      });
    });
  });
});
