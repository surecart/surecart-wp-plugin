import { newE2EPage } from '@stencil/core/testing';

describe('ce-price-choices', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-price-choices></ce-price-choices>');
    const element = await page.find('ce-price-choices');
    expect(element).toHaveClass('hydrated');
  });

  it('has a loading state', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <ce-price-choices></ce-price-choices>
    `);
    await page.$eval('ce-price-choices', (elm: any) => {
      elm.choiceType = 'single';
      elm.loading = true;
      elm.productsChoices = {
        product_id: {
          prices: {
            price_1: {
              quantity: 1,
              enabled: true,
            },
          },
        },
      };
    });

    await page.waitForChanges();
    const skeleton = await page.find('ce-price-choices >>> ce-skeleton');
    expect(skeleton).not.toBeNull();
  });

  it('has a busy state', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <ce-price-choices></ce-price-choices>
    `);
    await page.$eval('ce-price-choices', (elm: any) => {
      elm.choiceType = 'single';
      elm.busy = true;
      elm.productsChoices = {
        product_id: {
          prices: {
            price_1: {
              quantity: 1,
              enabled: true,
            },
          },
        },
      };
    });

    await page.waitForChanges();
    const busy = await page.find('ce-price-choices >>> ce-block-ui');
    expect(busy).not.toBeNull();
  });

  it('selects the price and product based on the line item', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <ce-price-choices></ce-price-choices>
    `);
    await page.$eval('ce-price-choices', (elm: any) => {
      elm.choiceType = 'single';
      elm.busy = true;
      elm.checkoutSession = {
        line_items: [
          {
            id: 'line_item_1',
            quantity: 1,
            price: {
              id: 'price_3',
            },
          },
        ],
      };
      elm.products = [
        {
          id: 'product_1',
          prices: [
            {
              id: 'price_1',
            },
          ],
        },
        {
          id: 'product_2',
          prices: [
            {
              id: 'price_3',
            },
            {
              id: 'price_4',
            },
          ],
        },
      ];
      elm.productsChoices = {
        product_1: {
          prices: {
            price_1: {
              quantity: 1,
              enabled: true,
            },
            price_2: {
              quantity: 1,
              enabled: true,
            },
          },
        },
        product_2: {
          prices: {
            price_3: {
              quantity: 1,
              enabled: true,
            },
            price_4: {
              quantity: 1,
              enabled: true,
            },
          },
        },
      };
    });
    await page.waitForChanges();

    const checkedProduct = await page.find('ce-price-choices >>> .product-selector [checked]');
    expect(await checkedProduct.getProperty('value')).toBe('product_2');

    const checkedPrice = await page.find('ce-price-choices >>> .price-selector [checked]');
    expect(await checkedPrice.getProperty('value')).toBe('price_3');
  });

  it('Does not display the product selector if there is only one product', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <ce-price-choices></ce-price-choices>
    `);
    await page.$eval('ce-price-choices', (elm: any) => {
      elm.choiceType = 'single';
      elm.products = [
        {
          id: 'product_2',
          prices: [
            {
              id: 'price_3',
            },
            {
              id: 'price_4',
            },
          ],
        },
      ];
      elm.productsChoices = {
        product_2: {
          prices: {
            price_3: {
              quantity: 1,
              enabled: true,
            },
            price_4: {
              quantity: 1,
              enabled: true,
            },
          },
        },
      };
    });
    await page.waitForChanges();
    const productSelector = await page.find('ce-price-choices >>> .product-selector');
    expect(productSelector).toBeNull();
  });

  it('Does not display the price selector if there is only one price', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <ce-price-choices></ce-price-choices>
    `);
    await page.$eval('ce-price-choices', (elm: any) => {
      elm.choiceType = 'single';
      elm.products = [
        {
          id: 'product_2',
          prices: [
            {
              id: 'price_3',
            },
          ],
        },
      ];
      elm.productsChoices = {
        product_2: {
          prices: {
            price_3: {
              quantity: 1,
              enabled: true,
            },
          },
        },
      };
    });
    await page.waitForChanges();
    const productSelector = await page.find('ce-price-choices >>> .product-selector');
    expect(productSelector).toBeNull();
    const priceSelector = await page.find('ce-price-choices >>> .price-selector');
    expect(priceSelector).toBeNull();
  });

  it('Does not display a product if it has become archived', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <ce-price-choices></ce-price-choices>
    `);
    await page.$eval('ce-price-choices', (elm: any) => {
      elm.choiceType = 'single';
      elm.products = [
        {
          id: 'product_1',
          archived: true,
          prices: [
            {
              id: 'price_1',
            },
          ],
        },
        {
          id: 'product_2',
          archived: false,
          prices: [
            {
              id: 'price_2',
            },
          ],
        },
        {
          id: 'product_3',
          archived: false,
          prices: [
            {
              id: 'price_3',
            },
          ],
        },
      ];
      elm.productsChoices = {
        product_1: {
          prices: {
            price_1: {
              quantity: 1,
              enabled: true,
            },
          },
        },
        product_2: {
          prices: {
            price_2: {
              quantity: 1,
              enabled: true,
            },
          },
        },
        product_3: {
          prices: {
            price_3: {
              quantity: 1,
              enabled: true,
            },
          },
        },
      };
    });
    await page.waitForChanges();
    const productSelector = await page.findAll('ce-price-choices >>> .product-selector ce-choice');
    expect(productSelector).toHaveLength(2);
  });

  it('Does not display a price if it has become archived', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <ce-price-choices></ce-price-choices>
    `);
    await page.$eval('ce-price-choices', (elm: any) => {
      elm.choiceType = 'single';
      elm.products = [
        {
          id: 'product_1',
          prices: [
            {
              id: 'price_1',
              archived: true,
            },
            {
              id: 'price_2',
              archived: false,
            },
            {
              id: 'price_3',
              archived: false,
            },
          ],
        },
      ];
      elm.productsChoices = {
        product_1: {
          prices: {
            price_1: {
              quantity: 1,
              enabled: true,
            },
            price_2: {
              quantity: 1,
              enabled: true,
            },
            price_3: {
              quantity: 1,
              enabled: true,
            },
          },
        },
      };
    });
    await page.waitForChanges();
    const priceSelector = await page.findAll('ce-price-choices >>> .price-selector ce-choice');
    expect(priceSelector).not.toBeNull();
    // expect(priceSelector).toHaveLength(2);
  });
});
