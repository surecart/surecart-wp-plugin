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

  it('has a loading state', async () => {
    const page = await newSpecPage({
      components: [CePriceChoices],
      template: () => (
        <ce-price-choices
          choice-type="single"
          loading
          products={{
            product_id: {
              prices: {
                price_1: {
                  quantity: 1,
                },
              },
            },
          }}
        ></ce-price-choices>
      ),
    });
    expect(page.root).toMatchSnapshot();
  });

  it('has a busy state', async () => {
    const page = await newSpecPage({
      components: [CePriceChoices],
      template: () => (
        <ce-price-choices
          choice-type="single"
          busy
          products={{
            product_id: {
              prices: {
                price_1: {
                  quantity: 1,
                },
              },
            },
          }}
        ></ce-price-choices>
      ),
    });
    expect(page.root).toMatchSnapshot();
  });

  it('only renders if there are products, productsData and a choice type', async () => {
    const page = await newSpecPage({
      components: [CePriceChoices],
      template: () => (
        <ce-price-choices
          choice-type="single"
          productsData={[
            {
              id: 'product_1',
              name: 'Product',
              description: 'description',
              active: true,
              metadata: {},
              prices: [
                {
                  id: 'price_1',
                  name: 'Price',
                  active: true,
                  metadata: {},
                  amount: 2900,
                  currency: 'eur',
                  recurring: true,
                  recurring_interval: 'month',
                  recurring_interval_count: 1,
                  created_at: 1623879061,
                  updated_at: 1623879061,
                },
              ],
              created_at: 1623879061,
              updated_at: 1623879061,
            },
            {
              id: 'product_2',
              name: 'Product',
              description: 'description',
              active: true,
              metadata: {},
              prices: [
                {
                  id: 'price_3',
                  name: 'Price',
                  active: true,
                  metadata: {},
                  amount: 2900,
                  currency: 'eur',
                  recurring: true,
                  recurring_interval: 'month',
                  recurring_interval_count: 1,
                  created_at: 1623879061,
                  updated_at: 1623879061,
                },
              ],
              created_at: 1623879061,
              updated_at: 1623879061,
            },
          ]}
          products={{
            product_1: {
              prices: {
                price_1: {
                  quantity: 1,
                },
                price_2: {
                  quantity: 1,
                },
              },
            },
            product_2: {
              prices: {
                price_3: {
                  quantity: 1,
                },
                price_4: {
                  quantity: 1,
                },
              },
            },
          }}
        ></ce-price-choices>
      ),
    });
    expect(page.root).toMatchSnapshot();
  });

  it('only renders checkboxes if choice type is "multiple"', async () => {
    const page = await newSpecPage({
      components: [CePriceChoices],
      template: () => (
        <ce-price-choices
          choice-type="multiple"
          productsData={[
            {
              id: 'product_1',
              name: 'Product',
              description: 'description',
              active: true,
              metadata: {},
              prices: [
                {
                  id: 'price_1',
                  name: 'Price',
                  active: true,
                  metadata: {},
                  amount: 2900,
                  currency: 'eur',
                  recurring: true,
                  recurring_interval: 'month',
                  recurring_interval_count: 1,
                  created_at: 1623879061,
                  updated_at: 1623879061,
                },
              ],
              created_at: 1623879061,
              updated_at: 1623879061,
            },
            {
              id: 'product_2',
              name: 'Product',
              description: 'description',
              active: true,
              metadata: {},
              prices: [
                {
                  id: 'price_3',
                  name: 'Price',
                  active: true,
                  metadata: {},
                  amount: 2900,
                  currency: 'eur',
                  recurring: true,
                  recurring_interval: 'month',
                  recurring_interval_count: 1,
                  created_at: 1623879061,
                  updated_at: 1623879061,
                },
              ],
              created_at: 1623879061,
              updated_at: 1623879061,
            },
          ]}
          products={{
            product_1: {
              prices: {
                price_1: {
                  quantity: 1,
                },
                price_2: {
                  quantity: 1,
                },
              },
            },
            product_2: {
              prices: {
                price_3: {
                  quantity: 1,
                },
                price_4: {
                  quantity: 1,
                },
              },
            },
          }}
        ></ce-price-choices>
      ),
    });
    expect(page.root).toMatchSnapshot();
  });

  it('selects the price and product based on the line item', async () => {
    const page = await newSpecPage({
      components: [CePriceChoices],
      template: () => (
        <ce-price-choices
          choice-type="single"
          checkoutSession={{
            line_items: [
              {
                id: 'line_item_1',
                quantity: 2,
                // @ts-ignore
                price: {
                  id: 'price_3',
                },
              },
            ],
          }}
          productsData={[
            {
              id: 'product_1',
              name: 'Product',
              description: 'description',
              active: true,
              metadata: {},
              prices: [
                {
                  id: 'price_1',
                  name: 'Price',
                  active: true,
                  metadata: {},
                  amount: 2900,
                  currency: 'eur',
                  recurring: false,
                  recurring_interval: 'month',
                  recurring_interval_count: 1,
                  created_at: 1623879061,
                  updated_at: 1623879061,
                },
              ],
              created_at: 1623879061,
              updated_at: 1623879061,
            },
            {
              id: 'product_2',
              name: 'Product',
              description: 'description',
              active: true,
              metadata: {},
              prices: [
                {
                  id: 'price_3',
                  name: 'Price',
                  active: true,
                  metadata: {},
                  amount: 2900,
                  currency: 'eur',
                  recurring: false,
                  recurring_interval: 'month',
                  recurring_interval_count: 1,
                  created_at: 1623879061,
                  updated_at: 1623879061,
                },
              ],
              created_at: 1623879061,
              updated_at: 1623879061,
            },
          ]}
          products={{
            product_1: {
              prices: {
                price_1: {
                  quantity: 1,
                },
                price_2: {
                  quantity: 1,
                },
              },
            },
            product_2: {
              prices: {
                price_3: {
                  quantity: 1,
                },
                price_4: {
                  quantity: 1,
                },
              },
            },
          }}
        ></ce-price-choices>
      ),
    });
    expect(page.root).toMatchSnapshot();
  });
});
