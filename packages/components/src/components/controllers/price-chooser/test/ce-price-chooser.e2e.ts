import { newE2EPage } from '@stencil/core/testing';
import priceResponse from './fixtures/prices.js';

describe('ce-price-choices', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-price-choices></ce-price-choices>');

    const element = await page.find('ce-price-choices');
    expect(element).toHaveClass('hydrated');
  });

  it("Fetches prices and displays prices", async () => {
    const page = await newE2EPage();
    await page.setRequestInterception(true);

    page.on('response', response => {
      if (response.url() === 'http://localhost:3333/') {
        page.on('request', (request) => {
          request.respond({
            body: JSON.stringify(priceResponse)
          })
        });
      }
    });

    await page.setContent('<ce-checkout><ce-price-choices></ce-price-choices></ce-checkout>');
    const element = await page.find('ce-checkout');
    element.setProperty('priceIds', ['a', 'b', 'c']);
    await element.waitForEvent('ceLoaded');

    // renders choices
    const choices = await page.find('ce-choices');
    expect(choices).toBeDefined();

    // should be 3 to start
    let choice = await page.$$('ce-choice');
    expect(choice).toHaveLength(3);

    // should be only 2 since we unset non-currency prices
    await page.waitForSelector("ce-choice.loaded");
    choice = await page.$$('ce-choice');
    expect(choice).toHaveLength(2);
  });
});
