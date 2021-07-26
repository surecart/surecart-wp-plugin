import { newE2EPage } from '@stencil/core/testing';
import prices from './fixtures/prices';

describe('ce-price-choices', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-price-choices></ce-price-choices>');
    const element = await page.find('ce-price-choices');
    expect(element).toHaveClass('hydrated');
  });

  it('Displays prices', async () => {
    const page = await newE2EPage();

    await page.setContent('<ce-price-choices loading></ce-price-choices>');
    await page.waitForChanges();
    const element = await page.find('ce-price-choices');

    // give price ids
    element.setProperty('priceIds', ['a', 'b', 'c']);
    await page.waitForChanges();

    // loading state
    const skeleton = await page.$$('ce-skeleton');
    expect(skeleton).toBeDefined();
    expect(skeleton).toHaveLength(12);

    element.setProperty('prices', prices);
    await page.waitForChanges();

    // renders choices
    const choices = await page.find('ce-choices');
    expect(choices).toBeDefined();

    // should be 3 prices loaded
    let choice = await page.$$('ce-choice');
    expect(choice).toHaveLength(3);
  });
});
