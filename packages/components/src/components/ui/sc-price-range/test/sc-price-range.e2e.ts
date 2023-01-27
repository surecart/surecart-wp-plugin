import { newE2EPage } from '@stencil/core/testing';
import { Price } from '../../../../types';

const TEST_PRICES: Price[] = [
  {
    id: 'afdf624b-c26d-465b-b92d-c883dd6077c5',
    name: 'price 1',
    amount: 2900,
    currency: 'usd',
    recurring: false,
    ad_hoc: false,
    ad_hoc_max_amount: null,
    ad_hoc_min_amount: 0,
    recurring_period_count: 2,
    archived: false,
    created_at: 1674773461,
    updated_at: 1674773461,
    metadata: {},
  },
  {
    id: 'afdf624b-c26d-465b-b92d-c883dd6077c5',
    name: 'price 2',
    amount: 200,
    currency: 'usd',
    recurring: false,
    ad_hoc: false,
    ad_hoc_max_amount: null,
    ad_hoc_min_amount: 0,
    recurring_period_count: 2,
    archived: false,
    created_at: 1674773461,
    updated_at: 1674773461,
    metadata: {},
  },
  {
    id: 'afdf624b-c26d-465b-b92d-c883dd6077c5',
    name: 'price 3',
    amount: 120,
    currency: 'usd',
    recurring: false,
    ad_hoc: false,
    ad_hoc_max_amount: null,
    ad_hoc_min_amount: 0,
    recurring_period_count: 2,
    archived: false,
    created_at: 1674773461,
    updated_at: 1674773461,
    metadata: {},
  },
];

describe('sc-price-range', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-price-range></sc-price-range>');
    await page.$eval(
      'sc-price-range',
      (elem: any, testPrices: string) => {
        elem.prices = JSON.parse(testPrices);
      },
      JSON.stringify(TEST_PRICES),
    );
    await page.waitForChanges();

    const element = await page.find('sc-price-range');
    expect(element).toHaveClass('hydrated');
  });

  it('It should render the correct minimum and maximum price in a range', async function () {
    const page = await newE2EPage();
    await page.setContent('<sc-price-range></sc-price-range>');
    await page.$eval(
      'sc-price-range',
      (elem: any, testPrices: string) => {
        elem.prices = JSON.parse(testPrices);
      },
      JSON.stringify(TEST_PRICES),
    );
    await page.waitForChanges();
    let displayElement = await page.find('sc-price-range >>> .price-range-display');
    expect(displayElement).not.toBeNull();
    let displayText = displayElement.textContent;
    expect(displayText).toBe('$1.20-$29.00');

    await page.$eval('sc-price-range', (elem: any) => {
      elem.prices = [];
    });
    await page.waitForChanges();
    displayElement = await page.find('sc-price-range >>> .price-range-display');
    expect(displayElement).toBeNull();

    await page.$eval(
      'sc-price-range',
      (elem: any, price: string) => {
        elem.prices = [JSON.parse(price)];
      },
      JSON.stringify(TEST_PRICES[0]),
    );
    await page.waitForChanges();
    displayElement = await page.find('sc-price-range >>> .price-range-display');
    displayText = displayElement.textContent;
    expect(displayText).toBe('$29.00');
  });
});
