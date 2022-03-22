import { newSpecPage } from '@stencil/core/testing';
import { ScCheckout } from '../sc-checkout';

describe('sc-checkout', () => {
  const originalFetch = window.fetch;

  beforeEach(() => {
    window.fetch = jest.fn();
  });

  afterAll(() => {
    window.fetch = originalFetch;
  });

  it('renders', async () => {
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
    const page = await newSpecPage({
      components: [ScCheckout],
      html: `<sc-checkout></sc-checkout>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
