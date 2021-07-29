import { newE2EPage } from '@stencil/core/testing';
import prices from '../../../../testing/fixtures/prices';
import { setResponses } from '../../../../testing';

describe('ce-price-choices', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-price-choices></ce-price-choices>');
    const element = await page.find('ce-price-choices');
    expect(element).toHaveClass('hydrated');
  });

  it('Fetches and displays prices', async () => {
    const page = await newE2EPage();

    await page.setRequestInterception(true);
    setResponses(
      [
        {
          path: '/price/',
          data: {
            body: JSON.stringify(prices),
          },
        },
      ],
      page,
    );

    await page.setContent('<ce-price-choices loading></ce-price-choices>');
    await page.waitForChanges();
    const element = await page.find('ce-price-choices');

    // give price ids
    element.setProperty('priceIds', ['a', 'b', 'c']);
    await page.waitForChanges();

    // renders choices
    const choices = await page.find('ce-choices');
    expect(choices).toBeDefined();

    // should be 2 prices loaded because we discard EUR currency.
    let choice = await page.$$('ce-choice');
    expect(choice).toHaveLength(2);
  });
});
